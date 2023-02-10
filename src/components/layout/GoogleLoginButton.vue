<template>
  <div>
    <div v-show="!isLogin" id="googleLogin"></div>
    
    <div v-show="isLogin" class="wrap-dropdown" >
      <button
        v-if="userInfo && userInfo.siteNick"
        class="btn-dropdown"
        @click="showUserDropdown = !showUserDropdown"
      >💀 {{ userInfo.siteNick }} <span class="icon-caret"></span></button>
      <div v-if="showUserDropdown" class="menu-dropdown">
        <button @click="onClickLogout('로그아웃이 완료되었습니다.')">로그아웃</button>
        <!-- <button @click="onClickDelete()">회원탈퇴</button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { postGoogleCredential, setDefaultHeader, deleteUser } from "@/plugins/utils/https"
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      authClientId: process.env.AuthClientId,
      showUserDropdown: false
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
      console.log('isLogin : ', 'crr', crr, 'prev', prev, 'userInfo', this.userInfo)
      // 회원 가입 페이지에서 isLogin값 true로 하면 여기서 로그인 처리
      if(crr && crr !== prev && !this.userInfo) this.fnLogin()
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
      console.log('GoogleLoginButton mounted')
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
      const userInfo = await this.getUserInfo()
      console.log('userInfo', userInfo, this.isLogin)
      userInfo ? this.setIsLogin(true) : this.onClickLogout()
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
      // 토큰값 제거
      localStorage.removeItem('JUID')
      localStorage.removeItem('GCID')
      // store user data reset
      this.setIsLogin(false)
      this.setUserInfo({})
      // render google login button
      setTimeout(() => {
        this.renderGoogleLoginBtn()
      }, 100);
      // 로그인 관련 페이지에서 로그아웃 했다면 메인으로 이동
      if(this.$route.path.includes('/auth/')) this.$router.push('/')
      // 로그아웃 후 alert message 있다면 띄우기
      alertMsg && alert(alertMsg)
      // user dropdown 메뉴 열려있다면 닫기
      if(this.showUserDropdown) this.showUserDropdown = false
    },
    checkLoginExpired() {
      console.log('checkLoginExpired', this.userInfo?.expireTime, this.userInfo?.expireTime <= Date.now())
      if(this.userInfo?.expireTime <= Date.now()) {
        this.onClickLogout('로그인 시간이 만료되었습니다.')
      }
    },
    async onClickDelete() {
      const res = await deleteUser()
      if(res.data === 'success') {
        this.onClickLogout()
        alert('탈퇴 완료')
      } else {
        console.error('onClickDelete', res)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-dropdown {
  position: relative;
  .btn-dropdown {
    padding-right: 4px;
  }
  .menu-dropdown {
    $menu-bar-height: 36px;
    position: absolute;
    top: $menu-bar-height;
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