<template>
  <button
    :class="`btn ${type} bg-${bg}`"
    @click="clickHandler"
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
    }
  },
  data() {
    return {
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