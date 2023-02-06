<template>
 <div id="app">
    <LayoutHeader />
    <div class="container">
      <nuxt />
    </div>
    <LayoutFooter />
 </div>
</template>

<script>
export default {
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