<template>
  <section>
    <h2 class="ir-hidden">장비 아이템 도감</h2>
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
        type="equipment"
        :items="resultEquipments"
        :optionsSelected="optionsSelected"
      />
    </div>
  </section>
</template>

<script>
import OptionBar from '@/components/common/OptionBar.vue';
import setMeta from '@/plugins/utils/meta';
import { noEquipOptions, gradesDef, equipmentGrades } from '@/plugins/utils/item-def'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `장비 아이템 도감`,
      description: `원하는 옵션을 선택하고 강화 수치별 장비 아이템 정보를 확인해보세요`,
    })
  },
  components: {
    OptionBar
  },
  async asyncData({ store }) {
    const equipments = await store.dispatch('item/GET_EQUIPMENTS_TABLE')
    const commonMenu = { all: 'ALL' }
    const gradeMaps = equipmentGrades.reduce((result, keyName) => {
      result[keyName] = gradesDef[keyName]
      return result
    }, {})
    const gradeMenus = {...commonMenu, ...gradeMaps}
    const optionMenus =  Object.assign({...commonMenu}, noEquipOptions)
    return {
      equipments,
      optionMenus,
      gradeMenus
    }
  },
  data() {
    return {
      gradesSelected: [],
      optionsSelected: [],
      resultEquipments: null
    }
  },
  watch: {
    optionsSelected(crr, pre) {
      this.setResultEquipments()
    },
    gradesSelected(crr, pre) {
      this.setResultEquipments()
    }
  },
  created() {
    console.log('this.equipments', this.equipments)
    this.resultEquipments = this.equipments
  },
  methods: {
    setResultEquipments() {
      const resultEquipments = this.equipments.filter(equipment => {
        const { grade, option } = equipment
        const isAllGrade = this.gradesSelected.length === 0
        const isAllOption = this.optionsSelected.length === 0
        const filteringGrade = isAllGrade ? true
          : this.gradesSelected.includes(grade)
        if(!filteringGrade) return false
        const optionKeys = [...option].map(option => Object.keys(option)[0])
        const checkListOptions = this.optionsSelected.map(optionsSelected => optionKeys.includes(optionsSelected))

// console.log('optionKeys', optionKeys, checkListOptions)
        const checkOptions = [...new Set(checkListOptions)]

        const filteringOptions = isAllOption ? true
          : checkOptions.length === 1 && checkOptions[0]
        if(filteringOptions === true) return true
      })
      
      this.resultEquipments = resultEquipments
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
    classNegaPosi(equipment) {
      return equipment.coloYn ? 'positive' : 'negative'
    },
    classColoPassive(coloPassive) {
      switch (coloPassive) {
        case '버프':
          return 'buff'
        case '자신':
          return 'self'
        case '디버프':
          return 'deBuff'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>