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
        this.goPartyList()
        this.$Peer.destroyPeer()
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
        this.needCheckRouteLeave = false
        this.$router.push({ name: 'auth-login' })
        return
      }

      console.log('방 입장!', this.chatRoom.members, this.memberNicks)

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
      
      // 화면에 멤버 추가.
      const getChatRoomRes = await this.getChatRoom(this.chatRoom.id)
      if(!getChatRoomRes) {
        alert('멤버 업데이트에 실패했습니다! 새로 고침을 해주세요.')
        return
      }

      // 피어가 없어? 새로 만들어.
      if(!this.$Peer.$peer) {
        console.log("피어가 없어? 새로 만들어.")
        this.$Peer.createPeer(this.nickname)
      }
      
      // 파티 모집 - 피어 상태 변화에 따른 이벤트 설정
      this.$Peer.setCustomEvents({
        onOpenPeer: () => {
          console.log('onOpenPeer',this.memberNicks)
          if(this.memberNicks.length > 0) {
            for(const nickname of this.memberNicks) {
              console.log('피어 입장', this.chatRoom.id, this.$Peer.connections)
              this.$Peer.startConnecting(nickname, this.chatRoom.id)
            }
          } else { // 
            this.pushChatMessage(null, `방을 개설하였습니다.`)
          }
        },
        afterOnConnect: async (peerId) => {
          this.pushChatMessage(null, `${peerId}님이 입장하셨습니다.`)
          if(!this.memberNicks.includes(peerId)) {
            // 화면에 멤버 추가.
            const res = await this.getChatRoom(this.chatRoom.id)
            if(!res) {
              alert('멤버 업데이트에 실패했습니다! 새로 고침을 해주세요.')
              return
            }
            this.changeChatRoomState({ members: this.chatRoom.members })
          }
        },
        onReceiveMsg: (peerId, message) => this.onReceiveMsg(peerId, message),
        onMemberLeave: this.onMemberLeave,
      })      

      window.addEventListener('pagehide', this.onUnload)
      window.addEventListener('beforeunload', this.confirmClose)
    }, 500);
  },
  beforeDestroy() {    
    window.removeEventListener('pagehide', this.onUnload);
    window.removeEventListener('beforeunload', this.confirmClose);
  },
  async beforeRouteLeave (to, from, next) {
    if(this.needCheckRouteLeave) {
      this.willLeave = confirm(this.$ALERTS.CHAT.CONFIRM_END)
      if(!this.willLeave) return
    }
    this.noticeImLeave()
    this.onDeleteMember(this.$Peer.peerId)
    this.$Peer.destroyPeer()
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
      postMember: 'party/POST_MEMBER',
      getChatRoom: 'party/GET_CHAT_ROOM',
      deleteMember: 'party/DELETE_MEMBER',
      deleteChatRoom: 'party/DELETE_CHAT_ROOM',
      putChatRoom: 'party/PUT_CHAT_ROOM',
    }),
    goPartyList() {
      this.needCheckRouteLeave = false
      this.$router.push({ name: 'party' })
    },
    onUnload(e) {
      this.willLeave = true
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
      this.sendMessage({
        message: `${this.USER_LEAVE_MESSAGE}${this.$Peer.peerId}`
      })
    },
    onMemberLeave(peerId) {
      console.log('onMemberLeave')
      if(this.willLeave) return
      this.deleteMemberState(peerId)
      this.$Peer.removeConnection(peerId)
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
    confirmClose(e) {
      e.preventDefault();
      e.returnValue = '';
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
        this.goPartyList()
      } else { // 방에 남아있는 멤버들
        this.fnKickOut(memberName)
      }
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
      this.willLeave = true
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