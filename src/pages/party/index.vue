<template>  
  <layout-content-wrap
    v-if="false"
    size="basic"
    pd-top="none"
    :is-main-content="true"
  >
    <common-main-notice point-text="💪" title="준비 중입니다.">
      베타 기간을 거친 결과 예상치 못한 버그들이 확인되어, <br>
      편리한 파티 모집을 위한 안정적인 서비스로 돌아오겠습니다. <br>
      조금만 기다려 주세요!
    </common-main-notice>
  </layout-content-wrap>
  
  <div v-else class="party-index">
    <layout-content-wrap>
      <div class="area-page-title mb-big">
        <div class="wrap-title">
          <h2 class="page-title">
            🤠 파티 모집
            <common-beta-mark />
          </h2>
          <p class="title-desc">함께 보스를 혼내주러 갈 동료를 찾아보세요!</p>
        </div>
        <element-button
          type="square-round"
          bg="point-sub"
          class="btn-create-setting"
          @click="onClickCreateChat"
        >
          + 방 만들기
        </element-button>
      </div>
      <element-option-bar
        v-if="roomTypeOptions"
        title="분류"
        :options="roomTypeOptions"
        :select-list="[selectedRoomType]"
        :can-multi-select="false"
        @onChange="(list) => selectedRoomType = list[0]"
      />
      <infinite-list
        v-if="isLogin"
        class="area-chat-room"
        :data-list="chatRooms"
        :load-data="loadData"
        :data-type="selectedRoomType"
        :parent-refresh-trigger="refreshTrigger"
        no-data-message="파티가 존재하지 않습니다."
      >
        <ul class="list-column">
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
              :required-data="{ id, title, badgeList: badgeList(host, members) }"
              tag-name="button"
              link-title="입장하기"
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
    </layout-content-wrap>
    <create-party-chat
      v-if="showCreateChat"
      :show="showCreateChat"
      @close="showCreateChat = false"
    />
  </div>
</template>

<script>
import CardListContent from '@/components/common/CardListContent.vue'
import CreatePartyChat from '@/components/pages/party/CreatePartyChat.vue';
import InfiniteList from '@/components/common/InfiniteList.vue';
import setMeta from '@/plugins/utils/meta';
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `파티 모집`,
      description: `함께 플레이 할 팀원들을 모아보세요!`,
    })
  },
  components: {
    CreatePartyChat,
    CardListContent,
    InfiniteList
  },
  data() {
    return {
      showCreateChat: false,
      page: 1,
      selectedRoomType: '999', /// 999 = ALL
      roomTypeOptions: null,
      refreshTrigger: false
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      nickname: 'auth/getNickname',
      chatRooms: 'party/getChatRooms',
      chatRoom: 'party/getChatRoom',
      roomTypes: 'party/getRoomTypes'
    })
  },
  async created() {
    if(this.roomTypes.length === 0) await this.getRoomTypes()
    const roomTypeOptions = this.roomTypes.map(({ id, name }) => ({
      id, text: name
    }))
    this.roomTypeOptions = [
      { id: '999', text: 'ALL'},
      ...roomTypeOptions
    ]
  },
  mounted() {
    setTimeout(() => {
      if(!this.isLogin) {
        this.$router.push({ name: 'auth-login' })
        return
      }
    }, 500)
  },
  methods: {
    ...mapActions({
      getChatRooms: 'party/GET_CHAT_ROOMS',
      getChatRoom: 'party/GET_CHAT_ROOM',
      getRoomTypes: 'party/GET_ROOM_TYPES',
      getUserChatRoom: 'party/GET_USER_CHAT_ROOM',
      deleteMember: 'party/DELETE_MEMBER',
      deleteChatUser: 'party/DELETE_CHAT_USER',
      getAllMembers: 'party/GET_ALL_MEMBERS'
    }),
    ...mapMutations({
      setChatRooms: 'party/SET_CHAT_ROOMS',
      setToastMessage: 'toastPopup/SET_MESSAGE',
      setToastOn: 'toastPopup/SET_IS_TRIGGER_ON',
    }),
    async loadData(page) {
      await this.cleanDisconnectedMember()
      await this.getChatRooms({
        roomTypeId: this.selectedRoomType,
        page,
        size: 15
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
    async onClickChatRoom(id, isFull) {
      if(isFull) {
        this.setToastMessage(this.$ALERTS.CHAT.PARTY_FULL)
        this.setToastOn(true)
        this.refreshData()
        return
      }
      // 채팅방에서 나왔는데 delete member가 안된 버그가 발생한 경우
      const userChatRoomId = await this.getUserChatRoom(this.nickname)
      if(userChatRoomId) {
        const willLeavePrevRoom = confirm(this.$ALERTS.CHAT.USER_EXISTED)
        if(!willLeavePrevRoom) return
        await this.deleteMember({
          id: userChatRoomId,
          siteNick: this.nickname
        })
        this.setToastMessage(this.$ALERTS.CHAT.LEAVE_PREV_CHATROOM)
        this.setToastOn(true)
        this.refreshData()
      }
      await this.getChatRoom(id)
    },
    refreshData() {
      if(this.refreshTrigger) this.refreshTrigger = false
      setTimeout(() => {
        this.refreshTrigger = true
      }, 500);
    },
    onClickCreateChat() {
      this.showCreateChat = !this.showCreateChat
    },
  }
}
</script>

<style lang="scss" scoped>
.area-chat-room {
  margin-top: 30px;
}
.list-column {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
  @include mobile {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>