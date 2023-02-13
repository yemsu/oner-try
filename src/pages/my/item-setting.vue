<template>
  <div class="inner-size-basic">
    <search-box
      v-if="equipmentNameList"
      size="small"
      :matching-data="equipmentNameList"
      :use-auto-enter="true"
      placeholder="아이템"
      @onSearch="fnSearch"
    />
    <div v-if="selectedItems.length > 0" class="area-item-list">
      <div
        v-for="(selectedItem, i) in selectedItems"
        :key="`selectedItem${i}`"
      >
        <item-box
          :item="selectedItem"
        >
        </item-box>
        <button @click="deleteSelectedItem(selectedItem.name)">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { parserStrData, parseItemData } from '@/plugins/utils/item-mrpg'

export default {
  name: 'item-setting',
  data() {
    return {
      equipmentNameList: null,
      materialNameList: null,
      selectedItems: [],
      equipmentTypes: null
    }
  },
  computed: {
    ...mapGetters({
      equipments: 'mrpg/getEquipments',
      materials: 'mrpg/getMaterials',
    }),
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
    getValueList(objList, keyName) {
      return objList.map((obj) => obj[keyName])
    },
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
    deleteSelectedItem(name) {
      this.selectedItems = this.selectedItems.filter((item) => item.name !== name)
      this.equipmentNameList.push(name)
    }
  }
}
</script>

<style lang="scss" scoped></style>