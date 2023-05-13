<template>
  <dl class="option-bar">
    <dt class="title">{{ title }}</dt>
    <div class="wrap-menu list-button-common">
      <dd
        v-for="(gradeTitle, key) in options"
        :key="`gradeTitle${key}`"
        :class="['menu-filter', {'active': isActiveMenu(key, 'grade')}]"
      >
        <base-button
          @click="onClickButton(key)"
          class="button-filter"
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
      required: true
    },
    options: {
      type: Object,
      required: true
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
        const index = this.selectList.indexOf(key)
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(key)
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
  .title {
    width: 100px;
  }
  .wrap-menu {
    flex: 1;
  }
  & + .option-bar {
    border-top: 1px solid var(--border-light-gray);
  }
}
</style>