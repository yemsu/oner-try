<template>
  <div class="area-floating">
    <div class="wrap-party-list">
      <party-list
        :add-list-button="true"
        @create="onClickCreateChat"
      />
    </div>
    <create-party-chat
      v-if="showCreateChat"
      :show="showCreateChat"
      @close="showCreateChat = false"
    />
  </div>
</template>

<script>
import CreatePartyChat from '@/components/pages/party/CreatePartyChat.vue';
import PartyList from '@/components/pages/party/PartyList.vue';
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    CreatePartyChat,
    PartyList
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
    })
  },
  methods: {
    ...mapActions({
      getUserChatRoom: 'party/GET_USER_CHAT_ROOM',
    }),
    async onClickCreateChat() {
      console.log('onClickCreateChat', this.isLogin)
      if(!this.isLogin) {
        this.$router.push({ name: 'auth-login' })
        return
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
.area-floating {
  overflow-x: auto;
  display: flex;
  flex-wrap: wrap;
  padding: 5px 10px;
  background-color: var(--lighter-10);
  @include scrollBar;
  ::v-deep {
    .list-column {
      display: flex;
      gap: 5px;
      .chat-room {
        .card-list-content {
          border: 1px solid var(--border-light-gray);
          background-color: var(--lighter-10);
          border-radius: 5px;
        }
      }
    }
  }
}
</style>