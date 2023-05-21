<template>
  <div class="text-editable">
    <div v-if="!showInput">
      <p :is="tagname">{{ text }}</p>
      <common-wrap-buttons v-if="editable" position="side">
        <element-button
          type="text"
          size="small"
          bg="sub"
          title="타이틀 수정"
          @click="onClickEdit"
        >
          <font-awesome-icon icon="fa-pen" />
        </element-button>
      </common-wrap-buttons>
    </div>
    <form v-else @submit="onSubmit">
      <element-input
        size="big"
        :value="inputValue"
        :is-on-focus="isOnFocus"
        @onUpdateInput="value => inputValue = value"
      />
      <common-wrap-buttons position="side">
        <element-button
          type="text"
          size="small"
          title="수정 완료"
          @click="onSubmit"
        >
          <font-awesome-icon icon="fa-pen" />
        </element-button>
        <element-button
          type="text"
          size="small"
          title="수정 취소"
          @click="onClickEditCancel"
        >
          <font-awesome-icon icon="fa-xmark" />
        </element-button>
      </common-wrap-buttons>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    tagname: {
      type: String,
      default: 'p'
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showInput: false,
      inputValue: '',
      isOnFocus: false
    }
  },
  mounted() {
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      console.log('onSubmit')
      this.showInput = false
      this.$emit('onSubmit', this.inputValue)
    },
    onClickEdit() {
      console.log('onClickEdit 1', this.showInput)
      this.inputValue =this.text
      this.showInput = true

      setTimeout(() => {
        this.isOnFocus = true
      }, 100)
      setTimeout(() => {
      this.isOnFocus = true
      }, 500)
    },
    onClickEditCancel() {
      console.log('onClickEditCancel')
      this.showInput = false
    }
  },
}
</script>

<style lang="scss" scoped>
.text-editable > * {
  display: flex;
  gap: 10px;
}
</style>