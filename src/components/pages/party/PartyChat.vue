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
          v-for="{ nickname: memberNick} in chatMembers"
          :key="`chat-member-${memberNick}`"
          :class="{ 'me' : memberNick === nickname }"
        >
          <span class="crown-emoji">
            {{ memberNick === chatroom.host ? '👑' : '😊' }}
          </span>
          {{ memberNick }}
          <element-button
            v-if="memberNick !== chatroom.host && nickname === chatroom.host"
            type="text"
            size="xsmall"
            bg="sub"
            title="추방"
            @click="$emit('kickOut', memberNick)"
          >
            <font-awesome-icon icon="fa-xmark" />
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
      <div class="option-buttons">
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
          @click="$Peer.changeBeepVolume"
        >
          볼륨 {{ this.beepVolume }}
        </element-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    conn: {
      type: Array,
      default: () => null
    },
    chatMessages: {
      type: Array,
      require: true
    }
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
    }
  },
  computed: {
    ...mapGetters({
      nickname: 'auth/getNickname',
      chatroom: 'party/getChatRoom',
    }),
    chatMembers() {
      return this.chatroom.members
        .filter(({nickname}) => (!this.$utils.checkAdmin(nickname)))
        .sort((a, b) => {
          const getIndex = (member) => {
            if(member.nickname === this.chatroom.host) {
              return 0
            }
            return member.id
          }
          console.log(getIndex(a), a, getIndex(b), b)
          getIndex(a) - getIndex(b)
        })
    },
    readyBoxLength() {
      return this.chatroom.capacity - this.chatroom?.members.length
    },
    blankBoxLength() {
      return 6 - this.chatroom.capacity
    },
    isOnBeep() {
      return this.$Peer.$beep.isMuted
    },
    beepVolume() {
      return this.$Peer.$beep.volume / this.$Peer.$beep.volumeGap
    },
  },
  mounted() {

  },
  methods: {
    sendMessage(message) {
      this.$emit('sendMessage', { nickname: this.$Peer.peerId, message })
		},
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
      if(this.inputValue === '') return
      this.sendMessage(this.inputValue)
      this.setInputValue('')
    },
    toggleOnBeep() {
      this.$Peer.$beep.isMuted = !this.$Peer.$beep.isMuted
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/party/PartyChat.scss';
</style>