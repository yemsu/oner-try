<template>
  <header>
    <div class="menu-bar site">
      <h1 class="logo"><nuxt-link to="/"><main-logo /></nuxt-link></h1>
      <nav>
        <h2 class="ir-hidden">ONER TRY 게임 메뉴</h2>
        <nuxt-link to="/my/build" class="is-active">꿈 RPG</nuxt-link>
        <a href="https://onertry.fun">원피스 RPG</a>
      </nav>
      <div class="area-side-menu">
        <google-login-button />
      </div>
    </div>
    <top-menu-bar
      title="원피스 RPG 사이트 메뉴"
      :menuList="siteMenuList"
      :sideMenuList="siteSideMenuList"
      class="game-menu"
    />
  </header>
</template>

<script>
import GoogleLoginButton from './GoogleLoginButton.vue'
import MainLogo from '../common/MainLogo.vue';
import TopMenuBar from '../common/TopMenuBar.vue';

export default {
  components: {
    GoogleLoginButton,
    MainLogo,
    TopMenuBar
  },
  data() {
    return {
      siteMenuList: [
        {
          path: '/character',
          menuName: '캐릭터',
        },
        {
          path: '/composition',
          menuName: '조합법',
        },
        {
          path: '/ranking',
          menuName: '랭킹',
        },
        {
          path: '/items',
          menuName: '아이템도감',
        },
        {
          path: '/my/item-setting',
          menuName: '목표 아이템 설정',
        },
      ],
      siteSideMenuList: [
        {
          path: 'https://cafe.naver.com/onepiecerpg/595',
          menuName: '맵/확장팩 다운로드'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/layout/Header.scss';
</style>