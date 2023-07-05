<template>
  <div
    v-if="description"
    :class="`details size-${size}`"
  >
    <p>{{ description }}</p>
  </div>
  <dl v-else :class="`details type-${type} color-${colorMode} columns-${columns} size-${size}`">
    <div v-if="dropMonster" class="wrap-detail drop-monster">
      <dt :class="['title', {'color-point': highlightTitle}]">획득처</dt>
      <dd>{{ dropMonster }}</dd>
    </div>
    <template v-if="options">
      <div
        v-for="(option, i) in options"
        :key="`itemOption${i}`"
        :class="{'option-match': isMarkOption(Object.keys(option)[0])}"
        class="wrap-detail option"
      >
        <dt :class="['title', {'color-point': highlightTitle}]">
          {{ getOptionTitle(keyOf(option)) }}
        </dt>
        <dd>
          {{ plusMinusSign(option) }}{{ optionValue(option) }}{{ getUnit(option) }}
        </dd>
      </div>
    </template>
    <div v-if="showGradeOption && item.gradeOption" class="wrap-detail grade-option">
      <dt :class="['title', {'color-point': highlightTitle}]">추가 옵션</dt>
      <dd>{{ item.gradeOption }}</dd>
    </div>
  </dl>
</template>

<script>
import { noUnitOptions, optionsMap, canEnhance, maxStack, valueByStack } from '@/plugins/utils/item-def'

export default {
  props: {
    options: {
      type: Array,
      default: () => null
    },
    dropMonster: {
      type: String,
      default: () => null
    },
    colorMode: {
      type: String,
      default: () => 'black'
    },
    type: {
      type: String,
      default: () => 'basic' // basic, list-main, total, character-info
    },
    columns: {
      type: String,
      default: () => '1'
    },
    highlightTitle: {
      type: Boolean,
      default: () => true
    },
    plusMinusUnit: {
      type: Boolean,
      default: () => true
    },
    pureValue: {
      type: Boolean,
      default: () => false
    },
    showValueDecimal: { //소수점 고정
      type: Boolean,
      default: () => false
    },
    markOptions: {
      type: Array,
      default: () => []
    },
    description: {
      type: String,
      default: () => ''
    },
    item: {
      type: Object,
      default: () => null
    },
    showGradeOption: {
      type: Boolean,
      default: () => false
    },
    size: {
      type: String,
      default: () => 'medium' // small, medium
    }
  },
  computed: {
    isCharacterInfo() {
      return this.type === 'character-info'
    }
  },
  methods: {
    getOptionUnit(key) {
      if(this.isCharacterInfo) {
        switch(key) {
          case '위험도': return '/LV'
          case '레일리': return '단계'
          case '성장': return '년 후'
          case '버스터콜디펜드': return ''
          default: return '/p'
        }
      }
      const unit = noUnitOptions.includes(key) ? ''
        : key === 'aas' ? '/s'
        : '%'
      return unit
    },
    plusMinusSign(option) {
      !this.plusMinusUnit || this.pureValue || this.isMinus(option) ? '' : '+'
    },
    getOptionTitle(key) {
      const findKey = [...optionsMap.keys()].find(optionKey => {
        return optionKey.toLowerCase() === key.toLowerCase()
      })
      return optionsMap.get(findKey) 
    },
    isMarkOption(option) {
      if(!this.markOptions) return false
      return this.markOptions.includes(option)
    },
    isMinus(option) {
      if(!Object.values(option)[0] || typeof(Object.values(option)[0]) !== 'string') return false
      return Object.values(option)[0].includes('-')
    },
    optionValue(option) {
      const key = Object.keys(option)[0]
      const value = Object.values(option)[0] * 1
      if(canEnhance(this.item)) return this.getRangeValue(option)
      if(!this.showValueDecimal) return value

      const isIntType = ['위험도', '레일리', '성장', '버스터콜디펜드'].includes(key)
      const result = this.isCharacterInfo && !isIntType
        ? value.toFixed(2)
        : value
      return result.toLocaleString()
    },
    getUnit(option) {
      return this.pureValue ? '' : this.getOptionUnit(this.keyOf(option))
    },
    keyOf(option) {
      return Object.keys(option)[0]
    },
    getRangeValue(option) {
      const value = Object.values(option)[0] * 1
      const maxValue = valueByStack(this.item, value, maxStack(this.item))
      return `${value}${this.getUnit(option)} ~ ${(Math.round(maxValue * 1000) / 1000)}`
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/item/ItemDetailInfo.scss';
</style>