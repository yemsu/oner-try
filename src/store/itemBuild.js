import { getItemBuilds, postItemBuild } from "@/plugins/utils/https"
import { parseItemBuildData } from '@/plugins/utils/item-build'
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
  async GET_ITEM_BUILDS({ commit, rootState, dispatch }, {character, page, size}) {
    const { item } = rootState
    if(item.items.length === 0) await dispatch('item/GET_ITEMS','', { root: true })
    if(item.synergies.length === 0) await dispatch('item/GET_SYNERGIES','', { root: true })
    if(item.heroes.length === 0) await dispatch('item/GET_HEROES','', { root: true })
    const items = rootState.item.items
    const synergies = rootState.item.synergies
    const heroes = rootState.item.heroes

    const data = await getItemBuilds({
      character: character,
      page: page,
      size: size || 10,
    })
    // console.log("GET_ITEM_BUILDS", data)
    if(!data) {
      alert(ALERTS.ITEM_SETTING.GET_FAIL)
      return false
    }

    const newData = data.map(itemBuild => (
      parseItemBuildData(itemBuild, items, synergies, heroes)
    ))
    commit(`SET_ITEM_BUILDS`, { data: newData })
  },
  async POST_ITEM_BUILD({}, itemBuild) {
    const res = await postItemBuild(itemBuild)
    if(!res) {
      alert(ALERTS.ITEM_SETTING.SAVE_FAIL)
      return false
    }
    alert(ALERTS.ITEM_SETTING.SAVE_SUCCESS)
    return true
  },
}