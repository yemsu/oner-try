<template>
  <search-box
    v-if="itemNameList"
    :matching-data="itemNameList"
    :size="size"
    :is-item="true"
    :custom-match-data-item="true"
    :placeholder="placeholder"
    :is-full-width="isFullWidth"
    @onSearch="fnSearch"
  >
    <template v-slot:matchDataItem="{ props: matchData }">
      <item-box
        size="small"
        type="list"
        :item="findItem(matchData)"
        :showBadges="['howGet']"
        :showTooltip="false"
        :isLink="false"
      />
    </template>
  </search-box>

</template>

<script>
export default {
  props: {
    fullData: {
      type: Array,
      required: true
    },
    size: {
      type: String,
      default: () => "basic"
    },
    fnAfterSearch: {
      type: Function,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: () => "아이템 검색"
    },
    isFullWidth: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      rankingNameList: null,
      itemNameList: null
    }
  },
  async created() {
    this.setItemNameList()
  },
  methods: {
    fnSearch(name) {
      if(!name) {
        alert('해당 아이템이 존재하지 않습니다.')
        return
      }
      this.fnAfterSearch(name)
    },
    setItemNameList() {
      // computed 사용하면 여러번 실행되어 최초 1회만 실행
      if(this.fullData.length === 0) return []
      this.itemNameList = this.fullData.map(({ name }) => name)
    },
    findItem(name) {
      return this.fullData.find((item) => item.name === name)
    }
  }
}
</script>