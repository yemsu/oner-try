<template>
  <div :class="['card-list-content', { 'no-gap': !bottomInfo && showDeleteButton}]">
    <button
      :is="tagName"
      :to="linkUrl"
      :title="linkTitle"
      @click="tagName === 'button' && $emit('click', id)"
    >
      <div class="wrap-info">
        <div class="wrap-info-top">
          <div class="wrap-text-sub">
            <p :class="['character', { 'no-title' :!title}]">{{ topInfo.left }}</p>
            <p>{{ topInfo.right }}</p>
          </div>
          <div v-if="title" class="wrap-text-main">
            <div class="text-main">
              <p class="title">{{ title }}</p>
              <p v-if="description" class="desc">{{ description }}</p>
            </div>
          </div>
        </div>
        <ul class="list-item-name">
          <li
            v-for="({ text, color }, i) in badgeList"
            :key="`savedItem${i}`"
          >
            <element-badge
              type="round"
              size="small"
              :color="color"
            >{{ text }}</element-badge>
          </li>
        </ul>
      </div>
    </button>
    <slot name="titleRightButton"></slot>
    <div v-if="bottomInfo || showDeleteButton" class="wrap-info-bottom">
      <div v-if="bottomInfo" class="box-left">
        <p
          v-for="(left, i) in bottomInfo.leftContents"
          :key="`bottomLeftContent${i}`"
          :title="left.title"
        >
          {{ left.text }}
        </p>
      </div>
      <element-button
        v-if="showDeleteButton"
        size="small"
        color="cancel"
        class="btn-delete"
        title="공유 빌드에서 삭제하기"
        @click="$emit('delete', id)"
      >
        삭제
      </element-button>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    requiredData: {
      type: Object,
      required: true
    },
    tagName: {
      type: String,
      default: 'nuxt-link'
    },
    linkUrl: {
      type: String,
      default: () => null
    },
    linkTitle: {
      type: String,
      default: '자세히 보기'
    },
    topInfo: {
      type: Object,
      default: () => null
    },
    bottomInfo: {
      type: Object,
      default: () => null
    },
    showDeleteButton: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
    }
  },
  computed: {
    id() {
      return this.requiredData.id
    },
    title() {
      return this.requiredData.title
    },
    description() {
      return this.requiredData.description
    },
    badgeList() {
      return this.requiredData.badgeList
    },  
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/common/CardListContent.scss';
</style>