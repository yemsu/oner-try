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
const adminIpList = [
  '1.227.192.84', // 수진 집
  '218.153.37.253' // 수진 회사
]
export const checkUpdatePageView = async (type, name) => {
  const { data: ip } = await getIpClient()
  if(adminIpList.includes(ip)) return false
  if(process.env.NODE_ENV !== 'production') return false

  const storageName = `oner_try_${type}_page_view`
  const sessionData = JSON.parse(window.sessionStorage.getItem(storageName)) || []
  // console.log('sessionData', sessionData)
  const nowDateStr = returnNowDateStr()
  // console.log('nowDateStr', nowDateStr)
  const sameNameData = sessionData.find(data => data.name === name)
  if(sameNameData) {
    if(!checkMoreThan30Minutes(nowDateStr, sameNameData)) return false
    const newSessionData = sessionData.reduce((acc, data) => {
      const newData = data.name === name
        ? Object.assign(data, {date: nowDateStr})
        : data
      acc.push(newData)
      return acc
    }, [])
    // console.log('after 30 newSessionData', newSessionData.date, newSessionData)
    setStoragePageView(storageName, newSessionData)
  } else {
    const newSessionData = sessionData.concat([newPageViewData(name, nowDateStr)])
    // console.log('newSessionData', newSessionData)
    setStoragePageView(storageName, newSessionData)
  }
  return true
}

export const totalPageViewGAData = async (nameChecker, DbPageViews) => {
  const { default: gaPageViews } = await import('@/plugins/utils/ga-pageView.json')
  const gaCompositionPageViews = gaPageViews
    .filter(data => data.name.includes(nameChecker))
    .map(data => {
      data.name = data.name.split(nameChecker)[0]
      return data
    })

  const result = gaCompositionPageViews.reduce((acc, gaPageView) => {
    const { name, pageView } = gaPageView
    const DbPageView = DbPageViews.find(data => name === data.name)
    const result = DbPageView
      ? Object.assign({...gaPageView}, {pageView: DbPageView.pageView + pageView})
      : gaPageView
    acc.push(result)
    return acc
  }, [])

  // console.log( 'DbPageViews', DbPageViews[0])
  // console.log( 'gaPageViews', gaPageViews.find(pageView => pageView.name.includes('대령 코비')))
  // console.log('result', result.find(pageView => pageView.name.includes('대령 코비')))
  
  return result
}