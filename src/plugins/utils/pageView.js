import { getIpClient } from '@/plugins/utils/https'

const checkMoreThan30Minutes = (nowDateStr, data) => {
  console.log(data.date, nowDateStr)
  const [ oldYear, oldMonth, oldDate, oldHour, oldMinute ] = data.date.split('-')
  const [ newYear, newMonth, newDate, newHour, newMinute ] = nowDateStr.split('-')
  const checkMoreThanADay = oldYear !== newYear || oldMonth !== newMonth || oldDate !== newDate
  // console.log('checkMoreThanADay', checkMoreThanADay)
  if(checkMoreThanADay) return true
  const gapHour = newHour - oldHour
  const gapMinute = newMinute - oldMinute + (gapHour * 60)
  if(gapMinute > 30) return true
  else return false
}
const newPageViewData = (name, date) => {
  return { name, date }
}
const returnNowDateStr = () => {
  const now = new Date()
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()
  const nowDate = now.getDate()
  const nowHour = now.getHours()
  const nowMinute = now.getMinutes()
  return `${nowYear}-${nowMonth}-${nowDate}-${nowHour}-${nowMinute}`
}
const setStoragePageView = (storageName, data) => {
  window.sessionStorage.setItem(storageName, JSON.stringify(data))
}
export const checkUpdatePageView = async (itemSelected) => {
  const { data: ipData } = await getIpClient()
  if(ipData.ip === process.env.IP_ADMIN) return false
  if(process.env.NODE_ENV !== 'production') return false

  const storageName = `oner_try_character_page_view`
  const sessionData = JSON.parse(window.sessionStorage.getItem(storageName)) || []
  console.log('sessionData', sessionData)
  const { name } = itemSelected
  const nowDateStr = returnNowDateStr()
  console.log('nowDateStr', nowDateStr)
  const sameNameData = sessionData.find(data => data.name === name)
  if(sameNameData) {
    if(!checkMoreThan30Minutes(nowDateStr, sameNameData)) return
    const newSessionData = sessionData.reduce((acc, data) => {
      const newData = data.name === name
        ? Object.assign(data, {date: nowDateStr})
        : data
      acc.push(newData)
      return acc
    }, [])
    console.log('after 30 newSessionData', newSessionData.date, newSessionData)
    setStoragePageView(storageName, newSessionData)
    return true
  } else {
    const newSessionData = sessionData.concat([newPageViewData(name, nowDateStr)])
    console.log('newSessionData', newSessionData)
    setStoragePageView(storageName, newSessionData)
    return true
  }
}