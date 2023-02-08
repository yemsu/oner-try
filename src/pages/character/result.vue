<template>
  <div>
    <div class="top-bar">
      <div class="inner-size-basic">
        <div class="align-right">
          <character-search-box
            :matchingData="gameUsers"
            size="small"
          />
        </div>
      </div>
    </div>
    <section class="inner-size-basic mrg-top-small">
      <div class="area-page-title">
        <h2 class="title badge-text-wrap">
          <i class="skull">☠</i> 
          {{ nickname }}           
          <span v-if="isBanUser(nickname)" class="badge banned size-big type-round">활동정지</span>
        </h2>        
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
          ></item-box>
        </template>
        <template v-slot:content="{ activeTab }">
          <section>
            <h2 class="ir-hidden">캐릭터 빌드 - {{ activeTab.heroName }} (레벨:{{ activeTab.lv }}) </h2>
            <div class="text-refer top">
              <p>최근 세이브: {{ activeTab.saveDate }}</p>
              <p class="align-right">
                <span class="badge-text-wrap">
                  <span class="badge black line-gold" data-v-21f97cac="">숫자</span>
                  : 초월 수치
                </span>
              </p>
            </div>
            <div class="wrap-items-info">
              <title-content
                v-for="(itemArea, i) in itemAreas"
                :key="`itemArea${i}`"
                :title="itemArea.title"
                :type="itemArea.type"
              >
                <item-list
                  :items="activeTab[itemArea.type]"
                  :type="itemArea.type"
                  :columnNum="itemArea.columnNum"
                >
                  <template v-slot="{ item }">
                    <item-box
                      :item="item"
                      :showBadges="['howGet', 'stack']"
                    ></item-box>
                  </template>
                </item-list>
              </title-content>
              <div class="area-synergies">
                <synergy-desc
                  v-if="activeTab.synergies.length !== 0"
                  :synergies="activeTab.synergies"
                />
              </div>
              <section class="all-options-main">
                <h2 class="ir-hidden">빌드 총 스탯</h2>
                <item-detail-info
                  type="total"
                  columns="3"
                  colorMode="white"
                  :options="activeTab.totalOption.slice(0,12)"
                  :plusMinusUnit="false"
                  :showValueDecimal="true"
                />
                <p class="text-notice">실제 스탯과 약간의 오차가 있을 수 있습니다.</p>
              </section>
              <div class="all-options-sub">
                <item-detail-info
                  type="total"
                  columns="1"
                  colorMode="white"
                  :options="activeTab.totalOption.slice(12)"
                  :plusMinusUnit="false"
                  :showValueDecimal="true"
                />
              </div>
            </div>
          </section>
        </template>
      </v-tab>
    </section>
  </div>
</template>

<script>
import SynergyDesc from '@/components/item/SynergyDesc.vue'
import CharacterSearchBox from "@/components/pages/character/SearchBox.vue"
import VTab from '@/components/common/VTab.vue'
import TitleContent from '@/components/common/TitleContent.vue'
import setMeta from '@/plugins/utils/meta';
import { checkUpdatePageView, totalPageViewGAData } from '@/plugins/utils/pageView'
import { postCharacterPageView, getCharacterPageViews, postMergeCharacterView } from '@/plugins/utils/https'
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'CharacterResult',
  components: {
    VTab,
    TitleContent,
    CharacterSearchBox,
    SynergyDesc
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
      itemAreas: [
        {
          title: "장비",
          type: "equipments",
          columnNum: "2",
        },
        {
          title: "선원",
          type: "sailors",
          columnNum: "2",
        },
        {
          title: "동료",
          type: "colleagues",
          columnNum: "3",
        },
        {
          title: "선박",
          type: "ship",
          columnNum: "1",
        },
        {
          title: "류오",
          type: "ryuo",
          columnNum: "1",
          rowNum: "1",
        },
      ],
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
    this.getUserData(this.$route.query.nickname)
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      getUserCharacters: 'character/GET_USER_CHARACTERS',
      getGameUser: 'character/GET_GAME_USERS'
    }),
    async getUserData(nickName) {
      this.nickname = nickName
      await this.getUserCharacters({ nickName })
      this.sendPageView()
      console.log('userCharacters', nickName, this.userCharacters)
    },
    async sendPageView() {
      const namePageView = await checkUpdatePageView('character', this.nickname)
      namePageView && postCharacterPageView({ name: this.nickname })
    },
    async mergePVData() {
      const { data: DbPageViews } = await getCharacterPageViews({ startDate: '2022-7-9' })
      const resultData = await totalPageViewGAData('의 캐릭터', DbPageViews)
      resultData.forEach(data => {
        postMergeCharacterView({ name: data.name, pageView: data.pageView})
      })
      console.log('totalPageViewGAData', resultData)
    },
    isBanUser(nickname) {
      const banUserList = []
      return banUserList.includes(nickname)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/character/result.scss';
</style>