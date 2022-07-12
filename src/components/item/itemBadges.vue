<template>
  <div :class="['item-badges', 'badges', {'position-inner': innerPosition}]">
    <template v-if="!wantedPaper">
      <p v-if="badgeDrop && item.dropMonster" class="badge drop-monster">
        드랍
      </p>
      <p
        v-if="isComp && showComp"
        :class="`badge ${isRecruit ? 'recruit' : 'mix'}`"
      >
        {{ isRecruit ? '영입' : '조합'}}
      </p>
      <p v-if="item.stack" class="badge black line-gold">
        {{ item.stack }}
      </p>
      <p v-if="item.type && showType" :class="`badge type ${item.type}`">
        {{ typeName }}
      </p>
      <p v-if="item.requiredNumber" class="badge black">
        {{ item.requiredNumber }}
      </p>
    </template>
    <p v-if="customBadge" class="badge black">
      {{ customBadge }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    wantedPaper: {
      type: Boolean,
      default: () => false
    },
    badgeDrop: {
      type: Boolean,
      default: () => true
    },
    isComp: {
      type: Boolean,
      default: () => true
    },
    showComp: {
      type: Boolean,
      default: () => true
    },
    showType: {
      type: Boolean,
      default: () => false
    },
    customBadge: {
      type: String,
      default: () => ''
    },
    innerPosition: {
      type: Boolean,
      default: () => true
    },
  },
  data() {
    return {
    }
  },
  computed: {
    isRecruit() {
      return this.item.ingredients.length === 1
    },
    typeName() {
      switch (this.item.type) {
        case 'sailor':
          return '선원'
        case 'colleague':
          return '동료'
        case 'etcItem':
          return '기타'
        default:
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.badges.position-inner {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>