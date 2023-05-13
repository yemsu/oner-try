<template>
  <div :class="`wrap-tab type-${type}`">
    <section>
      <h2 class="ir-hidden">탭 버튼 리스트 ({{ tabs.length }})</h2>
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
    </section>
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
      default: () => [],
      required: true
    },
    type: {
      type: String,
      default: () => 'none' // none, basic
    }
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
@import '@/assets/style/components/common/VTab.scss';
</style>