<template>
  <common-chat
    v-if="isLogin && chatRoom && $route.path !== '/party/room'"
  />
</template>

<script>
import PartyChat from '@/components/pages/party/PartyChat.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    PartyChat
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      nickname: 'auth/getNickname',
      chatRoom: 'party/getChatRoom',
    }),
  },
}
</script>

<style>
</style>