<template>
  <div>
    <dl>
      <dt>등급</dt>
      <dd
        v-for="(gradeTitle, key) in gradeMenus"
        :key="`gradeTitle${key}`"
      >
        <button @click="toggleMenu(key, 'grade')">{{ gradeTitle }} {{ isActiveMenu(key, 'grade') }}</button>
      </dd>
    </dl>
    <dl>
      <dt>옵션</dt>
      <dd
        v-for="(optionTitle, key) in optionMenus"
        :key="`optionTitle${key}`"
      >
        <button @click="toggleMenu(key, 'option')">{{ optionTitle }} {{ isActiveMenu(key, 'option') }}</button>
      </dd>
    </dl>
    <table>
      <thead>
        <tr>
          <th scope="col">name</th>
          <th scope="col">option</th>
          <th scope="col">synergy</th>
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
            <dl>
              <div
                v-for="(synergy, i) in sailor.synergies"
                :key="`synergy${sailor.name}${i}`"
              >
                <dt>{{ synergy.name }}</dt>
                <dd>
                  <item-detail-info 
                    :options="synergy.option"
                  />
                </dd>
                <dd>
                  {{ synergy.sailors.join() }}
                </dd>
              </div>
            </dl>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// import { mapGetters, mapActions, mapMutations } from 'vuex'
import { noEquipOptions, gradesDef } from '@/plugins/utils/item-def'
export default {
  data() {
    return {
    }
  },
  async asyncData({ store }) {
    const { item: { sailors_synergy } } = store.state
    const sailors = sailors_synergy.length === 0
      ? await store.dispatch('item/GET_SAILORS_SYNERGY')
      : sailors_synergy

    const commonMenu = { all: 'ALL' }
    const gradeMenus = Object.assign(gradesDef, commonMenu)
    const optionMenus =  Object.assign(noEquipOptions, commonMenu)
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
        this[`${type}sSelected`].splice(index)
      } else {
        this[`${type}sSelected`].push(key)
      }
    },
  }
}
</script>

<style>
</style>