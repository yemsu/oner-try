<template>
  <div class="inner-size-basic">
    <div v-if="items.length > 0" class="area-item-list">
      <div
        v-for="(item, i) in items"
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
            <input
              type="checkbox"
              :id="`ingredient-${item.id}-${i}`"
            />
            <label :for="`ingredient-${item.id}-${i}`">
              {{ ingredient.name }} * {{ ingredient.number }}
              - {{ findDropMonster(ingredient.name) }}
            </label>
          </div>
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
      itemSetting: null,
      items: [],
      checkList: [],
    }
  },
  computed: {
    ...mapGetters({
      compositionEquips: 'mrpg/getEquipments',
      materials: 'mrpg/getMaterials',
      itemSettingList: 'item-setting/getItemSettingList'
    }),
  },
  async mounted() {
    if(this.compositionEquips.length === 0) await this.getEquipments()
    if(this.materials.length === 0) await this.getMaterials()

    this.getItemSettingList()
    this.setItemSetting()
    this.setItems()
  },
  methods: {
    ...mapActions({
      getEquipments: 'mrpg/GET_EQUIPMENTS',
      getMaterials: 'mrpg/GET_MATERIALS',
      getItemSettingList: 'item-setting/GET_ITEM_SETTING_LIST',
    }),
    setItemSetting() {
      this.itemSetting = this.itemSettingList.find(({ id }) => (
        id === (this.$route.query.id * 1)
      ))
    },
    setItems() {
      const { items: itemNames } = this.itemSetting
      this.items = itemNames.map(name => {
        const item = this.compositionEquips.find(({ name: _name }) => name === _name)
        return parseItemData(item)
      })
      console.log('this.items', this.items)
    },
    findDropMonster(itemName) {
      // 재료 아이템인 경우
      const material = this.materials.find(({ name }) => name === itemName)
      if(material) {
        return `드랍: ${material.dropMonster}`
      }
      // 조합/드랍 무기 아이템인 경우
      const equipment = this.compositionEquips.find(({ name }) => name === itemName)
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