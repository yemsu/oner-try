<template>
  <aside class="floating-menu">
    <h2 class="ir-hidden">우측 상단 플로팅 메뉴</h2>
    <section
      class="wrapper item-bookmarks"
      :class="showItemBookmarks && 'is-toggle-on'"
    >
      <h2>
        <button @click="showItemBookmarks = !showItemBookmarks">
          <span
            class="icon-arrow wide border-dark-gray"
            :class="showItemBookmarks ? 'down' : 'up'"
          >
            <span class="ir-hidden">
              {{ showItemBookmarks ? '닫기' : '펼치기' }}
            </span>
          </span>
          조합법
          <span class="emoji-star">⭐</span>
        </button>
      </h2>
      <Transition name="fade">
        <div
          v-show="showItemBookmarks"
          class="toggle-content"
        >
          <item-bookmarks
            :align-hrz="false"
            :show-name="false"
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