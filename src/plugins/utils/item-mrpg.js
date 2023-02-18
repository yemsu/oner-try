import { deepClone, getOnlyText } from '@/plugins/utils'
import { itemTypeNames } from '@/plugins/utils/item-def-mrpg'

export const parseItemData = (item) => {
  item = deepClone(item)
  const keys = Object.keys(item)
  for(const key of keys) {
    const parsingData = detailInfoDesc(item, key)
    if(!parsingData) continue
    item[key] = parsingData
  }
  return item
}

export const parserStrData = (strData, type = 'object') => { // name: value, name: value ...
  if(!strData) return []
  if(typeof(strData) !== 'string') return strData
  const checkSingle = !strData.includes(',')
  const data = checkSingle ? [strData] : strData.replace(/\[ | \]/, '').split(',')
  const objList = data.map(str => {
    if(type === 'list') return str.trim()
    const splitStr = str.split(':')
    const nameValue = getOnlyText(splitStr[0])
    return {[nameValue]: splitStr[1]}
  })

  return objList
}

export const 조합재료의재료세팅기 = (ingredients, 조합재료들) => {
  const result = deepClone(ingredients)
  for(const ingredient of result) {
    // 조합재료를 가진 조합재료
    const findIngredient = 조합재료들.find(({ name }) => (
      name === ingredient.name
    ))
    if(!findIngredient) continue
    // 해당 아이템 재료에 조합 재료 세팅
    ingredient.ingredients = parseIngredientsData(findIngredient.ingredients)
  }

  return result
}

const detailInfoDesc = (item, key) => {
  if(!item[key]) return ''
  switch (key) {
    case 'active':
    case 'dedicatedOption':
    case 'passive':
      return parseSubTitleData(item[key])
    case 'option':
      return parserStrData(item[key])
    case 'ingredients':
      return parseIngredientsData(item[key])
    default:
      return null
  }
}

export const parseIngredientsData = (strData) => {
  // console.log('parseIngredientsData', strData)
  const toArr = strData.split('|')
  const strValueToObj = toArr.map(item => {
    const [ name, number ] = item.split(':')
    return { name, number }
  })
  return strValueToObj
}

const parseSubTitleData = (strData) => {
  // console.log('parseSubTitleData', strData)
  const [ subTitle, desc ] = strData.split(':')
  return { subTitle, desc }
}