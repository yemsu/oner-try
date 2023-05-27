<template>
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
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: $floating-z-index;
  max-width: 80px;
  border: 2px solid var(--color-black);
  transition: border-radius .3s;
  box-shadow: 5px 5px 10px var(--color-shadow);
  &:not(.is-toggle-on) {
    background-color: hsl(var(--hsl-white), 80%);
    border-radius: 30px;
  }
  &.is-toggle-on {
    background-color: hsl(var(--hsl-white), 80%);
    border-radius: 5px;
  }
  > h2 {
    font-size: var(--font-size-S);
    button {
      width: 100%;
      padding: 10px;
      text-align: center;
      .icon-arrow {
        display: block;
        margin: 0 auto 8px;
      }
    }
  }
  .toggle-content {
    @include scrollBar;
    overflow-y: auto;
    max-height: 60vh;
    padding: 10px;
    border-bottom: 1px solid var(--border-gray);
  }
  &.item-bookmarks {
    display: flex;
    flex-direction: column-reverse;
  }
@include mobile {
  bottom: 10px;
  right: 10px;
    border-width: 1px;
  button {
    font-size: var(--font-size-S);
  }
}
}
.emoji-star {
  font-size: 0.9em;
}
</style>