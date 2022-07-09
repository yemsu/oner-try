<template>
  <div>
    <div class="top-bar">
      <div class="inner-size-basic">
        <div class="align-right">
          <search-box
            category="닉네임(첫 검색 대소문자 구분)"
            :matchingData="{type: 'string', data: userNickNames}"
            :defaultMatchingList="false"
            size="small"
            resultPath="/character"
            :paramKey="['nickname']"
            @onRemoveSearchResult="removeSearchResult"
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
                    :badgeDrop="false"
                    :badgeType="false"
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
import VTab from '@/components/common/VTab.vue'
import TitleContent from '@/components/common/TitleContent.vue'
import { fillDataAndInsertValue, getDefaultData, parserStrData, fillDefaultList, findData } from '@/plugins/utils/item'
import setMeta from '@/plugins/utils/meta';
import { deepClone, addCommaNumber } from '@/plugins/utils'
import { checkUpdatePageView } from '@/plugins/utils/pageView'
import { postCharacterPageView } from '@/plugins/utils/https'
import { mapGetters } from 'vuex';
export default {
  name: 'CharacterResult',
  components: {
    VTab,
    TitleContent
  },
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `${this.nickname}의 캐릭터`,
      description: `${this.nickname}의 캐릭터 정보입니다.`,
    })
  },
  async asyncData({ store, params }) {
    const { gameUsers, heroes } = store.state
    const gameUsersData = gameUsers.length === 0
      ? await store.dispatch('GET_GAME_USERS')
      : gameUsers
    const userNickNames = gameUsersData.map(user => user.nickName)
    if(heroes.length === 0) await store.dispatch('GET_HEROES')
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
      characters: 'getCharacters',
      heroes: 'getHeroes',
      equipments: 'getEquipments',
      nickName: 'getNickName',
      gameUsers: 'getGameUsers',
      sailors: 'getSailors',
      colleagues: 'getColleagues',
      items: 'getItems',
    })
  },
  mounted() {
    this.fnSearch(this.nickname)
    this.sendPageView()
  },
  methods: {
    async fnSearch(newNickName) {
      console.log('setSearchResult', newNickName)

      this.$store.commit('SET_NICKNAME', newNickName)
      await this.$store.dispatch('GET_CHARACTERS', { nickName: newNickName })
      console.log('characters 원형', this.characters)

      if(!this.characters) {
        alert('존재하지 않는 닉네임이거나, 보유 캐릭터가 없습니다.')
        console.log(this.$route)
        this.$router.push('/character')
        return false
      }

      // console.log('heroes', this.heroes)
      if(this.items.length === 0) await this.$store.dispatch('GET_ITEMS')
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
        return dataTypeArray.map(data => getDefaultData(data))
      }

      const newData = fillDataAndInsertValue(this.items, data().join(','), 'stack', true)
      for(const data of newData) {
        if(data && data.option) {
          data.option = parserStrData(data.option)
        }
        if(data && data.gradeOption) {
          data.gradeOption = parserStrData(data.gradeOption)
        }
      }

      const result = type.includes('colleague') 
        ? fillDefaultList(newData, 3)
        : type.includes('ship')
          ? fillDefaultList(newData, 1)
          : newData
      return result
    },
    removeSearchResult() {
      this.charactersParsed = null
      this.selectedChar = null
    },
    async sendPageView() {
      const namePageView = await checkUpdatePageView('character', this.nickname)
      namePageView && postCharacterPageView({ name: this.nickname })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/character/result.scss';
</style>