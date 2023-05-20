<template>
  <section v-if="itemBuild">
    <div v-if="!isMakingMode" class="content-top">
      <div class="inner-size-basic spbw" ref="copyArea">
        <item-box
          :item="itemBuild.hero"
          :wanted-paper="true"
          :size="'big'"
          :show-bounty="false"
          :customBadge="itemBuild.hero && itemBuild.hero.name"
        />
        <div class="area-page-title">
          <div class="align-left">
            <h2 class="page-title">{{ itemBuild.title }}</h2>
          </div>
        </div>
        <common-wrap-buttons position="right">
          <base-button
            type="square-round"
            size="small"
            bg="point"
            @click="isMakingMode = true"
          >수정</base-button>
          <element-copy-button
            v-if="copyArea"
            :copy-area="copyArea"
          />
        </common-wrap-buttons>
      </div>
    </div>
    
    <new-item-build
      :show-form="isMakingMode"
      @onEditSave="isMakingMode = false"
    >
      <template v-slot="{ data: { buildInfoString, onDeleteBuildItem, onClickSave } }">
        <div class="inner-size-basic">
          <section>
            <h2 class="ir-hidden">아이템빌드</h2>
            <template v-if="buildInfoString">
              <item-build
                v-if="!isMakingMode"
                :build-info="buildInfoString"
              />
              <template v-else>
                <item-build
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
import NewItemBuild from '@/components/item-build/NewItemBuild.vue';
import BaseButton from '@/components/common/BaseButton.vue';
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
    BaseButton,
    WrapButtons
  },
  data() {
    return {
      buildInfoString: null,
      isMakingMode: false,
      copyArea: null,
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
  mounted() {
    this.$nextTick(() => {
      // template에 바로 ref적용하면 에러 발생하여 별도 data값에 저장
      setTimeout(() => {
      this.copyArea = this.$refs.copyArea
      }, 500);
    })
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