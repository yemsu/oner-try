<template>
<div>
  <div class="text-refer top">
    <p v-if="buildData.saveDate">최근 세이브: {{ buildData.saveDate }}</p>
    <element-refresh-button
      v-if="useRefresh"
      @click="$emit('refresh')"
    />
    <p v-else-if="buildData.regDt">{{ buildData.regDt }}</p>
    <element-copy-button
      v-if="makingMode"
      :copy-area="copyArea"
    />
    <p class="align-right">
      <span class="badge-text-wrap">
        <span class="badge black line-gold">숫자</span>
        : 강화 수치
      </span>
    </p>
  </div>
  <div class="wrapper copy-area" ref="copyArea">
    <div
      v-if="itemGridInfoList"
      class="wrap-item-build"
    >
      <div
        v-for="({ title, type, columnNum }, i) in itemGridInfoList"
        :key="`itemGridInfo${i}`"
        :class="`wrap-title-content ${type}`"
      >
        <title-content
          :title="title"
          :type="type"
        >
          <item-list
            :items="buildData[type]"
            :type="type"
            :columnNum="columnNum"
          >
            <template v-slot="{ data: { item, i: index } }">
              <item-box
                :item="item"
                :showBadges="['grade', 'stack']"
                :is-link="!makingMode"
                :has-click-event="makingMode"
                @click="makingMode && $emit('delete', { item, index })"
                :title="makingMode && '클릭하여 삭제'"
              ></item-box>
            </template>
          </item-list>
        </title-content>
      </div>
      <synergy-desc
        v-if="buildData.synergy.length > 0"
        class="sailor"
        :synergies="buildData.synergy"
      />
      <synergy-desc
        v-if="buildData.combi"
        class="colleague"
        :synergies="[buildData.combi]"
      />
      <item-detail-info
        v-if="buildData.information"
        type="character-info"
        colorMode="white"
        :options="buildData.information"
        :plusMinusUnit="false"
        :showValueDecimal="true"
      />
      <div
        v-if="buildData.totalOption.length > 0"
        class="all-options-main"
      >
        <h3 class="ir-hidden">빌드 총 스탯</h3>
        <item-detail-info
          type="total"
          colorMode="white"
          :options="buildData.totalOption"
          :plusMinusUnit="false"
          :showValueDecimal="true"
        />
        <p class="text-notice">실제 스탯과 약간의 오차가 있을 수 있습니다.</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import TitleContent from '@/components/common/TitleContent.vue'
import SynergyDesc from '@/components/item/SynergyDesc.vue'
import { itemTypeDefs } from '@/plugins/utils/item-def'

export default {
  components: {
    TitleContent,
    SynergyDesc
  },
  props: {
    buildInfo: {
      type: String, // stringify json
      default: '{}',
      required: true,
    },
    showRangeValue: {
      type: Boolean,
      default: false
    },
    makingMode: {
      type: Boolean,
      default: false
    },
    useRefresh: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      gridInfos: {
        equipment: {
          columnNum: '6'
        },
        sailor: {
          columnNum: '3'
        },
        colleague: {
          columnNum: '3'
        },
        ship: {
          columnNum: '1'
        },
        // ryuo: {
        //   columnNum: '1',
        //   rowNum: '1'
        // }
      },
      itemGridInfoList: null,
      copyArea: null,
    }
  },
  created() {
    this.itemGridInfoList = itemTypeDefs.map(itemType => (
      {...itemType, ...this.gridInfos[itemType.type]}
    ))
  },
  mounted() {
    this.$nextTick(() => {
      this.copyArea = this.$refs.copyArea
      // template에 바로 ref적용하면 에러 발생하여 별도 data값에 저장
      if(!this.copyArea) {
        setTimeout(() => {
        this.copyArea = this.$refs.copyArea
        }, 800);
      }
    })
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