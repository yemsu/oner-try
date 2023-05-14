<template>
  <div
    :class="[
      `wrap-content size-${size} pd-top-${pdTop}`,
      { 'main': isMainContent }
    ]"
  >
    <!-- slot -->
    <slot></slot>
  </div>
</template>
 
<script>
export default {
  props: {
    size: {
      type: String,
      required: true
    },
    pdTop: {
      type: String,
      default: () => 'medium' // none, small, medium
    },
    useAds: {
      type: Boolean,
      default: () => false
    },
    isMainContent: {
      type: Boolean,
      default: () => false
    }
  },
  mounted() {
  }
}
 </script>
 
<style lang="scss" scoped>
.wrap-content {
  position: relative;
  transition: width 0.5s;
  max-width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  margin-left: auto; 
  margin-right: auto; 
  @include mobile {
    padding-left: 10px;
    padding-right: 10px;
  }
  &.main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    min-height: 60vh;
    text-align: center;
  }
  @each $key in map-keys($layout-sizes) {
    $width: map-get($layout-sizes, #{$key});
    &.size-#{$key} {
      width: $width;
    }
  }
  &.pd-top {
    &-small {
      padding-top: 10px;
    }
    &-medium {
      padding-top: 30px;
    }
  }
}
</style>