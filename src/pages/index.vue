<template>
  <div class="inner-size-basic">
    <div class="wrap-quick-menu">
      <!-- <section class="column-full point-banner">
        <div class="box-flex">
          <div class="item-flex area-img">
            <img src="@/assets/images/character-update-220722.jpg" alt="">
          </div>
          <div class="item-flex about">
            <div class="area-text">
              <h3 class="title">🤹‍♂️ 캐릭터 페이지에 기능이 추가되었습니다 🎉</h3>
              <p>류오 / 시너지 / 스탯이 추가되었어요!</p>
            </div>
            <div class="area-contents">
              <character-search-box
                :matchingData="userNickNames"
              />
            </div>
          </div>
        </div>
      </section> -->
      <section class="quick-menu column">
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
      <section class="quick-menu column">
        <div class="area-text">
          <h3 class="title">조합법 검색 👀</h3>
          <p>조합법을 한눈에 볼 수 있습니다.</p>
        </div>
        <div class="area-contents">
          <composition-search-box
            :matchingData="compositionItems"
          />
        </div>
      </section>
      <section class="quick-menu column">
        <div class="area-text">
          <h3 class="title">아이템 도감 📙</h3>
          <p>등급 및 옵션을 필터링하고 <br>원하는 아이템 정보를 확인해보세요. </p>
          <p class="wrap-links">
            <router-link
              to="/items/sailor"
              class="text-link wrap-icon-text"
            >
              선원 도감
              <i class="icon-arrow right small border-point"></i>
            </router-link>
            <router-link
              to="/items/colleague"
              class="text-link wrap-icon-text"
            >
              동료 도감
              <i class="icon-arrow right small border-point"></i>
            </router-link>
            <router-link
              to="/items/sailor"
              class="text-link wrap-icon-text"
            >
              선박 도감
              <i class="icon-arrow right small border-point"></i>
            </router-link>
            <router-link
              to="/items/equipment"
              class="text-link wrap-icon-text"
            >
              <span class="badge-text-wrap">
                <!-- <span class="badge point">new</span>  -->
                장비 도감
              </span>
              <i class="icon-arrow right small border-point"></i>
            </router-link>
          </p>
        </div>
      </section>
      <section class="quick-menu column">
        <div class="area-text">
          <h3 class="title">...to be continue 👻</h3>
          <p>다음은 뭘까요</p>
        </div>
      </section>
      <section class="quick-menu column-full">
        <div class="area-text">
          <h3 class="title">랭킹 TOP 5</h3>
          <p>오늘의 해적왕..🥶 원피스는 어디에 있나요..? 💎 </p>
          <p>
            <router-link
              to="/ranking"
              class="text-link wrap-icon-text"
            >
              전체 랭킹 보러가기
              <i class="icon-arrow right small with-text border-point"></i>
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
    await store.dispatch('item/GET_HEROES')
    await store.dispatch('item/GET_ITEMS')
    await store.dispatch('character/GET_GAME_USERS')
    await store.dispatch('character/GET_RANKING')
    await store.commit('character/ADD_RANKING_DATA', { number: 5 })

    const { character: { gameUsers,  rankingCrr }, item: { items } } = store.state    
    // character
    const userNickNames = gameUsers.map(user => user.nickName)
    // composition    
    const compositionItems = items.filter(item => item.ingredients)
    return {
      userNickNames,
      compositionItems,
      rankingCrr
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/index.scss';
</style>