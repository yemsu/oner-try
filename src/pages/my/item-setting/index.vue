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
        <h3>새로운 목표 아이템</h3>
        <h4><label for="newSettingTitle">제목</label></h4>
        <base-input
          id="newSettingTitle"
          :value="newSettingTitle"
          placeholder="제목"
          size="small"
        />
        <h4><label for="newSettingSearchInput">목표 아이템 선택</label></h4>
        <search-box
          v-if="equipmentNameList"
          id="newSettingSearchInput"
          size="small"
          :matching-data="equipmentNameList"
          :use-auto-enter="true"
          :use-compact-mode="false"
          placeholder="아이템"
          @onSearch="fnSearch"
        />
        <section class="area-item-list">
          <h3>선택된 아이템</h3>
          <div
            v-for="(item, i) in selectedItems"
            :key="`item${i}`"
          >
            <div class="wrap-item">
              <item-box
                :item="item"
                size="small"
                type="list"
              >
              </item-box>
            </div>
            <button @click="deleteSelectedItem(item.name)">삭제</button>
          </div>
        </section>
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
import { parseItemData } from '@/plugins/utils/item-mrpg'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'item-setting',
  components: {
    BaseButton,
    BaseInput
  },
  data() {
    return {
      equipmentNameList: null,
      materialNameList: null,
      equipmentTypes: null,
      showAddItemSetting: false,
      newSettingTitle: '',
      itemSettingList: [],
      selectedItems: [],
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      equipments: 'mrpg/getEquipments',
      materials: 'mrpg/getMaterials',
    })
  },
  async created() {
    if(this.equipments.length === 0) await this.getEquipments()
    if(this.materials.length === 0) await this.getMaterials()

    this.setNameList()
    this.setEquipmentTypes()
  },
  methods: {
    ...mapActions({
      getEquipments: 'mrpg/GET_EQUIPMENTS',
      getMaterials: 'mrpg/GET_MATERIALS',
    }),
    setNameList() {
      this.equipmentNameList = this.getValueList(this.equipments, 'name')
      this.materialNameList = this.getValueList(this.materials, 'name')
    },
    fnSearch(name) {
      this.selectedItems.push(this.getItemData(name))
      this.equipmentNameList = this.equipmentNameList.filter((itemName) => itemName !== name)
      console.log('fnsearch', name, this.selectedItems)
    },
    getItemData(name) {
      const item = this.equipments.find(item => item.name === name)
      return parseItemData(item)
    },
    setEquipmentTypes() {
      const equipmentTypeValues = this.getValueList(this.equipments, 'type')
      this.equipmentTypes = [...new Set(equipmentTypeValues)]
      console.log('this.equipmentTypes', this.equipmentTypes)
    },
    getValueList(objList, keyName) {
      return objList.map((obj) => obj[keyName])
    },
    deleteSelectedItem(name) {
      this.selectedItems = this.selectedItems.filter((item) => item.name !== name)
      this.equipmentNameList.push(name)
    },
    clickNewItemSetting() {
      this.showAddItemSetting = true
    },
  }
}
</script>

<style lang="scss" scoped></style>