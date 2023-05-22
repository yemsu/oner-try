<template>
  <element-button
    size="small"
    type="text"
    bg="sub"
    @click="onClickButton"
  >
    <span :class="[
      'wrap-rotate',
      {on: isOnClick}
    ]">
      <font-awesome-icon
        icon="fa-arrows-rotate"
      />
    </span>
    새로고침
  </element-button>
</template>

<script>
export default {
  data() {
    return {
      isOnClick: false
    }
  },
  methods: {
    onClickButton() {
      this.$emit('click')
      this.isOnClick = true
      setTimeout(() => {
        this.isOnClick = false
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