<template>
  <div class="party-chat">
    <div class="area-chat">
      <div class="wrap-messages" ref="scrollArea">
        <p
          v-for="({ nickname: chatNick, message, time }, i) in chatMessages"
          :key="`chat${i}`"
          :class="[
            { 'my' : chatNick === nickname },
            chatNick ? 'chat' : 'alarm'
          ]"
        >
          <span
            v-if="chatNick && chatNick !== nickname"
            class="nick"
          >{{ chatNick }}</span>
          <span class="message">
            {{ message }}
          </span>
          <span
            v-if="chatNick"
            class="time"
          >{{ time }}</span>
        </p>
      </div>
      <element-input
        id="newSettingTitle"
        :value="inputValue"
        size="small"
        placeholder="메세지 보내기"
        style-type="none"
        @onUpdateInput="setInputValue"
        @onEnter="onEnterInput"
      />
    </div>
    <div class="wrap-chat-side">
      <ul class="chat-members">
        <li
          v-for="{ nickname: memberNick} in chatroom.members"
          :key="`chat-member-${memberNick}`"
          :class="{ 'me' : memberNick === nickname }"
        >
          <span class="crown-emoji">
            {{ memberNick === chatroom.host ? '👑' : '😊' }}
          </span>
          {{ memberNick }}
          <span
            v-if="disconnectedMembers.includes(memberNick)"
            title="연결 끊김"
          >❗</span>
          <element-button
            v-if="memberNick !== chatroom.host && nickname === chatroom.host"
            type="text"
            size="xsmall"
            bg="sub"
            title="추방"
            @click="onClickKickOut(memberNick)"
          >
            <font-awesome-icon icon="fa-xmark" />
          </element-button>
          <element-button
            v-if="peer && memberNick === nickname"
            type="text"
            size="xsmall"
            :is-no-function="!isMyPeerDisconnected(memberNick)"
            :bg="peer.disconnected ? 'point' : 'sub'"
            :title="peer.disconnected ? '연결 끊김': '연결됨'"
            @click="() => reconnectMyPeer(memberNick)"
          >
            <font-awesome-icon icon="fa-signal" />
          </element-button>
        </li>
        <li
          v-for="(i) in readyBoxLength"
          :key="`ready${i}`"
          class="box-ready"
        ><span class="ir-hidden">멤버 입장 대기 공간</span></li>
        <li
          v-for="(i) in blankBoxLength"
          :key="`blank${i}`"
          class="box-blank"
        >
          <font-awesome-icon icon="fa-lock"/>
          <span class="ir-hidden">제한 인원 공간</span>
        </li>
      </ul>
      <div v-if="beep" class="option-buttons">
        <element-button
          type="text"
          size="xsmall"
          @click="toggleOnBeep"
          :title="`채팅 알람 ${isOnBeep ? '끄기' : '켜기'}`"
        >
          <font-awesome-icon :icon="`fa-volume-${isOnBeep ? 'high' : 'xmark'}`" />
          {{ `채팅 알람 ${isOnBeep ? '끄기' : '켜기'}` }}
        </element-button>
        <element-button
          type="text"
          size="xsmall"
          class="control-volume"
          @click="() => beep.changeVolume()"
        >
          볼륨 {{ beepVolume }}
        </element-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    peer: {
      type: Object,
      require: true
    },
    beep: {
      type: Object,
      require: true
    },
    chatMessages: {
      type: Array,
      require: true
    },
    sendMessage: {
      type: Function,
      require: true
    },
    onClickKickOut: {
      type: Function,
      require: true
    },
  },
  components: {
  },
  data() {
    return {
      inputValue: '',
    }
  },
  watch: {
    chatMessages() {
      this.fixScrollBottom()
    },
  },
  computed: {
    ...mapGetters({
      nickname: 'auth/getNickname',
      chatroom: 'party/getChatRoom',
      disconnectedMembers: 'party/getDisconnectedMembers',
    }),
    readyBoxLength() {
      return this.chatroom.capacity - this.chatroom?.members.length
    },
    blankBoxLength() {
      return 6 - this.chatroom.capacity
    },
    isOnBeep() {
      return this.beep?.isMuted
    },
    beepVolume() {
      return this.beep?.volume / this.beep?.volumeGap
    },
  },
  mounted() {

  },
  methods: {
    fixScrollBottom() {
      setTimeout(() => {
        const scrollArea = this.$refs.scrollArea
        if(!scrollArea) return
        const { scrollHeight, clientHeight, scrollTop } = scrollArea
        if(scrollHeight > clientHeight + scrollTop) {
          scrollArea.scrollTop = scrollHeight
        }
      }, 50);
    },
    setInputValue(value) {
      this.inputValue = value
    },
    onEnterInput(eventKey) {
      console.log("enterinput", this.chatroom.members, this.peer.id)
      if(this.inputValue === '') return
      
      const { nickname } = this.chatroom.members
        .find(({nickname: _nickname}) => this.peer.id.includes(_nickname))
      this.sendMessage({ 
        nickname,
        message: this.inputValue
      })
      this.setInputValue('')
    },
    toggleOnBeep() {
      this.beep.isMuted = !this.beep.isMuted
    },
    isMyPeerDisconnected(memberNick) {
      return memberNick === this.nickname && this.peer.disconnected
    },
    reconnectMyPeer(memberNick) {
      if(!this.isMyPeerDisconnected(memberNick)) return
      // this.peer.reconnect()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/party/PartyChat.scss';
</style>