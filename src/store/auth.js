import { getUserInfo } from "@/plugins/utils/https"

export const state = () => ({
  isLogin: false,
  userInfo: {},
})

export const getters = {
  getIsLogin: (state) => state.isLogin,
  getUserInfo: (state) => state.userInfo,
}

export const mutations = {
  SET_IS_LOGIN(state, data) {
    state.isLogin = data
  },
  SET_USER_INFO(state, data) {
    console.log('SET_USER_INFO', data)
    state.userInfo = Object.assign({}, data)
  },
}

export const actions = {
  GET_USER_INFO({ commit }, jToken) {
    return getUserInfo(jToken)
      .then((data) => {
        if(data === 'expired token') return false

        commit(`SET_USER_INFO`, data)
        return data
      })
      .catch(error => console.log('user/GET_USER_INFO', error))
  }
}