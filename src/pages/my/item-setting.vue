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
        <div v-if="item.ingredients" class="area-checkbox">
          <div 
            v-for="(ingredient, i) in item.ingredients"
            :key="`ingredient${i}`"
            class="wrap-checkbox"
          >
            <input type="checkbox" :id="`ingredient-${item.id}-${i}`"/>
            <label :for="`ingredient-${item.id}-${i}`">
              {{ ingredient.name }} * {{ ingredient.number }}
              - {{ findDropMonster(ingredient.name) }}
            </label>
          </div>
        </div>
        <div 
          v-else-if="item.dropMonster"
          class="wrap-checkbox"
        >
          <input type="checkbox" :id="`item-${item.id}-${i}`"/>
          <label :for="`item-${item.id}-${i}`">
            {{ item.name }} - {{ item.dropMonster }}
          </label>
        </div>

        <button @click="deleteSelectedItem(item.name)">삭제</button>
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
    },
    findDropMonster(itemName) {
      // 재료 아이템인 경우
      const material = this.materials.find(({ name }) => name === itemName)
      if(material) {
        return `드랍: ${material.dropMonster}`
      }
      // 조합/드랍 무기 아이템인 경우
      const equipment = this.equipments.find(({ name }) => name === itemName)
      if(equipment.ingredients) {
        return '조합 아이템'
      } else {
        return `드랍: ${equipment.dropMonster}`
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>