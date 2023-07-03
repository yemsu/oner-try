<template>
  <div v-if="isVisible" class="top-notice-bar">
    <div class="inner">
      <p class="notice-text" v-html="text"></p>
      <element-close-button
        @click="isVisible = false"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isVisible: true
    }
  }
}
</script>

<style lang="scss" scoped>
.top-notice-bar {
  background-color: $color-pure-black;
  color: $color-white;
  padding: 10px 0;
  .inner {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    .notice-text {
      text-align: center;
      font-size: var(--font-size-MS);
      font-weight: $font-weight-200;
      line-height: 1.3;
    }
    .box-close-button {
      ::v-deep button {
        color: $color-white;
      }
    }
  }
}
</style>