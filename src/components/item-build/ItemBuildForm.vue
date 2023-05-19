<template>
  <div class="wrap-categories">
    <div class="inner-size-basic">
      <section class="wrap-category title">
        <h3 class="title-category">제목</h3>
        <base-input
          :value="buildTitle"
          size="small"
          placeholder="빌드 제목"
          :is-on-focus="isOnFocusTitle"
          @onUpdateInput="(value) => $emit('onUpdateTitleInput', value)"
        />
      </section>
      <section class="wrap-category character">
        <h3 class="title-category">캐릭터</h3>
        <option-bar
          :options="heroOptions"
          :select-list="buildCharacters"
          :can-multi-select="false"
          size="small"
          @onChange="(list) => $emit('onChangeCharacterOption', list)"
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
  props: {
    buildInfoString: {
      type: String,
      default: null
    },
    buildTitle: {
      type: String,
      required: true
    },
    buildCharacters: {
      type: Array,
      required: true
    },
    isOnFocusTitle: {
      type: Boolean,
      default: false
    },
    isOnFocusStack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      commonOption: { all: 'ALL' },
      heroOptions: {},
      itemFilterOptions: {},
      searchBoxFullData: [],
      selectedItem: null,
      itemStack: 0,
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
    }),
    itemTypeDefs() {
      return itemTypeDefs
    },
    buildInfo() {
      // if(!this.buildInfo) return null
      return JSON.parse(this.buildInfoString)
    }
  },
  async created() {
    if(this.items.length === 0) await this.getItems()
    if(this.equipmentsTable.length === 0) await this.getEquipmentsTable()
    if(this.sailorsSynergy.length === 0) await this.getSailorsSynergy()
    if(this.shipsTable.length === 0) await this.getShipsTable()
    if(this.colleagues.length === 0) await this.getColleagues()
    if(this.heroes.length === 0) await this.getHeroes()
    this.heroOptions = this.heroes.reduce((result, hero) => {
      if(hero.name.includes('(스킨)')) return result
      result[hero.imageName] = hero.name
      return result
    }, {})
    this.itemFilterOptions =  {...this.commonOption, ...noEquipOptions}
    this.setSearchBoxFullData()
  },
  methods: {
    ...mapActions({
      getItems: 'item/GET_ITEMS',
      getHeroes: 'item/GET_HEROES',
      getEquipmentsTable: 'item/GET_EQUIPMENTS_TABLE',
      getSailorsSynergy: 'item/GET_SAILORS_SYNERGY',
      getShipsTable: 'item/GET_SHIPS_TABLE',
      getColleagues: 'item/GET_COLLEAGUES',
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

      this.$emit('onSelectItem')
    },
    addItem(e, item) {
      e && e.preventDefault()      
      const selectedItem = item || {...this.selectedItem}
      const { type } = selectedItem

      if(canEnhance(selectedItem) && this.itemStack) {
        selectedItem.stack = this.itemStack
        console.log("ddd", selectedItem, this.itemStack)
      }

      let blankSlotIndex = 0
      for(const slot of this.buildInfo[type]) {
        if(!slot) break
        blankSlotIndex++
        continue
      }

      if(slotNumbers[type] === blankSlotIndex) {
        alert(`${getTypeKorName(type)} 아이템은 ${ALERTS.ITEM_SETTING.OVER_SLOT(slotNumbers[type])}`)
        return
      }

      this.$emit('onAddItem', { selectedItem, blankSlotIndex })
      // reset select item
      this.resetSelectItem()
    },
    resetSelectItem() {
      if(!this.selectedItem) return
      this.selectedItem = null
      // this.itemStack = 0
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
@import '@/assets/style/components/item-build/ItemBuildForm.scss';
</style>