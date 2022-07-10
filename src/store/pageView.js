
import {
  getCompositionPageViews,
} from '@/plugins/utils/https'

export const state = () => ({
  composition: [],
  CompositionSearchRanking: []
})

export const getters = {
  getComposition(state) {
    return state.composition
  },
  getCompositionSearchRanking(state) {
    return state.CompositionSearchRanking
  },
}

export const mutations = {
  SET_COMPOSITION(state, {data}) {
    state.composition = data
  },
  SET_COMPOSITION_SEARCH_RANKING(state, {data}) {
    state.CompositionSearchRanking = data
  },
}

export const actions = {
  GET_COMPOSITION({ commit, rootState }, searchRankingNum) {
    return getCompositionPageViews()
      .then(({data}) => {
        // console.log('GET_COMPOSITION',data)
        const newData = data
          .sort((a, b) => a.pageView - b.pageView).reverse()
          .map(({ name, pageView }) => ({ [name]: pageView }))

        console.log('rootstate', rootState)
        commit(`SET_COMPOSITION`, {data: newData})
        if(searchRankingNum) {
          const newDataSearchRanking = [...newData].splice(0, searchRankingNum)
          commit(`SET_COMPOSITION_SEARCH_RANKING`, {data: newDataSearchRanking})
        }
        return newData
      })
      .catch(error => console.log('GET_COMPOSITION', error))
  },
}