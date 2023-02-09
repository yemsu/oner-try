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
  watch: {
    isLogin(crr, prev) {
      // 새로고침 후 렌더링 시에 실행됨 (로그인 체크 후 true 반환이 느려서 watching)
      if(crr && crr !== prev) {
        this.checkUserBookmark()
      }
    },
  },
  created() {
      // created 라이프 사이클에 아래 로직이 있어야, route 변경되었을때 변경된 아이템 즐겨찾기 여부가 업데이트됨.
      // $route watch로 해봤으나 변한 $route 값을 캐치하지 못하는 이슈 존재. 어쨋든 created에서 되니 문제는 없으나 왜 아이템이 바뀔때마다 created 라이프사이클이 실행되는지 이해되지 않음.
    if(this.isLogin) this.checkUserBookmark()
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
  methods: {
    async checkUserBookmark() {
      console.log('checkUserBookmark')
      // 북마크 여부 체크
      const result = await getUserBookmark(this.apiParams)
      if(result) {
        this.isBookmarked = true
      }
    },
    async clickBookmark() {
      // 로그인 체크
      if(!this.isLogin) {
        alert('로그인이 필요한 기능입니다!')
        return
      }

      // 북마크 제거
      if(this.isBookmarked) {
        const { data } = await deleteUserBookmark(this.apiParams)
        console.log(' remove', data)
        if(data.msg === 'false') {
          console.error(`data.msg === 'false' :: 북마크 제거 실패`)
          return
        }
        this.isBookmarked = false
        return 
      }
      // 북마크 추가
      const { data } = await postUserBookmark(this.apiParams)
        console.log('add', data)
      if(data.msg === 'false') {
        console.error(`data.msg === 'false' :: 북마크 등록 실패`)
        return
      }
      this.isBookmarked = true
    },
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