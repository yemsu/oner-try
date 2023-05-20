<template>
  <div>
    <div class="top-bar">
      <div class="inner-size-basic">
        <div class="align-right">
          <character-search-box
            v-if="gameUsers"
            :full-data="gameUsers"
            size="small"
          />
        </div>
      </div>
    </div>
    <section class="character-result inner-size-basic mrg-top-small" ref="characterResult">
      <div class="area-page-title underline">
        <h2 class="title badge-text-wrap">
          <i class="skull">☠</i> 
          {{ nickname }}           
          <span v-if="isBanUser(nickname)" class="badge banned size-big type-round">활동정지</span>
        </h2>    
        <element-button
          type="square-round"
          size="small"
          bg="point"
          @click="copyCharacterResult"
        >
          클립보드에 저장
        </element-button>    
      </div>
      <v-tab
        v-if="userCharacters.length !== 0"
        :tabs="userCharacters"
      >
        <template v-slot:tab="{ tab: {data, isActive} }">
          <item-box
            :item="data.hero"
            :wanted-paper="true"
            :size="isActive ? 'xbig' : 'big'"
            :customBadge="`lv.${data.lv}`"
            :title="data.hero.name"
          ></item-box>
        </template>
        <template v-slot:content="{ activeTab }">
          <section>
            <h2 class="ir-hidden">캐릭터 빌드 - {{ activeTab.heroName }} (레벨:{{ activeTab.lv }}) </h2>
            <ItemBuild :build-info="JSON.stringify(activeTab)" />
          </section>
        </template>
      </v-tab>
    </section>
  </div>
</template>

<script>
import CharacterSearchBox from "@/components/pages/character/SearchBox.vue"
import VTab from '@/components/common/VTab.vue'
import ItemBuild from "@/components/item/ItemBuild.vue";
import setMeta from '@/plugins/utils/meta';
import { checkUpdatePageView, totalPageViewGAData } from '@/plugins/utils/pageView'
import { postCharacterPageView, getCharacterPageViews, postMergeCharacterView } from '@/plugins/utils/https'
import { mapGetters, mapActions, mapMutations } from 'vuex';
import copyHtml2Img from '@/plugins/utils/copyHtml2Img'

export default {
  name: 'character-result',
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
  data() {
    return {
      nickname: ''
    }
  },
  watch: {
    $route(crr, prev) {
      const { nickname } = crr.query
      console.log('nickname', nickname)
      this.getUserData(nickname)
    }
  },
  computed: {
    ...mapGetters({
      userCharacters: 'character/getUserCharacters',
      gameUsers: 'character/getGameUsers'
    })
  },
  async created() {
    if(this.gameUsers.length === 0) await this.$store.dispatch('character/GET_GAME_USERS')
  },
  beforeDestroy() {
    this.setUserCharacters([])
  },
  mounted() {
    this.getUserData(this.$route.query.nickname)
  },
  methods: {
    ...mapActions({
      getUserCharacters: 'character/GET_USER_CHARACTERS',
      getGameUser: 'character/GET_GAME_USERS'
    }),
    ...mapMutations({
      setUserCharacters: 'character/SET_USER_CHARACTERS',
    }),
    async getUserData(nickName) {
      const result = await this.getUserCharacters({ nickName })
      if(!result) {
        alert('존재하지 않는 유저입니다.')
        this.$router.push({ name: 'character'})
        return
      }
      this.nickname = nickName
      this.sendPageView()
      console.log('userCharacters', nickName, this.userCharacters)
    },
    async sendPageView() {
      // check window session storage
      const namePageView = await checkUpdatePageView('character', this.nickname)
      namePageView && postCharacterPageView({ name: this.nickname })
    },
    async mergePVData() {
      const { data: DbPageViews } = await getCharacterPageViews()
      const resultData = await totalPageViewGAData('의 캐릭터', DbPageViews)
      resultData.forEach(data => {
        postMergeCharacterView({ name: data.name, pageView: data.pageView})
      })
      console.log('totalPageViewGAData', resultData)
    },
    isBanUser(nickname) {
      const banUserList = []
      return banUserList.includes(nickname)
    },
    copyCharacterResult() {
      copyHtml2Img(this.$refs.characterResult)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/character/result.scss';
</style>