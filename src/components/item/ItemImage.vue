<template>
  <div>
    <div
      :class="[
        'item-img',
        `size-${size}`,
        {'round': isRoundImg},
        item.grade
      ]">
      <button
        v-if="imgSrc"
        @click="goItemPage && clickItem()"
        class="box-img"
        :is="goItemPage ? 'button' : 'div'"
      >
        <img
          :src="imgSrc"
          :alt="item.name"
          class="img-item"
        />
      </button>
      <p
        v-else-if="isNoDataItem && !isRoundImg"
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
  </div>
</template>

<script>
import BaseInput from '@/components/common/BaseInput.vue'
import { imgSrc } from '@/plugins/utils/item'
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
    goItemPage() {
      return this.isComp || (this.isNoDataItem && !this.isRoundImg)
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
    clickItem() {
      const { id, type } = this.item
      this.$router.push(`/composition/${type}/${id}`)
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