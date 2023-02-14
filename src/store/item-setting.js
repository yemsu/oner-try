export const state = () => ({
  itemSettingList: [],
})

export const getters = {
  getItemSettingList: (state) => state.itemSettingList,
}

export const mutations = {
  SET_ITEM_SETTING_LIST(state, data) {
    state.itemSettingList = data
  },
  ADD_ITEM_SETTING(state, data) {
    state.itemSettingList.push(data)
  },
  DELETE_ITEM_SETTING(state, id) {
    state.itemSettingList = state.itemSettingList.filter(({ id: _id }) => _id !== id)
    localStorage.setItem('itemSetting', JSON.stringify(state.itemSettingList))
  },
}

export const actions = {
  GET_ITEM_SETTING_LIST({ commit }) {    
    const savedItemSetting = localStorage.getItem('itemSetting')
    if(!savedItemSetting) return
    commit('SET_ITEM_SETTING_LIST', JSON.parse(savedItemSetting))
  }
}