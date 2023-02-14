<template>
  <div>
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
            @onUpdateInput="(value) => newSettingTitle = value"
            size="medium"
          />
        </div>
        <div>
          <h4 class="title-sub-new">캐릭터</h4>
          <option-list-bar
            :data="characterOptions"
            size="small"
            @clickButton="(characterName) => selectedCharacter = characterName"
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
            @clickButton="(name) => addSelectedItems(name)"
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
        bg="cancel"
        @click="showAddItemSetting = false"
      >
        취소
      </base-button>
      <base-button
        type="square-round"
        bg="point"
        @click="clickSubmit"
      >
        설정 완료
      </base-button>
    </section>
  </div>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import OptionListBar from '@/components/common/OptionListBar.vue'
import { findKeyName } from '@/plugins/utils'
import { itemTypeNames } from '@/plugins/utils/item-def-mrpg'
import { parseItemData } from '@/plugins/utils/item-mrpg'
import { mapGetters } from 'vuex'

export default {
  components: {
    BaseButton,
    BaseInput,
    OptionListBar,
  },
  props: {
    equipTypeOptions: {
      type: Array,
      required: true
    },
    characterOptions: {
      type: Array,
      required: true
    },
    equipmentTypes: {
      type: Array,
      required: true
    },
    equipMatchingDataList: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      MAX_SELECTED_ITEM_LENGTH: 10,
      selectedItems: [],
      newSettingTitle: '',
      showAddItemSetting: false,
      selectedCharacter: null,
      selectedEquipTypeItems: [],
      isFocusTitleInput: false,
    }
  },
  computed: {
    ...mapGetters({
      compositionEquips: 'mrpg/getCompositionEquips',
    }),
  },
  methods: {
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
      this.$emit('updateSelectItem', name)
    },
    getItemData(name) {
      const item = this.compositionEquips.find(item => item.name === name)
      return parseItemData(item)
    },
    clickNewItemSetting() {
      this.showAddItemSetting = !this.showAddItemSetting
      setTimeout(() => {
        this.focusToTitleInput()
      }, 200)
    },
    clickEquipOption(equipName) {
      const equipType = findKeyName(itemTypeNames, equipName)
      const options = this.compositionEquips
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
    clickSubmit() {
      const checkValidation = this.checkValidation()
      if(!checkValidation) return
      
      this.submitItemSetting()
      
      this.showAddItemSetting = false
      this.resetSelectDataAll()
    },
    resetSelectDataAll() {
      this.newSettingTitle = ''
      this.selectedCharacter = ''
      this.selectedItems = []
      this.selectedEquipTypeItems = []
    },
    submitItemSetting() {
      const result = {
        title: this.newSettingTitle,
        character: this.selectedCharacter,
        items: this.selectedItems.map(({ name }) => name)
      }
      console.log('submitItemSetting-----------')
      console.table(result)

      this.$emit('submit', result)
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
    deleteSelectedItem(name) {
      this.selectedItems = this.selectedItems.filter((item) => item.name !== name)
      this.equipMatchingDataList.push(name)
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