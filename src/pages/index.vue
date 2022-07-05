<template>
  <div class="inner-size-basic">
    <div class="wrap-quick-menu">
      <section class="quick-menu">
        <div class="area-text">
          <h3 class="title">캐릭터 검색</h3>
          <p>다른 유저의 빌드를 참고해 보세요. 😎</p>
        </div>
        <div class="area-contents">
          <search-box
            category="닉네임(첫 검색 대소문자 구분)"
            :matchingData="{type: 'string', data: userNickNames}"
            :defaultMatchingList="false"
            resultPath="/character"
            :queryKey="['nickname']"
          />
        </div>
      </section>
      <section class="quick-menu">
        <div class="area-text">
          <h3 class="title">조합법 검색</h3>
          <p>조합법을 한눈에 볼 수 있습니다. 👀</p>
        </div>
        <div class="area-contents">
          <search-box
            v-if="combinationItems.length !== 0"
            category="조합 아이템"
            :matchingData="{type: 'item', data: combinationItems}"
            resultPath="/composition"
            :queryKey="['id', 'type']"
          />
        </div>
      </section>
      <section class="quick-menu ranking">
        <div class="area-text">
          <h3 class="title">랭킹 TOP 5</h3>
          <p>오늘의 해적왕..🥶 원피스는 어디에 있나요..? 💎 </p>
          <p>
            <router-link
              to="/ranking"
              class="text-link wrap-icon-text"
            >
              전체 랭킹 보러가기
              <i class="icon-arrow right small with-text color-point"></i>
            </router-link>
          </p>
        </div>
        <div class="area-contents">
          <rankingTable
            :ranking="rankingMain"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import rankingTable from '@/components/ranking/table.vue'
import setMeta from '@/plugins/utils/meta';
import { mapGetters, mapMutations } from 'vuex';

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `메인`,
      description: `캐릭터, 조합법을 검색 퀵메뉴와 랭킹 TOP 5를 확인할 수 있습니다.`,
    })
  },
  components: {
    rankingTable
  },
  async asyncData({ store }) {
    const { gameUsers, heroes, items, ranking } = store.state
    // character
    if(gameUsers.length === 0) await store.dispatch('GET_GAME_USERS')
    if(heroes.length === 0) await store.dispatch('GET_HEROES')
    const userNickNames = gameUsers.map(user => user.nickName)
    // composition    
    if(items.length === 0) await store.dispatch('GET_ITEMS')
    const combinationItems = await items.filter(item => item.ingredients)
    // ranking
    if(ranking.length === 0) await store.dispatch('GET_RANKING')
    return {
      userNickNames,
      combinationItems
    }
  },
  computed: {
    ...mapGetters({
      items: 'getItems',
      heroes: 'getHeroes',
      gameUsers: 'getGameUsers',
      characters: 'getCharacters',
      rankingMain: 'getRankingMain',
      ranking: 'getRanking',
    })
  },
  created() {
    if(this.rankingMain.length === 0) this.addRanking({type: 'rankingMain', number: 5})
  },
  methods: {
    ...mapMutations({
      addRanking: 'ADD_RANKING_DATA'
    }),
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/index.scss';
</style>