export const state = () => ({
  message: '',
  isTriggerOn: false
})

export const getters = {
  getMessage: (state) => state.message,
  getIsTriggerOn: (state) => state.isTriggerOn,
}

export const mutations = {
  SET_MESSAGE(state, data) {
    if(!state.message === data) return
    state.message = data
  },
  SET_IS_TRIGGER_ON(state, data) {
    state.isTriggerOn = data
  },
}

export const actions = {
}