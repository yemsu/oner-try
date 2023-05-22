<template>
  <span :class="`beta size-${size}`">
    beta
  </span>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'small' // small, xsmall
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.beta {
  font-style: italic;
  letter-spacing: 0;
  &.size {
    &-xsmall {
      font-size: var(--font-size-XS);
    }
    &-small {
      font-size: var(--font-size-S);
    }
  }
}
</style>