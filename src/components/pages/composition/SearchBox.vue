<template>
  <search-box
    v-if="rankingList"
    category="조합 아이템"
    :matchingData="{type: 'item', data: matchingData}"
    :rankingList="rankingList"
    :size="size"
    resultPath="/composition"
    :paramKey="['type', 'id']"
    @onSearch="fnSearch"
  />
</template>

<script>
import { fillDataAndInsertValue } from '@/plugins/utils/item'
import { mapGetters, mapActions } from 'vuex';
export default {
  props: {
    matchingData: {
      type: Array,
      default: () => null
    },
    size: {
      type: String,
      default: () => "basic"
    },
    fnSearch: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      rankingList: null,
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/getItems',
      pageViews: 'pageView/getComposition',
      pageViewRanking: 'pageView/getCompositionSearchRanking',
    }),
  },
  async created() {
    if(this.pageViews.length === 0) await this.getPageView(10)
    this.rankingList = fillDataAndInsertValue(this.items, this.pageViewRanking, 'pageView')
  },
  methods: {
    ...mapActions({
      getPageView: 'pageView/GET_COMPOSITION',
    }),
  }
}
</script>