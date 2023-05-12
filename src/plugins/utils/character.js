import { optionDefaultValue, optionOrder, valueByStack } from '@/plugins/utils/item-def'
export const getCharacterSynergies = (sailors, synergies) => {
  const sailorNames = sailors.filter(sailor => sailor).map(sailor => sailor?.name)

  return synergies.filter(synergy => {
    const checkArr = synergy.sailors.map(synergySailor => sailorNames.includes(synergySailor))
    const checkSet = new Set(checkArr)
    const isAllTrue = checkSet.size === 1 && [...checkSet][0]
    // console.log(synergy, checkSet.size === 1, checkSet[0])
    return isAllTrue
  })
}
export const getTotalOption = (character, characterSynergies) => {
  const { equipment, sailor, colleague, ship } = character
  const allItem = [...equipment, ...sailor, ...colleague, ...ship, ...characterSynergies]
  // console.log('allItem', allItem)
  const allOption = getOptions(allItem)
  // console.log('allOption', allOption)
  const totalOption = Object.keys(optionDefaultValue).reduce((result, key) => {
    const checkOption = allOption[key] || 0
    return Object.assign(result, {[key]: checkOption + optionDefaultValue[key]})
  }, {})
  // console.log('totalOption', totalOption)      
  // ev는 str 수치를 더한다.
  totalOption.ev += totalOption.str

  // dex는 레벨을 더한다.
  totalOption.dex += character.lv

  const result = optionOrder.map(key => ({[key]: totalOption[key]}))
  return result
}
const getOptions =  (allItem) => {
  const options = allItem
    .reduce((result, item) => { 
      if(!item?.option) return result
      // 여기: 데이터 없으면 기본값 뱉도록 수정 필요
      const { option: options, stack } = item
      for(const option of [...options]) {
        const key = Object.keys(option)[0]
        const resultValue = result[key] || 0
        const newValue = resultValue + valueByStack(item, option[key], (stack*1))
        Object.assign(result, {[key]: newValue})
      }
      return result
    }, {})
  return options
}