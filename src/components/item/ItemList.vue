<template>
  <ul :class="`list-item column-${columnNum} ${size}`">
    <li
      v-for="(item, i) in items"
      :key="`item${i}`"
    >
      <slot :item="item"></slot>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    columnNum: {
      type: String,
      default: () => ''
    },
    size: {
      type: String,
      default: () => 'basic'
    },
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/item/ItemList.scss';
</style>