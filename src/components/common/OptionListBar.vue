<template>
  <dl :class="`option-list-bar size-${size}`">
    <div
      v-for="({title, dataList}, i) in data"
      :key="`title${i}`"
      class="wrap-category"
    >
      <dt> {{ title }}</dt>
      <div class="wrap-desc">
        <dd
          v-for="(data, i) in dataList"
          :key="`data${i}`"
        >
          <base-button
            type="round"
            :bg="activeData === data ? 'point' : 'light-gray'"
            size="small"
            @click="clickButton(data)"
          >
            {{ data }}
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
    data: {
      type: Array,
      required: true,
    },
    size: {
      type: String,
      default: () => 'medium' // small, medium
    }
  },
  data() {
    return {
      activeData: null,
    }
  },
  methods: {
    clickButton(data) {
      console.log('clickButton', data)
      this.activeData = data
      this.$emit('clickButton', data)
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