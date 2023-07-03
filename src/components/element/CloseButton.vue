<template>
  <div class="box-close-button">
    <element-button
      type="text"
      size="large"
      title="팝업 닫기"
      @click="$emit('click')"
    >
      <font-awesome-icon icon="fa-xmark" />
    </element-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.box-close-button {
  button {
    padding: 5px;
    line-height: 1;
  }
}
</style>