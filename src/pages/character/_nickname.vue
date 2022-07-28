<template>
  <div>
    <div class="top-bar">
      <div class="inner-size-basic">
        <div class="align-right">
          <character-search-box
            :matchingData="userNickNames"
            :fnSearch="fnSearch"
            size="small"
          />
        </div>
      </div>
    </div>
    <div class="inner-size-basic mrg-top-small">
      <h2 class="title-page"><i class="skull">☠</i> {{ nickname }}</h2>
      <v-tab
        v-if="characters.length !== 0"
        :tabs="characters"
      >
        <template v-slot:tab="{ tab: {data, isActive} }">
          <item-box
            :item="data.hero"
            :wanted-paper="true"
            :size="isActive ? 'xbig' : 'big'"
            :customBadge="`lv.${data.lv}`"
          ></item-box>
        </template>
        <template v-slot:content="{ activeTab }">
          <item-build
            :data="activeTab"
          />
        </template>
      </v-tab>
    </div>
  </div>
</template>

<script>
import ItemBuild from '@/components/item/ItemBuild.vue'
import CharacterSearchBox from "@/components/pages/character/SearchBox.vue"
import VTab from '@/components/common/VTab.vue'
import setMeta from '@/plugins/utils/meta';
import { checkUpdatePageView, totalPageViewGAData } from '@/plugins/utils/pageView'
import { postCharacterPageView, getCharacterPageViews, postMurgeCharacterView } from '@/plugins/utils/https'
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  name: 'CharacterResult',
  components: {
    VTab,
    CharacterSearchBox,
    ItemBuild
  },
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `${this.nickname}의 캐릭터`,
      description: `${this.nickname}의 캐릭터 정보입니다.`,
    })
  },
  async asyncData({ store, params }) {
    const { character: { gameUsers }, item: { heroes } } = store.state
    const gameUsersData = gameUsers.length === 0
      ? await store.dispatch('character/GET_GAME_USERS')
      : gameUsers
    const userNickNames = gameUsersData.map(user => user.nickName)
    if(heroes.length === 0) await store.dispatch('item/GET_HEROES')
    const nickname = params.nickname
    return {
      userNickNames,
      nickname
    }
  },
  computed: {
    ...mapGetters({
      characters: 'character/getCharacters'
    }),
  },
  mounted() {
    this.sendPageView()
  },
  methods: {
    ...mapActions({
      getCharacters: 'character/GET_CHARACTERS',
    }),
    ...mapMutations({
      setUserNickName: 'character/SET_NICKNAME'
    }),
    async fnSearch(nickName) {
      await this.getCharacters({ nickName })
      console.log('fnSearch', nickName, this.characters)
      this.checkCharacterData()
    },
    checkCharacterData() {
      if(this.characters.length === 0) {
        alert('존재하지 않는 닉네임이거나, 보유 캐릭터가 없습니다.')
        console.log(this.$route)
        this.$router.push('/character')
        return false
      }
    },
    async sendPageView() {
      const namePageView = await checkUpdatePageView('character', this.nickname)
      namePageView && postCharacterPageView({ name: this.nickname })
    },
    async mergePVData() {
      const { data: DbPageViews } = await getCharacterPageViews({ startDate: '2022-7-9' })
      const resultData = await totalPageViewGAData('의 캐릭터', DbPageViews)
      resultData.forEach(data => {
        postMurgeCharacterView({ name: data.name, pageView: data.pageView})
      })
      console.log('totalPageViewGAData', resultData)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/character/result.scss';
</style>