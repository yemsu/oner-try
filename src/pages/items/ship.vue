<template>
  <div>
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
    <div class="mrg-top-medium">  
      <item-table
        type="ship"
        :items="resultShips"
        :optionsSelected="optionsSelected"
      />
    </div>
  </div>
</template>

<script>
// import { mapGetters, mapActions, mapMutations } from 'vuex'
import BaseButton from '@/components/common/BaseButton.vue'
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
    BaseButton
  },
  async asyncData({ store }) {
    const { item: { ships_table } } = store.state
    const shipsTableData = ships_table.length === 0
      ? await store.dispatch('item/GET_SHIPS_TABLE')
      : ships_table

    const commonMenu = { all: 'ALL' }
    const optionMenus =  Object.assign({...commonMenu}, noEquipOptions)
    return {
      ships: shipsTableData,
      optionMenus,
    }
  },
  data() {
    return {
      optionsSelected: []
    }
  },
  computed: {
    resultShips() {
      const resultShips = this.ships.filter(ship => {
        const { optionsByStack } = ship
        const isAllOption = this.optionsSelected.length === 0

        const optionKeys = optionsByStack[4].map(option => Object.keys(option)[0])
        const checkListOptions = this.optionsSelected.map(optionsSelected => optionKeys.includes(optionsSelected))

        const checkOptions = [...new Set(checkListOptions)]

        const filteringOptions = isAllOption ? true
          : checkOptions.length === 1 && checkOptions[0]
        if(filteringOptions === true) return true
        else if(filteringOptions.length === optionsByStack[4].length) return true
      })
      
      return resultShips
    }
  },
  mounted() {
    console.log('ships', this.ships)
  },
  methods: {
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
@import '@/assets/style/pages/item/table.scss';
</style>