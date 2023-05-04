<template>
  <section>
    <h2 class="ir-hidden">포션 아이템 도감</h2>
    <div class="mrg-top-medium">  
      <item-table
        type="etcItem"
        :items="resultPotions"
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
      title: `기타 아이템 도감`,
      description: `기타 아이템 정보를 확인해보세요`,
    })
  },
  components: {
    BaseButton
  },
  async asyncData({ store }) {
    const etcItems = await store.dispatch('item/GET_ETC_ITEMS_TABLE')
    const commonMenu = { all: 'ALL' }
    const optionMenus =  Object.assign({...commonMenu}, noEquipOptions)
    return {
      etcItems,
      optionMenus,
    }
  },
  data() {
    return {
      optionsSelected: [],
      resultPotions: null
    }
  },
  watch: {
    optionsSelected(crr, pre) {
      this.setResultPotions()
    }
  },
  created() {
    console.log('this.etcItems', this.etcItems)
    this.resultPotions = this.etcItems
  },
  methods: {
    setResultPotions() {
      const resultPotions = this.etcItems.filter(etcItem => {
        const { optionsByStack, option } = etcItem
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
      
      this.resultPotions = resultPotions
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
    classNegaPosi(etcItem) {
      return etcItem.coloYn ? 'positive' : 'negative'
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