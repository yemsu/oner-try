<template>
  <header>
    <h1 class="logo"><nuxt-link to="/">ONER TRY</nuxt-link></h1>
    <nav class="gnb">
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
$menu-padding-v: 10px;
header {
  display: flex;
  align-items: center;
  position: fixed;
  z-index: 99;
  width: 100%;
  background-color: var(--bg-dark);
  padding: 0 10px;
  font-weight: 300;
  .logo {
    font-size: 18px;
    letter-spacing: 0.05em;
    a {
      padding: $menu-padding-v 15px;
      color: var(--color-white);
    }
  }
  .gnb {
    display: flex;
    a {
      padding: $menu-padding-v 10px;
      color: rgba(255, 255, 255, 0.8);
      &.nuxt-link-active {
        color: #333;
        font-weight: 500;
        background-color: var(--bg-light-point-200);
      }
    }
  }
  .menu-util {
    display: flex;
    margin-left: auto;
    a {
      padding: $menu-padding-v 5px;
      font-size: 0.9em;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>