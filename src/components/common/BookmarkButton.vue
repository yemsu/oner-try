<template>
  <button
    :class="[
      'button-bookmark',
      isBookmarked && 'is-active'
    ]"
    @click="clickBookmark"
  >
    즐겨찾기
  </button>
</template>

<script>
import { postUserBookmark, deleteUserBookmark, getUserBookmark } from '@/plugins/utils/https'
import { mapGetters } from 'vuex'

export default {
  props: {
    category: {
      type: String,
      default: () => ''
    },
    target: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      isBookmarked: false
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin'
    }),
    apiParams() {
      return {
        category: this.category,
        target: this.target
      }
    }
  },
  async created() {
    if(!this.isLogin) return
    // 북마크 여부
    const result = await getUserBookmark(this.apiParams)
    if(result) {
      this.isBookmarked = true
    }
  },
  methods: {
    async clickBookmark() {
      // 로그인 체크
      if(!this.isLogin) {
        alert('로그인이 필요한 기능입니다!')
        return
      }

      // 북마크 제거
      if(this.isBookmarked) {
        const result = await deleteUserBookmark(this.apiParams)
        this.isBookmarked = false
        return 
      }
      // 북마크 추가
      const result = await postUserBookmark(this.apiParams)
      this.isBookmarked = true
    }
  }
}
</script>

<style lang="scss" scoped>
.button-bookmark {
  &.is-active {
    background-color: yellow;
  }
}
</style>