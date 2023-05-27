<template>
  <div class="wrap-peer">
    <layout-content-wrap :is-main-content="true" pd-top="none">
      <slot></slot>
    </layout-content-wrap>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/common/ChatPopup.scss';
</style>