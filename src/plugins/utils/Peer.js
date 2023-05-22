import Vue from "vue"
import Beep from '@/plugins/utils/beep';

class $Peer {
  constructor(peerId, {
    peerOnOpen,
    afterOnConnect,
    afterCloseConnection,
    onReceiveMsg,
    afterDestroyPeer,
  }) { // peerId는 닉네임
    this.peerId = peerId
    this.connections = []
    this.$peer = null
    this.isBeepMuted = false
    this.$beep = new Beep(this.isBeepMuted)
    // -------------------------------------
    this.peerOnOpen = peerOnOpen
    this.afterOnConnect = afterOnConnect
    this.afterCloseConnection = afterCloseConnection
    this.onReceiveMsg = onReceiveMsg
    this.afterDestroyPeer = afterDestroyPeer

    this.init()
  }

  init() {
    this.createPeer()
    this.$peer.on('error', (error) => this.handlerError(error))
    this.$peer.on('open', (peerId) => this.peerOnOpen(peerId))
    this.$peer.on('connection', (connection) => this.subscribeMember(connection))
  }
  createPeer() {
    if(this.$peer) {
      this.$peer = null
    }
    this.$peer = new Vue.prototype.$Peer(this.peerId, {
      host: process.env.PEER_SERVER,
      secure: true
    })
    console.log('createPeer', this.$peer)
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
      if(checkRefreshFlag()) {  // open에 flag 존재하면 새로고침임
        console.log('아? 새로고침이였구나', peerId)
        deleteRefreshFlag()
      }
      return
    }
    console.log('this.connections', this, this.connections)
    this.connections.push(connection)
    connection.on('open',() => {
      console.log('멤버와 연결됐다.', peerId)
      if(checkRefreshFlag()) {  // open에 flag 존재하면 새로고침임
        console.log('나는 새로고침을 했다', peerId)
        deleteRefreshFlag()
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
      setRefreshFlag()
      console.log('setRefreshFlag', checkRefreshFlag())
      // 새로고침이라면 open 에서 플래그가 지워진다.
      // 고로 플래그가 1.5초 뒤에도 존재한다면 유저와 커넥션을 종료한다.
      setTimeout(() => {
        console.log('checkRefreshFlag()', checkRefreshFlag())
        if(checkRefreshFlag()) {
          console.log('유저가 나갔구나', peerId)
          deleteRefreshFlag()
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
}

const CHECK_REFRESH_FLAG = 'onertrychatroomRefreshflag'
function setRefreshFlag() {
  sessionStorage.setItem(CHECK_REFRESH_FLAG, '1')
  console.log('setRefreshFlag!', sessionStorage.getItem(CHECK_REFRESH_FLAG))
}
function checkRefreshFlag() {
  console.log('checkRefreshFlag', sessionStorage.getItem(CHECK_REFRESH_FLAG))
  return sessionStorage.getItem(CHECK_REFRESH_FLAG)
}
function deleteRefreshFlag() {
  sessionStorage.removeItem(CHECK_REFRESH_FLAG)
}

export default $Peer
