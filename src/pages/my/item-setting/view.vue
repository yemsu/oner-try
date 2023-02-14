<template>
  <div class="inner-size-basic">
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
      </div>
    </div>
  </div>
</template>

<script>
import { parseItemData } from '@/plugins/utils/item-mrpg'
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'item-setting-view',
  data() {
    return {
      selectedItems: [],
    }
  },
  computed: {
    ...mapGetters({
      equipments: 'mrpg/getEquipments',
      materials: 'mrpg/getMaterials',
      itemSettingList: 'item-setting/getItemSettingList'
    }),
  },
  async mounted() {
    if(this.equipments.length === 0) await this.getEquipments()
    if(this.materials.length === 0) await this.getMaterials()

    this.getItemSettingList()
    this.setSelectedItems()
  },
  methods: {
    ...mapActions({
      getEquipments: 'mrpg/GET_EQUIPMENTS',
      getMaterials: 'mrpg/GET_MATERIALS',
      getItemSettingList: 'item-setting/GET_ITEM_SETTING_LIST',
    }),
    setSelectedItems() {
      const { items } = this.itemSettingList.find(({ id }) => (
        id === (this.$route.query.id * 1)
      ))
      this.selectedItems = items.map(itemName => {
        const item = this.equipments.find(({ name }) => name === itemName)
        return parseItemData(item)
      })
      console.log('this.selectedItems', this.selectedItems)
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

<style lang="scss" scoped>
</style>