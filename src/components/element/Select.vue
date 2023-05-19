<template>
  <div class="base-select">
    <label v-if="label" :for="id">{{ label }}</label>
    <select
      :id="id"
      :class="{ 'on-focus': isShowOptions}"
      @change="onChangeSelect"
      @click="onClickSelect"
      @blur="onBlurSelect"
    >
      <option>{{ label }}</option>
      <option 
        v-for="option, i in options"
        :key="`option${i}`"
        :value="option.value || option"
      >{{ option.text || option }}</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    id: {
      type: String,
      default: () => ''
    },
    label: {
      type: String,
      default: () => ''
    },
  },
  data() {
    return {
      isShowOptions: false
    }
  },
  methods: {
    onChangeSelect(e) {
      this.$emit('onChange', e.target.value)
    },
    onClickSelect() {
      this.isShowOptions = !this.isShowOptions
    },
    onBlurSelect() {
      this.isShowOptions = false
    },
  }
}
</script>

<style lang="scss" scoped>
select {
  width: 100%;
  min-width: 150px;
  padding: 10px;
  background-color: var(--color-white);
  border: 1px solid $color-point;
  color: var(--color-black);
  border-radius: 50px;
  transition: border-radius .2s;
  &.on-focus {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  option {
    padding: 5px;
  }
}
label {
  display: block;
  padding: 0 10px;
  font-size: var(--font-size-MS-pc);
  line-height: 27px;
}
</style>