<template>
  <layout-content-wrap v-if="chatRoom && peer">
    <element-text-editable
      :text="chatRoom.title"
      :editable="nickname === chatRoom.host"
      tagname="h1"
      @onSubmit="onEditTitle"
    />
    <party-chat
      :peer-id="nickname"
      :conn="connections"
      :chat-messages="chatMessages"
      :is-on-beep="isOnBeep"
      @sendMessage="sendMessage"
      @toggleOnBeep="isOnBeep = !isOnBeep"
      @kickOut="onKickOut"
    />
  </layout-content-wrap>  
</template>

<script>
import PartyChat from '@/components/pages/party/PartyChat.vue'
import setMeta from '@/plugins/utils/meta';
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `${this.chatRoom?.title} - 파티 찾기`,
    })
  },
  components: {
    PartyChat
  },
  data() {
    return {
      peer: null,
      connections: [],
      remoteIds: [],
      willLeave: false,
      chatMessages: [],
      myAudioContext: null,
      isOnBeep: false,
      titleInput: '',
      needCheckRouteLeave: true,
      TITLE_EDIT_MESSAGE: '%TITLE_EDIT_MESSAGE%',
      KICK_OUT_MESSAGE: '%KICK_OUT_MESSAGE%',
      kickOutMember: null
    }
  },
  computed: {
    ...mapGetters({
      nickname: 'auth/getNickname',
      chatRoom: 'party/getChatRoom',
    }),
    isHost() {
      return this.chatRoom?.host === this.nickname
    },
    memberNicks() {
      return this.chatRoom.members.map(({nickname}) => nickname)
    }
  },
  async mounted() {
    const chatRoom = await this.getChatRoom(this.$route.query.id)
    if(!chatRoom)  {
      alert(this.$ALERTS.CHAT.NO_ROOM)
      this.$router.push({ name: 'party' })
      return
    }
    console.log('this.chatRoom', this.chatRoom)

    setTimeout(() => {
      if(!this.nickname) {
        alert(this.$ALERTS.NEED_LOGIN)
        this.$router.push({ name: 'auth-login' })
        return
      }
      this.createPeer()
      this.subscribeMe()

      this.myAudioContext = new AudioContext()
      window.addEventListener('unload', this.destroyPeer)
      window.addEventListener('beforeunload', this.confirmClose)
    }, 200);
  },
  beforeDestroy() {    
    window.removeEventListener('unload', this.destroyPeer);
    window.removeEventListener('beforeunload', this.confirmClose);
  },
  async beforeRouteLeave (to, from, next) {
    if(!this.chatRoom || !this.peer) {
      next()
      return
    }
    if(this.needCheckRouteLeave) {
      this.willLeave = confirm(this.$ALERTS.CHAT.CONFIRM_END)
      if(!this.willLeave) return
    }
    await this.onDeleteMember(this.nickname)
    if(this.peer) this.peer.destroy()
    next()
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
      getChatRoom: 'party/GET_CHAT_ROOM',
      postMember: 'party/POST_MEMBER',
      deleteMember: 'party/DELETE_MEMBER',
      deleteChatRoom: 'party/DELETE_CHAT_ROOM',
      putChatRoom: 'party/PUT_CHAT_ROOM',
    }),
    createPeer() {
      if(this.peer) return
      this.peer = new this.$Peer(this.nickname, {
        host: '13.209.11.12',
        port: 9000,
      })      
      
      this.peer.on('error', async (error) => {
        console.error('PEERJS ERROR: ', error)
      })
    },
    subscribeMe() {
      this.peer.on('open', (id) => {
        console.log('im open', )
        if(this.isHost && this.chatRoom.members.length === 1) {
          this.pushChatMessage(null, `방을 개설하였습니다.`)
        } else {
          this.onPostMember(this.nickname)
          this.startConnection()
        }
      })
      this.peer.on('connection',(dc) => {
        this.connections.push(dc)
        this.remoteIds.push(dc.peer)
        // console.log('connection', dc)
        this.subscribeMembers(dc)
      })
    },
    async onPostMember(peerId) {
      if(!this.memberNicks.includes(peerId)) {
        await this.postMember(this.$route.query.id)
      }
    },
    startConnection() {
      // start connecting 
      for(const nickname of this.memberNicks) {
        const alreadyConnected = Object.keys(this.peer.connections).includes(nickname)
        if(alreadyConnected) {
          continue
        }
        const connection = this.peer.connect(nickname)
        this.connections.push(connection)
        this.subscribeMembers(connection)
      }
    },
    subscribeMembers(connection) {
      const CHECK_REFRESH_FLAG = 'onertrychatroomRefreshflag'
      const checkRefreshFlag = () => sessionStorage.getItem(CHECK_REFRESH_FLAG)
      const deleteRefreshFlag = () => sessionStorage.removeItem(CHECK_REFRESH_FLAG)

      // 다른 멤버가 들어왔을때
      connection.on('open',() => {
        if(checkRefreshFlag()) {  // open에 flag 존재하면 새로고침임
          deleteRefreshFlag()
          return
        }
        this.openConnection(connection.peer)
        this.beepReceiveMessage()
      })
      connection.on('close', () => {
        console.log('connection close', connection.peer)
        // 새로고침 했을때
        sessionStorage.setItem(CHECK_REFRESH_FLAG, '1')
        setTimeout(() => {
          if(checkRefreshFlag()) { // close에 flag 존재하면 새로고침 아님
            deleteRefreshFlag()
            this.closeConnection(connection.peer)
            this.beepReceiveMessage()
          }
        }, 1500);
      })
      connection.on('disconnected', () => {
        console.log('connection disconnected', connection.peer)
      })
      // 다른 멤버가 메세지를 보냈을때
      connection.on("data", (message) => {
        // 타이틀 변경 메세지 수신 했을 때
        if(message.includes(this.TITLE_EDIT_MESSAGE)) {
          this.reactChangeTitle(message)
          return 
        } 
        if(message.includes(this.KICK_OUT_MESSAGE)) {
          this.reactKickOutMember(message)
          return 
        }
        this.pushChatMessage(connection.peer, message)
        this.beepReceiveMessage()
      });
    },
    reactChangeTitle(message) {
      const newTitle = message.split(this.TITLE_EDIT_MESSAGE)[1]
      this.changeChatRoomState({
        title: newTitle
      })
      this.pushChatMessage(null, `방 제목이 변경되었습니다.`)
    },
    reactKickOutMember(message) {
      const memberName = message.split(this.KICK_OUT_MESSAGE)[1]
      // 강퇴 대상자
      if(memberName === this.nickname) {
        alert(this.$ALERTS.CHAT.KICK_OUT)
        this.needCheckRouteLeave = false
        this.$router.push({ name: 'party' })
      } else { // 방에 남아있는 멤버들
        const members = this.chatRoom.members.filter(({nickname}) => nickname !== memberName)
        this.changeChatRoomState({
          members
        })
        this.kickOutMember = memberName // closeConnection 알람 뜨지 않도록 하는 플래그
        this.pushChatMessage(null, this.$ALERTS.CHAT.KICK_OUT_WHO(memberName))
      }
    },
    openConnection(peerId) {
      this.pushChatMessage(null, `${peerId}님이 접속하셨습니다.`)
      if(!this.memberNicks.includes(peerId)) {
        this.addMember({ nickname: peerId })
      }
    },
    closeConnection(peerId) {
      console.log("connection close!", this.willLeave, this.nickname)
      if(this.kickOutMember === peerId) {
        this.kickOutMember = null
        return
      }
      this.pushChatMessage(null, `${peerId}님이 방을 나가셨습니다.`)
      if(this.willLeave) return
      // 다른 멤버가 나갔을때 (본인이 나갈때 실행되지 않도록 willLeave 플래그 체크)
      this.deleteMemberState(peerId)
      if(this.chatRoom.host === peerId) {
        this.changeChatRoomState({
          host: this.chatRoom.members[0].nickname
        })
        this.pushChatMessage(null, `👑 ${this.chatRoom.members[0].nickname}님이 방장이 되셨습니다!`)
      }
    },
    sendMessage({ nickname, message }, sendMe = true) {
      // 내가 메세지를 보내면
      // 내 화면에 추가되도록 데이터 업데이트
      sendMe && this.pushChatMessage(nickname, message)
      // 멤버들 화면에도 추가되도록 전송
			for(const connection of this.connections) {
        connection.send(message)
      }
		},
    pushChatMessage(nickname, message) {
      const date = new Date()
      const [time, minute] = date.toLocaleTimeString().split(':')
      // nickname = null 은 알림 메세지
      this.chatMessages.push({
        nickname,
        message,
        time: `${time}:${minute}`
      })
    },
    async onDeleteMember(peerId) {
      const deleteMember = await this.deleteMember({
        id: this.$route.query.id,
        siteNick: peerId
      })
      console.log('deleteMember', peerId, deleteMember)
    },
    async onPatchHost(peerId) {
      await this.patchChatRoom({
        id: this.$route.query.id,
        host: peerId
      })
    },
    destroyPeer() {      
      if(document.readyState == "complete") { // 새로고침 체크
        return
      }
      if(this.peer) this.peer.destroy()
      this.onDeleteMember(this.nickname)
    },
    confirmClose(e) {
      e.preventDefault();
      e.returnValue = '';
    },
    async onKickOut(memberName) {
      const isConfirmed = confirm(this.$ALERTS.CHAT.CONFIRM_KICK_OUT(memberName))
      if(!isConfirmed) return
      this.onDeleteMember(memberName)
      const message = `${this.KICK_OUT_MESSAGE}${memberName}`
      this.sendMessage({
        message
      }, false)
      this.kickOutMember = memberName // closeConnection 알람 뜨지 않도록 하는 플래그
      this.pushChatMessage(null, this.$ALERTS.CHAT.KICK_OUT_WHO(memberName))
    },
    async onEditChatRoom(obj) {
      await this.putChatRoom({
        id: this.$route.query.id,
        payload: {
          ...this.chatRoom,
          ...obj
        }
      })
    },
    onEditTitle(newTitle) {
      const res = this.onEditChatRoom({
        title: newTitle
      })
      if(!res) return
      this.sendMessage({
        message: `${this.TITLE_EDIT_MESSAGE}${newTitle}`
      })
    },
    beepReceiveMessage() {
      if(!this.isOnBeep) return
      this.beep(50, 250, 2);
      setTimeout(() => {
        this.beep(50, 280, 2)
      }, 150)
    },
    beep(duration, frequency, volume){
      return new Promise((resolve, reject) => {
        // Set default duration if not provided
        duration = duration || 200;
        frequency = frequency || 440;
        volume = volume || 2;

        try {
          const oscillatorNode = this.myAudioContext.createOscillator();
          const gainNode = this.myAudioContext.createGain();
          oscillatorNode.connect(gainNode);

          // Set the oscillator frequency in hertz
          oscillatorNode.frequency.value = frequency;

          // Set the type of oscillator
          oscillatorNode.type= "square";
          gainNode.connect(this.myAudioContext.destination);

          // Set the gain to the volume
          gainNode.gain.value = volume * 0.01;

          // Start audio with the desired duration
          oscillatorNode.start(this.myAudioContext.currentTime);
          oscillatorNode.stop(this.myAudioContext.currentTime + duration * 0.001);

          // Resolve the promise when the sound is finished
          oscillatorNode.onended = () => {
              resolve();
          };
        } catch(error) {
          reject(error);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#area-peer {
  width: 100%;
  height: 500px;
  background-color: var(--darker-10);
}
</style>