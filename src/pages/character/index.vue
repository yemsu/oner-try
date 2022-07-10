<template>
  <div class="wrap-search">
    <ItemCheckerBoard
      :items="pureHeroes"
    />
    <character-search-box
      :matchingData="userNickNames"
      size="big"
    />
  </div>
</template>

<script>
import CharacterSearchBox from "@/components/pages/character/SearchBox.vue"
import setMeta from '@/plugins/utils/meta';
import { mapGetters } from 'vuex';
export default {
  name: 'SearchCharacter',
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: '캐릭터',
      description: '캐릭터가 궁금한 유저를 검색 해보세요',
    })
  },
  components: {
    CharacterSearchBox
  },
  async asyncData({ store }) {
    const { user, heroes } = store.state
    const { gameUsers } = user
    const gameUsersData = gameUsers.length === 0
      ? await store.dispatch('GET_GAME_USERS')
      : gameUsers
    const userNickNames = gameUsersData.map(user => user.nickName)
    if(heroes.length === 0) await store.dispatch('GET_HEROES')
    return {
      userNickNames
    }
  },
  computed: {
    ...mapGetters({
      heroes: 'getHeroes',
      gameUsers: 'getGameUsers',
    }),    
    pureHeroes() {
      return [...this.heroes].filter(hero => !hero.name.includes('(스킨)'))
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/character/index.scss';
</style>