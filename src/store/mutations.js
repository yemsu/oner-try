export default {
  SET_ITEMS(state, {type, data}) {
    state[type] = data
  },
  SET_SAILORS(state, {type, data}) {
    state[type] = data
  },
  SET_ETC_ITEMS(state, {type, data}) {
    state[type] = data
  },
  SET_CHARACTERS(state, {type, data}) {
    state[type] = data
  },
  SET_NICKNAME(state, payload) {
    state.nickName = payload
  },
  SET_EQUIPMENTS(state, {type, data}) {
    state[type] = data
  },
  SET_HEROS(state, {type, data}) {
    const newData = data.map(hero => Object.assign(hero, {type: 'hero'}))
    state[type] = newData
  },
  SET_COLLEAGUES(state, {type, data}) {
    const newData = data.map(colleague => Object.assign(colleague, {type: 'colleague'}))
    state[type] = newData
  },
  SET_GAME_USERS(state, {type, data}) {
    state[type] = data
  },
}