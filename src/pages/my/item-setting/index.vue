<template>
  <div class="inner-size-basic">
    <h2 class="ir-hidden">목표 아이템 설정</h2>
    <div
      v-if="!isLogin || itemSettingList.length === 0"
      class=""
    >
      <p><span v-if="!isLogin">구글 로그인 후, </span>목표 아이템을 설정하고 하나씩 달성해 나가보세요!</p>
      <p>아이템 선택하면, 필요한 재료 아이템을 확인할 수 있습니다.</p>
      <p>재료 아이템이 조합아이템이라면, 해당 아이템의 재료 아이템까지 확인하실 수 있어요!</p>
      <p>재료 아이템을 습득했다면, 체크! 해주세요.</p>
      <p>목표 아이템을 위해 필요한 재료아이템 총합도 확인할 수 있습니다. 체크한 아이템은 계산에서 제외됩니다!</p>
    </div>
    <div v-if="isLogin">
      <base-button
        type="square-round"
        bg="point"
        @click="clickNewItemSetting"
      >
        목표 아이템 설정
      </base-button>
      <section v-if="showAddItemSetting">
        <h3 class="title-new">새로운 목표 아이템 설정</h3>
        <div>
          <div>
            <h4 class="title-sub-new"><label for="newSettingTitle">제목</label></h4>
            <base-input
              id="newSettingTitle"
              :value="newSettingTitle"
              placeholder="제목"
              :focus-time="isFocusTitleInput"
              @onUpdateInput="setNewSettingTitle"
              size="medium"
            />
          </div>
          <div>
            <h4 class="title-sub-new">캐릭터</h4>
            <option-list-bar
              :data="characterOptions"
              size="small"
              @clickButton="clickCharacterOption"
            />
          </div>
          <section>
            <h4 class="title-sub-new"><label for="newSettingSearchInput">아이템 선택</label></h4>
            <search-box
              v-if="equipMatchingDataList"
              id="newSettingSearchInput"
              size="medium"
              :matching-data="equipMatchingDataList"
              :use-auto-enter="true"
              :use-compact-mode="false"
              placeholder="전체 아이템"
              @onSearch="fnSearch"
            />
            <option-list-bar
              :data="equipTypeOptions"
              size="small"
              @clickButton="clickEquipOption"
            />
            <option-list-bar
              :data="selectedEquipTypeItems"
              :show-title="false"
              size="small"
              @clickButton="clickItemOption"
            />
          </section>
          <div class="area-item-list">
            <h4>선택된 아이템 ({{ selectedItems.length }})</h4>
            <p>최대 {{ MAX_SELECTED_ITEM_LENGTH }}개까지 선택 가능합니다.</p>
            <div
              v-for="(item, i) in selectedItems"
              :key="`item${i}`"
            >
              <div class="wrap-item">
                <item-box
                  :item="item"
                  size="small"
                >
                </item-box>
              </div>
              <button @click="deleteSelectedItem(item.name)">삭제</button>
            </div>
          </div>
        </div>
        <base-button
          type="square-round"
          bg="point"
          @click="clickSubmit"
        >
          설정 완료
        </base-button>
      </section>

      <!-- 리스트 -->
      <section>
        <h2>나의 목표 아이템 세팅</h2>
        <div
          v-for="({title, character, items}, i) in itemSettingList"
          :key="`itemSetting${i}`"
        >
          <p>{{ title }}</p>
          <p>{{ character }}</p>
          <ul>
            <li
              v-for="(itemName, i) in items"
              :key="`savedItem${i}`"
            > 
              {{ itemName }}
            </li>
          </ul>
          <base-button
            type="square-round"
            color="light-gray"
          >
            자세히 보기
          </base-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import OptionListBar from '@/components/common/OptionListBar.vue'
import { findKeyName, getValueList } from '@/plugins/utils'
import { parseItemData } from '@/plugins/utils/item-mrpg'
import { characterDefs, totalOptions, itemTypeNames } from '@/plugins/utils/item-def-mrpg'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'item-setting',
  components: {
    BaseButton,
    BaseInput,
    OptionListBar
  },
  data() {
    return {
      MAX_SELECTED_ITEM_LENGTH: 10,
      equipMatchingDataList: null,
      equipmentTypes: null,
      showAddItemSetting: false,
      newSettingTitle: '',
      itemSettingList: [],
      characterOptions: [],
      selectedCharacter: null,
      selectedItems: [],
      isFocusTitleInput: false,
      // 아이템 필터
      equipTypeOptions: [],
      selectedEquipTypeItems: []
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      equipments: 'mrpg/getEquipments',
      materials: 'mrpg/getMaterials',
    }),
  },
  async created() {
    if(this.equipments.length === 0) await this.getEquipments()
    if(this.materials.length === 0) await this.getMaterials()

    this.setEquipMatchingDataList()
    this.setEquipmentTypes()
    this.setCharacterOptions()
    this.setEquipTypeOptions()
  },
  mounted() {
    this.getSavedItemSetting()
  },
  methods: {
    ...mapActions({
      getEquipments: 'mrpg/GET_EQUIPMENTS',
      getMaterials: 'mrpg/GET_MATERIALS',
    }),
    setEquipMatchingDataList() {
      this.equipMatchingDataList = getValueList(this.equipments, 'name')
    },
    fnSearch(name) {
      this.addSelectedItems(name)
      console.log('fnsearch', name, this.selectedItems)
    },
    addSelectedItems(name) {
      const isOverLength = this.selectedItems.length === this.MAX_SELECTED_ITEM_LENGTH
      if(isOverLength) {
        alert('최대 10개까지 선택 하실 수 있습니다.')
        return
      }
      const isAlreadySelect = this.selectedItems.find((item) => item.name === name)
      if(isAlreadySelect) {
        alert('이미 선택된 아이템입니다.')
        return
      }
      this.selectedItems.push(this.getItemData(name))
      this.equipMatchingDataList = this.equipMatchingDataList.filter((itemName) => itemName !== name)
    },
    getItemData(name) {
      const item = this.equipments.find(item => item.name === name)
      return parseItemData(item)
    },
    setEquipmentTypes() {
      const equipmentTypeValues = getValueList(this.equipments, 'type')
      this.equipmentTypes = [...new Set(equipmentTypeValues)]
      console.log('this.equipmentTypes', this.equipmentTypes)
    },
    deleteSelectedItem(name) {
      this.selectedItems = this.selectedItems.filter((item) => item.name !== name)
      this.equipMatchingDataList.push(name)
    },
    clickNewItemSetting() {
      this.showAddItemSetting = true
      setTimeout(() => {
        this.focusToTitleInput()
      }, 200)
    },
    setCharacterOptions() {
      const characterOptions = characterDefs.reduce((result, crr) => {
        const { mainStat, characters } = crr
        const options = characters.map(({ name, job }) => ({
          text: `${name} : ${job}`
        }))
        result.push(Object.assign({}, { 
          title: totalOptions[mainStat],
          options
        }))
        return result
      }, [])
      
      this.characterOptions = characterOptions
    },
    clickCharacterOption(characterName) {
      this.selectedCharacter = characterName
    },
    setEquipTypeOptions() {
      const options = this.equipmentTypes.map(key => ({text: itemTypeNames[key]}))
      const equipTypeOptions = [{ title: '타입', options }]
      this.equipTypeOptions = equipTypeOptions
    },
    clickEquipOption(equipName) {
      const equipType = findKeyName(itemTypeNames, equipName)
      const options = this.equipments
        .filter(({type}) => type === equipType)
        .sort((a, b) => b.level - a.level)
        .map(({name, level}) => ({
          id: name,
          text: `Lv.${level} ${name}`
        }))
      this.selectedEquipTypeItems = [{
        title: equipName,
        options
      }]
    },
    clickItemOption(name) {
      this.addSelectedItems(name)
    },
    setNewSettingTitle(value) {
      this.newSettingTitle = value
    },
    clickSubmit() {
      const result = {
        title: this.newSettingTitle,
        character: this.selectedCharacter,
        items: this.selectedItems.map(({ name }) => name)
      }
      console.log('clickSubmit-----------')
      console.table(result)

      const checkValidation = this.checkValidation()
      if(!checkValidation) return
      
      this.submitItemSetting(result)
      
      this.showAddItemSetting = false
    },
    submitItemSetting(result) {
      let resultData = [result]
      const savedItemSetting = localStorage.getItem('itemSetting')
      if(savedItemSetting) {
        const data = JSON.parse(savedItemSetting)
        data.push(result)
        resultData = data
      }
      localStorage.setItem('itemSetting', JSON.stringify(resultData))
      this.itemSettingList.push(result)
      console.log(localStorage.getItem('itemSetting'))
    },
    getSavedItemSetting() {
      const savedItemSetting = localStorage.getItem('itemSetting')
      if(!savedItemSetting) return
      this.itemSettingList = JSON.parse(savedItemSetting)
    },
    checkValidation() {
      const alertMessages = []
      if(!this.newSettingTitle) {
        alertMessages.push('📌 제목을 입력해 주세요!')
      }
      if(!this.selectedCharacter) {
        alertMessages.push('😎 캐릭터를 선택해 주세요!')
      }
      if(this.selectedItems.length === 0) {
        alertMessages.push('🏹 아이템을 선택해 주세요!')
      }

      if(alertMessages.length > 0) {
        alert(alertMessages.join('\n'))
        if(alertMessages.find(msg => msg.includes('제목'))) {
          this.focusToTitleInput()
        } 
        return false
      }
      return true
    },
    focusToTitleInput() {
      this.isFocusTitleInput = true
      setTimeout(() => {
        this.isFocusTitleInput = false
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped></style>