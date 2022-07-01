<template>
  <div class="wrap-search">
    <h2 v-show="result" class="ir-hidden">{{ result.name }} 조합법</h2>
    <div :class="{'only-search-box': !result}">
      <!-- slot bg -->
      <slot name="bg"></slot>
      <div :class="['area-search', {'inner-size-basic': result}]">
        <search-box
          :category="category"
          :matchingData="matchingData"
          :defaultMatchingList="defaultMatchingList"
          size="main"
          :hasResult="result && true"
          :paramKey="paramKey"
          @onSearch="onSearch"
          @onRemoveSearchResult="onRemoveSearchResult"
        />
      </div>
    </div>
    <div v-show="result" class="area-result">
      <div class="wrap-result">
         <!-- slot result -->
        <slot name="result"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/search/SearchBox.vue'

export default {
  components: {
    SearchBox
  },
  props: {
    matchingData: {
      type: Object,
      default: () => {}
    },
    result: {
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
    hasResult: {
      type: Boolean,
      default: () => false
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
    }
  },
  data() {
    return {
    }
  },
  methods: {
    onSearch(item) {      
      this.$emit('onSearch', item)
    },
    onRemoveSearchResult() {
      this.$emit('onRemoveSearchResult')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/search/SearchContainer.scss';
</style>