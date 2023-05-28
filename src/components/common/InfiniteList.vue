<template>
  <div class="list-infinite">
    <template v-if="dataList && dataList.length > 0" >
      <div class="text-refer top">
        <p>총 {{ dataList.length }}개</p>
        <div class="align-right">
          <element-refresh-button @click="refreshData" />
        </div>
      </div>
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
      type: String,
      required: true
    },
    noDataMessage: {
      type: String,
      default: () => ''
    },
  },
  data() {
    return {
      refreshTrigger: false
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