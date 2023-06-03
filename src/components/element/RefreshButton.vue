<template>
  <element-button
    size="small"
    type="text"
    bg="sub"
    @click="onClickButton"
  >
    <span :class="[
      'wrap-rotate',
      {on: isOnRotate}
    ]">
      <font-awesome-icon
        icon="fa-arrows-rotate"
      />
    </span>
    {{ onlyIcon ? '' : '새로고침' }}
  </element-button>
</template>

<script>
export default {
  props: {
    onlyIcon: {
      type: Boolean,
      default: false
    },
    isOnRefresh: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOnRotate: false
    }
  },
  watch: {
    isOnRefresh(crr) {
      if(crr) {
        this.rotateIcon()
      }
    }
  },
  methods: {
    onClickButton() {
      this.$emit('click')
    },
    rotateIcon() {
      this.isOnRotate = true
      setTimeout(() => {
        this.isOnRotate = false
      }, 1000);
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-rotate {
  display: inline-block;
  &.on {
    animation: rotate 1s infinite;
    animation-fill-mode: forwards;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>