<template>
  <div
    :class="[
      'item-img',
      `size-${size}`,
      `type-${imgType}`,
      item && `grade-${item.grade}`
  ]">
    <div v-if="!item" class="item-blank"></div>
    <div
      v-else-if="imgSrc"
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
    imgType: {
      type: String,
      default: 'square' // square-round, round
    },
    isNoDataItem: {
      type: Boolean,
      default: () => false
    },
    size: {
      type: String,
      default: () => 'medium'
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
      const { type, imageName } = this.item
      return imgSrc(type, imageName)
    },
    isReportButton() {
      return this.isNoDataItem && this.imgType !== 'round'
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