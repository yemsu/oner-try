<template>
  <search-box
    v-if="itemList"
    :matching-data="itemList"
    :size="size"
    :is-item="true"
    :custom-match-data-item="true"
    :placeholder="placeholder"
    :is-full-width="isFullWidth"
    :show-default-list="showDefaultList"
    @onSearch="fnSearch"
  >
    <template v-slot:matchDataItem="{ props: matchData }">
      <item-box
        :size="size === 'xsmall' ? size : 'small'"
        type="list"
        :item="findItem(matchData)"
        :showBadges="['grade']"
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
      default: () => "medium"
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
    },
    showDefaultList: {
      type: Boolean, 
      default: () => true
    }
  },
  data() {
    return {
      rankingNameList: null,
      itemList: null
    }
  },
  async created() {
    this.setItemList()
  },
  methods: {
    fnSearch(name) {
      if(!name) {
        alert('해당 아이템이 존재하지 않습니다.')
        return
      }
      this.fnAfterSearch(name)
    },
    setItemList() {
      // computed 사용하면 여러번 실행되어 최초 1회만 실행
      if(this.fullData.length === 0) return []
      this.itemList = this.fullData.map(({ name, id  }) => ({
        id,
        text: name
      }))
    },
    findItem({ id }) {
      return this.fullData.find((item) => item.id === id)
    }
  }
}
</script>