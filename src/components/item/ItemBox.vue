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
          class="wrap-info"
          @click="isLink && clickItem()"
          :is="isLink ? 'button' : 'div'"
        >
          <div class="item-box-info">
            <img v-if="wantedPaper" src="@/assets/images/wanted-text.png" class="img-wanted" alt="WANTED">
            <div class="area-img">
              <item-image 
                :item="itemImageData"
                :isRoundImg="isRoundImg"
                :isNoDataItem="isNoDataItem"
                :size="size"
                :isComp="isComp"
                :isLink="false"
              />
              <item-badges
                v-if="showItemBadges"
                :item="item"
                :wantedPaper="wantedPaper"
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
          :options="item.option"
          :dropMonster="item.dropMonster"
          :type="itemDetailInfoType"
        />
        <div v-if="!visibleDetail && isComp" class="wrap-sub-text">
          <p class="color-neon"><small>조합 보러가기 </small><i class="icon-arrow right small border-neon"></i></p>
        </div>
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
    },
    isLink: {
      type: Boolean,
      default: () => true
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
    itemImageData() {
      const { type, id, groupName, name, grade } = this.item
      return { type, id, groupName, name, grade }
    },
    itemDetailInfoType() {
      return this.visibleDetail && this.size === 'big' ? 'list-main' : 'basic'
    },
    showItemBadges() {
      return !this.onlyImg && (this.showBadges.length !== 0 || this.customBadge) && !this.isNoDataItem
    }
  },
  methods: {
    clickItem() {
      const { id, type } = this.item
      this.$router.push(`/composition/${type}/${id}`)
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/ItemBox.scss';
</style>