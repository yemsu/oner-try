<template>
  <button
    :class="`btn ${type}`"
    :toggle="toggleData"
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
      default: () => ''
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
.btn {
  // padding: 3px 10px;
  // border-radius: 5px;
  // font-weight: 300;
  &.dark {
    background-color: var(--color-black);
    color: var(--color-white);
  }
  &.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px 5px;
    border: 1px solid var(--border-dark-200);
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.2);
  }
}
</style>