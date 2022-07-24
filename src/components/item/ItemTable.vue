<template>
  <div class="item-table">
    <div class="text-refer top">
      <div class="align-left">
        <p>총 {{ items.length }}개</p>
      </div>
      <div class="align-right">
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
      </div>
    </div>
    <table :class="`table-${type}`">
      <colgroup>
        <col
          v-for="(data, i) in tableData"
          :key="`col-${i}`"
          :width="data.width"
        >
      </colgroup>
      <thead v-if="type !== 'equipment'">
        <tr>
          <th
            v-for="(data, i) in tableData"
            :key="`th-${i}`"
            scope="col"
            :class="data.align ? `text-${data.align}` : ''"
          >
            {{ data.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="(item, i) in items"
        >
          <tr
            v-if="item.optionsByGrade"
            :key="`item-tr1-${i}`"
            class="line-strong-top"
          >
            <th class="text-center">장비<br>& 옵션</th>
            <td class="td-common" colspan="6">
              <div class="columns align-center">
                <div class="wrap-item small">
                  <item-box
                    type="list"
                    size="small"
                    :item="item"
                    :showBadges="['howGet']"
                    :tooltipNoOption="true"
                    :isBlankLink="true"
                    :padding="false"
                  />
                </div>
                <div class="wrap-options basic">
                  <item-detail-info
                    v-if="item.option"
                    :options="item.option"
                    :markOptions="optionsSelected"
                    :highlightTitle="false"
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr :key="`item-tr2-${i}`">
            <template
              v-for="(data, i) in tableData"
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
                  data.align ? `text-${data.align}` : '',
                  {'align-top': data.type.includes('optionsByGrade')}
                ]"
              >
                <!-- 아이템 -->
                <item-box
                  v-if="data.type === 'item'"
                  type="list"
                  :item="item"
                  :showBadges="['howGet']"
                  :showTooltip="false"
                  :isBlankLink="true"
                  :padding="false"
                />
                <!-- 옵션 -->
                <item-detail-info
                  v-if="data.type === 'option'"
                  :options="item.option"
                  :markOptions="optionsSelected"
                  :highlightTitle="false"
                />
                <!-- 인연 / 악연 -->
                <template v-if="data.type === 'synergy'">
                  <synergy-desc
                    v-if="item.synergies.length !== 0"
                    :synergies="item.synergies"
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
                {{ item.stackNames && item.stackNames[stackOptionIndex(data)] }}
                  <item-detail-info
                    :options="item.optionsByStack[stackOptionIndex(data)]"
                    :markOptions="optionsSelected"
                    :highlightTitle="false"
                  />
                  <item-detail-info
                    v-if="item.gradeOption"
                    :options="item.gradeOption"
                    :markOptions="optionsSelected"
                    :highlightTitle="false"
                  />
                </div>
                <!-- 장비 등급별 옵션 -->
                <div 
                  v-if="data.type.includes('optionsByGrade')"
                >
                  <div class="grade-option box-text">
                    <p class="title-small">{{ item.stackNames[stackOptionIndex(data)] }}</p>
                    <item-detail-info
                      v-if="item.optionsByGrade[stackOptionIndex(data)]"
                      :options="item.optionsByGrade[stackOptionIndex(data)]"
                      :markOptions="optionsSelected"
                      :highlightTitle="false"
                    />
                    <span v-else> - </span>
                  </div>
                </div>
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import SynergyDesc from '@/components/item/SynergyDesc.vue'

export default {
  props: {
    type: {
      type: String,
      default: () => '' //sailor colleague ship
    },
    items: {
      type: Array,
      default: () => []
    },
    optionsSelected: {
      type: Array,
      default: () => []
    }
  },
  components: {
    SynergyDesc,
  },
  data() {
    return {
      sailorTableData: [
        {
          title: '선원',
          type: 'item',
          width: '25%'
        },
        {
          title: '옵션',
          type: 'option',
          width: '30%'
        },
        {
          title: '인연 / 악연',
          type: 'synergy',
          width: '45%'
        },
      ],
      colleagueTableData: [
        {
          title: '동료',
          type: 'item',
          width: '20%'
        },
        {
          title: '옵션',
          type: 'option',
          width: '22%'
        },
        {
          title: '콜로세움',
          align: 'center',
          type: 'coloYn',
          width: '10%'
        },
        {
          title: '콜로세움 능력치',
          type: 'coloPassive',
          width: '43%'
        },
      ],
      shipTableData: [
        {
          title: '선박',
          type: 'item',
          width: '14%'
        },
        {
          title: '+0',
          type: 'optionsByStack0'
        },
        {
          title: '+1',
          type: 'optionsByStack1'
        },
        {
          title: '+2',
          type: 'optionsByStack2'
        },
        {
          title: '+3',
          type: 'optionsByStack3'
        },
        {
          title: '+4',
          type: 'optionsByStack4'
        },
      ],
      equipmentTableData: [
        {
          type: 'string',
          th: '등급별 옵션',
          align: 'center'
        },
        {
          type: 'optionsByGrade0',
          width: '7.5%'
        },
        {
          type: 'optionsByGrade1',
          width: '17.5%'
        },
        {
          type: 'optionsByGrade2',
          width: '17.5%'
        },
        {
          type: 'optionsByGrade3',
          width: '17.5%'
        },
        {
          type: 'optionsByGrade4',
          width: '17.5%'
        },
        {
          type: 'optionsByGrade5',
          width: '17.5%'
        },
      ],
    }
  },
  computed: {
    tableData() {
      return this[`${this.type}TableData`]
    },
    dataDate() {
      const dataDate = {
        sailor: '2022.06.12',
        colleague: '2022.06.13',
        ship: '2022.06.12',
      }
      return dataDate[this.type]
    }
  },
  methods: {
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
    stackOptionIndex(data) {
      const str = data.type.includes('optionsByStack')
        ? 'optionsByStack' : 'optionsByGrade'
      return data.type.split(str)[1]
    }
  }
}
</script>

<style lang="scss" scope>
@import '@/assets/style/components/item/ItemTable.scss';
</style>