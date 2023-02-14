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
    case 'type':
      return itemTypeNames[item[key]]
    default:
      return null
  }
}

const parseIngredientsData = (strData) => {
  // console.log('parseIngredientsData', strData)
  const toArr = strData.split(',')
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