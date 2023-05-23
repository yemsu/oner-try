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
    this.CHECK_REFRESH_FLAG = `onertrychatroomRefreshflag_${this.peerId}`
    // -------------------------------------
    this.peerOnOpen = () => {}
    this.afterOnConnect = () => {}
    this.afterCloseConnection = () => {}
    this.onReceiveMsg = () => {}
    this.afterDestroyPeer = () => {}
  }

  init(peerId, {
    peerOnOpen,
    afterOnConnect,
    afterCloseConnection,
    onReceiveMsg,
    afterDestroyPeer,
  }) {
    this.peerId = peerId
    this.peerOnOpen = peerOnOpen
    this.afterOnConnect = afterOnConnect
    this.afterCloseConnection = afterCloseConnection
    this.onReceiveMsg = onReceiveMsg
    this.afterDestroyPeer = afterDestroyPeer

    this.createPeer()
  }
  createPeer() {
    if(this.$peer) {
      this.$peer = null
    }

    this.$peer = new Vue.prototype.peer(this.peerId, {
      host: process.env.PEER_SERVER,
      secure: true
    })

    console.log('피어 생성', this.$peer)
    
    this.$peer.on('error', (error) => this.handlerError(error))
    this.$peer.on('open', (_peerId) => this.peerOnOpen(_peerId))
    this.$peer.on('connection', (connection) => this.subscribeMember(connection))
  }
  isAlreadyConnected(_connectionId) {
    const alreadyConnected = this.connections.find(({connectionId}) => connectionId === _connectionId)
    console.log('alreadyConnected', this.connections, _connectionId)
    return alreadyConnected
  }
  startConnecting(memberId) {
    console.log('this.connections1', this.connections)
    console.log('방에 들어왔고', memberId)
    const connection = this.$peer.connect(memberId)
    console.log('와서 멤버들에게 커넥션을 요청한다.', memberId)
    this.subscribeMember(connection)
  }
  subscribeMember(connection) {
    console.log('멤버 구독을 시작한다.', connection)
    const peerId = connection.peer
    if(this.isAlreadyConnected(connection.connectionId)) {
      if(this.checkRefreshFlag()) {  // open에 flag 존재하면 새로고침임
        console.log('아? 새로고침이였구나', peerId)
        this.deleteRefreshFlag()
      }
      return
    }
    console.log('this.connections', this, this.connections)
    this.connections.push(connection)
    connection.on('open',() => {
      console.log('멤버와 연결됐다.', peerId)
      if(this.checkRefreshFlag()) {  // open에 flag 존재하면 새로고침임
        console.log('나는 새로고침을 했다', peerId)
        this.deleteRefreshFlag()
      }
      if(Vue.prototype.$utils.checkAdmin(peerId)) {
        return
      }
      this.afterOnConnect(peerId)
      this.beepReceiveMessage('chopa2')
    })

    connection.on("data", (message) => {
      console.log('message', message)
      this.onReceiveMsg(peerId, message)
      this.beepReceiveMessage('jigun')
    });
    
    connection.on('close', () => {
      console.log('멤버와 연결이 잠깐 끊겼다.', peerId)
      this.connections = this.connections.filter(({peer}) => peer !== peerId)
      // 새로고침 체크를 위해 플래그 저장
      this.setRefreshFlag()
      console.log('setRefreshFlag', this.checkRefreshFlag())
      // 새로고침이라면 open 에서 플래그가 지워진다.
      // 고로 플래그가 1.5초 뒤에도 존재한다면 유저와 커넥션을 종료한다.
      setTimeout(() => {
        console.log('checkRefreshFlag()', this.checkRefreshFlag())
        if(this.checkRefreshFlag()) {
          console.log('유저가 나갔구나', peerId)
          this.deleteRefreshFlag()
          this.closeConnection(connection.peer)
          this.beepReceiveMessage('chopa1')
        }
      }, 2000);
    })
    
    connection.on('disconnected', () => {
      console.log('connection disconnected', connection.peer)
    })
  }
  closeConnection(peerId) {
    console.log('유저와의 연결을 종료한다', peerId)
    this.connections.filter(({peer}) => peer !== peerId)
    this.afterCloseConnection(peerId)
  }
  destroyPeer() {
    if(!this.$peer) return
    this.$peer.destroy()
    this.$peer = null
    this.afterDestroyPeer(this.peerId)
  }
  handlerError(error) {
    console.error('PEERJS ERROR: ', {error})
    console.error(error.message)
    if(error.type === 'unavailable-id') {
      const newPeerID = error.message.split('"')[1] + `NEW_PEER_ID_1`
      console.log('newPeerID', newPeerID)
    }
    if(error.type === 'network') {
      console.log("서버와 연결이 끊겼습니다. 재연결을 시작합니다.")
      this.$peer.reconnect()
    }
  }
  beepReceiveMessage(audioName) {
    // chopa1 - 퇴장
    // chopa2 - 입장
    // jigun - 채팅
    this.$beep.beep(audioName)
  }
  changeBeepVolume() {
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