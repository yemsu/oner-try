<template>
  <div class="wrap-search">
    <ItemCheckerBoard
      :items="items"
    />
    <search-box
      v-if="combinationItems.length !== 0"
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
  async asyncData({ store }) {
    const { state } = store
    if(state.items.length === 0) await store.dispatch('GET_ITEMS')
    const combinationItems = await state.items.filter(item => item.ingredients)
    return {
      combinationItems
    }
  },
  computed: {
    ...mapGetters({
      items: 'getItems',
    }),
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/composition/index.scss';
</style>