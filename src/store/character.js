import { fillDataAndInsertValue, parserDefaultData, parserStrData, fillDefaultList, findData } from '@/plugins/utils/item'
import { slotNumbers } from '../plugins/utils/item-def'
import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { deepClone } from '@/plugins/utils'
import { getUserCharacters, getGameUsers, getRanking } from '@/plugins/utils/https'

const dataParseHandler = (items, rawData, type) => {
  const data2 = fillDataAndInsertValue(items, parserStrData(rawData[type]), 'stack', true)

  // const data3 = type === 'colleagues' || type === 'ship'
  const data3 = type === 'ship'
    ? fillDefaultList(data2, slotNumbers[type])
    : data2

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
          const colleague = new Array(3).fill(null)
          // const colleague = dataParser(character, 'colleague')
          const ship = dataParser(character, 'ship')
          const information = parserStrData(character.information.join(','))
          // const characterRyuo = rootState.item.ryuoes.find(ryuo => ryuo.name.includes(`${character.ryuo}차`))
          // const ryuo = characterRyuo ? [{
          //   name: characterRyuo.name,
          //   option: characterRyuo.option
          // }] : [null]
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
  async GET_RANKING({ commit, rootState, dispatch }, payload) {
    const { item: { sailors, colleagues }} = rootState
    if(sailors.length === 0) await dispatch('item/GET_SAILORS','', { root: true })
    if(colleagues.length === 0) await dispatch('item/GET_COLLEAGUES','', { root: true })

    return getRanking(payload)
      .then((data) => {
        const { item: { sailors, colleagues } } = rootState
        const newData = data.map(user => {
          const userSailors = user.sailors !== '[]'
            ? dataParseHandler(sailors, user, 'sailors') 
            : new Array(6).fill(null)
          const userColleagues = user.colleagues !== '[]'
            ? dataParseHandler(colleagues, user, 'colleagues')
            : new Array(3).fill(null)
          return Object.assign(user, {
            sailors: userSailors,
            colleagues: userColleagues
          })
        })
        commit(`SET_RANKING`, sortRank(newData))
        return sortRank(newData)
      })
      .catch(error => console.error('character/GET_RANKING', error))
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