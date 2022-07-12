<template>
  <div>
    <div class="inner-size-basic mrg-top-medium">
    <p class="bar-notice">
      ❗ 랭킹 산정 방식이 변경되었습니다. (2022.07.12)
      <br><strong>레벨 > 현상금</strong> 👉 <strong>레벨 * 현상금</strong>
    </p>
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
    const { item: { items, heroes } } = store.state
    if(items.length === 0) await store.dispatch('item/GET_ITEMS')
    if(heroes.length === 0) await store.dispatch('item/GET_HEROES')
    const pureHeroes = heroes.filter(hero => !hero.name.includes('(스킨)'))
    return {
      pureHeroes
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/getItems',
      heroes:  'item/getHeroes',
    })
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/ranking/index.scss';
</style>