<template>
  <div>
    <div v-if="rankingCrr.length === 0" style="margin-top: 300px; font-size: 1.5em; text-align: center;">
      데이터 로딩중💦 잠시만 기다려 주세요
    </div>
    <table v-else class="list-ranking">
      <caption>랭킹 순위에 따른 랭크, 영웅, 유저명, 현상금, 선원, 동료 정보 테이블</caption>
      <thead>
        <tr>
          <th scope="col">랭크</th>
          <th scope="col">영웅</th>
          <th scope="col">레벨</th>
          <th scope="col">유저명</th>
          <th scope="col">현상금</th>
          <th scope="col">선원</th>
          <!-- <th scope="col">동료</th> -->
        </tr>
      </thead>
      <tbody>
        <tr
          :class="`item-ranking tear-${getRankInfo(i).index}`"
          v-for="(user, i) in rankingCrr"
          :key="`user${i}`"
        >
          <td class="rank">
            <span :class="`rank-title type-${getRankInfo(i).index}`" v-if="i <= 11">
              <span class="skull">☠</span>
              {{ getRankInfo(i).title }}
            </span>
            <span class="number-rank" v-else>{{ i + 1 }}</span>
          </td>
          <td class="thumb-hero">
            <item-box
              :item="findHero(user.name)"
              :showName="false"
              :wantedPaper="i === 0"
              :isPirateKing="i === 0"
              :showBounty="false"
              :size="i === 0 ? 'medium' : 'small'"
            ></item-box>
          </td>
          <td class="level">
            {{ user.lv }}
          </td>
          <td class="nickname">
            <router-link :to="`/character/result?nickname=${user.nickName}`">
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
                  :isRoundImg="true"
                  size="small"
                />
              </li>
            </ul>
          </td>
          <!-- <td class="colleagues">
            <ul class="list-items">
              <li
                v-for="(colleague, i) in user.colleagues"
                :key="`colleague${i}`"
              >
                <item-box
                  :item="colleague"
                  :showName="false"
                  :onlyImg="true"
                  :isRoundImg="true"
                  size="small"
                />
              </li>
            </ul>
          </td> -->
        </tr>
      </tbody>
    </table>
    <div v-if="useInfiniteScroll" ref="checker-observer"></div>
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
  },
  computed: {
    ...mapGetters({
      rankingCrr: 'character/getRankingCrr',
      ranking: 'character/getRanking',
      heroes:  'item/getHeroes',
    })
  },
  async created() {    
    if(this.ranking.length === 0) await this.getRanking()

    this.setRankingList()
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.useInfiniteScroll && this.infiniteScroll()
      }, 300)
    })
  },
  beforeDestroy() {
    this.resetRanking({ number: this.defaultDataNum })
  },
  methods: {
    ...mapActions({
      getRanking: 'character/GET_RANKING',
    }),
    ...mapMutations({
      addRanking: 'character/ADD_RANKING_DATA',
      resetRanking: 'character/RESET_RANKING_DATA'
    }),
    findHero(name) {
      return this.heroes.find(hero => hero.name === name)
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
    setRankingList() {
      const { length: dataLength } = this.rankingCrr
      if(dataLength === this.defaultDataNum) return
      const checkNeedMoreData = dataLength < this.defaultDataNum
      const methodName = checkNeedMoreData
        ? 'addRanking'
        : 'resetRanking'

      this[methodName]({ number: this.defaultDataNum })
    },
    infiniteScroll() {
      const checker = this.$refs['checker-observer']
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            const checkEnd = this.ranking.length === this.rankingCrr.length
            if(checkEnd) return false
            console.log('observer on', checkEnd)
            this.addRanking({ number: 15 })
          }
        })
      })

      io.observe(checker);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/ranking/table.scss';
</style>