<template>
  <div class="create-item-setting">
    <div class="inner-size-basic">
      <div class="wrap-button">
        <base-button
          type="square-round"
          bg="point"
          @click="clickNewItemSetting"
        >
          목표 아이템 설정 추가
        </base-button>
      </div>
    </div>
    <div
      v-if="showAddItemSetting"
      class="content-item-setting "
    >
      <div class="inner-size-basic">
        <section class="wrap-categories">
          <h3 class="ir-hidden">새로운 목표 아이템 설정</h3>
          <div class="wrap-option-category category-title">
            <div class="area-title-sub">
              <h4 class="title-sub-new"><label for="newSettingTitle">제목</label></h4>
            </div>
            <base-input
              id="newSettingTitle"
              :value="newSettingTitle"
              :focus-time="isFocusTitleInput"
              size="medium"
              placeholder="제목"
              @onUpdateInput="(value) => newSettingTitle = value"
            />
          </div>
          <div class="wrap-option-category category-character">
            <div class="area-title-sub">
              <h4 class="title-sub-new">캐릭터</h4>
            </div>
            <option-list-bar
              :data="characterOptions"
              size="small"
              @selectOption="(characterName) => selectedCharacter = characterName"
            />
          </div>
          <section class="wrap-option-category category-search-item">
            <div class="area-title-sub">
              <h4 class="title-sub-new"><label for="newSettingSearchInput">아이템 검색</label></h4>
            </div>
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
          </section>
          <div class="wrap-option-category category-items">
            <div class="area-title-sub">
              <h4 class="title-sub-new">아이템</h4>
              <p class="text-refer"><small>* 조합 아이템</small></p>
            </div>
            <option-list-bar
              :data="equipTypeOptions"
              :default-select="true"
              size="small"
              @selectOption="clickEquipOption"
            />
            <div class="content-items">
              <option-list-bar
                :data="selectedEquipTypeItems"
                :show-title="false"
                size="small"
                @selectOption="(name) => addSelectedItems(name)"
              />
            </div>
          </div>
          <div class="wrap-option-category category-selected-item">
            <div class="area-title-sub">
              <h4 class="title-sub-new">목표 아이템 ({{ selectedItems.length }})</h4>
              <p class="text-refer"><small>* 최대 {{ MAX_SELECTED_ITEM_LENGTH }}개까지 선택 가능합니다.</small></p>
            </div>
            <div class="content-selected-item">
              <template v-if="selectedItems.length > 0">
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
              </template>
              <div v-else class="area-blank-text">
                <p>선택된 아이템이 없습니다.</p>
              </div>
            </div>
          </div>
        </section>
        <div class="wrap-btns">
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
        </div>
      </div>
    </div>
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

<style lang="scss" scoped>
@import '@/assets/style/pages/my/item-setting/MakeItemSetting.scss';
</style>