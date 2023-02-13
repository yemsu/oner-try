<template>
  <dl :class="`details type-${type} color-${colorMode} columns-${columns}`">
    <template v-for="infoName in itemDetailInfoOrder">
      <template v-if="infoName === 'option'">
        <div
          v-for="(option, i) in item[infoName]"
          :key="`itemOption${i}`"
          :class="{'option-match': isMarkOption(Object.keys(option)[0])}"
          class="wrap-detail info-option"
        >
          <dt class="title">
            {{ getOption(option, 'title') || option }}
          </dt>
          <dd class="info">
            {{ !plusMinusUnit || pureValue || isMinus(option) ? '' : '+' }}{{ optionValue(option) }} 
            {{ pureValue ? '' : getOption(option, 'unit') }}
          </dd>
        </div>
      </template>
      <div
        v-else-if="item[infoName]"
        :key="infoName"
        :class="`wrap-detail info-${infoName}`"
      >
        <dt class="title">
          {{ getPropName(infoName) }}
        </dt>
        <div
          v-if="infoName === 'ingredients'"
          class="ingredients"
        >
          <dd
            v-for="({ name, number }, i) in item[infoName]"
            :key="`ingredient${i}`"
            class="info"
          >
            {{ name }} * {{ number }}
          </dd>
        </div>
        <div
          v-else-if="itemsHasSubTitle.includes(infoName)"
          class="has-sub-title"
        >
          <dd class="title-sub">{{ item[infoName].subTitle }}</dd>
          <dd class="desc">{{ item[infoName].desc }}</dd>
        </div>
        <dd v-else class="info">{{ item[infoName] }}</dd>
      </div>
    </template>
  </dl>
</template>

<script>
import { itemDetailInfoOrder, equipmentsPropNames, percentOptions, totalOptions, itemTypeNames, itemsHasSubTitle } from '@/plugins/utils/item-def-mrpg'
export default {
  props: {
    item: {
      type: Object,
      required: true
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
  },
  computed: {
    itemDetailInfoOrder() {
      return itemDetailInfoOrder
    },
    itemsHasSubTitle() {
      return itemsHasSubTitle
    }
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
      return percentOptions.includes(key) ? '%' : ''
    },
    getOptionTitle(key) {
      const findKey = [...Object.keys(totalOptions)].find(optionKey => optionKey.toLowerCase() === key.toLowerCase())
      return totalOptions[findKey]
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
      if(!this.showValueDecimal) return value

      const valueDecimal = value
      const result = noUnitOptions.includes(key)
        ? Math.floor(value)
        : valueDecimal.toFixed(3)
      return (result * 1).toLocaleString()
    },
    getPropName(keyName) {
      return equipmentsPropNames[keyName]
    },
    getItemTypeName(keyName) {
      return itemTypeNames[keyName]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/item/ItemDetailInfo.scss';
</style>