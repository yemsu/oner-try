<template>
  <div class="party-index">
    <layout-content-wrap>
      <div class="area-page-title mb-big">
        <div class="wrap-title">
          <h2 class="page-title">🤠 파티 모집</h2>
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
      <div class="area-chat-room">
        <common-wrap-buttons
          size="small"
          align="left"
          position="top"
        >
          <element-button
            size="small"
            type="text"
            bg="sub"
            @click="refreshData"
          >
            <font-awesome-icon icon="fa-arrows-rotate" />
            새로고침
          </element-button>
        </common-wrap-buttons>
        <ul v-if="chatRooms && chatRooms.length > 0" class="list-chat-room">
          <li
            v-for="({ id, title, members, memberCount, capacity, roomType, isNeedHelper, host }, i) in chatRooms"
            :key="`chatRoom${i}`"
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
                  text: `👨🏾‍🤝‍👨🏼 ${memberCount} / ${capacity}`
                }
              }"
              @click="onClickChatRoom(id, members)"
            />
          </li>
        </ul>
        <element-no-data
          v-else-if="chatRooms && chatRooms.length === 0"
          message="파티가 존재하지 않습니다."
        />
      </div>
    </layout-content-wrap>
    <common-scroll-observer
      :data="chatRooms || []"
      :fn-load-data="loadData"
      :category="selectedRoomType"
      :refresh-trigger="refreshTrigger"
    />
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
    CardListContent
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
    console.log('ddd', this.roomTypeOptions)
  },
  methods: {
    ...mapActions({
      getChatRooms: 'party/GET_CHAT_ROOMS',
      getRoomTypes: 'party/GET_ROOM_TYPES',
      postMember: 'party/POST_MEMBER',
    }),
    ...mapMutations({
      setChatRooms: 'party/SET_CHAT_ROOMS',
      setToastMessage: 'toastPopup/SET_MESSAGE',
      setToastOn: 'toastPopup/SET_IS_TRIGGER_ON',
    }),
    async loadData(page) {
      await this.getChatRooms({
        roomTypeId: this.selectedRoomType,
        page,
        size: 15
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
    async onClickChatRoom(id, members) {
      if(!this.isLogin) {
        this.$router.push({ name: 'auth-login' })
        return
      }
      // 버그로 인해 채팅방 나가졌는데 업데이트 안된 경우 다시 들어갈 수 있게 수정.
      let isFull = false
      const isMemberBug = members.find(({nickname}) => nickname === this.nickname)
      const res = await this.postMember(id)
      if(res.msg === '방이 가득찼습니다.') {
        isFull = true
      }
      if(isFull && !isMemberBug) {
        this.setToastMessage(this.$ALERTS.CHAT.PARTY_FULL)
        this.setToastOn(true)
        this.refreshData()
        return
      }
      this.$router.push({
        name: 'party-room',
        query: {
          id
        }
      })
    },
    refreshData() {
      if(this.refreshTrigger) this.refreshTrigger = false
      this.refreshTrigger = true
    },
    onClickCreateChat() {
      if(!this.isLogin) {
        this.$router.push({ name: 'auth-login' })
        return
      }
      this.showCreateChat = !this.showCreateChat
    },
  }
}
</script>

<style lang="scss" scoped>
.area-chat-room {
  margin-top: 30px;
}
.list-chat-room {
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