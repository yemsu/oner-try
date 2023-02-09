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
  <p v-else class="default-text"> 아직 즐겨찾기한 조합법이 없습니다. </p>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

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
@import '@/assets/style/components/item/ItemBookmarks.scss';
</style>