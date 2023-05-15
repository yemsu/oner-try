<template>
  <span :class="`badge type-${type} color-${color} size-${size}`">
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
      default: () => 'round' // round
    },
    color: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: () => 'medium' // small, medium
    },
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.badge {
  display: flex;
  justify-content: center;
  align-items: center;
  word-spacing: -0.1em;
  font-weight: var(--font-weight-B);
  @media (prefers-color-scheme: dark) {
    font-weight: var(--font-weight-N);
  }
  .text {
    display: flex;
    align-items: center;
  }
  &.size {
    &-small {
      padding: 0 5px;
      font-size: $font-size-XXS-pc;
      height: 18px;
    }
    &-medium {
      padding: 0 10px;
      font-size: $font-size-XS-pc;
      height: 20px;
    }
  }
  &.type {
    &-round {
      border-radius: 50px;
    }
  }
  &.color {
    @each $key in map-keys($item-grade-colors) {
      $hsl: map-get($item-grade-colors, #{$key});
      &-#{$key} {
        background-color: colorMaker($hsl, 0%, 0%, 0.3);
        border: 1px solid colorMaker($hsl);
      }
      &-deep-#{$key} {
        background-color: colorMaker($hsl, -10%, 6%);
        border: 1px solid colorMaker($hsl);
        color: $color-black;
        font-weight: 400;
      }
    }   
    &-black {
      background-color: rgba(0, 0, 0, 0.8);
      font-weight: 300;
      color: #fff;
      letter-spacing: 0;
    }
    &-status {
      @each $key in map-keys($chat-status-colors) {
        $hsl: map-get($chat-status-colors, #{$key});
        &-#{$key} {
          background-color: colorMaker($hsl, 0%, 0%, 0.3);
          border: 1px solid colorMaker($hsl);
        }
      }  
    }
  }
}
</style>