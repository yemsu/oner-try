<template>
  <div>
    <div>
      <div class="wrap-categories">
        <div class="inner-size-basic">
          <section class="wrap-category title">
            <h3 class="title-category">제목</h3>
            <base-input
              :value="buildTitle"
              size="small"
              placeholder="빌드 제목"
              :is-on-focus="isOnFocusTitle"
              @onUpdateInput="(title) => buildTitle = title"
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
          <section class="wrap-category selected-item">
            <h3 class="title-category">아이템 강화 수치 설정</h3>
            <form @submit="addItem">
              <div class="area-item">
                <item-box
                  :item="selectedItem"
                  size="small"
                  type="list"
                />
              </div>
              <base-input
                input-type="number"
                :value="itemStack"
                size="small"
                placeholder="스택"
                maxlength="3"
                :is-on-focus="isOnFocusStack"
                @onUpdateInput="(value) => itemStack = value"
              />
              <base-button
                type="round"
                bg="point"
              >
                아이템 추가
              </base-button>
            </form>
          </section>
          <section class="wrap-category item">
            <div class="title-category">
              <h3 class="title-category">아이템</h3>
              <p class="text-refer">* 선택한 아이템을 한번 더 클릭하면 빌드에 바로 추가됩니다.</p>
            </div>
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
                  :grade-menus="getGradeMenu(activeTab.type)"
                  :option-menus="itemFilterOptions"
                  :has-click-event="true"
                  :table-min-width="getTableMinWidth(activeTab.type)"
                  @click="(item) => selectItem(item.name)"
                  size="small"
                />
              </template>
            </v-tab>
          </section>
        </div>
      </div>
    </div>
    <div class="inner-size-basic">
      <!-- item build slot -->
      <slot :data="{ buildInfoString, onDeleteBuildItem, onClickSave }"></slot>
    </div>
  </div>
</template>

<script>
import { itemTypeDefs, maxStack, slotNumbers, canEnhance, noEquipOptions, gradesDef, equipmentGrades, sailorGrades } from '@/plugins/utils/item-def';
import ItemSearchBox from '@/components/item/ItemSearchBox.vue';
import ItemFilterTable from '@/components/item/ItemFilterTable.vue';
import BaseButton from '../common/BaseButton.vue';
import OptionBar from '../common/OptionBar.vue';
import BaseInput from '../common/BaseInput.vue';
import VTab from '../common/VTab.vue';
import { getTypeKorName } from '@/plugins/utils/item';
import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ItemSearchBox,
    ItemFilterTable,
    BaseButton,
    OptionBar,
    BaseInput,
    VTab
  },
  data() {
    return {
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
      commonOption: { all: 'ALL' },
      heroOptions: {},
      itemFilterOptions: {},
      searchBoxFullData: [],
      selectedItem: null,
      itemStack: 0,
      buildInfoString: null,
      isSaveSuccess: false,
      isOnFocusStack: false,
      isOnFocusTitle: false,
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/getItems',
      heroes: 'item/getHeroes',
      equipmentsTable: 'item/getEquipmentsTable',
      sailorsSynergy: 'item/getSailorsSynergy',
      shipsTable: 'item/getShipsTable',
      colleagues: 'item/getColleagues',
      synergies: 'item/getSynergies',
      isLogin: 'auth/getIsLogin',
    }),
    itemTypeDefs() {
      return itemTypeDefs
    }
  },
  async created() {
    if(this.items.length === 0) await this.getItems()
    if(this.equipmentsTable.length === 0) await this.getEquipmentsTable()
    if(this.sailorsSynergy.length === 0) await this.getSailorsSynergy()
    if(this.shipsTable.length === 0) await this.getShipsTable()
    if(this.colleagues.length === 0) await this.getColleagues()
    if(this.heroes.length === 0) await this.getHeroes()
    if(this.synergies.length === 0) await this.getSynergies()
    this.heroOptions = this.heroes.reduce((result, hero) => {
      if(hero.name.includes('(스킨)')) return result
      result[hero.imageName] = hero.name
      return result
    }, {})
    this.itemFilterOptions =  {...this.commonOption, ...noEquipOptions}
    this.setSearchBoxFullData()
    this.setTotalOption()
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
      getHeroes: 'item/GET_HEROES',
      getEquipmentsTable: 'item/GET_EQUIPMENTS_TABLE',
      getSailorsSynergy: 'item/GET_SAILORS_SYNERGY',
      getShipsTable: 'item/GET_SHIPS_TABLE',
      getColleagues: 'item/GET_COLLEAGUES',
      getSynergies: 'item/GET_SYNERGIES',
      saveItemBuild: 'itemBuild/POST_ITEM_BUILD',
    }),
    setSearchBoxFullData() {
      this.searchBoxFullData = this.items.filter((item) => item.type !== 'etcItem')
    },
    selectItem(itemName) {
      const item = [...this.items, ...this.colleagues].find((item) => item.name === itemName)
      if(!canEnhance(item) || this.selectedItem?.name === itemName) {
        this.addItem(null, item)
        return
      }
      this.selectedItem = item

      if(!this.itemStack || this.itemStack >  maxStack(item)) {
        this.itemStack = maxStack(item)
      }

      setTimeout(() => {
        this.isOnFocusStack = true
      }, 100);
      setTimeout(() => {
        this.isOnFocusStack = false
      }, 500)
    },
    addItem(e, item) {
      e && e.preventDefault()      
      const selectedItem = item || {...this.selectedItem}
      const { type } = selectedItem

      if(canEnhance(selectedItem) && this.itemStack) {
        selectedItem.stack = this.itemStack
      }

      let blankSlotIndex = 0
      for(const slot of this.buildInfo[type]) {
        if(!slot) break
        blankSlotIndex++
        continue
      }

      if(slotNumbers[type] === blankSlotIndex) {
        alert(`${getTypeKorName(type)} 아이템은 ${this.$ALERTS.ITEM_SETTING.OVER_SLOT(slotNumbers[type])}`)
        return
      }

      this.buildInfo[type][blankSlotIndex] = selectedItem
      this.ProcessAfterUpdateItem(selectedItem)
      // reset select item
      this.resetSelectItem()
    },
    resetSelectItem() {
      if(!this.selectedItem) return
      this.selectedItem = null
      // this.itemStack = 0
    },
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
    setBuildInfoString() {
      this.buildInfoString = JSON.stringify(this.buildInfo)
    },
    setTotalOption() {
      this.buildInfo.totalOption = getTotalOption(this.buildInfo, this.buildInfo.synergy)
    },
    ProcessAfterUpdateItem(item) {
      if(item.type === 'sailor') {
        this.buildInfo.synergy = getCharacterSynergies(this.buildInfo.sailor, this.synergies)
      } 
      this.setTotalOption()
      this.setBuildInfoString()
    },
    async onClickSave() {  
      const { equipment, sailor, colleague, ship } = this.buildInfo
      const passValidation = this.checkValidation()
      if(!passValidation) return
      const saveSuccess = await this.saveItemBuild({
        title: this.buildTitle,
        characterName: this.buildCharacters[0],
        equipment: this.stringifyForDB(equipment), 
        sailor: this.stringifyForDB(sailor), 
        colleague: this.stringifyForDB(colleague), 
        ship: this.stringifyForDB([ship[0]])
      })
      
      if(!saveSuccess) return
      this.isSaveSuccess = true
      this.$router.push('/item-build/my')
    },
    stringifyForDB(itemList) {
      const dbData = itemList
        .filter((item) => !!item)
        .map((item) => `${item.id}:${item.stack}`)
        .join(',')
      return dbData
    },
    checkValidation() {
      if(!this.isLogin) {
        alert(this.$ALERTS.NEED_LOGIN)
        return false
      }
      const { equipment, sailor, colleague, ship } = this.buildInfo

      const alertMessages = []
      if(!this.buildTitle) {
        alertMessages.push(this.$ALERTS.VALIDATIONS.TITLE)
        this.isOnFocusTitle = true
        setTimeout(() => {
          this.isOnFocusTitle = false
        }, 500)
      }
      if(this.buildCharacters.length === 0) {
        alertMessages.push(this.$ALERTS.VALIDATIONS.CHARACTER)
      }
      const items = [...equipment, ...sailor, ...colleague, ...ship].filter(item => item)
      if(items.length === 0) {
        alertMessages.push(this.$ALERTS.VALIDATIONS.ITEM)
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
    getGradeMenu(type) {
      const getGradeMaps = (itemTypeGrades) => {
        return itemTypeGrades.reduce((result, keyName) => {
            result[keyName] = gradesDef[keyName]
            return result
          }, {})
      }
      switch (type) {
        case 'equipment':
          return {...this.commonOption, ...getGradeMaps(equipmentGrades)}
        case 'sailor':
          return {...this.commonOption, ...getGradeMaps(sailorGrades)}
        case 'ship':
          return null
      }
    },
    getTableData(activeTab) {
      switch (activeTab.type) {
        case 'equipment':
          return JSON.stringify(this.equipmentsTable)
        case 'sailor':
          return JSON.stringify(this.sailorsSynergy)
        case 'ship':
          return JSON.stringify(this.shipsTable)
        case 'colleague':
          return JSON.stringify(this.colleagues)
      }
    },
    getTableMinWidth(type) {
      switch (type) {
        case 'equipment':
          return '500px'
        case 'sailor':
          return '650px'
        case 'colleague':
        case 'ship':
          return '300px'
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
        case 'colleague':
          return [
            {
              title: '동료',
              type: 'item',
              width: '40%'
            },
            {
              title: '옵션',
              type: 'option',
              width: '%'
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/item-build/NewItemBuild.scss';
</style>