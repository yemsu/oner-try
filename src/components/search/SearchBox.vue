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
        @onEnter="routerPush(matchDataSliced[0])"
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
              @click="routerPush(data)"
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
    paramKey: {
      type: Array,
      default: () => []
    },
    resultPath: {
      type: String,
      default: () => '/'
    },
    rankingList: {
      type: Array,
      default: () => null
    },
  },
  data() {
    return {
      inputValue: '',
      result: '',
      isSearching: false
    }
  },
  watch: {
    $route(newVal, oldVal) {
      const newparams = newVal.params
      const oldparams = oldVal.newparams
      console.log('searchBox route watch', this.paramKey, this.paramKey[0], newparams, newparams[this.paramKey[0]])
      if(!newparams[this.paramKey[0]]) {
        // console.log('no params')
        this.onRemoveSearchResult()
      } else if(newparams !== oldparams) {
        this.routeparamsHandler(newparams)
        this.scrollToTop()
      }
    }
  },
  computed: {
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
        const targetData = type === 'item' ? dataItem.name : dataItem
        const findMatch = noBlank(targetData).toLowerCase().includes(value.toLowerCase())
        
        return findMatch
      })

      return dataFiltered.slice(0, sliceNum)
    },
    isItem() {
      return this.matchingData.type === 'item'
    }
  },
  mounted() {
    this.routeparamsHandler()
      // console.log('params', this.$router, this.$route,)
  },
  methods: {
    onSearch(value) {
      this.$emit('onSearch', value)
      this.inputValue = ''
      this.blurInput()
    },
    routerPush(value) {
      const params = this.paramKey.reduce((acc, key) => {
        const checkValue = !value
          ? this.inputValue
          : typeof(value) === 'string'
            ? value : value[key]
        acc += '/' + checkValue
        return acc
      }, '')
      this.$router.push(`${this.resultPath}${params}`)
    },
    routeparamsHandler(params) {
      params = params || this.$route.params
      
      const noparams = Object.keys(params).length === 0
      if(noparams) return false

      const result = this.findResultByParams(params)
      // console.log('result', result)
      if(!result) {
        alert('잘못된 파라미터 값입니다.')
      const path0 = '/' + this.$route.path.split('/')[1]
        this.$router.push(path0)
        return false
      }
      this.onSearch(result)
    },
    findResultByParams(params) {
      if(!params[this.paramKey[0]]) return false
      const result = this.matchingData.type === 'item'
        ? this.findMatchItem(params)[0]
        : params[this.paramKey[0]]

      return this.checkErrorResultParams(params, result) && result
    },
    findMatchItem(params) {
      // console.log('this.matchingData', this.matchingData)
      const result = this.paramKey.reduce((acc, key) => {
        const targetArr = acc.length === 0 ? this.matchingData.data : acc
        const matchparamsData = targetArr.filter(item => item[key] === params[key])
        acc = matchparamsData
        return acc
      }, [])

      return result
    },
    checkErrorResultParams(params, result) {
      if(this.matchingData.data !== 'item') return true
      if(!result) {
        alert('params에 해당하는 결과를 찾을 수 없습니다.', params)
        return false
      } else if(Array.isArray(result) && result.length > 1) {
        console.error('SearchBox.vue -> findResultByParams(): result 배열의 갯수는 1개여야 합니다.', result)
        return false
      } else {
        return true
      }
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
    onRemoveSearchResult() {
      this.$emit('onRemoveSearchResult')
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