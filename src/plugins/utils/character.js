import { optionDefaultValue, optionOrder, heroDefaultHp } from '@/plugins/utils/item-def'
export const getCharacterSynergies = (sailors, synergies) => {
  const sailorNames = sailors.filter(sailor => sailor).map(sailor => sailor.name)
  return synergies.filter(synergy => {
    const checkArr = synergy.sailors.map(synergySailor => sailorNames.includes(synergySailor))
    const checkSet = new Set(checkArr)
    const isAllTrue = checkSet.size === 1 && [...checkSet][0]
    // console.log(synergy, checkSet.size === 1, checkSet[0])
    return isAllTrue
  })
}
export const getTotalOption = (character, characterSynergies) => {
  const { equipments, sailors, colleagues, ship, ryuo } = character
  
  const allItem = [...equipments, ...sailors, ...colleagues, ...ship, ...ryuo, ...characterSynergies]
  // console.log('allItem', allItem)
  const allOption = getOptions(allItem)
  // console.log('allOption', allOption)
  const totalOption = Object.keys(optionDefaultValue).reduce((result, key) => {
    const checkOption = allOption[key] || 0
    return Object.assign(result, {[key]: checkOption + defaultOptionBy(character)[key]})
  }, {})
  // console.log('totalOption', totalOption)      
  // ev는 str 수치를 더한다.
  totalOption.ev += totalOption.str

  // dex는 레벨을 더한다.
  totalOption.dex += character.lv

  const result = optionOrder.map(key => ({[key]: totalOption[key]}))
  console.log('result', result)
  return result
}
const defaultOptionBy = (character) => {
  const newObj = {...optionDefaultValue}
  newObj.hp = heroDefaultHp[character.hero.groupName]
  return newObj
}
const getOptions =  (allOption) => {
  const options = allOption
    .reduce((result, data) => { 
      if(!data?.option) return result
      // 여기: 데이터 없으면 기본값 뱉도록 수정 필요
      const { option: options, gradeOption: gradeOptions, stack } = data
      const checkGradeOption = gradeOptions || []
      for(const option of [...options, ...checkGradeOption]) {
        const key = Object.keys(option)[0]
        const resultValue = result[key] || 0
        const newValue = resultValue + calcOptionByStack(option, stack)
        Object.assign(result, {[key]: newValue})
      }
      return result
    }, {})
  return options
} 
const calcOptionByStack = (option, stack) => {
  const key = Object.keys(option)[0]
  const value = option[key]
  if(typeof(value) === 'string' && !value.includes('~')) return value*1

  const optionValueMin = value.split('~')[0]*1
  const optionValueMax = value.split('~')[1]*1
  const stackValue = stack ? stack*1 : 1
  const optionEachStack = (optionValueMax - optionValueMin) / 100
  const optionValueResult = (optionEachStack * stackValue) + optionValueMin
  return optionValueResult
}