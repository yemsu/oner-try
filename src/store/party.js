import {
  getChatRooms,
  getChatRoom,
  postChatRoom,
  deleteChatRoom,
  postMember,
  putMember,
  deleteMember,
  deleteChatUser,
  putChatRoom,
  getRoomTypes,
  getUserChatRoom,
  getMembers,
 } from '@/api/party'
 import { checkAdmin } from '@/plugins/utils/index'

export const state = () => ({
  allMembers: [],
  chatRooms: null,
  chatRoom: null,
  roomTypes: [],
  disconnectedMembers: [],
  isMinimize: false
})

export const getters = {
  getAllMembers: (state) => state.allMembers,
  getChatRooms: (state) => state.chatRooms,
  getChatRoom: (state) => state.chatRoom,
  getRoomTypes: (state) => state.roomTypes,
  getDisconnectedMembers: (state) => state.disconnectedMembers,
  getIsMinimize: (state) => state.isMinimize,
}

export const mutations = {
  SET_ALL_MEMBERS(state, data) {
    // console.log("SET_CHAT_RROMS", data)
    state.allMembers = data
  },
  SET_CHAT_ROOMS(state, data) {
    state.chatRooms = data
  },
  ADD_CHAT_ROOM(state, data) {
    if(!state.chatRooms) state.chatRooms = []
    state.chatRooms.unshift(data)
    // console.log('ADD_CHAT_ROOM',  state.chatRooms)
  },
  SET_CHAT_ROOM(state, data) {
    if(data) {
      const members = sortingMembers(data.members, data.host)
      // console.log("SET_CHAT_RROMS", data)
      state.chatRoom = { ...data, members }
    } else {
      state.chatRoom = data
    }
  },
  SET_MEMBER(state, members) {
    state.chatRoom.members = members
  },
  ADD_DISCONNECTED_MEMBER(state, peerId) {
    state.disconnectedMembers = [...state.disconnectedMembers, peerId]
  },
  REMOVE_DISCONNECTED_MEMBER(state, peerId) {
    state.disconnectedMembers = state.disconnectedMembers
    .filter((_peerId) => _peerId !== peerId)
  },
  ADD_MEMBER(state, memberObj) {
    if(!state.chatRoom || checkAdmin(memberObj.nickname)) return
    console.log('state.chatRoom', state.chatRoom)
    state.chatRoom.members = [...state.chatRoom.members, memberObj]
  },
  DELETE_MEMBER_STATE(state, memberNick) {
    console.log('DELETE_MEMBER_STATE', memberNick)
    if(!state.chatRoom) return
    state.chatRoom.members = state.chatRoom.members
      .filter(({ nickname }) => nickname !== memberNick)
  },
  CHANGE_MEMBER_PEERID(state, { memberNick, peerId }) {
    state.chatRoom.members = state.chatRoom.members
      .reduce((result, member) => {
        if(member.nickname === memberNick) {
          member.peerId = peerId
        }
        return [...result, member]
      }, [])
    console.log('CHANGE_MEMBER_PEERID1', state.chatRoom.members)
  },
  CHANGE_CHAT_ROOM(state, obj) {
    state.chatRoom = {
      ...state.chatRoom,
      ...obj
    }
  },
  SET_ROOM_TYPES(state, data) {
    state.roomTypes = data
  },
  SET_IS_MINIMIZE(state, data) {
    state.isMinimize = data
  },
}

export const actions = {
  async GET_ALL_MEMBERS({ commit }) {
    const { result, error } = await getMembers()    
    if(error || !result) {
      console.log('GET_ALL_MEMBERS ERROR', error)
      return false
    }
    console.log('GET_ALL_MEMBERS', result)
    commit('SET_ALL_MEMBERS', result)
    return result
  },
  async GET_CHAT_ROOMS({ commit }, params) {
    const { result, error } = await getChatRooms(params)    
    if(error) {
      console.error(`CANNOT GET_CHAT_ROOMS`, error)
      alert('멤버 업데이트에 실패했습니다! 새로 고침을 해주세요.')
      return false
    }

    const newData = result
      .filter(({members}) => members && members.length)
      .map(chatRoom => ({
        ...chatRoom,
        members: chatRoom.members.filter(member => !checkAdmin(member.nickname))
      }))

    commit('SET_CHAT_ROOMS', newData)
    return result
  },
  async GET_CHAT_ROOM({ commit }, queryId) {
    const { result, error } = await getChatRoom(queryId)    
    if(error) {
      console.error(`CANNOT GET_CHAT_ROOM`, error)
      return false
    } 
    
    commit('SET_CHAT_ROOM', result)
    return true
  },
  async POST_CHAT_ROOM({ commit }, chatRoom) {
    console.log('POST_CHAT_ROOM', chatRoom)
    const { result, error } = await postChatRoom({
      ...chatRoom, 
      gameType: 'oner'
    })
    if(error) {
      console.error(`CANNOT POST_CHAT_ROOM: ${error.msg}`)
      if(error.msg === '이미 입장한 유저입니다.') {
        return true
      }
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
  async POST_MEMBER({ commit }, { chatRoomId, peerId }) {
    const { result, error } = await postMember(chatRoomId, peerId)
    console.log('POST_MEMBER', result)
    if(error) {
      console.log('CANNOT POST_MEMBER:', peerId, error)
      return error
    }
    commit('ADD_MEMBER', result)
    return result 
  },
  async PUT_MEMBER({ commit }, member) {
    const { result, error } = await putMember(member)
    console.log('PUT_MEMBER', result)
    if(error) {
      console.log('CANNOT PUT_MEMBER:', error)
      return error
    }
    return result 
  },
  async DELETE_MEMBER({ commit }, { id, siteNick }) {
    const { result, error } = await deleteMember(id, siteNick)
    if(error) {
      console.error(`CANNOT DELETE_MEMBER: ${error.msg}`)
      return false
    }
    console.log('DELETE_MEMBER', result)
    commit('DELETE_MEMBER_STATE', siteNick)
    return true
  },
  async DELETE_CHAT_USER({ commit }, siteNick) {
    const { result, error } = await deleteChatUser(siteNick)
    if(error) {
      console.error(`CANNOT DELETE_CHAT_USER: ${error.msg}`)
      return false
    }
    console.log('DELETE_CHAT_USER', siteNick, result)
    return true
  },
  async PUT_CHAT_ROOM({ commit }, { chatRoom, updateState = true }) {
    const { result, error } = await putChatRoom({
      ...chatRoom,
      gameType: 'oner'
    })
    if(error) {
      console.error('PUT_CHAT_ROOM ERROR', {error})
      return false
    }
    console.log('PUT_CHAT_ROOM', result)
    updateState && commit('SET_CHAT_ROOM', result)
    return result
  },
  async GET_ROOM_TYPES({ commit }) {
    const { result, error } = await getRoomTypes()    
    if(error) {
      alert(this.$ALERTS.CHAT.GET_ROOM_TYPE_FAIL)
      return false
    }
    // console.log('GET_ROOM_TYPES', result)
    commit('SET_ROOM_TYPES', result)
    return result
  },
  async GET_USER_CHAT_ROOM({ commit }, siteNick) {
    const { result, error } = await getUserChatRoom(siteNick)    
    if(error || !result) {
      console.log('GET_USER_CHAT_ROOM ERROR', error)
      return false
    }
    console.log('GET_USER_CHAT_ROOM', result)
    // commit('SET_ROOM_TYPES', result)
    return result
  },
}

function sortingMembers(members, hostNick) {
  return members
    .filter(({nickname}) => (!checkAdmin(nickname)))
    .sort((a, b) => {
      const getIndex = (member) => {
        return member.nickname === hostNick
          ? 0
          : member.id
      }
      return getIndex(a) - getIndex(b)
    })
}