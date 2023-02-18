import { getItemSettings, postItemSetting, deleteItemSetting, putItemSetting } from '@/plugins/utils/https-mrpg'

export const state = () => ({
  itemSettingList: [],
  checksForView: [],
})

export const getters = {
  getItemSettingList: (state) => state.itemSettingList,
  getChecksForView: (state) => state.checksForView,
}

export const mutations = {
  SET_ITEM_SETTING_LIST(state, data) {
    state.itemSettingList = data
  },
  RESET_ITEM_SETTING_LIST(state) {
    state.itemSettingList = []
  },
  ADD_ITEM_SETTING(state, data) {
    console.log('ADD_ITEM_SETTING', data)
    state.itemSettingList.push(data)
  },
  DELETE_ITEM_SETTING(state, id) {
    state.itemSettingList = state.itemSettingList.filter(({ id: _id }) => _id !== id)
  },
  UPDATE_CHECK_LIST(state, { target, checkList }) {
    let itemSettingIndex = getItemSettingIndex(state.itemSettingList, target)
    console.log('itemSettingIndex', itemSettingIndex, checkList)
    state.itemSettingList[itemSettingIndex].checks = checkList
    console.log('UPDATE_CHECK_LIST',  state.itemSettingList[itemSettingIndex], checkList)
  },
  SET_CHECKS_FOR_VIEW(state, data) {
    state.checksForView = data
  },
  ADD_CHECKS_FOR_VIEW(state, inputId) {
    state.checksForView.push(inputId)
  },
  DELETE_CHECKS_FOR_VIEW(state, inputId) {
    state.checksForView = state.checksForView.filter(id => inputId !== id)
  },

}

export const actions = {
  async GET_ITEM_SETTING_LIST({ commit }) {    
    try {
      const { result } = await getItemSettings()
      console.log('GET_ITEM_SETTING_LIST: result:', result)
      const newResult = valueParser(result)
      commit('SET_ITEM_SETTING_LIST', newResult)
    } catch (e) {
      console.error('SET_ITEM_SETTING_LIST', e)
    }
  },
  async GET_ITEM_SETTING({ commit }) {    
    try {
      const { result } = await getItemSettings()
      console.log('GET_ITEM_SETTING_LIST: result:', result)
      const newResult = valueParser(result)
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
      const stringifiedItems = stringifyValue(data)
      const { result } = await postItemSetting(stringifiedItems)
      console.log('POST_ITEM_SETTING: result:', result)
      const newResult = valueParser(result)
      commit('ADD_ITEM_SETTING', newResult)
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
  async PUT_ITEM_SETTING({ commit, state }, data) {
    try {
      const stringifiedItems = stringifyValue(data)
      const res = await putItemSetting(stringifiedItems) // delete는 return 값 없음.      
      console.log('PUT_ITEM_SETTING: result:', res)
      // const newResult = valueParser(result)
      // commit('UPDATE_ITEM_SETTING', newResult)
    } catch(e) {
      console.error('UPDATE_ITEM_SETTING', e)
    }
  }
}

function stringifyValue(itemSetting) {
  // items, checks는 string으로 서버에 저장됨. stringify 후 전송
  const result = JSON.parse(JSON.stringify(itemSetting)) // store state 값이라 deep clone
  result.items = JSON.stringify(result.items)
  result.checks = JSON.stringify(result.checks)
  return result
}

function valueParser(itemSettings) {
  const isArray = Array.isArray(itemSettings)
  const result = isArray ? itemSettings : [itemSettings]
    // items는 string으로 서버에 저장됨. parsing 후 사용
  for(const itemSetting of result) {
    itemSetting.items = JSON.parse(itemSetting.items)
    itemSetting.checks = JSON.parse(itemSetting.checks)
  }  
  return isArray ? result : result[0]
}

function getItemSettingIndex(itemSettingList, itemSetting) {
  let itemSettingIndex = null
  for(let i = 0; i < itemSettingList.length; i++) {
    if(itemSettingList[i].id !== itemSetting.id) continue
    itemSettingIndex = i
    break
  }
  return itemSettingIndex
}