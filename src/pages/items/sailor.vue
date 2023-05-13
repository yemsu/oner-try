<template>
  <section>
    <h2 class="ir-hidden">선원 아이템 도감</h2>
    <section>
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
        type="sailor"
        :items="resultSailors"
        :optionsSelected="optionsSelected"
      />
    </div>
  </section>
</template>

<script>
import OptionBar from '@/components/common/OptionBar.vue';
import setMeta from '@/plugins/utils/meta';
import { noEquipOptions, gradesDef, sailorGrades } from '@/plugins/utils/item-def'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `선원 아이템 도감`,
      description: `원하는 등급, 옵션을 선택하고 선원 아이템 정보를 확인해보세요`,
    })
  },
  components: {
    OptionBar
  },
  async asyncData({ store }) {
    const synergySailors =  await store.dispatch('item/GET_SAILORS_SYNERGY')
    const commonMenu = { all: 'ALL' }
    const gradeMaps = sailorGrades.reduce((result, keyName) => {
      result[keyName] = gradesDef[keyName]
      return result
    }, {})
    const gradeMenus = {...commonMenu, ...gradeMaps}
    const optionMenus =  {...commonMenu, ...noEquipOptions}
    return {
      synergySailors,
      optionMenus,
      gradeMenus
    }
  },
  data() {
    return {
      gradesSelected: [],
      optionsSelected: [],
      resultSailors: null,
    }
  },
  watch: {
    optionsSelected(crr, pre) {
      this.setResultSailors()
    },
    gradesSelected(crr, pre) {
      this.setResultSailors()
    }
  },
  created() {
    this.resultSailors = this.synergySailors
  },
  methods: {
    setResultSailors() {
      const resultSailors = this.synergySailors.filter(sailor => {
        const { grade, option: options } = sailor
        const isAllGrade = this.gradesSelected.length === 0
        const isAllOption = this.optionsSelected.length === 0
        // filtering grade
        const filteringGrade = isAllGrade ? true
          : this.gradesSelected.includes(grade)
        // console.log('filteringGrade', filteringGrade)
        if(!filteringGrade) return false
        // filtering option
        const optionKeys = options.map(option => Object.keys(option)[0])
        const checkListOptions = this.optionsSelected.map(optionsSelected => optionKeys.includes(optionsSelected))

        const checkOptions = [...new Set(checkListOptions)]

        const filteringOptions = isAllOption ? true
          : checkOptions.length === 1 && checkOptions[0]
        if(filteringOptions === true) return true
        else if(filteringOptions.length === options.length) return true
      })
      
      this.resultSailors = resultSailors
    },
    isActiveMenu(key, type) {
      const selectList = this[`${type}sSelected`]
      const isActiveMenu = key === 'all'
        ? selectList.length === 0
        : selectList.includes(key)
      
      return isActiveMenu
    },
    toggleMenu(key, type) {
      const dataName = `${type}sSelected`
      if(key === 'all') {
        this[dataName] = []
        return
      }
      if(this[dataName].includes(key)) {
        const index = this[dataName].indexOf(key)
        this[dataName].splice(index, 1)
      } else {
        this[dataName].push(key)
      }     
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/items/table.scss';
</style>