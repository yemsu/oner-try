<template>
  <div class="inner-size-basic">
    <div class="wrap-quick-menu">
      <section class="quick-menu">
        <div class="area-text">
          <h3 class="title">캐릭터 검색</h3>
          <p>다른 유저의 빌드를 참고해 보세요. 😎</p>
        </div>
        <div class="area-contents">
          <character-search-box
            :matchingData="userNickNames"
          />
        </div>
      </section>
      <section class="quick-menu">
        <div class="area-text">
          <h3 class="title">조합법 검색</h3>
          <p>조합법을 한눈에 볼 수 있습니다. 👀</p>
        </div>
        <div class="area-contents">
          <composition-search-box
            :matchingData="compositionItems"
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
          <ranking-table 
            :defaultDataNum="5"
            :useInfiniteScroll="false"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import CharacterSearchBox from "@/components/pages/character/SearchBox.vue"
import CompositionSearchBox from "@/components/pages/composition/SearchBox.vue"
import RankingTable from '@/components/pages/ranking/Table.vue'
import setMeta from '@/plugins/utils/meta';
import { mapGetters } from 'vuex';

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      description: `캐릭터, 조합법을 검색 퀵메뉴와 랭킹 TOP 5를 확인할 수 있습니다.`,
    })
  },
  components: {
    CharacterSearchBox,
    CompositionSearchBox,
    RankingTable
  },
  async asyncData({ store }) {
    const { user: { gameUsers }, item: { heroes, items } } = store.state
    // character
    if(gameUsers.length === 0) await store.dispatch('user/GET_GAME_USERS')
    const gameUsersData = gameUsers.length === 0
      ? await store.dispatch('user/GET_GAME_USERS')
      : gameUsers
    const userNickNames = gameUsersData.map(user => user.nickName)
    if(heroes.length === 0) await store.dispatch('item/GET_HEROES')
    // composition    
    if(items.length === 0) await store.dispatch('item/GET_ITEMS')
    const itemsData = items.length === 0
      ? await store.dispatch('item/GET_ITEMS')
      : items
    const compositionItems = itemsData.filter(item => item.ingredients)
    return {
      userNickNames,
      compositionItems
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/getItems',
      heroes:  'item/getHeroes',
      gameUsers: 'user/getGameUsers',
      characters: 'user/getCharacters',
    })
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/index.scss';
</style>