<template>
  <div class="comp-tree">
    <div class="area-tree" v-if="item.ingredients">
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
                v-if="propsD1.ingredients"
                class="wrap-scroll"   
                @click="toggleD3($event, propsD1.index)"
              >
                <comp-tree-depth
                  :items="propsD1.ingredients"
                  :depthIndex="2"
                  itemSize="basic"
                  :class="{ 'show-depth3': dataShowDepth3[propsD1.index] }"
                >
                  <template v-slot="{ props: propsD2 }">
                    <comp-tree-depth
                      v-if="propsD2.ingredients && dataShowDepth3[propsD1.index]"
                      :items="propsD2.ingredients"
                      :depthIndex="3"
                    >
                      <template v-slot="{ props: propsD3 }">
                        <comp-tree-depth
                          v-if="propsD3.ingredients"
                          :items="propsD3.ingredients"
                          :depthIndex="4"
                        />
                      </template>
                    </comp-tree-depth>
                  </template>
                </comp-tree-depth>
              </div>
              <button
                v-if="propsD1.ingredients"
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
      dataShowDepth3: [],
      modeWide: false
    }
  },
  mounted() {
    this.setDataShowDepth3()
  },
  methods: {
    setDataShowDepth3() {
      this.dataShowDepth3 = this.item.ingredients.map(item => item.ingredients && false)
    },
    toggleD3(e, i) {
      const otherButton = e.target.closest('button') 
      const isToggleButton = otherButton && otherButton.classList.value.includes('toggle')
      console.log('toggleD3', isToggleButton , otherButton)
      if(!isToggleButton && otherButton) return 
      console.log('toggleD3 2', i, this.dataShowDepth3[i])
      this.dataShowDepth3[i] = !this.dataShowDepth3[i]
    },
    attrToggleD3(index) {
      const isShow = this.dataShowDepth3[index]
      const data = {
        title: `조합 ${isShow ? '간략' : '모두'} 보기`,
        arrow: isShow ? 'up' : 'down'
      }
      return data
    },
    clickWideMode() {
      console.log('clickWideMode')
      this.modeWide = !this.modeWide
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/CompTree.scss';
</style>