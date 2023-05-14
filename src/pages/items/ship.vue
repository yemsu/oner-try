<template>
  <section>
    <h2 class="ir-hidden">선박 아이템 도감</h2>
    <item-filter-table
      :items="ships"
      :option-menus="optionMenus"
      :table-info="tableInfo"
    />
  </section>
</template>

<script>
import ItemFilterTable from '@/components/item/ItemFilterTable.vue';
import setMeta from '@/plugins/utils/meta';
import { noEquipOptions } from '@/plugins/utils/item-def'
export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `선박 아이템 도감`,
      description: `원하는 옵션을 선택하고 강화 수치별 선박 아이템 정보를 확인해보세요`,
    })
  },
  components: {
    ItemFilterTable
  },
  async asyncData({ store }) {
    const ships = await store.dispatch('item/GET_SHIPS_TABLE')
    const commonMenu = { all: 'ALL' }
    const optionMenus =  Object.assign({...commonMenu}, noEquipOptions)
    return {
      ships,
      optionMenus,
    }
  },
  data() {
    return {
      tableInfo: [
        {
          title: '선박',
          type: 'item',
          width: '40%'
        },
        {
          title: '옵션',
          type: 'option'
        }
        // {
        //   title: '+0',
        //   type: 'optionsByStack0'
        // },
        // {
        //   title: '+1',
        //   type: 'optionsByStack1'
        // },
        // {
        //   title: '+2',
        //   type: 'optionsByStack2'
        // },
        // {
        //   title: '+3',
        //   type: 'optionsByStack3'
        // },
        // {
        //   title: '+4',
        //   type: 'optionsByStack4'
        // },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/items/table.scss';
</style>