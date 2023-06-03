<template>
  <div class="top-slide-popup">
    <Transition name="slideUp">
      <div 
        v-if="show"
        class="popup"
      >
        <layout-content-wrap size="basic" pd-top="none" :use-ads="false">
          <section class="wrap-popup-content">
            <h3 class="ir-hidden">{{ popupTitle }}</h3>
            <slot name="content"></slot>
          </section>
          <div
            v-if="buttonType"
            class="wrap-btns"
          >
            <element-button
              type="square-round"
              bg="cancel"
              @click="$emit('cancel')"
            >
              취소
            </element-button>
            <element-button
              v-if="buttonType === 'confirm'"
              type="square-round"
              bg="point"
              @click="$emit('submit')"
            >
              확인
            </element-button>
          </div>
        </layout-content-wrap>
      </div>
    </Transition>
    <Transition name="fade">
      <div
        v-if="show"
        class="dim"
        @click="$emit('close')"
      ></div>
    </Transition>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    popupTitle: {
      type: String,
      required: true
    },
    buttonType: {
      type: String,
      default: () => '' // confirm
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.top-slide-popup {
  .popup {
    overflow-y: auto;
    position: fixed;
    top: var(--header-height);
    left: 0;
    z-index: $popup-z-index;
    width: 100%;
    max-height: calc(100% - var(--header-height));
    padding: 20px 0 30px;
    background-color: var(--bg-body);
    @include scrollBar;
  }
  .wrap-btns {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    grid-column-start: 1;
    grid-column-end: 3;
    text-align: center;
  }
  .dim {
    position: fixed;
    top: 0;
    left: 0;
    z-index: $dim-z-index;
    width: 100%;
    height: 100%;
    background-color: var(--bg-popup-dim);
  }
}
</style>