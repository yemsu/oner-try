import { postItemBuild } from "@/plugins/utils/https"
import ALERTS from "@/constants/ALERTS"

export const state = () => ({
  itemBuild: [],
})

export const getters = {
  getItemBuild: (state) => state.itemBuild,
}

export const mutations = {
  SET_ITEM_BUILD(state, data) {
    state.userItemBookmarks = data
  },
}

export const actions = {
  async POST_ITEM_BUILD({}, itemBuild) {
    const res = await postItemBuild(itemBuild)
    if(!res) {
      alert(ALERTS.ITEM_SETTING.FAIL)
      return false
    }
    alert(ALERTS.ITEM_SETTING.SUCCESS)
    return true
  },
}