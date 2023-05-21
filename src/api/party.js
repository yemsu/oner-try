import Https from "@/plugins/utils/https-new"
const $axios = new Https('chat-rooms')

export const getChatRooms = () => {
  return $axios.get()
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
export const putChatRoom = ({ id, payload }) => {
  return $axios.put(`/${id}`, payload)
}