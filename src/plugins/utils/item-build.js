import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { fillDefaultList, parserStrData, fillDataAndInsertValue } from '@/plugins/utils/item'
import { remakeDateStr } from '@/plugins/utils/index'
import { slotNumbers, maxStack } from '@/plugins/utils/item-def'

export const parseItemBuildData = (itemBuild, items, synergies, heroes) => {
  const getFullData = (itemId) => items.find(({id}) => id === itemId)
  const parseItems = (type) => {
    const data = itemBuild[type]
    if(!data) return fillDefaultList([null], slotNumbers[type])
    
    // stack 설정 가능 전에 저장된 데이터 호환되도록 분기처리
    const fullData = data.includes(':')
      ? fillDataAndInsertValue(items, parserStrData(data), 'stack', true)
      : data.split(',').map(getFullData)
    return fillDefaultList(fullData, slotNumbers[type])
      .map(item => {
        if(!item) return item
        if(!item.stack) item.stack = maxStack(item)
        return item
      })
  }

  const hero = heroes.find(hero => hero.imageName === itemBuild.characterName)
  const regDt = remakeDateStr(itemBuild.regDt)
  const colleague = parseItems('colleague')
  const equipment = parseItems('equipment')
  const sailor = parseItems('sailor')
  const ship = parseItems('ship')
  const characterSynergies = getCharacterSynergies(sailor, synergies)
  const character = {...itemBuild, hero, regDt, equipment, sailor, ship, colleague, synergy: characterSynergies}
  const totalOption = getTotalOption(character, characterSynergies)

  return {...character, totalOption}
}