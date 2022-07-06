<template>
  <div>
    <div v-if="ranking.length === 0" style="margin-top: 300px; font-size: 1.5em; text-align: center;">
      데이터 로딩중💦 잠시만 기다려 주세요🐱‍🏍
    </div>
    <div v-else class="inner-size-basic">
    <div class="bar-notice" style="width: 100%; padding: 10px; text-align: center; background-color: $color-point;">
      ❗ 현재 랭킹이 정상적으로 업데이트 되지 않는 현상이 있습니다. 확인 중에 있으니 조금만 기다려주세요.
    </div>
      <!-- <ul class="list-filter">
        <li>
          <button class="button-filter" @click="filterHero">
            ALL
          </button>
        </li>
        <li
          v-for="(hero, i) in pureHeroes"
          :key="`hero${i}`"
        >
          <button class="button-filter" @click="filterHero">
            <item-box
              :item="hero"
              size="basic"
            ></item-box>
          </button>
        </li>
      </ul> -->
      <div class="text-refer top">
        <p class="align-right">
          캐릭터 검색을 이용한 유저만 랭킹에 노출됩니다. (갱신 주기: 30분)
        </p>
      </div>
      <rankingTable
        :ranking="rankingInfiniteScroll"
      />
    </div>
    <div ref="checker-observer"></div>
  </div>
</template>

<script>
import rankingTable from '@/components/ranking/table.vue'
import setMeta from '@/plugins/utils/meta';
import { mapGetters, mapMutations } from 'vuex'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `랭킹`,
      description: `캐릭터 랭킹을 확인할 수 있습니다. 해적왕은 누구일까요?`,
    })
  },
  components: {
    rankingTable
  },
  async asyncData({ store }) {
    const { items, heroes } = store.state
    if(items.length === 0) await store.dispatch('GET_ITEMS')
    if(heroes.length === 0) await store.dispatch('GET_HEROES')
    const pureHeroes = heroes.filter(hero => !hero.name.includes('(스킨)'))
    return {
      pureHeroes
    }
  },
  computed: {
    ...mapGetters({
      rankingInfiniteScroll: 'getRankingInfiniteScroll',
      ranking: 'getRanking',
      items: 'getItems',
      heroes: 'getHeroes',
    })
  },
  async created() {    
    if(this.ranking.length === 0) await this.$store.dispatch('GET_RANKING')
    if(this.rankingInfiniteScroll.length === 0) this.addRanking({type: 'rankingInfiniteScroll', number: 15})
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.refresh()
      const checker = this.$refs['checker-observer']
      this.infiniteScroll(checker)
    })
  },
  beforeDestroy() {
    this.resetRanking({type: 'rankingInfiniteScroll', number: 15})
  },
  methods: {
    ...mapMutations({
      addRanking: 'ADD_RANKING_DATA',
      resetRanking: 'RESET_RANKING_DATA'
    }),
    infiniteScroll(checker) {
      if(!checker) return
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            const checkEnd = this.ranking.length === this.rankingInfiniteScroll.length
            console.log('on', checkEnd)
            if(checkEnd) return false
            // checkEnd && io.disconnect()
            this.addRanking({type: 'rankingInfiniteScroll', number: 15})
          }
        })
      })

      io.observe(checker);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/ranking/index.scss';
</style>