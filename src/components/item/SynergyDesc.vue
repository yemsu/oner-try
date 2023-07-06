<template>
  <div :class="`synergy-desc size-${size}`">
    <dl class="synergies">
      <div
        v-for="(synergy, i) in synergies"
        :key="`synergy${synergy.name}${i}`"
        class="box-gray"
      >
        <dt :class="`title color-${classNegaPosi(synergy)}`">
          {{ synergy.name }}
        </dt>
        <dd v-if="synergy.option">
          <item-detail-info
            :options="synergy.option"
            :highlightTitle="false"
            :size="size"
          />
        </dd>
        <dd v-if="synergy.optionTypes" class="option-types">
          <template v-for="(optionType) in synergy.optionTypes">
            <div
              :key="`optionType-${optionType.title}`"
              class="option-type"
            >
              <span class="title-option-type">
                {{ optionType.title }}
              </span>
              <item-detail-info
                :options="optionType.option"
                :highlightTitle="false"
                :size="size"
              />
            </div>
          </template>
        </dd>
        <dd class="sailors badges badge-gap">
          <!-- <span class="badge black">선원</span> -->
          <!-- {{ synergy.sailors.join(', ') }} -->
          <element-badge
            v-for="(sailor, i) in synergy.sailors"
            :key="`sailor${i}`"
            :size="size === 'medium' ? 'big' : size"
            type="square-round"
            :line="classNegaPosi(synergy)"
          >
            {{ sailor }}
          </element-badge>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
export default {
  props: {
    synergies: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: () => 'small' // small, medium
    }
  },
  methods: {
    isNegative(synergy) {
      if(!synergy?.option) return false
      const sampleValue = Object.values(synergy.option[0])[0]
      return sampleValue.includes('-')
    },
    classNegaPosi(synergy) {
      return this.isNegative(synergy) ? 'negative' : 'positive'
    }
  }
}
</script>

<style lang="scss" scope>
.synergies {
  dd {
    & + dd {
      margin-top: 6px;
    }
    &.option-types {
      display: flex; 
      gap: 5px 5px;
      flex-wrap: wrap;
      > .option-type {
        display: flex; 
        gap: 10px;
        padding: 5px 8px 5px 6px;
        border-radius: 5px;
        background-color: var(--darker-10);
        .details:nth-child(n+2) {
          margin-top: 0;
        }
      }
    }
  }
}
</style>