<template>
  <div 
    :class="[
      'wrap-input',
      `size-${size}`,
      {'compact': isCompactMode},
      {'searching': isActive},
      usage
    ]"
  >
    <input
      ref="baseInput"
      :id="id"
      :type="inputType"
      :placeholder="isCompactMode ? '' : placeholder"
      :value="value"
      maxlength="100"
      @input="onUpdateInput"
      @focus="onFocusInput"
      @keydown="onEnter"
    >
    <!-- <svg v-show="usage === 'search'" class="svg-icon" viewBox="0 0 20 20">
      <path fill="none" d="M19.129,18.164l-4.518-4.52c1.152-1.373,1.852-3.143,1.852-5.077c0-4.361-3.535-7.896-7.896-7.896
        c-4.361,0-7.896,3.535-7.896,7.896s3.535,7.896,7.896,7.896c1.934,0,3.705-0.698,5.078-1.853l4.52,4.519
        c0.266,0.268,0.699,0.268,0.965,0C19.396,18.863,19.396,18.431,19.129,18.164z M8.567,15.028c-3.568,0-6.461-2.893-6.461-6.461
        s2.893-6.461,6.461-6.461c3.568,0,6.46,2.893,6.46,6.461S12.135,15.028,8.567,15.028z"></path>
    </svg> -->
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    inputType: {
      type: String,
      default: () => 'text',
    },
    placeholder: {
      type: String,
      default: () => ''
    },
    usage: {
      type: String,
      default: () => ''
    },
    size: {
      type: String,
      default: () => 'medium' // small, medium, big
    },
    isCompactMode: {
      type: Boolean,
      default: () => false
    },
    isActive: {
      type: Boolean,
      default: () => false
    },
    focusOnMounted: {
      type: Boolean,
      default: () => false
    },
    id: {
      type: String,
      default: () => ''
    },
    // props 값이 true가 되었을때 input에 focus 이동
    // true 설정 후 사용 컴포넌트에서 해당 props에 지정한 값 reset 필요
    focusTime: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    focusTime(crr, prev) {
      if(!crr || prev) return
      this.focusToInput()
    }
  },
  mounted() {
    if(this.focusOnMounted) {
      setTimeout(() => {
        this.focusToInput()
      }, 100);
    }

    document.addEventListener('click', e => {
      const targetArea = className => e.target.closest(className)
      if(!targetArea('.wrap-input') && !targetArea('.item-match')) this.onBlurInput()
    })
  },
  methods: {
    onUpdateInput(e) {
      this.$emit('onUpdateInput', e.target.value)
    },
    onFocusInput() {
      this.$emit('onFocusInput')
    },
    onBlurInput() {
      this.$emit('onBlurInput')
    },
    onEnter(e) {
      if(e.key !== 'Enter') return
      this.$emit('onEnter', this.value)
    },
    focusToInput() {
      this.$refs.baseInput.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/common/BaseInput.scss';
</style>