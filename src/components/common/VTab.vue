<template>
  <div class="wrap-tab">
    <ul class="tabs">
      <li
        v-for="(tab, i) in tabs"
        :key="`tab${i}`"
        :class="['tab', {'active': activeIndex === i}]"
      >
        <button @click="activeIndex = i">
          <slot name="tab" :tab="{data: tab, isActive: activeIndex === i}"></slot>
        </button>
      </li>
    </ul>
    <div class="content">
      <slot name="content" :activeTab="tabs[activeIndex]"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      activeIndex: 0,
    }
  },
  mounted() {
    console.log('this.tabs', this.tabs)
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
}
</style>