<template>
  <aside class="floating">
    <router-link to="/party" title="파티모집 바로가기">
      <h2 class="title">🎉 파티모집이 <br> 오픈되었습니다!</h2>
      <div class="box-img">
        <img src="/images/party-mini-sample.jpg" alt=""></img>
      </div>
    </router-link>
  </aside>
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
.floating {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 120px;
  right: 15px;
  z-index: $ad-z-index + 1;
  padding: 10px;
  border: 2px solid rgb(29, 228, 178);
  border-radius: 10px;
  background-color: var(--color-white);
  box-shadow: 5px 5px 10px var(--color-shadow);
  text-align: center;
  .title {
    font-size: var(--font-size-S);
    font-weight: var(--font-weight-B);
    line-height: 1.2;
  }
  .box-img {
    overflow: hidden;
    margin-top: 5px;
    border-radius: 5px;
  }
}
</style>