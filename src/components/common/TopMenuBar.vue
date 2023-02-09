<template>
  <div :class="`menu-bar size-${size} color-${color}`">
    <nav>
      <h2 class="ir-hidden">{{ title }}</h2>
      <ul class="menu-list">
        <li
          v-for="({ path, menuName }, i) in menuList"
          :key="`menu${i}`"
        >
            <base-button 
              :linkTo="path"
              type="square-round"
            >
              {{ menuName }}
            </base-button>
        </li>
      </ul>
    </nav>
    <div class="area-side-menu">
      <ul class="menu-list-side">
        <li
          v-for="({ path, menuName }, i) in sideMenuList"
          :key="`utilMenu${i}`"
        >
          <base-button 
            :link-to="path"
            type="square-round"
          >
            {{ menuName }}
          </base-button>
        </li>
      </ul>
    </div>
  </div>
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
      default: () => '상단 메뉴'
    },
    menuList: {
      type: Array,
      default: () => []
    },
    sideMenuList: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: () => 'medium' // small, medium
    },
    color: {
      type: String,
      default: () => 'point' // point, 
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/common/TopMenuBar.scss';
</style>