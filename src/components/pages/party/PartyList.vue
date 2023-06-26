<template>
  <infinite-list
    class="area-chat-room"
    :direction="addListButton ? 'row' : 'column'"
    :data-list="chatRooms"
    :load-data="loadData"
    :data-type="partyType"
    :parent-refresh-trigger="refreshTrigger"
    :no-data-message="addListButton ? '' : '파티가 존재하지 않습니다.'"
  >
    <ul class="list-column">
      <li v-if="addListButton">
        <button
          class="button-add-list"
          title="파티 생성하기"
          @click="$emit('create')"
        >
          <span class="icon-plus">+</span>
          {{ chatRooms && chatRooms.length === 0 ? '파티모집' : '' }}
        </button>
      </li>
      <li
        v-for="({
        id,
        title,
        members,
        capacity,
        roomType,
        isNeedHelper,
        host
      }, i) in chatRooms"
        :key="`data${i}`"
        class="chat-room"
      >
        <card-list-content
          v-if="members"
          :size="addListButton ? 'small' : 'medium'"
          :required-data="{ 
            id,
            title,
            badgeList: addListButton ? null : badgeList(host, members)
          }"
          tag-name="button"
          :link-title="`${host}님의 파티 입장하기`"
          :top-info="{
            left: {
              text: `${roomType.name}`,
              badge: isNeedHelper ? '🐣 헬퍼 요청' : ''
            },
            right: {
              text: `👨🏾‍🤝‍👨🏼 ${members.length} / ${capacity}`
            }
          }"
          @click="onClickChatRoom(id, members.length === capacity)"
        />
      </li>
    </ul>
  </infinite-list>
</template>

<script>
import CardListContent from '@/components/common/CardListContent.vue'
import InfiniteList from '@/components/common/InfiniteList.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  components: {
    CardListContent,
    InfiniteList,
  },
  props: {
    partyType: {
      type: [String, Number],
      default: '999'
    },
    addListButton: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      refreshTrigger: false
    }
  },
  computed: {
    ...mapGetters({
      chatRooms: 'party/getChatRooms',
      chatRoom: 'party/getChatRoom',
      isLogin: 'auth/getIsLogin',
      nickname: 'auth/getNickname',
      isMinimize: 'party/getIsMinimize'
    })
  },
  watch: {
    isMinimize(crr) {
      // 리스트 페이지에서 채팅방 최소화 시 데이터 새로고침
      if(crr) {
        this.refreshData()
      }
    },
    chatRoom(crr) {
      console.log('watch chatRoom, crr')
      // 리스트 페이지에서 방 나갔을 경우 데이터 새로고침
      if(!crr) {
        this.refreshData()
      }
    },
    $route() {
      this.refreshData()
    }
  },
  mounted() {
    addEventListener('visibilitychange', this.refreshData)
  },
  beforeDestroy() {
    removeEventListener('visibilitychange', this.refreshData)
  },
  methods: {
    ...mapActions({
      getChatRooms: 'party/GET_CHAT_ROOMS',
      getChatRoom: 'party/GET_CHAT_ROOM',
      getUserChatRoom: 'party/GET_USER_CHAT_ROOM',
      deleteMember: 'party/DELETE_MEMBER',
      deleteChatUser: 'party/DELETE_CHAT_USER',
      getAllMembers: 'party/GET_ALL_MEMBERS'
    }),
    ...mapMutations({
      setChatRooms: 'party/SET_CHAT_ROOMS',
      setChatRoom: 'party/SET_CHAT_ROOM',
      setIsMinimize: 'party/SET_IS_MINIMIZE',
      setToastMessage: 'toastPopup/SET_MESSAGE',
      setToastOn: 'toastPopup/SET_IS_TRIGGER_ON',
    }),
    async loadData(page) {
      await this.cleanDisconnectedMember()
      await this.getChatRooms({
        roomTypeId: this.partyType,
        page,
        size: 100
      })
    },
    async onClickChatRoom(id, isFull) {
      if(!this.isLogin) {
        this.$router.push({ name: 'auth-login' })
        return
      }
      if(id === this.chatRoom?.id) {
        this.setIsMinimize(false)
        return
      }
      if(isFull) {
        this.setToastMessage(this.$ALERTS.CHAT.PARTY_FULL)
        this.setToastOn(true)
        this.refreshData()
        return
      }
      // 채팅방에서 나왔는데 delete member가 안된 버그가 발생한 경우
      const goToNewChatRoom = await this.handleAlreadyHasParty() 
      if(!goToNewChatRoom) return
      await this.getChatRoom(id)
      // 이미 아무도 없는 방이라면.
      if(this.chatRoom.members.length === 0) {
        this.setChatRoom(null)
        this.setToastMessage(this.$ALERTS.CHAT.NO_ROOM)
        this.setToastOn(true)
        this.refreshData()
        return
      }
    },
    async handleAlreadyHasParty() {
      return new Promise(async (resolve) => {
        const userChatRoomId = await this.getUserChatRoom(this.nickname)
        if(!userChatRoomId) {
          resolve(true)
          return
        }
        const willLeavePrevRoom = confirm(this.$ALERTS.CHAT.USER_EXISTED)
        if(!willLeavePrevRoom) {
          resolve(false)
          return
        }
        await this.deleteMember({
          id: userChatRoomId,
          siteNick: this.nickname
        })
        this.setChatRoom(null)
        this.setToastMessage(this.$ALERTS.CHAT.LEAVE_PREV_CHATROOM)
        this.setToastOn(true)
        this.refreshData()
        resolve(true)
      })
    },
    async cleanDisconnectedMember() {
      return new Promise(async (resolve) => {
        const allMembers = await this.getAllMembers()
        const peer = new this.$Peer({
          host: process.env.PEER_SERVER,
          secure: true        
        })
        peer.listAllPeers(async (peerIdList) => {
          const disconnectedMembers = allMembers.filter(({peerId}) => (
            !peerIdList.includes(peerId)
          ))
          if(disconnectedMembers.length === 0) {
            resolve(true)
            return
          }
          for(const { nickname } of disconnectedMembers) {
            await this.deleteChatUser(nickname)
          }
          resolve(true)
        })
      }) 
    },
    badgeList(host, members) {
      if(!members) return
      const badgeList = members.map(({ nickname, status }) => ({
        text: `${host === nickname ? '👑' : ''} ${nickname}`,
        color: `status-${status.toLowerCase()}`
      }))
      return badgeList
    },
    refreshData() {
      if(this.refreshTrigger) this.refreshTrigger = false
      setTimeout(() => {
        this.refreshTrigger = true
      }, 500);
    },
  }
}
</script>

<style lang="scss" scoped>
.button-add-list {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 100%;
  padding: 5px 15px 5px 15px;
  background-color: var(--lighter-10);
  border: 1px solid var(--border-light-gray);
  color: var(--font-dark-gray);
  border-radius: 5px;
  line-height: 1;
  .icon-plus {
    font-size: var(--font-size-title-S);
    padding-bottom: 0.25em;
  }
}
</style>