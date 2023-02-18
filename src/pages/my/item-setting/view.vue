<template>
  <section class="inner-size-wide mrg-top-medium">
    <div class="grid-check-list">
      <div
        v-if="itemSetting"
        class="box-grid"
      >
        <h2>{{ itemSetting.title }}</h2>
        <p>{{ itemSetting.character }}</p>
        <p>{{ itemSetting.regDt }}</p>
      </div>
      <template v-if="items.length > 0">
        <div
          v-for="(item, i) in items"
          :key="`item${i}`"
          class="box-grid"
        >
          <p :class="`box-target-item grade-${gradeCode(item.grade)}`">
            <span class="wrap-badge">
              <span class="badge target-grade">{{ item.grade }}</span>
              <span class="badge black target-type"> {{ itemTypeName(item.type) }}</span>
            </span>
            <span class="target-name">{{ item.name }}</span>
          </p>
      
          <div class="area-check-list">
            <item-check-list
              v-if="item.ingredients"
              :items="item.ingredients"
              :id="`${i}`"
              depth="0"
            >
              <template v-slot="{ ingredients: ingredients1, index: index1 }">
                <item-check-list
                  v-if="ingredients1"
                  :items="ingredients1"
                  :id="`${i}${index1}`"
                  depth="1"
                >
                  <template v-slot="{ ingredients: ingredients2, index: index2 }">
                    <item-check-list
                      v-if="ingredients2"
                      :items="ingredients2"
                      :id="`${i}${index1}${index2}`"
                      depth="2"
                    >
                      <template v-slot="{ ingredients: ingredients3, index: index3 }">
                        <item-check-list
                          v-if="ingredients3"
                          :items="ingredients3"
                          :id="`${i}${index1}${index2}${index3}`"
                          depth="3"
                        >
                        </item-check-list>
                      </template>
                    </item-check-list>
                  </template>
                </item-check-list>
              </template>
            </item-check-list>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import ItemCheckList from '@/components/pages/my/item-setting/ItemCheckList.vue';
import { parseItemData } from '@/plugins/utils/item-mrpg'
import { gradesDef, itemTypeNames } from '@/plugins/utils/item-def-mrpg'
import { findKeyName } from '@/plugins/utils'
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'item-setting-view',
  components: {
    ItemCheckList
  },
  data() {
    return {
      itemSetting: null,
      items: [],
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      equipments: 'mrpg/getEquipments',
      compositionEquips: 'mrpg/getCompositionEquips',
      materials: 'mrpg/getMaterials',
      itemSettingList: 'item-setting/getItemSettingList'
    }),
  },
  watch: {
    isLogin(crr, prev) {
      if (!crr && crr !== prev) {
        this.$router.push({name: 'my-item-setting'})
      }
    }
  },
  async created() {
    if(this.compositionEquips.length === 0) await this.getEquipments()
    if(this.materials.length === 0) await this.getMaterials()
    if(this.itemSettingList.length === 0) await this.getItemSettingList()
    this.setItemSetting()
    this.setItems()
  },
  methods: {
    ...mapActions({
      getEquipments: 'mrpg/GET_EQUIPMENTS',
      getMaterials: 'mrpg/GET_MATERIALS',
      getItemSettingList: 'item-setting/GET_ITEM_SETTING_LIST'
    }),
    setItemSetting() {
      this.itemSetting = this.itemSettingList.find(({ id }) => (
        id === (this.$route.query.id * 1)
      ))
    },
    setItems() {
      const { items } = this.itemSetting
      this.items = items.map(({name}) => {
        const item = this.compositionEquips.find(({ name: _name }) => name === _name)
        return parseItemData(item)
      })
      console.log("this.items", this.items)
    },
    gradeCode(name) {
      return findKeyName(gradesDef, name)
    },
    itemTypeName(type) {
        return itemTypeNames[type]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/my/item-setting/view.scss';
</style>