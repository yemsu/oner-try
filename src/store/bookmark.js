import { getUserBookmarks } from "@/plugins/utils/https"

export const state = () => ({
  userItemBookmarks: [],
})

export const getters = {
  getUserItemBookmarks: (state) => state.userItemBookmarks,
}

export const mutations = {
  SET_USER_ITEM_BOOKMARKS(state, data) {
    state.userItemBookmarks = data
  },
}

export const actions = {
  async GET_USER_ITEM_BOOKMARKS({ commit, rootState, dispatch }) {
    const { item: { items } } = rootState
    if(items.length === 0) await dispatch('item/GET_ITEMS','', { root: true })

    const bookmarkTargets = await getUserBookmarks({ category: 'item' })
    console.log('bookmarkTargets', bookmarkTargets)
    const bookmarks = bookmarkTargets.map(({ target }) => (
      rootState.item.items.find(({ id }) => target === id)
    ))
    
    commit(`SET_USER_ITEM_BOOKMARKS`, bookmarks)
    return bookmarks
  }
}