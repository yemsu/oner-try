import { isSameText, deepClone } from '@/plugins/utils'
import { parserStrData, sortByGrade } from '@/plugins/utils/item'
import {
  getItems,
  getSailors,
  getEtcItems,
  getEquipments,
  getHeroes,
  getColleagues,
  getSynergies
} from '@/plugins/utils/https'

export const state = () => ({
  items: [],
  sailors: [],
  sailors_synergy: [],
  etcItems: [],
  equipments: [],
  heroes: [],
  colleagues: [],
  synergies: [],
})

export const getters = {
  getItems(state) {
    return state.items
  },
  getSailors(state) {
    return state.sailors
  },
  getEtcItems(state) {
    return state.etcItems
  },
  getEquipments(state) {
    return state.equipments
  },
  getHeroes(state) {
    return state.heroes
  },
  getColleagues(state) {
    return state.colleagues
  },
}

export const mutations = {
  SET_ITEMS(state, {type, data}) {
    state[type] = data
  },
  SET_SAILORS(state, {type, data}) {
    state[type] = data
  },
  SET_ETC_ITEMS(state, {type, data}) {
    state[type] = data
  },
  SET_EQUIPMENTS(state, {type, data}) {
    state[type] = data
  },
  SET_HEROS(state, {type, data}) {
    const newData = data.map(hero => Object.assign(hero, {type: 'hero'}))
    state[type] = newData
  },
  SET_COLLEAGUES(state, {data}) {
    state.colleagues = data
  },
  SET_SYNERGIES(state, {data}) {
    state.synergies = data
  },
  SET_SAILORS_SYNERGY(state, {data}) {    
    state.sailors_synergy = data
  },
}
const dataTyped = (data) => {
  const newData = data.map(item =>{
    const type = item.type || 'etcItem'
    return Object.assign(item, {type})
  })
  return newData
}
export const actions = {
  GET_ITEMS({ commit }) {
    return getItems()
      .then(({data}) => {
        // console.log('GET_SAILORS',data)
        commit(`SET_ITEMS`, {data: dataTyped(data), type: 'items'})
        return data
      })
      .catch(error => console.log('GET_ITEMS', error))
  },
  GET_SAILORS({ commit }) {
    return getSailors()
      .then(({data}) => {
        // console.log('GET_SAILORS',data)
        const newData = data.map(dataItem => Object.assign(dataItem, {option: parserStrData(dataItem.option)}))

        commit(`SET_SAILORS`, {data: newData, type: 'sailors'})
        return data
      })
      .catch(error => console.log('GET_SAILORS', error))
  },
  GET_COLLEAGUES({ commit }, payload) {
    return getColleagues(payload)
      .then(({data}) => {
        // console.log('GET_COLLEAGUES', data)
        const newData = data.map(dataItem => {
          const { option, coloOption, coloPassive } = dataItem
          const optionObj = {option: parserStrData(option)}
          const coloOptionObj = coloOption ? {coloOption: parserStrData(coloOption)} : {}
          const coloPassiveObj = coloPassive ? {coloPassive: parserStrData(coloPassive, 'list')} : {}
          const newObj = coloOption
            ? Object.assign(optionObj, {...coloOptionObj, ...coloPassiveObj})
            : optionObj
          return Object.assign(dataItem, newObj)
        })

        commit(`SET_COLLEAGUES`, {data: newData})
        return newData
      })
      .catch(error => console.log('GET_COLLEAGUES', error))
  },
  GET_ETC_ITEMS({ commit }) {
    return getEtcItems()
      .then(({data}) => {
        // console.log('SET_ETC_ITEMS', data)
        commit(`SET_ETC_ITEMS`, {data, type: 'etcItems'})
        return data
      })
      .catch(error => console.log('GET_ETC_ITEMS', error))
  },
  GET_EQUIPMENTS({ commit }, payload) {
    return getEquipments(payload)
      .then(({data}) => {
        commit(`SET_EQUIPMENTS`, {data, type: 'equipments'})
        return data
      })
      .catch(error => console.log('GET_EQUIPMENTS', error))
  },
  GET_HEROES({ commit }, payload) {
    return getHeroes(payload)
      .then(({data}) => {
        // console.log('GET_HEROES', data)
        commit(`SET_HEROS`, {data, type: 'heroes'})
        return data
      })
      .catch(error => console.log('GET_HEROES', error))
  },
  GET_SYNERGIES({ commit }) {
    return getSynergies()
      .then(({data}) => {
        const newData = data.map(dataItem => {
          const option = parserStrData(dataItem.option)
          const sailors = parserStrData(dataItem.sailors, 'list')
          return Object.assign(dataItem, {option, sailors})
        })
        commit(`SET_SYNERGIES`, {data: newData})
        return newData
      })
      .catch(error => console.log('GET_SYNERGIES', error))
  },
  async GET_SAILORS_SYNERGY({ commit, state, dispatch }) {
    if(state.sailors.length === 0) await dispatch('GET_SAILORS')
    if(state.synergies.length === 0) await dispatch('GET_SYNERGIES')

    // gradeScoresDef
    const { sailors, synergies } = state
    const newData = deepClone(sailors).map(sailor => {
      const { name } = sailor
      sailor.synergies = synergies.filter(({ sailors: synergySailors }) => {
        return synergySailors.find(synergySailor => isSameText(synergySailor, name))
      })
      return sailor
    })
    
    commit(`SET_SAILORS_SYNERGY`, {data: sortByGrade(newData)})
    return newData
  },
}