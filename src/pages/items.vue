<template>
  <div>
    <top-menu-bar
      title="아이템 도감 메뉴"
      :menu-list="subMenus"
      :use-basic-inner="true"
      color="point-400"
    />
    <div class="inner-size-basic">
      <nuxt-child></nuxt-child>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'
import TopMenuBar from '../components/common/TopMenuBar.vue'

export default {
  components: {
    BaseButton,
    TopMenuBar
  },
  data() {
    return {
      subMenus: [
        { menuName: '선원', path: '/items/sailor' },
        { menuName: '동료', path: '/items/colleague' },
        { menuName: '선박', path: '/items/ship'},
        { menuName: '장비', path: '/items/equipment'},
        { menuName: '포션', path: '/items/potion'},
        { menuName: '기타', path: '/items/etcItem'},
      ]
    }
  },
  watch: {
    $route() {
      this.goToDefaultPage()
    }
  },
  created() {
    this.goToDefaultPage()
  },
  methods: {
    goToDefaultPage() {
      if(this.$route.fullPath === this.$route.matched[0].path) {
        this.$router.push('/items/sailor')
      }
    }
  }
}
</script>

<style>
</style>