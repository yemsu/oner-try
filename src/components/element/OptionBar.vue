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
        v-for="({ id, text }) in options"
        :key="`gradeTitle${id}`"
        :class="['menu-filter', {'active': isActiveMenu(id, 'grade')}]"
        :is="title ? 'dd' : 'li'"
      >
        <element-button
          @click="onClickButton(id)"
          class="button-filter"
          :size="size"
          type="round"
          :bg="isActiveMenu(id, 'grade') ? 'active': 'inActive'"
        >
          {{ text }}
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
      type: Array,
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