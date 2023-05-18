<template>
  <section :class="`area-title-content area-${type}`">
    <div class="area-item-list">
      <h4 class="title">{{ title }}</h4>
      <div class="contents">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => ''
    },
    type: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.area-item-list {
  border: 1px solid var(--color-black);
  border-radius: 10px;
  .title {
    padding: 5px 10px;
    border-bottom: 1px solid var(--border-gray);
    font-size: var(--font-size-title-XS);
    font-weight: bold;
  }
  .contents {
    padding: 10px 10px;
  }
  &:not(.dark) {
    background-color: var(--color-white);
  }
  &.dark {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
</style>