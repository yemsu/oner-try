<template>
  <ul
    v-if="userItemBookmarks.length > 0"
    :class="[
      'bookmarks-item',
      alignHrz ? 'align-hrz' : 'align-vtc'
    ]"
  >
    <li
      v-for="(compItem, i) in userItemBookmarks"
      :key="`bookmark${i}`"
    >
      <item-box
        :item="compItem"
        :size="itemSize"
        :show-name="showName"
        :show-tooltip="showTooltip"
      />
    </li>
  </ul>
  <p v-else-if="isLogin" class="default-text"> 아직 즐겨찾기한 조합법이 없습니다. </p>
  <p v-else class="default-text">{{ needLoginMsg }}</p>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { needLoginMsg } from '../../plugins/utils/messages';

export default {
  props: {
    alignHrz: {
      type: Boolean,
      default: () => true
    },
    itemSize: {
      type: String,
      default: () => 'basic'
    },
    showName: {
      type: Boolean,
      default: () => true
    },
    showTooltip: {
      type: Boolean,
      default: () => true
    }
  },
  watch: {
    isLogin(crr, prev) {
      // 로그아웃 후 bookmarks reset
      if(!crr && this.userItemBookmarks.length > 0) {
        this.resetUserItemBookmarks()
        return
      }
      this.getUserItemBookmarks()
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      userItemBookmarks: 'bookmark/getUserItemBookmarks',
    }),
    needLoginMsg() {
      return needLoginMsg
    }
  },
  created() {
    this.getUserItemBookmarks()
  },
  methods: {
    ...mapMutations({
      resetUserItemBookmarks: 'bookmark/RESET_USER_ITEM_BOOKMARKS'
    }),
    ...mapActions({
      getUserItemBookmarks: 'bookmark/GET_USER_ITEM_BOOKMARKS'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/item/ItemBookmarks.scss';
</style>