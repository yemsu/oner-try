<template>
  <div class="main" :style="`background-image: url(${BASE_URL}/images/main-key-visual.webp);`">
    <section class="area-main-text">
      <div class="wrap-text-left">
        <p class="color-point"><em>ONERPG</em></p>
      </div>
      <div class="wrap-text-right">
        <p><em>대개편</em></p>
      </div>
    </section>
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
        <!-- <section class="quick-menu column">
          <div class="area-text">
            <h3 class="title">캐릭터 검색</h3>
            <p>다른 유저의 빌드를 참고해 보세요. 😎</p>
          </div>
          <div class="area-contents">
            <character-search-box
              :full-data="gameUsers"
            />
          </div>
        </section> -->
        <section class="quick-menu column-half">
          <div class="area-text">
            <div class="badges center">
              <element-badge type="square-round" size="large" color="point">6월 4일 v2 Update !</element-badge>
            </div>
            <h3 class="title">신규 장비 아이템 추가</h3>
            <p>
              신규 장비 아이템과 함께 💎영원 등급이 추가되었어요.
            </p>
          </div>
          <div class="area-contents">
            <p class="wrap-links">
              <router-link
                to="/items/equipment"
                class="text-link wrap-icon-text"
              >
                신규 장비 확인하기
                <i class="icon-arrow right small border-point"></i>
              </router-link>
              <router-link
                to="/item-build/my/new"
                class="text-link wrap-icon-text"
              >
                빌드 만들어보기
                <i class="icon-arrow right small border-point"></i>
              </router-link>
            </p>
          </div>
        </section>
        <section class="quick-menu column-half">
          <div class="area-text">
            <div class="badges center">
              <element-badge type="square-round" size="large">
                신규 메뉴
              </element-badge>
            </div>
            <h3 class="title">👻 파티 모집 OPEN !</h3>
            <p>
              파티 모집을 생성해 두세요! <br>
              모집글이 사이트 상단에 고정되어 다른 유저들에게 노출됩니다.
            </p>
          </div>
          <div class="area-contents">
            <p class="wrap-links">
              <router-link
                to="/party"
                class="text-link wrap-icon-text"
              >
                파티 모집하러 가기
                <i class="icon-arrow right small border-point"></i>
              </router-link>
            </p>
          </div>
        </section>
        <section class="quick-menu column">
          <div class="area-text">
            <h3 class="title">조합법 검색 👀</h3>
            <p>조합법을 한눈에 볼 수 있습니다.</p>
          </div>
          <div class="area-contents">
            <composition-search-box
              v-if="compositionItems"
              :full-data="compositionItems"
            />
          </div>
        </section>
        <section class="quick-menu column">
          <div class="area-text">
            <h3 class="title">아이템 도감 📙</h3>
            <p>등급 및 옵션을 필터링하고 <br>원하는 아이템 정보를 확인해보세요. </p>
            <p class="wrap-links">
              <router-link
                v-for="({ pageName, text }) in itemPageLinks"
                :key="`itemPageLink${pageName}`"
                :to="`/items/${pageName}`"
                class="text-link wrap-icon-text"
              >
                {{ text }}
                <i class="icon-arrow right small border-point"></i>
              </router-link>
            </p>
          </div>
        </section>
        <section class="quick-menu column item-bookmarks">
          <template v-if="isLogin">
            <div class="area-text">
              <h3 class="title small">
                <span class="color-point"><strong>{{ userInfo && userInfo.siteNick }}</strong></span>님의 ⭐ 조합법
              </h3>
            </div>
            <div class="area-contents">
              <item-bookmarks
                :show-tooltip="false"
              />
            </div>
          </template>
          <div v-else class="area-text">
            <h3 class="title">조합법 즐겨찾기 ⭐</h3>
            <p>
              Google 계정으로 로그인하고 <br>
              조합법 페이지에서 즐겨찾기 기능을 이용해 보세요!
            </p>
          </div>
        </section>
        <!-- <section class="quick-menu column-full">
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
        </section> -->
      </div>
    </div>
  </div>
</template>

<script>
import CharacterSearchBox from "@/components/pages/character/SearchBox.vue"
import CompositionSearchBox from "@/components/pages/composition/SearchBox.vue"
import ItemBookmarks from "@/components/item/ItemBookmarks.vue"
import RankingTable from '@/components/pages/ranking/Table.vue'
import setMeta from '@/plugins/utils/meta';
import { mapActions, mapGetters } from "vuex";

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      description: `게임 플레이에 필요한 정보들을 한눈에 확인해보세요!`,
    })
  },
  components: {
    CharacterSearchBox,
    CompositionSearchBox,
    RankingTable,
    ItemBookmarks
  },
  data() {
    return {
      compositionItems: null,
      itemPageLinks: [
        {
          pageName: 'sailor',
          text: '선원'
        },
        {
          pageName: 'ship',
          text: '선박'
        },
        {
          pageName: 'colleague',
          text: '동료'
        },
        {
          pageName: 'equipment',
          text: '장비'
        },
        {
          pageName: 'potion',
          text: '포션'
        },
      ],
      BASE_URL: process.env.BASE_URL,
    }
  },
  computed: {
    ...mapGetters({
      // heroes:  'item/getHeroes',
      items:  'item/getItems',
      // gameUsers: 'character/getGameUsers',
      isLogin: 'auth/getIsLogin',
      userInfo: 'auth/getUserInfo'
    }),   
  },
  async created() {
    // if(this.gameUsers.length === 0) await this.getGameUsers()  
    // if(this.heroes.length === 0) await this.getHeroes()
    if(this.items.length === 0) await this.getItems()
    this.compositionItems = this.items.filter(item => item.ingredients)
  },
  methods: {
    ...mapActions({
      // getGameUsers: 'character/GET_GAME_USERS',
      // getHeroes: 'item/GET_HEROES'
      getItems: 'item/GET_ITEMS',
    }),
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/index.scss';
</style>