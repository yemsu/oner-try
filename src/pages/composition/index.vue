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
      :paramKey="['type', 'id']"
    />
  </div>
</template>

<script>
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
    console.log('item', items)
    let getItems = null
    if(items.length === 0) {
      getItems = store.dispatch('GET_ITEMS')
    }
    // https://github.com/nuxt/nuxt.js/issues/1693
    console.log('item2', items)
    const combinationItems = await items.filter(item => item.ingredients)
    return {
      getItems,
      combinationItems
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