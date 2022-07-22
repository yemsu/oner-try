import { deepClone, getOnlyText, objArrKeys } from '@/plugins/utils'
import { gradeScoresDef } from '@/plugins/utils/item-def'

export const findData = (dataList, key, checkValue) => {
  return dataList.find(data => getOnlyText(data[key]) === getOnlyText(checkValue))
}
export const imgSrc = (type, id) => {
  if(!type || !id) return ''
  const imgNameUseId = ['ship', 'hero', 'ryuo']
  const imgName = imgNameUseId.includes(type) ? id : type[0] + id
  const path = `/static/image/${type}/${imgName}.png`
  // const url = process.env.NODE_ENV === 'production'
  //   ? process.env.CONT_PATH : ''
  return process.env.CONT_PATH  + path
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

    if(fullDataClone.option && typeof(fullDataClone.option) === 'string') {
      fullDataClone.option = parserStrData(fullDataClone.option)
    }
    if(fullDataClone.gradeOption &&  typeof(fullDataClone.gradeOption) === 'string') {
      fullDataClone.gradeOption = parserStrData(fullDataClone.gradeOption)
    }

    const itemValue = Object.values(data)[0]
    const isString = typeof(itemValue) === 'string'
    const newObj = {[newDataKey]: isString ? itemValue.trim() : itemValue }
    return Object.assign(fullDataClone, newObj)
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