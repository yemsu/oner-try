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
            <div class="all-options-main">
              <item-detail-info
                type="total"
                columns="3"
                colorMode="white"
                :options="totalOption(activeTab).splice(0,12)"
                :plusMinusUnit="false"
                :showValueDecimal="true"
              />
            </div>
            <div class="all-options-sub">
              <item-detail-info
                type="total"
                columns="1"
                colorMode="white"
                :options="totalOption(activeTab).splice(12)"
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
import CharacterSearchBox from "@/components/pages/character/SearchBox.vue"
import VTab from '@/components/common/VTab.vue'
import TitleContent from '@/components/common/TitleContent.vue'
import setMeta from '@/plugins/utils/meta';
import { optionDefaultValue, optionOrderArr, hpDefaultValueByHero } from '@/plugins/utils/item-def'
import { checkUpdatePageView, totalPageViewGAData } from '@/plugins/utils/pageView'
import { postCharacterPageView, getCharacterPageViews, postMurgeCharacterView } from '@/plugins/utils/https'
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  name: 'CharacterResult',
  components: {
    VTab,
    TitleContent,
    CharacterSearchBox
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
      ]
    }
  },
  computed: {
    ...mapGetters({
      characters: 'character/getCharacters',
      synergies: 'item/getSynergies',
    })
  },
  async created() {
    if(this.characters.length === 0) await this.getCharacters({ nickName: this.nickname })
    if(this.synergies.length === 0) await this.getSynergies()
    this.checkCharacterData()
    console.log('characters', this.characters)
  },
  mounted() {
    this.sendPageView()
  },
  methods: {
    ...mapActions({
      getCharacters: 'character/GET_CHARACTERS',
      getSynergies: 'item/GET_SYNERGIES',
    }),
    ...mapMutations({
      setUserNickName: 'character/SET_NICKNAME'
    }),
    async fnSearch(nickName) {
      await this.getCharacters({ nickName })
      this.checkCharacterData()
    },
    totalOption(character) {
      const { equipments, sailors, colleagues, ship, ryuo } = character

      const sailorNames = sailors.map(sailor => sailor && sailor.name).filter(sailor => sailor)
      const characterSynergies = this.synergies.filter(synergy => {
        const checkArr = synergy.sailors.map(synergySailor => {
          return sailorNames.includes(synergySailor)
        })
        const checkSet = new Set(checkArr)
        // console.log(synergy, checkSet.size === 1, checkSet[0])
        return checkSet.size === 1 && [...checkSet][0]
      })
      // console.log('characterSynergies', characterSynergies)
      const allItem = [...equipments, ...sailors, ...colleagues, ...ship, ...ryuo, ...characterSynergies]
      const allOption = this.getOptions(allItem, character)
      // console.log('allOption', allOption)
      const totalOption = Object.keys(optionDefaultValue).reduce((acc, key) => {
        const checkOption = allOption[key] || 0
        return Object.assign(acc, {[key]: checkOption + optionDefaultValue[key]})
      }, {})
      // console.log('totalOption', totalOption)      
      // ev는 str 수치를 더한다.
      totalOption.ev += totalOption.str

      // dex는 레벨을 더한다.
      totalOption.dex += character.lv

      const result = optionOrderArr.map(key => ({[key]: totalOption[key]}))
      console.log('result', result)
      return result
    },
    optionDefaultValue(key, character) {
      return key === 'hp' ? hpDefaultValueByHero[character.hero.groupName] : optionDefaultValue[key]
    },
    getOptions (allOption) {
      const options = allOption
        .reduce((acc, data) => { 
          if(!data?.option) return acc
          // 여기: 데이터 없으면 기본값 뱉도록 수정 필요
          const { option: options, gradeOption: gradeOptions, stack } = data
          const checkGradeOption = gradeOptions || []
          for(const option of [...options, ...checkGradeOption]) {
            const key = Object.keys(option)[0]
            const accValue = acc[key] || 0
            const newValue = accValue + this.calcOptionByStack(option, stack)
            Object.assign(acc, {[key]: newValue})
          }
          return acc
        }, {})
      return options
    },    
    calcOptionByStack(option, stack) {
      const key = Object.keys(option)[0]
      const value = option[key]
      if(typeof(value) === 'string' && !value.includes('~')) {
        return value*1
      }

      const optionValueMin = option[key].split('~')[0]*1
      const optionValueMax = option[key].split('~')[1]*1
      const stackValue = stack ? stack*1 : 1
      const optionEachStack = (optionValueMax - optionValueMin) / 100
      const optionValueResult = (optionEachStack * stackValue) + optionValueMin
      return optionValueResult
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