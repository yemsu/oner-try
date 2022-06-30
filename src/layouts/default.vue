<template>
 <div id="app">
    <header-comp />
    <div class="container">
      <nuxt />
    </div>
 </div>
</template>

<script>
import Header from '@/components/layout/Header'

export default {
  components: {
    HeaderComp: Header
  },
  data() {
    return {
    }
  }
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