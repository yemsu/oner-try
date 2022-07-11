import { deepClone, getOnlyText, objArrKeys } from '@/plugins/utils'
import { optionsMap } from '@/plugins/utils/item-def'

export const findData = (dataList, key, checkValue) => {
  return dataList.find(data => getOnlyText(data[key]) === getOnlyText(checkValue))
}
export const imgSrc = (type, id) => {
  if(!type || !id) return ''
  const imgName = type === 'ship' || type === 'hero' ? id : type[0] + id
  const path = `/static/image/${type}/${imgName}.png`
  // const url = process.env.NODE_ENV === 'production'
  //   ? process.env.CONT_PATH : ''
  return process.env.CONT_PATH  + path
}
export const getOptionTitle = (key) => {
  return optionsMap.get(key) 
}
export const getOptionUnit = (key) => {
  const noUnit = ['hp', 'po', 'ms']
  return noUnit.includes(key) ? '' : '%'
}
export const parserStrData = (strData) => { // name: value, name: value ...
  if(!strData) return []
  if(typeof(strData) !== 'string') return strData
  const checkSingle = !strData.includes(',')
  const data = checkSingle ? [strData] : strData.replace(/\[ | \]/, '').split(',')
  const objList = data.map(str => {
    if(!str.includes(':')) return str.trim()
    const splitStr = str.split(':')
    const nameValue = getOnlyText(splitStr[0])
    return {[nameValue]: splitStr[1]}
  })

  return objList
}
export const fillDataAndInsertValue = (fullDataList, targetDataList, newDataKey, useDefaultData) => {
  const names = objArrKeys(targetDataList)
  const newData = names.map((name, i) => {
    const data = targetDataList[i]
    if(isBlank(name)) return null
    const fullData = findData(fullDataList, 'name', name)
    if(!fullData && useDefaultData) {
      return { name }
    } else if(!fullData) {
      console.error(`NO ITEM: ${name} - CHECK DB!`)
      return false
    }
    const fullDataClone = deepClone(fullData)

    if(fullDataClone.option) {
      fullDataClone.option = parserStrData(fullDataClone.option)
    }
    if(fullDataClone.gradeOption) {
      fullDataClone.gradeOption = parserStrData(fullDataClone.gradeOption)
    }

    const itemValue = `${Object.values(data)[0]}`.trim()
    return Object.assign(fullDataClone, {[newDataKey]: itemValue})
  })

  return newData
}
export const isBlank = str => str.includes('빈공간')
export const getDefaultData = (data) => {
  return isBlank(data) ? `${data}: null` : data
}
export const fillDefaultList = (items, numberFixed) => {
  const newItems = [...items]
  const length = newItems.length
  if(length >= numberFixed) return items
  const defaultArr = new Array(numberFixed - length).fill(null)
  newItems.push(...defaultArr)

  return newItems
}