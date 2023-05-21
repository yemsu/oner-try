<template>
  <section>
    <h2 class="ir-hidden">선원 아이템 도감</h2>
    <item-filter-table
      :items="synergySailors"
      :option-menus="optionMenus"
      :grade-menus="gradeMenus"
      :table-info="tableInfo"
      table-min-width="800px"
    />
  </section>
</template>

<script>
import ItemFilterTable from '@/components/item/ItemFilterTable.vue';
import setMeta from '@/plugins/utils/meta';
import { noEquipOptions, sailorGrades } from '@/plugins/utils/item-def'
import { itemFilterOptions } from '@/plugins/utils/item'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `선원 아이템 도감`,
      description: `원하는 등급, 옵션을 선택하고 선원 아이템 정보를 확인해보세요`,
    })
  },
  components: {
    ItemFilterTable
  },
  async asyncData({ store }) {
    const synergySailors =  await store.dispatch('item/GET_SAILORS_SYNERGY')
    const { optionMenus, gradeMenus } = itemFilterOptions(sailorGrades, noEquipOptions)
    return {
      synergySailors,
      optionMenus,
      gradeMenus
    }
  },
  data() {
    return {
      tableInfo: [
        {
          title: '선원',
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
          width: '25%'
        },
        {
          title: '획득처',
          type: 'string',
          key: 'dropMonster',
        },
        {
          title: '인연 / 악연',
          type: 'synergy',
          width: '29%'
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/items/table.scss';
</style>