<template>
  <search-box
    category="조합 아이템"
    :matchingData="{type: 'item', data: matchingData}"
    :rankingList="pvSearchRanking"
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
    fnSearch: {
      type: Function,
      default: () => {}
    },
    size: {
      type: String,
      default: () => "basic"
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