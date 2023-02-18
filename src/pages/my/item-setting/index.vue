<template>
  <section>
    <h2 class="ir-hidden">목표 아이템 설정</h2>
    <div
      v-if="!isLogin"
      class="inner-size-basic"
    >
      <div
        class=""
      >
        <p><span v-if="!isLogin">구글 로그인 후, </span>목표 아이템을 설정하고 하나씩 달성해 나가보세요!</p>
        <p>아이템 선택하면, 필요한 재료 아이템을 확인할 수 있습니다.</p>
        <p>재료 아이템이 조합아이템이라면, 해당 아이템의 재료 아이템까지 확인하실 수 있어요!</p>
        <p>재료 아이템을 습득했다면, 체크! 해주세요.</p>
        <p>목표 아이템을 위해 필요한 재료아이템 총합도 확인할 수 있습니다. 체크한 아이템은 계산에서 제외됩니다!</p>
      </div>
    </div>
    <div v-else>
      <div class="inner-size-basic pd-top-medium">
        <!-- 리스트 -->
        <section>
          <div class="area-page-title mb-big">
            <h2 class="title">🔥 {{ nickname }}님이 설정한 목표 아이템</h2>
            <base-button
              type="square-round"
              bg="point-sub"
              class="btn-create-setting"
              @click="showAddItemSetting = !showAddItemSetting"
            >
              + NEW
            </base-button>
          </div>
          <item-setting-list
            v-if="itemSettingList"
            :item-setting-list="itemSettingList"
            @delete="onDeleteItemSetting"
          />
        </section>
      </div>
    </div>
    <make-item-setting
      v-if="compositionEquips.length > 0"
      :show="showAddItemSetting"
      :equipment-types="equipmentTypes"
      @submit="onSubmit"
      @close="showAddItemSetting = false"
    />
  </section>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'
import MakeItemSetting from '@/components/pages/my/item-setting/MakeItemSetting.vue'
import ItemSettingList from '@/components/pages/my/item-setting/ItemSettingList.vue'
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'item-setting',
  components: {
    BaseButton,
    MakeItemSetting,
    ItemSettingList
  },
  data() {
    return {
      showAddItemSetting: false,
      equipMatchingDataList: null,
      equipmentTypes: null,
    }
  },
  watch: {
    isLogin(crr, prev) {
      if(crr && crr !== prev) {
        this.getItemSettingList()
      } else if (!crr && crr !== prev) {
        this.resetItemSettingList()
      }
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      nickname: 'auth/getNickname',
      compositionEquips: 'mrpg/getCompositionEquips',
      materials: 'mrpg/getMaterials',
      itemSettingList: 'item-setting/getItemSettingList',
    }),
  },
  async created() {
    if(this.compositionEquips.length === 0) await this.getEquipments()
    if(this.materials.length === 0) await this.getMaterials()
    this.isLogin && await this.getItemSettingList()
  },
  methods: {
    ...mapMutations({
      addItemSetting: 'item-setting/ADD_ITEM_SETTING',
      resetItemSettingList: 'item-setting/RESET_ITEM_SETTING_LIST',
    }),
    ...mapActions({
      getEquipments: 'mrpg/GET_EQUIPMENTS',
      getMaterials: 'mrpg/GET_MATERIALS',
      getItemSettingList: 'item-setting/GET_ITEM_SETTING_LIST',
      postItemSetting: 'item-setting/POST_ITEM_SETTING',
      deleteItemSetting: 'item-setting/DELETE_ITEM_SETTING',
    }),
    async onSubmit(result) {
      this.postItemSetting(result)
    },
    onDeleteItemSetting(id) {
      this.deleteItemSetting(id)
    },
  }
}
</script>

<style lang="scss" scoped></style>