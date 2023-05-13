<template>
  <div>
    <section v-if="gradeMenus || optionMenus">
      <h2 class="ir-hidden">필터 선택</h2>
      <option-bar
        v-if="gradeMenus"
        title="등급"
        :options="gradeMenus"
        :select-list="gradesSelected"
        @onChange="(list) => gradesSelected = list"
      />
      <option-bar
        v-if="optionMenus"
        title="옵션"
        :options="optionMenus"
        :select-list="optionsSelected"
        @onChange="(list) => optionsSelected = list"
      />
    </section>
    <div class="mrg-top-medium">
      <item-table
        type="equipment"
        :items="tableItems"
        :optionsSelected="optionsSelected"
        :table-info="tableInfo"
      />
    </div>
  </div>
</template>

<script>
import OptionBar from '@/components/common/OptionBar.vue';
export default {
  components: {
    OptionBar
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    tableInfo: {
      type: Array,
      required: true,
      default: [
        {
          title: 'th text',
          type: 'td type',
          width: '10%'
        }
      ]
    },
    optionMenus: {
      type: Object,
      default: () => null
    },
    gradeMenus: {
      type: Object,
      default: () => null
    },
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
    }
  },
  created() {
    this.tableItems = this.items
  },
  methods: {
    setTableItems() {
      const tableItems = this.items.filter(item => {
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

<style>
</style>