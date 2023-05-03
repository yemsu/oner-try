<template>
  <div
    :class="[
      'box-item',
      item ? item.grade : '',
      `size-${size}`,
      `type-${type}`,
      {'wanted-paper': wantedPaper},
      {'round': isRoundImg},
      {'no-padding': !padding},
    ]">
    <template v-if="item">
      <nuxt-link
        class="wrap-info"
        :to="useLink && linkItemComposition()"
        :target="linkTarget"
        :is="linkTagName"
        :title="linkTitle || (useLink && '클릭하여 조합 보러가기')"
        @click="$emit('click', item.name)"
      >
        <div class="item-box-info">
          <img v-if="wantedPaper" src="@/assets/images/wanted-text.png" class="img-wanted" alt="WANTED">
          <div class="area-img">
            <item-image 
              :item="item"
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
          <div
            v-if="!wantedPaper && showName"
            class="area-name"
          >
            <p class="name"><span class="text">{{ item.name }}</span></p>
            <bookmark-button
              v-if="useBookmark"
              category="item"
              :target="item.id"
            />
          </div>
          <p v-if="wantedPaper && showBounty" class="bounty"><span class="text">$ {{ item.bounty || 0 }}</span></p>
          <template v-if="isPirateKing">
            <span class="crown">👑</span>
            <span class="money">💰</span>
          </template>
        </div>
      </nuxt-link>
      
      <!-- tooltip -->
      <div v-if="!noTooltip" :class="[{'tooltip': !visibleDetail}, 'area-detail']">
        <item-detail-info 
          :colorMode="visibleDetail ? 'black' : 'white'"
          :options="item.option"
          :dropMonster="item.dropMonster"
          :type="itemDetailInfoType"
          :description="item.description"
        />
        <div v-if="!visibleDetail && isComp && isLink" class="wrap-sub-text">
          <p class="color-neon">
            <small>클릭하여 조합 보러가기 </small>
            <i class="icon-arrow right small border-neon" />
          </p>
        </div>
      </div>
    </template>
    <div v-else class="item-blank"></div>
  </div>
</template>


<script>
import { isOnlyNumber } from '@/plugins/utils'
import BookmarkButton from '@/components/common/BookmarkButton.vue'

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    size: {
      type: String,
      default: () => 'basic' // xsmall, small, big
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
    },
    isBlankLink: {
      type: Boolean,
      default: () => false
    },
    padding: {
      type: Boolean,
      default: () => true
    },
    buttonTitle: {
      type: String,
      default: () => ''
    },
    useBookmark: {
      type: Boolean,
      default: () => false
    },
    hasClickEvent: {
      type: Boolean,
      default: () => false
    },
  },
  components: {
    BookmarkButton
  },
  computed: {
    isComp() {
      return !!this.item.ingredients
    },
    isNoDataItem() {
      return isOnlyNumber(this.item.name)
    },
    noTooltip() {
      const noData = !this.item.dropMonster && !this.item.option
      return !this.showTooltip || noData
    },
    itemDetailInfoType() {
      return this.visibleDetail && this.size === 'big' ? 'list-main' : 'basic'
    },
    showItemBadges() {
      return !this.onlyImg && (this.showBadges.length !== 0 || this.customBadge) && !this.isNoDataItem
    },
    useLink() {
      return this.isComp && this.isLink
    },
    linkTitle() {
      return this.buttonTitle || (this.useLink && this.isBlankLink && '새창')
    },
    linkTarget() {
      return this.useLink && this.isBlankLink && '_blank'
    },
    linkTagName() {
      return this.useLink ? 'nuxt-link'
        : this.hasClickEvent ? 'button'
          : 'div'      
    }
  },
  methods: {
    clickItem() {
      const { id, type } = this.item
      this.$router.push(`/composition/${type}/${id}`)
    },
    linkItemComposition() {
      return `/composition/${this.item.type}/${this.item.id}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/ItemBox.scss';
</style>