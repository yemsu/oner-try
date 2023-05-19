<template>
  <div
    :class="[
      'layout-create-content',
      `column-number-${columnNumber}`,
      { 'last-item-full': isLastItemFull }
    ]"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    columnNumber: {
      type: Number,
      default: 2,
    },
    isLastItemFull: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-create-content {
  display: grid;
  gap: 20px;
  @include pc {
    @for $i from 1 to 3 {
      &.column-number-#{$i} {
        grid-template-columns: repeat(#{$i}, 1fr);
        &.last-item-full {
          > *:last-child {
            grid-column-start: 1;
            grid-column-end: #{$i + 1};
          }
        }
      }
    }
  }
}
</style>