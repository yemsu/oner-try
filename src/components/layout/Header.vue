<template>
  <header>
    <h1 class="logo"><nuxt-link to="/">ONER TRY</nuxt-link></h1>
    <nav class="gnb">
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
  </header>
</template>

<style lang="scss" scoped>
@import '@/assets/style/components/layout/Header.scss';
</style>