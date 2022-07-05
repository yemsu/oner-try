<template>
  <div class="wrap-search">
    <ItemCheckerBoard
      :items="items"
    />
    <search-box
      category="조합 아이템"
      :matchingData="{type: 'item', data: combinationItems}"
      size="main"
      :paramKey="['type', 'id']"
    />
  </div>
</template>

<script>
import axios from 'axios'
import setMeta from '@/plugins/utils/meta';
import { mapGetters } from 'vuex';

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
    const combinationItems = items => items.filter(item => item.ingredients)
    const itemsData = items.length === 0
      ? await store.dispatch('GET_ITEMS')
      : items
    return {
      combinationItems: combinationItems(itemsData)
    }
  },
  computed: {
    ...mapGetters({
      items: 'getItems',
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/composition/index.scss';
</style>