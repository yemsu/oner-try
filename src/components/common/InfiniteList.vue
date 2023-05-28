<template>
  <div class="list-infinite">
    <div class="text-refer top">
      <p v-if="dataList && showLength">총 {{ dataList.length }}개</p>
      <element-refresh-button @click="refreshData" />
      <div class="align-right">
        <span v-if="textNotice">
          {{ textNotice }}
        </span>
      </div>
    </div>
    <template v-if="dataList && dataList.length > 0" >
      <slot></slot>
    </template>
    <element-no-data
      v-else-if="dataList && dataList.length === 0"
      :message="noDataMessage"
    />
    <common-scroll-observer
      :data="dataList || []"
      :fn-load-data="loadData"
      :category="dataType"
      :refresh-trigger="refreshTrigger"
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
      refreshTrigger: false
    }
  },
  watch: {
    parentRefreshTrigger(crr) {
      if(!crr) return
      this.refreshData()
    }
  },
  methods: {
    refreshData() {
      if(this.refreshTrigger) this.refreshTrigger = false
      setTimeout(() => {
        this.refreshTrigger = true
      }, 500);
    },
  }
}
</script>

<style></style>