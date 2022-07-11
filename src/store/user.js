import { fillDataAndInsertValue, getDefaultData, parserStrData, fillDefaultList } from '@/plugins/utils/item'
import { deepClone } from '@/plugins/utils'
import {
  getCharacters,
  getGameUsers,
  getRanking 
} from '@/plugins/utils/https'
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

export const state = () => ({
  nickName: '',
  characters: [],
  gameUsers: [],
  ranking: [],
  rankingCrr: [],
})

export const getters = {
  getCharacters(state) {
    return state.characters
  },
  getNickName(state) {
    return state.nickName
  },
  getGameUsers(state) {
    return state.gameUsers
  },
  getRanking(state) {
    return state.ranking
  },
  getRankingCrr(state) {
    return state.rankingCrr
  },
}

export const mutations = {
  SET_CHARACTERS(state, {type, data}) {
    state[type] = data
  },
  SET_GAME_USERS(state, {type, data}) {
    state[type] = data
  },
  SET_NICKNAME(state, payload) {
    state.nickName = payload
  },
  SET_RANKING(state, data) {
    const sortData = data.sort((a, b) => {
      if(a.lv === b.lv) {
        return a.bounty - b.bounty
      }
      return a.lv - b.lv
    }).reverse()
    
    state.ranking = sortData
  },
  ADD_RANKING_DATA(state, { number }) {
    const { rankingCrr, ranking } = state
    const thisData = deepClone(ranking).splice(rankingCrr.length, number)

    state.rankingCrr = rankingCrr.concat(thisData)
  },
  RESET_RANKING_DATA(state, { number }) {
    state.rankingCrr = state.rankingCrr.splice(0, number)
  },
}
export const actions = {
  GET_CHARACTERS({ commit }, payload) {
    return getCharacters(payload)
      .then(({data}) => {
        commit(`SET_CHARACTERS`, {data, type: 'characters'})
        return data
      })
      .catch(error => console.log('GET_CHARACTERS', error))
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
  GET_RANKING({ commit, rootState }, payload) {
    return getRanking(payload)
      .then(({data}) => {
        const { sailors, colleagues } = rootState
        if(sailors.length === 0) console.warn('USING ITEMS DATA : NEED SAILORS DATA - GET_RANKING')
        if(colleagues.length === 0) console.warn('USING ITEMS DATA : NEED COLLEAGUES DATA - GET_RANKING')
        const sailorData = sailors.length === 0 ? rootState.items : sailors
        const colleagueData = colleagues.length === 0 ? rootState.items : colleagues
        const newData = data.map(user => {
          const sailors = user.sailors !== '[]'
            ? dataParseHandler(sailorData, user, 'sailors') 
            : new Array(6).fill(null)
          const colleagues = user.colleagues !== '[]'
            ? dataParseHandler(colleagueData, user, 'colleagues')
            : new Array(3).fill(null)
          return Object.assign(user, { sailors, colleagues })
        })
        commit(`SET_RANKING`, newData)
        return data
      })
      .catch(error => console.log('user/GET_RANKING', error))
  }
}