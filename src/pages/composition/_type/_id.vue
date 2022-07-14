<template>
  <div>
    <div class="top-bar">
      <div class="inner-size-basic">
        <div class="align-right">
          <composition-search-box
            v-if="compositionItems.length !== 0"
            :matchingData="compositionItems"
            size="small"
          />
        </div>
      </div>
    </div>
    <template v-if="itemSelected">
      <div class="content-top">
        <div class="inner-size-basic">
          <item-box
            :item="itemSelected"
            type="list"
            size="big"
            :showBadges="['type', 'howGet']"
            :visibleDetail="true"
            :isLink="false"
          />
          <div v-if="highRankItems.length !== 0" class="wrap-high-rank">
            <h4 class="title">상위 아이템</h4>
            <item-list :items="highRankItems">
              <template v-slot="{ item: highRankItems }">
                <item-box
                  :item="highRankItems"
                  size="small"
                />
              </template>
            </item-list>
          </div>
        </div>
      </div>
      <div class="inner-size-basic mrg-top-medium">
        <div class="text-refer top">
          <p class="align-right">
            <span class="badge-text-wrap">
              <span class="badge black" data-v-21f97cac="">숫자</span>
                : 필요 아이템 갯수
            </span>
          </p>
        </div>
        <title-content v-if="totalIngrdnts" title="Total" class="wrap-total area-item-list emph">
          <item-list
            :items="totalIngrdnts.sailors"
            columnNum="10"
            size="xsmall"
            class="sailors"
          >
            <template v-slot="{ item }">
              <item-box
                :item="item"
                type="list"
                :showBadges="['requiredNumber']"
                size="xsmall"
              ></item-box>
            </template>
          </item-list>
          <item-list
            :items="totalIngrdnts.etcItems"
            columnNum="10"
            size="xsmall"
          >
            <template v-slot="{ item }">
              <item-box
                :item="item"
                type="list"
                size="xsmall"
                :showBadges="['requiredNumber']"
              ></item-box>
            </template>
          </item-list>
        </title-content>
      </div>
      <div class="mrg-top-medium">
        <comp-tree
          :item="itemSelected"
          :allIngrdnts="allIngrdnts"
        />
      </div>
    </template>
  </div>
</template>

<script>
import CompositionSearchBox from "@/components/pages/composition/SearchBox.vue"
import TitleContent from '@/components/common/TitleContent.vue'
import CompTree from '@/components/item/CompTree.vue'
import { parserStrData, fillDataAndInsertValue } from '@/plugins/utils/item'
import { getOnlyText, deepClone } from '@/plugins/utils'
import { checkUpdatePageView, totalPageViewGAData } from '@/plugins/utils/pageView'
import { postCompositionPageView, getCompositionPageViews, postMurgeCompositionView } from '@/plugins/utils/https'
import setMeta from '@/plugins/utils/meta';
import { mapGetters } from 'vuex';

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `${this.itemName} 조합법`,
      description: `${this.itemName}의 조합법 페이지 입니다.`,
    })
  },
  components: {
    TitleContent,
    CompositionSearchBox,
    CompTree
  },
  async asyncData({ store, params }) {
    const { item: { items } } = store.state
    const { id, type } = params
    const itemsData = items.length === 0
      ? await store.dispatch('item/GET_ITEMS')
      : items
    const compositionItems = await itemsData.filter(item => item.ingredients)
    const item = itemsData.find(item => item.id === id && item.type === type)
    const itemName = item && item.name
    return {
      compositionItems,
      itemName
    }
  },
  data() {
    return {
      itemSelected: null,
      allIngrdnts: [],
      highRankItems: []
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/getItems',
    }),
    totalIngrdnts() {
      const sailors = []
      const etcItems = []
      this.allIngrdnts.forEach((item) => {
        const newItem = JSON.parse(JSON.stringify(item))
        const target = item.type === 'sailor' ? sailors : etcItems
        const itemPushed = target.find(targetItem => targetItem.name === newItem.name)
        if(itemPushed) {
          itemPushed.requiredNumber += newItem.requiredNumber
        } else if(item.name.includes('비브르카드')) {
          target.push(newItem)
        } else {
          target.unshift(newItem)
        }
      })

      const sortRequiredNumber = dataList => {
        return dataList.sort((a, b) => a.requiredNumber - b.requiredNumber)
      }
      return {
        sailors: sortRequiredNumber(sailors),
        etcItems: sortRequiredNumber(etcItems)
      }
    }
  },
  mounted() {

    // this.mergePVData()
  },
  methods: {
    fnSearch(result) {
      result = typeof(result) === 'string'
        ? this.items.find(item => item.name.includes(result))
        : result
        
      if(!result) {
        alert('해당 아이템이 존재하지 않습니다.')
        this.$router.push({
          params: {}
        })
        return false
      }


      const { newItem: itemSetup, allIngrdnts } = this.setIngrdntsDataLoop(result)
      // console.log('itemSetup, allIngrdnts', itemSetup, allIngrdnts)
      this.itemSelected = itemSetup
      this.allIngrdnts = allIngrdnts
      this.highRankItems = deepClone(this.compositionItems)
        .filter(item => {
          const { ingredients } = item
          if(!ingredients) return false
          if(getOnlyText(ingredients).includes(getOnlyText(this.itemSelected.name))) return item
        })
        .map(item => {
          item.option = parserStrData(item.option)
          return item
        })

      this.sendPageView()
    },
    setIngrdntsDataLoop(item) {
      const { setterIngrdnts, setterOptions } = this.dataSetters(item, allIngrdnts)
      const newItem = {...item}
      const allIngrdnts = []
      const ingredientsDataLoop = item => {
        setterIngrdnts(item, allIngrdnts)
        setterOptions(item)
        this.loopDataKey(item.ingredients, 'ingredients', {
          beforeContinue: setterOptions,
          afterContinue: item => {
            setterIngrdnts(item, allIngrdnts)
            this.loopDataKey(item.ingredients, 'ingredients', {
              beforeContinue: setterOptions,
              afterContinue: ingredientsDataLoop
            })
          }
        })
      }
      ingredientsDataLoop(newItem)

      return {newItem, allIngrdnts}
    },
    itemsHasKey(items, key) {
      const itemsHasKey = items.reduce((acc, item) => {
        !item[key] && acc.push(item)
        return acc
      }, [])
      return itemsHasKey
    },
    dataSetters() {
      const setterIngrdnts = (item, allIngrdnts) => {

        const ingredients = fillDataAndInsertValue(this.items, parserStrData(item.ingredients), 'requiredNumber')
        ingredients.forEach(data => Object.assign(data, { requiredNumber: data.requiredNumber*1}))
        item.ingredients = ingredients
        allIngrdnts.push(...this.itemsHasKey(item.ingredients, 'ingredients'))
      }
      const setterOptions = item => {
        if(!item.option || typeof(item.option) !== 'string') return false
        item.option = parserStrData(item.option)
      }
      return { setterIngrdnts, setterOptions }
    },
    loopDataKey(dataList, key, callback) {
      const { beforeContinue, afterContinue } = callback
      for(const data of dataList) {
        beforeContinue && beforeContinue(data)
        if(!data[key]) continue
        afterContinue && afterContinue(data)
      }
    },
    async sendPageView() {
      const { name } = this.itemSelected
      const namePageView = await checkUpdatePageView('composition', name)
      namePageView && postCompositionPageView({ name })
    },
    async mergePVData() {
      const { data: DbPageViews } = await getCompositionPageViews({ startDate: '2022-7-9' })
      const resultData = await totalPageViewGAData(' 조합법', DbPageViews)
      resultData.forEach(data => {
        postMurgeCompositionView({ name: data.name, pageView: data.pageView})
      })
      console.log('totalPageViewGAData', resultData)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/composition/result.scss';
</style>