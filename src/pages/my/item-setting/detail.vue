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

        <button @click="deleteSelectedItem(item.name)">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-setting',
  data() {
    return {
      selectedItems: [],
    }
  },
  methods: {
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

<style lang="scss" scoped>
</style>