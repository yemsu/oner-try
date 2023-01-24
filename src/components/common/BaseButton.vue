<template>
  <button
    :class="`btn ${type} bg-${bg}`"
    @click="clickHandler"
    :is="tagName"
    :to="isNuxtLink && linkTo"
    :href="isOuterLink && linkTo"
    :target="isOuterLink ? '_blank' : '_self'"
    :title="isOuterLink ? '새창' : buttonTitle"
  >
    <slot></slot>
    <template v-if="type.includes('mode-wide')">
      <i :class="`icon-bar-arrow ${ toggleData ? 'right' : 'left' }`"></i>
      <i :class="`icon-bar-arrow ${ toggleData ? 'left' : 'right' }`"></i>
    </template>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: () => '' //icon, mode-wide, round
    },
    bg: {
      type: String,
      default: () => '' //icon, mode-wide, round
    },
    toggleData: {
      type: Boolean,
      default: () => false
    },
    linkTo: {
      type: String,
      default: () => ''
    },
    buttonTitle: {
      type: String,
      default: () => ''
    },
  },
  data() {
    return {
    }
  },
  computed: {
    isOuterLink() {
      return this.linkTo.startsWith('http')
    },
    isNuxtLink() {
      return !this.isOuterLink && this.linkTo
    },
    tagName() {
      return this.isOuterLink ? 'a'
        : !this.isOuterLink && this.linkTo ? 'nuxt-link'
          : 'button'
    }
  },
  methods: {
    clickHandler(e) {
			this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/common/BaseButton.scss';
</style>