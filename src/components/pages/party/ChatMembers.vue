<template>
  <dl :class="[
    'chat-members', 
    `mode-${isMinimize ? 'mini' : 'max'}`
  ]">
    <dt :class="['member-title', {'ir-hidden': hiddenTitle || isMinimize}]">
      {{ membersType }}
    </dt>
    <template
      v-for="({ nickname: memberNick, peerId: memberPeerId, type }, i) in memberList"
    >
      <dd
        v-if="!(isMinimize && !memberNick)"
        :key="`chat-member-${memberNick}-${type}-${i}`"
        :class="['chat-member', { 'me' : memberNick === nickname }, type ? `box-${type}` : '']"
      >
        <template v-if="memberNick">
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
              @click="$emit('kickOut', memberNick)"
            >
              <font-awesome-icon icon="fa-xmark" />
            </element-button>
          </template>
        </template>
        <element-button
          v-else
          type="text"
          size="xsmall"
          :is-no-function="chatRoom.host !== nickname"
          :title="type === 'wait' ? '닫기' : '열기'"
          @click="$emit('click', type)"
        >
          <font-awesome-icon
            :icon="`fa-${type === 'wait' ? 'user' : 'lock'}`"
          />
          <span class="ir-hidden">
            {{ type === 'wait' ? '멤버 입장 대기 공간' : '제한 인원 공간' }}
          </span>
        </element-button>
      </dd>
    </template>
  </dl>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    memberList: {
      type: Array,
      required: true
    },
    membersType: {
      type: String,
      required: true
    },
    hiddenTitle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      nickname: 'auth/getNickname',
      chatRoom: 'party/getChatRoom',
      disconnectedMembers: 'party/getDisconnectedMembers',
      isMinimize: 'party/getIsMinimize'
    }),
  }
}
</script>

<style lang="scss" scoped>
.chat-members {
  padding: 15px;
  &.mode {
    &-max {
      @include mobile {
        padding: 6px;
      }
    }
    &-mini {
      gap: 4px;
      width: 100%;
      padding: 4px 6px;
      font-size: var(--font-size-XS);
      .chat-member {
        height: 1rem;
        gap: 3px;
        .member-emoji {
          font-size: 8px;
        }
      }
      @include mobile {
        flex-direction: row;
      }
    }
  }
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: var(--font-size-S);
  .member-title {
    color: var(--font-gray);
    text-align: center;
    border-bottom: 1px solid var(--border-dark-gray);
  }
  .chat-member {
    display: flex;
    height: 1.3rem;
    gap: 5px;
    align-items: center;
    &.box-wait {
      background-color: var(--darker-10);
      border: 1px solid var(--border-dark-gray);
      path {
        fill: var(--darker-20);
      }
    }
    &.box-blank {
      background-color: var(--bg-light-gray);
      path {
        fill: var(--bg-gray);
      }
    }
    &.box-wait,
    &.box-blank {
      display: flex;
      justify-content: center;
      border-radius: 5px;
      font-size: var(--font-size-XXS);
      button {
        width: 100%;
        text-align: center;
      }
    } 
    .member-disconnected {
      path {
        fill: var(--color-point);
      }
    }
  }
  .me {
    color: var(--color-point);
    font-weight: $font-weight-500;
  }
}
</style>