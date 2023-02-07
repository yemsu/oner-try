<template>
  <header>
    <div class="menu-bar site">
      <h1 class="logo"><nuxt-link to="/"><main-logo /></nuxt-link></h1>
      <nav>
        <h2 class="ir-hidden">사이트 메뉴</h2>
        <a href="https://onertry.fun" class="is-active">원피스 RPG</a>
        <a href="https://mrpg.onertry.fun">꿈 RPG</a>
      </nav>
      <ul class="menu-util">
        <li><google-login-button /></li>
      </ul>
    </div>
    <div class="menu-bar game">
      <!-- <h2 class="logo"><nuxt-link to="/">ONER TRY</nuxt-link> </h2> -->
      <nav>
        <h2 class="ir-hidden">사이트 메뉴</h2>
        <nuxt-link to="/character">캐릭터</nuxt-link>
        <nuxt-link to="/composition">조합법</nuxt-link>
        <nuxt-link to="/ranking">랭킹</nuxt-link>
        <nuxt-link to="/items">아이템도감</nuxt-link>
        <!-- <nuxt-link to="/build">빌드툴</nuxt-link> -->
        <!-- <nuxt-link to="/other">다른 메뉴</nuxt-link> -->
      </nav>
      <ul class="menu-util">
        <li><a href="https://cafe.naver.com/onepiecerpg/595" target="_blank" title="새창">맵/확장팩 다운로드</a></li>
        <!-- <li><router-link to="/join">회원가입</router-link></li> -->
      </ul>
    </div>
  </header>
</template>

<script>
import GoogleLoginButton from './GoogleLoginButton.vue'
import MainLogo from '../common/MainLogo.vue';

export default {
  components: {
    GoogleLoginButton,
    MainLogo
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/layout/Header.scss';
</style>