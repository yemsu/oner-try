<template>
  <div class="item-build">
    <div class="text-refer top">
      <p v-if="data.saveDate">
        최근 세이브: {{ data.saveDate }}
      </p>
      <p class="align-right">
        <span class="badge-text-wrap">
          <span class="badge black line-gold" data-v-21f97cac="">숫자</span>
          : 초월 수치
        </span>
      </p>
    </div>
    <div class="wrap-items-info">
      <title-content
        v-for="(itemArea, i) in itemAreas"
        :key="`itemArea${i}`"
        :title="itemArea.title"
        :type="itemArea.type"
      >
        <item-list
          :items="data[itemArea.type]"
          :title="itemArea.title"
          :type="itemArea.type"
          :columnNum="itemArea.columnNum"
        >
          <template v-slot="{ item }">
            <item-box
              v-if="!(isBuildTool && !item)"
              :item="item"
              :showBadges="['howGet', 'stack']"
            ></item-box>
            <button v-else>select item</button>
          </template>
        </item-list>
      </title-content>
      <div class="area-synergies">
        <synergy-desc
          v-if="data.synergies.length !== 0"
          :synergies="data.synergies"
        />
      </div>
      <template v-if="data.totalOption">
        <div class="all-options-main">
          <item-detail-info
            type="total"
            columns="3"
            colorMode="white"
            :options="data.totalOption.slice(0,12)"
            :plusMinusUnit="false"
            :showValueDecimal="true"
          />
          <p class="text-notice">실제 스탯과 약간의 오차가 있을 수 있습니다.</p>
        </div>
        <div class="all-options-sub">
          <item-detail-info
            type="total"
            columns="1"
            colorMode="white"
            :options="data.totalOption.slice(12)"
            :plusMinusUnit="false"
            :showValueDecimal="true"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import SynergyDesc from '@/components/item/SynergyDesc.vue'
import TitleContent from '@/components/common/TitleContent.vue'

export default {
  components: {
    TitleContent,
    SynergyDesc
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        saveDate: '',
        sailors: new Array(6),
        synergies: [],
        equipments: new Array(6),
        colleagues: new Array(3),
        ship: new Array(1),
        ryuo: new Array(1),
        totalOption: null,
      })
    },
    isBuildTool: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      itemAreas: [
        {
          title: "장비",
          type: "equipments",
          columnNum: "2",
        },
        {
          title: "선원",
          type: "sailors",
          columnNum: "2",
        },
        {
          title: "동료",
          type: "colleagues",
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/item/ItemBuild.scss';
</style>