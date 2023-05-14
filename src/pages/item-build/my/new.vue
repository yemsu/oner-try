<template>
  <div>
    <div class="inner-size-basic mrg-top-medium">
      <div class="area-page-title">
        <h2 class="title">🔥 빌드 만들기</h2>
      </div>
    </div>
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
            :can-multi-select="false"
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
            :show-default-list="false"
            size="xsmall"
            placeholder="추가할 아이템 검색"
          />
          <v-tab :tabs="itemTypeDefs" type="basic">
            <template v-slot:tab="{ tab: { data } }">
              {{ data.title }}
            </template>
            <template v-slot:content="{ activeTab }">
              <ItemFilterTable
                v-if="getTableData(activeTab).length > 0"
                :items-stringified="getTableData(activeTab)"
                :table-info="getTableInfo(activeTab)"
                :grade-menus="activeTab.type === 'ship' ? null : gradeMenus"
                :option-menus="optionMenus"
                :has-click-event="true"
                @click="(item) => selectItem(item.name)"
                size="small"
              />
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
        >빌드 저장</base-button>
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
import ItemFilterTable from '../../../components/item/ItemFilterTable.vue';
import VTab from '@/components/common/VTab.vue';
import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { itemTypeDefs, maxStack, slotNumbers, noEquipOptions, gradesDef, equipmentGrades } from '@/plugins/utils/item-def';
import { getTypeKorName } from '@/plugins/utils/item';
import { mapGetters, mapActions } from 'vuex';
import BaseInput from '@/components/common/BaseInput.vue';
import ALERTS from '@/constants/ALERTS.js'
import setMeta from '@/plugins/utils/meta';

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `MY 빌드 만들기`,
      description: 'MY 빌드 만들기. 나만의 빌드를 만들어볼 수 잇습니다.',
    })
  },
  components: {
    ItemBuild,
    ItemSearchBox,
    VTab,
    BaseInput,
    OptionBar,
    BaseButton,
    WrapButtons,
    ItemFilterTable
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
      buildInfoString: null,
      gradeMenus: {},
      optionMenus: {},
      isSaveSuccess: false
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/getItems',
      synergies: 'item/getSynergies',
      heroes: 'item/getHeroes',
      isLogin: 'auth/getIsLogin',
      equipmentsTable: 'item/getEquipmentsTable',
      sailorsSynergy: 'item/getSailorsSynergy',
      shipsTable: 'item/getShipsTable',
    }),
    itemTypeDefs() {
      return itemTypeDefs
    }
  },
  async created() {
    if(this.equipmentsTable.length === 0) await this.getEquipmentsTable()
    if(this.sailorsSynergy.length === 0) await this.getSailorsSynergy()
    if(this.shipsTable.length === 0) await this.getShipsTable()
    const commonMenu = { all: 'ALL' }
    const gradeMaps = equipmentGrades.reduce((result, keyName) => {
      result[keyName] = gradesDef[keyName]
      return result
    }, {})
    this.gradeMenus = {...commonMenu, ...gradeMaps}
    this.optionMenus =  {...commonMenu, ...noEquipOptions}
    if(this.items.length === 0) await this.getItems()
    if(this.synergies.length === 0) await this.getSynergies()
    if(this.heroes.length === 0) await this.getHeroes()
    this.heroOptions = this.heroes.reduce((result, hero) => {
      if(hero.name.includes('(스킨)')) return result
      result[hero.imageName] = hero.name
      return result
    }, {})
    this.setTotalOption()
    this.setSearchBoxFullData()
    this.setBuildInfoString()
  },
  mounted() {
    this.addBeforeUnloadEvent()
  },
  beforeRouteLeave (to, from, next) {
    if(this.isSaveSuccess) {
      next()
      return
    }
    const willLeave = confirm('페이지를 떠나시겠습니까? \n변경사항이 저장되지 않을 수 있습니다.')
    if(willLeave) next()
  },
  beforeDestroy() {
    this.removeBeforeUnloadEvent()
  },
  methods: {
    ...mapActions({
      getItems: 'item/GET_ITEMS',
      getSynergies: 'item/GET_SYNERGIES',
      getHeroes: 'item/GET_HEROES',
      getEquipmentsTable: 'item/GET_EQUIPMENTS_TABLE',
      getSailorsSynergy: 'item/GET_SAILORS_SYNERGY',
      getShipsTable: 'item/GET_SHIPS_TABLE',
      saveItemBuild: 'itemBuild/POST_ITEM_BUILD',
    }),
    addBeforeUnloadEvent() {
      window.addEventListener('beforeunload', this.confirmClose);
    },
    removeBeforeUnloadEvent() {
      window.removeEventListener('beforeunload', this.confirmClose);
    },
    confirmClose(e) {
      e.preventDefault();
      e.returnValue = '';
    },
    setSearchBoxFullData() {
      this.searchBoxFullData = this.items.filter((item) => item.type !== 'etcItem')
    },
    setBuildInfoString() {
      this.buildInfoString = JSON.stringify(this.buildInfo)
    },
    setTotalOption() {
      this.buildInfo.totalOption = getTotalOption(this.buildInfo, this.buildInfo.synergy)
    },
    selectItem(itemName) {
      const item = this.items.find((item) => item.name === itemName)

      let blankSlotIndex = 0
      for(const slot of this.buildInfo[item.type]) {
        if(!slot) break
        blankSlotIndex++
        continue
      }


      if(slotNumbers[item.type] === blankSlotIndex) {
        alert(`${getTypeKorName(item.type)} 아이템은 ${ALERTS.ITEM_SETTING.OVER_SLOT(slotNumbers[item.type])}`)
        return
      }

      item.stack = maxStack(item)
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
    async onClickSave() {  
      const { equipment, sailor, ship } = this.buildInfo
      const passValidation = this.checkValidation()
      if(!passValidation) return

      const saveSuccess = await this.saveItemBuild({
        title: this.buildTitle,
        characterName: this.stringifyForDB(this.buildCharacters),
        equipments: this.stringifyForDB(equipment), 
        sailor: this.stringifyForDB(sailor), 
        ship: ship[0]?.id
      })
      
      if(!saveSuccess) return
      this.isSaveSuccess = true
      this.$router.push('/item-build/my')
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
    onDeleteBuildItem({ item, index }) {
      this.buildInfo[item.type].splice(index, 1, null)
      this.ProcessAfterUpdateItem(item)
    },
    getTableData(activeTab) {
      switch (activeTab.type) {
        case 'equipment':
          return JSON.stringify(this.equipmentsTable)
        case 'sailor':
          return JSON.stringify(this.sailorsSynergy)
        case 'ship':
          return JSON.stringify(this.shipsTable)
      }
    },
    getTableInfo(activeTab) {
      switch (activeTab.type) {
        case 'equipment':
          return [
            {
              title: '장비',
              type: 'item',
              width: '20%'
            },
            {
              title: '등급',
              type: 'grade',
              width: '7%'
            },
            {
              title: '옵션',
              type: 'option',
              width: '28%'
            },
            {
              title: '추가 옵션',
              type: 'string',
              key: 'gradeOption',
              width: '45%'
            },
          ]
        case 'sailor':
          return [
            {
              title: '선원',
              type: 'item',
              width: '20%'
            },
            {
              title: '등급',
              type: 'grade',
              width: '7%'
            },
            {
              title: '옵션',
              type: 'option',
              width: '30%'
            },
            {
              title: '인연 / 악연',
              type: 'synergy',
              width: '43%'
            },
          ]
        case 'ship':
          return [
            {
              title: '선박',
              type: 'item',
              width: '40%'
            },
            {
              title: '옵션',
              type: 'option'
            }
          ]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/item-build/new.scss';
</style>