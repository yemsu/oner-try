<template>
  <search-box
    category="닉네임(대소문자 구분)"
    :matchingData="{type: 'string', data: matchingData}"
    :rankingList="rankingList"
    :size="size"
    :use-auto-enter="false"
    @onSearch="fnSearch"
  />
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  props: {
    matchingData: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: () => "basic"
    }
  },
  data() {
    return {
      rankingList: null,
    }
  },
  computed: {
    ...mapGetters({
      gameUsers: 'character/getGameUsers',
      pageViews: 'pageView/getCharacter',
      pageViewRanking: 'pageView/getCharacterSearchRanking',
    }),
  },
  async created() {
    if(this.pageViews.length === 0) await this.getPageView(10)
    this.rankingList = this.pageViewRanking.map(data => Object.keys(data)[0])
  },
  methods: {
    ...mapMutations({
      setUserCharacters: 'character/SET_USER_CHARACTERS'
    }),
    ...mapActions({
      getUserCharacters: 'character/GET_USER_CHARACTERS',
      getPageView: 'pageView/GET_CHARACTER',
    }),
    async fnSearch(nickName) {
      const isExistingUser = this.matchingData.find(data => data.nickName === nickName)
      console.log('isExistingUser', isExistingUser)
      if(!isExistingUser) {
        // 존재하지 않는 아이디인 경우 
        const result = await this.getUserCharacters({ nickName })
        if(!result) {
          alert('존재하지 않는 유저입니다.')
          return
        }
      }
      this.$router.push({
        name: 'character-result',
        query: { nickname: nickName }
      })
    }
  }
}
</script>