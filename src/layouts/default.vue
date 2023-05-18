<template>
 <div id="app">
    <LayoutHeader />
     <base-adsense 
       ad-slot="6463699903"
       type="side-fix"
       position="left"
       name="side_fix_left"
     />
     <base-adsense 
       ad-slot="4053428480"
       type="side-fix"
       position="right"
       name="side_fix_right"
     />
    <div class="container">
      <error v-if="false"></error>
      <nuxt v-else />
    </div>
    <FloatingMenu />
    <LayoutFooter />
 </div>
</template>

<script>
import BaseAdsense from '@/components/common/BaseAdsense.vue';
import FloatingMenu from '@/components/layout/FloatingMenu.vue';
import Error from './error.vue';

export default {
  components: {
    BaseAdsense,
    FloatingMenu,
    Error
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