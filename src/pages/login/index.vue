<template>
  <section>
    <h2>로그인</h2>
    <input type="text" v-model="userEmailValue">
    <input type="password" v-model="userPasswordValue">
    <template v-if="!isLogin">
      <button @click="onClickLogin('google')">구글 로그인</button>
      <button @click="onClickLogin('github')">깃헙 로그인</button>
    </template>
    <template v-else>
      <p>{{ userEmail }}</p>
      <p>{{ userName }}</p>
      <button @click="onClickLogout()">로그아웃</button>
    </template>
  </section>

</template>

<script>
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/plugins/firebase"

export default {
  data() {
    return {
      userEmailValue: '',
      userPasswordValue: '',
      userEmail: null,
      userName: null,
      isLogin: false
    }
  },
  methods: {
    async onClickLogin(serviceName) {
      const LoginData = await this.snsPopupLogin(serviceName)      
      if(!LoginData) return
      this.isLogin = true
      this.userEmail = LoginData.user.email
      this.userName = LoginData.user.displayName
    },
    async snsPopupLogin(serviceName) {
      let provider
      if(serviceName === 'google') {
        provider = new GoogleAuthProvider()
      } else if(serviceName === 'github') {
        provider = new GithubAuthProvider()
      }

      try {
        const res = await signInWithPopup(auth, provider)
        return res
      } catch(e) {
        if(e.code.includes('popup-blocked')) {
          alert('팝업 차단 해제 후 로그인 해주세요!')
        } else {
          console.error('snsPopupLogin : ', e, e.code)
        }
      }    
    },
    onClickLogout() {
      try {
        auth.signOut()
        this.isLogin = false
        this.userEmail = null
        this.userName = null
      } catch(e) {
        console.error('로그아웃 실패 : ', e)
      }
    },
  }
}
</script>