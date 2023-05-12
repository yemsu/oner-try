<template>
  <div v-if="description" class="details">
    <p>{{ description }}</p>
  </div>
  <dl v-else :class="`details type-${type} color-${colorMode} columns-${columns}`">
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
          {{ getOption(option, 'title') }}
        </dt>
        <dd>
          {{ !plusMinusUnit || pureValue || isMinus(option) ? '' : '+' }}
          {{ optionValue(option) }}{{ getUnit(option) }}
        </dd>
      </div>
    </template>
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
      default: () => 'basic' // basic, list-main, total
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
  },
  methods: {
    getOption(option, optionType) {
      const key = Object.keys(option)[0]
      switch (optionType) {
        case 'title':
          return this.getOptionTitle(key);
        case 'unit':
          return this.getOptionUnit(key);      
      }
    },  
    getOptionUnit(key) {
      return noUnitOptions.includes(key) ? '' : '%'
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
      const value = Object.values(option)[0]
      const key = Object.keys(option)[0]
      if(canEnhance(this.item)) return this.getRangeValue(option)
      if(!this.showValueDecimal) return value

      const valueDecimal = value
      const result = noUnitOptions.includes(key)
        ? Math.floor(value)
        : valueDecimal.toFixed(3)
      return (result * 1).toLocaleString()
    },
    getUnit(option) {
      return this.pureValue ? '' : this.getOption(option, 'unit')
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