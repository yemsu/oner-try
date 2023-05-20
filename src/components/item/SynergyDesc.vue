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
        <dd>
          <item-detail-info
            :options="synergy.option"
            :highlightTitle="false"
            :size="size"
          />
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
      default: () => 'medium' // small, medium
    }
  },
  methods: {
    isNegative(synergy) {
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
  }
}
</style>