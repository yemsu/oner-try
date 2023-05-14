import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { fillDefaultList } from '@/plugins/utils/item'
import { remakeDateStr } from '@/plugins/utils/index'
import { slotNumbers, maxStack } from '@/plugins/utils/item-def'

export const parseItemBuildData = (itemBuild, items, synergies, heroes) => {
  const getFullData = (itemId) => items.find(({id}) => id === itemId)
  const parseItems = (type) => {
    const itemBuildKeyName = ['equipment', 'sailor'].includes(type)
      ? `${type}s` : type
    return fillDefaultList(
      itemBuild[itemBuildKeyName].split(',').map(getFullData),
      slotNumbers[type]
    ).map(item => {
      item.stack = maxStack(item)
      return item
    })
  }
  const hero = heroes.find(hero => hero.imageName === itemBuild.characterName)
  const regDt = remakeDateStr(itemBuild.regDt)
  const equipment = parseItems('equipment')
  const sailor = parseItems('sailor')
  const ship = parseItems('ship')
  const characterSynergies = getCharacterSynergies(sailor, synergies)
  const character = {...itemBuild, hero, regDt, equipment, sailor, ship, synergy: characterSynergies}
  const totalOption = getTotalOption(character, characterSynergies)

  return {...character, totalOption}
}