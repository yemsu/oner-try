<template>
  <div :class="`menu-bar size-${size} color-${color}`">
    <nav>
      <h2 class="ir-hidden">{{ title }}</h2>
      <ul class="menu-list">
        <li
          v-for="({ path, menuName }, i) in menuList"
          :key="`menu${i}`"
        >
          <nuxt-link :to="path">{{ menuName }}</nuxt-link>
        </li>
      </ul>
    </nav>
    <div class="area-side-menu">
      <ul class="menu-list-side">
        <li
          v-for="({ path, menuName }, i) in sideMenuList"
          :key="`utilMenu${i}`"
        >
          <a
            v-if="path.includes('http')"
            :href="path"
            target="_blank"
            title="새창"
          >{{ menuName }}</a>
          <nuxt-link
            v-else
            :to="path"
          >{{ menuName }}</nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
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
@import '@/assets/style/components/common/TopBarMenu.scss';
</style>