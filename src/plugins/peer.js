import Vue from "vue"
import { Peer } from "peerjs";
import Beep from '@/plugins/utils/beep';

Vue.prototype.peer = Peer

class $Peer {
  constructor() { // peerId는 닉네임
    this.peerId = null
    this.$peer = null
    this.connections = []
    this.isBeepMuted = false
    this.$beep = new Beep(this.isBeepMuted)
    this.CHECK_REFRESH_FLAG_COMMON = `onertrychatroomRefreshflag`
    this.CHECK_REFRESH_FLAG = null
    // -------------------------------------
  }

  setCustomEvents({
    onOpenPeer = () => {},
    afterOnConnect = () => {},
    onReceiveMsg = () => {},
    onMemberLeave = () => {},
    onDuplicateTap = () => {},
  }) {
    this.onOpenPeer = onOpenPeer
    this.afterOnConnect = afterOnConnect
    this.onReceiveMsg = onReceiveMsg
    this.onMemberLeave = onMemberLeave
    this.onDuplicateTap = onDuplicateTap
  }
  createPeer(peerId) {
    if(this.$peer) {
      this.$peer = null
    }

    this.peerId = peerId
    this.CHECK_REFRESH_FLAG = this.CHECK_REFRESH_FLAG_COMMON + peerId
    this.$peer = new Vue.prototype.peer(this.peerId, {
      host: process.env.PEER_SERVER,
      secure: true
    })
    
    this.$peer.on('error', (error) => this.handlerError(error))
    this.$peer.on('open', (peerId) => {
      console.log('피어 열림', peerId)
      this.onOpenPeer()
    })
    this.$peer.on('connection', (connection) => {
      this.subscribeMember(connection)
    })
  }
  isAlreadyConnected(peerId) {
    const alreadyConnected = this.connections.find(({peer}) => peer === peerId)
    console.log('alreadyConnected', this.connections, peerId, alreadyConnected)
    return alreadyConnected
  }
  startConnecting(memberId, label) {
    console.log('방에 들어왔고', memberId, label)
    const connection = this.$peer.connect(memberId, {
      label
    })
    console.log('와서 멤버들에게 커넥션을 요청한다.', connection.peer)
    this.subscribeMember(connection)
  }
  subscribeMember(connection) {
    const peerId = connection.peer
    // 동시에 여러명이 입장할 경우 커넥션 여러번 추가 되는 이슈 있어 체크
    // if(this.isAlreadyConnected(connection.peer) && !this.checkRefreshFlag()) {
    //   console.log('이미 연결된 멤버. 구독은 따로 안한다.', this.connections)
    // } else {
    // }
    console.log('멤버 구독을 시작한다.', { connection })
    if(!this.isAlreadyConnected(connection.peer)) { 
      console.log('새멤버!', this.connections, )
      this.connections.push(connection)
      connection.on('open',() => {
        console.log('멤버와 연결됐다.', peerId)
        // if(this.checkRefreshFlag()) {  // open에 flag 존재하면 새로고침임
        //   console.log('유저가 새로고침을 했다', peerId)
        //   this.deleteRefreshFlag()
        // }
        if(Vue.prototype.$utils.checkAdmin(peerId)) {
          return
        }
        this.afterOnConnect(peerId)
        this.beepReceiveMessage('chopa2')
      })
      // return
    }  else {
      
      console.log('이미 연결된 멤버. 구독은 따로 안한다.', this.connections)
    }

    connection.on("data", (message) => {
      console.log('message', message)
      this.onReceiveMsg(peerId, message)
      this.beepReceiveMessage('jigun')
    });
    
    connection.on('close', () => {
      console.log('멤버와 연결이 끊겼다. 커넥션 리스트를 정리하자', peerId)
      // // 새로고침 체크를 위해 플래그 저장
      // this.setRefreshFlag()

      // // 새로고침이라면 open 에서 플래그가 지워진다.
      // // 고로 플래그가 1.5초 뒤에도 존재한다면 유저와 커넥션을 종료한다.
      // setTimeout(() => {
      //   console.log('checkRefreshFlag()', this.checkRefreshFlag())
        // if(this.checkRefreshFlag()) {
          console.log('유저가 나갔구나', peerId)
          this.removeConnection(peerId)
          this.onMemberLeave(peerId)
          this.beepReceiveMessage('chopa1')
        // }
      // }, 1500);
    })
    
    connection.on('disconnected', () => {
      console.log('connection disconnected', connection.peer)
    })
  }
  removeConnection(peerId) {
    console.log('유저와의 연결을 종료한다', peerId)
    this.connections = this.connections.filter(({peer}) => peer !== peerId)
  }
  destroyPeer() {
    console.log("destroyPeer", !!this.$peer)
    if(!this.$peer) return
    this.$peer.destroy()
    this.$peer = null
    this.connections = []
  }
  disconnectAll() {
    console.log("연결을 모두 끊는다.")
    // this.$peer.disconnect() // 연결 껐따가 다시 연결하면 멤버 나갔다 들어왔을때 연결이안됨.
    this.connections = []
  }
  handlerError(error) {
    console.error('PEERJS ERROR: ', {error})
    console.error(error.message)
    if(error.type === 'unavailable-id') {
      // 채팅방에서 새 탭을 열었을때
      this.onDuplicateTap()
    }
    if(error.type === 'network') {
      console.log("서버와 연결이 끊겼습니다. 페이지를 새로고침 해주세요.")
    }
    if(error.type === 'peer-unavailable') {
      const peerId = error.message.split('to peer ')[1]
      console.log(`유저와 연결이 끊겼습니다. ${peerId}`)
      this.removeConnection(peerId)
      this.onNoticeMemberLeave(peerId)
    }
  }
  beepReceiveMessage(audioName) {
    // chopa1 - 퇴장
    // chopa2 - 입장
    // jigun - 채팅
    this.$beep.beep(audioName)
  }
  changeBeepVolume() {
    console.log('changeBeepVolume', this.$beep)
    this.$beep.changeVolume()
  }
  setRefreshFlag() {
    sessionStorage.setItem(this.CHECK_REFRESH_FLAG, '1')
    console.log('setRefreshFlag!', sessionStorage.getItem(this.CHECK_REFRESH_FLAG))
  }
  checkRefreshFlag() {
    console.log('checkRefreshFlag', sessionStorage.getItem(this.CHECK_REFRESH_FLAG))
    return sessionStorage.getItem(this.CHECK_REFRESH_FLAG)
  }
  deleteRefreshFlag() {
    sessionStorage.removeItem(this.CHECK_REFRESH_FLAG)
  }
}

Vue.prototype.$Peer = new $Peer()