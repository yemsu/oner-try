<template>
  <layout-content-wrap v-if="isLogin && chatRoom" :is-main-content="true">
    <common-chat />
  </layout-content-wrap>  
</template>

<script>
import setMeta from '@/plugins/utils/meta';
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `${this.chatRoom?.title ? `${this.chatRoom?.title}`: '채팅방'} | 파티 모집`,
    })
  },
  data() {
    return {
      justLeave: false
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      nickname: 'auth/getNickname',
      chatRoom: 'party/getChatRoom',
    })
  },
  async mounted() {
    const chatRoom = await this.getChatRoom(this.$route.query.id)
    if(!chatRoom)  {
      alert(this.$ALERTS.CHAT.NO_ROOM)
      this.goPartyList()
      return
    }

    setTimeout(async () => {
      if(!this.nickname) {
        this.$router.push({ name: 'auth-login' })
        return
      }
    }, 500);
  },
  methods: {
    ...mapActions({
      getChatRoom: 'party/GET_CHAT_ROOM',
    }),
    goPartyList() {
      this.$router.push({ name: 'party' })
    },
  }
}
</script>

<style lang="scss" scoped>
#area-peer {
  width: 100%;
  height: 500px;
  background-color: var(--darker-10);
}
</style>