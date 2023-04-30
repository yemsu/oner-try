export const gradesDef = {
  special: '스페셜',
  uncommon: '언커먼',
  common: '커먼'
}
export const gradeScoresDef = {
  special: 3,
  uncommon: 2,
  common: 1,
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
  hp: 110,
  adt: 0,
  maxD: 100,
  ct: 1,
  dr: 0,
  minD: 100,
  dct: 1,
  ctD: 200,
  ss: 100,
  ms: 500,
  cd: 0,
  df: 1,
  ev: 0,
  str: 1,
  dex: 9,
  int: 1,
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
  sailors: 6,
  equipments: 6,
  colleagues: 3,
  ship: 1,
  ryuo: 1
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