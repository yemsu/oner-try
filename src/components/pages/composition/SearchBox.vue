<template>
  <search-box
    placeholder="조합 아이템"
    :matchingData="{type: 'item', data: matchingData}"
    :rankingList="rankingList"
    :size="size"
    :is-item="true"
    :custom-match-data-item="true"
    @onSearch="fnSearch"
  >
    <template v-slot:matchDataItem="{ props: data }">
      <item-box
        size="small"
        type="list"
        :item="data"
        :showBadges="['howGet']"
        :showTooltip="false"
        :isLink="false"
      />
    </template>
  </search-box>

</template>

<script>
import { fillDataAndInsertValue } from '@/plugins/utils/item'
import { mapGetters, mapActions } from 'vuex';
export default {
  props: {
    fullData: {
      type: Array,
      required: true
    },
    size: {
      type: String,
      default: () => "basic"
    }
  },
  data() {
    return {
      rankingList: null,
      matchingData: null
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
    this.matchingData = this.returnMatchingData()
  },
  methods: {
    ...mapActions({
      getPageView: 'pageView/GET_COMPOSITION',
    }),
    fnSearch(item) {
      if(!item) {
        alert('해당 아이템이 존재하지 않습니다.')
        return
      }
      const { id, type } = item
      this.$router.push(`/composition/${type}/${id}`)
    },
    returnMatchingData() {
      if(this.items.length === 0) return []
      const compositionItems = this.items.filter(({ ingredients }) => ingredients)
      return compositionItems.map(({ id }) => id)
    }
  }
}
</script>