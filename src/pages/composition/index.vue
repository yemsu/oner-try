<template>
  <div class="wrap-search">
    <ItemCheckerBoard
      :items="items"
    />
    <search-box
      v-show="combinationItems.length !== 0"
      category="조합 아이템"
      :matchingData="{type: 'item', data: combinationItems}"
      size="main"
      :paramKey="['id', 'type']"
    />
  </div>
</template>

<script>
import SearchBox from '@/components/search/SearchBox.vue'
import ItemCheckerBoard from '@/components/item/ItemCheckerBoard.vue'
import { mapGetters } from 'vuex';

export default {
  name: 'SearchCharacter',
  head: {
    title: `${process.env.APP_TITLE} | 조합법`,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: '조합법이 궁금한 아이템을 검색 해보세요.'
      }
    ]
  },
  components: {
    SearchBox,
    ItemCheckerBoard,
  },
  data() {
    return {
      combinationItems: [],
    }
  },
  computed: {
    ...mapGetters({
      items: 'getItems',
    }),
  },
  async created() {
    if(this.items.length === 0) await this.$store.dispatch('GET_ITEMS')
    const combinationItems = await this.items.filter(item => item.ingredients)
    this.combinationItems = combinationItems
    // console.log(this.items)
  },
  mounted() {
    console.log(this.$route)
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/composition/index.scss';
</style>