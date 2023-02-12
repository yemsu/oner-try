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