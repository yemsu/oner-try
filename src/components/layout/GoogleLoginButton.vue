<template>
  <div>
    <div v-show="!isLogin" :id="buttonId"></div>
    
    <div v-show="isLogin" class="wrap-dropdown" >
      <button
        v-if="userInfo && userInfo.siteNick"
        class="btn-dropdown"
        @click="showUserDropdown = !showUserDropdown"
      >💀 {{ userInfo.siteNick }} <span class="icon-caret"></span></button>
      <div v-if="showUserDropdown" class="menu-dropdown">
        <button @click="onClickLogout('로그아웃이 완료되었습니다.')">로그아웃</button>
        <button v-if="isDevEnv" @click="onClickDelete()">회원탈퇴</button>
      </div>
    </div>
  </div>
</template>

<script>
import { postGoogleCredential, setDefaultHeader, deleteUser } from "@/plugins/utils/https"
import Https from "@/plugins/utils/https-new"
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  props: {
    isInPage: {
      type: Boolean,
      default: () => false
    },
  },
  data() {
    return {
      authClientId: process.env.AuthClientId,
      showUserDropdown: false,
      jToken: null,
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      userInfo: 'auth/getUserInfo',
    }),
    isDevEnv() {
      return process.env.NODE_ENV === 'development'
    },
    buttonId() {
      return this.isInPage ? 'googleLoginInPage' : 'googleLogin'
    }
  },
  watch: {
    isLogin(crr, prev) {
      console.log('isLogin : ', 'crr', crr, 'prev', prev, 'userInfo', this.userInfo)
      // 회원 가입 페이지에서 isLogin값 true로 하면 여기서 로그인 처리
      if(crr) {
        !this.userInfo && this.fnLogin()
      }
    },
    $route(crr, prev) {
      this.checkLoginExpired()
    }
  },
  async mounted() {
    if(this.isInPage) {
      setTimeout(() => {
        this.renderGoogleLoginBtn()
        this.initGoogleOneTap()
      }, 200);
      return
    }
    this.jToken = sessionStorage.getItem('JUID')
    this.initGoogleLogin()
    this.sendJTokenToNewTab()
    // setTimeout(, 0);
    if(this.jToken) {
      console.log('GoogleLoginButton mounted')
      this.fnLogin()
    } else {
      setTimeout(() => {
        this.renderGoogleLoginBtn()
      }, 200);
      // 로그인 상태에서 새 탭으로 열었을때, 탭끼리 로그인 상태 공유 후 체크하여 실행될 수 있도록 setTimeout 설정
      setTimeout(() => {
        if(this.jToken) return
        this.initGoogleOneTap()
      }, 1000)
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
    sendJTokenToNewTab() {
      const TRIGGER_NAME = 'trigger--new-tab'
      
      // 기존 탭
      addEventListener('storage', (e) => { 
        const { storageArea: { JUID }, newValue } = e
        if(!newValue) return // when remove trigger data
        const needSend = this.jToken && !JUID
        const needReceive = !this.jToken && JUID
        console.log(e.key ,':' ,{ newValue } ," at " ,e.url)
        if(needSend) {
          console.log("needSend!")
          localStorage.setItem('JUID', this.jToken)
        } else if (needReceive) {
          console.log("receive!")
          this.setJToken(localStorage.getItem('JUID'))
          localStorage.removeItem('JUID')
          this.fnLogin()
        }
      });
      // 새 탭에서 storage 이벤트 실행을 위해
      localStorage.setItem(TRIGGER_NAME, '1')
      localStorage.removeItem(TRIGGER_NAME)
    },
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
      const size = this.isInPage ? 'big' : 'small'
      const text = this.isInPage ? '' : 'signin'
      google.accounts.id.renderButton(
        document.getElementById(this.buttonId),
        { 
          type: 'standard',
          size,
          text,
          shape: 'rectangular',
          logo_alignment: 'center',
          width: 60
        }
      )
    },
    async fnLogin() {
      if(!this.jToken) {
        this.jToken = sessionStorage.getItem('JUID')
      }
      Https.prototype.jToken = this.jToken
      setDefaultHeader('Authorization', this.jToken)
      const userInfo = await this.getUserInfo()
      console.log('fnLogin userInfo', { userInfo }, this.isLogin)
      if(userInfo === 'not found token') {
        console.error('getUserInfo : no Authorization : ', this.jToken)
      }
      if(userInfo) {
        this.setIsLogin(true)
        this.fnEventSource()
      } else {
        this.onClickLogout()
      }
    },
    fnEventSource() {
      // const subscribeUrl = 
      const eventSource = new EventSource(`${process.env.API_PATH}/sub`);
      console.log('eventSource',eventSource)
      eventSource.onopen = () => {
        console.log('연결 성공');
      };
      // eventSource.onmessage = (event) {
      //     console.log('이벤트 수신:', event.data);
      //     // 수신한 이벤트 데이터 처리 로직을 여기에 작성
      // };
      eventSource.onerror = (error) => {
        console.log('에러:', error);
      };
      eventSource.onclose = () => {
        console.log('연결 종료');
      };
      eventSource.addEventListener("addComment", (event) => {
        const message = event.data;
        console.log('message', message)
        this.showAlarmNotification("채팅방  생성", message);
      })
      eventSource.addEventListener("error", (event) => {
        eventSource.close()
      })
    },
    showAlarmNotification(title, body) {
      // 브라우저가 알림을 지원하는지 확인
      if (!("Notification" in window)) {
        console.log("브라우저가 알림을 지원하지 않습니다.");
        return;
      }
      // 사용자에게 알림 권한 요청
      Notification.requestPermission().then((permission) => {
        console.log('permission', permission, title, body)
        if (permission === "granted") {
          // 알림 생성
          new Notification(title, {body});
        }
      });
    },
    async onClickLogin(googleUser) {
      console.log('googleUser', googleUser)
      const res = await postGoogleCredential({ idToken: googleUser.credential})
      console.log("res", res)
      
      switch (res.type) {
        case 'join':
          sessionStorage.setItem('GCID', googleUser.credential)
          this.$router.push('/join')
          break;
        case 'login':
          this.setJToken(res.token)
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
    setJToken(token) {
      this.jToken = token
      sessionStorage.setItem('JUID', token)
    },
    onClickLogout(alertMsg) {
      // 토큰값 제거
      sessionStorage.removeItem('JUID')
      // store user data reset
      this.setIsLogin(false)
      this.setUserInfo(null)
      // render google login button
      setTimeout(() => {
        this.renderGoogleLoginBtn()
      }, 100);
      // 로그인 관련 페이지에서 로그아웃 했다면 메인으로 이동
      if(this.$route.path.includes('/my') || this.$route.path.includes('/party')) this.$router.push('/')
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
#googleLoginInPage {
  width: 206px;
  height: 38px;
}
#googleLog {
  height: 44px;
}
.wrap-dropdown {
  position: relative;
  .btn-dropdown {
    padding-right: 4px;
  }
  .menu-dropdown {
    position: absolute;
    top: var(--header-site-menu-height);
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