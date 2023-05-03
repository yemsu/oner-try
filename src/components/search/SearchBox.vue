<template>
  <section :class="['box-search', {'compact':size === 'small'}, size]">
    <h2 class="ir-hidden">{{ searchBoxTitle }}</h2>
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
        :isActive="isSearching && !!matchingData"
        :focusOnMounted="size === 'big' && true"
        @onUpdateInput="updateInput"
        @onFocusInput="focusInput"
        @onBlurInput="blurInput"
        @onEnter="onSearch(useAutoEnter ? matchDataSliced[0] : inputValue)"
      />
      
      <search-box-skeleton 
        v-if="rankingList && rankingList.length === 0 && isSearching"
        :is-item="isItem"
      />
      <section
        v-else-if="((rankingList && rankingList.length > 0) || matchingData) && isSearching"
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
import { mapGetters } from 'vuex';

export default {
  components: {
    BaseInput
  },
  props: {
    matchingData: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      required: true
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
    searchBoxTitle: {
      type: String,
      default: () => '검색'
    }
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
    },
  },
  computed: {
    ...mapGetters({
      userCharacters: 'character/getUserCharacters'
    }),
    showRankingList() {
      return this.rankingList && this.rankingList.length > 0 && !this.inputValue
    },
    matchDataSliced() {
      if(!this.inputValue && this.showRankingList) return this.rankingList
      const SLICE_NUM = 10
      const noBlank = target => target.replace(/ /g, '')
      const value = noBlank(this.inputValue)
      const result = this.matchingData.filter(dataItem =>  {
        const findMatch = noBlank(dataItem).toLowerCase().includes(value.toLowerCase())
        return findMatch
      })
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