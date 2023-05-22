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
      default: 'bottom' // bottom, top, side
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
    &-small {
      gap: 5px;
    }
    &-medium {
      gap: 10px;
    }
  }
  &.position {
    &-top {
      &.size {
        &-small {
          margin-bottom: 10px;
        }
        &-medium {
          margin-bottom: 20px;
        }
      }
    }
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
    &-right {
      justify-content: flex-end;
    }
  }
}
</style>