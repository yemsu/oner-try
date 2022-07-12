<template>
  <div
    :class="[
      'box-item',
      item ? item.grade : '',
      `size-${size}`,
      `type-${type}`,
      {'wanted-paper': wantedPaper},
      {'round': isRoundImg}
    ]">
    <template v-if="item">
      <div class="wrap-box">
        <button
          @click="goItemPage && clickItem()"
          :title="isNoDataItem ? '클릭하여 아이템 이름을 알려주세요!' : ''"
          class="wrap-info"
          :is="goItemPage ? 'button' : 'div'"
        >
          <div class="item-box-info">
            <img v-if="wantedPaper" src="@/assets/images/wanted-text.png" class="img-wanted" alt="WANTED">
            <div class="area-img">
              <item-image 
                :item="itemImageData"
                :isRoundImg="isRoundImg"
                :isNoDataItem="isNoDataItem"
                :size="size"
              />
              <item-badges
                v-if="!onlyImg"
                :item="item"
                :wantedPaper="wantedPaper"
                :badgeDrop="badgeDrop"
                :showBadges="showBadges"
                :customBadge="customBadge"
                :innerPosition="true"
              />
            </div>
            <p v-if="!wantedPaper && showName" class="name"><span class="text">{{ item.name }}</span></p>
            <p v-if="wantedPaper && showBounty" class="bounty"><span class="text">$ {{ item.bounty || 0 }}</span></p>
            <template v-if="isPirateKing">
              <span class="crown">👑</span>
              <span class="money">💰</span>
            </template>
          </div>
        </button>
      </div>
      
      <!-- tooltip -->
      <div v-if="!noTooltip" :class="[{'tooltip': !visibleDetail}, 'area-detail']">
        <item-detail-info 
          :item="itemDetailInfoData"
          :type="itemDetailInfoType"
          bgColor="black"
        />
        <div v-if="!visibleDetail && isComp" class="wrap-sub-text">
          <p class="color-neon"><small>조합 보러가기 </small><i class="icon-arrow right small border-neon"></i></p>
        </div>
      </div>
      <div
        v-if="isActiveReportPopup" 
        class="box-item-report"
      >
        <base-input 
          category="아이템명(선박은 강화수치까지)"
          :value="inputValue"
          :focusOnMounted="true"
          size="small"
          @onUpdateInput="updateInput"
          @onEnter="enterInput"
        />
      </div>
    </template>
    <div v-else class="item-blank"></div>
  </div>
</template>


<script>
import BaseInput from '@/components/common/BaseInput.vue'
import { isOnlyNumber } from '@/plugins/utils'
import { postItemName } from '@/plugins/utils/https'
export default {
  components: {
    BaseInput
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    size: {
      type: String,
      default: () => 'basic' // small, big
    },
    type: {
      type: String,
      default: () => 'basic' // list
    },
    badgeDrop: {
      type: Boolean,
      default: () => true
    },
    showTooltip: {
      type: Boolean,
      default: () => true
    },
    visibleDetail: {
      type: Boolean,
      default: () => false
    },
    showBounty: {
      type: Boolean,
      default: () => true
    },
    showName: {
      type: Boolean,
      default: () => true
    },
    onlyImg: {
      type: Boolean,
      default: () => false
    },
    isRoundImg: {
      type: Boolean,
      default: () => false
    },
    wantedPaper: {
      type: Boolean,
      default: () => false
    },
    customBadge: {
      type: String,
      default: () => ''
    },
    showBadges: {
      type: Array,
      default: () => []
    },
    isPirateKing: {
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
    isComp() {
      return !!this.item.ingredients
    },
    isNoDataItem() {
      return isOnlyNumber(this.item.name)
    },
    noTooltip() {
      return !this.showTooltip || !this.item.dropMonster && !this.item.option
    },
    goItemPage() {
      return this.isComp || (this.isNoDataItem && !this.isRoundImg)
    },
    itemImageData() {
      const { type, id, groupName, name, grade } = this.item
      return { type, id, groupName, name, grade }
    },
    itemDetailInfoData() {
      const { dropMonster, option } = this.item
      return { dropMonster, option }
    },
    itemDetailInfoType() {
      return this.visibleDetail && this.size === 'big' ? 'list-main' : 'basic'
    },
  },
  mounted() {
    // console.log('item', this.item.name, this.item.option)
    document.addEventListener('click', e => {
      if(!this.isActiveReportPopup) return
      const targetArea = className => e.target.closest(className)
      if(!targetArea('.item')) this.isActiveReportPopup = false
    })
  },
  methods: {
    clickItem() {
      const { id, type, name } = this.item
      if(this.isNoDataItem) {
        this.isActiveReportPopup = true
        this.reportingItemId = name
        console.log('this.reportingItemId', this.reportingItemId)
        return 
      }
      this.$router.push(`/composition/${type}/${id}`)
    },
    updateInput(value) {
      this.inputValue = value
    },
    enterInput() {
      console.log('enter!', this.reportingItemId, this.inputValue)
      postItemName({ code: this.reportingItemId, name: this.inputValue })
      this.isActiveReportPopup = false
      this.inputValue = ''
      alert('감사합니다! 🤸‍♀️')
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/ItemBox.scss';
</style>