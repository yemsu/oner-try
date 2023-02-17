import { getItemSettings, postItemSetting, deleteItemSetting } from '@/plugins/utils/https-mrpg'

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
    console.log('ADD_ITEM_SETTING', data)
    state.itemSettingList.push(data)
  },
  DELETE_ITEM_SETTING(state, id) {
    state.itemSettingList = state.itemSettingList.filter(({ id: _id }) => _id !== id)
  }
}

export const actions = {
  async GET_ITEM_SETTING_LIST({ commit }) {    
    try {
      const { result } = await getItemSettings()
      console.log('GET_ITEM_SETTING_LIST: result:', result)
      const newResult = itemsParser(result)
      commit('SET_ITEM_SETTING_LIST', newResult)
    } catch (e) {
      console.error('SET_ITEM_SETTING_LIST', e)
    }
  },
  async POST_ITEM_SETTING({ commit }, data) {
    if(!data.items) {
      throw new Error('POST_ITEM_SETTING: no items data!')
    }
    try {
      const stringifiedItems = itemsStringify(data)
      const { result } = await postItemSetting(stringifiedItems)
      console.log('POST_ITEM_SETTING: result:', result)
      const newResult = itemsParser(result)
    } catch(e) {
      console.error('POST_ITEM_SETTING', e)
    }
  },
  async DELETE_ITEM_SETTING({ commit }, id) {
    try {
      // console.log('DELETE_ITEM_SETTING:', context, id)
      await deleteItemSetting(id) // delete는 return 값 없음.
      commit('DELETE_ITEM_SETTING', id)
    } catch(e) {
      console.error('DELETE_ITEM_SETTING', e)
    }
  },
}

function itemsStringify(itemSetting) {
  // items는 string으로 서버에 저장됨. stringify 후 전송
  const result = JSON.parse(JSON.stringify(itemSetting)) // store state 값이라 deep clone
  result.items = JSON.stringify(result.items)
  return result
}

function itemsParser(itemSettings) {
  const isArray = Array.isArray(itemSettings)
  const result = isArray ? itemSettings : [itemSettings]
    // items는 string으로 서버에 저장됨. parsing 후 사용
  for(const itemSetting of result) {
    itemSetting.items = JSON.parse(itemSetting.items)
  }  
  return isArray ? result : result[0]
}