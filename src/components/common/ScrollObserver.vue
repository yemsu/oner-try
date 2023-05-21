<template>
  <div ref="checker"></div>
</template>

<script>
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
      this.page = 1
      this.prevDataLength = 0
      this.isEnd = 0
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
    }
  }
}
</script>

<style lang="scss" scoped></style>