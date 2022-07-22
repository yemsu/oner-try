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
                :title="itemArea.title"
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
            <div class="all-options-main">
              <item-detail-info
                type="total"
                columns="3"
                colorMode="white"
                :options="activeTab.totalOption.slice(0,12)"
                :plusMinusUnit="false"
                :showValueDecimal="true"
              />
              <p class="text-notice">실제 스탯과 약간의 오차가 있을 수 있습니다.</p>
            </div>
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
        </template>
      </v-tab>
    </div>
  </div>
</template>

<script>
import SynergyDesc from '@/components/item/SynergyDesc.vue'
import CharacterSearchBox from "@/components/pages/character/SearchBox.vue"
import VTab from '@/components/common/VTab.vue'
import TitleContent from '@/components/common/TitleContent.vue'
import setMeta from '@/plugins/utils/meta';
import { checkUpdatePageView, totalPageViewGAData } from '@/plugins/utils/pageView'
import { postCharacterPageView, getCharacterPageViews, postMurgeCharacterView } from '@/plugins/utils/https'
import { mapGetters, mapMutations, mapActions } from 'vuex';
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