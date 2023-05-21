<template>
  <div class="party-index">
    <layout-content-wrap>
      <div class="area-page-title mb-big">
        <div class="wrap-title">
          <h2 class="title">🤠 파티 찾기</h2>
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
      <ul v-if="chatRooms" class="list-chat-room">
        <li
          v-for="({ id, host, title, members, capacity }, i) in chatRooms"
          :key="`chatRoom${i}`"
          class="chat-room"
        >
          <card-list-content
            v-if="members"
            :required-data="{ id, title, badgeList: badgeList(members) }"
            tag-name="button"
            link-title="입장하기"
            :top-info="{
              left: `👑 ${host}`,
              right: `👨🏾‍🤝‍👨🏼 ${members.length} / ${capacity}`
            }"
            @click="onClickChatRoom"
          />
        </li>
      </ul>
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
import setMeta from '@/plugins/utils/meta';
import { mapGetters, mapActions } from 'vuex'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `파티 찾기`,
      description: `꿈RPG를 함께 플레이 할 팀원들을 모아보세요!`,
    })
  },
  components: {
    CreatePartyChat,
    CardListContent
  },
  data() {
    return {
      showCreateChat: false,
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      nickname: 'auth/getNickname',
      chatRooms: 'party/getChatRooms',
    })
  },
  async mounted() {
    await this.getChatRooms()
  },
  methods: {
    ...mapActions({
      getChatRooms: 'party/GET_CHAT_ROOMS',
    }),
    badgeList(members) {
      if(!members) return
      const badgeList = members.map(({ nickname, status }) => ({
        text: nickname,
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
        alert(this.$ALERTS.NEED_LOGIN)
        return
      }
      this.showCreateChat = !this.showCreateChat
    },
  }
}
</script>

<style lang="scss" scoped>
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