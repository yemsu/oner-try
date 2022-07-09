import { fillDataAndInsertValue, getDefaultData, parserStrData, fillDefaultList } from '@/plugins/utils/item'
import { deepClone } from '@/plugins/utils'
import {
  getItems,
  getSailors,
  getEtcItems,
  getCharacters,
  getEquipments,
  getHeroes,
  getGameUsers,
  getColleagues,
  getRanking } from '@/plugins/utils/https'
  const dataSettedDefault = (rawData, type) => {
    const _data = rawData[type]
    const dataTypeArray = Array.isArray(_data) ? _data : [_data]
    return dataTypeArray.map(data => getDefaultData(data))
  }
  const dataParser = (newData, type) => {  
    const result = type.includes('colleague') 
      ? fillDefaultList(newData, 3)
      : type.includes('ship')
        ? fillDefaultList(newData, 1)
        : newData
    return result
  }
  const dataParseHandler = (items, rawData, type) => {
    const data1 = dataSettedDefault(rawData, type)
    const data2 = fillDataAndInsertValue(items, parserStrData(data1.join(',')), 'stack', true)
    const data3 = dataParser(data2, type)
  
    return data3
  }

// Vue.use(Vuex)

export const state = () => ({
  items: [],
  sailors: [],
  etcItems: [],
  nickName: '',
  characters: [],
  equipments: [],
  heroes: [],
  colleagues: [],
  gameUsers: [],
  ranking: [],
  rankingInfiniteScroll: [],
  rankingMain: [],
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
  getCharacters(state) {
    return state.characters
  },
  getEquipments(state) {
    return state.equipments
  },
  getHeroes(state) {
    return state.heroes
  },
  getNickName(state) {
    return state.nickName
  },
  getColleagues(state) {
    return state.colleagues
  },
  getGameUsers(state) {
    return state.gameUsers
  },
  getRanking(state) {
    return state.ranking
  },
  getRankingInfiniteScroll(state) {
    return state.rankingInfiniteScroll
  },
  getRankingMain(state) {
    return state.rankingMain
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
  SET_CHARACTERS(state, {type, data}) {
    state[type] = data
  },
  SET_NICKNAME(state, payload) {
    state.nickName = payload
  },
  SET_EQUIPMENTS(state, {type, data}) {
    state[type] = data
  },
  SET_HEROS(state, {type, data}) {
    const newData = data.map(hero => Object.assign(hero, {type: 'hero'}))
    state[type] = newData
  },
  SET_COLLEAGUES(state, {type, data}) {
    const newData = data.map(colleague => Object.assign(colleague, {type: 'colleague'}))
    state[type] = newData
  },
  SET_GAME_USERS(state, {type, data}) {
    state[type] = data
  },
  SET_RANKING(state, {type, data}) {
    data.sort((a, b) => {
      if(a.lv === b.lv) {
        return a.bounty - b.bounty
      }
      return a.lv - b.lv
    }).reverse()

    state[type] = data
  },
  ADD_RANKING_DATA(state, {type, number}) {
    const { [type]: data, ranking } = state
    const thisData = deepClone(ranking).splice(data.length, number)
    const newData = thisData.map(user => {
      const sailors = user.sailors
        ? dataParseHandler(state.items, user, 'sailors') 
        : []
      const colleagues = user.colleagues
        ? dataParseHandler(state.items, user, 'colleagues')
        : []
      return Object.assign(user, { sailors, colleagues })
    })

    state[type] = data.concat(newData)
  },
  RESET_RANKING_DATA(state, {type, number}) {
    const { [type]: data } = state

    state[type] = data.splice(0, number)
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
  },
  GET_RANKING({ commit }, payload) {
    return getRanking(payload)
      .then(({data}) => {
        // console.log('GET_GAME_USERS', data)
        commit(`SET_RANKING`, {data, type: 'ranking'})
        return data
      })
      .catch(error => console.log('GET_RANKING', error))
  }
}