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
          + 모집하기
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
      <party-list :party-type="selectedRoomType"/>
    </layout-content-wrap>
    <create-party-chat
      v-if="showCreateChat"
      :show="showCreateChat"
      @close="showCreateChat = false"
    />
  </div>
</template>

<script>
import CreatePartyChat from '@/components/pages/party/CreatePartyChat.vue';
import PartyList from '../../components/pages/party/PartyList.vue';
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
    PartyList
  },
  data() {
    return {
      showCreateChat: false,
      selectedRoomType: '999', /// 999 = ALL
      roomTypeOptions: null,
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      nickname: 'auth/getNickname',
      roomTypes: 'party/getRoomTypes',
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
  methods: {
    ...mapActions({
      getRoomTypes: 'party/GET_ROOM_TYPES',
      getUserChatRoom: 'party/GET_USER_CHAT_ROOM',
    }),
    async onClickCreateChat() {
      if(!this.isLogin) {
        this.$router.push({ name: 'auth-login' })
      }
      const userChatRoomId = await this.getUserChatRoom(this.nickname)
      if(userChatRoomId) {
        alert(this.$ALERTS.CHAT.USER_ALREADY_HAS_PARTY)
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