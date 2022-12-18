<template>
  <div>
    <dl class="list-menu-filter">
      <dt class="title">등급</dt>
      <div class="wrap-menu list-button-common">
        <dd
          v-for="(gradeTitle, key) in gradeMenus"
          :key="`gradeTitle${key}`"
          :class="['menu-filter', {'active': isActiveMenu(key, 'grade')}]"
        >
          <base-button
            @click="toggleMenu(key, 'grade')"
            class="button-filter"
            type="round"
            :bg="isActiveMenu(key, 'grade') ? 'active': 'inActive'"
          >
            {{ gradeTitle }}
          </base-button>
        </dd>
      </div>
    </dl>
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
        type="sailor"
        :items="resultSailors"
        :optionsSelected="optionsSelected"
      />
    </div>
  </div>
</template>

<script>
// import { mapGetters, mapActions, mapMutations } from 'vuex'
import ItemTable from '@/components/item/ItemTable.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import setMeta from '@/plugins/utils/meta';
import { noEquipOptions, gradesDef } from '@/plugins/utils/item-def'
export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `선원 아이템 도감`,
      description: `원하는 등급, 옵션을 선택하고 선원 아이템 정보를 확인해보세요`,
    })
  },
  components: {
    BaseButton,
    ItemTable
  },
  async asyncData({ store }) {
    const { item: { sailors_synergy } } = store.state
    const sailors = sailors_synergy.length === 0
      ? await store.dispatch('item/GET_SAILORS_SYNERGY')
      : sailors_synergy

    const commonMenu = { all: 'ALL' }
    const gradeMenus = Object.assign({...commonMenu}, gradesDef)
    const optionMenus =  Object.assign({...commonMenu}, noEquipOptions)
    return {
      sailors,
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
    }
  },
  created() {
    this.setResultSailors()
  },
  methods: {
    setResultSailors() {
      const resultSailors = this.sailors.filter(sailor => {
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