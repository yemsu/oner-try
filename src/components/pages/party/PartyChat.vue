<template>
  <div class="party-chat">
    <div class="area-chat">
      <div class="wrap-messages">
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
        label="채팅"
        size="small"
        placeholder="채팅"
        @onUpdateInput="setInputValue"
        @onEnter="onEnterInput"
      />
    </div>
    <div>
      <element-button
        type="text"
        size="small"
        @click="$emit('toggleOnBeep')"
      >
        채팅 알람 {{ isOnBeep ? '끄기' : '켜기' }}
      </element-button>
      <ul class="chat-members">
        <li
          v-for="{id, nickname: memberNick} in chatroom.members"
          :key="`chat-member-${id}`"
          :class="{ 'me' : memberNick === nickname }"
        >
          <span class="crown-emoji">
            {{ memberNick === chatroom.host ? '👑' : '😊' }}
          </span>
          {{ memberNick }}
        </li>
      </ul>
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
    setInputValue(value) {
      this.inputValue = value
    },
    onEnterInput(eventKey) {
      this.sendMessage(this.inputValue)
      this.setInputValue('')
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/party/PartyChat.scss';
</style>