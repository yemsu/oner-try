import { fillDataAndInsertValue, parserDefaultData, parserStrData, fillDefaultList, findData } from '@/plugins/utils/item'
import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { deepClone, addCommaNumber } from '@/plugins/utils'
import { getUserCharacters, getGameUsers, getRanking } from '@/plugins/utils/https'

const dataParser = (newData, type) => {  
  const result = type.includes('colleague') 
    ? fillDefaultList(newData, 3)
    : type.includes('ship')
      ? fillDefaultList(newData, 1)
      : newData
  return result
}
const dataParseHandler = (items, rawData, type) => {
  const data2 = fillDataAndInsertValue(items, parserStrData(rawData[type]), 'stack', true)
  // console.log('data2', data2)
  const data3 = dataParser(data2, type)
  // console.log('data3', data3)

  return data3
}

export const state = () => ({
  userCharacters: [],
  gameUsers: [],
  ranking: [],
  rankingCrr: [],
})

export const getters = {
  getUserCharacters(state) {
    return state.userCharacters
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
  SET_USER_CHARACTERS(state, data) {
    state.userCharacters = data
  },
  SET_GAME_USERS(state, data) {
    state.gameUsers = data
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
  async GET_USER_CHARACTERS({ commit, rootState, dispatch }, payload) {
    const { item: { heroes, equipments, sailors, colleagues, ships, ryuoes, synergies }} = rootState
    if(heroes.length === 0) await dispatch('item/GET_HEROES','', { root: true })
    if(equipments.length === 0) await dispatch('item/GET_EQUIPMENTS','', { root: true })
    if(sailors.length === 0) await dispatch('item/GET_SAILORS','', { root: true })
    if(colleagues.length === 0) await dispatch('item/GET_COLLEAGUES','', { root: true })
    if(ships.length === 0) await dispatch('item/GET_SHIPS','', { root: true })
    if(ryuoes.length === 0) await dispatch('item/GET_RYUOES','', { root: true })
    if(synergies.length === 0) await dispatch('item/GET_SYNERGIES','', { root: true })
    return getUserCharacters(payload)
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
              const result = dataTypeArray.map(data => parserDefaultData(data))
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
        
        commit(`SET_USER_CHARACTERS`, sortRank(newData))
        return sortRank(newData)
      })
      .catch(error => console.log('GET_USER_CHARACTERS', error))
  },
  GET_GAME_USERS({ commit }, payload) {
    return getGameUsers(payload)
      .then(({data}) => {
        // console.log('GET_GAME_USERS', data)
        commit(`SET_GAME_USERS`, data)
        return data
      })
      .catch(error => console.log('GET_GAME_USERS', error))
  },
  GET_RANKING({ commit, rootState }, payload) {
    return getRanking(payload)
      .then(({data}) => {
        const { item: { sailors, colleagues, items } } = rootState
        const sailorData = sailors.length === 0 ? items : sailors
        const colleagueData = colleagues.length === 0 ? items : colleagues
        // if(sailors.length === 0) console.warn('USING ITEMS DATA : NEED SAILORS DATA - GET_RANKING')
        // if(colleagues.length === 0) console.warn('USING ITEMS DATA : NEED COLLEAGUES DATA - GET_RANKING')
        const newData = data.map(user => {
          const sailors = user.sailors !== '[]'
            ? dataParseHandler(sailorData, user, 'sailors') 
            : new Array(6).fill(null)
          const colleagues = user.colleagues !== '[]'
            ? dataParseHandler(colleagueData, user, 'colleagues')
            : new Array(3).fill(null)
          return Object.assign(user, { sailors, colleagues })
        })
        commit(`SET_RANKING`, sortRank(newData))
        return sortRank(newData)
      })
      .catch(error => console.log('character/GET_RANKING', error))
  }
}
function sortRank(data) {
  const newData = deepClone(data)
  return newData.sort((a, b) => {
    if(b.bounty === a.bounty) {
      return b.lv - a.lv
    }
    return b.bounty - a.bounty
  })
}