<template>
  <div
    :class="`wrap-buttons size-${size} align-${align}`"
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
      margin-top: 20px;
      gap: 10px;
    }
  }
  &.align {
    &-center {
      justify-content: center;
    }
  }
}
</style>