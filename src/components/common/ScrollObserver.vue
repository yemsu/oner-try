<template>
  <div>
    <div ref="checker"></div>
    <common-loading-indicator :is-loading="isDataLoading" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    fnLoadData: {
      type: Function,
      required: true
    },
    category: {
      type: [String, Number],
      required: true
    },
    refreshTrigger: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEnd: false,
      prevDataLength: 0,
      isDataLoading: false,
      page: 1,
    }
  },
  watch: {
    category(crr, prev) {
      this.resetStates()
      this.loadData()
    },
    refreshTrigger(crr) {
      console.log('refreshTrigger', crr)
      if(!crr) return
      this.resetStates()
      this.loadData()
      this.setToastMessage(this.$ALERTS.REFRESH_LIST_SUCCESS)
      this.setToastOn(true)
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.infiniteScroll()
      }, 300)
    })
  },
  methods: {
    ...mapMutations({
      setToastMessage: 'toastPopup/SET_MESSAGE',
      setToastOn: 'toastPopup/SET_IS_TRIGGER_ON',
    }),
    infiniteScroll() {
      const checker = this.$refs.checker
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            if(this.isEnd) {
              console.log('infiniteScroll endData')
              return
            }
            console.log('infiniteScroll start')
            // this.$emit('endScroll')
            this.loadData()
          }
        })
      })

      io.observe(checker);
    },
    async loadData() {
      if(this.isDataLoading) return 
      this.isDataLoading = true

      await this.fnLoadData(this.page)
      if(this.data.length < 15 || this.prevDataLength === this.data.length) {
        this.isEnd = true
        this.isDataLoading = false
        return
      }
      this.prevDataLength = this.data.length
      this.page += 1
      this.isDataLoading = false
    },
    resetStates() {
      this.page = 1
      this.prevDataLength = 0
      this.isEnd = 0
    }
  }
}
</script>

<style lang="scss" scoped></style>