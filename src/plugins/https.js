import axios from 'axios'

const $axios = axios.create({
  baseURL: 'https://onerapi.xyz'
})

export const getSailors = () => {
  return $axios.get('/api/sailors')
}
export const getEtcItems = () => {
  return $axios.get('/api/etcItems')
}
export const getItems = () => {
  return $axios.get('/api/items')
}
export const getColleagues = () => {
  return $axios.get(`/api/colleagues`)
}
export const getCharacters = (params) => {
  return $axios.get(`/api/characterList`, { params })
}
export const getEquipments = (params) => {
  return $axios.get(`/api/equipments`, { params })
}
export const getHeroes = (params) => {
  return $axios.get(`/api/heroes`, { params })
}
export const getGameUsers = (params) => {
  return $axios.get(`/api/gameUsers`, { params })
}
const catchError = error => {
  if (error.response) {
    // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
    console.log('data', error.response.data);
    console.log('status', error.response.status);
    console.log('headers', error.response.headers);
  } else if (error.request) {
    // 요청이 전송되었지만, 응답이 수신되지 않았습니다. 
    // 'error.request'는 브라우저에서 XMLHtpRequest 인스턴스이고,
    // node.js에서는 http.ClientRequest 인스턴스입니다.
    console.log('request', error.request);
  } else {
    // 오류가 발생한 요청을 설정하는 동안 문제가 발생했습니다.
    console.log('Error', error.message);
  }
  console.log('config', error.config);
}
export const postGameUser = (params) => {
  return $axios.post(`/api/register/gameUser`, null, { params })
  .then(res => res)
  .catch(catchError)
}
export const postItemName = (params) => {
  return $axios.post(`/api/register/report`, null, { params })
  .then(res => res)
  .catch(catchError)
}


// etc
export const getServerStatus = () => {
  return $axios.get(`/api/serverStatus`)
}