<template>
  <nuxt-link
    v-if="isNuxtLink"
    :class="`btn ${type} bg-${bg} size-${size}`"
    :to="linkTo"
  >
    <span class="text"><slot></slot></span>
  </nuxt-link>
  <button
    v-else
    :class="`btn ${type} bg-${bg} size-${size}`"
    @click="clickHandler"
    :is="tagName"
    :href="isOuterLink && linkTo"
    :target="isOuterLink ? '_blank' : '_self'"
    :title="isOuterLink ? '새창' : buttonTitle"
  >
    <span class="text"><slot></slot></span>
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
      default: () => '' //icon, mode-wide, round, square-round, text
    },
    bg: {
      type: String,
      default: () => '' //active, inactive, point, sub, point-sub, cancel
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
    isNoFunction: {
      type: Boolean,
      default: false
    }
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
        : this.isNoFunction ? 'span' 
        : 'button'
    }
  },
  methods: {
    clickHandler(e) {
      if(this.isNoFunction) return
			this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/element/Button.scss';
</style>