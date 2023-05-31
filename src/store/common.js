export const state = () => ({
  isLoading: false,
})

export const getters = {
  getIsLoading: (state) => state.isLoading,
}

export const mutations = {
  SET_IS_LOADING(state, data) {
    state.isLoading = data
  },
}

export const actions = {
}