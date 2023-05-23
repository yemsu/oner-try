<template>
  <layout-content-wrap v-if="chatRoom && $Peer" :is-main-content="true">
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
      title: `${this.chatRoom?.title ? `${this.chatRoom?.title}`: '채팅방'} | 파티 모집`,
    })
  },
  components: {
    PartyChat
  },
  data() {
    return {
      peer: null,
      connections: [],
      willLeave: false,
      chatMessages: [],
      titleInput: '',
      needCheckRouteLeave: true,
      TITLE_EDIT_MESSAGE: '%TITLE_EDIT_MESSAGE%',
      KICK_OUT_MESSAGE: '%KICK_OUT_MESSAGE%',
      USER_LEAVE_MESSAGE: '%USER_LEAVE_MESSAGE%',
      kickOutMember: null,
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
    }
  },
  watch: {
    isLogin(crr) {
      if(!crr) {
        this.needCheckRouteLeave = false
        this.$router.push({ name: 'party' })
        this.$Peer.destroyPeer()
      }
    }
  },
  async mounted() {
    const chatRoom = await this.getChatRoom(this.$route.query.id)
    if(!chatRoom)  {
      alert(this.$ALERTS.CHAT.NO_ROOM)
      this.$router.push({ name: 'party' })
      return
    }

    setTimeout(() => {
      if(!this.nickname) {
        this.$router.push({ name: 'auth-login' })
        return
      }

      console.log('방 입장!', this.$Peer.$peer.disconnected, this.memberNicks)
      
      // 파티 모집 - 피어 상태 변화에 따른 이벤트 설정
      this.$Peer.setCustomEvents({
        afterOnConnect: (peerId) => {
          this.pushChatMessage(null, `${peerId}님이 입장하셨습니다.`)
          if(!this.memberNicks.includes(peerId)) {
            // 화면에 멤버 추가.
            this.addMember({ nickname: peerId })
          }
        },
        onReceiveMsg: (peerId, message) => this.onReceiveMsg(peerId, message),
        onMemberLeave: this.onMemberLeave,
      })      

      // 피어 입장
      if(this.memberNicks.length > 0) {
        for(const nickname of this.memberNicks) {
          console.log('피어 입장', this.chatRoom.id, this.$Peer.connections)
          this.$Peer.startConnecting(nickname, this.chatRoom.id)
        }
      } else { // 
        this.pushChatMessage(null, `방을 개설하였습니다.`)
      }

      // 오류 발생으로 추후 확인 필요
      // if(!this.$utils.checkAdmin(this.nickname)) {
      //   const isMember = this.chatRoom.members.find(({nickname}) => nickname === this.nickname)
      //   console.log('isMember', this.chatRoom.members, isMember)
      //   if(!isMember) {
      //     alert(this.$ALERTS.CHAT.BLOCK_DIRECT_ROOM)
      //     this.$router.push({ name: 'party' })
      //     return
      //   }
      // }


      // // visibilitychange로 변경 필요.
      // window.addEventListener('unload', this.onUnload)
      // window.addEventListener('beforeunload', this.confirmClose)
    }, 500);
  },
  beforeDestroy() {    
    window.removeEventListener('unload', this.onUnload);
    window.removeEventListener('beforeunload', this.confirmClose);
  },
  async beforeRouteLeave (to, from, next) {
    if(this.needCheckRouteLeave) {
      this.willLeave = confirm(this.$ALERTS.CHAT.CONFIRM_END)
      if(!this.willLeave) return
    }
    this.noticeImLeave()
    this.onDeleteMember(this.$Peer.peerId)
    this.$Peer.disconnectAll()
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
      deleteMember: 'party/DELETE_MEMBER',
      deleteChatRoom: 'party/DELETE_CHAT_ROOM',
      putChatRoom: 'party/PUT_CHAT_ROOM',
    }),
    onUnload() {
      this.noticeImLeave()
      this.onDeleteMember(this.$Peer.peerId)
      this.$Peer.destroyPeer()
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
    noticeImLeave() {
      console.log('beforeRouteLeave', )
      this.sendMessage({
        message: `${this.USER_LEAVE_MESSAGE}${this.$Peer.peerId}`
      })
    },
    onMemberLeave(peerId) {
      console.log('afterCloseConnection')
      this.deleteMemberState(peerId)
      this.pushChatMessage(null, `${peerId}님이 방을 나가셨습니다.`)
      if(this.chatRoom.host === peerId) {
        this.changeChatRoomState({
          host: this.chatRoom.members[0].nickname
        })
        this.pushChatMessage(null, `👑 ${this.chatRoom.members[0].nickname}님이 방장이 되셨습니다!`)
      }
      console.log("?",)
    },
    sendMessage({ nickname, message }, sendMe = true) {
      if(this.$utils.includesAdminId(nickname + message)) {
        return
      }
      // 내가 메세지를 보내면
      // 내 화면에 추가되도록 데이터 업데이트
      sendMe && this.pushChatMessage(nickname, message)
      // 멤버들 화면에도 추가되도록 전송
			for(const connection of this.$Peer.connections) {
        connection.send(message)
      }
		},
    pushChatMessage(nickname, message) {
      if(this.$utils.includesAdminId(nickname + message)) {
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
    async onPatchHost(peerId) {
      await this.patchChatRoom({
        id: this.$route.query.id,
        host: peerId
      })
    },
    confirmClose(e) {
      e.preventDefault();
      e.returnValue = '';
    },
    async onEditChatRoom(obj) {
      await this.putChatRoom({
        id: this.$route.query.id,
        payload: {
          ...this.chatRoom,
          roomTypeId: this.chatRoom.roomType.id,
          ...obj
        }
      })
    },
    receiveChangeTitleMsg(newTitle) {
      this.changeChatRoomState({
        title: newTitle
      })
      this.pushChatMessage(null, `방 제목이 변경되었습니다.`)
    },
    receiveKickOutMsg(memberName) {
      // 강퇴 대상자
      if(memberName === this.nickname) {
        alert(this.$ALERTS.CHAT.KICK_OUT)
        this.needCheckRouteLeave = false
        this.$router.push({ name: 'party' })
      } else { // 방에 남아있는 멤버들
        this.fnKickOut(memberName)
      }
    },
    async onClickKickOut(memberName) {
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
    onClickExit() {
      this.$router.push({ name: 'party' })
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