<template>
  <div
    :class="[
      'item-img',
      `size-${size}`,
      {'round': isRoundImg},
      item.grade
  ]">
    <div
      v-if="imgSrc"
      class="box-img"
    >
      <img
        :src="imgSrc"
        :alt="item.name"
        class="img-item"
      />
    </div>
    <p
      v-else-if="isReportButton"
      class="box-img blank no-id"
    >
      <button
        @click="reportItem()"
        title="클릭하여 아이템 이름을 알려주세요!"
      >
        아이템명 알려주기 click!
      </button>
    </p>
    <p v-else-if="!isNoDataItem" class="box-img blank no-src">
      이미지 준비중
    </p>
    <p v-else class="box-img blank">
      ???
    </p>
    <!-- report popup -->
    <div
      v-if="isActiveReportPopup"
      class="box-item-report"
    >
      <base-input
        category="아이템명(선박은 강화수치까지)"
        :value="inputValue"
        size="small"
        @onUpdateInput="updateInput"
        @onEnter="enterInput"
      />
    </div>
  </div>
</template>

<script>
import BaseInput from '@/components/common/BaseInput.vue'
import { imgSrc } from '@/plugins/utils/item'
import { postItemName } from '@/plugins/utils/https'

export default {
  components: {
    BaseInput
  },
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
    },
    isComp: {
      type: Boolean,
      default: () => true
    },
    isLink: {
      type: Boolean,
      default: () => true
    },
    isBlankLink: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      isActiveReportPopup: false,
      reportingItemId: null,
      inputValue: null
    }
  },
  computed: {  
    imgSrc() {
      if(this.item.name && this.item.name.includes('류오')) {
        return imgSrc('ryuo', 'ryuo')
      }
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
    isReportButton() {
      return this.isNoDataItem && !this.isRoundImg
    },
    linkItemComposition() {
      return `/composition/${this.item.type}/${this.item.id}`
    },
  },
  mounted() {
    document.addEventListener('click', e => {
      if(!this.isActiveReportPopup) return
      const targetArea = className => e.target.closest(className)
      if(!targetArea('.item-img')) this.isActiveReportPopup = false
    })
  },
  methods: {
    checkData(key = '') {
      if(this.item[key]) console.error(`${this.item.name} has no "${key}"`)
    },
    reportItem() {
      const { name } = this.item
      this.isActiveReportPopup = true
      this.reportingItemId = name
    },
    updateInput(value) {
      this.inputValue = value
    },
    enterInput() {
      postItemName({ code: this.reportingItemId, name: this.inputValue })
      this.isActiveReportPopup = false
      this.inputValue = ''
      alert('감사합니다! 🤸‍♀️')
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/item/ItemImage.scss';
</style>