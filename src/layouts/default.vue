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
  $header-height: 41px;
  padding: ($header-height + 15px) 20px 100px;
}
</style>