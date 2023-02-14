<template>
  <div class="inner-size-basic">
    <div v-if="items.length > 0" class="area-item-list">
      <div
        v-for="(item, i) in items"
        :key="`item${i}`"
      >
        <div class="wrap-item">
          <item-box
            :item="item"
            size="small"
            type="list"
          >
          </item-box>
        </div>
        
        <item-checkbox-list
          v-if="item.ingredients"
          :items="item.ingredients"
          :id="`0${i}`"
        >
          <template v-slot="{ ingredients: ingredients1, index: index1 }">
            <item-checkbox-list
              v-if="ingredients1"
              :items="ingredients1"
              :id="`1${index1}`"
            >
              <template v-slot="{ ingredients: ingredients2, index: index2 }">
                <item-checkbox-list
                  v-if="ingredients2"
                  :items="ingredients2"
                  :id="`2${index2}`"
                >
                </item-checkbox-list>
              </template>
            </item-checkbox-list>
          </template>
        </item-checkbox-list>
      </div>
    </div>
  </div>
</template>

<script>
import itemCheckboxList from '@/components/pages/my/item-setting/itemCheckboxList.vue';
import { parseItemData } from '@/plugins/utils/item-mrpg'
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'item-setting-view',
  components: {
    itemCheckboxList
  },
  data() {
    return {
      itemSetting: null,
      items: [],
      checkList: [],
    }
  },
  computed: {
    ...mapGetters({
      equipments: 'mrpg/getEquipments',
      compositionEquips: 'mrpg/getCompositionEquips',
      materials: 'mrpg/getMaterials',
      itemSettingList: 'item-setting/getItemSettingList'
    }),
  },
  async mounted() {
    if(this.compositionEquips.length === 0) await this.getEquipments()
    if(this.materials.length === 0) await this.getMaterials()

    this.getItemSettingList()
    this.setItemSetting()
    this.setItems()
  },
  methods: {
    ...mapActions({
      getEquipments: 'mrpg/GET_EQUIPMENTS',
      getMaterials: 'mrpg/GET_MATERIALS',
      getItemSettingList: 'item-setting/GET_ITEM_SETTING_LIST',
    }),
    setItemSetting() {
      this.itemSetting = this.itemSettingList.find(({ id }) => (
        id === (this.$route.query.id * 1)
      ))
    },
    setItems() {
      const { items: itemNames } = this.itemSetting
      this.items = itemNames.map(name => {
        const item = this.compositionEquips.find(({ name: _name }) => name === _name)
        return parseItemData(item)
      })
      console.log("this.items", this.items)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>