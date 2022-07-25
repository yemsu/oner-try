export const gradesDef = {
  legend: '레전드',
  epic: '에픽',
  rare: '레어',
  normal: '노말',
}
export const hpDefaultValueByHero = {
  tashigi: 90,
  raw: 110,
  yamato: 180,
  luffy: 170,
  kid: 150,
  ace: 100,
  baby: 80,
  nami: 90
}
export const optionOrderArr = [
  'adt', 'maxD', 'ct', 'dr', 'minD', 'dct', 'ctD', 'ss', 'ms', 'cd', 'df', 'ev', 'str', 'dex', 'int', 'hp'
]
export const equipDropOrder = [
  '후지토라', '클리크 해적단', '쿠로네코 해적단', '유령선', '부들 조합', '버기', '모건', '알비다', '반 더 데켄', '어인섬', '해군', '딜러형 전용무기', '파괴형 전용무기', '밸런스형 전용무기'
]
export const equipmentGradeTypes = [
  ['황금빛'],
  ['흔함', '귀함', '유명함', '완벽함'],
  ['+0', '+1', '+2', '+3', '+4', '+5'],
  ['잡검', '예검', '양검', '명검'],
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
export const gradeScoresDef = {
  legend: 4,
  epic: 3,
  rare: 2,
  normal: 1,
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
  ct: '치명타 확률',
  ctD: '치명타 피해량',
  dct: '파괴치명타 확률',
  ss: '스킬 속도',
  adt: '추가 피해량',
  minD: '최소 피해량',
  maxD: '최대 피해량',
  df: '막기 확률',
  hp: '체력',
  ev: '회피 확률',
  dr: '추가 룬파괴량',
  cd: '쿨타임 감소',
  po: '생활포인트 획득량',
  ms: '이동속도'
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