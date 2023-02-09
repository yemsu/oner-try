<template>
  <div>
    <div v-show="!isLogin" id="googleLogin"></div>
    
    <div v-show="isLogin" class="wrap-dropdown" >
      <button v-if="userInfo.siteNick" class="btn-dropdown" @click="isShowLoginMenu = !isShowLoginMenu">💀 {{ userInfo.siteNick }}</button>
      <div v-if="isShowLoginMenu" class="menu-dropdown">
        <button @click="onClickLogout('로그아웃이 완료되었습니다.')">로그아웃</button>
      </div>
    </div>
  </div>
</template>

<script>
import { postGoogleCredential, setDefaultHeader } from "@/plugins/utils/https"
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
      console.log('isLogin : ', 'crr', crr, 'prev', prev)
      // 회원 가입 페이지에서 isLogin값 true로 하면 여기서 로그인 처리
      if(crr && crr !== prev) this.fnLogin()
    },
    $route(crr, prev) {
      this.checkLoginExpired()
    }
  },
  async mounted() {
    this.initGoogleLogin()
    // setTimeout(, 0);
    const jToken = localStorage.getItem('JUID')
    if(jToken) {
      console.log('mounted')
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
      setDefaultHeader('Authorization', jToken)
      console.log('setIsLogin', this.isLogin)
      const userInfo = await this.getUserInfo()
      console.log('this.userInfo', this.userInfo, this.userInfo.siteNick)
      !userInfo && this.onClickLogout()
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
          this.setIsLogin(true)
          break;
        case 'ban':
          console.log('login_limit', res.login_limit)
          break;
        default:
          console.error('onClickLogin: 로그인 결과 응답 type 확인 필요')
          break;
      }
    },
    onClickLogout(alertMsg) {
      localStorage.removeItem('JUID')
      this.setIsLogin(false)
      this.setUserInfo({})
      if(this.isShowLoginMenu) this.isShowLoginMenu = false
      setTimeout(() => {
        this.renderGoogleLoginBtn()
      }, 100);
      if(this.$route.path.includes('/auth/')) this.$router.push('/')
      alertMsg && alert(alertMsg)
    },
    checkLoginExpired() {
      if(!this.isLogin || this.userInfo.expireTime > Date.now()) return
      this.onClickLogout('로그인 시간이 만료되었습니다.')
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