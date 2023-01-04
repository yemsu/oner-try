<template>
  <section class="wrap-search">
    <h2 class="ir-hidden">조합법</h2>
    <ItemCheckerBoard
      :items="legendItems"
    />
    <composition-search-box
      :matchingData="compositionItems"
      size="big"
    />
  </section>
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
    await store.dispatch('item/GET_ITEMS')
    const { item: { items } } = store.state
    
    const compositionItems = items.filter(item => item.ingredients)
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