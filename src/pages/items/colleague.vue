<template>
  <section>
    <h2 class="ir-hidden">동료 아이템 도감</h2>
    <item-filter-table
      :items="colleagues"
      :option-menus="optionMenus"
      :table-info="tableInfo"
      table-min-width="600px"
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
      title: `동료 아이템 도감`,
      description: `원하는 옵션을 선택하고 동료 아이템 정보를 확인해보세요`,
    })
  },
  components: {
    ItemFilterTable
  },
  async asyncData({ store }) {
    const colleagues = await store.dispatch('item/GET_COLLEAGUES')
    const commonMenu = { all: 'ALL' }
    const optionMenus =  Object.assign({...commonMenu}, noEquipOptions)
    return {
      colleagues,
      optionMenus,
    }
  },
  data() {
    return {
      tableInfo: [
        {
          title: '동료',
          type: 'item',
          width: '24%'
        },
        {
          title: '옵션',
          type: 'option',
          width: '28%'
        },
        {
          title: '획득처',
          type: 'string',
          key: 'dropMonster',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/items/table.scss';
</style>