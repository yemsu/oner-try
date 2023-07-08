<template>
  <common-chat-popup>
    <party-chat
      :peer="peer"
      :beep="beep"
      :chat-messages="chatMessages"
      :send-message="sendMessage"
      :on-click-kick-out="onClickKickOut"
      :on-click-exit="onClickExit"
      :on-edit-title="onEditTitle"
      :refresh-trigger="refreshTrigger"
      @refresh="refreshChatroom"
    />
  </common-chat-popup>
</template>

<script>
import PartyChat from '@/components/pages/party/PartyChat.vue'
import Beep from '@/plugins/utils/beep';
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  components: {
    PartyChat
  },
  data() {
    return {
      peer: null,
      peerId: null,
      connections: [],
      beep: null,
      willLeave: false, // 나가는 사람 본인인지 체크하는 플래그 - 커넥션 끊겨도 채팅방 업데이트 할 필요 없음
      // kickOutMember: null,
      chatMessages: [],
      titleInput: '',
      refreshChecker: `onertrychatroomRefreshflag`,
      ONER_TRY_CHAT_REFRESH: 'ONER_TRY_CHAT_REFRESH',
      TITLE_EDIT_MESSAGE: '%TITLE_EDIT_MESSAGE%',
      KICK_OUT_MESSAGE: '%KICK_OUT_MESSAGE%',
      CHANGE_HOST_MESSAGE: '%CHANGE_HOST_MESSAGE%',
      isMemberKickedOut: false,
      refreshTrigger: null,
      reOpeningMember: null
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
      return this.chatRoom.members
        .filter(({nickname}) => nickname !== this.nickname)
        .map(({nickname}) => nickname)
    },
  },
  watch: {
    nickname(crr, prev) {
      if(!crr) {
        this.willLeave = true
        this.onDeleteMember(prev)
        this.destroyPeer()
        if(this.$route.path === '/party/room') this.goPartyList()
      }
    },
    isLogin(crr) {
      if(!crr && this.chatRoom) {
        this.onUnload()
      }
    }
  },
  mounted() {    
    setTimeout(async () => {
      // 파티 리스트에서 chatRoom 데이터에 멤버 존재하지 않으면 바로 chatRoom null로 지정함.
      if(!this.chatRoom) return
      // 화면에 멤버 추가.
      await this.getChatRoom(this.chatRoom.id)
      this.setIsMinimize(false)
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
      changeMemberPeerId: 'party/CHANGE_MEMBER_PEERID',
      setIsMinimize: 'party/SET_IS_MINIMIZE',
      togglePopupIsVisible: 'popup/TOGGLE_IS_VISIBLE',
      setPopupContent: 'popup/SET_CONTENT',
      setToastMessage: 'toastPopup/SET_MESSAGE',
      setToastOn: 'toastPopup/SET_IS_TRIGGER_ON',
    }),
    ...mapActions({
      postMember: 'party/POST_MEMBER',
      getChatRoom: 'party/GET_CHAT_ROOM',
      deleteMember: 'party/DELETE_MEMBER',
      deleteChatRoom: 'party/DELETE_CHAT_ROOM',
      putChatRoom: 'party/PUT_CHAT_ROOM',
      putMember: 'party/PUT_MEMBER',
    }),
    createPeer() {
      if(!this.peerId) {
        // 마지막 글자에 특수문자 존재하는 경우, peerjs invalid id 에러 발생하여 난수로 교체
        const getRandomNum = (powNum) => Math.floor(Math.random() * (10 ** powNum))
        const nickNoSpecialCharacter = this.nickname.replaceAll(/-|_|\./g, '')
        this.peerId = `${nickNoSpecialCharacter}_${getRandomNum(5)}`
      }
      this.peer = new this.$Peer(this.peerId, {
        host: process.env.PEER_SERVER,
        secure: true,
        label: this.nickname
      })
      console.log('peer created', this.peer.id, this.peer,)
      this.createBeep()
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
    createBeep() {
      const savedVolume = localStorage.getItem('ONER_TRY_CHAT_VOLUME') * 1
      const savedIsMuted = localStorage.getItem('ONER_TRY_CHAT_MUTED') === 'true'
      this.beep = new Beep(savedIsMuted, savedVolume)
    },
    async onOpen() {
      if(this.getMyMemberObj()) {
        await this.putMember({
          ...this.getMyMemberObj(),
          peerId: this.peerId
        })
      } else {
        this.hereIAm()
        this.checkNoHost()
      }

      if(this.chatRoom.members.length > 0) {      
        for(const member of this.chatRoom.members) {
          console.log('피어 오픈', this.chatRoom.id, this.connections, member.peerId, this.chatRoom.id)
          // 가끔 새로고침 시 내가 나가지지 않은 채로 members 데이터가 넘어옴
          if(member.nickname === this.nickname) continue
          const connection = this.peer.connect(member.peerId, {
            label: `${this.nickname}/${member.nickname}`
          })
          console.log('와서 멤버들에게 커넥션을 요청한다.', connection.peer)
          this.subscribeMember(connection, true)
        }
      } else if(!this.reOpeningMember) {
        this.pushChatMessage(null, `방을 개설하였습니다.`)
      }
    },
    pushChatMessage(nickname, message) {
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
      const { error } = await this.postMember({
        chatRoomId: this.chatRoom.id,
        peerId: this.peerId
      })
      if(error) {
        this.setPopupContent({
          title: '파티 멤버 등록에 실패 실패하였습니다.',
          message: `파티에 재입장 해주세요! :: Error - ${error.msg}`
        })
        this.togglePopupIsVisible()
        this.onUnload()
        return
      }
    },
    getMemberNickFromLabel(connection) {
      return connection.label.split('/').find(nickname => nickname !== this.nickname)
    },
    subscribeMember(connection, isReceiver) {
      const peerId = connection.peer
      const memberNick = this.getMemberNickFromLabel(connection)
      connection.on('open',() => {
        this.changeMemberPeerId({
          memberNick,
          peerId
        })
        this.addConnection(connection)
        this.onConnectionOpen(peerId, isReceiver)
      })
      connection.on('data', (message) => {
        // 강퇴당했을때
        if(!this.chatRoom) return
        this.onReceiveMsg(memberNick, message)
      });
      connection.on('close', () => {
        console.log('멤버와 연결이 끊겼다. 커넥션 리스트를 정리하자', peerId) 
        if(this.willLeave) return
        console.log('유저가 나갔구나', peerId) 
        this.onMemberLeave(peerId)
      })
      connection.on('disconnected', () => {
        console.log('connection disconnected', connection.peer)
      })
    },
    getMemberNick(peerId) {
      console.log('------getMemberNick', peerId)
      const member = this.chatRoom.members.find(({peerId: _peerId}) => _peerId === peerId)
      return member?.nickname
    },
    addConnection(connection) {
      const removedOldMember = this.connections.filter(({ label }) => label !== connection.label)
      this.connections = [...removedOldMember, connection]
    },
    onConnectionOpen(peerId, isSender) {
      console.log("입장하셨다.", peerId)
      setTimeout(async () => {
        await this.getChatRoom(this.chatRoom.id)
        const memberNick = this.getMemberNick(peerId)
        const isSecret = this.reOpeningMember
          || this.$utils.checkAdmin(memberNick)
          || !memberNick
        if(isSecret) {
          if(this.reOpeningMember) {
            this.reOpeningMember = null
          }
          return
        }
        const message = isSender
          ? '방에 입장하였습니다.'
          : `${memberNick}님이 입장하셨습니다.`
        this.pushChatMessage(null, message)
        if(memberNick !== this.nickname) this.beepReceiveMessage('chopa2')
      }, 500);
    },
    async onReceiveMsg(memberNick, message) {
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
      if(message.includes(this.CHANGE_HOST_MESSAGE)) {
        const newHostName = message.split(this.CHANGE_HOST_MESSAGE)[1]
        this.changeChatRoomState({
          host: newHostName
        })
        return 
      }
      this.pushChatMessage(memberNick, message)
      this.beepReceiveMessage('jigun')
    },
    onMemberLeave(peerId) {
      const memberNick = this.getMemberNick(peerId)
      if(this.willLeave || !memberNick) return
      this.deleteMemberState(memberNick)
      this.removeConnection(peerId)
      let message = `${memberNick}님이 방을 나가셨습니다.`
      if(this.isMemberKickedOut) {
        message = `${memberName}님이 파티에서 제외되었습니다.`
        this.isMemberKickedOut = false
      }
      this.pushChatMessage(null, message)
      this.beepReceiveMessage('chopa1')
      // 나간 멤버가 방장?
      if(this.chatRoom.host !== memberNick) return
      this.onHostLeave()  
    },
    onHostLeave() {
      const newHostName = this.chatRoom.members[0].nickname
      this.changeHost(newHostName)
      this.pushChatMessage(null, `👑 ${newHostName}님이 방장이 되셨습니다!`)
    },
    changeHost(newHostName) {
      if(newHostName === this.nickname) {
        this.onEditChatRoom({
          host: newHostName
        }, false)
      }
      this.changeChatRoomState({
        host: newHostName
      })
    },
    async onDeleteMember(memberNick, chatRoomId) {
      const id = chatRoomId || this.chatRoom?.id
      if(!id) return
      return await this.deleteMember({
        id,
        siteNick: memberNick
      })
    },
    async onClickKickOut(memberNick) {
      const isConfirmed = confirm(this.$ALERTS.CHAT.CONFIRM_KICK_OUT(memberNick))
      if(!isConfirmed) return
      const message = `${this.KICK_OUT_MESSAGE}${memberNick}`
      this.sendMessage({
        message
      }, false)
      this.kickOut(memberNick)
    },
    kickOut(memberNick) {
      this.deleteMemberState(memberNick)
      // this.kickOutMember = memberNick // closeConnection 알람 뜨지 않도록 하는 플래그
      this.pushChatMessage(null, this.$ALERTS.CHAT.KICK_OUT_WHO(memberNick))
    },
    async onEditChatRoom(obj, updateState = true) {
      const newChatroom = {
        ...this.chatRoom,
        roomTypeId: this.chatRoom.roomType.id,
        ...obj
      }
      await this.putChatRoom({
        chatRoom: newChatroom,
        updateState
      })
    },
    receiveKickOutMsg(memberNick) {
      // 강퇴 대상자
      if(memberNick === this.nickname) {
        alert(this.$ALERTS.CHAT.KICK_OUT)
        this.willLeave = true
        this.onDeleteMember(memberNick)
        this.setChatRoom(null)
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
    saveChatRoomIdForRefresh() {
      sessionStorage.setItem(this.ONER_TRY_CHAT_REFRESH, this.chatRoom.id)
    },
    onUnload() {
      this.willLeave = true
      this.onDeleteMember(this.nickname)
      this.destroyPeer()
      this.saveChatRoomIdForRefresh()
      this.setChatRoom(null)
    },
    confirmClose(e) {
      e.preventDefault();
      e.returnValue = '';
    },
    onError(error) {
      console.error('PEERJS ERROR: ', {error})
      console.error(error.message)
      if(error.type === 'unavailable-id') {
        // "ID "sssjsjj1" is taken"
        // 채팅방에서 새 탭을 열었을때
        this.recreatePeer()
        return
      }
      if(error.type === 'network') {
        console.log("채팅 서버와 연결이 끊겼습니다!\n파티에서 제외됩니다. 재입장 해주세요.")
        alert("채팅 서버와 연결이 끊겼습니다! 재연결을 시도합니다.")
        console.log("network", this.peer?.destroyed, this.peer?.disconnected)
        // this.onUnload()
        this.recreatePeer()
        return
      }
      if(error.type === 'peer-unavailable') {
        const peerId = error.message.split('to peer ')[1]
        console.log(`유저와 연결이 끊겼습니다. ${peerId}`)
        this.addDisconnectedMember(peerId)
        return
      }
      this.setPopupContent({
        title: error.type,
        message: error.message
      })
      this.togglePopupIsVisible()
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
      if(this.peer) this.peer.destroy()
      this.resetChat()
    },
    resetChat() {      
      this.beep = null
      this.peer = null
      this.peerId = null
      this.connections = []
      sessionStorage.removeItem(this.ONER_TRY_CHAT_REFRESH)
    },
    removeConnection(peerId) {
      this.removeDisconnectedMember(peerId)
      const connection = this.connections.find(({_peerId}) => _peerId === peerId)
      console.log('removeConnection', peerId, connection)
      if(connection) connection.close()
      this.connections = this.connections.filter(({_peerId}) => _peerId !== peerId)
    },
    async recreatePeer() {
      this.resetChat()
      this.reOpeningMember = this.nickname
      this.createPeer()
    },
    getMyMemberObj() {
      return this.chatRoom.members.find(({nickname}) => nickname === this.nickname)
    },
    goPartyList() {
      this.willLeave = true
      this.$router.push({ name: 'party' })
    },
    onClickExit() {
      this.willLeave = confirm(this.$ALERTS.CHAT.CONFIRM_END)
      if(!this.willLeave) return
      this.onDeleteMember(this.nickname)
      this.destroyPeer()
      this.setChatRoom(null)
    },
    async refreshChatroom() {
      // 채팅방 버그 걸렸을 경우 고려하여 새로고침 버튼 추가
      if(this.refreshTrigger) this.refreshTrigger = false
      await this.getChatRoom(this.chatRoom.id)
      this.checkNoHost()
      this.setToastMessage(this.$ALERTS.REFRESH_SUCCESS)
      this.setToastOn(true)
      setTimeout(() => {
        this.refreshTrigger = true
      }, 500);
    },
    checkNoHost() {
      const hostMember = this.chatRoom.members
        .find(({ nickname }) => nickname === this.chatRoom.host)
      if(hostMember) return
      const newHostName = this.memberNicks[0]
      this.onEditChatRoom({
        host: newHostName
      }, false)
      this.sendMessage({
        message: `${this.CHANGE_HOST_MESSAGE}${newHostName}`
      }, false)
    },
  },
}
</script>

<style></style>