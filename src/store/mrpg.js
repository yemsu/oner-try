import {
  getEquipments,
  getMaterials
} from '@/plugins/utils/https-mrpg'

export const state = () => ({
  equipments: [],
  materials: [],
})

export const getters = {
  getEquipments: (state) => state.equipments,
  getMaterials: (state) => state.materials,
}

export const mutations = {
  SET_EQUIPMENTS(state, data) {
    state.ryuoes = data
  },
  SET_MATERIALS(state, data) {
    state.ryuoes = data
  },
}
export const actions = {
  async GET_EQUIPMENTS({ commit }) {
    console.log('mrpg/GET_EQUIPMENTS')
    const data = await getEquipments()
    console.log('equipments', data)
    commit('SET_EQUIPMENTS', data)
    return data
  },
  async GET_MATERIALS({ commit }) {
    console.log('mrpg/GET_MATERIALS')
    const data = await getMaterials()
    console.log('materials', data)
    commit('SET_MATERIALS', data)
    return data
  },
}