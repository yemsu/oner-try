<template>
  <section class="box-search">
    <h2 class="ir-hidden">검색</h2>
    <div class="wrap-search">
      <section class="items-match">
        <h2 class="title-list"> 검색 순위 <span>TOP 10</span></h2>
        <div
          v-for="(i) in 10"
          :key="`matchingData${i}`"
          class="item-match"
        >
          <p v-if="showRankingList" class="number-ranking">{{ i }}</p>
          <base-skeleton
            v-if="isItem"
            type="img"
            size="small"
          />
          <span :class="isItem ? 'button-item' : 'button-keyword'">
            <base-skeleton />
          </span>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import BaseSkeleton from '@/components/common/BaseSkeleton.vue'

export default {
  components: {
    BaseSkeleton
  },
  props: {
    showRankingList: {
      type: Boolean,
      default: true
    },
    isItem: {
      type: Boolean,
      default: false
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/SearchBox.scss';
</style>