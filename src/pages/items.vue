<template>
  <div>
    <div class="top-bar">
      <div class="inner-size-basic">
        <ul class="list-button-common">
          <li
            v-for="(subMenu, i) in subMenus"
            :key="`subMenu${i}`"
          >
            <nuxt-link
              :to="'/items/' + subMenu.name"
              class="sub-nav-common"
            >
              {{ subMenu.title }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="inner-size-basic">
      <nuxt-child></nuxt-child>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subMenus: [
        { title: '선원', name: 'sailor' },
        { title: '동료', name: 'colleague' },
        { title: '선박', name: 'ship'}
      ]
    }
  },
  created() {
    this.$router.push('/items/sailor')
  }
}
</script>

<style>
</style>