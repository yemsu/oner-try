import { fillDataAndInsertValue, parserDefaultData, parserStrData, fillDefaultList, findData } from '@/plugins/utils/item'
import { slotNumbers } from '../plugins/utils/item-def'
import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { deepClone } from '@/plugins/utils'
import { getUserCharacters, getGameUsers, getRanking } from '@/plugins/utils/https'

const dataParseHandler = (items, rawData, type) => {
  const keyName = ['colleague', 'sailor'].includes(type)
    ? `${type}s` : type
  const data2 = fillDataAndInsertValue(items, parserStrData(rawData[keyName]), 'stack', true)
  
  const data3 = fillDefaultList(data2, slotNumbers[type])

  return data3
}

export const state = () => ({
  userCharacters: [],
  gameUsers: [],
  ranking: [],
  rankingCrr: [],
})

export const getters = {
  getUserCharacters: (state) => state.userCharacters,
  getGameUsers: (state) => state.gameUsers,
  getRanking: (state) => state.ranking,
  getRankingCrr: (state) => state.rankingCrr,
}

export const mutations = {
  SET_USER_CHARACTERS(state, data) {
    state.userCharacters = data
  },
  SET_GAME_USERS(state, data) {
    state.gameUsers = data
  },
  SET_RANKING(state, data) {     
    state.ranking = [...state.ranking, ...data]
  },
  RESET_RANKING_DATA(state, { number }) {
    state.ranking = state.ranking.splice(0, number)
  },
}
export const actions = {
  async GET_USER_CHARACTERS({ commit, rootState, dispatch }, payload) {
    const { item: { heroes, equipments, sailors, colleagues, ships, synergies }} = rootState
    if(heroes.length === 0) await dispatch('item/GET_HEROES','', { root: true })
    if(equipments.length === 0) await dispatch('item/GET_EQUIPMENTS','', { root: true })
    if(sailors.length === 0) await dispatch('item/GET_SAILORS','', { root: true })
    if(colleagues.length === 0) await dispatch('item/GET_COLLEAGUES','', { root: true })
    if(ships.length === 0) await dispatch('item/GET_SHIPS','', { root: true })
    // if(ryuoes.length === 0) await dispatch('item/GET_RYUOES','', { root: true })
    if(synergies.length === 0) await dispatch('item/GET_SYNERGIES','', { root: true })
    return getUserCharacters(payload)
      .then((data) => {
        if(!data) return false
        const newData = data.map(character => {
          // hero
          const heroData = findData(rootState.item.heroes, 'name', character.heroName)
          const hero = heroData ? deepClone(heroData) : {id: character.heroName}
          hero.bounty = (character.bounty.trim() * 1).toLocaleString()

          const dataParser = (character, type) => {
            const data = () => {
              const _data = character[type]
              const dataTypeArray = Array.isArray(_data) ? _data : [_data]
              const result = dataTypeArray.map(data => parserDefaultData(data))
              return parserStrData(result.join(','))
            }
            const newData = fillDataAndInsertValue(rootState.item.items, data(), 'stack', true)
            const result = fillDefaultList(newData, slotNumbers[type])

            return result
          }
          const equipment = dataParser(character, 'equipment')
          const sailor = dataParser(character, 'sailor')
          const colleague = dataParser(character, 'colleague')
          const ship = dataParser(character, 'ship')
          const information = parserStrData(character.information.join(','))
          Object.assign(character, { hero, equipment, sailor, colleague , ship, information })

          const characterSynergies = getCharacterSynergies(sailor, rootState.item.synergies)
          const totalOption = getTotalOption(character, characterSynergies)

          return Object.assign(character, { totalOption, synergy: characterSynergies })
        })
        
        commit(`SET_USER_CHARACTERS`, sortRank(newData))
        return sortRank(newData)
      })
      .catch(error => console.error('GET_USER_CHARACTERS', error))
  },
  GET_GAME_USERS({ commit }, payload) {
    return getGameUsers(payload)
      .then((data) => {
        // console.log('GET_GAME_USERS', data)
        commit(`SET_GAME_USERS`, data)
        return data
      })
      .catch(error => console.error('GET_GAME_USERS', error))
  },
  async GET_RANKING({ commit, rootState, dispatch }, params) {
    const { item: { sailors, colleagues, ships }} = rootState
    if(sailors.length === 0) await dispatch('item/GET_SAILORS','', { root: true })
    if(colleagues.length === 0) await dispatch('item/GET_COLLEAGUES','', { root: true })
    if(ships.length === 0) await dispatch('item/GET_SHIPS','', { root: true })
    return getRanking(params)
      .then((data) => {
        const { item: { sailors, colleagues, ships } } = rootState
        const newData = data.map(user => {
          const userSailors = user.sailors !== '[]'
            ? dataParseHandler(sailors, user, 'sailor') 
            : new Array(6).fill(null)
          const userColleagues = user.colleagues !== '[]'
            ? dataParseHandler(colleagues, user, 'colleague')
            : new Array(3).fill(null)
          const userShip = user.ship !== '빈공간'
            ? dataParseHandler(ships, user, 'ship')
            : new Array(1).fill(null)
            console.log('userShip', userShip)
          return Object.assign(user, {
            sailors: userSailors,
            colleagues: userColleagues,
            ship: userShip[0]
          })
        })
        commit(`SET_RANKING`, newData)
        return newData
      })
      .catch(error => console.error('character/GET_RANKING', error))
  }
}
function sortRank(data) {
  const newData = deepClone(data)
  return newData.sort((a, b) => {
    if(b.bounty === a.bounty) {
      if(b.lv === a.lv) {
        return b.exp - a.exp
      }
      return b.lv - a.lv
    }
    return b.bounty - a.bounty
  })
}