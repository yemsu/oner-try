import Vue from "vue"
import { Peer } from "peerjs";
import Beep from '@/plugins/utils/beep';

Vue.prototype.$Peer = Peer

const $Peer = new Vue({
  data: {
    peer: null,
    connections: [],
    isBeepMuted: false,
    beep: new Beep(),
    CHECK_REFRESH_FLAG_COMMON: `onertrychatroomRefreshflag`,
    CHECK_REFRESH_FLAG: null,
  },
  methods: {
    changeBeepVolume() {
      console.log('changeBeepVolume', this.beep)
      this.beep.changeVolume()
    },
    setRefreshFlag() {
      sessionStorage.setItem(this.CHECK_REFRESH_FLAG, '1')
      console.log('setRefreshFlag!', sessionStorage.getItem(this.CHECK_REFRESH_FLAG))
    },
    checkRefreshFlag() {
      console.log('checkRefreshFlag', sessionStorage.getItem(this.CHECK_REFRESH_FLAG))
      return sessionStorage.getItem(this.CHECK_REFRESH_FLAG)
    },
    deleteRefreshFlag() {
      sessionStorage.removeItem(this.CHECK_REFRESH_FLAG)
    }
  }
})

// Vue.prototype.$Peer = $Peer