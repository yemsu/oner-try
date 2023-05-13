<template>
  <div>
    <section class="inner-size-basic mrg-top-medium">
      <div class="area-page-title">
        <h2 class="title">🔥 빌드 만들기</h2>
      </div>
    </section>
    <div class="wrap-categories">
      <div class="inner-size-basic">
        <section class="wrap-category title">
          <h3 class="title-category">제목</h3>
          <base-input
            :value="buildTitle"
            @onUpdateInput="onUpdateTitleInput"
            size="small"
            placeholder="빌드 제목"
          />
        </section>
        <section class="wrap-category character">
          <h3 class="title-category">캐릭터</h3>
          <option-bar
            :options="heroOptions"
            :select-list="buildCharacters"
            size="small"
            @onChange="(list) => buildCharacters = list"
          />
        </section>
        <section class="wrap-category item">
          <h3 class="title-category">아이템</h3>
          <item-search-box
            v-if="searchBoxFullData.length > 0 && items.length > 0"
            :full-data="searchBoxFullData"
            :fn-after-search="selectItem"
            size="small"
            placeholder="추가할 아이템 검색"
          />
          <v-tab :tabs="itemTypeDefs" type="basic">
            <template v-slot:tab="{ tab: { data } }">
              {{ data.title }}
            </template>
            <template v-slot:content="{ activeTab }">
              <item-list
                :items="itemListData(activeTab.type)"
                :type="activeTab.type"
                column-num="5"
              >
                <template v-slot="{ item }">
                  <item-box
                    :item="item"
                    :is-link="false"
                    type="list"
                    size="xxsmall"
                    :has-click-event="true"
                    @click="selectItem"
                  />
                </template>
              </item-list>
            </template>
          </v-tab>
        </section>
      </div>
    </div>
    <div class="inner-size-basic">
      <section>
        <h2 class="ir-hidden">선택한 아이템빌드</h2>
        <item-build
          v-if="buildInfoString"
          :build-info="buildInfoString"
          :making-mode="true"
          @delete="onDeleteBuildItem"
        />
      </section>
      <wrap-buttons>
        <base-button
          type="square-round"
          size="large"
          bg="point"
          @click="onClickSave"
        >저장</base-button>
      </wrap-buttons>
    </div>
  </div>
</template>

<script>
import setMeta from '@/plugins/utils/meta';
import OptionBar from '@/components/common/OptionBar.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import WrapButtons from '@/components/common/WrapButtons.vue';
import ItemBuild from '@/components/item/ItemBuild.vue'
import ItemSearchBox from '@/components/item/ItemSearchBox.vue';
import VTab from '@/components/common/VTab.vue';
import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { itemTypeDefs } from '@/plugins/utils/item-def';
import { mapGetters, mapActions } from 'vuex';
import BaseInput from '@/components/common/BaseInput.vue';
import ALERTS from '@/constants/ALERTS.js'

export default {
  name: 'character-result',
  components: {
    ItemBuild,
    ItemSearchBox,
    VTab,
    BaseInput,
    OptionBar,
    BaseButton,
    WrapButtons
  },
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `빌드 만들기`,
      description: `나만의 빌드를 만들어 보세요!`,
    })
  },
  data() {
    return {
      searchBoxFullData: [],
      heroOptions: {},
      buildTitle: '',
      buildCharacters: [],
      buildInfo: {
        equipment: new Array(6),
        sailor: new Array(6),
        colleague: new Array(3),
        ship: new Array(1),
        ryuo: new Array(1),
        synergy: [],
        totalOption: []
      },
      buildInfoString: null
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/getItems',
      synergies: 'item/getSynergies',
      heroes: 'item/getHeroes',
      isLogin: 'auth/getIsLogin'
    }),
    itemTypeDefs() {
      return itemTypeDefs
    }
  },
  async created() {
    if(this.items.length === 0) await this.getItems()
    if(this.synergies.length === 0) await this.getSynergies()
    if(this.heroes.length === 0) await this.getHeroes()
    this.heroOptions = this.heroes.reduce((result, hero) => {
      result[hero.imageName] = hero.name
      return result
    }, {})
    this.setTotalOption()
    this.setSearchBoxFullData()
    this.setBuildInfoString()
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      getItems: 'item/GET_ITEMS',
      getSynergies: 'item/GET_SYNERGIES',
      getHeroes: 'item/GET_HEROES',
      saveItemBuild: 'itemBuild/POST_ITEM_BUILD'
    }),
    setSearchBoxFullData() {
      this.searchBoxFullData = this.items.filter((item) => item.type !== 'etcItem')
    },
    setBuildInfoString() {
      this.buildInfoString = JSON.stringify(this.buildInfo)
    },
    setTotalOption() {
      this.buildInfo.totalOption = getTotalOption(this.buildInfo, this.buildInfo.synergy)
    },
    selectItem(name) {
      const item = this.items.find((item) => item.name === name)

      let blankSlotIndex = 0
      for(const slot of this.buildInfo[item.type]) {
        if(!slot) break
        blankSlotIndex++
        continue
      }

      this.buildInfo[item.type][blankSlotIndex] = item
      this.ProcessAfterUpdateItem(item)
    },
    ProcessAfterUpdateItem(item) {
      if(item.type === 'sailor') {
        this.buildInfo.synergy = getCharacterSynergies(this.buildInfo.sailor, this.synergies)
      } 
      this.setTotalOption()
      this.setBuildInfoString()
    },
    itemListData(activeTabType) {
      return this.items.filter(({type}) => type === activeTabType)
    },
    onClickItem(name) {
      this.selectItem(name)
    },
    onUpdateTitleInput(title) {
      this.buildTitle = title
    },
    onClickSave() {  
      const passValidation = this.checkValidation()
      if(!passValidation) return

      this.saveItemBuild({
        title: this.buildTitle,
        characterName: this.stringifyForDB(this.buildCharacters),
        equipments: this.stringifyForDB(equipment), 
        sailor: this.stringifyForDB(sailor), 
        ship: ship[0]?.id
      })
    },
    stringifyForDB(itemList) {
      return itemList
          .filter((item) => !!item)
          .map((item) => item?.id || item)
          .join(',')
    },
    checkValidation() {
      if(!this.isLogin) {
        alert(ALERTS.NEED_LOGIN)
        return false
      }
      const { equipment, sailor, ship } = this.buildInfo

      const alertMessages = []
      if(!this.buildTitle) {
        alertMessages.push(ALERTS.VALIDATIONS.TITLE)
      }
      if(this.buildCharacters.length === 0) {
        alertMessages.push(ALERTS.VALIDATIONS.CHARACTER)
      }
      const items = [...equipment, ...sailor, ...ship].filter(item => item)
      if(items.length === 0) {
        alertMessages.push(ALERTS.VALIDATIONS.ITEM)
      }
      if(alertMessages.length > 0) {
        alert(alertMessages.join('\n'))
        return false
      }    

      return true
    },
    onDeleteBuildItem(item) {
      const { type, id } = item
      this.buildInfo[type] = this.buildInfo[type].map(item => {
        if(item?.id === id) return null
        return item
      })
      this.ProcessAfterUpdateItem(item)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/item-build/new.scss';
</style>