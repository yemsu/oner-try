<template>
  <header>
    <h1 class="logo"><NuxtLink to="/">ONER TRY</NuxtLink></h1>
    <nav class="gnb">
      <NuxtLink to="/character">캐릭터</NuxtLink>
      <NuxtLink to="/composition">조합법</NuxtLink>
      <!-- <NuxtLink to="/other">다른 메뉴</NuxtLink> -->
    </nav>
    <!-- <ul class="menu-util">
      <li><NuxtLink to="/login">로그인</NuxtLink></li>
      <li><NuxtLink to="/join">회원가입</NuxtLink></li>
    </ul> -->
  </header>
</template>

<style lang="scss" scoped>
$menu-padding-v: 10px;
header {
  display: flex;
  align-items: center;
  position: fixed;
  z-index: 1;
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