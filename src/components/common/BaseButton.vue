<template>
  <nuxt-link
    v-if="isNuxtLink"
    :class="[
      `btn ${type} size-${size}`,
      {[`bg-${bg}`]: bg},
      {[`color-${color}`]: color},
    ]"
    :to="linkTo"
  >
    <span class="text"><slot></slot></span>
  </nuxt-link>
  <button
    v-else
    :class="[
      `btn ${type || 'btn-text'} size-${size}`,
      {[`bg-${bg}`]: bg},
      {[`color-${color}`]: color},
    ]"
    @click="clickHandler"
    :is="tagName"
    :href="isOuterLink && linkTo"
    :target="isOuterLink ? '_blank' : '_self'"
    :title="isOuterLink ? '새창' : buttonTitle"
  >
    <template v-if="type.includes('mode-wide')">
      <i :class="`icon-bar-arrow ${ toggleData ? 'right' : 'left' }`"></i>
      <i :class="`icon-bar-arrow ${ toggleData ? 'left' : 'right' }`"></i>
    </template>
    <span v-else class="text"><slot></slot></span>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: () => '' //icon, mode-wide, round, square-round
    },
    bg: {
      type: String,
      default: () => '' //point, light-gray...
    },
    size: {
      type: String,
      default: () => 'medium' //small, medium, large
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
    color: {
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
      return this.isOuterLink ? 'a' : 'button'
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