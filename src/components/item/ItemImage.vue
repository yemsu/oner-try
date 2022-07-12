<template>
  <div 
    :class="[
      'item-img',
      `size-${size}`,
      {'round': isRoundImg},
      item.grade
    ]">
    <div v-if="imgSrc" class="box-img">
      <img
        :src="imgSrc"
        :alt="item.name"
        class="img-item"
      />
    </div>
    <p v-else-if="isNoDataItem && !isRoundImg" class="box-img blank no-id">
      아이템명 알려주기 click!
    </p>
    <p v-else-if="!isNoDataItem" class="box-img blank no-src">
      이미지 준비중
    </p>
    <p v-else class="box-img blank">
      ???
    </p>
</div>
</template>

<script>
import { imgSrc } from '@/plugins/utils/item'
export default {
  props: {
    item: {
      type: Object,
      default: () => null
    },
    isRoundImg: {
      type: Boolean,
      default: () => false
    },
    isNoDataItem: {
      type: Boolean,
      default: () => false
    },
    size: {
      type: String,
      default: () => 'basic'
    }
  },
  data() {
    return {
    }
  },
  computed: {    
    imgSrc() {
      const { type, id, groupName } = this.item
      
      const data = [type, id]
      data.forEach(key => {
        this.checkData(key) 
        return ''
      })
      const imgName = groupName || id
      // return ``
      return imgSrc(type, imgName)
    },
  },
  methods: {
    checkData(key = '') {
      if(this.item[key]) console.error(`${this.item.name} has no "${key}"`)
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/item/ItemImage.scss';
</style>