<template>
  <section>
    <h2 class="ir-hidden">장비 아이템 도감</h2>
    <item-filter-table
      :items="equipments"
      :option-menus="optionMenus"
      :grade-menus="gradeMenus"
      :table-info="tableInfo"
    />
  </section>
</template>

<script>
import ItemFilterTable from '@/components/item/ItemFilterTable.vue';
import setMeta from '@/plugins/utils/meta';
import { noEquipOptions, equipmentGrades } from '@/plugins/utils/item-def'
import { itemFilterOptions } from '@/plugins/utils/item'

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
    const { optionMenus, gradeMenus } = itemFilterOptions(equipmentGrades, noEquipOptions)
    return {
      equipments,
      optionMenus,
      gradeMenus
    }
  },
  data() {
    return {
      tableInfo: [
        {
          title: '장비',
          type: 'item',
          width: '16%'
        },
        {
          title: '등급',
          type: 'grade',
          width: '6%'
        },
        {
          title: '옵션',
          type: 'option',
          width: '18%'
        },
        {
          title: '추가 옵션',
          type: 'string',
          key: 'gradeOption',
          width: '32%'
        },
        {
          title: '획득처',
          type: 'string',
          key: 'dropMonster',
          width: '28%'
        },
      ],
    }
  }
}
</script>

<style lang="scss" scoped>
</style>