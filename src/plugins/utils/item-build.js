import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { fillDefaultList } from '@/plugins/utils/item'
import { remakeDateStr } from '@/plugins/utils/index'
import { slotNumbers } from '@/plugins/utils/item-def'

export const parseItemBuildData = (itemBuild, items, synergies, heroes) => {
  const getFullData = (itemId) => items.find(({id}) => id === itemId)
  const hero = heroes.find(hero => hero.imageName === itemBuild.characterName)
  const regDt = remakeDateStr(itemBuild.regDt)
  const equipment = fillDefaultList(
    itemBuild.equipments.split(',').map(getFullData),
    slotNumbers.equipment
  )
  const sailor = fillDefaultList(
    itemBuild.sailor.split(',').map(getFullData),
    slotNumbers.sailor
  )
  const ship = fillDefaultList(
    [itemBuild.ship].map(getFullData),
    slotNumbers.ship
  )
  const characterSynergies = getCharacterSynergies(sailor, synergies)
  const character = {...itemBuild, hero, regDt, equipment, sailor, ship, synergy: characterSynergies}
  const totalOption = getTotalOption(character, characterSynergies)

  return {...character, totalOption}
}