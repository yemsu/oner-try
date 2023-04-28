<template>
 <div id="app">
    <LayoutHeader />
    <div class="container">
      <nuxt />
    </div>
    <!-- <FloatingMenu /> -->
    <!-- <LayoutFooter /> -->
 </div>
</template>

<script>
import FloatingMenu from '@/components/layout/FloatingMenu.vue';

export default {
  components: {
    FloatingMenu
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  min-height: 100vh;
  /* $header-height: $header-game-menu-height + $header-site-menu-height;
  padding: $header-height 0 100px; */
  padding-top: $header-site-menu-height;
}
</style>