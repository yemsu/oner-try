<template>
 <div id="app">
    <LayoutHeader />
    <div class="container">
      <nuxt />
    </div>
    <FloatingMenu />
    <LayoutFooter />
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
  $header-height: $header-game-menu-height + $header-site-menu-height;
  position: relative;
  top: $header-height;
  min-height: 100vh;
  padding-bottom: 100px;
}
</style>