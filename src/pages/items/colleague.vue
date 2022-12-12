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
        type="colleague"
        :items="resultColleagues"
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
      title: `동료 아이템 도감`,
      description: `원하는 옵션을 선택하고 동료 아이템 정보를 확인해보세요`,
    })
  },
  components: {
    BaseButton
  },
  async asyncData({ store }) {
    const { item: { colleagues } } = store.state
    const colleaguesData = colleagues.length === 0
      ? await store.dispatch('item/GET_COLLEAGUES')
      : colleagues

    const commonMenu = { all: 'ALL' }
    const optionMenus =  Object.assign({...commonMenu}, noEquipOptions)
    return {
      colleagues: colleaguesData,
      optionMenus,
    }
  },
  data() {
    return {
      optionsSelected: []
    }
  },
  computed: {
    resultColleagues() {
      const resultColleagues = this.colleagues.filter(colleague => {
        const { option: options } = colleague
        const isAllOption = this.optionsSelected.length === 0

        const optionKeys = options.map(option => Object.keys(option)[0])
        const checkListOptions = this.optionsSelected.map(optionsSelected => optionKeys.includes(optionsSelected))

        const checkOptions = [...new Set(checkListOptions)]

        const filteringOptions = isAllOption ? true
          : checkOptions.length === 1 && checkOptions[0]
        if(filteringOptions === true) return true
        else if(filteringOptions.length === options.length) return true
      })
      
      return resultColleagues
    }
  },
  mounted() {
    console.log('colleagues', this.colleagues)
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/items/table.scss';
</style>