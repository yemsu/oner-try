import { getItemBuild, postItemBuild } from "@/plugins/utils/https"
import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { fillDefaultList } from '@/plugins/utils/item'
import { remakeDateStr } from '@/plugins/utils/index'
import { slotNumbers } from '@/plugins/utils/item-def'
import ALERTS from "@/constants/ALERTS"

export const state = () => ({
  itemBuilds: [],
})

export const getters = {
  getItemBuilds: (state) => state.itemBuilds,
}

export const mutations = {
  SET_ITEM_BUILDS(state, {data}) {
    state.itemBuilds = data
  },
}

export const actions = {
  async GET_ITEM_BUILDS({ commit, rootState, dispatch }, {character, page}) {
    const { item } = rootState
    if(item.items.length === 0) await dispatch('item/GET_ITEMS','', { root: true })
    if(item.synergies.length === 0) await dispatch('item/GET_SYNERGIES','', { root: true })
    if(item.heroes.length === 0) await dispatch('item/GET_HEROES','', { root: true })
    const items = rootState.item.items
    const synergies = rootState.item.synergies
    const heroes = rootState.item.heroes

    const data = await getItemBuild({
      character: character,
      page: page,
      size: 10,
    })
    // console.log("GET_ITEM_BUILDS", data)
    if(!data) {
      alert(ALERTS.ITEM_SETTING.FAIL)
      return false
    }

    
    const getFullData = (itemId) => items.find(({id}) => id === itemId)
    const newData = data.map(itemBuild => {
      const characterName = heroes.find(hero => hero.imageName === itemBuild.characterName).name
      const regDt = remakeDateStr(itemBuild.regDt)
      const equipment = fillDefaultList(
        itemBuild.equipments.split(',').map(getFullData),
        slotNumbers.equipment
      )
      const sailor = fillDefaultList(
        itemBuild.sailor.split(',').map(getFullData),
        slotNumbers.sailor
      )
      const ship = fillDefaultList(
        [itemBuild.ship].map(getFullData),
        slotNumbers.ship
      )
      const characterSynergies = getCharacterSynergies(sailor, synergies)
      const character = {...itemBuild, characterName, regDt, equipment, sailor, ship, synergy: characterSynergies}
      const totalOption = getTotalOption(character, characterSynergies)

      return {...character, totalOption}
    })
    commit(`SET_ITEM_BUILDS`, { data: newData })
  },
  async POST_ITEM_BUILD({}, itemBuild) {
    const res = await postItemBuild(itemBuild)
    if(!res) {
      alert(ALERTS.ITEM_SETTING.FAIL)
      return false
    }
    alert(ALERTS.ITEM_SETTING.SUCCESS)
    return true
  },
}