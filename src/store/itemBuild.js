import { getItemBuild, getItemBuilds, postItemBuild, deleteItemBuild, putItemBuild } from "@/plugins/utils/https"
import { parseItemBuildData } from '@/plugins/utils/item-build'
import ALERTS from "../constants/ALERTS"

export const state = () => ({
  itemBuilds: null,
  itemBuild: null,
})

export const getters = {
  getItemBuilds: (state) => state.itemBuilds,
  getItemBuild: (state) => state.itemBuild,
}

export const mutations = {
  SET_ITEM_BUILDS(state, data) {
    state.itemBuilds = data
  },
  SET_ITEM_BUILD(state, data) {
    state.itemBuild = data
  },
  DELETE_ITEM_BUILDS(state, id) {
    state.itemBuilds = state.itemBuilds.filter(itemBuild => itemBuild.id !== id)
  },
  EDIT_ITEM_BUILD_DATA(state, { keyName, data }) {
    state.itemBuild[keyName] = data
  },
  ADD_ITEM_BUILD_ITEM(state, { type, blankSlotIndex, selectedItem }) {
    state.itemBuild[type][blankSlotIndex] = selectedItem
  },
  DELETE_ITEM_BUILD_ITEM(state, { type, index }) {
    state.itemBuild[type].splice(index, 1, null)      
  },
}

export const actions = {
  async GET_ITEM_BUILDS({ commit, rootState, dispatch }, {character, page, size}) {
    const { item } = rootState
    if(item.items.length === 0) await dispatch('item/GET_ITEMS','', { root: true })
    if(item.colleagues.length === 0) await dispatch('item/GET_COLLEAGUES','', { root: true })
    if(item.synergies.length === 0) await dispatch('item/GET_SYNERGIES','', { root: true })
    if(item.heroes.length === 0) await dispatch('item/GET_HEROES','', { root: true })
    const items = rootState.item.items
    const synergies = rootState.item.synergies
    const heroes = rootState.item.heroes
    const colleagues = rootState.item.colleagues

    const data = await getItemBuilds({
      character: character,
      page: page,
      size: size || 10,
    })
    console.log("GET_ITEM_BUILDS", data)
    if(!data) {
      alert(ALERTS.ITEM_SETTING.GET_LIST_FAIL)
      return false
    }

    const newData = data.map(itemBuild => (
      parseItemBuildData(itemBuild, items, synergies, heroes, colleagues)
    ))
    commit(`SET_ITEM_BUILDS`, newData)
  },
  async GET_ITEM_BUILD({ commit, rootState, dispatch }, id) {
    const { item } = rootState
    if(item.items.length === 0) await dispatch('item/GET_ITEMS','', { root: true })
    if(item.colleagues.length === 0) await dispatch('item/GET_COLLEAGUES','', { root: true })
    if(item.synergies.length === 0) await dispatch('item/GET_SYNERGIES','', { root: true })
    if(item.heroes.length === 0) await dispatch('item/GET_HEROES','', { root: true })
    const items = rootState.item.items
    const synergies = rootState.item.synergies
    const heroes = rootState.item.heroes
    const colleagues = rootState.item.colleagues
    const data = await getItemBuild(id)
    if(!data) {
      alert(ALERTS.ITEM_SETTING.GET_FAIL)
      return false
    }
    const newData = parseItemBuildData(data, items, synergies, heroes, colleagues)

    commit('SET_ITEM_BUILD', newData)
    return newData
  },
  async POST_ITEM_BUILD({}, itemBuild) {
    const res = await postItemBuild(itemBuild)
    if(!res) {
      alert(ALERTS.ITEM_SETTING.SAVE_FAIL)
      return false
    }
    return true
  },
  async DELETE_ITEM_BUILD({ commit }, id) {
    const res = await deleteItemBuild(id)
    if(!res) {
      alert(ALERTS.ITEM_SETTING.DELETE_FAIL)
      return false
    }

    commit('DELETE_ITEM_BUILDS', id)
    return true
  },
  async PUT_ITEM_BUILD({ commit, rootState, dispatch }, itemBuild) {
    console.log('rootState', rootState)
    if(rootState.heroes?.length === 0) await dispatch('item/GET_HEROES','', { root: true })
    const res = await putItemBuild(itemBuild)
    if(!res) {
      alert(ALERTS.ITEM_SETTING.EDIT_SAVE_FAIL)
      return false
    }

    const hero = res.hero || rootState.heroes.find(hero => hero.imageName === res.characterName)
    commit('EDIT_ITEM_BUILD_DATA', {
      keyName: 'hero',
      data: hero
    })

    return res
  }
}