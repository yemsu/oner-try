import axios from 'axios'

const $axios = axios.create({
  baseURL: process.env.API_PATH + '/api'
})

// item
export const getSailors = () => getApi('/sailors')
export const getEtcItems = () => getApi('/etcItems')
export const getItems = () => getApi('/items')
export const getColleagues = () => getApi('/colleagues')
export const getEquipments = (params) => getApi(`/equipments`, { params })
export const getShips = (params) => getApi(`/ships`, { params })
export const getHeroes = (params) => getApi(`/heroes`, { params })
export const getSynergies = () => getApi(`/synergies`)
export const getRyuoList = () => getApi(`/ryuoList`)
export const getPotions = () => getApi(`/potions`)

// character
export const getRanking = (params) => getApi(`/ranking`, { params })
export const getUserCharacters = (nickName) => getApi(`/characterList`, { params: nickName })
export const getGameUsers = (params) => getApi(`/gameUsers`, { params })

/**
 * category: 'composition'
 * target: itemId
 */
// 북마크 추가
export const postUserBookmark = ({ category, target }) => postApi(
  '/user/bookmark', { category, target }
)
// 북마크 제거
export const deleteUserBookmark = ({ category, target }) => deleteApi(
  '/user/bookmark', { category, target }
)
// 북마크 여부
export const getUserBookmark = ({ category, target }) => getApiReturnData(
  '/user/bookmark', { category, target }
)
// 북마크 리스트
export const getUserBookmarks = ({ category }) => getApiReturnData(
  '/user/bookmarks', { category }
)

// item build
export const getItemBuild = (id) => getApi(`/builds/${id}`)
export const getItemBuilds = (params) => getApi('/my/builds', { params })
export const postItemBuild = (itemBuild) => postBodyApi('/builds', itemBuild)
export const deleteItemBuild = (id) => deleteApi(`/builds/${id}`)
export const putItemBuild = (itemBuild) => putApi(`/builds/${itemBuild.id}`, itemBuild)

// common
export const setDefaultHeader = (key, value) => {
  $axios.defaults.headers.common[key] = value
}

// page view
export const getCompositionPageViews = () => {
  return getApi(`/compositionPageViews`, { params: {
    startDate: '2022-5-10',
    length: 10
  } })
}
export const getCharacterPageViews = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  // 어제부터의 데이터 집계
  return getApi(`/characterPageViews`, { params: {
    startDate: `${year}-${month}-${day}`,
    length: 10
  } })
}

// register
export const postItemName = (params) => postApi(`/register/report`, params)
export const postMergeCharacterView = (params) => postApi(`/register/murgeCharacterView`, params)
export const postMurgeCompositionView = (params) => postApi(`/register/murgeCompositionView`, params)
export const postCharacterPageView = (params) => postApi(`/register/characterPageView`, params)
export const postCompositionPageView = (params) => postApi(`/register/compositionPageView`, params)

// ip
export const getIpClient = () => {
  return axios.get(`https://api.ip.pe.kr/`)
  .then(res => res)
  .catch(error => errorHandler('getIpClient', error))
}

// etc
export const getServerStatus = () => {
  return $axios.get(`/serverStatus`)
}
export const getErrorPageRouteData = status => {
  const statusCode = status === 502 ? 1 : 2
  const errorPageRouteData = {
    name: 'Server Maintenance',
    query: { status: statusCode }
  }
  return errorPageRouteData
}

// login (user)
export const getUserInfo = () => {
  return $axios.get(`/user/info`)
    .then(res => res.data)
    .catch(error => errorHandler('getUserInfo', error))
}

export const postGoogleCredential = (params) => {
  return $axios.post(`/user/login`, null, { params })
    .then(res => res.data)
    .catch(error => errorHandler('postGoogleCredential', error))
}
export const deleteUser = () => deleteApi(`/user`)

// 사이트 닉네임 중복 체크
export const getIsDuplNick = (params) => {
  return $axios.get('/user/isDuplNick', { params })
  .then(res => res.data)
  .catch(error => errorHandler('getIsDuplNick', error))
}

export const postUserJoin = (params) => {
  return $axios.post(`/user/register`, null, { params })
  .then(res => res.data)
  .catch(error => errorHandler('postUserJoin', error))
}

const errorHandler = (actionName, error) => {
  const { response, request, message, config } = error
  if (response) {
    const { data, status, headers } = response
    // if(status !== 200) {
    //   window.$nuxt.$router.push(getErrorPageRouteData(status))
    // }
    // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
    console.log(`${actionName} : data`, data);
    console.log(`${actionName} : status`, status);
    console.log(`${actionName} : headers`, headers);
  } else if (request) {
    // 요청이 전송되었지만, 응답이 수신되지 않았습니다. 
    // 'error.request'는 브라우저에서 XMLHtpRequest 인스턴스이고,
    // node.js에서는 http.ClientRequest 인스턴스입니다.
    console.log(`${actionName} : request`, request);
  } else {
    // 오류가 발생한 요청을 설정하는 동안 문제가 발생했습니다.
    console.log(`${actionName} : Error`, message);
  }
  console.log(`${actionName} : config`, config);
}

function getApi(url = '', params = { params: {} }) {
  return $axios.get(url, params)
    .then(({ data }) => data.result)
    .catch(error => errorHandler(url, error))
}

function putApi(url = '', payload) {
  return $axios.get(url, payload)
    .then((res) => res)
    .catch(error => errorHandler(url, error))
}

function getApiReturnData(url = '', params = {}) {
  return $axios.get(url, { params })
    .then(({ data }) => data)
    .catch(error => errorHandler(url, error))
}
function postApi(url = '', params = {}) {
  return $axios.post(url, null, { params })
    .then(res => res)
    .catch(error => errorHandler('url', error))
}
function postBodyApi(url = '', payload = {}) {
  return $axios.post(url, payload)
    .then(res => res)
    .catch(error => errorHandler('url', error))
}
function deleteApi(url = '', params = {}) {
  return $axios.delete(url, { params })
    .then(res => res)
    .catch(error => errorHandler('url', error))
}