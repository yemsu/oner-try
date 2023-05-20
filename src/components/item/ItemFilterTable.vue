<template>
  <div :class="`item-filter-table size-${size}`">
    <section v-if="gradeMenus || optionMenus">
      <h2 class="ir-hidden">필터 선택</h2>
      <element-option-bar
        v-if="gradeMenus"
        title="등급"
        :options="gradeMenus"
        :select-list="gradesSelected"
        :size="size"
        @onChange="(list) => gradesSelected = list"
      />
      <element-option-bar
        v-if="optionMenus"
        title="옵션"
        :options="optionMenus"
        :select-list="optionsSelected"
        :size="size"
        @onChange="(list) => optionsSelected = list"
      />
    </section>
    <div class="area-item-table">
      <item-table
        :items="tableItems"
        :optionsSelected="optionsSelected"
        :table-info="tableInfo"
        :has-click-event="hasClickEvent"
        :size="size"
        :table-min-width="tableMinWidth"
        @click="(item) => $emit('click', item)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => null
    },
    itemsStringified: {
      type: String,
      default: () => ''
    },
    tableInfo: {
      type: Array,
      required: true,
    },
    optionMenus: {
      type: Object,
      default: () => null
    },
    gradeMenus: {
      type: Object,
      default: () => null
    },
    size: {
      type: String,
      default: () => 'medium' // small, medium
    },
    hasClickEvent: {
      type: Boolean,
      default: () => false
    },
    tableMinWidth: {
      type: String,
      default: () => '800px'
    }
  },
  data() {
    return {
      gradesSelected: [],
      optionsSelected: [],
      tableItems: null
    }
  },
  watch: {
    optionsSelected(crr, pre) {
      this.setTableItems()
    },
    gradesSelected(crr, pre) {
      this.setTableItems()
    },
    itemsStringified(crr) {
      this.tableItems = JSON.parse(crr)
    },
  },
  created() {
    this.tableItems = this.items || JSON.parse(this.itemsStringified)
  },
  methods: {
    setTableItems() {
      const items = this.items || JSON.parse(this.itemsStringified)
      const tableItems = items.filter(item => {
        const { grade, option } = item
        const isAllGrade = this.gradesSelected.length === 0
        const isAllOption = this.optionsSelected.length === 0
        const filteringGrade = isAllGrade ? true
          : this.gradesSelected.includes(grade)
        if(!filteringGrade) return false
        const optionKeys = [...option].map(option => Object.keys(option)[0])
        const checkListOptions = this.optionsSelected.map(optionsSelected => optionKeys.includes(optionsSelected))

        const checkOptions = [...new Set(checkListOptions)]

        const filteringOptions = isAllOption ? true
          : checkOptions.length === 1 && checkOptions[0]
        if(filteringOptions === true) return true
      })
      
      this.tableItems = tableItems
    },
  }
}
</script>

<style lang="scss" scoped>
.item-filter-table {
  &.size {
    &-small {
      .area-item-table {
        margin-top: 10px;
      }
    }
    &-medium {
      .area-item-table {
        margin-top: 30px;
      }
    }
  }
}
</style>