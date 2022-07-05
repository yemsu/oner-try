<template>
  <div>
    <div class="area-search inner-size-basic">
      <search-box
        category="닉네임(첫 검색 대소문자 구분)"
        :matchingData="{type: 'string', data: userNickNames}"
        :defaultMatchingList="false"
        size="side"
        :paramKey="['nickname']"
        @onRemoveSearchResult="removeSearchResult"
      />
    </div>
    <div class="inner-size-basic">
      <h2 class="title-page"><i class="icon-pirate">☠</i> {{ params.nickname }}</h2>
      <v-tab
        v-if="charactersParsed"
        :tabs="charactersParsed"
      >
        <template v-slot:tab="{ tab: {data, isActive} }">
          <item-box
            :item="data.hero"
            :wanted-paper="true"
            :size="isActive ? 'xbig' : 'big'"
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
                :badgeDrop="false"
                :badgeType="false"
              />
            </title-content>
          </div>
        </template>
      </v-tab>
    </div>
  </div>
</template>

<script>
import ItemList from '@/components/item/ItemList.vue'
import TitleContent from '@/components/common/TitleContent.vue'
import ItemBox from '@/components/item/ItemBox.vue'
import VTab from '@/components/common/VTab.vue'
import { fillDataAndInsertValue, getDefaultData, parserStrData, fillDefaultList, findData } from '@/plugins/item'
import { deepClone, addCommaNumber } from '@/plugins'
import { postGameUser } from '@/plugins/https'
import { mapGetters } from 'vuex';
export default {
  name: 'CharacterResult',
  components: {
    TitleContent,
    ItemBox,
    ItemList,
    VTab
  },
  async asyncData({ store, params }) {
    const { state } = store
    if(state.gameUsers.length === 0) await store.dispatch('GET_GAME_USERS')
    if(state.heroes.length === 0) await store.dispatch('GET_HEROES')
    const userNickNames = state.gameUsers.map(user => user.nickName)

    return {
      userNickNames,
      params
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
    this.fnSearch(this.params.nickname)
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
        const hero = heroData || {id: character.heroName}
        hero.bounty = addCommaNumber(character.bounty)

        const equipments = this.dataParser(character, 'equipments')
        const sailors = this.dataParser(character, 'sailors')
        const colleagues = this.dataParser(character, 'colleagues')
        const ship = this.dataParser(character, 'ship')

        return Object.assign(character, { hero, equipments, sailors, colleagues , ship})
      })

      this.charactersParsed = newChars
      // console.log('charactersParsed', this.charactersParsed)
      // post 
      postGameUser({ nickName: newNickName })
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/character/result.scss';
</style>