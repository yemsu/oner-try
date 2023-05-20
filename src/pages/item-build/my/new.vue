<template>
  <div>
    <div class="inner-size-basic mrg-top-medium">
      <div class="area-page-title">
        <h2 class="title">🔥 빌드 만들기</h2>
      </div>
    </div>
    <new-item-build>
      <template v-slot="{ data: { buildInfoString, onDeleteBuildItem, onClickSave } }">
        <section>
          <h2 class="ir-hidden">선택한 아이템빌드</h2>
          <item-build
            v-if="buildInfoString"
            :build-info="buildInfoString"
            :making-mode="true"
            @delete="onDeleteBuildItem"
          />
        </section>
        <wrap-buttons>
          <element-button
            type="square-round"
            size="large"
            bg="point"
            @click="onClickSave"
          >빌드 저장</element-button>
        </wrap-buttons>
      </template>
    </new-item-build>
  </div>
</template>

<script>
import setMeta from '@/plugins/utils/meta';
import NewItemBuild from '@/components/item-build/NewItemBuild.vue';
import WrapButtons from '@/components/common/WrapButtons.vue';
import ItemBuild from '@/components/item/ItemBuild.vue'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `MY 빌드 만들기`,
      description: 'MY 빌드 만들기. 나만의 빌드를 만들어볼 수 잇습니다.',
    })
  },
  components: {
    ItemBuild,
    WrapButtons,
    NewItemBuild,
  },
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `빌드 만들기`,
      description: `나만의 빌드를 만들어 보세요!`,
    })
  },
  data() {
    return {
    }
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/item-build/new.scss';
</style>