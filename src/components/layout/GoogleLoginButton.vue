<template>
  <div id="googleButton"></div>
</template>

<script>
import { postGoogleCredential } from "@/plugins/utils/https"

export default {
  data() {
    return {
      authClientId: process.env.AuthClientId
    }
  },
  mounted() {
    setTimeout(this.initGoogleLogin, 200);
  },
  methods: {
    initGoogleLogin() {
      google.accounts.id.initialize({
        client_id: this.authClientId,
        callback: this.onSignIn,
        context: 'signin'
      })
      console.log('this.authClientId, ', this.authClientId)
      // render button
      google.accounts.id.renderButton(
        document.getElementById('googleButton'),
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
      console.log('onSignIn')
      console.log('googleUser', googleUser)
      const res = await postGoogleCredential({ idToken: googleUser.credential})
      console.log("res", res)
      
      switch (res.type) {
        case 'join':
          console.log('join')
          break;
        case 'login':
          localStorage.setItem('JUID', res.token)
          console.log('set cookie', localStorage.getItem('JUID'))
          break;
        case 'ban':
          console.log('login_limit', res.login_limit)
          break;
        default:
          console.error('onSignIn: 로그인 결과 응답 type 확인 필요')
          break;
      }
    }
  }
}
</script>

<style>
</style>