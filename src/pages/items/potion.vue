<template>
  <section>
    <h2 class="ir-hidden">포션 아이템 도감</h2>
    <div class="mrg-top-medium">  
      <item-table
        type="potion"
        :items="potions"
        :table-info="tableInfo"
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
      title: `포션 아이템 도감`,
      description: `포션 아이템 정보를 확인해보세요`,
    })
  },
  async asyncData({ store }) {
    const potions = await store.dispatch('item/GET_POTIONS_TABLE')
    return {
      potions,
    }
  },
  data() {
    return {
      tableInfo: [
        {
          title: '포션',
          type: 'item',
          width: '40%'
        },
        {
          title: '옵션',
          type: 'option'
        }
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/items/table.scss';
</style>