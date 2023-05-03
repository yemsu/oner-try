<template>
  <section class="inner-size-basic mrg-top-medium">
    <div class="area-page-title">
      <h2 class="title badge-text-wrap">빌드 만들기</h2>        
    </div>
    <item-search-box 
      v-if="searchBoxFullData.length > 0"
      :full-data="searchBoxFullData"
      :fn-after-search="fnAfterSearch"
      size="small"
      placeholder="추가할 아이템 검색"
    />
    <section>
      <h2 class="ir-hidden">선택한 아이템빌드</h2>
      <item-build 
        v-if="buildInfoString"
        :build-info="buildInfoString"
      />
    </section>
  </section>
</template>

<script>
import setMeta from '@/plugins/utils/meta';
import ItemBuild from '@/components/item/ItemBuild.vue'
import ItemSearchBox from '@/components/item/ItemSearchBox.vue';
import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'character-result',
  components: {
    ItemBuild,
    ItemSearchBox,
  },
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `빌드 만들기`,
      description: `나만의 빌드를 만들어 보세요!`,
    })
  },
  data() {
    return {
      searchBoxFullData: [],
      buildInfo: {
        equipment: new Array(6),
        sailor: new Array(6),
        colleague: new Array(3),
        ship: new Array(1),
        ryuo: new Array(1),
        synergy: [],
        totalOption: []
      },
      buildInfoString: null
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/getItems',
      synergies: 'item/getSynergies'
    })
  },
  async created() {
    if(this.items.length === 0) await this.getItems()
    if(this.synergies.length === 0) await this.getSynergies()
    this.setTotalOption()
    this.setSearchBoxFullData()
    this.setBuildInfoString()
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      getItems: 'item/GET_ITEMS',
      getSynergies: 'item/GET_SYNERGIES',
    }),
    setSearchBoxFullData() {
      this.searchBoxFullData = this.items.filter((item) => item.type !== 'etcItem')
    },
    setBuildInfoString() {
      this.buildInfoString = JSON.stringify(this.buildInfo)
    },
    setTotalOption() {
      this.buildInfo.totalOption = getTotalOption(this.buildInfo, this.buildInfo.synergy)
    },
    fnAfterSearch(name) {
      const item = this.items.find((item) => item.name === name)

      let blankSlotIndex = 0
      for(const slot of this.buildInfo[item.type]) {
        if(!slot) break
        blankSlotIndex++
        continue
      }

      this.buildInfo[item.type][blankSlotIndex] = item
      if(item.type === 'sailor') {
        this.buildInfo.synergy = getCharacterSynergies(this.buildInfo.sailor, this.synergies)
      } 
      this.setTotalOption()
      this.setBuildInfoString()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/character/result.scss';
</style>