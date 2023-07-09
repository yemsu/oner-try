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
    <section class="inner-size-basic mrg-top-small copy-area" ref="copyArea">
      <div class="area-page-title underline">
        <h2 class="title badge-text-wrap">
          <i class="skull">☠</i>
          {{ userNick }}
          <span v-if="isBanUser(userNick)" class="badge banned size-big type-round">활동정지</span>
        </h2>
        <element-copy-button
          :copy-area="$refs.copyArea"
        />
      </div>
      <element-v-tab
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
            <ItemBuild
              :build-info="JSON.stringify(activeTab)"
              :use-refresh="true"
              @refresh="loadData"
            />
            
          </section>
          <layout-content-wrap>
            <section v-if="isStaff" class="inventory">
              <div class="area-page-title">
                <h2 class="title">Inventory</h2>
              </div>
              <item-list
                :items="activeTab.inventory"
                columnNum="5"
              >
                <template v-slot="{ data: { item } }">
                  <item-box
                    :item="item"
                    type="list"
                    :show-name="false"
                    :showBadges="['grade', 'stack']"
                  ></item-box>
                </template>
              </item-list>
            </section>
          </layout-content-wrap>
        </template>
      </element-v-tab>
    </section>
  </div>
</template>

<script>
import CharacterSearchBox from "@/components/pages/character/SearchBox.vue"
import ItemBuild from "@/components/item/ItemBuild.vue";
import CharacterInventory from "@/components/character/Inventory.vue";
import setMeta from '@/plugins/utils/meta';
import { checkUpdatePageView, totalPageViewGAData } from '@/plugins/utils/pageView'
import { postCharacterPageView, getCharacterPageViews, postMergeCharacterView } from '@/plugins/utils/https'
import { mapGetters, mapActions, mapMutations } from 'vuex';
import ItemList from '@/components/item/ItemList.vue';

export default {
  name: 'character-result',
  components: {
    CharacterSearchBox,
    ItemBuild,
    CharacterInventory,
    ItemList
  },
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `${this.userNick}의 캐릭터`,
      description: `${this.userNick}의 캐릭터 정보입니다.`,
    })
  },
  data() {
    return {
      userNick: '',
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
      gameUsers: 'character/getGameUsers',
      nickname: 'auth/getNickname',
      userInfo: 'auth/getUserInfo',
    }),
    isStaff() {
      return this.userInfo?.role === 'STAFF'
    }
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
      setToastMessage: 'toastPopup/SET_MESSAGE',
      setToastOn: 'toastPopup/SET_IS_TRIGGER_ON',
      setIsLoading: 'common/SET_IS_LOADING',
    }),
    async loadData(nickName) {
      const isRefresh = !nickName
      nickName = nickName || this.userNick
      this.setIsLoading(true)
      const result = await this.getUserCharacters({ nickName })
      if(!result) {
        this.handlerNoData()
        return
      }
      if(isRefresh) {
        this.setToastMessage(this.$ALERTS.REFRESH_SUCCESS)
        this.setToastOn(true)
      }
      this.setIsLoading(false)
    },
    async getUserData(nickName) {
      if(['EEL'].includes(nickName)) { // ban, admin user 처리
        this.handlerNoData()
        return
      }
      this.loadData(nickName)
      this.userNick = nickName
      this.sendPageView()
      console.log('userCharacters', nickName, this.userCharacters)
    },
    handlerNoData() {
      alert('존재하지 않는 유저입니다.')
      this.$router.push({ name: 'character'})
    },
    async sendPageView() {
      // check window session storage
      const namePageView = await checkUpdatePageView('character', this.userNick)
      namePageView && postCharacterPageView({ name: this.userNick })
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
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/character/result.scss';
</style>