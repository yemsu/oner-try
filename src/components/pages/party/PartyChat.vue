<template>
  <div
    :class="[
      'party-chat',
      `mode-${isMinimize ? 'mini' : 'max'}`
    ]"
  >
    <span
      v-if="newMessage"
      class="alarm-new-message"
    >
      {{ newMessage }}
    </span>
    <span
      v-if="newMessageLength"
      class="alarm-message-length"
      :title="`읽지 않은 메세지 ${newMessageLength}개`"
    >
      {{ newMessageLength }}
    </span>
    <div class="party-chat-top" @click="maximizeChat">
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
          :editable="!isMinimize && nickname === chatRoom.host"
          @onSubmit="onEditTitle"
        >
          <h2 class="page-title" :title="chatRoom.title">{{ chatRoom.title }}</h2>
        </element-text-editable>
        <element-refresh-button 
          :is-on-refresh="refreshTrigger"
          @click="$emit('refresh')"
        />
      </div>
    </div>
    <div class="wrap-content">
      <div v-show="!isMinimize" class="area-message">
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
        <div class="option-buttons top">
          <element-button
            type="text"
            size="xsmall"
            @click="toggleOnBeep"
            :title="`알람 ${isMuted ? 'OFF' : 'ON'}`"
          >
            <font-awesome-icon :icon="`fa-volume-${isMuted ? 'xmark' : 'high'}`" />
            <template v-if="!isMinimize">
              {{ `채팅 알람 ${isMuted ? 'OFF' : 'ON'}` }}
            </template>
          </element-button>
          <element-button
            v-if="!isMinimize"
            type="text"
            size="xsmall"
            @click="() => beep.changeVolume()"
          >
            볼륨 {{ beepVolume }}
          </element-button>
        </div>
        <ul class="chat-members">
          <li
            v-for="{ nickname: memberNick, peerId: memberPeerId } in chatRoom.members"
            :key="`chat-member-${memberNick}`"
            :class="{ 'me' : memberNick === nickname }"
          >
            <span class="member-emoji">
              {{ memberNick === chatRoom.host ? '👑' : '😊' }}
            </span>
            {{ memberNick }}
            <template v-if="!isMinimize">
              <!-- <span
                v-if="disconnectedMembers.includes(memberPeerId)"
                title="연결 끊김"
                class="member-disconnected"
              >
                <font-awesome-icon icon="fa-signal" />
              </span>
              <element-button
                v-if="peer && memberNick === nickname"
                type="text"
                size="xsmall"
                :is-no-function="!isMyPeerDisconnected(memberNick)"
                :bg="peer.disconnected ? 'point' : 'sub'"
                :title="peer.disconnected ? '연결 끊김': '연결됨'"
                :class="{'member-disconnected': peer.disconnected}"
                @click="() => reconnectMyPeer(memberNick)"
              >
                <font-awesome-icon icon="fa-signal" />
              </element-button> -->
              <element-button
                v-if="memberNick !== chatRoom.host && nickname === chatRoom.host"
                type="text"
                size="xsmall"
                bg="sub"
                title="추방"
                @click="onClickKickOut(memberNick)"
              >
                <font-awesome-icon icon="fa-xmark" />
              </element-button>
            </template>
          </li>
          <template v-if="!isMinimize">
            <li
              v-for="(type, i) in emptyList"
              :key="`blank-list-${i}`"
              :class="`box-${type}`"
            >
              <element-button
                type="text"
                size="xsmall"
                :is-no-function="chatRoom.host !== nickname"
                @click="onClickNoMemberList(type)"
              >
                <font-awesome-icon
                  :icon="`fa-${type === 'wait' ? 'user' : 'lock'}`"
                />
                <span class="ir-hidden">
                  {{ type === 'wait' ? '멤버 입장 대기 공간' : '제한 인원 공간' }}
                </span>
              </element-button>
            </li>
          </template>
        </ul>
        <div class="option-buttons bottom">
          <element-button
            type="text"
            size="small"
            @click="onClickExit"
            title="나가기"
          >
            <font-awesome-icon icon="fa-arrow-right-from-bracket"/>
            <template v-if="!isMinimize">나가기</template>
          </element-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

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
    onClickExit: {
      type: Function,
      require: true
    },
    onEditTitle: {
      type: Function,
      require: true
    },
    refreshTrigger: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: '',
      newMessageLength: 0,
      newMessage: null,
      newMessageTimer: null
    }
  },
  watch: {
    chatMessages(crr) {
      !this.isMinimize && this.fixScrollBottom()
      if(this.isMinimize) {
        this.newMessageLength += 1
        this.newMessage = crr[crr.length - 1].message
        if(this.newMessageTimer) clearTimeout(this.newMessageTimer)
        this.newMessageTimer = setTimeout(() => {
          this.newMessage = null
        }, 3000)
      }
    },
    isMinimize(crr, prev) {
      if(!crr && this.newMessageLength) this.newMessageLength = 0
    }
  },
  computed: {
    ...mapGetters({
      nickname: 'auth/getNickname',
      chatRoom: 'party/getChatRoom',
      disconnectedMembers: 'party/getDisconnectedMembers',
      isMinimize: 'party/getIsMinimize'
    }),
    emptyList() {
      const waitListLength = this.chatRoom.capacity - this.chatRoom?.members.length
      const blankListLength = 6 - this.chatRoom.capacity
      const waitList = new Array(waitListLength).fill('wait')
      const blankList = new Array(blankListLength).fill('blank')
      return [...waitList, ...blankList]
    },
    isMuted() {
      return this.beep?.isMuted
    },
    beepVolume() {
      return this.beep?.volume / this.beep?.volumeGap
    },
  },
  methods: {
    ...mapActions({
      putChatRoom: 'party/PUT_CHAT_ROOM',
      getChatRoom: 'party/GET_CHAT_ROOM',
    }),
    ...mapMutations({
      setToastMessage: 'toastPopup/SET_MESSAGE',
      setToastOn: 'toastPopup/SET_IS_TRIGGER_ON',
      setIsMinimize: 'party/SET_IS_MINIMIZE',
    }),
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
      console.log("enterinput", this.chatRoom.members, this.peer.id)
      if(this.inputValue === '') return
      
      const findMember = this.chatRoom.members
        .find(({nickname: _nickname}) => this.peer.id.includes(_nickname))
      
      this.sendMessage({ 
        nickname: this.nickname || findMember.nickname,
        message: this.inputValue
      })
      this.setInputValue('')
    },
    toggleOnBeep() {
      this.beep.toggleMuted()
    },
    isMyPeerDisconnected(memberNick) {
      return memberNick === this.nickname && this.peer.disconnected
    },
    reconnectMyPeer(memberNick) {
      if(!this.isMyPeerDisconnected(memberNick)) return
      // this.peer.reconnect()
    },
    onClickNoMemberList(type) {
      console.log('onClickNoMemberList', type)
      // 대기 리스트를 클릭시 capacity -1 시킨다. 
      const isMinusCapacity = type === 'wait'
      const numChanger = isMinusCapacity ? -1 : 1
      const newChatroom = {
        id: this.chatRoom.id,
        ...this.chatRoom,
        capacity: this.chatRoom.capacity + numChanger,
        roomTypeId: this.chatRoom.roomType.id,
      }
      this.putChatRoom({
        chatRoom: newChatroom
      })
      this.setToastMessage(this.$ALERTS.CHAT.CHANGE_CAPACITY)
      this.setToastOn(true)
    },
    maximizeChat() {
      console.log('maximizeChat')
      this.isMinimize && this.setIsMinimize(false)
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/party/PartyChat.scss';
</style>