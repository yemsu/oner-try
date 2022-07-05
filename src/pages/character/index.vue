<template>
  <div class="wrap-search">
    <ItemCheckerBoard
      :items="pureHeroes"
    />
    <search-box
      category="닉네임(첫 검색 대소문자 구분)"
      :matchingData="{type: 'string', data: userNickNames}"
      :defaultMatchingList="false"
      size="main"
      :paramKey="['nickname']"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'SearchCharacter',
  head: {
    title: `${process.env.APP_TITLE} | 캐릭터`,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: '캐릭터가 궁금한 유저를 검색 해보세요'
      }
    ]
  },
  async asyncData({ store }) {
    const { gameUsers, heroes } = store.state
    if(gameUsers.length === 0) await store.dispatch('GET_GAME_USERS')
    if(heroes.length === 0) await store.dispatch('GET_HEROES')
    const userNickNames = gameUsers.map(user => user.nickName)
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