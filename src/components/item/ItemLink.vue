<template>
  <div
    :to="isLink && linkItemComposition"
    :target="isLink && isBlankLink && '_blank'"
    :is="isLink ? 'nuxt-link' : 'div'"
    :title="isLink && isBlankLink && '새창'"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    itemType: {
      type: String,
      default: () => ''
    },
    itemId: {
      type: String,
      default: () => ''
    },
    isLink: {
      type: Boolean,
      default: () => true
    },
    isBlankLink: {
      type: Boolean,
      default: () => true
    },
  },
  data() {
    return {
    }
  },
  computed: {
    linkItemComposition() {
      return `/composition/${this.itemType}/${this.itemId}`
    }
  },
}
</script>

<style>
</style>