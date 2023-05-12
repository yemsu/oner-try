export const itemTypeDefs = [
  {
    title: "장비",
    type: "equipment",    
  },
  {
    title: "선원",
    type: "sailor",    
  },
  // {
  //   title: "동료",
  //   type: "colleague",
  // },
  {
    title: "선박",
    type: "ship",
  },
  // {
  //   title: "류오",
  //   type: "ryuo",
  // },
]
export const gradesDef = {
  special: '스페셜',
  uncommon: '언커먼',
  common: '커먼',
  legend: '레전드',
  // epic: '에픽',
  // rare: '레어',
  normal: '노말',
  dedicated: '전용무기',
}
export const sailorGrades = ['special', 'uncommon', 'common']
export const equipmentGrades = ['legend', 'normal', 'dedicated']
export const gradeScoresDef = {
  special: 3,
  uncommon: 2,
  common: 1,
}
export const EquipmentGradeScoresDef = {
  legend: 4,
  epic: 3,
  rare: 2,
  normal: 1,
  dedicated: 0,
}
export const heroDefaultHp = {
  tashigi: 90,
  raw: 110,
  yamato: 180,
  luffy: 170,
  kid: 150,
  ace: 100,
  baby: 80,
  nami: 90
}
export const equipDropOrder = [
  '후지토라', '클리크 해적단', '쿠로네코 해적단', '유령선', '부들 조합', '버기', '모건', '알비다', '반 더 데켄', '어인섬', '해군', '딜러형 전용무기', '파괴형 전용무기', '밸런스형 전용무기'
]
export const equipmentGradeTypes = [
  ['황금빛'],
  ['흔함', '귀함', '유명함', '완벽함'],
  ['+0', '+1', '+2', '+3', '+4', '+5'],
  ['잡검', '예검', '양검', '명검'],
]
export const equipmentGradeTypeExceptions = ['황금빛']

/*
hp: 체력
gdr: 받는 피해 감소
df: 막기 확률
ev: 회피 확률
평타 속도
ss: 스킬 속도
adt: 추가 피해량
maxD: 최대 피해량
ct: 피해치명타 확률
ctD: 치명타 피해량
피해량 증폭
dr: 추가 파괴량,
maxDr: 최대 파괴량
dct: 파괴치명타 확률
ctDr: 치명타 파괴량
파괴량 증폭
cd: 스킬 쿨타임 감소
mcd: 이동기 쿨타임 감소
ms: 이동속도
*/

export const optionOrder = [
  'hp', 'gdr', 'df', 'ev', 'ss', 'adt', 'maxD', 'ct', 'ctD', 'dr', 'maxDr', 'dct', 'ctDr', 'cd', 'mcd', 'ms'
]

export const optionDefaultValue = {
  hp: 90,
  adt: 0,
  maxD: 0,
  ct: 0,
  dr: 0,
  minD: 0,
  dct: 0,
  ctD: 0,
  ss: 0,
  ms: 0,
  cd: 0,
  df: 0,
  ev: 0,
  str: 0,
  dex: 0,
  int: 0,
  gdr: 0,
  maxDr: 0,
  mcd: 0,
  ctDr: 0,
}
export const equipOnlyOptionsDef = {
  str: '견문색',
  dex: '무장색',
  int: '패왕색',
}
export const colosseumOptions = {
 at: '공격력',
 as: '공격속도'
}
export const noEquipOptions = {
  hp: '체력',
  gdr: '받는 피해 감소',
  df: '막기 확률',
  ev: '회피 확률',
  ss: '스킬 속도',
  adt: '추가 피해량',
  maxD: '최대 피해량',
  ct: '피해치명타 확률',
  ctD: '치명타 피해량',
  dr: '추가 파괴량',
  maxDr: '최대 파괴량',
  dct: '파괴치명타 확률',
  ctDr: '치명타 파괴량',
  cd: '스킬 쿨타임 감소',
  mcd: '이동기 쿨타임 감소',
  ms: '이동속도',
}
export const slotNumbers = {
  sailor: 6,
  equipment: 6,
  colleague: 3,
  ship: 1,
  ryuo: 1
}
export const canEnhance = (item) => {
  if(!item) return false
  const commonCase = ['sailor', 'ship'].includes(item.type)
  const falseCase1 = item.name !== '통통배'
  const trueCase1 = item.grade === 'dedicated'

  return (commonCase && falseCase1) || trueCase1
}
export const maxStack = (item) => {
  return item.name === '고잉 메리호' ? 10 
    : item.grade === 'dedicated' ? 100
    : 50
}
export const valueByStack = (item, value, stack) => {
  const valueByEachStack = item.grade === 'dedicated' ? 0.5 : (value / 20)
  return value + (valueByEachStack * stack)
} 

export const noUnitOptions = ['hp', 'po', 'ms', 'str', 'dex', 'int']
export const gradesMap = new Map(Object.entries(gradesDef))
export const equipmentsOnlyOptionsMap = new Map(Object.entries(equipOnlyOptionsDef))
export const noEquipOptionsMap = new Map(Object.entries(noEquipOptions))
export const colosseumOptionsMap = new Map(Object.entries(colosseumOptions))
const totalOptions = () => {
  const totalOptions = new Map([...noEquipOptionsMap, ...colosseumOptionsMap])
  for(const [key, value] of equipmentsOnlyOptionsMap) {
    totalOptions.set(key, value)
  }
  return totalOptions
}
export const optionsMap = totalOptions()