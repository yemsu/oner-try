<template>
  <div class="wrap-peer" v-if="peer">
    <slot :peer="{
      peer,
      beep,
      chatMessages,
      sendMessage,
      onClickKickOut,
      onEditTitle,
      onClickExit,
      peerError,
    }"></slot>
  </div>
</template>

<script>
import Beep from '@/plugins/utils/beep';
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      peer: null,
      peerId: null,
      connections: [],
      beep: null,
      willLeave: false, // 나가는 사람 본인인지 체크하는 플래그 - 커넥션 끊겨도 채팅방 업데이트 할 필요 없음
      kickOutMember: null,
      chatMessages: [],
      titleInput: '',
      refreshChecker: `onertrychatroomRefreshflag`,
      TITLE_EDIT_MESSAGE: '%TITLE_EDIT_MESSAGE%',
      KICK_OUT_MESSAGE: '%KICK_OUT_MESSAGE%',
      USER_LEAVE_MESSAGE: '%USER_LEAVE_MESSAGE%',
      peerError: null,
      isMemberKickedOut: false,
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      nickname: 'auth/getNickname',
      chatRoom: 'party/getChatRoom',
    }),
    isHost() {
      return this.chatRoom?.host === this.nickname
    },
    memberNicks() {
      console.log("memberNicks", this.chatRoom.members)
      return this.chatRoom.members
        .filter(({nickname}) => nickname !== this.nickname)
        .map(({nickname}) => nickname)
    }
  },
  watch: {
    isLogin(crr) {
      if(!crr) {
        this.destroyPeer()
        if(this.$route.path === '/party/room') this.goPartyList()
      }
    },
  },
  mounted() {
    setTimeout(() => {
      // 화면에 멤버 추가.
      this.updateChatroom()
      // 피어가 없어? 새로 만들어.
      if(!this.peer) {
        console.log("피어가 없어? 새로 만들어.")
        this.createPeer()
      }

      window.addEventListener('unload', this.onUnload)
      window.addEventListener('beforeunload', this.confirmClose)
    }, 500);
  },
  beforeDestroy() {    
    window.removeEventListener('unload', this.onUnload);
    window.removeEventListener('beforeunload', this.confirmClose);
  },
  methods: {
    ...mapMutations({
      changeChatRoomState: 'party/CHANGE_CHAT_ROOM',
      deleteMemberState: 'party/DELETE_MEMBER_STATE',
      addMember: 'party/ADD_MEMBER',
      setChatRoom: 'party/SET_CHAT_ROOM',
      removeDisconnectedMember: 'party/REMOVE_DISCONNECTED_MEMBER',
      addDisconnectedMember: 'party/ADD_DISCONNECTED_MEMBER',
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
    async updateChatroom() {
      console.log('updateChatroom', this.chatRoom)
      if(!this.chatRoom) return
      const res = await this.getChatRoom(this.chatRoom.id)
      if(!res) {
        alert('멤버 업데이트에 실패했습니다! 새로 고침을 해주세요.')
        return
      }
        console.log("getChatRoom res.", res, this.chatRoom)
    },
    createPeer() {
      if(!this.peerId) this.peerId = this.nickname
      console.log('createPeer', this.peerId)
      this.peer = new this.$Peer(this.peerId, {
        host: process.env.PEER_SERVER,
        secure: true
      })
      console.log('peer created', this.peer.id, this.peer,)
      this.beep = new Beep()
      this.peer.on('error', this.onError)
      this.peer.on('open', this.onOpen)
      this.peer.on('connection', this.subscribeMember)
      this.peer.on('disconnected', (peerId) => {
        console.log('disconnected!', peerId)
      })
      this.peer.on('close', (peerId) => {
        console.log('peer close!', this.peer, peerId)
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
        // 혼자 방에 있는데 새로고침 한 경우
        if(this.chatRoom.members.length === 0) {
          this.hereIAm()
        }
        this.pushChatMessage(null, `방을 개설하였습니다.`)
      }
    },
    pushChatMessage(nickname, message) {
      console.log('pushChatMessage')
      if(nickname && this.$utils.includesAdminId(nickname + message)) {
        return
      }
      const date = new Date()
      const [time, minute] = date.toLocaleTimeString().split(':')
      // nickname = null 은 알림 메세지
      this.chatMessages.push({
        nickname,
        message,
        time: `${time}:${minute}`
      })
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
        this.handlerExistedUser()
        return
      }
    },
    subscribeMember(connection) {
      const peerId = connection.peer
      // if(!this.isAlreadyConnected(connection.peer)) { 
        console.log('dfsdf')
        this.addConnection(connection)
        connection.on('open',() => this.onConnectionOpen(this.getMemberNick(peerId)))
      // } else {
      //   console.log('이미 연결된 멤버. 구독은 따로 안한다.', this.connections)
      // }
      connection.on("data", (message) => {
        console.log('message', message)
        this.onReceiveMsg(this.getMemberNick(peerId), message)
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
            
            if(this.willLeave) return
            console.log('유저가 나갔구나', peerId)
            this.removeConnection(peerId)
            this.onMemberLeave(this.getMemberNick(peerId))
            this.beepReceiveMessage('chopa1')
          // }
        // }, 1500);
      })
      connection.on('disconnected', () => {
        console.log('connection disconnected', connection.peer)
      })
    },
    getMemberNick(peerId) {
      const { nickname } = this.chatroom.members.find(({peerId: _peerId}) => _peerId === peerId)
      return nickname
    },
    async onConnectionOpen(memberNick) {
      // this.removeDisconnectedMember(peerId)
      // if(this.checkRefreshFlag()) {  // open에 flag 존재하면 새로고침임
      //   console.log('유저가 새로고침을 했다', peerId)
      //   this.deleteRefreshFlag()
      // }
      if(this.$utils.checkAdmin(memberNick)) {
        return
      }
      this.pushChatMessage(null, `${memberNick}님이 입장하셨습니다.`)
      console.log("입장하셨다.", this.memberNicks, memberNick)
      if(!this.memberNicks.includes(memberNick)) {
        console.log("없던유저.", this.memberNicks, memberNick)
          // 화면에 멤버 추가.
          // 들어온 멤버가 서버에 업데이트 된 후 chatroom get되어야 하기 때문에 settimeout
        setTimeout(async () => {
          this.updateChatroom()
          this.changeChatRoomState({ members: this.chatRoom.members })
        }, 500);
      }
      this.beepReceiveMessage('chopa2')
    },
    onReceiveMsg(memberNick, message) {
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
        const memberNick = message.split(this.USER_LEAVE_MESSAGE)[1]
        this.onMemberLeave(memberNick)
        return 
      }
      this.pushChatMessage(memberNick, message)
    },
    onMemberLeave(memberNick) {
      console.log('onMemberLeave', memberNick)
      if(this.willLeave) return
      this.deleteMemberState(memberNick)
      this.removeConnection(memberNick)
      let message = `${memberNick}님이 방을 나가셨습니다.`
      if(this.isMemberKickedOut) {
        message = `${memberName}님이 파티에서 제외되었습니다.`
        this.isMemberKickedOut = false
      }
      this.pushChatMessage(null, message)
      if(this.chatRoom.host === memberNick) {
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
    onHostChange(memberNick) {
      if(memberNick === this.nickname) {
        this.onEditChatRoom({
          host: memberNick
        })
      }
      this.changeChatRoomState({
        host: memberNick
      })
      this.pushChatMessage(null, `👑 ${memberNick}님이 방장이 되셨습니다!`)
    },
    async onDeleteMember(memberNick) {
      const deleteMember = await this.deleteMember({
        id: this.$route.query.id,
        siteNick: memberNick
      })
      console.log('deleteMember', memberNick, deleteMember)
    },
    async onClickKickOut(memberNick) {
      const isConfirmed = confirm(this.$ALERTS.CHAT.CONFIRM_KICK_OUT(memberNick))
      if(!isConfirmed) return
      this.onDeleteMember(memberNick)
      const message = `${this.KICK_OUT_MESSAGE}${memberNick}`
      this.sendMessage({
        message
      }, false)
      this.kickOut(memberNick)
    },
    kickOut(memberNick) {
      const members = this.chatRoom.members.filter(({nickname}) => nickname !== memberNick)
      this.changeChatRoomState({
        members
      })
      this.kickOutMember = memberNick // closeConnection 알람 뜨지 않도록 하는 플래그
      this.pushChatMessage(null, this.$ALERTS.CHAT.KICK_OUT_WHO(memberNick))
    },
    async onEditChatRoom(obj) {
      const newChatroom = {
        id: this.$route.query.id,
        ...this.chatRoom,
        roomTypeId: this.chatRoom.roomType.id,
        ...obj
      }
      console.log("onEditChatRoom",newChatroom)
      await this.putChatRoom(newChatroom)
    },
    receiveKickOutMsg(memberName) {
      // 강퇴 대상자
      if(memberName === this.nickname) {
        alert(this.$ALERTS.CHAT.KICK_OUT)
        this.willLeave = true
        this.destroyPeer()
        this.goPartyList()
      } else { // 방에 남아있는 멤버들
        this.isMemberKickedOut = true
      }
    },
    onEditTitle(newTitle) {
      if(newTitle === '') {
        alert(this.$ALERTS.VALIDATIONS.TITLE)
        return
      }
      const res = this.onEditChatRoom({
        title: newTitle
      })
      if(!res) return
      this.sendMessage({
        message: `${this.TITLE_EDIT_MESSAGE}${newTitle}`
      }, false)
      this.pushChatMessage(null, `방 제목이 변경되었습니다.`)
    },
    receiveChangeTitleMsg(newTitle) {
      this.changeChatRoomState({
        title: newTitle
      })
      this.pushChatMessage(null, `방 제목이 변경되었습니다.`)
    },
    sendMessage({ nickname, message }, sendMe = true) {
      console.log('sendMessage', message)
      if(this.$utils.includesAdminId(nickname + message)) {
        return
      }
      // 내가 메세지를 보내면
      // 내 화면에 추가되도록 데이터 업데이트
      sendMe && this.pushChatMessage(nickname, message)
      // 멤버들 화면에도 추가되도록 전송
			for(const connection of this.connections) {
        connection.send(message)
      }
		},
    onUnload(e) {
      console.log('onUnload')
      this.willLeave = true
      this.noticeImLeave()
      this.destroyPeer()
    },
    confirmClose(e) {
      e.preventDefault();
      e.returnValue = '';
    },
    noticeImLeave() {
      this.onDeleteMember(this.nickname)
      this.sendMessage({
        message: `${this.USER_LEAVE_MESSAGE}${this.nickname}`
      }, false)
    },
    onError(error) {
      console.error('PEERJS ERROR: ', {error})
      console.error(error.message)
      if(error.type === 'unavailable-id') {
        // "ID "sssjsjj1" is taken"
        // 채팅방에서 새 탭을 열었을때
        this.handlerUnAvailableId(true)
        return
      }
      if(error.type === 'network') {
        console.log("서버와 연결이 끊겼습니다. 페이지를 새로고침 해주세요.")
        console.log("network", this.peer)
        return
      }
      if(error.type === 'peer-unavailable') {
        const peerId = error.message.split('to peer ')[1]
        console.log(`유저와 연결이 끊겼습니다. ${peerId}`)
        this.addDisconnectedMember(peerId)
        this.removeConnection(peerId)
        return
      }
      this.peerError = error
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
      console.log("destroyPeer!!!!", this.peer)
      this.peer.destroy()
      setTimeout(() => {
        this.resetChat()
      }, 500);
    },
    resetChat() {      
      this.beep = null
      this.peer = null
      this.peerId = null
      this.connections = []
      this.setChatRoom = null
    },
    addConnection(connection) {
      this.connections = [...this.connections, connection]
    },
    removeConnection(peerId) {
      this.connections = this.connections = this.connections.filter(({peer}) => peer !== peerId)
    },
    handlerExistedUser() {
      console.log('handlerExistedUser!!')
      alert(this.$ALERTS.CHAT.USER_EXISTED)
      this.onDeleteMember(this.nickname)
      this.resetChat()
      this.goPartyList()
    },
    handlerUnAvailableId() {
      console.log('handlerUnAvailableId!!')
      const peerId = this.peerId
      this.onDeleteMember(this.nickname)
      this.resetChat()
      this.peerId = peerId + '_1'
      this.createPeer()
    },
    goPartyList() {
      this.willLeave = true
      this.$router.push({ name: 'party' })
    },
    onClickExit() {
      this.willLeave = confirm(this.$ALERTS.CHAT.CONFIRM_END)
      if(!this.willLeave) return
      this.noticeImLeave()
      // this.onDeleteMember(this.nickname)
      this.destroyPeer()
      this.$router.push({ name: 'party' })
    },
  },
}
</script>

<style>
</style>