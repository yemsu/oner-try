<template>
  <div
    :class="[
      'popup-chat',
      `mode-${isMinimize ? 'mini' : 'max'}`
    ]"
  >
    <div class="wrap-content">
      <slot :isMinimize="isMinimize"></slot>
      <element-button
        class="button-toggle-size"
        type="text"
        size="medium"
        @click="toggleMinimize"
        :title="isMinimize ? '확장' : '축소'"
      >
        <font-awesome-icon
          :icon="isMinimize ? 'fa-solid fa-arrow-up-right-from-square' : 'fa-down-left-and-up-right-to-center'"
        />
        <template v-if="!isMinimize">
          채팅방 {{ isMinimize ? '확장' : '축소' }}
        </template>
      </element-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMinimize: false
    }
  },
  methods: {
    toggleMinimize() {
      this.isMinimize = !this.isMinimize
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/common/ChatPopup.scss';
</style>