import {
  getItems,
  getSailors,
  getEtcItems,
  getCharacters,
  getEquipments,
  getHeroes,
  getGameUsers,
  getColleagues } from '@/plugins/utils/https'

const dataTyped = (data) => {
  const newData = data.map(item =>{
    const type = item.type || 'etcItem'
    return Object.assign(item, {type})
  })
  return newData
}

export default {
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
        commit(`SET_SAILORS`, {data: dataTyped(data), type: 'sailors'})
        return data
      })
      .catch(error => console.log('GET_SAILORS', error))
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
  GET_CHARACTERS({ commit }, payload) {
    return getCharacters(payload)
      .then(({data}) => {
        commit(`SET_CHARACTERS`, {data, type: 'characters'})
        return data
      })
      .catch(error => console.log('GET_CHARACTERS', error))
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
  GET_COLLEAGUES({ commit }, payload) {
    return getColleagues(payload)
      .then(({data}) => {
        // console.log('GET_COLLEAGUES', data)
        commit(`SET_COLLEAGUES`, {data, type: 'colleagues'})
        return data
      })
      .catch(error => console.log('GET_COLLEAGUES', error))
  },
  GET_GAME_USERS({ commit }, payload) {
    return getGameUsers(payload)
      .then(({data}) => {
        // console.log('GET_GAME_USERS', data)
        commit(`SET_GAME_USERS`, {data, type: 'gameUsers'})
        return data
      })
      .catch(error => console.log('GET_GAME_USERS', error))
  }
}