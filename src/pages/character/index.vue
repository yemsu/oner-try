<template>
  <div class="wrap-search">
    <ItemCheckerBoard
      :showBg="!charactersParsed"
      :items="heroes"
    />
    <div :class="['area-search', {'inner-size-basic': charactersParsed}]">
      <search-box
        category="닉네임(첫 검색 대소문자 구분)"
        :matchingData="{type: 'string', data: userNickNames}"
        :defaultMatchingList="false"
        size="main"
        :hasResult="charactersParsed && true"
        :paramKey="['nickname']"
        @onRemoveSearchResult="removeSearchResult"
      />
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/search/SearchBox.vue'
import ItemCheckerBoard from '@/components/item/ItemCheckerBoard.vue'
import { fillDataAndInsertValue, getDefaultData, parserStrData, fillDefaultList, findData } from '@/plugins/item'
import { deepClone, addCommaNumber } from '@/plugins'
import { postGameUser } from '@/plugins/https'
import { mapGetters } from 'vuex';
export default {
  name: 'SearchCharacter',
  components: {
    SearchBox,
    ItemCheckerBoard,
  },
  data() {
    return {
      charactersParsed: null,
      selectedChar: null,
      userNickNames: [],
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
  async created() {
    if(this.gameUsers.length === 0) await this.$store.dispatch('GET_GAME_USERS')
    if(this.heroes.length === 0) await this.$store.dispatch('GET_HEROES')
    this.userNickNames = this.gameUsers.map(user => user.nickName)
  },
  methods: {
    removeSearchResult() {
      this.charactersParsed = null
      this.selectedChar = null
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/views/SearchCharacter.scss';
</style>