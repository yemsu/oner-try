<template>
 <div id="app">
    <LayoutHeader />
    <div class="container">
      <nuxt />
    </div>
    <FloatingMenu v-if="showFloatingMenu" />
    <LayoutFooter />
 </div>
</template>

<script>
import FloatingMenu from '@/components/layout/FloatingMenu.vue';

export default {
  components: {
    FloatingMenu
  },
  computed: {
    showFloatingMenu() {
      return this.$route.path !== '/'
    }
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