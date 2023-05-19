<template>
  <section v-if="itemBuild">
    <div class="content-top">
      <div class="inner-size-basic">
        <item-box
          :item="itemBuild.hero"
          :wanted-paper="true"
          :size="'big'"
          :show-bounty="false"
          :customBadge="itemBuild.hero.name"
        />
        <div class="area-page-title">
          <div class="align-left">
            <h2 class="page-title">{{ itemBuild.title }}</h2>
          </div>
        </div>
      </div>
    </div>
    
    <new-item-build>
      <template v-slot="{ data: { buildInfoString, onDeleteBuildItem, onClickSave } }">
        <div class="inner-size-basic">
          <section>
            <h2 class="ir-hidden">아이템빌드</h2>
            <template v-if="buildInfoString">
              <item-build
                v-if="!isMakingMode"
                :build-info="buildInfoString"
              />
              <item-build
                v-else
                :build-info="buildInfoString"
                :making-mode="true"
                @delete="onDeleteBuildItem"
              />
              <wrap-buttons>
                <base-button
                  type="square-round"
                  size="large"
                  bg="point"
                  @click="onClickSave"
                >빌드 저장</base-button>
              </wrap-buttons>
            </template>
          </section>
        </div>
      </template>
    </new-item-build>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ItemBuild from '@/components/item/ItemBuild.vue'
import NewItemBuild from '../../../components/item-build/NewItemBuild.vue';
import WrapButtons from '@/components/common/WrapButtons.vue';
import setMeta from '@/plugins/utils/meta';

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `${this.itemBuild?.title ? `${this.itemBuild.title} - ` : ''}MY 빌드`,
      description: 'MY 빌드 상세페이지. 작성한 빌드에 대한 시너지, 토탈 스탯 등 자세한 내용을 확인할 수 있습니다.',
    })
  },
  components: {
    ItemBuild,
    NewItemBuild,
    WrapButtons
  },
  data() {
    return {
      buildInfoString: null,
      isMakingMode: false
    }
  },
  computed: {
    ...mapGetters({
      itemBuild: 'itemBuild/getItemBuild'
    }),
  },
  async created() {
    const res = await this.getItemBuild(this.$route.params.id)
    if(!res) return
    this.buildInfoString = JSON.stringify(this.itemBuild)
  },
  methods: {
    ...mapActions({
      getItemBuild: 'itemBuild/GET_ITEM_BUILD'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/item-build/my/id.scss';
</style>