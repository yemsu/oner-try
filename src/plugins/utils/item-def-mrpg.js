export const equipmentsPropNames = {
  dropMonster: '드랍',
  grade: '장비등급',
  ingredients: '재료',
  level: 'Lv.',
  name: '아이템명',
  option: '옵션',
  active: '액티브',
  dedicatedOption: '직업 전용',
  passive: '패시브',
  type: '유형'
}

export const itemsHasSubTitle = [
  'active', 'dedicatedOption', 'passive'
]

export const itemTypeNames = {
  staff: '[마법]',
  ring: '[반지]',
  sub: '[보조]'
}

export const itemDetailInfoOrder = [
  'type', 'option', 'level', 'grade', 'dedicatedOption', 'passive', 'active', 'dropMonster', 'ingredients'
]

export const optionOrder = [
  'at', 'int', 'hp', 'as', 'all', 'df', 'hr', 'mr', 'ev', 'ms', 'pre', 'mre', 'str', 'agi', 'actd', 'dmg'
]

export const totalOptions = {
  at: '공격력',
  int: '지능',
  hp: '생명력',
  as: '공격속도',
  all: '올스탯',
  df: '방어력',
  hr: '생명 회복속도',
  mr: '마나 회복속도',
  ev: '회피율',
  ms: '이동속도',
  pre: '물리 저항력',
  mre: '마법 저항력',
  str: '힘',
  agi: '민첩', 
  actd: '물리 치명타 피해량',
  dmg: '피해량',
  mp: '마나'
}

export const percentOptions = ['as', 'ev', 'pre', 'mre', 'actd', 'dmg']

export const characterDefs = [
  {
    mainStat: 'int',
    characters: [
      { name: '유클레이스', job: '사령술사' },
      { name: '모리스', job: '점성술사' },
      { name: '알리시아', job: '성직자' },
      { name: '미아', job: '소환사' },
      { name: '엘레나', job: '인형사' },
      { name: '세실리아', job: '드루이드' },
      { name: '레스티나', job: '마법사(어둠)' },
      { name: '샬롯', job: '마법사 번개' },
      { name: '세리스', job: '마법사 얼음' },
      { name: '일루시아', job: '마법사 화염' },
      { name: '엘시아', job: '원소술사' },
    ]
  },
  {
    mainStat: 'agi',
    characters: [
      { name: '샤르티아', job: '무도가' },
      { name: '오피스', job: '격투가' },
      { name: '사쿠야', job: '싸움꾼' }, 
      { name: '비스체', job: '어쌔신' },
      { name: '실프', job: '검성' },
      { name: '메이미트', job: '기계공' },
      { name: '르무', job: '거너' },
      { name: '아이리스', job: '저격수' },
      { name: '루미나스', job: '궁수' }
    ]
  },
  {
    mainStat: 'str',
    characters: [
      { name: '이리스', job: '살육자' },
      { name: '리스타', job: '배틀메이지' },
      { name: '루리아', job: '수호자' },
      { name: '카미시아', job: '검혼' },
      { name: '시리스', job: '광전사' },
      { name: '베아트리스', job: '성기사' },
      { name: '이피아', job: '죽음의 기사' },
    ]
  }
]