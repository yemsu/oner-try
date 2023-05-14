const FAIL_COMMON = '문제가 지속될 시 개발자에게 문의해주세요.'

export default {
  NEED_LOGIN: '로그인 해주세요!',
  VALIDATIONS: {
    TITLE: '제목을 입력해 주세요.',
    CHARACTER: '캐릭터를 선택해 주세요.',
    ITEM: '아이템을 선택해 주세요.'
  },
  ITEM_SETTING: {
    SAVE_SUCCESS: '빌드가 저장되었습니다.',
    SAVE_FAIL: `빌드 저장에 실패하였습니다. ${FAIL_COMMON}`,
    OVER_SLOT: (slotNumber) => `최대 ${slotNumber}개까지 선택하실 수 있습니다.`,
    GET_FAIL: `빌드를 가져오지 못하였습니다. ${FAIL_COMMON}`,
    GET_LIST_FAIL: `빌드 리스트 가져오지 못하였습니다. ${FAIL_COMMON}`
  }
}