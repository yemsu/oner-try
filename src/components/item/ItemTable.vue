<template>
  <section class="item-table">
    <h2 class="ir-hidden">결과 아이템 리스트</h2>
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
      <thead>
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
        <tr
          v-for="(item, i) in items"
          :key="`item-tr2-${i}`"
        >
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
                  :showBadges="['howGet']"
                  :showTooltip="false"
                  buttonTitle="클릭하여 조합 보러가기"
                  :padding="false"
                />
              </template>
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
              {{ item.stackNames && item.stackNames[optionIndex(data)] }}
                <item-detail-info
                  :options="item.optionsByStack[optionIndex(data)]"
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
              <dl
                v-if="data.type.includes('optionsByGrade')"
                class="grade-option box-text"
              >
                <template
                  v-for="(gradeOption, i) in item.optionsByGrade" 
                >
                  <div
                    v-if="item.stackNames[i]"
                    :key="`optionsByGrade${i}`"
                    class="box-flex"
                  >
                    <dt class="title-small left">{{ item.stackNames[i] }}</dt>
                    <dd>
                      <item-detail-info
                        v-if="gradeOption"
                        :options="gradeOption"
                        :markOptions="optionsSelected"
                        :highlightTitle="false"
                      />
                      <span v-else> - </span>
                    </dd>
                  </div>
                </template>
              </dl>
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
          width: '50%'
        },
        {
          title: '옵션',
          type: 'option'
        }
        // {
        //   title: '+0',
        //   type: 'optionsByStack0'
        // },
        // {
        //   title: '+1',
        //   type: 'optionsByStack1'
        // },
        // {
        //   title: '+2',
        //   type: 'optionsByStack2'
        // },
        // {
        //   title: '+3',
        //   type: 'optionsByStack3'
        // },
        // {
        //   title: '+4',
        //   type: 'optionsByStack4'
        // },
      ],
      equipmentTableData: [
        {
          title: '장비',
          type: 'item',
          width: '50%'
        },
        {
          title: '옵션',
          type: 'option'
        }
        // {
        //   title: '공통 옵션',
        //   type: 'option',
        //   width: '30%'
        // },
        // {
        //   title: '등급별 추가 옵션',
        //   type: 'optionsByGrade',
        //   width: '35%'
        // },
        // {
        //   title: '획득처',
        //   type: 'string',
        //   key: 'dropMonster',
        //   width: '15%'
        // },
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
    }
  }
}
</script>

<style lang="scss" scope>
@import '@/assets/style/components/item/ItemTable.scss';
</style>