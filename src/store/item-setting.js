import { getItemSettings, postItemSetting } from '@/plugins/utils/https-mrpg'

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
  async GET_ITEM_SETTING_LIST({ commit }) {    
    try {
      const res = await getItemSettings()
      console.log('res', res)
      if(!data) console.error('GET_ITEM_SETTING_LIST', err)
      const itemSettingList = data
        .filter(({items}) => items)
      for(const itemSetting of itemSettingList) {
        itemSetting.items = JSON.parse(itemSetting.items)
      }
      // console.log('GET_ITEM_SETTING_LIST', itemSettingList)
      commit('SET_ITEM_SETTING_LIST', itemSettingList)
    } catch (e) {
      console.error('SET_ITEM_SETTING_LIST', e)
    }
  },
  async POST_ITEM_SETTING(data) {
    const stringifiedItems = JSON.parse(JSON.stringify(data))
    data.items = JSON.stringify(data.items)
    const res = await postItemSetting(stringifiedItems)
    console.log('POST_ITEM_SETTING res', res)
  }
}