<template>
  <div>
    <div
      v-for="({title, character, items, id}, i) in itemSettingList"
      :key="`itemSetting${i}`"
    >
      <p>{{ title }}</p>
      <p>{{ character }}</p>
      <ul>
        <li
          v-for="(itemName, i) in items"
          :key="`savedItem${i}`"
        >
          {{ itemName }}
        </li>
      </ul>
      <base-button
        @click="deleteItemSetting(id)"
      >
        삭제
      </base-button>
      <base-button
        :link-to="`/my/item-setting/view?id=${id}`"
      >
        자세히 보기
      </base-button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    itemSettingList: {
      type: Array,
      required: true 
    }
  },
  data() {
    return {
    }
  },
  methods: {
    ...mapMutations({
      deleteItemSetting: 'item-setting/DELETE_ITEM_SETTING',
    })
  }
}
</script>

<style lang="scss" scoped></style>