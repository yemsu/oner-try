<template>
  <section class="wrap-content">
    <div>
      <h2>로그인</h2>
      <button v-if="!isLogin" @click="loginProcess">구글 로그인</button>
      <template v-else>
        <p>{{ userEmail }}</p>
        <p>{{ userName }}</p>
        <button @click="clickLogout()">로그아웃</button>
        <button @click="getUserNick">get nick</button>
      </template>
    </div>
  </section>

</template>

<script>
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/plugins/firebase"
import { postSocialLogin, getUserInfo } from "@/plugins/utils/https"

export default {
  data() {
    return {
      emailInputValue: '',
      userEmail: null,
      userName: null,
      isLogin: false
    }
  },
  created() {
  },
  mounted() {
    console.log('mount', localStorage.getItem('accessToken'))
    if(localStorage.getItem('accessToken')) {
      this.isLogin = true
      // 유저 이름, 이메일도 다시 받아와야함.
    }
    console.log('1.5', this.isLogin)
  },
  methods: {
    updateEmail(value) {
      this.emailInputValue = value
    },
    async loginProcess() {
      const googleLoginData = await this.googleLogin()
      this.postLoginData(googleLoginData)
    },
    async postLoginData() {
      try {
        const token = await postSocialLogin({email: this.userEmail})
        localStorage.setItem('accessToken', token)
        // localStorage.setItem('refreshToken', )
        // localStorage.setItem('expiredTime', )
        this.isLogin = true
      } catch(e) {
        console.error('postLoginData error', e)
      }
    },
    async getUserNick() {
      console.log('getUserNick')
      const nick = await getUserInfo()
      console.log('nick', nick)
    },
    async googleLogin() {
      try {
        const provider = new GoogleAuthProvider()
        const data = await signInWithPopup(auth, provider)
        console.log(data)
        this.userEmail = data.user.email
        this.userName = data.user.displayName
        return true
      } catch(e) {
        alert('팝업 차단 해제 후 로그인 해주세요!')
      }
    },
    clickLogout() {
      console.log('clickLogout', auth, auth.signOut)
      try {
        const signout = auth.signOut()
        console.log('signout', signout)

        localStorage.removeItem('accessToken')
        this.userEmail = null
        this.userName = null
        this.isLogin = false
      } catch(e) {
        console.error('로그아웃 실패')
      }
    },
  }
}
</script>

<style>
</style>