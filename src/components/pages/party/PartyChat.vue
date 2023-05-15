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
.party-chat {
  display: flex;
  width: 700px;
}
.area-chat {
  flex: 1;
  .wrap-messages {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 5px;
    height: 600px;
    max-height: 90vh;
    padding: 20px;
    background-color: var(--bg-light-gray);
    font-size: var(--font-size-S-pc);
    @include scrollBar;
    .alarm {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      position: relative;
      color: var(--text-gray);
      &:before {
        display: block;
        position: absolute;
        top: 49%;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: var(--border-gray);
        content: '';
      }
      .message {
        position: relative;
        z-index: 1;
        padding: 2px 5px;
        background-color: var(--bg-light-gray);
      }
    }
    .chat {
      max-width: 80%;
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 5px;
      &:not(.my) {
        margin-top: 4px;
        margin-right: auto;
      }
      &.my {
        flex-direction: row-reverse;
        margin-left: auto;
        .message {
          border-color: var(--color-point-pale);
        }
      }
      .nick {
        width: 100%;
        padding: 0 2px;
        background-color: var(--bg-light-gray);
        font-size: var(--font-size-XS-pc);
        color: var(--color-point-sub-bright);
        line-height: 1;
      }
      .message {
        display: inline-block;
        padding: 5px 10px;
        border: 1px solid var(--darker-20);
        border-radius: 5px;
      }
      .time {
        font-size: var(--font-size-XXS-pc);
        color: var(--text-gray);
      }
    }
  }
}
.chat-members {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 180px;
  padding: 15px;
  border: 1px solid var(--border-light-gray);
  font-size: var(--font-size-XS-pc);
  .me {
    color: var(--color-point);
  }
}
</style>