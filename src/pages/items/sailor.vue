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
            <th scope="col">시너지</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(sailor, i) in resultSailors"
            :key="`sailor${i}`"
          >
            <td>
              <item-box
                size="small"
                type="list"
                :item="sailor"
                :showBadges="['howGet']"
                :showTooltip="false"
              />
            </td>
            <td>
              <item-detail-info
                :options="sailor.option"
              />
            </td>
            <td>
              <dl v-if="sailor.synergies.length !== 0" class="synergies">
                <div
                  v-for="(synergy, i) in sailor.synergies"
                  :key="`synergy${sailor.name}${i}`"
                  class="wrap-synergy"
                >
                  <dt class="title">{{ synergy.name }}</dt>
                  <dd>
                    <item-detail-info
                      :options="synergy.option"
                    />
                  </dd>
                  <dd>
                    선원: {{ synergy.sailors.join(', ') }}
                  </dd>
                </div>
              </dl>
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
import BaseButton from '@/components/common/BaseButton.vue'
import setMeta from '@/plugins/utils/meta';
import { noEquipOptions, gradesDef } from '@/plugins/utils/item-def'
export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `아이템 도감`,
      description: `원하는 아이템 정보 필터링하고 확인해보세요`,
    })
  },
  components: {
    BaseButton
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
        const allGrade = this.gradesSelected.length === 0
        const allOption = this.optionsSelected.length === 0
        // filtering grade
        const filteringGrade = allGrade ? true
          : this.gradesSelected.includes(grade)
      // console.log('filteringGrade', filteringGrade)
        if(!filteringGrade) return false
        // filtering option

        const optionKeys = options.map(option => Object.keys(option)[0])
        const checkListOptions = this.optionsSelected.map(optionsSelected => optionKeys.includes(optionsSelected))

        const checkOptions = [...new Set(checkListOptions)]

        const filteringOptions = allOption ? true
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
      if(key === 'all') {
        this[`${type}sSelected`] = []
        return
      }
      if(this[`${type}sSelected`].includes(key)) {
        const index = this[`${type}sSelected`].indexOf(key)
        this[`${type}sSelected`].splice(index, 1)
      } else {
        this[`${type}sSelected`].push(key)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/items/table.scss';
</style>