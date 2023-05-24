import Https from "@/plugins/utils/https-new"
const $axios = new Https('chat-rooms')

export const getChatRooms = (params) => {
  return $axios.get(null, params)
}
export const getChatRoom = (chatRoomId) => {
  return $axios.get(`/${chatRoomId}`)
}
export const deleteChatRoom = (chatRoomId) => {
  return $axios.delete(`/${chatRoomId}`)
}
export const postChatRoom = (payload) => {
  return $axios.post(null, payload)
}
export const postMember = (chatRoomId) => {
  return $axios.post(`/${chatRoomId}/members`)
}
export const deleteMember = (chatRoomId, siteNick) => {
  return $axios.delete(`/${chatRoomId}/${siteNick}`)
}
export const putChatRoom = (chatRoom) => {
  return $axios.put(`/${chatRoom.id}`, chatRoom)
}
export const getRoomTypes = () => {
  return $axios.get(`/room-types`)
}