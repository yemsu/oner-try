<template>
  <button
    :class="[
      'button-bookmark',
      isBookmarked && 'is-active'
    ]"
    @click="clickBookmark"
    title="조합법 즐겨찾기 추가하기"
  >
    <span class="ir-hidden">조합법 즐겨찾기 추가하기</span>
  </button>
</template>

<script>
import { postUserBookmark, deleteUserBookmark, getUserBookmark } from '@/plugins/utils/https'
import { mapGetters, mapMutations } from 'vuex'
import { needLoginMsg } from '../../plugins/utils/messages'

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
      // 로그아웃 후 bookmark reset
      if(!crr && this.isBookmarked) {
        this.isBookmarked = false
      }
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
      isLogin: 'auth/getIsLogin',
      items: 'item/getItems'
    }),
    apiParams() {
      return {
        category: this.category,
        target: this.target
      }
    }
  },
  methods: {
    ...mapMutations({
      addUserItemBookmarks: 'bookmark/ADD_USER_ITEM_BOOKMARKS',
      deleteUserItemBookmarks: 'bookmark/DELETE_USER_ITEM_BOOKMARKS'
    }),
    async checkUserBookmark() {
      // 북마크 여부 체크
      const result = await getUserBookmark(this.apiParams)
      console.log('checkUserBookmark result', this.apiParams, { result })
      if(result) {
        this.isBookmarked = true
      }
    },
    async clickBookmark() {
      // 로그인 체크
      if(!this.isLogin) {
        alert(needLoginMsg)
        return
      }

      // 북마크 제거
      if(this.isBookmarked) {
        this.deleteBookmark()
        return 
      }

      // 북마크 추가
      this.addBookmark()
    },
    async addBookmark() {
      const { data } = await postUserBookmark(this.apiParams)
        console.log('add', data)
      if(data.msg === 'false') {
        console.error(`data.msg === 'false' :: 북마크 등록 실패`)
        return
      }
      this.isBookmarked = true
      this.addUserItemBookmarks(this.getTargetItem())
    },
    async deleteBookmark() {
      const { data } = await deleteUserBookmark(this.apiParams)
      console.log('remove', data)
      if(data.msg === 'false') {
        console.error(`data.msg === 'false' :: 북마크 제거 실패`)
        return
      }
      this.isBookmarked = false
      this.deleteUserItemBookmarks(this.target)
    },
    getTargetItem() {
      return this.items.find(({id}) => id === this.target)
    }
  }
}
</script>

<style lang="scss" scoped>
.button-bookmark {
  &:before {
    content: '⭐';
    font-size: 16px;
  }
  &.is-active:before {
    filter: none;
  }
  &:not(is-active):before {
    filter: contrast(200%) grayscale(100%) brightness(100%);
  }
}
</style>