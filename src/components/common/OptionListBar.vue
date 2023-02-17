<template>
  <dl :class="`option-list-bar size-${size}`">
    <div
      v-for="({title, options}, i) in data"
      :key="`title${i}`"
      class="wrap-category"
    >
      <dt> {{ title }}</dt>
      <div class="wrap-desc">
        <dd
          v-for="(option, i) in options"
          :key="`optoin${i}`"
        >
          <base-button
            type="round"
            :bg="activeData === option.text ? 'point' : 'light-gray'"
            size="small"
            @click="selectOption(option)"
          >
            {{ option.text }}
          </base-button>
        </dd>
      </div>
    </div>
  </dl>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'

export default {
  components: {
    BaseButton,
  },
  props: {
    /** @data obj list
     * [{
     *  title: 'dt text',
     *  options: [{
     *    id: 'emitted data' // id가 없으면 text를 emit
     *    text: 'dd text',
     *  }]
     * }]
     */
    data: {
      type: Array,
      required: true,
    },
    size: {
      type: String,
      default: () => 'medium' // small, medium
    },
    showTitle: {
      type: Boolean,
      default: () => true
    },
    defaultSelect: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      activeData: null,
    }
  },
  mounted() {
    if(this.defaultSelect) {
      this.selectOption(this.data[0].options[0])
    }
  },
  methods: {
    selectOption(option) {
      if(!option) {
        console.error('selectOption: no option!', option)
        return
      }
      const { id, text } = option
      this.activeData = text
      this.$emit('selectOption', id || text)
    }
  }
}
</script>

<style lang="scss" scoped>
.option-list-bar {
  background-color: var(--color-white);
  .wrap-category {
    display: flex;
    gap: 10px;
    padding: 10px;
    &:nth-child(n+2) {
      border-top: 1px solid var(--border-light-gray);
    }
    dt {
      width: 3.5em;
    }
    .wrap-desc {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      dd {
        flex-shrink: 0;
      }
    }
  }
  &.size {
    &-small {
      font-size: $font-size-S-pc;
    }
  }
}
</style>