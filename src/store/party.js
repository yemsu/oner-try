import {
  getChatRooms,
  getChatRoom,
  postChatRoom,
  deleteChatRoom,
  postMember,
  deleteMember,
 } from '@/api/party'

export const state = () => ({
  chatRooms: null,
  chatRoom: null,
})

export const getters = {
  getChatRooms: (state) => state.chatRooms,
  getChatRoom: (state) => state.chatRoom,
}

export const mutations = {
  SET_CHAT_ROOMS(state, data) {
    console.log("SET_CHAT_RROMS", data)
    state.chatRooms = data
  },
  ADD_CHAT_ROOM(state, data) {
    if(!state.chatRooms) state.chatRooms = []
    state.chatRooms.unshift(data)
    // console.log('ADD_CHAT_ROOM',  state.chatRooms)
  },
  SET_CHAT_ROOM(state, data) {
    state.chatRoom = data
  },
  SET_MEMBER(state, members) {
    state.chatRoom.members = members
  },
  ADD_MEMBER(state, memberObj) {
    state.chatRoom.members = state.chatRoom.members.concat([memberObj])
  },
  DELETE_MEMBER(state, memberNick) {
    console.log('DELETE_MEMBER', memberNick)
    state.chatRoom.members = state.chatRoom.members
      .filter(({ nickname }) => nickname !== memberNick)
  },
  CHANGE_HOST(state, memberNick) {
    state.chatRoom.host = memberNick
  }
}

export const actions = {
  async GET_CHAT_ROOMS({ commit }) {
    const { result, error } = await getChatRooms()    
    if(error) {
      const exception = new Error(`CANNOT GET_CHAT_ROOMS : ${error.msg}`)
      throw exception
    }
    // console.log('GET_CHAT_ROOMS', result)
    commit('SET_CHAT_ROOMS', result)
  },
  async GET_CHAT_ROOM({ commit }, queryId) {
    const { result, error } = await getChatRoom(queryId)    
    if(error) {
      console.error(`CANNOT GET_CHAT_ROOM : ${error.msg}`)
      return false
    } 
    // console.log('GET_CHAT_ROOM', result)
    commit('SET_CHAT_ROOM', result)
    return true
  },
  async POST_CHAT_ROOM({ commit }, chatRoom) {
    const { result, error } = await postChatRoom(chatRoom)
    if(error) {
      if(error.msg === '이미 입장한 유저입니다.') {
        return true
      }
      console.error(`CANNOT POST_CHAT_ROOM: ${error.msg}`)
      return false
    }
    commit('ADD_CHAT_ROOM', chatRoom)
    return result
  },
  async DELETE_CHAT_ROOM({ commit }, id) {
    const { result, error } = await deleteChatRoom(id)
    if(error) {
      const exception = new Error(`CANNOT DELETE_CHAT_ROOM: ${error.msg}`)
      throw exception
    }
    // console.log('DELETE_CHAT_ROOM', id)
  },
  async POST_MEMBER({ commit }, id) {
    const { result, error } = await postMember(id)
    if(error) {
      throw new Error(`CANNOT POST_MEMBER: ${error.msg}`)
    }
    // console.log('POST_MEMBER', result)
    commit('ADD_MEMBER', result)
  },
  async DELETE_MEMBER({ commit }, id) {
    const { result, error } = await deleteMember(id)
    if(error) {
      console.error(`CANNOT DELETE_MEMBER: ${error.msg}`)
      return false
    }
    // console.log('DELETE_MEMBER', result)
    commit('DELETE_MEMBER', result.nickname)
    return true
  },
  async PATCH_HOST({ commit }, { id, host }) {
    const { result, error } = await patchChatRoom({
      id,
      payload: { host }
    })
    if(error) {
      throw new Error(`CANNOT PATCH_HOST: ${error.msg}`)
    }
    commit('CHANGE_HOST', host)
  }
}