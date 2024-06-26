<template>
  <div
    v-if="badges.length > 0 || customBadge"
    :class="['item-badges', 'badges', {'position-inner': innerPosition}]"
  >
    <template v-if="!wantedPaper">
      <p
        v-for="(badge, i) in badges"
        :key="`badge${i}`"
        :class="`badge ${badge.className}`"
      >
        {{ badge.text }}
      </p>
    </template>
    <p v-if="customBadge" class="badge black">
      {{ customBadge }}
    </p>
  </div>
</template>

<script>
import { canEnhance, gradesDef } from '@/plugins/utils/item-def'

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
    customBadge: {
      type: String,
      default: () => null
    },
    size: {
      type: String,
      default: 'medium' // small, medium, 
    },
    innerPosition: {
      type: Boolean,
      default: () => true
    },
    showBadges: {
      type: Array,
      default: () => ['type', 'howGet', 'stack', 'requiredNumber', 'custom']
    }
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
    },
    badges() {
      const result = this.badgesInfo.filter(badgeInfo => (
        badgeInfo.condition && badgeInfo.text && this.showBadge(badgeInfo.name)
      ))
      return result
    },
    badgesInfo() {
      const { type, stack, grade, requiredNumber, dropMonster, ingredients } = this.item
      const howGetItemList = {
        'recruit': '영입',
        'composition': '조합',
        'drop-monster': '드랍',
      }
      const howGetKey = ingredients
        ? this.isRecruit ? 'recruit' : 'composition'
        : 'drop-monster'
      return [
        {
          name: 'type',
          condition: type,
          text: this.typeName,
          className: `type ${type}`,
        },
        {
          name: 'grade',
          condition: grade,
          text: gradesDef[grade],
          className: `grade ${grade}`,
        },
        {
          name: 'howGet',
          condition: dropMonster && dropMonster !== '전용무기' || ingredients,
          text: howGetItemList[howGetKey],
          className: howGetKey
        },
        {
          name: 'stack',
          condition: stack,
          text: stack,
          className: `black line-gold`
        },
        {
          name: 'requiredNumber',
          condition: requiredNumber,
          text: requiredNumber,
          className: 'black'
        },
        {
          name: 'custom',
          condition: this.customBadge,
          text: this.customBadge,
          className: 'black'
        },
      ]
    }
  },
  mounted() {
    console.log("customBadge", this.customBadge)
  },
  methods: {
    showBadge(type) {
      const showBadge = this.showBadges.includes(type)
      if(type === 'stack') return this.item.stack > 0 || canEnhance(this.item) && showBadge
      return showBadge
    }
  }
}
</script>

<style lang="scss" scoped>
.badges.position-inner {
  flex-wrap: nowrap;
  gap: 0;
  position: absolute;
  right: 0;
  bottom: 0;
}
.badge {
  white-space: nowrap;
  &.composition {
    background-color: var(--badge-color-orange-light);
  }
  &.recruit {
    background-color: var(--badge-color-green-light);
  }
  &.type {
    background-color: var(--color-point);
    color: $color-white;
    font-weight: 300;
    &.sailor {
      background-color: var(--badge-color-blue);
    }
    &.colleague {
      background-color: var(--badge-color-green);
    }
  }
  &.grade {
    &.common {
      background-color: var(--color-grade-common);
    }
    &.uncommon {
      background-color: var(--color-grade-uncommon);
    }
    &.special {
      background-color: var(--color-grade-special);
    }
  }
}
</style>