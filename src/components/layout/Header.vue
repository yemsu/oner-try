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
      <li>
        <google-login-button
          @handleCredential="successLogin"
        />
      </li>
      <li><a href="https://cafe.naver.com/onepiecerpg/595" target="_blank" title="새창">맵/확장팩 다운로드</a></li>
      <!-- <li><router-link to="/join">회원가입</router-link></li> -->
    </ul>
  </header>
</template>

<script>
import BaseInput from '@/components/common/BaseInput.vue'
import GoogleLoginButton from '@/components/login/GoogleLoginButton.vue'

export default {
  components: {
    GoogleLoginButton,
    BaseInput,
  },
  computed: {
    loginURI() {
      return process.env.BASE_URL + '/'
    },
  },
  methods: {
    successLogin(jti) {
      console.log('successLogin', jti)

    },
  }
}
</script> 

<style lang="scss" scoped>
@import '@/assets/style/components/layout/Header.scss';
</style>