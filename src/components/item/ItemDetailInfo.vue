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
      >
        <dt class="color-option">{{ getOption(option, 'title') }}</dt>
        <dd>+{{ Object.values(option)[0] }} {{ getOption(option, 'unit') }}</dd>
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
  }
}
</script>

<style lang="scss" scoped>
.details {
  &.basic {
    > div {
      display: flex;
    }
    dt {
      margin-right: 5px;
    }
  }
  &.list-main {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: 40px;
    > div {
      border-left: 2px solid rgba(0, 0, 0, 0.1);
      padding-left: 8px;
      &:nth-child(n+2) {
        margin-left: 20px;
      }
      dd {
        font-size: $font-size-M-pc;
      }
    }
  }
  .color-drop {
    color: $color-point-bright;
  }
  .color-option {
  color: $color-point-sub;
  }
}
</style>