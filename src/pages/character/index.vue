<template>
  <div class="wrap-search">
    <item-checker-board
      :items="heroes"
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
import SearchBox from '@/components/search/SearchBox.vue'
import ItemCheckerBoard from '@/components/item/ItemCheckerBoard.vue'
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
  components: {
    SearchBox,
    ItemCheckerBoard,
  },
  async asyncData({ store }) {
    const { state } = store
    if(state.gameUsers.length === 0) await store.dispatch('GET_GAME_USERS')
    if(state.heroes.length === 0) await store.dispatch('GET_HEROES')
    const userNickNames = state.gameUsers.map(user => user.nickName)

    return {
      userNickNames
    }
  },
  computed: {
    ...mapGetters({
      heroes: 'getHeroes',
      gameUsers: 'getGameUsers',
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/character/index.scss';
</style>