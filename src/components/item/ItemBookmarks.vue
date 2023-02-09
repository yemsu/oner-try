<template>
  <ul v-if="userItemBookmarks.length > 0" class="bookmarks-item">
    <li
      v-for="(compItem, i) in userItemBookmarks"
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
import { mapActions, mapGetters } from 'vuex';

export default {
  watch: {
    isLogin(crr, prev) {
      this.getUserItemBookmarks()
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      userItemBookmarks: 'bookmark/getUserItemBookmarks',
    })
  },
  created() {
    this.getUserItemBookmarks()
  },
  methods: {
    ...mapActions({
      getUserItemBookmarks: 'bookmark/GET_USER_ITEM_BOOKMARKS'
    })
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