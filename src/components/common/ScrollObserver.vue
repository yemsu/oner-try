<template>
  <div ref="checker"></div>
</template>

<script>
export default {
  props: {
    isEnd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
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
            this.$emit('endScroll')
          }
        })
      })

      io.observe(checker);
    }
  }
}
</script>

<style lang="scss" scoped></style>