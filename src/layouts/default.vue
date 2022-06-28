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