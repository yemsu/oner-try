<template>
  <div :class="['box-search', {'compact':size === 'side'}, size]">
    <div :class="[
      'wrap-search',
      {'compact': size === 'side' && !isSearching}
    ]">
      <base-input
        usage="search"
        :size="size"
        :category="category"
        :value="inputValue"
        :isCompactMode="size === 'side' && !isSearching"
        :isActive="isSearching && !!matchingData.data"
        @onUpdateInput="updateInput"
        @onFocusInput="focusInput"
        @onBlurInput="blurInput"
        @onEnter="routerPush(matchDataSliced[0])"
      />
      <div
        v-if="isSearching && matchingData.data"
        class="items-match"
      >
        <div
          v-for="(data, i) in matchDataSliced"
          :key="`matchingData${i}`"
          class="item-match"
        >
          <item-box
            v-if="isItem"
            size="small"
            type="list"
            :item="data"
            :showTooltip="false"
          />
          <button
            v-else
            :class="{'button-keyword': !isItem}"
            @click="routerPush(data)"
          >
            <p>
              {{ data }}
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseInput from '@/components/common/BaseInput.vue'

export default {
  components: {
    BaseInput,
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
    matchDataSliced() {
      const { data, type } = this.matchingData
      const sliceNum = 5
      if(!this.defaultMatchingList && !this.inputValue) return []
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
        Object.assign(acc, {[key]: checkValue})
        return acc
      }, {})
      const path0 = '/' + this.$route.path.split('/')[1]
      // console.log('pathj-0', this.$route.path.split('/'))
      this.$router.push(`${path0}/${value}`)
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

      const checkNoError = this.checkErrorsFindResultByParams(params, result)

      return checkNoError && result
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
    checkErrorsFindResultByParams(params, result) {
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