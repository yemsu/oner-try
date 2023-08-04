<template>
  <div :class="['tooltip-wrap', {'flex': defaultVisible}]">
    <div
      tabindex="0"
      @focus="showTooltip"
      @blur="hideTooltip"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
    >
      <nuxt-link
        class="button-tooltip"
        :to="linkTo"
        :target="linkTarget"
        :is="linkTagName"
        :title="linkTitle"
        @click="$emit('click')"
      >
        <slot name="tooltipButton"></slot>
      </nuxt-link>
    </div>
    <div
      v-if="!defaultVisible && !noTooltipData"
      v-show="isVisibleTooltip"
      :class="[
        'tooltip',
        isOnRight ? 'right' : 'left'
      ]"
    >
      <slot name="tooltip"></slot>
    </div>
    <div v-else-if="defaultVisible">
      <slot name="tooltip"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    linkTo: {
      type: [String, Boolean],
      required: true
    },
    linkTarget: {
      type: [String, Boolean],
      default: '_blank'
    },
    linkTagName: {
      type: String,
      default: 'nuxt-link'
    },
    linkTitle: {
      type: [String, Boolean],
      default: ''
    },
    noTooltipData: {
      type: Boolean,
      default: false
    },
    defaultVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isVisibleTooltip: false,
      isOnRight: false,
    }
  },
  methods: {
    showTooltip(e) {
      this.isOnRight = (window.innerWidth - e.clientX) < (window.innerWidth / 3)
      this.isVisibleTooltip = true
    },
    hideTooltip(e) {
      this.isVisibleTooltip = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tooltip-wrap {
  &.flex {
    display: flex;
    align-items: center;
  }
}
.tooltip {
  $tooltip-bg: var(--bg-tooltip-dim);
  position: absolute;
  z-index: 2;
  top: 5px;
  background-color: $tooltip-bg;
  text-align: left;
  .tooltip-title {
    font-size: var(--font-size-S);
  }
  &:before {
    display: block;
    position: absolute;
    top: 5px;
    width: 0;
    height: 0;
    border-width: 5px 6px 5px 0;
    border-style: solid;
    border-color: $tooltip-bg;
    border-top-color: transparent;
    border-bottom-color: transparent;
    content: '';
  }
  &.left {
    right: 0;
    transform: translateX(100%);
    &:before {
      left: 0px;
      transform: translateX(-100%);
    }
  }
  &.right {
    left: 0;
    transform: translateX(-100%);
    &:before {
      right: 0;
      transform: translateX(100%) rotate(180deg);
    }
  }
}
</style>