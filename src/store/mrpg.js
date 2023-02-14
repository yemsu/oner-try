import {
  getEquipments,
  getMaterials
} from '@/plugins/utils/https-mrpg'

export const state = () => ({
  equipments: [],
  compositionEquips: [],
  materials: [],
})

export const getters = {
  getEquipments: (state) => state.equipments,
  getCompositionEquips: (state) => state.compositionEquips,
  getMaterials: (state) => state.materials,
}

export const mutations = {
  SET_EQUIPMENTS(state, data) {
    state.equipments = data
  },
  SET_COMPOSITION_EQUIPS(state, data) {
    state.compositionEquips = data
  },
  SET_MATERIALS(state, data) {
    state.materials = data
  },
}
export const actions = {
  async GET_EQUIPMENTS({ commit }) {
    console.log('mrpg/GET_EQUIPMENTS')
    const data = await getEquipments()
    // console.log('equipments', data)
    const compositionEquips = data.filter(({ ingredients }) => ingredients)
    commit('SET_COMPOSITION_EQUIPS', compositionEquips)
    commit('SET_EQUIPMENTS', data)
    return data
  },
  async GET_MATERIALS({ commit }) {
    console.log('mrpg/GET_MATERIALS')
    const data = await getMaterials()
    // console.log('materials', data)
    commit('SET_MATERIALS', data)
    return data
  },
}