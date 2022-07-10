<template>
  <div>
    <div class="wrap-search">
      <ItemCheckerBoard
        :items="legendItems"
      />
      <search-box
        category="조합 아이템"
        :matchingData="{type: 'item', data: combinationItems}"
        :rankingList="pvSearchRanking"
        size="big"
        resultPath="/composition"
        :paramKey="['type', 'id']"
      />
    </div>
  </div>
</template>

<script>
import setMeta from '@/plugins/utils/meta';
import { fillDataAndInsertValue } from '@/plugins/utils/item'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SearchCharacter',
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
      ? await store.dispatch('GET_ITEMS')
      : items
    const combinationItems = itemsData.filter(item => item.ingredients)
    const legendItems = combinationItems.filter(item => item.grade === 'legend')
    return {
      combinationItems,
      legendItems
    }
  },
  data() {
    return {
      pvSearchRanking: null,
    }
  },
  computed: {
    ...mapGetters({
      items: 'getItems',
      compositionPV: 'pageView/getComposition',
      pageViewSearchRanking: 'pageView/getCompositionSearchRanking',
    }),
  },
  async created() {
    if(this.compositionPV.length === 0) await this.getCompositionPV(10)
    this.pvSearchRanking = fillDataAndInsertValue(this.items, this.pageViewSearchRanking, 'pageView')
  },
  methods: {
    ...mapActions({
      getCompositionPV: 'pageView/GET_COMPOSITION',
    }),
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/composition/index.scss';
</style>