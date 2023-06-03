<template>
  <div :class="`list-infinite dir-${direction}`">
    <div
      :class="[
        'text-refer',
        {top: direction === 'column'}
      ]"
    >
      <p v-if="dataList && showLength">총 {{ dataList.length }}개</p>
      <element-refresh-button
        :only-icon="direction === 'row'"
        :is-on-refresh="refreshTrigger"
        @click="refreshData"
      />
      <div v-if="textNotice" class="align-right">
        <span>
          {{ textNotice }}
        </span>
      </div>
    </div>
    <template v-if="!noDataMessage || (noDataMessage && dataList && dataList.length > 0)" >
      <slot></slot>
    </template>
    <element-no-data
      v-else-if="noDataMessage && dataList && dataList.length === 0"
      :message="noDataMessage"
    />
    <common-scroll-observer
      :data="dataList || []"
      :fn-load-data="loadData"
      :category="dataType"
      :refresh-trigger="refreshTrigger"
      :no-toast-popup="noToastPopup"
    />
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      type: [Array, null],
      default: null
    },
    direction: {
      type: String,
      default: 'column' // column, row
    },
    loadData: {
      type: Function,
      required: true
    },
    dataType: {
      type: [String, Number],
      required: true
    },
    showLength: {
      type: Boolean,
      default: false
    },
    noDataMessage: {
      type: String,
      default: ''
    },
    textNotice: {
      type: String,
      default: ''
    },
    parentRefreshTrigger: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      refreshTrigger: false,
      noToastPopup: false
    }
  },
  watch: {
    parentRefreshTrigger(crr) {
      if(!crr) return
      this.refreshData(true)
    }
  },
  methods: {
    refreshData(noToastPopup) {
      if(this.refreshTrigger) this.refreshTrigger = false
      if(this.noToastPopup) this.noToastPopup = false
      setTimeout(() => {
        this.refreshTrigger = true
        this.noToastPopup = noToastPopup
      }, 500);
    },
  }
}
</script>

<style lang="scss" scoped>
.list-infinite {
  &.dir {
    &-column {
      
    }
    &-row {
      display: flex;
      gap: 10px;
      li {
        flex-shrink: 0;
      }
    }
  }
}
</style>