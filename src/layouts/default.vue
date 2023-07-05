<template>
 <div id="app">
    <common-top-notice-bar
      text="📢 23.07.06 목요일 오전 10시에 동료 콤비 및 신규 스탯 추가를 위한 점검이 있을 예정입니다. (약 30분 소요 예정)<br> 점검 이후 파티 모집 방이 초기화되니 사이트 이용에 참고해주시기 바랍니다. "
    />
    <layout-header />
    <error v-if="false"></error>
    <template v-else>
      <common-party-list-floating
        v-if="showPartyListFloating"
      />
      <div class="container">
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
        <nuxt />
      </div>
    </template>
    <common-chat v-if="chatRoom" />
    <element-toast-popup />
    <element-popup />
    <item-bookmark-floating />
    <!-- <common-banner-floating /> -->
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
    }),
    showPartyListFloating() {
      return !['party'].includes(this.$route.name)
    }
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
      // const goAgainParty = confirm('채팅방에 참여하신 상태로 새로고침을 하신 것 같네요! 해당 채팅방에 바로 재참여하시려면 확인을 눌러주세요.')
      // if(!goAgainParty) {
      //   this.setIsLoading(false)
      //   return
      // }
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
  padding-bottom: 60px;
}
</style>