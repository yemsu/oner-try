import axios from 'axios'

const createAxios = (service) => {
  const path = `/api/${service}`
  const baseURL = process.env.API_PATH + path
  return axios.create({
    baseURL,
    timeout: 5000
  })
}

const getHeader = () => {
  const authorization = Https.prototype.jToken
  return authorization ? {
    Authorization: authorization
  } : null
}

class Https {
  constructor(service) {
    this.service = service 
    this._axios = createAxios(service)
  }

  get(url = '', params = {}) {
    return this._axios.get(url, { 
      params: { ...params },
      headers: getHeader()
    })
      .then(({ data }) => data)
      .catch(error => errorHandler(url, error))
  }
  post(url = '', payload) {
    // console.log('postApi', url, payload)
    return this._axios.post(url, payload, { headers: getHeader() })
      .then(({ data }) => data)
      .catch(error => errorHandler('url', error))
  }
  delete(url = '') {
    // console.log('deleteApi', url)
    return this._axios.delete(url, { headers: getHeader() })
      .then(({ data }) => data)
      .catch(error => errorHandler('url', error))
  }
  patch(url = '', payload) {
    // console.log('patchApi', payload)
    return this._axios.patch(url, payload, { headers: getHeader() })
      .then((res) => res)
      .catch(error => errorHandler('url', error))
  }
  put(url = '', payload) {
    // console.log('putApi', payload)
    return this._axios.put(url, payload, { headers: getHeader() })
      .then(({ data }) => data)
      .catch(error => errorHandler('url', error))
  }
}

const errorHandler = (actionName, error) => {
  const { response, request, message, config } = error
  if (response) {
    const { data, status, headers } = response
    // if(status !== 200) {
    //   window.$nuxt.$router.push(getErrorPageRouteData(status))
    // }
    // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답
    // console.log(`${actionName} : data`, data);
    console.log(`${actionName} : status`, status);
    console.log(`${actionName} : headers`, headers);
    return { error: { msg: data.result, status } }
  } else if (request) {
    // 요청이 전송되었지만, 응답이 수신되지 않음
    // 'error.request'는 브라우저에서 XMLHtpRequest 인스턴스
    console.log(`${actionName} : request`, request);
  } else {
    // 오류가 발생한 요청을 설정하는 동안 문제 발생
    console.log(`${actionName} : Error`, message);
  }
  console.log(`${actionName} : config`, config);

}

export default Https