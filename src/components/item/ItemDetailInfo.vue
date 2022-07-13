<template>
  <dl :class="`details ${type}`">
    <div v-if="dropMonster">
      <dt class="color-drop">획득처</dt>
      <dd>{{ dropMonster }}</dd>
    </div>
    <template v-if="options">
      <div
        v-for="(option, i) in options"
        :key="`itemOption${i}`"
        :class="{'option-match': isMarkOption(Object.keys(option)[0])}"
      >
        <dt :class="isMinus(option) ? 'color-option-minus' : 'color-option'">
          <span v-if="isMarkOption(Object.keys(option)[0])" class="mark"> ✔ </span>
          {{ getOption(option, 'title') }}
        </dt>
        <dd>
          {{ isMinus(option) ? '' : '+' }}{{ Object.values(option)[0] }} 
          {{ getOption(option, 'unit') }}
        </dd>
      </div>
    </template>
  </dl>
</template>

<script>
import { getOptionTitle, getOptionUnit } from '@/plugins/utils/item'
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
    type: {
      type: String,
      default: () => 'basic' // list-main
    },
    markOptions: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getOption(option, optionType) {
      const key = Object.keys(option)[0]
      switch (optionType) {
        case 'title':
          return getOptionTitle(key);
        case 'unit':
          return getOptionUnit(key);      
      }
    },  
    isMarkOption(option) {
      if(!this.markOptions) return false
      return this.markOptions.includes(option)
    },
    isMinus(option) {
      if(!Object.values(option)[0]) return false
      return Object.values(option)[0].includes('-')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/item/ItemDetailInfo.scss';
</style>