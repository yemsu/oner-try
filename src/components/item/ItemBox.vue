<template>
  <div
    :class="[
      'item',
      item ? item.grade : '',
      `size-${size}`,
      `type-${type}`,
      {'wanted-paper': wantedPaper},
      {'round': roundImg}
    ]">
    <template v-if="item">
      <div class="wrap-box">
        <button
          v-if="isComp(item) || (isNoDataItem(item) && !this.roundImg)"
          @click="clickItem(item)"
          :title="isNoDataItem(item) ? '클릭하여 아이템 이름을 알려주세요!' : ''"
          class="wrap-info"
        >
          <item-box-info
            :item="item"
            :isComp="isComp(item)"
            :wantedPaper="wantedPaper"
            :isNoDataItem="isNoDataItem(item)"
            :badgeDrop="badgeDrop"
            :showType="showType"
            :showName="showName"
            :showBounty="showBounty"
            :onlyImg="onlyImg"
            :roundImg="roundImg"
            :customBadge="customBadge"
          />
        </button>
        <item-box-info
          v-else
          :item="item"
          :isComp="isComp(item)"
          :wantedPaper="wantedPaper"
          :isNoDataItem="isNoDataItem(item)"
          :badgeDrop="badgeDrop"
          :showType="showType"
          :showName="showName"
          :showBounty="showBounty"
          :onlyImg="onlyImg"
          :roundImg="roundImg"
          :customBadge="customBadge"
        />
      </div>
      
      <!-- tooltip -->
      <div v-if="!noTooltip(item)" :class="[{'tooltip': !visibleDetail}, 'area-detail']">
        <dl class="details">
          <div v-if="item.dropMonster">
            <dt class="color-drop">획득처</dt>
            <dd>{{ item.dropMonster }}</dd>
          </div>
          <template v-if="item.option">
            <div
              v-for="(option, i) in item.option"
              :key="`itemOption${i}`"
            >
              <dt class="color-option">{{ getOption(option, 'title') }}</dt>
              <dd>+{{ Object.values(option)[0] }} {{ getOption(option, 'unit') }}</dd>
            </div>
          </template>
        </dl>
        <div v-if="!visibleDetail && isComp(item)" class="wrap-sub-text">
          <p class="color-neon"><small>조합 보러가기 </small><i class="icon-arrow right small border-neon"></i></p>
        </div>
      </div>
      <div
        v-if="isActiveReportPopup" 
        class="popup"
        style="position: absolute; bottom: 0; left: 0; z-index: 999; transform: translateY(50%);"
      >
        <base-input 
          category="아이템명(선박은 강화수치까지)"
          :value="inputValue"
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
import { getOptionTitle, getOptionUnit } from '@/plugins/utils/item'
import { isOnlyNumber } from '@/plugins/utils'
import { postItemName } from '@/plugins/utils/https'
import ItemBoxInfo from './ItemBoxInfo.vue'
export default {
  components: {
    ItemBoxInfo,
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
    badgeType: {
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
    showType: {
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
    roundImg: {
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
  },
  data() {
    return {
      isActiveReportPopup: false,
      reportingItemId: null,
      inputValue: null
    }
  },
  mounted() {
    document.addEventListener('click', e => {
      if(!this.isActiveReportPopup) return
      const targetArea = className => e.target.closest(className)
      if(!targetArea('.item')) this.isActiveReportPopup = false
    })
  },
  methods: {
    isNoDataItem(item) {
      return isOnlyNumber(item.name)
    },
    getOption(option, optionType) {
      const key = Object.keys(option)[0]
      switch (optionType) {
        case 'title':
          return getOptionTitle(key);
        case 'unit':
          return getOptionUnit(key);      
      }
    },
    noTooltip(item) {
      return !this.showTooltip || !item.dropMonster && !item.option
    },
    isComp(item) {
      return !!item.ingredients
    },
    clickItem(item) {
      console.log('clickItem')
      const {id, type} = item
      if(this.isNoDataItem(item)) {
        this.isActiveReportPopup = true
        this.reportingItemId = item.name
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/ItemBox.scss';
</style>