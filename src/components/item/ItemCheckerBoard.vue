<template>
  <div v-show="showBg" class="area-bg">
    <div
      v-for="(item, i) in bgItems"
      :key="`bgItem${i}`"
      class="img-bg"
      :style="i > 44 && i < 53 && 'opacity: 0;'"
    >
      <div 
      :style="`background-image: url(${imgSrc(item)});`"></div>
    </div>
  </div>
</template>

<script>
import { imgSrc } from '@/plugins/utils/item'

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
  computed: {
    bgItems() {
      return this.items.filter(item => item.type !== 'etcItem').splice(0, 15 * 9)
    }
  },
  methods: {
    imgSrc(item) {
      const { type, imageName } = item
      console.log("item", item)
      return imgSrc(type, imageName)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/ItemCheckerBoard.scss';
</style>