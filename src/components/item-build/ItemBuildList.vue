<template>
  <div>
    <div class="text-refer top">
      <p>총 {{ itemBuilds.length }}개</p>
    </div>
    <section class="item-build-list">
      <h2 class="ir-hidden">아이템 빌드 리스트</h2>
      <div
        v-for="itemBuild in itemBuilds"
        :key="itemBuild.id"
        class="box-item-build"
      >
        <nuxt-link :to="`/item-build/my/${itemBuild.id}`">
          <div class="wrap-info-main">
            <div class="main-top">
              <div class="wrap-title">
                <item-box
                  :item="itemBuild.hero"
                  size="xsmall"
                  :is-round-img="true"
                  :show-name="false"
                  :title="itemBuild.hero.name"
                />
                <div class="wrap-text">
                  <h3 class="title">{{ itemBuild.title }}</h3>
                  <p v-if="itemBuild.description" class="desc">{{ itemBuild.description }}</p>
                </div>
              </div>
              <p class="regDt">{{ itemBuild.regDt }}</p>
            </div>
          </div>
          <div class="area-item-list">
            <dl class="item-type-list">
              <template
                v-for="({ keyName, title }) in itemBuildDataTypes"
              >
                <div
                  :key="`itemBuildDataType${keyName}`"
                  :class="`wrap-item-list ${keyName}`"
                >
                  <dt class="title-item-list ir-hidden">{{  title  }}</dt>
                  <dd
                    v-for="(item, i) in itemBuild[keyName]"
                    :key="`e${i}${itemBuild.id}${item ? item.id : 'blank'}`"
                  >
                    <item-image
                      :item="item"
                      size="xsmall"
                    />
                  </dd>
                </div>
              </template>
            </dl>
          </div>
        </nuxt-link>
        <div class="wrap-button-delete">
          <base-button
            type="text"
            size="xsmall"
            bg="sub"
            @click="$emit('delete', itemBuild.id)"
          >삭제</base-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BaseButton from '../common/BaseButton.vue';

export default {
  components: {
    BaseButton,
  },
  props: {
    itemBuilds: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      itemBuildDataTypes: [
        {
          keyName: 'equipment',
          title: '장비'
        },
        {
          keyName: 'sailor',
          title: '선원'
        },
        {
          keyName: 'colleague',
          title: '동료'
        },
        {
          keyName: 'ship',
          title: '선박'
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/item-build/ItemBuildList.scss';
</style>