<template>
  <ul :class="`list-item column-${columnNum}`">
    <li
      v-for="(item, i) in items"
      :key="`item${i}`"
    >
      <slot :data="{ item, i }"></slot>
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