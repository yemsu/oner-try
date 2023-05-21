<template>
  <div>
    <div class="inner-size-basic">
      <element-option-bar
        v-if="heroOptions"
        :options="heroOptions"
        :select-list="heroSelected"
        :can-multi-select="false"
        @onChange="(list) => heroSelected = list"
      />
    </div>
    <section class="inner-size-basic mrg-top-medium">
      <h2 class="ir-hidden">랭킹</h2>
    <!-- <p class="bar-notice">
      ❗ 랭킹 산정 방식이 변경되었습니다. (2022.07.22)<br>
      <strong>레벨 * 현상금</strong> 👉 <strong>현상금 > 레벨</strong><br>
      <a href="https://cafe.naver.com/onepiecerpg/5096" target="_blank" title="새창">
        관련 공지 보기
        <i class="icon-arrow small border-point right"></i>
      </a>
    </p> -->
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
          * 랭킹 등록 조건: 캐릭터 검색 이용 유저, 현상금 20만 이상 (갱신 주기 30분)
        </p>
      </div>
      <ranking-table
        :selected-hero="heroSelected[0]"
        :defaultDataNum="15"
      />
    </section>
  </div>
</template>

<script>
import rankingTable from '@/components/pages/ranking/Table.vue'
import setMeta from '@/plugins/utils/meta';
import { mapGetters } from 'vuex';

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `랭킹`,
      description: `캐릭터 랭킹을 확인할 수 있습니다. 해적왕은 누구일까요?`,
    })
  },
  components: {
    rankingTable,
  },
  data() {
    return {
      pureHeroes: null,
      heroOptions: [],
      heroSelected: []
    }
  },
  computed: {
    ...mapGetters({
      heroes: 'item/getHeroes'
    })
  },
  async created() {
    if(this.heroes.length === 0 ) await this.$store.dispatch('item/GET_HEROES')
    this.pureHeroes = this.heroes.filter(hero => !hero.name.includes('(스킨)'))
    const heroOptions = this.pureHeroes.map(({imageName, name}) => ({
      id: imageName, text: name
    }))
    this.heroOptions = [
      { id: 'all', text: '👑통합 랭킹👑' },
      ...heroOptions
    ]
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/ranking/index.scss';
</style>