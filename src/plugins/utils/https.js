import axios from 'axios'

const $axios = axios.create({
  baseURL: process.env.CONT_PATH_LOCAL + '/api'
})

export const getSailors = () => {
  return $axios.get('/sailors')
}
export const getEtcItems = () => {
  return $axios.get('/etcItems')
}
export const getItems = () => {
  return $axios.get('/items')
  .catch(error => errorHandler('getItems', error))
}
export const getColleagues = () => {
  return $axios.get(`/colleagues`)
    .catch(error => errorHandler('getItems', error))
}
export const getUserCharacters = (nickName) => {
  return $axios.get(`/characterList`, { params: nickName })
    .catch(error => errorHandler('getUserCharacters', error))
}
export const getEquipments = (params) => {
  return $axios.get(`/equipments`, { params })
    .catch(error => errorHandler('getEquipments', error))
}
export const getShips = (params) => {
  return $axios.get(`/ships`, { params })
    .catch(error => errorHandler('getShips', error))
}
export const getHeroes = (params) => {
  return $axios.get(`/heroes`, { params })
    .catch(error => errorHandler('getHeroes', error))
}
export const getGameUsers = (params) => {
  return $axios.get(`/gameUsers`, { params })
    .catch(error => errorHandler('getGameUsers', error))
}
export const getRanking = () => {
  return $axios.get(`/ranking`)
    .catch(error => errorHandler('getRanking', error))
}
export const getSynergies = () => {
  return $axios.get(`/synergies`)
    .catch(error => errorHandler('getSynergies', error))
}
export const getRyuoList = () => {
  return $axios.get(`/ryuoList`)
    .catch(error => errorHandler('getRyuoList', error))
}
export const getCompositionPageViews = (params) => {
  if(!params) params = { startDate: '2022-7-9' }
  return $axios.get(`/compositionPageViews`, { params })
  .catch(error => errorHandler('getCompositionPageView', error))
}
export const getCharacterPageViews = (params) => {
  if(!params) params = { startDate: '2022-7-9' }
  return $axios.get(`/characterPageViews`, { params })
  .catch(error => errorHandler('getCharacterPageViews', error))
}
export const postItemName = (params) => {
  return $axios.post(`/register/report`, null, { params })
  .then(res => res)
  .catch(error => errorHandler('postItemName', error))
}
export const postMergeCharacterView = (params) => {
  return $axios.post(`/register/murgeCharacterView`, null, { params })
  .then(res => res)
  .catch(error => errorHandler('postMergeCharacterView', error))
}
export const postMurgeCompositionView = (params) => {
  return $axios.post(`/register/murgeCompositionView`, null, { params })
  .then(res => res)
  .catch(error => errorHandler('murgeCompositionView', error))
}
export const postCharacterPageView = (params) => {
  return $axios.post(`/register/characterPageView`, null, { params })
  .then(res => res)
  .catch(error => errorHandler('postCharacterPageView', error))
}
export const postCompositionPageView = (params) => {
  return $axios.post(`/register/compositionPageView`, null, { params })
  .then(res => res)
  .catch(error => errorHandler('postCompositionPageView', error))
}
export const getIpClient = () => {
  return axios.get(`https://api.ipify.org?format=json`)
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

// login
export const postSocialLogin = (params) => {
  console.log('params', params)
  return $axios.post(`/login`, null, { params })
  .then(res => {
    $axios.defaults.headers.common['Authorization'] = `${res.data}`
  // accessToken, refreshToken - 가입 여부
    return res.data
  })
  .catch(error => errorHandler('postSocialLogin', error))
}

export const getUserInfo = (token) => {
  console.log('getUserInfo', token)
  return $axios.get(`/user/info`, { 
    headers: {
      Authorization: token
    }
  })
  .then(res => res.data)
  .catch(error => errorHandler('getUserInfo', error))
}

export const postGoogleCredential = (params) => {
  return $axios.post(`/user/login`, null, { params })
  .then(res => res.data)
  .catch(error => errorHandler('postGoogleCredential', error))
}

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