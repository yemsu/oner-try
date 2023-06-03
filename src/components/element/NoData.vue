<template>
  <div class="box-no-data">
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      text: '데이터가 존재하지 않습니다.'
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.box-no-data {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  max-height: 100%;
  padding: 0 20px;
  background-color: var(--bg-light-gray);
  font-size: var(--font-size-MS);
  color: var(--font-gray);
  word-break: keep-all;
}
</style>