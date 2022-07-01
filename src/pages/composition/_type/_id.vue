<template>
  <div>
    <div class="area-search inner-size-basic">
      <search-box
        v-if="combinationItems.length !== 0"
        category="조합 아이템"
        :items="items"
        :matchingData="{type: 'item', data: combinationItems}"
        :result="itemSelected"
        size="side"
        :paramKey="['type', 'id']"
        @onSearch="fnSearch"
        @onRemoveSearchResult="removeSearchResult"
      />
    </div>
    <template v-if="itemSelected">
      <div class="inner-size-basic">
        <item-box
          :item="itemSelected"
          type="list"
          size="big"
          :showType="true"
          :visibleDetail="true"
        />
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
            type="sailors"
            itemBoxType="list"
            itemBoxSize="xsmall"
            :badgeDrop="false"
            columnNum="10"
          />
          <item-list
            :items="totalIngrdnts.etcItems"
            type="etcItems"
            itemBoxType="list"
            itemBoxSize="xsmall"
            :badgeDrop="false"
            columnNum="10"
          />
        </title-content>
      </div>
      <comp-tree
        :item="itemSelected"
        :allIngrdnts="allIngrdnts"
      />
    </template>
  </div>
</template>

<script>
import TitleContent from '@/components/common/TitleContent.vue'
import ItemList from '@/components/item/ItemList.vue'
import ItemBox from '@/components/item/ItemBox.vue'
import CompTree from '@/components/item/CompTree.vue'
import { parserStrData, fillDataAndInsertValue } from '@/plugins/item'
import { mapGetters } from 'vuex';

export default {
  components: {
    TitleContent,
    ItemList,
    ItemBox,
    CompTree
  },
  data() {
    return {
      combinationItems: [],
      itemSelected: null,
      allIngrdnts: []
    }
  },
  computed: {
    ...mapGetters({
      items: 'getItems',
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

      return {sailors, etcItems}
    }
  },
  async created() {
    if(this.items.length === 0) await this.$store.dispatch('GET_ITEMS')
    const combinationItems = await this.items.filter(item => item.ingredients)
    this.combinationItems = combinationItems
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
    },
    removeSearchResult() {
      this.itemSelected = null
      this.allIngrdnts = []
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
        const ingredients = fillDataAndInsertValue(this.items, item.ingredients, 'requiredNumber')
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/composition/result.scss';
</style>