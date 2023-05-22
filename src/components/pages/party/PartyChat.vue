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
      </ul>
      <div class="option-buttons">
        <element-button
          type="text"
          size="xsmall"
          @click="() => $emit('toggleOnBeep')"
          :title="`채팅 알람 ${isOnBeep ? '끄기' : '켜기'}`"
        >
          <font-awesome-icon :icon="`fa-volume-${isOnBeep ? 'high' : 'xmark'}`" />
          {{ `채팅 알람 ${isOnBeep ? '끄기' : '켜기'}` }}
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
    },
    peerId: {
      type: String,
      default: () => ''
    },
    isOnBeep: {
      type: Boolean,
      default: () => false
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
    }
  },
  computed: {
    ...mapGetters({
      nickname: 'auth/getNickname',
      chatroom: 'party/getChatRoom',
    }),
  },
  mounted() {

  },
  methods: {
    sendMessage(message) {
      this.$emit('sendMessage', { nickname: this.peerId, message })
		},
    fixScrollBottom() {
      setTimeout(() => {
      const scrollArea = this.$refs.scrollArea
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/party/PartyChat.scss';
</style>