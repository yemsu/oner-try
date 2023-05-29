<template>
 <div id="app">
    <layout-header />
     <base-adsense
      v-if="showSideFixAds"
      ad-slot="6463699903"
      type="side-fix"
      position="left"
      name="side_fix_left"
     />
     <base-adsense
      v-if="showSideFixAds"
      ad-slot="4053428480"
      type="side-fix"
      position="right"
      name="side_fix_right"
     />
    <div class="container">
      <error v-if="false"></error>
      <nuxt v-else />
    </div>
    <common-chat v-if="chatRoom" />
    <element-toast-popup />
    <element-popup />
    <item-bookmark-floating />
    <layout-footer />
    <common-loading-indicator :is-loading="isLoading" :full="true" />
 </div>
</template>

<script>
import BaseAdsense from '@/components/common/BaseAdsense.vue';
import Error from './error.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  components: {
    BaseAdsense,
    Error
  },
  data() {
    return {
      showSideFixAds: false,
      ONER_TRY_CHAT_REFRESH: 'ONER_TRY_CHAT_REFRESH',
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      isLoading: 'common/getIsLoading',
      isMinimize: 'party/getIsMinimize',
      chatRoom: 'party/getChatRoom',
    })
  },
  watch: {
    '$route.name'(crr, prev) {
      this.removeSideFixAdsFor(crr)
      // return this.$nuxt.error({ statusCode: 600, message: '점검 중입니다' })
      if(!this.isMinimize) this.setIsMinimize(true)
    },
  },
  mounted() {
    this.removeSideFixAdsFor(this.$route.name)
    setTimeout(() => {
      this.checkRefreshChat()
    }, 600);
    // return this.$nuxt.error({ statusCode: 600, message: '점검 중입니다' })
  },
  methods: {
    ...mapActions({
      getChatRoom: 'party/GET_CHAT_ROOM',
      getUserChatRoom: 'party/GET_USER_CHAT_ROOM',
      deleteMember: 'party/DELETE_MEMBER',
    }),
    ...mapMutations({
      setIsMinimize: 'party/SET_IS_MINIMIZE',
      setToastMessage: 'toastPopup/SET_MESSAGE',
      setToastOn: 'toastPopup/SET_IS_TRIGGER_ON',
      setIsLoading: 'common/SET_IS_LOADING',
    }),
    removeSideFixAdsFor(routeName) {
      this.showSideFixAds = false
      this.showContentTopAd = false
      this.showContentBottomAd = false
      setTimeout(() => {
        const names = ['index']

        if(names.includes(routeName)) {
          this.showSideFixAds = false
          this.showContentTopAd = true
        } else {
          this.showSideFixAds = true
          this.showContentTopAd = false
        }
        this.showContentBottomAd = true
      }, 10);
    },
    async checkRefreshChat() {
      if(!this.isLogin) return
      const prevChatRoomId = sessionStorage.getItem(this.ONER_TRY_CHAT_REFRESH)
      if(!prevChatRoomId) return
      this.setIsLoading(true)
      const goAgainParty = confirm('채팅방에 참여하신 상태로 새로고침을 하신 것 같네요! 해당 채팅방에 바로 재참여하시려면 확인을 눌러주세요.')
      if(!goAgainParty) return
      setTimeout(() => {
        this.getChatRoom(prevChatRoomId, true)
        sessionStorage.removeItem(this.ONER_TRY_CHAT_REFRESH)
        this.setIsLoading(false)
      }, 500);
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  min-height: 100vh;
  padding: var(--header-height) 0 100px;
  @include mobile {
    padding: var(--header-height) 0 60px;
  }
}
</style>