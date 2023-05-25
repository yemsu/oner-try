<template>
  <div class="common-chat">chat</div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      peer: null,
      connections: [],
      beep: null,
      willLeave: false,
      refreshChecker: `onertrychatroomRefreshflag`,
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      nickname: 'auth/getNickname',
      chatRoom: 'party/getChatRoom',
      connections: 'peer/getConnections',
      peer: 'peer/getPeer',
      beep: 'peer/getBeep',
    }),
  },
  mounted() {
    setTimeout(async () => {
      if(!this.nickname) {
        this.willLeave = true
        this.$router.push({ name: 'auth-login' })
        return
      }

      // 화면에 멤버 추가.
      const getChatRoomRes = await this.getChatRoom(this.chatRoom.id)
      if(!getChatRoomRes) {
        alert('멤버 업데이트에 실패했습니다! 새로 고침을 해주세요.')
        return
      }
      // 피어가 없어? 새로 만들어.
      if(!this.peer) {
        console.log("피어가 없어? 새로 만들어.")
        this.createPeer()
      }
    }, 500);
  },
  methods: {
    ...mapMutations({
      changeChatRoomState: 'party/CHANGE_CHAT_ROOM',
      deleteMemberState: 'party/DELETE_MEMBER',
      addMember: 'party/ADD_MEMBER',
      setToastMessage: 'toastPopup/SET_MESSAGE',
      setToastOn: 'toastPopup/SET_IS_TRIGGER_ON',
    }),
    ...mapActions({
      postMember: 'party/POST_MEMBER',
      getChatRoom: 'party/GET_CHAT_ROOM',
      deleteMember: 'party/DELETE_MEMBER',
      deleteChatRoom: 'party/DELETE_CHAT_ROOM',
      putChatRoom: 'party/PUT_CHAT_ROOM',
    }),
    createPeer() {
      console.log(11)
      this.peer = new this.$Peer(this.nickname, {
        host: process.env.PEER_SERVER,
        secure: true
      })
      this.peer.on('error', this.onError)
      this.peer.on('on', this.onOpen)
      this.peer.on('connection', this.onConnection)
      this.peer.on('disconnected', (connection) => {
        console.log('disconnected!', connection)
      })
      this.refreshChecker += this.nickname
    },
    onOpen() {
      console.log('onOpenPeer',this.memberNicks)
      if(this.memberNicks.length > 0) {      
        this.hereIAm()
        for(const memberId of this.memberNicks) {
          console.log('피어 입장', this.chatRoom.id, this.connections)
          console.log('방에 들어왔고', memberId, this.chatRoom.id)
          const connection = this.peer.connect(memberId, {
            label: this.chatRoom.id
          })
          console.log('와서 멤버들에게 커넥션을 요청한다.', connection.peer)
          this.subscribeMember(connection)
        }
      } else { // 
        this.pushChatMessage(null, `방을 개설하였습니다.`)
      }
    },
    async hereIAm() {
      // 새로고침 체크 - 서버 멤버에 내가 없어? 다시 보내야지.
      const postMemberRes = await this.postMember(this.chatRoom.id)
      console.log('postMemberRes', postMemberRes)
      if(postMemberRes === 'full') {
        alert(this.$ALERTS.CHAT.PARTY_FULL)
        this.goPartyList()
        return
      }
      if(postMemberRes === 'existed') {
        alert(this.$ALERTS.CHAT.USER_EXISTED)
        this.goPartyList()
        return
      }
    },
    subscribeMember(connection) {
      const peerId = connection.peer
      if(!this.isAlreadyConnected(connection.peer)) { 
        console.log('dfsdf')
        this.addConnection(connection)
        connection.on('open',() => {
          console.log('멤버와 연결됐다.', peerId)
          // if(this.checkRefreshFlag()) {  // open에 flag 존재하면 새로고침임
          //   console.log('유저가 새로고침을 했다', peerId)
          //   this.deleteRefreshFlag()
          // }
          if(this.$utils.checkAdmin(peerId)) {
            return
          }
          this.afterOnConnect(peerId)
          this.beepReceiveMessage('chopa2')
        })
      } else {
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
    },
    onReceiveMsg(peerId, message) {
      if(message.includes(this.TITLE_EDIT_MESSAGE)) {
        const newTitle = message.split(this.TITLE_EDIT_MESSAGE)[1]
        this.receiveChangeTitleMsg(newTitle)
        return 
      } 
      if(message.includes(this.KICK_OUT_MESSAGE)) {
        const memberName = message.split(this.KICK_OUT_MESSAGE)[1]
        this.receiveKickOutMsg(memberName)
        return 
      }
      if(message.includes(this.USER_LEAVE_MESSAGE)) {
        const peerId = message.split(this.USER_LEAVE_MESSAGE)[1]
        this.onMemberLeave(peerId)
        return 
      }
      this.pushChatMessage(peerId, message)
    },
    onMemberLeave(peerId) {
      console.log('onMemberLeave')
      if(this.willLeave) return
      this.deleteMemberState(peerId)
      this.removeConnection(peerId)
      this.pushChatMessage(null, `${peerId}님이 방을 나가셨습니다.`)
      if(this.chatRoom.host === peerId) {
        const newHostName = this.chatRoom.members[0].nickname
        this.changeChatRoomState({
          host: newHostName
        })
        // 책임지고 다음 방장이 서버에 데이터 전송
        if(newHostName === this.nickname) {
          console.log('다음 방장?', )
          this.onEditChatRoom({
            host: newHostName
          })
        }
        this.pushChatMessage(null, `👑 ${newHostName}님이 방장이 되셨습니다!`)
      }
    },
    isAlreadyConnected(peerId) {
      return this.connections.find(({peer}) => peer === peerId)
    },
    beepReceiveMessage(audioName) {
      // chopa1 - 퇴장
      // chopa2 - 입장
      // jigun - 채팅
      this.beep.beep(audioName)
    },
    destroyPeer() {
      this.peer.destroy()
      this.resetPeer()
    },
    resetPeer() {      
      this.peer = null
      this.connections = []
    },
    addConnection(connection) {
      this.connections = [...this.connections, connection]
    },
    removeConnection(peerId) {
      this.connections = this.connections = this.connections.filter(({peer}) => peer !== peerId)
    },
    handlerExistedUser() {
      alert(this.$ALERTS.CHAT.USER_EXISTED)
      this.goPartyList()
    },
    goPartyList() {
      this.willLeave = true
      this.$router.push({ name: 'party' })
    },
    onError(error) {
      console.error('PEERJS ERROR: ', {error})
      console.error(error.message)
      const isHandled = this.handleError(error)
      if(isHandled) return
      if(error.type === 'unavailable-id') {
        // "ID "sssjsjj1" is taken"
        // 채팅방에서 새 탭을 열었을때
        this.handlerExistedUser()
        return
      }
      this.onPeerError(error)
    },
    onPeerError(error) {
      this.peerError = error
    },
  },
}
</script>

<style>
</style>