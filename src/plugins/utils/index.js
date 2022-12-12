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

export const addCommaNumber = number => {
  if(!number) return 0
  if(!isNaN(number)) number += ''
  const commaPosition = 3
  const numLength = number.length
  const commaNumber = Math.round(numLength / commaPosition)
  const result = new Array(commaNumber).fill('')
  for(let i = 0; i < numLength; i++) {
    const resultIndex = (i % 3) === 0
    ? (i / 3)
    : Math.floor(i / 3)
    result[resultIndex] = number[numLength - i - 1] + (result[resultIndex] || '')
  }
  return result.reverse().join(',')
}