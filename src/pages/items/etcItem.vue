<template>
  <section>
    <h2 class="ir-hidden">포션 아이템 도감</h2>
    <div class="mrg-top-medium">  
      <item-table
        type="etcItem"
        :items="etcItems"
        :table-info="tableInfo"
        table-min-width="300px"
      />
    </div>
  </section>
</template>

<script>
import setMeta from '@/plugins/utils/meta';

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `기타 아이템 도감`,
      description: `기타 아이템 정보를 확인해보세요`,
    })
  },
  async asyncData({ store }) {
    const etcItems = await store.dispatch('item/GET_ETC_ITEMS_TABLE')
    return {
      etcItems,
    }
  },
  data() {
    return {
      tableInfo: [
        {
          title: '재료',
          type: 'item',
          width: '30%'
        },
        {
          title: '설명',
          type: 'option',
          width: '30%'
        },
        {
          title: '획득처',
          type: 'string',
          key: 'dropMonster',
          width: '40%'
        }
      ],
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/items/table.scss';
</style>