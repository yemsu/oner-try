import { deepClone, getOnlyText, objArrKeys } from '@/plugins/utils'
import { gradeScoresDef } from '@/plugins/utils/item-def'

export const findData = (dataList, key, checkValue) => {
  return dataList.find(data => getOnlyText(data[key]) === getOnlyText(checkValue))
}
export const imgSrc = (type, imageName) => {
  if(!type) return ''
  return `https://oner-image.s3.ap-northeast-2.amazonaws.com/${type}/${imageName}.png`
}
export const getGradeScore = (key) => {
  return gradeScoresDef[key]
}
export const sortByGrade = (items) => {
  return items.sort((a, b) => getGradeScore(b.grade) - getGradeScore(a.grade))
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
export const fillDataAndInsertValue = (fullDataList, targetDataList, newDataKey, useDefaultData) => {
  // console.log('fillDataAndInsertValue', fullDataList, targetDataList, newDataKey, useDefaultData)
  const names = objArrKeys(targetDataList)
  const newData = names.map((name, i) => {
    const data = targetDataList[i]
    if(isBlank(name)) return null
    const fullData = findData(fullDataList, 'name', name)
    if(!fullData) {
      console.error(`NO ITEM: ${name} - CHECK DB!`)
      if(!useDefaultData) return false
    }
    const defaultData = { name }
    const fullDataClone = deepClone(fullData || defaultData)

    if(fullDataClone.option && typeof(fullDataClone.option) === 'string') {
      fullDataClone.option = parserStrData(fullDataClone.option)
    }

    const itemValue = Object.values(data)[0]
    const isString = typeof(itemValue) === 'string'
    const newObj = {[newDataKey]: isString ? itemValue.trim() : itemValue }
    return Object.assign(fullDataClone, newObj)
  })

  return newData
}
export const isBlank = str => str.includes('빈공간') || +str > 0 // 빈공간이 숫자값으로만 들어오는 케이스가 간혹 있음
export const parserDefaultData = (data) => {
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