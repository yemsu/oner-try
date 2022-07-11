<template>
  <div>
    <div class="wrap-search">
      <ItemCheckerBoard
        :items="legendItems"
      />
      <composition-search-box
        :matchingData="compositionItems"
        size="big"
      />
    </div>
  </div>
</template>

<script>
import CompositionSearchBox from "@/components/pages/composition/SearchBox.vue"
import setMeta from '@/plugins/utils/meta';

export default {
  name: 'SearchCharacter',
  components: {
    CompositionSearchBox
  },
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `조합법`,
      description: `조합법이 궁금한 아이템을 검색 해보세요.`,
    })
  },
  async asyncData({ store }) {
    const { items } = store.state
    const itemsData = items.length === 0
      ? await store.dispatch('item/GET_ITEMS')
      : items
    const compositionItems = itemsData.filter(item => item.ingredients)
    const legendItems = compositionItems.filter(item => item.grade === 'legend')
    return {
      compositionItems,
      legendItems
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/composition/index.scss';
</style>