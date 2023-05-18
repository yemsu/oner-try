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
        <base-button
          @click="onClickButton(key)"
          class="button-filter"
          :size="size"
          type="round"
          :bg="isActiveMenu(key, 'grade') ? 'active': 'inActive'"
        >
          {{ gradeTitle }}
        </base-button>
      </dd>
    </div>
  </dl>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'

export default {
  components: {
    BaseButton
  },
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
    }
  },
  data() {
    return {
      selectList: []
    }
  },
  methods: {
    isActiveMenu(key) {
      const isActiveMenu = key === 'all'
        ? this.selectList.length === 0
        : this.selectList.includes(key)
      return isActiveMenu
    },
    toggleMenu(key) {
      if(key === 'all') {
        this.selectList = []
        return
      }
      if(this.selectList.includes(key)) {
        if(!this.canMultiSelect) return
        const index = this.selectList.indexOf(key)
        this.selectList.splice(index, 1)
      } else {
        this.canMultiSelect
          ? this.selectList.push(key)
          : this.selectList = [key]
      }    
    },
    onClickButton(key) { 
      this.toggleMenu(key)
      this.$emit('onChange', this.selectList)
    }
  }
}
</script>

<style lang="scss" scoped>
.option-bar {
  display: flex;
  padding: 10px;
  background-color: var(--color-white);
  .wrap-menu {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }
  & + .option-bar {
    border-top: 1px solid var(--border-light-gray);
  }
  &.size {
    &-small {
      .title {
        width: 50px;
        font-size: $font-size-XS;
      }
      .wrap-menu {
        gap: 5px;
      }
    }
    &-medium {
      .title {
        width: 100px;
      }
      .wrap-menu {
        gap: 10px;
      }
    }
  }
}
</style>