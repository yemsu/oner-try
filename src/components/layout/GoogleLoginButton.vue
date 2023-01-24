<template>
  <div v-if="!isLogin" id="googleLogin"></div>
  <button v-else id="googleLogout">로그아웃</button>
</template>

<script>
import { postGoogleCredential } from "@/plugins/utils/https"
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      authClientId: process.env.AuthClientId
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
    }),
  },
  mounted() {
    setTimeout(this.initGoogleLogin, 200);
  },
  methods: {
    ...mapMutations({
      setIsLogin: 'auth/SET_IS_LOGIN'
    }),
    initGoogleLogin() {
      google.accounts.id.initialize({
        client_id: this.authClientId,
        callback: this.onSignIn,
        context: 'signin'
      })
      console.log('this.authClientId, ', this.authClientId)
      // render button
      google.accounts.id.renderButton(
        document.getElementById('googleLogin'),
        { 
          type: 'standard',
          size: 'small',
          text: 'signin',
          shape: 'rectangular',
          logo_alignment: 'center',
          width: 60
        }
      )

      console.log('google.accounts.id', google.accounts.id)
    },
    async onSignIn(googleUser) {
      console.log('googleUser', googleUser)
      const res = await postGoogleCredential({ idToken: googleUser.credential})
      console.log("res", res)
      
      switch (res.type) {
        case 'join':
          localStorage.setItem('GCID', googleUser.credential)
          this.$router.push('/join')
          break;
        case 'login':
          localStorage.setItem('JUID', res.token)
          this.setIsLogin(true)
          this.$router.push('/')
          break;
        case 'ban':
          console.log('login_limit', res.login_limit)
          break;
        default:
          console.error('onSignIn: 로그인 결과 응답 type 확인 필요')
          break;
      }
    },
  }
}
</script>

<style>
</style>