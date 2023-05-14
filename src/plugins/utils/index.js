export const deepClone = (data) => {
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
export const remakeDateStr = (date) => {
  const [rawDay, rawTime] = date.split('T')
  const day = rawDay.replace(/-/gi, '.')
  const [hour, minute] = rawTime.split(':')
  return `${day} ${hour}:${minute}`
}
