<template>
  <div class="main-notice">
    <h2 class="title">
      <span v-if="pointText" class="point-text">{{ pointText }}</span>
      {{ title }}
    </h2>
    <p class="desc">
      <slot></slot>
    </p>
    <p v-if="subText" class="text-sub">{{ subText }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    pointText: {
      type: String,
      default: ''
    },
    subText: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.main-notice {
  *:nth-child(n+2) {
    margin-top: 20px;
  }
  .title {
    font-size: var(--font-size-title-B);
  }
  .desc {
    font-size: var(--font-size-B);
    color: var(--font-dark-gray);
  }
  .text-sub {
    font-size: var(--font-size-S);
    color: var(--font-dark-gray);
  }
  .point-text {
    display: block;
    margin-bottom: 20px;
    font-size: 90px;
    color: var(--font-gray);
    font-weight: var(--font-weight-B);
    line-height: 1.2;
    letter-spacing: 0.05em;
  }
}
</style>