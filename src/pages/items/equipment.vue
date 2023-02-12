<template>
  <section>
    <h2 class="ir-hidden">장비 아이템 도감</h2>
    <section>
      <h2 class="ir-hidden">필터 선택</h2>
      <dl class="list-menu-filter">
        <dt class="title">옵션</dt>
        <div class="wrap-menu list-button-common">
          <dd
            v-for="(optionTitle, key) in optionMenus"
            :key="`optionTitle${key}`"
            :class="['menu-filter', {'active': isActiveMenu(key, 'option')}]"
          >
            <base-button
              @click="toggleMenu(key, 'option')"
              class="button-filter"
              type="round"
              :bg="isActiveMenu(key, 'option') ? 'active': 'inActive'"
            >
              {{ optionTitle }}
            </base-button>
          </dd>
        </div>
      </dl>
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
import BaseButton from '@/components/common/BaseButton.vue'
import setMeta from '@/plugins/utils/meta';
import { noEquipOptions } from '@/plugins/utils/item-def'
export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `장비 아이템 도감`,
      description: `원하는 옵션을 선택하고 강화 수치별 장비 아이템 정보를 확인해보세요`,
    })
  },
  components: {
    BaseButton
  },
  async asyncData({ store }) {
    const equipments = await store.dispatch('item/GET_EQUIPMENTS_TABLE')
    const commonMenu = { all: 'ALL' }
    const optionMenus =  Object.assign({...commonMenu}, noEquipOptions)
    return {
      equipments,
      optionMenus,
    }
  },
  data() {
    return {
      optionsSelected: [],
      resultEquipments: null
    }
  },
  watch: {
    optionsSelected(crr, pre) {
      this.setResultEquipments()
    }
  },
  created() {
    this.resultEquipments = this.equipments
  },
  methods: {
    setResultEquipments() {
      const resultEquipments = this.equipments.filter(equipment => {
        const { optionsByGrade, option } = equipment
        const isAllOption = this.optionsSelected.length === 0
// console.log('optionsByGrade', optionsByGrade)
//       if(!optionsByGrade) return equipment
        const checkOptionsByGrade = optionsByGrade[5] || optionsByGrade[4] || optionsByGrade[3] || optionsByGrade[2] || optionsByGrade[1] || optionsByGrade[0] || []
      if(!checkOptionsByGrade) return equipment
        const optionKeys = [...checkOptionsByGrade, ...option].map(option => Object.keys(option)[0])
        const checkListOptions = this.optionsSelected.map(optionsSelected => optionKeys.includes(optionsSelected))

// console.log('optionKeys', optionKeys, checkListOptions)
        const checkOptions = [...new Set(checkListOptions)]

        const filteringOptions = isAllOption ? true
          : checkOptions.length === 1 && checkOptions[0]
        if(filteringOptions === true) return true
        else if(filteringOptions.length === checkOptionsByGrade.length) return true
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
@import '@/assets/style/pages/items/table.scss';
</style>