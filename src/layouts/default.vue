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
    <!-- <common-chat v-if="isLogin && chatRoom && $route.path !== '/party/room'" /> -->
    <element-toast-popup />
    <floating-menu />
    <layout-footer />
 </div>
</template>

<script>
import BaseAdsense from '@/components/common/BaseAdsense.vue';
import Error from './error.vue';
import FloatingMenu from '../components/layout/FloatingMenu.vue';
import { mapGetters } from 'vuex'

export default {
  components: {
    BaseAdsense,
    FloatingMenu,
    Error
  },
  data() {
    return {
      showSideFixAds: false,
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      chatRoom: 'party/getChatRoom',
    })
  },
  watch: {
    '$route.name'(crr, prev) {
      this.removeSideFixAdsFor(crr)
      // return this.$nuxt.error({ statusCode: 600, message: '점검 중입니다' })
    }
  },
  mounted() {
    this.removeSideFixAdsFor(this.$route.name)
    // return this.$nuxt.error({ statusCode: 600, message: '점검 중입니다' })
  },
  methods: {
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