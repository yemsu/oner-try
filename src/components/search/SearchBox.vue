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
        :category="category"
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
              :class="{'button-keyword': !isItem}"
              @click="onSearch(data)"
            >
              <item-box
                v-if="isItem"
                size="small"
                type="list"
                :item="data"
                :showBadges="['howGet']"
                :showTooltip="false"
                :isLink="false"
              />
              <p v-else>
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
    category: {
      type: String,
      default: () => ''
    },
    mode: {
      type: String,
      default: () => ''
    },
    defaultMatchingList: {
      type: Boolean,
      default: () => true
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
    alertMessage: {
      type: String,
      default: () => '잘못된 검색어 입니다.'
    },
    useParam: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      inputValue: '',
      result: '',
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
    noDefaultMatchingList() {
      return !this.defaultMatchingList && !this.inputValue
    },
    matchDataSliced() {
      if(this.noDefaultMatchingList) return []
      if(this.showRankingList) return this.rankingList
      const { data, type } = this.matchingData
      const sliceNum = 10
      if(!this.inputValue) return data.slice(0, sliceNum)
      const noBlank = target => {
        return target.replace(/ /g, '')
      }
      const value = noBlank(this.inputValue)
      const dataFiltered = data.filter(dataItem =>  {
        const targetData = type === 'item' ? dataItem.name : dataItem.nickName
        const findMatch = noBlank(targetData).toLowerCase().includes(value.toLowerCase())
        return findMatch
      })
      const result = type === 'string' ? dataFiltered.map(({ nickName }) => nickName) : dataFiltered      
      return result.slice(0, sliceNum)
    },
    isItem() {
      return this.matchingData?.type === 'item'
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