<template>
  <ul v-if="bookmarkItems" class="bookmarks-item">
    <li
      v-for="(compItem, i) in bookmarkItems"
      :key="`bookmark${i}`"
    >
      <item-box
        :item="compItem"
      />
    </li>
  </ul>
  <p v-else> 아직 즐겨찾기한 조합법이 없습니다. </p>
</template>

<script>
import { mapGetters } from 'vuex';
import { getUserBookmarks } from '@/plugins/utils/https'

export default {
  data() {
    return {
      bookmarkItems: []
    }
  },
  watch: {
    isLogin(crr, prev) {
    console.log('main watch', crr)
      this.setUserBookmarks()
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      items:  'item/getItems',
      
    })
  },
  created() {
    this.setUserBookmarks()
  },
  methods: {
    async setUserBookmarks() {
      if(!this.isLogin) return
      const bookmarkItems = await getUserBookmarks({ category: 'item' })
      if(!bookmarkItems) return // when local server hot loading
      const compositionItems = this.items.filter(item => item.ingredients)
      console.log('bookmarkItems', bookmarkItems)
      this.bookmarkItems = bookmarkItems.map((
        { target: bookmarkItemId }) => (
          compositionItems.find(({ id }) => bookmarkItemId === id)
      ))
    }
  }
}
</script>

<style lang="scss" scoped>
  .bookmarks-item {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }
</style>