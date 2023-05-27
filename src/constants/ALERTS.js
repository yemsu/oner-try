import Vue from "vue"

const FAIL_COMMON = '문제가 지속될 시 개발자에게 문의해주세요.'
const SUCCESS_EMOJI = '✅'

const ALERTS = {
  NEED_LOGIN: '로그인 해주세요!',
  VALIDATIONS: {
    TITLE: '📌 제목을 입력해 주세요.',
    CHARACTER: '📌 캐릭터를 선택해 주세요.',
    ITEM: '📌 아이템을 선택해 주세요.',
    MAX_PEOPLE_NUM: '📌 최대 인원을 선택해 주세요',
    CATEGORY: '📌 분류를 선택해 주세요',
  },
  REFRESH_LIST_SUCCESS: '리스트가 업데이트 되었습니다.',
  ITEM_SETTING: {
    SAVE_SUCCESS: `${SUCCESS_EMOJI} 빌드가 저장되었습니다.`,
    SAVE_FAIL: `빌드 저장에 실패하였습니다. ${FAIL_COMMON}`,
    OVER_SLOT: (slotNumber) => `최대 ${slotNumber}개까지 선택하실 수 있습니다.`,
    GET_FAIL: `빌드를 가져오지 못하였습니다. ${FAIL_COMMON}`,
    GET_LIST_FAIL: `빌드 리스트 가져오지 못하였습니다. ${FAIL_COMMON}`,
    DELETE_FAIL: `빌드 삭제에 실패하였습니다. ${FAIL_COMMON}`,
    DELETE_SUCCESS: `${SUCCESS_EMOJI} 빌드가 삭제되었습니다.`,
    DELETE_CONFIRM: `빌드를 삭제하시겠습니까?`,
    CLIPBOARD_SUCCESS: `${SUCCESS_EMOJI} 빌드 이미지가 클립보드에 저장되었습니다.`,
    CLIPBOARD_FAIL: '빌드 이미지 클립보드 저장에 실패하였습니다.',
    EDIT_SAVE_SUCCESS: `${SUCCESS_EMOJI} 빌드가 수정되었습니다.`,
    EDIT_SAVE_FAIL: `빌드 수정에 실패하였습니다. ${FAIL_COMMON}`,
  },
  CHAT: {
    CREATE_FAIL: `채팅 방 생성에 실패하였습니다. ${FAIL_COMMON}`,
    CONFIRM_END: '파티 찾기를 종료하시겠습니까?',
    NO_ROOM: '존재하지 않는 파티 찾기 방입니다.',
    EDIT_TITLE_SUCCESS: `${SUCCESS_EMOJI} 타이틀이 수정되었습니다.`,
    CONFIRM_KICK_OUT: (nickname) => `${nickname}님을 파티에서 제외하시겠습니까?`,
    KICK_OUT: `파티에서 제외되었습니다.`,
    KICK_OUT_WHO: (nickname) => `${nickname}님이 파티에서 제외되었습니다.`,
    GET_ROOM_TYPE_FAIL: `파티 타입 호출에 실패하였습니다.`,
    PARTY_FULL: '파티가 가득 찼어요!',
    USER_ALREADY_HAS_PARTY: '한번에 1개의 파티에 입장할 수 있습니다.',
    USER_EXISTED: '이미 파티에 입장한 상태예요!\n새로운 파티에 참여 하시겠어요?\n기존 파티에서는 제외됩니다.',
    LEAVE_PREV_CHATROOM: '기존 채팅방에서 나왔습니다.',
    BLOCK_DIRECT_ROOM: '잘못된 접근입니다!',
  },
}


Vue.prototype.$ALERTS = ALERTS

export default ALERTS