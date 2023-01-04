<template>
  <section class="wrap-search">
    <h2 class="ir-hidden">캐릭터</h2>
    <ItemCheckerBoard
      :items="pureHeroes"
    />
    <character-search-box
      :matchingData="userNickNames"
      size="big"
    />
  </section>
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
      description: '캐릭터가 궁금한 유저를 검색해보세요',
    })
  },
  components: {
    CharacterSearchBox
  },
  data() {
    return {
      userNickNames: null
    }
  },
  computed: {
    ...mapGetters({
      heroes:  'item/getHeroes',
      gameUsers: 'character/getGameUsers',
    }),    
    pureHeroes() {
      return [...this.heroes].filter(hero => !hero.name.includes('(스킨)'))
    }
  },
  async created() {
    if(this.gameUsers.length === 0) await this.$store.dispatch('character/GET_GAME_USERS')
    this.userNickNames = this.gameUsers.map(user => user.nickName)
    
    if(this.heroes.length === 0) await this.$store.dispatch('item/GET_HEROES')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/character/index.scss';
</style>