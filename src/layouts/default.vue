<template>
 <div id="app">
    <LayoutHeader />
    <div class="container">
      <error v-if="false"></error>
      <nuxt v-else />
    </div>
    <FloatingMenu />
    <LayoutFooter />
 </div>
</template>

<script>
import FloatingMenu from '@/components/layout/FloatingMenu.vue';
import Error from './error.vue';

export default {
  components: {
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