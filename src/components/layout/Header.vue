<template>
  <header>
    <div class="menu-bar site">
      <h1 class="logo"><nuxt-link to="/"><main-logo /></nuxt-link></h1>
      <nav>
        <h2 class="ir-hidden">ONER TRY 게임 메뉴</h2>
        <nuxt-link to="/">원피스 RPG</nuxt-link>
        <!-- <a href="https://mrpg.onertry.fun">꿈 RPG</a> -->
      </nav>
      <div class="area-side-menu">
        <google-login-button />
      </div>
    </div>
    <top-menu-bar
      title="원피스 RPG 사이트 메뉴"
      :menuList="siteMenuList"
      class="game-menu"
    >
      <element-toggle-button
        :is-on="isCreatePartyAlarmOn"
        button-text="파티 생성 알림"
        :icon-name="['fa-bell', 'fa-bell-slash']"
        @click="toggleCreatePartyAlarm"
      />
      <element-button
        link-to="https://m16tool.xyz/Game/ONERPG/Download/Index"
        type="square-round"
      >
        맵/확장팩 다운로드
      </element-button>
    </top-menu-bar>
  </header>
</template>

<script>
import GoogleLoginButton from './GoogleLoginButton.vue'
import MainLogo from '../common/MainLogo.vue';
import TopMenuBar from '../common/TopMenuBar.vue';
import { getPermissionIsGranted, getSavedAlarmSetting, requestPermission, saveAlarmSetting } from '../../plugins/utils/chatRoom';

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
          path: '/item-build/my',
          menuName: 'MY 빌드',
        },
        {
          path: '/party',
          menuName: '파티모집',
          beta: true
        },
      ],
      isCreatePartyAlarmOn: false
    }
  },
  async mounted() {
    const isSavedSettingOn = getSavedAlarmSetting()
    let isCreatePartyAlarmOn = true
    if(isSavedSettingOn) {
      isCreatePartyAlarmOn = await getPermissionIsGranted()
    }
    this.isCreatePartyAlarmOn = isSavedSettingOn &&isSavedSettingOn === isCreatePartyAlarmOn
  },
  methods: {
    async toggleCreatePartyAlarm() {
      let isGranted = true
      if(!this.isCreatePartyAlarmOn) {
        isGranted = await requestPermission()
      }
      if(!isGranted) return
      this.isCreatePartyAlarmOn = !this.isCreatePartyAlarmOn
      saveAlarmSetting(this.isCreatePartyAlarmOn)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/layout/Header.scss';
</style>