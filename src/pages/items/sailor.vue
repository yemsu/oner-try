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
      <div class="text-refer top">
        <p>총 {{ resultSailors.length }}개</p>
        <p class="align-right">
          2022.06.12 도감 기준
        </p>
      </div>
      <table>
        <colgroup>
          <col width="25%">
          <col width="30%">
          <col width="45%">
        </colgroup>
        <thead>
          <tr>
            <th scope="col">선원</th>
            <th scope="col">옵션</th>
            <th scope="col">인연 / 악연</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(sailor, i) in resultSailors"
            :key="`sailor${i}`"
          >
            <td>
              <item-box
                type="list"
                :item="sailor"
                :showBadges="['howGet']"
                :showTooltip="false"
                :isBlankLink="true"
                :padding="false"
              />
            </td>
            <td>
              <item-detail-info
                :options="sailor.option"
                :markOptions="optionsSelected"
                :highlightTitle="false"
              />
            </td>
            <td>
              <!-- <dl v-if="sailor.synergies.length !== 0" class="synergies"> -->
              <synergy-desc
                v-if="sailor.synergies.length !== 0"
                :synergies="sailor.synergies"
              />
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// import { mapGetters, mapActions, mapMutations } from 'vuex'
import SynergyDesc from '@/components/item/SynergyDesc.vue'
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
    SynergyDesc
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
      optionsSelected: []
    }
  },
  computed: {
    resultSailors() {
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
      
      return resultSailors
    }
  },
  mounted() {
    console.log('sailsaors', this.sailors)
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