<template>
  <div v-if="isVisible" class="area-popup" @click="$emit('close')">
    <section class="popup" @click="blockBubbling">
      <h2 class="title">{{ title }}</h2>
      <p class="desc">{{ message }}</p>
      <div class="box-close-button">
        <element-button
          type="text"
          size="large"
          title="팝업 닫기"
          @click="$emit('close')"
        >
          <font-awesome-icon icon="fa-xmark" />
        </element-button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: '팝업'
    },
    message: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  methods: {
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
  max-width: 400px;
  padding: $padding-padding-pc;
  background-color: var(--bg-body);
  border-radius: 10px;
  .title {
    
  }
  .desc {
    
  }
}
.box-close-button {
  position: absolute;
  top: calc((#{$padding-padding-pc} - 5px) / 2);
  right: calc((#{$padding-padding-pc} - 5px) / 2);
  button {
    padding: 5px;
    line-height: 1dvh;
  }
}
</style>