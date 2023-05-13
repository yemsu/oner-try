<template>
  <section>
    <h2 class="ir-hidden">장비 아이템 도감</h2>
    <item-filter-table
      :items="equipments"
      :option-menus="optionMenus"
      :grade-menus="gradeMenus"
    />
  </section>
</template>

<script>
import ItemFilterTable from '@/components/item/ItemFilterTable.vue';
import setMeta from '@/plugins/utils/meta';
import { noEquipOptions, gradesDef, equipmentGrades } from '@/plugins/utils/item-def'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `장비 아이템 도감`,
      description: `원하는 옵션을 선택하고 강화 수치별 장비 아이템 정보를 확인해보세요`,
    })
  },
  components: {
    ItemFilterTable
  },
  async asyncData({ store }) {
    const equipments = await store.dispatch('item/GET_EQUIPMENTS_TABLE')
    const commonMenu = { all: 'ALL' }
    const gradeMaps = equipmentGrades.reduce((result, keyName) => {
      result[keyName] = gradesDef[keyName]
      return result
    }, {})
    const gradeMenus = {...commonMenu, ...gradeMaps}
    const optionMenus =  Object.assign({...commonMenu}, noEquipOptions)
    return {
      equipments,
      optionMenus,
      gradeMenus
    }
  },
}
</script>

<style lang="scss" scoped>
</style>