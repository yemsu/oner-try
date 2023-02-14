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
              v-if="equipmentNameList"
              id="newSettingSearchInput"
              size="medium"
              :matching-data="equipmentNameList"
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
            <h4>선택된 아이템</h4>
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
          @click="clickSubmitItemSetting"
        >
          설정 완료
        </base-button>
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
      equipmentNameList: null,
      equipmentTypes: null,
      showAddItemSetting: false,
      newSettingTitle: '',
      itemSettingList: [],
      characterOptions: [],
      selectedCharacterName: null,
      selectedItems: [],
      // 아이템 필터
      equipTypeOptions: [],
      selectedEquipTypeItems: [],
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

    this.setNameList()
    this.setEquipmentTypes()
    this.setCharacterOptions()
    this.setEquipTypeOptions()
  },
  methods: {
    ...mapActions({
      getEquipments: 'mrpg/GET_EQUIPMENTS',
      getMaterials: 'mrpg/GET_MATERIALS',
    }),
    setNameList() {
      this.equipmentNameList = getValueList(this.equipments, 'name')
    },
    fnSearch(name) {
      this.addSelectedItems(name)
      console.log('fnsearch', name, this.selectedItems)
    },
    addSelectedItems(name) {
      const alreadySelect = this.selectedItems.find((item) => item.name === name)
      if(alreadySelect) {
        alert('이미 선택된 아이템입니다.')
        return
      }
      this.selectedItems.push(this.getItemData(name))
      this.equipmentNameList = this.equipmentNameList.filter((itemName) => itemName !== name)
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
      this.equipmentNameList.push(name)
    },
    clickNewItemSetting() {
      this.showAddItemSetting = true
    },
    setCharacterOptions() {
      const characterOptions = characterDefs.reduce((result, crr) => {
        const { mainStat, characters } = crr
        const options = characters.map(({ name, job }) => ({
          text: `${name} : ${job}`,
          id: name
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
      this.selectedCharacterName = characterName
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
    clickSubmitItemSetting() {
      console.log('clickSubmitItemSetting')
    },
  }
}
</script>

<style lang="scss" scoped></style>