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
        <ul v-if="chatRooms && chatRooms.length > 0" class="list-chat-room">
          <li
            v-for="({ id, title, members, memberCount, capacity, roomType, isNeedHelper }, i) in chatRooms"
            :key="`chatRoom${i}`"
            class="chat-room"
          >
            <card-list-content
              v-if="members"
              :required-data="{ id, title, badgeList: badgeList(members) }"
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
              @click="onClickChatRoom"
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
import { mapGetters, mapActions } from 'vuex'

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
    }),
    async loadData(page) {
      await this.getChatRooms({
        roomTypeId: this.selectedRoomType,
        page,
        size: 15
      })
    },
    badgeList(members) {
      if(!members) return
      const badgeList = members.map(({ nickname, status }) => ({
        text: `${this.chatRooms.host === nickname ? '👑' : ''} ${nickname}`,
        color: `status-${status.toLowerCase()}`
      }))
      return badgeList
    },
    onClickChatRoom(id) {
      if(!this.isLogin) {
        this.$router.push({ name: 'auth-login' })
        return
      }
      this.$router.push({
        name: 'party-view',
        query: {
          id
        }
      })
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