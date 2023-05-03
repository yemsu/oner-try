<template>
  <aside class="floating-menu">
    <h2 class="ir-hidden">우측 하단 플로팅 메뉴</h2>
    <section
      class="wrapper item-bookmarks"
      :class="showItemBookmarks && 'is-toggle-on'"
    >
      <h2>
        <button
          @click="showItemBookmarks = !showItemBookmarks"
          :title="showItemBookmarks ? '접기' : '펼치기'"
        >
          <span
            class="icon-arrow wide border-black"
            :class="showItemBookmarks ? 'down' : 'up'"
          ></span>
          조합법<span class="emoji-star">⭐</span>
        </button>
      </h2>
      <Transition name="fade">
        <div
          v-show="showItemBookmarks"
          class="toggle-content"
        >
          <item-bookmarks
            :align-hrz="false"
            :show-tooltip="false"
            item-size="small"
          />
        </div>
      </Transition>
    </section>
  </aside>
</template>

<script>
import ItemBookmarks from '../item/ItemBookmarks.vue';

export default {
  components: {
    ItemBookmarks
  },
  data() {
    return {
      showItemBookmarks: false
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/layout/FloatingMenu.scss';
</style>