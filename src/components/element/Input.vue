<template>
  <div 
    :class="[
      'wrap-input',
      size,
      {'compact': isCompactMode},
      {'searching': isActive},
      usage,
      `type-${inputType}`,
      `type-${styleType}`,
    ]"
  >
    <label :is="label ? 'label' : 'div'" :for="id">
      <span v-if="inputType !== 'checkbox'" class="label-text">{{ label }}</span>
      <input
        :type="inputType === 'number' ? 'text' : inputType"
        ref="baseInput"
        :id="id"
        :placeholder="placeholder"
        :value="value"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        @input="onUpdateInput"
        @focus="onFocusInput"
        @keydown="onEnter"
      >
      <span v-if="inputType === 'checkbox'" class="label-text">{{ label }}</span>
    </label>
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
      type: [String, Number],
      default: () => ''
    },
    inputType: {
      type: String,
      default: () => 'text', // text, number, checkbox
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
      default: () => 'basic' // small, basic, big
    },
    styleType: {
      type: String,
      default: 'point' // none, point
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
    isOnFocus: {
      type: Boolean,
      default: () => false
    },
    maxlength: {
      type: String,
      default: () => null
    },
    label: {
      type: String,
      default: () => ''
    },
    autocomplete: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isOnFocus(crr, prev) {
      if(crr) {
        this.focusToInput()
      }
    }
  },
  mounted() {
    if(this.focusOnMounted) {
      this.focusToInput()
    }

    document.addEventListener('click', e => {
      const targetArea = className => e.target.closest(className)
      if(!targetArea('.wrap-input') && !targetArea('.item-match')) this.onBlurInput()
    })
  },
  methods: {
    onUpdateInput(e) {
      let value = e.target.value
      if(this.inputType === 'number' && value) {
        const number = value.match(/\d/g)
        value = number.join('')
      }
      if(this.inputType === 'checkbox') {
        value = e.target.checked
      }
      this.$emit('onUpdateInput',value)
    },
    onFocusInput() {
      this.$emit('onFocusInput')
    },
    onBlurInput() {
      this.$emit('onBlurInput')
    },
    onEnter(e) {
      if(e.key !== 'Enter') {
        this.$emit('onKeydown', this.value)
        return
      }
      this.$emit('onEnter', this.value)
    },
    focusToInput() {
      setTimeout(() => {
        this.$refs.baseInput.focus()
      }, 100);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/element/Input.scss';
</style>