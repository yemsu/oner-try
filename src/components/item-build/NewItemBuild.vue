<template>
  <div>
    <div v-if="itemBuild && showForm" class="wrap-categories">
      <div class="inner-size-basic">
        <section class="wrap-category title">
          <h3 class="title-category">제목</h3>
          <element-input
            :value="itemBuild.title"
            size="small"
            placeholder="빌드 제목"
            :is-on-focus="isOnFocusTitle"
            @onUpdateInput="(title) => editItemBuildData({
              keyName: 'title',
              data: title
            })"
          />
        </section>
        <section class="wrap-category character">
          <h3 class="title-category">캐릭터</h3>
          <element-option-bar
            :options="heroOptions"
            :select-list="[buildCharacterName]"
            :can-multi-select="false"
            size="small"
            @onChange="onChangeCharacter"
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
            <element-input
              input-type="number"
              :value="itemStack"
              size="small"
              placeholder="스택"
              maxlength="3"
              :is-on-focus="isOnFocusStack"
              @onUpdateInput="(value) => itemStack = value"
            />
            <element-button
              type="round"
              bg="point"
            >
              아이템 추가
            </element-button>
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
          <element-v-tab :tabs="itemTypeDefs" type="basic">
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
                @click="(item) => selectItem(item.id)"
                size="small"
              />
            </template>
          </element-v-tab>
        </section>
      </div>
    </div>
    <div class="inner-size-basic">
      <!-- item build slot -->
      <slot :data="{ buildInfoString: buildItemsString, onDeleteBuildItem, onClickSave }"></slot>
    </div>
  </div>
</template>

<script>
import { itemTypeDefs, maxStack, slotNumbers, canEnhance, noEquipOptions, gradesDef, equipmentGrades, sailorGrades } from '@/plugins/utils/item-def';
import ItemSearchBox from '@/components/item/ItemSearchBox.vue';
import ItemFilterTable from '@/components/item/ItemFilterTable.vue';
import { getTypeKorName } from '@/plugins/utils/item';
import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  components: {
    ItemSearchBox,
    ItemFilterTable,
  },
  props: {
    showForm: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      buildCharacterName: '',
      commonOption: { id: 'all', text: 'ALL' },
      heroOptions: [],
      itemFilterOptions: [],
      searchBoxFullData: [],
      selectedItem: null,
      itemStack: 0,
      buildItemsString: null,
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
      itemBuild: 'itemBuild/getItemBuild',
    }),
    itemTypeDefs() {
      return itemTypeDefs
    },
  },
  watch: {
    showForm(crr, prev) {
      (!prev && crr) ? this.addBeforeUnloadEvent() : this.removeBeforeUnloadEvent()
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
    const pureHeroes = this.heroes.filter(({name}) => !name.includes('(스킨)'))
    this.heroOptions = pureHeroes.map(({imageName, name}) => ({
      id: imageName, text: name
    }))
    const itemOptions = Object.keys(noEquipOptions).map((key) => ({
      id: key,
      text: noEquipOptions[key]
    }))
    this.itemFilterOptions =  [this.commonOption, ...itemOptions]
    this.setSearchBoxFullData()
  },
  mounted() {
    this.addBeforeUnloadEvent()

    if(!this.itemBuild) {
      this.setItemBuild({
        ...this.itemBuild,
        equipment: new Array(6),
        sailor: new Array(6),
        colleague: new Array(3),
        ship: new Array(1),
        ryuo: new Array(1),
        synergy: [],
        totalOption: []
      })
    }
    
    this.setTotalOption()
    this.setBuildItemsString()
  },
  beforeRouteLeave (to, from, next) {
    if(this.isSaveSuccess || !this.showForm) {
      next()
      return
    }
    const willLeave = confirm('페이지를 떠나시겠습니까? \n변경사항이 저장되지 않을 수 있습니다.')
    if(!willLeave) return
    next()
  },
  beforeDestroy() {
    this.setItemBuild(null)
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
      editItemBuild: 'itemBuild/PUT_ITEM_BUILD',
    }),
    ...mapMutations({
      setItemBuild: 'itemBuild/SET_ITEM_BUILD',
      editItemBuildData: 'itemBuild/EDIT_ITEM_BUILD_DATA',
      addItemBuildItem: 'itemBuild/ADD_ITEM_BUILD_ITEM',
      deleteItemBuildItem: 'itemBuild/DELETE_ITEM_BUILD_ITEM',
      setToastMessage: 'toastPopup/SET_MESSAGE',
      setToastOn: 'toastPopup/SET_IS_TRIGGER_ON',
    }),
    buildItems() {      
      const {
        equipment,
        sailor,
        colleague,
        ship,
        ryuo,
        synergy,
        totalOption
      } = this.itemBuild

      return {
        equipment,
        sailor,
        colleague,
        ship,
        ryuo,
        synergy,
        totalOption,
      }
    },
    onChangeCharacter(list) {
      this.buildCharacterName = list[0]
      this.editItemBuildData({
        keyName: 'characterName',
        data: list[0]
      })
    },
    setSearchBoxFullData() {
      this.searchBoxFullData = this.items.filter((item) => item.type !== 'etcItem')
    },
    selectItem(itemId) {
      const item = [...this.items, ...this.colleagues].find((item) => item.id === itemId)
      if(!canEnhance(item) || this.selectedItem?.id === itemId) {
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
      for(const slot of this.buildItems()[type]) {
        if(!slot) break
        blankSlotIndex++
        continue
      }

      if(slotNumbers[type] === blankSlotIndex) {
        alert(`${getTypeKorName(type)} 아이템은 ${this.$ALERTS.ITEM_SETTING.OVER_SLOT(slotNumbers[type])}`)
        return
      }
      
      this.addItemBuildItem({
        type,
        blankSlotIndex,
        selectedItem
      })
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
      if(!this.showForm) return
      window.addEventListener('beforeunload', this.confirmClose);
    },
    removeBeforeUnloadEvent() {
      if(!this.showForm) return
      window.removeEventListener('beforeunload', this.confirmClose);
    },
    confirmClose(e) {
      e.preventDefault();
      e.returnValue = '';
    },
    setBuildItemsString() {
      this.buildItemsString = JSON.stringify(this.buildItems())
    },
    setTotalOption() {
      const totalOption = getTotalOption(this.buildItems(), this.buildItems().synergy)
      this.editItemBuildData({
        keyName: 'totalOption',
        data: totalOption
      })
    },
    ProcessAfterUpdateItem(item) {
      if(item.type === 'sailor') {
        const synergy = getCharacterSynergies(this.buildItems().sailor, this.synergies)
        this.editItemBuildData({
          keyName: 'synergy',
          data: synergy
        })
      } 
      this.setTotalOption()
      this.setBuildItemsString()
    },
    getNewItemBuild() {
      const { id, title, characterName, equipment, sailor, colleague, ship } = this.itemBuild
      return {
        id,
        title,
        characterName,
        equipment: this.stringifyForDB(equipment), 
        sailor: this.stringifyForDB(sailor), 
        colleague: this.stringifyForDB(colleague), 
        ship: this.stringifyForDB([ship[0]])
      }
    },
    async onClickSave() {  
      const passValidation = this.checkValidation()
      if(!passValidation) return
      let message = ''
      // itemBuild.id가 존재하면 빌드 수정인 것.
      if(this.itemBuild.id) {
        const saveSuccess = await this.editItemBuild(this.getNewItemBuild())
        if(!saveSuccess) return
        this.$emit('onEditSave')
        window.scrollTo(0, 0)
        message = this.$ALERTS.ITEM_SETTING.EDIT_SAVE_SUCCESS
      } else {
        const saveSuccess = await this.saveItemBuild(this.getNewItemBuild())
        if(!saveSuccess) return
        this.isSaveSuccess = true
        this.$router.push('/item-build/my')
        message = this.$ALERTS.ITEM_SETTING.SAVE_SUCCESS
      }
      
      this.setToastMessage(message)
      this.setToastOn(true)
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
      const { title, characterName, equipment, sailor, colleague, ship } = this.itemBuild

      const alertMessages = []
      if(!title) {
        alertMessages.push(this.$ALERTS.VALIDATIONS.TITLE)
        this.isOnFocusTitle = true
        setTimeout(() => {
          this.isOnFocusTitle = false
        }, 500)
      }
      if(!characterName) {
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
      this.deleteItemBuildItem({
        type: item.type,
        index
      })
      this.ProcessAfterUpdateItem(item)
    },
    getGradeMenu(type) {
      const getGradeMaps = (itemTypeGrades) => {
        return itemTypeGrades.map((key) => ({
          id: key,
          text: gradesDef[key]
        }))
      }
      switch (type) {
        case 'equipment':
          return [this.commonOption, ...getGradeMaps(equipmentGrades)]
        case 'sailor':
          return [this.commonOption, ...getGradeMaps(sailorGrades)]
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