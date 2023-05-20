<template>
  <div
    :class="`wrap-buttons size-${size} align-${align} position-${position}`"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: () => 'medium'
    },
    align: {
      type: String,
      default: () => 'center'
    },
    position: {
      type: String,
      default: 'bottom' // bottom, side
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-buttons {
  display: flex;
  &.size {
    &-medium {
      gap: 10px;
    }
  }
  &.position {
    &-bottom {
      margin-top: 20px;
    }
    &-right {
      margin-left: auto;
    }
  }
  &.align {
    &-center {
      justify-content: center;
    }
  }
}
</style>