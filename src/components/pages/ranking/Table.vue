<template>
  <div>
    <div v-if="ranking.length > 0" class="wrap-x-scroll">
      <table class="list-ranking">
        <caption>랭킹 순위에 따른 랭크, 영웅, 유저명, 현상금, 선원, 동료 정보 테이블</caption>
        <thead>
          <tr>
            <th scope="col">랭크</th>
            <th scope="col">영웅</th>
            <th scope="col">레벨</th>
            <th scope="col">유저명</th>
            <th scope="col">현상금</th>
            <th scope="col">선원</th>
            <th scope="col">동료</th>
            <th scope="col">선박</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :class="`item-ranking tear-${getRankInfo(i).index}`"
            v-for="(user, i) in ranking"
            :key="`user${i}`"
          >
            <td class="rank">
              <span :class="`rank-title type-${getRankInfo(i).index}`" v-if="i <= 11 && selectedHero === 'all'">
                <span class="skull">☠</span>
                {{ getRankInfo(i).title }}
              </span>
              <span class="number-rank" v-else>{{ i + 1 }}</span>
            </td>
            <td class="thumb-hero">
              <item-box
                :item="user.hero"
                :showName="false"
                :wantedPaper="i === 0"
                :isPirateKing="i === 0"
                :showBounty="false"
                :size="i === 0 ? 'medium' : 'small'"
                img-type="square-round"
              ></item-box>
            </td>
            <td class="level">
              {{ user.lv }}
            </td>
            <td class="nickname">
              <router-link
                :to="`/character/result?nickname=${user.nickName}`"
                title="유저 캐릭터 보러가기"
              >
                {{ user.nickName }}
              </router-link>
            </td>
            <td class="bounty">$ {{ user.bounty.toLocaleString() }}</td>
            <td class="sailors">
              <ul class="list-items">
                <li
                  v-for="(sailor, i) in user.sailors"
                  :key="`sailor${i}`"
                >
                  <item-box
                    :item="sailor"
                    :showName="false"
                    :onlyImg="true"
                    img-type="round"
                    size="small"
                  />
                </li>
              </ul>
            </td>
            <td class="colleagues">
              <ul class="list-items">
                <li
                  v-for="(colleague, i) in user.colleagues"
                  :key="`colleague${i}`"
                >
                  <item-box
                    :item="colleague"
                    :showName="false"
                    :onlyImg="true"
                    img-type="round"
                    size="small"
                  />
                </li>
              </ul>
            </td>
            <td class="ship">
              <item-box
                :item="user.ship"
                :showName="false"
                :onlyImg="true"
                img-type="round"
                size="small"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <common-scroll-observer
      :data="ranking || []"
      :fn-load-data="loadData"
      :category="selectedHero"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  props: {
    defaultDataNum: {
      type: Number,
      default: () => 1
    },
    useInfiniteScroll: {
      type: Boolean,
      default: () => true
    },
    selectedHero: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      selectedList: null,
    }
  },
  computed: {
    ...mapGetters({
      rankingCrr: 'character/getRankingCrr',
      ranking: 'character/getRanking',
    })
  },
  watch: {
    selectedHero(crr, prev) {
      this.resetRankingData()
    }
  },
  beforeDestroy() {
    this.resetRankingData()
  },
  methods: {
    ...mapActions({
      getRanking: 'character/GET_RANKING',
    }),
    ...mapMutations({
      resetRanking: 'character/RESET_RANKING_DATA',
    }),
    resetRankingData() {
      this.resetRanking({ number: 0 })
    },
    getRankInfo(index) {
      if(index > 12) return false

      let rankInfo = {}
      if(index === 0)
        rankInfo = { title: '해적왕', index: 0}
      else if(index > 0 && index <= 4)
        rankInfo = { title: '사황', index: 1}
      else if(index > 4 && index <= 11)
        rankInfo = { title: '칠무해', index: 2}

      return rankInfo
    },
    async loadData(page) {
      await this.getRanking({
        character: this.selectedHero,
        page,
        size: 15
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/ranking/table.scss';
</style>