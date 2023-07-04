<template>
  <div
    v-if="isVisible"
    class="area-popup"
    @click="$emit('close')"
  >
    <section
      class="popup"
      @click="blockBubbling"
    >
      <h2 v-if="content.title" class="title">{{ content.title }}</h2>
      <p v-if="content.message" class="desc">{{ content.message }}</p>
      <common-wrap-buttons>
        <element-button
          type="square-round"
          bg="point"
          @click="toggleIsVisible"
        >
          확인
        </element-button>
      </common-wrap-buttons>
      <element-close-button
        @click="toggleIsVisible"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isVisible: 'popup/getIsVisible',
      content: 'popup/getContent'
    })
  },
  methods: {
    ...mapMutations({
      toggleIsVisible: 'popup/TOGGLE_IS_VISIBLE'
    }),
    blockBubbling(e) {
      e.stopPropagation()
    }
  }
}
</script>

<style lang="scss" scoped>
$padding-padding-pc: 30px;
$padding-padding-mo: 10px;
.area-popup {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: $dim-z-index;
  width: 100%;
  height: 100%;
  background-color: var(--bg-popup-dim);
}
.popup {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  min-width: 300px;
  padding: $padding-padding-pc;
  background-color: var(--bg-body);
  border-radius: 10px;
  text-align: center;
  .title {
  }
  .desc {
  }
}
.box-close-button {
  position: absolute;
  top: calc((#{$padding-padding-pc} - 5px) / 2);
  right: calc((#{$padding-padding-pc} - 5px) / 2);
}
</style>