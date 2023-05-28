<template>
  <div
    :class="[
      'popup-chat',
      `mode-${isMinimize ? 'mini' : 'max'}`
    ]"
    @click="toggleMinimize"
  >
    <div v-if="!isMinimize" class="box-text-notice">
      <p>❗❗ 브라우저 새로고침 시, 파티에서 나가지니 주의하세요! ❗❗</p>
    </div>
    <div
      class="wrap-content"
      @click="blockBubbling"
    >
      <!-- slot -->
      <slot></slot>
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
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isMinimize: 'party/getIsMinimize'
    })
  },
  methods: {
    ...mapMutations({
      setIsMinimize: 'party/SET_IS_MINIMIZE'
    }),
    toggleMinimize() {
      this.setIsMinimize(!this.isMinimize)
    },
    blockBubbling(e) {
      e.stopPropagation()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/common/ChatPopup.scss';
</style>