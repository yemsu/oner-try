<template>
  <section :class="['box-search', {'compact':size === 'small'}, size]">
    <h2 class="ir-hidden">검색</h2>
    <div :class="[
      'wrap-search',
      {'compact': size === 'small' && !isSearching}
    ]">
      <base-input
        usage="search"
        :size="size"
        :placeholder="placeholder"
        :value="inputValue"
        :isCompactMode="size === 'small' && !isSearching"
        :isActive="isSearching && !!matchingData.data"
        :focusOnMounted="size === 'big' && true"
        @onUpdateInput="updateInput"
        @onFocusInput="focusInput"
        @onBlurInput="blurInput"
        @onEnter="onSearch(useAutoEnter ? matchDataSliced[0] : inputValue)"
      />
      
      <search-box-skeleton 
        v-if="!rankingList && isSearching"
        :is-item="isItem"
      />
      <section
        v-else-if="rankingList && isSearching && matchingData.data"
        class="items-match"
      >
        <h2 v-if="showRankingList" class="title-list"> 검색 순위 <span>TOP 10</span></h2>
        <div
          v-for="(data, i) in matchDataSliced"
          :key="`matchingData${i}`"
          class="item-match"
        >
          <p v-if="showRankingList" class="number-ranking">{{ i + 1 }}</p>
          <template>
            <button
              @click="onSearch(data)"
            >
              <slot
                v-if="customMatchDataItem"
                name="matchDataItem"
                :props="data"
              ></slot>
              <p v-else class="keyword">
                {{ data }}
              </p>
            </button>
          </template>
          <p v-if="showRankingList" class="value-ranking">{{ data.pageView }}</p>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import BaseInput from '@/components/common/BaseInput.vue'
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    BaseInput
  },
  props: {
    matchingData: {
      type: Object,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: () => ''
    },
    isItem: {
      type: Boolean,
      default: () => false
    },
    size: {
      type: String,
      default: () => 'basic'
    },
    rankingList: {
      type: Array,
      default: () => null
    },
    useAutoEnter: {
      type: Boolean,
      default: () => true
    },
    customMatchDataItem: {
      type: Boolean,
      default: () => false
    },
  },
  data() {
    return {
      inputValue: '',
      isSearching: false
    }
  },
  watch: {
    $route(crr, pre) {
      if(this.inputValue) this.inputValue = ''
    }
  },
  computed: {
    ...mapGetters({
      userCharacters: 'character/getUserCharacters'
    }),
    showRankingList() {
      return this.rankingList && !this.inputValue
    },
    matchDataSliced() {
      if(this.showRankingList) return this.rankingList
      const { data, type } = this.matchingData
      const SLICE_NUM = 10
      if(!this.inputValue) return data.slice(0, SLICE_NUM)
      const noBlank = target => {
        return target.replace(/ /g, '')
      }
      const value = noBlank(this.inputValue)
      const dataFiltered = data.filter(dataItem =>  {
        const findMatch = noBlank(dataItem).toLowerCase().includes(value.toLowerCase())
        return findMatch
      })
      const result = type === 'string' ? dataFiltered.map(({ nickName }) => nickName) : dataFiltered      
      return result.slice(0, SLICE_NUM)
    },
  },
  methods: {
    onSearch(value) {
      console.log('onSearch', value)
      this.$emit('onSearch', value)
      this.inputValue = ''
      this.blurInput()
    },
    focusInput() {
      if(!this.isSearching) this.isSearching = true
    },
    blurInput() {
      setTimeout(() => {        
        if(this.isSearching) this.isSearching = false
      }, 200);
    },
    updateInput(value) {
      // console.log('updateInput', value)
      this.inputValue = value
    },
    scrollToTop() {
      setTimeout(() => {
        window.scrollTo(0,0)
      }, 50);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/SearchBox.scss';
</style>