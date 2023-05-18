<template>
  <span
    :class="`skeleton ${type} size-${size}`"
    :style="type === 'text' && `width: ${width};`"
  >
    skeleton
  </span>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text' // img, text
    },
    size: {
      type: String,
      default: 'medium' // medium, small
    },
    width: {
      type: String,
      default: '100px'
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  overflow: hidden;
  display: inline-block;
  text-indent: -999em;
  background-color: var(--bg-light-gray);
  &.text {
    display: block;
    height: 19px;
    border-radius: 5px;
  }
  &.img {
    margin: 6px;
    border-radius: 100%;
    &.size-small {
      width: var(--item-image-small);
      height: var(--item-image-small);
    }
  }
}
</style>