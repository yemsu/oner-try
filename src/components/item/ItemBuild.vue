<template>
<div>
  <div class="text-refer top">
    <p class="align-right">
      <span v-if="buildData.saveDate">최근 세이브: {{ buildData.saveDate }}</span>
      <span class="badge-text-wrap">
        <span class="badge black line-gold" data-v-21f97cac="">숫자</span>
        : 초월 수치
      </span>
    </p>
  </div>
  <div class="wrap-items-info">
    <title-content
      v-for="(itemGridInfo, i) in itemGridInfoList"
      :key="`itemGridInfo${i}`"
      :title="itemGridInfo.title"
      :type="itemGridInfo.type"
    >
      <item-list
        :items="buildData[itemGridInfo.type]"
        :type="itemGridInfo.type"
        :columnNum="itemGridInfo.columnNum"
      >
        <template v-slot="{ item }">
          <item-box
            :item="item"
            :showBadges="['howGet', 'stack']"
          ></item-box>
        </template>
      </item-list>
    </title-content>
    <div v-if="buildData.synergy.length > 0" class="area-synergies">
      <synergy-desc
        :synergies="buildData.synergy"
      />
    </div>
    <template v-if="buildData.totalOption.length > 0">
      <section class="all-options-main">
        <h2 class="ir-hidden">빌드 총 스탯</h2>
        <item-detail-info
          type="total"
          columns="3"
          colorMode="white"
          :options="buildData.totalOption.slice(0,12)"
          :plusMinusUnit="false"
          :showValueDecimal="true"
        />
        <p class="text-notice">실제 스탯과 약간의 오차가 있을 수 있습니다.</p>
      </section>
      <div class="all-options-sub">
        <item-detail-info
          type="total"
          columns="1"
          colorMode="white"
          :options="buildData.totalOption.slice(12)"
          :plusMinusUnit="false"
          :showValueDecimal="true"
        />
      </div>
    </template>
  </div>
</div>
</template>

<script>
import TitleContent from '@/components/common/TitleContent.vue'
import SynergyDesc from '@/components/item/SynergyDesc.vue'

export default {
  components: {
    TitleContent,
    SynergyDesc
  },
  props: {
    buildInfo: {
      type: String, // stringify json
      default: () => '{}',
      required: true,
    }
  },
  data() {
    return {
      itemGridInfoList: [
        {
          title: "장비",
          type: "equipment",
          columnNum: "2",
        },
        {
          title: "선원",
          type: "sailor",
          columnNum: "2",
        },
        {
          title: "동료",
          type: "colleague",
          columnNum: "3",
        },
        {
          title: "선박",
          type: "ship",
          columnNum: "1",
        },
        {
          title: "류오",
          type: "ryuo",
          columnNum: "1",
          rowNum: "1",
        },
      ],
    }
  },
  computed: {
    buildData() {
      return JSON.parse(this.buildInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/item/ItemBuild.scss';
</style>