<template>
  <item-search-box 
    :full-data="fullData"
    :size="size"
    :fn-after-search="fnAfterSearch"
    placeholder="조합 아이템 검색"
  />
</template>

<script>
import ItemSearchBox from '../../item/ItemSearchBox.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    ItemSearchBox
  },
  props: {
    fullData: {
      type: Array,
      required: true
    },
    size: {
      type: String,
      default: () => "basic"
    }
  },
  data() {
    return {
      rankingNameList: null,
      itemNameList: null
    }
  },
  methods: {
    ...mapActions({
      getPageView: 'pageView/GET_COMPOSITION',
    }),
    fnAfterSearch({ id }) {
      const { type } = this.fullData.find((item) => item.id === id)
      this.$router.push(`/composition/${type}/${id}`)
    },
  }
}
</script>