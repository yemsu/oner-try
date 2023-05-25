<template>
  <layout-content-wrap v-if="chatRoom && peer" :is-main-content="true">
    <div class="wrap-party-room">
      <div class="badges">
        <element-badge
          type="square-round"
        >{{ chatRoom.roomType.name }}</element-badge>
        <element-badge
          type="square-round"
          v-if="chatRoom.isNeedHelper"
        >🐣 헬퍼 요청</element-badge>
      </div>
      <div class="area-page-title">
        <element-text-editable
          :text="chatRoom.title"
          :editable="nickname === chatRoom.host"
          @onSubmit="onEditTitle"
        >
          <h2 class="page-title">{{ chatRoom.title }}</h2>
        </element-text-editable>
      </div>
      <party-chat
        :peer-id="nickname"
        :conn="connections"
        :chat-messages="chatMessages"
        @sendMessage="sendMessage"
        @kickOut="onClickKickOut"
      />
      <common-wrap-buttons position="bottom">
        <element-button
          type="square-round"
          size="large"
          bg="point"
          @click="onClickExit"
        >
          방 나가기
        </element-button>
      </common-wrap-buttons>
    </div>
    <element-popup
      v-if="peerError"
      :is-visible="peerError"
      :title="peerError.type"
      :message="peerError.message"
      button-text="파티 모집 바로가기"
      @confirm="goPartyList"
    />
  </layout-content-wrap>  
</template>

<script>
import PartyChat from '@/components/pages/party/PartyChat.vue'
import setMeta from '@/plugins/utils/meta';
import Beep from '@/plugins/utils/beep';
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `${this.chatRoom?.title ? `${this.chatRoom?.title}`: '채팅방'} | 파티 모집`,
    })
  },
  components: {
    PartyChat
  },
  data() {
    return {
      willLeave: false,
      chatMessages: [],
      titleInput: '',
      needCheckRouteLeave: true,
      TITLE_EDIT_MESSAGE: '%TITLE_EDIT_MESSAGE%',
      KICK_OUT_MESSAGE: '%KICK_OUT_MESSAGE%',
      USER_LEAVE_MESSAGE: '%USER_LEAVE_MESSAGE%',
      kickOutMember: null,
      peerError: null,
      justLeave: false
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
    isHost() {
      return this.chatRoom?.host === this.nickname
    },
    memberNicks() {
      return this.chatRoom.members
        .filter(({nickname}) => nickname !== this.nickname)
        .map(({nickname}) => nickname)
    }
  },
  watch: {
    isLogin(crr) {
      if(!crr) {
        this.goPartyList()
        this.destroyPeer()
      }
    }
  },
  async mounted() {
    const chatRoom = await this.getChatRoom(this.$route.query.id)
    if(!chatRoom)  {
      alert(this.$ALERTS.CHAT.NO_ROOM)
      this.goPartyList()
      return
    }

    setTimeout(async () => {
      if(!this.nickname) {
        this.willLeave = true
        this.$router.push({ name: 'auth-login' })
        return
      }

      



      window.addEventListener('unload', this.onUnload)
      window.addEventListener('beforeunload', this.confirmClose)
    }, 500);
  },
  beforeDestroy() {    
    window.removeEventListener('unload', this.onUnload);
    window.removeEventListener('beforeunload', this.confirmClose);
  },
  async beforeRouteLeave (to, from, next) {
    console.log('beforeRouteLeave', this.peer, this.justLeave)
    if(!this.peer || this.justLeave) {
      setTimeout(() => {
        next()
      }, 500);
      return
    }
    if(!this.willLeave && !this.justLeave) {
      this.willLeave = confirm(this.$ALERTS.CHAT.CONFIRM_END)
      if(!this.willLeave) return
    }
    this.noticeImLeave()
    this.onDeleteMember(this.peerId)
    this.destroyPeer()
    next()
  },
  methods: {
    ...mapMutations({
      changeChatRoomState: 'party/CHANGE_CHAT_ROOM',
      deleteMemberState: 'party/DELETE_MEMBER',
      addMember: 'party/ADD_MEMBER',
      setToastMessage: 'toastPopup/SET_MESSAGE',
      setToastOn: 'toastPopup/SET_IS_TRIGGER_ON',
      removeConnection: 'peer/REMOVE_CONNECTION',
      setBeep: 'peer/SET_BEEP',
    }),
    ...mapActions({
      getChatRoom: 'party/GET_CHAT_ROOM',
      deleteMember: 'party/DELETE_MEMBER',
      deleteChatRoom: 'party/DELETE_CHAT_ROOM',
      putChatRoom: 'party/PUT_CHAT_ROOM',
    }),
    async afterOnConnect(peerId) {
      this.pushChatMessage(null, `${peerId}님이 입장하셨습니다.`)
      console.log("입장하셨다.", this.memberNicks, peerId)
      console.log("추케추케", this.peer.disconnected)
      if(!this.memberNicks.includes(peerId)) {
        
      console.log("없던유저.", this.memberNicks, peerId)
        // 화면에 멤버 추가.
        // 들어온 멤버가 서버에 업데이트 된 후 chatroom get되어야 하기 때문에 settimeout
      setTimeout(async () => {
        const res = await this.getChatRoom(this.chatRoom.id)
        if(!res) {
          alert('멤버 업데이트에 실패했습니다! 새로 고침을 해주세요.')
          return
        }
        console.log("getChatRoom res.", res, this.chatRoom)
        this.changeChatRoomState({ members: this.chatRoom.members })
      }, 500);
      }
    },
    onUnload(e) {
      console.log('onUnload')
      this.willLeave = true
      this.noticeImLeave()
      this.onDeleteMember(this.peerId)
      this.destroyPeer()
    },
    noticeImLeave() {
      this.sendMessage({
        message: `${this.USER_LEAVE_MESSAGE}${this.peerId}`
      }, false)
    },
    sendMessage({ nickname, message }, sendMe = true) {
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
    async onDeleteMember(peerId) {
      const deleteMember = await this.deleteMember({
        id: this.$route.query.id,
        siteNick: peerId
      })
      console.log('deleteMember', peerId, deleteMember)
    },
    async onEditChatRoom(obj) {
      console.log("onEditChatRoom",obj)
      await this.putChatRoom({
        id: this.$route.query.id,
        ...this.chatRoom,
        roomTypeId: this.chatRoom.roomType.id,
        ...obj
      })
    },
    receiveKickOutMsg(memberName) {
      // 강퇴 대상자
      if(memberName === this.nickname) {
        alert(this.$ALERTS.CHAT.KICK_OUT)
        this.goPartyList()
      } else { // 방에 남아있는 멤버들
        this.fnKickOut(memberName)
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
    async onClickKickOut(memberName) {
      console.log('onClickKickOut')
      const isConfirmed = confirm(this.$ALERTS.CHAT.CONFIRM_KICK_OUT(memberName))
      if(!isConfirmed) return
      this.onDeleteMember(memberName)
      const message = `${this.KICK_OUT_MESSAGE}${memberName}`
      this.sendMessage({
        message
      }, false)
      this.kickOut(memberName)
    },
    kickOut(memberName) {
      const members = this.chatRoom.members.filter(({nickname}) => nickname !== memberName)
      this.changeChatRoomState({
        members
      })
      this.kickOutMember = memberName // closeConnection 알람 뜨지 않도록 하는 플래그
      this.pushChatMessage(null, this.$ALERTS.CHAT.KICK_OUT_WHO(memberName))
    },
    onClickExit() {
      this.willLeave = true
      this.$router.push({ name: 'party' })
    },
    confirmClose(e) {
      e.preventDefault();
      e.returnValue = '';
    },
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