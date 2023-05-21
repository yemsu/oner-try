<template>
  <dl
    :class="`option-bar size-${size}`"
    :is="title ? 'dl' : 'div'"
  >
    <dt v-if="title" class="title">{{ title }}</dt>
    <div
      class="wrap-menu"
      :is="title ? 'div' : 'ul'"
    >
      <dd
        v-for="(gradeTitle, key) in options"
        :key="`gradeTitle${key}`"
        :class="['menu-filter', {'active': isActiveMenu(key, 'grade')}]"
        :is="title ? 'dd' : 'li'"
      >
        <element-button
          @click="onClickButton(key)"
          class="button-filter"
          :size="size"
          type="round"
          :bg="isActiveMenu(key, 'grade') ? 'active': 'inActive'"
        >
          {{ gradeTitle }}
        </element-button>
      </dd>
    </div>
  </dl>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    options: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: () => 'medium' // small, medium
    },
    canMultiSelect: {
      type: Boolean,
      default: () => true
    },
    selectList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    isActiveMenu(key) {
      const isActiveMenu = key === 'all'
        ? this.selectList.length === 0
        : this.selectList.includes(key)
      return isActiveMenu
    },
    onClickButton(key) {
      if(key === 'all') {
        this.$emit('onChange', [])
        return
      }

      let newSelectList = null

      if(this.selectList.includes(key)) {
        if(!this.canMultiSelect) return
        newSelectList = this.selectList.filter(option => option !== key)
      } else {
        newSelectList = this.canMultiSelect
          ? [...this.selectList, key]
          : [key]
      }    
      this.$emit('onChange', newSelectList)
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/element/OptionBar.scss';
</style>