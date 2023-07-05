import { optionDefaultValue, optionOrder, valueByStack, combiTypes, gradeCombiOptions } from '@/plugins/utils/item-def'
import { parserStrDataToObj } from '@/plugins/utils/item'
export const getCharacterSynergies = (sailors, synergies) => {
  const sailorNames = sailors.filter(sailor => sailor).map(sailor => sailor?.name)
  const characterSynergies = synergies.filter(synergy => {
    const checkArr = synergy.sailors.map(synergySailor => sailorNames.includes(synergySailor))
    const checkSet = new Set(checkArr)
    const isAllTrue = checkSet.size === 1 && [...checkSet][0]
    // console.log(synergy, checkSet.size === 1, checkSet[0])
    return isAllTrue
  })
  const specialSailors = sailors.filter(sailor => sailor?.grade === 'special')
  // 스페셜 선원 2명 이상인 경우 디버프 적용.
  if(specialSailors.length >= 2) {
    characterSynergies.push({
      name: '스페셜 제한',
      option: [{ss: '-500'}, {aas: '10'}],
      sailors: specialSailors.map(sailor => sailor.name)
    })
  }
  return characterSynergies
}
export const getCharacterCombi = (characterColleagues, colleagues) => {
  // 동료 콤비 효과
  const uniqueColleagues = getUniqueObjList(characterColleagues, 'name')
  const combiCountObj = getObjCountByValue(uniqueColleagues, 'combi')

  if(Object.keys(combiCountObj).length === 0 ) return null

  const characterCombiTypeId = Object.keys(combiCountObj).find(combiType => combiCountObj[combiType] >= 2)
  const combiMemberNum = combiCountObj[characterCombiTypeId]
  const characterCombiType = combiTypes.find(({ id }) => characterCombiTypeId == id)
  const combiOptions = gradeCombiOptions.find(({ grade }) => (
    characterCombiType.grade === grade
  )).options
  const sailors = colleagues
    .filter(({ combi }) => combi == characterCombiTypeId)
    .map(({ name }) => name)

  return {
    name: `${characterCombiType.name} - 콤비 ${combiMemberNum}세트`,
    option: combiOptions[`combi${combiMemberNum}`],
    sailors
  }
}
const getUniqueObjList = (items, keyName) => {
  return items.reduce((result, item) => {
    if(!item) return result
    return result.find((resultItem) => resultItem[keyName] === item[keyName]) 
      ? result
      : [...result, item]
  }, [])
}
const getObjCountByValue = (items, keyName) => {
  return items.reduce((result, item) => {
    if(!item || !item[keyName]) return result
    const value = item[keyName]
    if(!result[value]) {
      result[value] = 0
    }
    result[value] += 1
    return result  
  }, {})
}
export const getTotalOption = (character, additionalOptions) => {
  const { stat, equipment, sailor, colleague, ship } = character
  const allItem = [...equipment, ...sailor, ...colleague, ...ship, ...additionalOptions]
  // console.log('allItem', allItem)
  const allOption = getOptions(allItem)
  // console.log('allOption', allOption)
  const totalOption = Object.keys(optionDefaultValue).reduce((result, key) => {
    const checkOption = allOption[key] || 0
    const etcStatObj = parserStrDataToObj(stat?.join(',')) // 게임 내 특정 활동으로 얻을 수 있는 stat
    const etcStatValue = etcStatObj[key] ? +etcStatObj[key] : 0
    return Object.assign(result, {[key]: checkOption + optionDefaultValue[key] + etcStatValue})
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