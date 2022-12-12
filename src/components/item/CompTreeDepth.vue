<template>
  <div :class="`area-depth depth-${depthIndex}`">
    <div
      v-for="(item, i) in items"
      :key="`ingredient-${i}`"
      class="wrap-items"
    >
      <div class="item-main">
        <item-box
          :item="item"
          :size="itemSize"
          :showBadges="['howGet', 'requiredNumber']"
        />
      </div>
      <slot :props="{ ingredients: item && item.ingredients, index: i }"></slot>
    </div>
  </div>
</template>

<script>
import ItemBox from '@/components/item/ItemBox.vue'
export default {
  components: {
    ItemBox
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    depthIndex: {
      type: Number,
      default: () => 0
    },
    itemSize: {
      type: String,
      default: () => 'small'
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/CompTreeDepth.scss';
</style>