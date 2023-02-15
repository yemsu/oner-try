import axios from 'axios'

const $axios = axios.create({
  baseURL: process.env.CONT_PATH + '/mrpg/api'
})

export const getEquipments = () => getApi('/equipments')
export const getMaterials = () => getApi('/materials')

function getApi(url = '', params = { params: {} }) {
  return $axios.get(url, params)
    .then(({ data }) => data)
    .catch(error => errorHandler(url, error))
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