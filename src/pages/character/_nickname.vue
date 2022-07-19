<template>
  <div>
    <div class="top-bar">
      <div class="inner-size-basic">
        <div class="align-right">
          <character-search-box
            :matchingData="userNickNames"
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
          </div>
          <div class="all-options">
            <item-detail-info
              :options="totalOption(activeTab)"
              :plusMinusUnit="false"
              :showValueDecimal="true"
            />
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
    console.log('synergies', this.synergies)
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
    totalOption(character) {
      const { equipments, sailors, colleagues, ship, ryuo } = character

      const sailorNames = sailors.map(sailor => sailor.name)
      const characterSynergies = this.synergies.filter(synergy => {
        const checkArr = synergy.sailors.map(synergySailor => {
          return sailorNames.includes(synergySailor)
        })
        const checkSet = new Set(checkArr)
        // console.log(synergy, checkSet.size === 1, checkSet[0])
        return checkSet.size === 1 && [...checkSet][0]
      })
      console.log('characterSynergies', characterSynergies)
      
      const allOption = [...equipments, ...sailors, ...colleagues, ...ship, ryuo, ...characterSynergies]
      const totalOption = this.getOptions(allOption, character)
      console.log('totalOption', totalOption)

      // ev는 str 수치를 더한다.
      totalOption.ev += totalOption.str

      // dex는 레벨을 더한다.
      totalOption.dex += character.lv

      const result = optionOrderArr.map(option => ({[option]: totalOption[option]}))
      console.log('result', result)
      return result
    },
    optionDefaultValue(key, character) {
      return key === 'hp' ? hpDefaultValueByHero[character.hero.groupName] : optionDefaultValue[key]
    },
    getOptions (allOption, character) {
      const options = allOption
        .reduce((acc, data) => { 
          if(!data?.option) return acc
          // 여기: 데이터 없으면 기본값 뱉도록 수정 필요
          const { option: options, gradeOption: gradeOptions, stack } = data
          for(const option of options) {
            const key = Object.keys(option)[0]
            const accValue = acc[key] || this.optionDefaultValue(key, character)
            const newValue = accValue + this.calcOptionByStack(option, stack)
            Object.assign(acc, {[key]: newValue})
          }
          if(!gradeOptions) return acc
          for(const gradeOption of gradeOptions) {
            const key = Object.keys(gradeOption)[0]
            const accValue = acc[key] || this.optionDefaultValue(key, character)
            const newValue = accValue + this.calcOptionByStack(gradeOption, 1)
            Object.assign(acc, {[key]: newValue})
          }

          // acc = acc.concat(options)
          return acc
        }, {})
      return options
    },    
    calcOptionByStack(option, stack) {
      const key = Object.keys(option)[0]
      const optionValueMin = (option[key].split('~')[0]*1)
      const optionValueMax = option[key].split('~')[1]
      const stackValue = (stack*1) || 1
      const optionValueResult = optionValueMax 
        ? (((optionValueMax - (optionValueMin*1)) / 100) * stackValue) + optionValueMin
        : optionValueMin
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