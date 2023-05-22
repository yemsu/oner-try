<template>
  <div v-if="isVisible" :class="[
    'wrapper',
    { full }
  ]">
    <div class="loader">
      <span
        v-for="(i) in emojiNumber"
        :key="i"
      >🌊</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      required: false
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      emojiNumber: 5,
      isVisible: false,
      timer: null,
    }
  },
  watch: {
    isLoading() {
      this.controller()
    }
  },
  mounted() {
    this.controller()
  },
  methods: {
    controller() {
      if(!this.timer && this.isLoading) {
        this.timer = setTimeout(() => {
          this.isVisible = true
        }, 500)
      } else if(this.timer && !this.isLoading) {
        clearTimeout(this.timer)
        this.isVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-left: 10px;
  font-size: 18px;
  &.full {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-popup-dim);
    font-size: 30px;
  }
}
$totalDuration: 2;
$emojiNumber: 5;
$eachDuration: calc($totalDuration / $emojiNumber);
$translateX: -12px;
.loader {
  display: flex;
  gap: 5px;
  margin: 5px;
  padding: 20px;
  border-radius: 10px;
  span {
    opacity: 0;
    animation: curtain #{$totalDuration}s infinite;
    @for $i from 1 to ($emojiNumber) {
      &:nth-child(#{$i}) {
        animation-delay: #{calc($eachDuration * ($emojiNumber - $i))}s;
      }
    }
    &:nth-child(5) {
      opacity: 1;
      animation-fill-mode: forwards;
    }
  }
  @keyframes curtain {
    0% {
      opacity: 1;
      transform: translateX(0);
    }
    70% {
      transform: translateX(#{$translateX});
    }
    75% {
      opacity: 0;
      transform: rotate(-15deg);
    }
    100% {
      opacity: 0;
      transform: translateX(#{$translateX});
    }
  }
}
</style>