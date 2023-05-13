<template>
  <section>
    <h2 class="ir-hidden">선박 아이템 도감</h2>
    <section>
      <h2 class="ir-hidden">필터 선택</h2>
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
        type="ship"
        :items="resultShips"
        :optionsSelected="optionsSelected"
      />
    </div>
  </section>
</template>

<script>
import OptionBar from '@/components/common/OptionBar.vue';
import setMeta from '@/plugins/utils/meta';
import { noEquipOptions } from '@/plugins/utils/item-def'
export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `선박 아이템 도감`,
      description: `원하는 옵션을 선택하고 강화 수치별 선박 아이템 정보를 확인해보세요`,
    })
  },
  components: {
    OptionBar
  },
  async asyncData({ store }) {
    const ships = await store.dispatch('item/GET_SHIPS_TABLE')
    const commonMenu = { all: 'ALL' }
    const optionMenus =  Object.assign({...commonMenu}, noEquipOptions)
    return {
      ships,
      optionMenus,
    }
  },
  data() {
    return {
      optionsSelected: [],
      resultShips: null
    }
  },
  watch: {
    optionsSelected(crr, pre) {
      this.setResultShips()
    }
  },
  created() {
    this.resultShips = this.ships
  },
  methods: {
    setResultShips() {
      const resultShips = this.ships.filter(ship => {
        const { optionsByStack, option } = ship
        const targetOptions = optionsByStack ? optionsByStack[4] : option
        const isAllOption = this.optionsSelected.length === 0

        const optionKeys = targetOptions.map(option => Object.keys(option)[0])
        const checkListOptions = this.optionsSelected.map(optionsSelected => optionKeys.includes(optionsSelected))

        const checkOptions = [...new Set(checkListOptions)]

        const filteringOptions = isAllOption ? true
          : checkOptions.length === 1 && checkOptions[0]
        if(filteringOptions === true) return true
        else if(filteringOptions.length === targetOptions.length) return true
      })
      
      this.resultShips = resultShips
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
    classNegaPosi(ship) {
      return ship.coloYn ? 'positive' : 'negative'
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