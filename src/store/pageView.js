
import {
  getCompositionPageViews,
  getCharacterPageViews,
} from '@/plugins/utils/https'

export const state = () => ({
  composition: [],
  CompositionSearchRanking: [],
  character: [],
  CharacterSearchRanking: [],
})

export const getters = {
  getComposition: (state) => state.composition,
  getCompositionSearchRanking: (state) => state.CompositionSearchRanking,
  getCharacter: (state) => state.character,
  getCharacterSearchRanking: (state) => state.CharacterSearchRanking,
}

export const mutations = {
  SET_COMPOSITION(state, {data}) {
    state.composition = data
  },
  SET_COMPOSITION_SEARCH_RANKING(state, {data}) {
    state.CompositionSearchRanking = data
  },
  SET_CHARACTER(state, {data}) {
    state.character = data
  },
  SET_CHARACTER_SEARCH_RANKING(state, {data}) {
    state.CharacterSearchRanking = data
  },
}

export const actions = {
  GET_COMPOSITION({ commit }, searchRankingNum) {
    return getCompositionPageViews()
      .then((data) => {
        // console.log('GET_COMPOSITION',data)
        const newData = data
          .sort((a, b) => a.pageView - b.pageView).reverse()
          .map(({ name, pageView }) => ({ [name]: pageView }))

        commit(`SET_COMPOSITION`, {data: newData})
        if(searchRankingNum) {
          const newDataSearchRanking = [...newData].splice(0, searchRankingNum)
          commit(`SET_COMPOSITION_SEARCH_RANKING`, {data: newDataSearchRanking})
        }
        return newData
      })
      .catch(error => console.error('GET_COMPOSITION', error))
  },
  GET_CHARACTER({ commit }, searchRankingNum) {
    return getCharacterPageViews()
      .then((data) => {
        // console.log('GET_Character',data)
        const newData = data
          .sort((a, b) => a.pageView - b.pageView).reverse()
          .map(({ name, pageView }) => ({ [name]: pageView }))

        commit(`SET_CHARACTER`, {data: newData})
        if(searchRankingNum) {
          const newDataSearchRanking = [...newData].splice(0, searchRankingNum)
          commit(`SET_CHARACTER_SEARCH_RANKING`, {data: newDataSearchRanking})
        }
        return newData
      })
      .catch(error => console.error('GET_Character', error))
  },
}