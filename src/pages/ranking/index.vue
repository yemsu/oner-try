<template>
  <div>
    <div class="inner-size-basic mrg-top-medium">
    <!-- <div class="bar-notice">
      ❗ 현재 랭킹이 정상적으로 업데이트 되지 않는 현상이 있습니다. 확인 중에 있으니 조금만 기다려주세요.
    </div> -->
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
      <ranking-table
        :defaultDataNum="15"
      />
    </div>
  </div>
</template>

<script>
import rankingTable from '@/components/pages/ranking/Table.vue'
import setMeta from '@/plugins/utils/meta';
import { mapGetters } from 'vuex'

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
      items: 'getItems',
      heroes: 'getHeroes',
    })
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/ranking/index.scss';
</style>