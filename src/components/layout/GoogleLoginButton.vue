<template>
  <div>
    <div v-show="!isLogin" id="googleLogin"></div>
    
    <div v-show="isLogin" class="wrap-dropdown" >
      <button v-if="userInfo.name" class="btn-dropdown" @click="isShowLoginMenu = !isShowLoginMenu">💀 {{ userInfo.name }}</button>
      <div v-if="isShowLoginMenu" class="menu-dropdown">
        <button @click="onClickLogout({ useAlert: true })">로그아웃</button>
      </div>
    </div>
  </div>
</template>

<script>
import { postGoogleCredential } from "@/plugins/utils/https"
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      authClientId: process.env.AuthClientId,
      isShowLoginMenu: false
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      userInfo: 'auth/getUserInfo',
    }),
  },
  watch: {
    isLogin(crr, prev) {
      if(crr && crr !== prev) this.fnLogin()
    }
  },
  async mounted() {
    this.initGoogleLogin()
    // setTimeout(, 0);
    const jToken = localStorage.getItem('JUID')
    if(jToken) {
      this.fnLogin()
    } else {
      setTimeout(() => {
        this.initGoogleOneTap()
        this.renderGoogleLoginBtn()
      }, 200);
    }
  },
  methods: {
    ...mapMutations({
      setIsLogin: 'auth/SET_IS_LOGIN',
      setUserInfo: 'auth/SET_USER_INFO'
    }),
    ...mapActions({
      getUserInfo: 'auth/GET_USER_INFO'
    }),
    initGoogleLogin() {
      google.accounts.id.initialize({
        client_id: this.authClientId,
        callback: this.onClickLogin,
        context: 'signin'
      })
    },
    initGoogleOneTap() {
      google.accounts.id.prompt()
    },
    renderGoogleLoginBtn() {
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
    },
    async fnLogin() {
      const jToken = localStorage.getItem('JUID')
      this.setIsLogin(true)
      console.log('setIsLogin', this.isLogin)
      const userInfo = await this.getUserInfo(jToken)
      console.log('this.userInfo', this.userInfo, this.userInfo.name)
      !userInfo && this.onClickLogout({ useAlert: false })
    },
    async onClickLogin(googleUser) {
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
          this.fnLogin()
          break;
        case 'ban':
          console.log('login_limit', res.login_limit)
          break;
        default:
          console.error('onClickLogin: 로그인 결과 응답 type 확인 필요')
          break;
      }
    },
    onClickLogout({ useAlert }) {
      localStorage.removeItem('JUID')
      this.setIsLogin(false)
      this.setUserInfo({})
      if(this.isShowLoginMenu) this.isShowLoginMenu = false
      setTimeout(() => {
        this.renderGoogleLoginBtn()
      }, 100);
      if(this.$route.path.includes('/auth/')) this.$router.push('/')
      useAlert && alert('로그아웃이 완료되었습니다.')
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-dropdown {
  position: relative;
  .menu-dropdown {
    position: absolute;
    top: 40px;
    left: 50%;
    min-width: 100%;
    text-align: center;
    background-color: var(--bg-dark);
    transform: translateX(-50%);
    > button, a {
      width: 80px;
      text-align: center;
    }
  }
}
</style>