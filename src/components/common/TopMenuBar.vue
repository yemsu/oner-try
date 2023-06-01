<template>
  <div :class="`menu-bar size-${size} color-${color}`">
    <div :class="['inner', {'inner-size-basic': useBasicInner}]">
      <nav>
        <h2 class="ir-hidden">{{ title }}</h2>
        <ul class="menu-list">
          <li
            v-for="({ path, menuName, beta }, i) in menuList"
            :key="`menu${i}`"
          >
            <element-button
              :linkTo="path"
              type="square-round"
            >
              {{ menuName }}
              <common-beta-mark v-if="beta" size="xsmall" />
            </element-button>
          </li>
        </ul>
      </nav>
      <div class="area-side-menu">
        <slot></slot>
      </div>
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
    size: {
      type: String,
      default: () => 'medium' // small, medium
    },
    color: {
      type: String,
      default: () => 'point' // point, point-400
    },
    useBasicInner: {
      type: Boolean,
      default: () => false
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