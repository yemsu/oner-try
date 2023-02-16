<template>
  <div class="item-setting-list">
    <div
      v-for="({title, character, items, id}, i) in itemSettingList"
      :key="`itemSetting${i}`"
      class="box-item-setting"
    >
      <nuxt-link
        :to="`/my/item-setting/view?id=${id}`"
        title="뿌.시.러.가.기"
      >
        <div class="wrap-info">
          <p class="title">{{ title }}</p>
          <p class="character">{{ character }}</p>
          <ul class="list-item-name">
            <li
              v-for="({name, grade}, i) in items"
              :key="`savedItem${i}`"
              :class="`item-name grade-${gradeCode(grade)}`"
            >
              {{ name }}
            </li>
          </ul>
        </div>
      </nuxt-link>
        
        <base-button
          size="small"
          color="cancel"
          @click="deleteItemSetting(id)"
        >
          삭제
        </base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from '../../../common/BaseButton.vue';
import { findKeyName } from '@/plugins/utils'
import { gradesDef } from '@/plugins/utils/item-def'
import { mapMutations } from 'vuex';

export default {
  props: {
    itemSettingList: {
      type: Array,
      required: true 
    }
  },
  components: {
    BaseButton
  },
  data() {
    return {
    }
  },
  methods: {
    ...mapMutations({
      deleteItemSetting: 'item-setting/DELETE_ITEM_SETTING',
    }),
    gradeCode(name) {
      return findKeyName(gradesDef, name)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/my/item-setting/ItemSettingList.scss';
</style>