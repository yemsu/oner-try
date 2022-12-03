import { fillDataAndInsertValue, getDefaultData, parserStrData, fillDefaultList, findData } from '@/plugins/utils/item'
import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { deepClone, addCommaNumber } from '@/plugins/utils'
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
  characters: [],
  gameUsers: [],
  ranking: [],
  rankingCrr: [],
})

export const getters = {
  getCharacters(state) {
    return state.characters
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
  SET_RANKING(state, data) {     
    state.ranking = data
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
  async GET_CHARACTERS({ commit, rootState, dispatch }, payload) {
    const { item: { heroes, equipments, sailors, colleagues, ships, ryuoes, synergies }} = rootState
    if(heroes.length === 0) await dispatch('item/GET_HEROES','', { root: true })
    if(equipments.length === 0) await dispatch('item/GET_EQUIPMENTS','', { root: true })
    if(sailors.length === 0) await dispatch('item/GET_SAILORS','', { root: true })
    if(colleagues.length === 0) await dispatch('item/GET_COLLEAGUES','', { root: true })
    if(ships.length === 0) await dispatch('item/GET_SHIPS','', { root: true })
    if(ryuoes.length === 0) await dispatch('item/GET_RYUOES','', { root: true })
    if(synergies.length === 0) await dispatch('item/GET_SYNERGIES','', { root: true })
    return getCharacters(payload)
      .then(({data}) => {
        const newData = data.map(character => {
          // hero
          const heroData = findData(heroes, 'name', character.heroName)
          const hero = heroData ? deepClone(heroData) : {id: character.heroName}
          hero.bounty = addCommaNumber(character.bounty.trim())

          const dataParser = (character, type) => {
            const data = () => {
              const _data = character[type]
              const dataTypeArray = Array.isArray(_data) ? _data : [_data]
              const result = dataTypeArray.map(data => getDefaultData(data))
              return parserStrData(result.join(','))
            }
            const typeState = type === 'ship' ? 'ships' : type
            const newData = fillDataAndInsertValue(rootState.item[typeState], data(), 'stack', true)

            const result = type.includes('colleague') 
            ? fillDefaultList(newData, 3)
            : type.includes('ship')
              ? fillDefaultList(newData, 1)
              : newData

            return result
          }
          const equipments = dataParser(character, 'equipments')
          const sailors = dataParser(character, 'sailors')
          const colleagues = dataParser(character, 'colleagues')
          const ship = dataParser(character, 'ship')
          const characterRyuo = rootState.item.ryuoes.find(ryuo => ryuo.name.includes(`${character.ryuo}차`))
          const ryuo = characterRyuo ? [{
            name: characterRyuo.name,
            option: characterRyuo.option
          }] : [null]
          Object.assign(character, { hero, equipments, sailors, colleagues , ship, ryuo})

          const characterSynergies = getCharacterSynergies(sailors, rootState.item.synergies)
          const totalOption = getTotalOption(character, characterSynergies)

          return Object.assign(character, { totalOption, synergies: characterSynergies })
        })
        
        commit(`SET_CHARACTERS`, {data: newData, type: 'characters'})
        return newData
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
        const { item: { sailors, colleagues, items } } = rootState
        if(sailors.length === 0) console.warn('USING ITEMS DATA : NEED SAILORS DATA - GET_RANKING')
        if(colleagues.length === 0) console.warn('USING ITEMS DATA : NEED COLLEAGUES DATA - GET_RANKING')
        const sailorData = sailors.length === 0 ? items : sailors
        const colleagueData = colleagues.length === 0 ? items : colleagues
        const newData = data.map(user => {
          const sailors = user.sailors !== '[]'
            ? dataParseHandler(sailorData, user, 'sailors') 
            : new Array(6).fill(null)
          const colleagues = user.colleagues !== '[]'
            ? dataParseHandler(colleagueData, user, 'colleagues')
            : new Array(3).fill(null)
          return Object.assign(user, { sailors, colleagues })
        })
        const sortData = newData.sort((a, b) => {
          if(b.bounty === a.bounty) {
            return b.lv - a.lv
          }
          return b.bounty - a.bounty
        })
        commit(`SET_RANKING`, sortData)
        return sortData
      })
      .catch(error => console.log('character/GET_RANKING', error))
  }
}