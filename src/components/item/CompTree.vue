<template>
  <div class="comp-tree">
    <div class="area-tree" v-show="item.ingredients">
      <div class="text-refer top inner-size-basic">
        <h4>조합 트리</h4>
        <div class="align-right">
          <base-button
            type="icon mode-wide"
            :toggleData="modeWide"
            @click="clickWideMode()"
            :title="modeWide ? '접기' : '펼치기'"
          /> 
        </div>
      </div>
      <div :class="`inner-size-${modeWide ? 'wide' : 'basic'}`">
        <div class="wrap-tree">
          <comp-tree-depth
            :items="item.ingredients"
            :depthIndex="1"
            itemSize="basic"
          >
            <template v-slot="{ props: propsD1 }">
              <div
                v-show="propsD1.ingredients"
                class="wrap-scroll"   
                @click="hasItemTree(propsD1) && toggleD3($event, propsD1.index)"
              >
                <comp-tree-depth
                  :items="propsD1.ingredients"
                  :depthIndex="2"
                  itemSize="basic"
                  :class="{ 'show-depth3': dataShowDepth3[`index${propsD1.index}`] }"
                >
                  <template v-slot="{ props: propsD2 }">
                    <comp-tree-depth
                      v-show="propsD2.ingredients && dataShowDepth3[`index${propsD1.index}`]"
                      :items="propsD2.ingredients"
                      :depthIndex="3"
                    >
                      <template v-slot="{ props: propsD3 }">
                        <comp-tree-depth
                          v-show="propsD3.ingredients"
                          :items="propsD3.ingredients"
                          :depthIndex="4"
                        />
                      </template>
                    </comp-tree-depth>
                  </template>
                </comp-tree-depth>
              </div>
              <button
                v-show="hasItemTree(propsD1)"
                class="button-toggle"
                @click="toggleD3($event, propsD1.index)"
                :title="attrToggleD3(propsD1.index).title"
              >
                <i :class="`icon-arrow ${attrToggleD3(propsD1.index).arrow}`"></i>
              </button>
            </template>
          </comp-tree-depth>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'
import CompTreeDepth from '@/components/item/CompTreeDepth.vue'
export default {
  components: {
    CompTreeDepth,
    BaseButton
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    allIngrdnts: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      dataShowDepth3: {
        index0: false,
        index1: false,
        index2: false,
        index3: false,
        index4: false,
        index5: false,
      },
      modeWide: false
    }
  },
  mounted() {
    // nuxt로 바꾸고 되지않음. 우선 default로 false 6개 삽입해놓음
    // Array가 아니라 obj여야 작동하고, 기본 데이터가 삽입되어 있어야 작동함
    // 공부 더 하고 해결해보기.
    // this.setDataShowDepth3()
  },
  methods: {
    setDataShowDepth3() {
      this.dataShowDepth3 = this.item.ingredients.map(item => item.ingredients && false)
    },
    toggleD3(e, i) {
      const otherButton = e.target.closest('button') 
      const isToggleButton = otherButton && otherButton.classList.value.includes('toggle')
      if(!isToggleButton && otherButton) return 
      this.dataShowDepth3[`index${i}`] = !this.dataShowDepth3[`index${i}`]
    },
    attrToggleD3(i) {
      const isShow = this.dataShowDepth3[`index${i}`]
      const data = {
        title: `조합 ${isShow ? '간략' : '모두'} 보기`,
        arrow: isShow ? 'up' : 'down'
      }
      return data
    },
    clickWideMode() {
      this.modeWide = !this.modeWide
    },
    hasItemTree(item) {
      if(!item.ingredients) return false
      const d2Ingredients = item.ingredients.map(itemD1 => itemD1.ingredients)
      const result = [...new Set(d2Ingredients)]
      return !(result.length === 1 && !result[0])
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/CompTree.scss';
</style>