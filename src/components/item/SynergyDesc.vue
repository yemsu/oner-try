<template>
  <section>
    <h2 class="ir-hidden">시너지</h2>
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
          />
        </dd>
        <dd class="sailors badges badge-gap">
          <!-- <span class="badge black">선원</span> -->
          <!-- {{ synergy.sailors.join(', ') }} -->
          <span
            v-for="(sailor, i) in synergy.sailors"
            :key="`sailor${i}`"
            :class="`badge size-big type-round line-${classNegaPosi(synergy)}`"
          >
            {{ sailor }}
          </span>
        </dd>
      </div>
    </dl>
  </section>
</template>

<script>
export default {
  props: {
    synergies: {
      type: Array,
      default: () => []
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