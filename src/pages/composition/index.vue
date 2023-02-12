<template>
  <section class="wrap-search">
    <h2 class="ir-hidden">조합법</h2>
    <item-checker-board
      v-if="legendItems"
      :items="legendItems"
    />
    <composition-search-box
      :matchingData="compositionItems"
      size="big"
    />
  </section>
</template>

<script>
import CompositionSearchBox from "@/components/pages/composition/SearchBox.vue"
import ItemCheckerBoard from '../../components/item/ItemCheckerBoard.vue';
import setMeta from '@/plugins/utils/meta';
import { mapGetters } from "vuex";

export default {
  name: 'composition',
  components: {
    CompositionSearchBox,
    ItemCheckerBoard
  },
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `조합법`,
      description: `조합법이 궁금한 아이템을 검색 해보세요.`,
    })
  },
  data() {
    return {
      compositionItems: null,
      legendItems: null,
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/getItems'
    })
  },
  async created() {
    if(this.items.length === 0) await this.$store.dispatch('item/GET_ITEMS')
    this.compositionItems = this.items.filter(item => item.ingredients)
    this.legendItems = this.compositionItems.filter(item => item.grade === 'legend')
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/composition/index.scss';
</style>