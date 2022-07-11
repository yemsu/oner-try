export const gradesDef = {
  legend: '레전드',
  epic: '에픽',
  rare: '레어',
  normal: '노말',
}
export const equipOnlyOptionsDef = {
  str: '견문색',
  dex: '무장색',
  int: '패왕색',
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
  cd: '재사용 대기시간 감소',
  po: '생활포인트 획득량',
  ms: '이동속도'
}
export const gradesMap = new Map(Object.entries(gradesDef))
export const equipmentsOnlyOptionsMap = new Map(Object.entries(equipOnlyOptionsDef))
export const noEquipOptionsMap = new Map(Object.entries(noEquipOptions))
const totalOptions = () => {
  const totalOptions = new Map([...noEquipOptionsMap])
  for(const [key, value] of equipmentsOnlyOptionsMap) {
    totalOptions.set(key, value)
  }
  return totalOptions
}
export const optionsMap = totalOptions()