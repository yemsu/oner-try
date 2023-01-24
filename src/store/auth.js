export const state = () => ({
  isLogin: false,
  userNick: '',
})

export const getters = {
  getIsLogin: (state) => state.isLogin,
  getUserNick: (state) => state.userNick,
}

export const mutations = {
  SET_IS_LOGIN(state, data) {
    state.isLogin = data
  },
  SET_USER_NICK(state, data) {
    state.userNick = data
  },
}

export const actions = {
  GET_USER_NICK({ commit }, payload) {

  }
}