<template>
  <search-box
    placeholder="조합 아이템"
    v-if="itemNameList"
    :matching-data="itemNameList"
    :size="size"
    :is-item="true"
    :custom-match-data-item="true"
    @onSearch="fnSearch"
  >
    <template v-slot:matchDataItem="{ props: matchData }">
      <item-box
        size="small"
        type="list"
        :item="findItem(matchData)"
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
      rankingNameList: null,
      itemNameList: null
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
    // if(this.pageViews.length === 0) await this.getPageView(10)
    // this.rankingNameList = fillDataAndInsertValue(this.items, this.pageViewRanking, 'pageView')
    //   .map(({ name }) => name)
    this.setItemNameList()
  },
  methods: {
    ...mapActions({
      getPageView: 'pageView/GET_COMPOSITION',
    }),
    fnSearch(name) {
      if(!name) {
        alert('해당 아이템이 존재하지 않습니다.')
        return
      }
      const { id, type } = this.findItem(name)
      this.$router.push(`/composition/${type}/${id}`)
    },
    setItemNameList() {
      // computed 사용하면 여러번 실행되어 최초 1회만 실행
      console.log('setItemNameList', this.items.length)
      if(this.items.length === 0) return []
      const compositionItems = this.items.filter(({ ingredients }) => ingredients)
      this.itemNameList = compositionItems.map(({ name }) => name)
    },
    findItem(name) {
      return this.items.find((item) => item.name === name)
    }
  }
}
</script>