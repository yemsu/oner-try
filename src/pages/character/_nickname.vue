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
        v-if="charactersParsed"
        :tabs="charactersParsed"
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
        </template>
      </v-tab>
    </div>
  </div>
</template>

<script>
import CharacterSearchBox from "@/components/pages/character/SearchBox.vue"
import VTab from '@/components/common/VTab.vue'
import TitleContent from '@/components/common/TitleContent.vue'
import { fillDataAndInsertValue, getDefaultData, parserStrData, fillDefaultList, findData } from '@/plugins/utils/item'
import setMeta from '@/plugins/utils/meta';
import { deepClone, addCommaNumber } from '@/plugins/utils'
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
    const { user: { gameUsers }, item: { heroes } } = store.state
    const gameUsersData = gameUsers.length === 0
      ? await store.dispatch('user/GET_GAME_USERS')
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
      charactersParsed: null,
      selectedChar: null,
      ships: [],
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
      characters: 'user/getCharacters',
      nickName: 'user/getNickName',
      gameUsers: 'user/getGameUsers',
      heroes:  'item/getHeroes',
      equipments: 'item/getEquipments',
      sailors: 'item/getSailors',
      colleagues: 'item/getColleagues',
      items: 'item/getItems',
    })
  },
  mounted() {
    this.fnSearch(this.nickname)

    // this.mergePVData()
  },
  methods: {
    ...mapActions({
      getCharacters: 'user/GET_CHARACTERS',
      getItems: 'item/GET_ITEMS'
    }),
    ...mapMutations({
      setUserNickName: 'user/SET_NICKNAME'
    }),
    async fnSearch(newNickName) {
      console.log('setSearchResult', newNickName)

      this.setUserNickName(newNickName)
      await this.getCharacters({ nickName: newNickName })
      console.log('characters 원형', this.characters)

      if(!this.characters) {
        alert('존재하지 않는 닉네임이거나, 보유 캐릭터가 없습니다.')
        console.log(this.$route)
        this.$router.push('/character')
        return false
      }

      this.sendPageView()
      
      // console.log('heroes', this.heroes)
      if(this.items.length === 0) await this.getItems()
      this.ships = this.items.filter(item => item.type === 'ship')
      const newChars = deepClone(this.characters).map(character => {
        const checkDone = character.hero
        if(checkDone) return character

        const heroData = findData(this.heroes, 'name', character.heroName)
        const hero = heroData ? deepClone(heroData) : {id: character.heroName}
        hero.bounty = addCommaNumber(character.bounty.trim())

        const equipments = this.dataParser(character, 'equipments')
        const sailors = this.dataParser(character, 'sailors')
        const colleagues = this.dataParser(character, 'colleagues')
        const ship = this.dataParser(character, 'ship')

        return Object.assign(character, { hero, equipments, sailors, colleagues , ship})
      })

      this.charactersParsed = newChars
      // console.log('charactersParsed', this.charactersParsed)
    },
    dataParser(character, type) {
      const data = () => {
        const _data = character[type]
        const dataTypeArray = Array.isArray(_data) ? _data : [_data]
        const result = dataTypeArray.map(data => getDefaultData(data))
        return parserStrData(result.join(','))
      }

      const newData = fillDataAndInsertValue(this.items, data(), 'stack', true)

      const result = type.includes('colleague') 
        ? fillDefaultList(newData, 3)
        : type.includes('ship')
          ? fillDefaultList(newData, 1)
          : newData
      return result
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