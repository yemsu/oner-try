<template>
  <span :class="`badge type-${type} color-${color} size-${size} line-${line}`">
    <div class="text">
      <slot></slot>
    </div>
  </span>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'square' // square-round, round
    },
    color: {
      type: String,
      default: 'none'
    },
    size: {
      type: String,
      default: 'medium' // xsmall, small, medium
    },
    line: {
      type: String,
      default: 'none' // none, positive, negative, needHelper, allowBeginner
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/element/Badge.scss';
</style>