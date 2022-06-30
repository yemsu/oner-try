<template>
  <div v-if="showBg" class="area-bg">
    <div
      v-for="(item, i) in items.filter(item => item.type !== 'etcItem')"
      :key="`bgItem${i}`"
      class="img-bg"
      :style="i > 48 && i < 56 && 'opacity: 0;'"
    >
      <div 
      :style="`background-image: url(${imgSrc(item)});`"></div>
    </div>
  </div>
</template>

<script>
import { imgSrc } from '@/plugins/item'

export default {
  props: {
    showBg: {
      type: Boolean,
      default: () => true
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    imgSrc(item) {
      const { type, id } = item
      return imgSrc(type, id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/ItemCheckerBoard.scss';
</style>