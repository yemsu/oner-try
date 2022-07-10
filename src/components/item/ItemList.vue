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
.list-item {
  display: flex;
  flex-wrap: wrap;
  &.column-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  &.column-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  &.column-10 {
    > li {
      width: 100px;
    }
  }
  .wrap-item {
    min-width: 90px;
    padding: 6px 8px 0;
    padding-bottom: 10px;
  }
}
::v-deep {
  .name {
    min-height: 2.4em;
    line-height: 1.2;
  }
}
</style>