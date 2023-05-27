export const state = () => ({
  isVisible: false,
  content: {
    title: '',
    message: '',
  }
})

export const getters = {
  getIsVisible: (state) => state.isVisible,
  getContent: (state) => state.content,
}

export const mutations = {
  TOGGLE_IS_VISIBLE(state) {
    state.isVisible = !state.isVisible
  },
  SET_CONTENT(state, data) {
    state.content = data
  },
}

export const actions = {
}