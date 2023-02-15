export const deepClone = (data) => {
  // console.log('data', data)
  return JSON.parse(JSON.stringify(data))
}
export const getOnlyText = (str) => {
  const regOnlyText = /[^\w\sㄱ-힣]| /g;
  return str.replace(regOnlyText, '')
}
export const isSameText = (text1, text2) => {
  return getOnlyText(text1) === getOnlyText(text2)
}
export const isOnlyNumber = (str) => {
  const regOnlyText = /^\d+$/;
  return regOnlyText.test(str)
}
export const objArrKeys = arr => {
  return arr.map(item => Object.keys(item)[0])
}
export const findKeyName = (obj, value) => {
  /**
   * @params
   * obj: { key1: value1, key2: value2 ...}
   * value: value2
   * @return
   * key2
   */
  return Object.keys(obj).find((key) => obj[key] === value)
}
export const getValueList = (objList, keyName) => {
  /**
   * @params
   * objList: [
   *  { id, name, option }
   *  { id, name, option }
   * ]
   * keyName: option:string
   * @return string[]
   * [ optionValue1, optionValue2 ]
   */
  return objList.map((obj) => obj[keyName])
}