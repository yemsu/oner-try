<template>
  <ul :class="`list-item column-${columnNum} ${type}`">
    <li
      v-for="(item, i) in items"
      :key="`item${i}`"
    >
      <div :class="{'wrap-item': itemBoxType !== 'list'}">
        <item-box
          :item="item"
          :type="itemBoxType"
          :size="itemBoxSize"
          :badgeDrop="badgeDrop"
          :badgeType="badgeType"
        ></item-box>
      </div>
    </li>
  </ul>
</template>

<script>
import ItemBox from '@/components/item/ItemBox.vue'

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: () => ''
    },
    columnNum: {
      type: String,
      default: () => ''
    },
    itemBoxType: {
      type: String,
      default: () => 'basic'
    },
    itemBoxSize: {
      type: String,
      default: () => 'basic'
    },
    badgeDrop: {
      type: Boolean,
      default: () => true
    },
    badgeType: {
      type: Boolean,
      default: () => true
    },
  },
  components: {
    ItemBox
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.list-item {
  display: grid;
  &.column-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  &.column-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  &.column-10 {
    grid-template-columns: repeat(10, 1fr);
  }
  .wrap-item {
    min-width: 90px;
    padding: 6px 8px 0;
    padding-bottom: 10px;
  }
}
:deep(.name) {
  min-height: 2.4em;
  line-height: 1.2;
}
</style>