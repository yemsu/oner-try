<template>
  <layout-content-wrap v-if="isLogin && chatRoom" :is-main-content="true">
    <common-chat>
      <template v-slot="{ peer: {
        peer,
        beep,
        chatMessages,
        sendMessage,
        onClickKickOut,
        onEditTitle,
        onClickExit,
        peerError,
      }}">
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
            :peer="peer"
            :beep="beep"
            :chat-messages="chatMessages"
            :send-message="sendMessage"
            :on-click-kick-out="onClickKickOut"
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
      </template>
    </common-chat>
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
      justLeave: false
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      nickname: 'auth/getNickname',
      chatRoom: 'party/getChatRoom',
    })
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
        this.$router.push({ name: 'auth-login' })
        return
      }
    }, 500);
  },
  methods: {
    ...mapActions({
      getChatRoom: 'party/GET_CHAT_ROOM',
      deleteMember: 'party/DELETE_MEMBER',
    }),
    goPartyList() {
      this.$router.push({ name: 'party' })
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