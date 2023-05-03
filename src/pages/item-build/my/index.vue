<template>
  <section class="inner-size-basic mrg-top-medium">
    <div class="area-page-title">
      <h2 class="title badge-text-wrap">🔥 MY 빌드</h2>        
      <base-button
        type="square-round"
        bg="active"
        linkTo="my/new"
      >NEW</base-button>
    </div>
  </section>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'

export default {
  components: {
    BaseButton
  },
  data() {
    return {
    }
  }
}
</script>

<style>
</style>