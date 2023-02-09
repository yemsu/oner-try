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
  position: relative;
  min-height: 100vh;
  $header-height: 80px;
  padding: $header-height 0 100px;
}
</style>