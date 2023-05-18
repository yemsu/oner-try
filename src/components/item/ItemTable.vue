<template>
  <div class="wrap-x-scroll">
    <section :class="`item-table size-${size}`" :style="`min-width: ${tableMinWidth};`">
      <h2 class="ir-hidden">결과 아이템 리스트</h2>
      <div class="text-refer top">
        <div class="align-left">
          <p>총 {{ items.length }}개</p>
        </div>
        <!-- <div class="align-right">
          <p
            v-if="type === 'colleague'"
            class="badge-text-wrap"
          >
            이름이 다른 동료의 동일한
            <span class="badge buff">버프</span>
            <span class="badge deBuff">디버프</span>
            는 효과 중첩가능
          </p>
          <p v-if="dataDate">{{ dataDate }} 도감 기준</p>
        </div> -->
      </div>
      <table>
        <colgroup>
          <col
            v-for="(data, i) in tableInfo"
            :key="`col-${i}`"
            :width="data.width"
          >
        </colgroup>
        <thead>
          <tr>
            <th
              v-for="(data, i) in tableInfo"
              :key="`th-${i}`"
              scope="col"
              :class="data.align ? `text-${data.align}` : ''"
            >
              {{ data.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in items"
            :key="`item-tr2-${i}`"
            :title="hasClickEvent && '아이템 선택'"
            :style="hasClickEvent && 'cursor: pointer;'"
            @click="$emit('click', item)"
          >
            <template
              v-for="(data, i) in tableInfo"
            >
              <th
                v-if="data.th"
                :key="`tr2-th-${i}`"
                :class="data.align ? `text-${data.align}` : ''"
              >
                {{ data.th }}
              </th>
              <td
                v-else
                :key="`tr2-td-${i}`"
                :class="[
                  data.align ? `text-${data.align}` : ''
                ]"
              >
                <!-- 아이템 -->
                <template v-if="data.type === 'item'">
                  <item-box
                    v-for="(tableItem, i) in tableItems(item)"
                    :key="`tableItem${i}`"
                    type="list"
                    :item="tableItem"
                    :showBadges="size === 'small' ? [] : ['howGet']"
                    :showTooltip="false"
                    :padding="false"
                    :is-link="!hasClickEvent"
                    :size="size === 'small' ? 'xsmall' : size"
                  />
                </template>
                <!-- 옵션 -->
                <item-detail-info
                  v-if="data.type === 'option'"
                  :options="item.option"
                  :item="item"
                  :description="item.description"
                  :markOptions="optionsSelected"
                  :highlight-title="false"
                  :size="size"
                />
                <!-- 인연 / 악연 -->
                <template v-if="data.type === 'synergy'">
                  <synergy-desc
                    v-if="item.synergies && item.synergies.length !== 0"
                    :synergies="item.synergies"
                    :size="size"
                  />
                  <span v-else>-</span>
                </template>
                <!-- 콜로세움 -->
                <span
                  v-if="data.type === 'coloYn'"
                  :class="`text-center color-${classNegaPosi(item)}`"
                >
                  {{ item.coloYn ? '가능' : '불가능' }}
                </span>
                <!-- 콜로세움 능력치 -->
                <template v-if="data.type === 'coloPassive'">
                  <div v-if="item.coloYn" class="columns">
                    <div class="wrap-options small">
                      <item-detail-info
                        :options="item.coloOption"
                        :highlightTitle="false"
                        :pureValue="true"
                        :size="size"
                      />
                    </div>
                    <div v-if="item.coloPassive" class="wrap-passive box-gray">
                      <p class="title badge-text-wrap">
                        {{ item.coloPassive[0] }}
                        <span :class="`badge last ${classColoPassive(item.coloPassive[1])}`">
                          {{ item.coloPassive[1] }}
                        </span>
                      </p>
                      <p>{{ item.coloPassive[2] }}</p>
                    </div>
                  </div>
                </template>
                <!-- 선박 스택별 옵션 -->
                <div
                  v-if="data.type.includes('optionsByStack')"
                  class="many-text"
                >
                {{ item.stackNames && item.stackNames[optionIndex(data)] }}
                  <item-detail-info
                    :options="item.optionsByStack[optionIndex(data)]"
                    :markOptions="optionsSelected"
                    :highlightTitle="false"
                    :size="size"
                  />
                  <item-detail-info
                    v-if="item.gradeOption"
                    :options="item.gradeOption"
                    :markOptions="optionsSelected"
                    :highlightTitle="false"
                    :size="size"
                  />
                </div>
                <!-- 장비 등급별 옵션 -->
                <dl
                  v-if="data.type.includes('optionsByGrade') && item.gradeOption && item.gradeOption.length > 0"
                  class="grade-option box-text"
                >
                  <div
                    v-for="(gradeOptionItem, i) in item.gradeOption"
                    :key="`gradeOption${i}`"
                    class="box-flex"
                  >
                    <dt class="title-small left">등급 {{ i }}.</dt>
                    <dd>{{ gradeOptionItem }}</dd>
                  </div>
                </dl>
                <!-- string -->
                <span v-else-if="data.type === 'grade'">
                  {{ getGradeName(item.grade) }}
                </span>
                <!-- string -->
                <span v-if="data.type === 'string'">
                  {{ item[data.key] }}
                </span>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import SynergyDesc from '@/components/item/SynergyDesc.vue'
import { gradesDef } from '@/plugins/utils/item-def.js'

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    optionsSelected: {
      type: Array,
      default: () => []
    },
    tableInfo: {
      type: Array,
      required: true
    },
    size: {
      type: String,
      default: () => 'medium' // small, medium
    },
    hasClickEvent: {
      type: Boolean,
      default: () => false
    },
    tableMinWidth: {
      type: String,
      default: () => '800px'
    }
  },
  components: {
    SynergyDesc,
  },
  computed: {
    dataDate() {
      const dataDate = {
        sailor: '2022.06.12',
        colleague: '2022.06.13',
        ship: '2022.06.12',
        potion: '2022.06.12',
      }
      return dataDate[this.type]
    },
  },
  methods: {
    tableItems(item) {
      const { items } = item
      const tableItems = Array.isArray(items) ? items : [item]
      return tableItems
    },
    classNegaPosi(colleague) {
      return colleague.coloYn ? 'positive' : 'negative'
    },
    classColoPassive(coloPassive) {
      switch (coloPassive) {
        case '버프':
          return 'buff'
        case '자신':
          return 'self'
        case '디버프':
          return 'deBuff'
      }
    },
    optionIndex(data) {
      const str = 'optionsByStack'
      return data.type.split(str)[1]
    },
    getGradeName(gradeEng) {
      return gradesDef[gradeEng]
    }
  }
}
</script>

<style lang="scss" scope>
@import '@/assets/style/components/item/ItemTable.scss';
</style>