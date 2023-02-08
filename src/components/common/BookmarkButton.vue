<template>
  <button
    :class="[
      'button-bookmark',
      isBookmarked && 'is-active'
    ]"
    @click="clickBookmark"
  >
    즐겨찾기
  </button>
</template>

<script>
import { postUserBookmark } from '@/plugins/utils/https'

export default {
  props: {
    category: {
      type: String,
      default: () => ''
    },
    target: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      isBookmarked: false
    }
  },
  mounted() {

  },
  methods: {
    async clickBookmark() {
      await postUserBookmark({
        category: this.category,
        target: this.target
      })
      this.isBookmarked = true
    }
  }
}
</script>

<style lang="scss" scoped>
.button-bookmark {
  &.is-active {
    background-color: yellow;
  }
}
</style>