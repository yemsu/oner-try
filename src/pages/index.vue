<template>
  <img :src="`${baseUrl}/images/onepiece-rpg-renewal-open-landing.png`" alt="">
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
      compositionItems: [],
      baseUrl: process.env.BASE_URL
    }
  },
  computed: {
    ...mapGetters({
      heroes:  'item/getHeroes',
      items:  'item/getItems',
      gameUsers: 'character/getGameUsers',
      isLogin: 'auth/getIsLogin',
      userInfo: 'auth/getUserInfo'
    }),   
  },
  async created() {
    if(this.gameUsers.length === 0) await this.getGameUsers()  
    if(this.items.length === 0) await this.getItems()
    if(this.heroes.length === 0) await this.getHeroes()
    this.compositionItems = this.items.filter(item => item.ingredients)
  },
  methods: {
    ...mapActions({
      getGameUsers: 'character/GET_GAME_USERS',
      getItems: 'item/GET_ITEMS',
      getHeroes: 'item/GET_HEROES'
    }),
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/index.scss';
img {
  display: block;
  width: 100vw;
  height: calc(100vh - $header-site-menu-height);
  object-fit: cover;
}
</style>