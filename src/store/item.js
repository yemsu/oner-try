import { isSameText, deepClone } from '@/plugins/utils'
import { parserStrData, sortByGrade } from '@/plugins/utils/item'
import { equipmentGradeTypes, equipmentGradeTypeExceptions, equipDropOrder } from '@/plugins/utils/item-def'
import {
  getItems,
  getSailors,
  getEtcItems,
  getEquipments,
  getHeroes,
  getColleagues,
  getSynergies,
  getShips,
  getRyuoList,
  getPotions
} from '@/plugins/utils/https'

export const state = () => ({
  items: [],
  sailors: [],
  sailors_synergy: [],
  etcItems: [],
  equipments: [],
  equipments_table: [],
  ships: [],
  ships_table: [],
  heroes: [],
  colleagues: [],
  synergies: [],
  ryuoes: [],
  potions: [],
})

export const getters = {
  getItems: (state) => state.items,
  getSailors: (state) => state.sailors,
  getEtcItems: (state) => state.etcItems,
  getEquipments: (state) => state.equipments,
  getEquipmentsTable: (state) => state.equipments_table,
  getShips: (state) => state.ships,
  getShipsTable: (state) => state.ships_table,
  getHeroes: (state) => state.heroes,
  getColleagues: (state) => state.colleagues,
  getSynergies: (state) => state.synergies,
}

export const mutations = {
  SET_ITEMS(state, {type, data}) {
    state[type] = data
  },
  SET_SAILORS(state, {type, data}) {
    state[type] = data
  },
  SET_ETC_ITEMS(state, {type, data}) {
    state[type] = data
  },
  SET_EQUIPMENTS(state, {data}) {
    state.equipments = data
  },
  SET_EQUIPMENTS_TABLE(state, {data}) {
    state.equipments_table = data
  },
  SET_SHIPS(state, {data}) {
    state.ships = data
  },
  SET_SHIPS_TABLE(state, {data}) {
    state.ships_table = data
  },
  SET_HEROS(state, {type, data}) {
    const newData = data.map(hero => Object.assign(hero, {type: 'hero'}))
    state[type] = newData
  },
  SET_COLLEAGUES(state, {data}) {
    state.colleagues = data
  },
  SET_SYNERGIES(state, {data}) {
    state.synergies = data
  },
  SET_SAILORS_SYNERGY(state, {data}) {    
    state.sailors_synergy = data
  },
  SET_RYUOES(state, {data}) {
    state.ryuoes = data
  },
  SET_POTIONS(state, {data}) {
    state.potions = data
  },
}
const dataTyped = (data) => {
  const newData = data.map(item =>{
    const type = item.type || 'etcItem'
    return Object.assign(item, {type})
  })
  return newData
}
export const actions = {
  GET_ITEMS({ commit }) {
    console.log('store: item/GET_ITEMS')
    return getItems()
      .then((data) => {
        const newData = data.map(dataItem => Object.assign(dataItem, {option: parserStrData(dataItem.option)}))
        commit(`SET_ITEMS`, {data: dataTyped(newData), type: 'items'})
        return data
      })
      .catch(error => console.error('GET_ITEMS', error))
  },
  GET_SAILORS({ commit }) {
    return getSailors()
      .then((data) => {
        // console.log('GET_SAILORS',data)
        const newData = data.map(dataItem => Object.assign(dataItem, {option: parserStrData(dataItem.option)}))

        commit(`SET_SAILORS`, {data: newData, type: 'sailors'})
        return data
      })
      .catch(error => console.error('GET_SAILORS', error))
  },
  GET_COLLEAGUES({ commit }, payload) {
    return getColleagues(payload)
      .then((data) => {
        // console.log('GET_COLLEAGUES', data)
        const newData = data.map(dataItem => {
          const { option, coloOption, coloPassive } = dataItem
          const optionObj = {option: parserStrData(option)}
          const coloOptionObj = coloOption ? {coloOption: parserStrData(coloOption)} : {}
          const coloPassiveObj = coloPassive ? {coloPassive: parserStrData(coloPassive, 'list')} : {}
          const newObj = coloOption
            ? Object.assign(optionObj, {...coloOptionObj, ...coloPassiveObj})
            : optionObj
          return Object.assign(dataItem, newObj)
        })

        commit(`SET_COLLEAGUES`, {data: newData})
        return newData
      })
      .catch(error => console.error('GET_COLLEAGUES', error))
  },
  GET_ETC_ITEMS({ commit }) {
    return getEtcItems()
      .then((data) => {
        // console.log('SET_ETC_ITEMS', data)
        commit(`SET_ETC_ITEMS`, {data, type: 'etcItems'})
        return data
      })
      .catch(error => console.error('GET_ETC_ITEMS', error))
  },
  async GET_ETC_ITEMS_TABLE({ commit, state, dispatch }) {
    if(state.etcItems.length === 0) await dispatch('GET_ETC_ITEMS')
    const newData = deepClone(state.etcItems)
      .reduce((acc, data) => {
        const { name } = data
        acc.push({ ...data, name: name.split(' +')[0] })
        return acc
      }, [])
    commit(`GET_ETC_ITEMS_TABLE`, {data: newData})
    return newData
  },
  GET_EQUIPMENTS({ commit }) {
    return getEquipments()
      .then((data) => {
        const newData = data.map(dataItem => {
          const { option, gradeOption } = dataItem
          const optionObj = {option: parserStrData(option)}
          // const gradeOptionObj = gradeOption
          //   ? {gradeOption: parserStrData(gradeOption)}
          //   : null
          return Object.assign(dataItem, {...optionObj, gradeOption})
        })
        const sortData = newData.sort((a, b) => {
          const checkDrop = data => equipDropOrder.indexOf(data.dropMonster)
          return checkDrop(a) - checkDrop(b)
        })

        commit(`SET_EQUIPMENTS`, {data: sortData})
        return sortData
      })
      .catch(error => console.error('GET_EQUIPMENTS', error))
  },
  async GET_EQUIPMENTS_TABLE({ commit, state, dispatch }) {
    if(state.equipments.length === 0) await dispatch('GET_EQUIPMENTS')
    // console.log('equipments',state.equipments)

    const getExceptionType = name => equipmentGradeTypeExceptions.find(exception => name.includes(exception))
    const gradeTypeSample = equipmentGradeTypes.map(type => type[0])
    const groupDataList = state.equipments.reduce((acc, equipment) => {
      // 등급 분류 해당 안되는 케이스 예외 처리
      // 공통 처리
      const typeSample = gradeTypeSample.find(sample => equipment.name.includes(sample))
      const gradeTypeIndex = gradeTypeSample.indexOf(typeSample)
      if(typeSample) {
        const name = !getExceptionType(equipment.name)
          ? equipment.name.split(typeSample).find(name => name).trim()
          : equipment.name
        acc.push({ name, gradeTypeIndex })
      }
      return acc
    }, [])

    const newData = state.equipments
      .reduce((acc, data) => {
        const { name, option, gradeOption, type, id, dropMonster } = data
        const groupData = groupDataList.find(group => name.includes(group.name))
        if(!groupData) {
          // console.error('no groupData', name, groupData)
          return acc
        }
        const { name: groupName, gradeTypeIndex } = groupData
        const itemObj = () => ({ id, name: groupName, type })

        // 전용무기 예외 처리 - 같은 전용무기는 같은 item 배열에 삽입
        const isDefaultEquip = dropMonster.includes('전용무기')
        const sameDefaultEquip = acc.find(accData => accData.dropMonster === dropMonster)
        const sameName = acc.find(accData => name.includes(accData.items[0].name))
        const hasMe = acc.find(accData => accData.items.find(item => name.includes(item.name)))
        if(isDefaultEquip && sameDefaultEquip && !sameName) {
          if(!hasMe) {
            sameDefaultEquip.items.push(itemObj())
          }
          return acc
        }
        
        // 전용무기별 item 묶음 처리
        const sameAccData = acc.find(data => data.items[0].name === groupName)
        // 예외 타입 처리
        let stackName = getExceptionType(name)
          ? getExceptionType(name)
          : name.split(groupName).find(name => name).trim()
        let stackIndex = getExceptionType(name)
          ? 0
          : equipmentGradeTypes[gradeTypeIndex].indexOf(stackName)
        
        if(!sameAccData) {
          const optionsByGrade = new Array(6)
          const stackNames = new Array(6)
          optionsByGrade[stackIndex] = gradeOption || null
          stackNames[stackIndex] = stackName
          
          const items = [itemObj()]

          acc.push({ items, optionsByGrade, stackNames, option, dropMonster })
        } else {
          sameAccData.optionsByGrade[stackIndex] = gradeOption
          sameAccData.stackNames[stackIndex] = stackName
        }
        return acc
      }, [])
    // console.log('newData', newData)
    commit(`SET_EQUIPMENTS_TABLE`, {data: state.equipments})
    return state.equipments
  },
  GET_SHIPS({ commit }) {
    return getShips()
      .then((data) => {
        const newData = data.map(dataItem => {
          const { option } = dataItem
          const optionObj = {option: parserStrData(option)}
          return Object.assign(dataItem, optionObj)
        })
        commit(`SET_SHIPS`, {data: newData})
        return newData
      })
      .catch(error => console.error('GET_SHIPS', error))
  },
  async GET_SHIPS_TABLE({ commit, state, dispatch }) {
    if(state.ships.length === 0) await dispatch('GET_SHIPS')
    const newData = deepClone(state.ships)
      .reduce((acc, data) => {
        const { groupName, name, option, type, imageName } = data
        // const sameShipAccData = acc.find(data => data.groupName === groupName)
        const nameData = name.split(' +')[0]
        const stack = name.split(' +')[1]
        // console.log('sameShipAccData', sameShipAccData, )
        // if(!sameShipAccData) {
          // const optionsByStack = new Array(5)
          // optionsByStack[stack] = option
          acc.push({ ...data, name: nameData })
        // } else {
        //   sameShipAccData.optionsByStack[stack] = option
        // }
        return acc
      }, [])
    commit(`SET_SHIPS_TABLE`, {data: newData})
    return newData
  },
  GET_HEROES({ commit }, payload) {
    return getHeroes(payload)
      .then((data) => {
        // console.log('GET_HEROES', data)
        commit(`SET_HEROS`, {data, type: 'heroes'})
        return data
      })
      .catch(error => console.error('GET_HEROES', error))
  },
  GET_SYNERGIES({ commit }) {
    return getSynergies()
      .then((data) => {
        const newData = data.map(dataItem => {
          const option = parserStrData(dataItem.option)
          const sailors = parserStrData(dataItem.sailors, 'list')
          return Object.assign(dataItem, {option, sailors})
        })
        commit(`SET_SYNERGIES`, {data: newData})
        return newData
      })
      .catch(error => console.error('GET_SYNERGIES', error))
  },
  async GET_SAILORS_SYNERGY({ commit, state, dispatch }) {
    if(state.sailors.length === 0) await dispatch('GET_SAILORS')
    if(state.synergies.length === 0) await dispatch('GET_SYNERGIES')

    // gradeScoresDef
    const { sailors, synergies } = state
    const newData = deepClone(sailors).map(sailor => {
      const { name } = sailor
      sailor.synergies = synergies.filter(({ sailors: synergySailors }) => {
        return synergySailors.find(synergySailor => isSameText(synergySailor, name))
      })
      return sailor
    })
    
    commit(`SET_SAILORS_SYNERGY`, {data: sortByGrade(newData)})
    return newData
  },
  GET_RYUOES({ commit }) {
    return getRyuoList()
      .then((data) => {
        const newData = data.map(dataItem => {
          const option = parserStrData(dataItem.option)
          const name = `${dataItem.name}차 류오`
          return Object.assign(dataItem, {name, option})
        })
        // console.log('GET_RYUOES', newData)
        commit(`SET_RYUOES`, {data: newData})
        return newData
      })
      .catch(error => console.error('GET_RYUOES', error))
  },
  GET_POTIONS({ commit }) {
    return getPotions()
      .then((data) => {
        commit(`SET_POTIONS`, {data})
        return data
      })
      .catch(error => console.error('GET_POTIONS', error))
  },
  async GET_POTIONS_TABLE({ commit, state, dispatch }) {
    if(state.potions.length === 0) await dispatch('GET_POTIONS')
    const newData = deepClone(state.potions)
      .reduce((acc, data) => {
        const { name } = data
        acc.push({ ...data, name: name.split(' +')[0] })
        return acc
      }, [])
      .sort((a, b) => {
        const aLevel = a.name.match(/\d/)[0]
        const bLevel = b.name.match(/\d/)[0]
        return bLevel - aLevel
      })
    commit(`GET_POTIONS_TABLE`, {data: newData})
    return newData
  },
}