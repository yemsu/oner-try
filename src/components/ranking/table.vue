<template>
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
      </tr>
    </thead>
    <tbody>
      <tr
        :class="`item-ranking tear-${getRankInfo(i).index}`"
        v-for="(user, i) in ranking"
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
            :wantedPaper="i === 0 && true"
            :showBounty="false"
            :size="i === 0 && true ? 'basic' : 'small'"
          ></item-box>
          <template v-if="i === 0">
            <span class="crown">👑</span>
            <span class="money">💰</span>
          </template>
        </td>
        <td class="level">
          {{ user.lv }}
        </td>
        <td class="nickname">
          <router-link :to="`/character/${user.nickName}`">
            {{ user.nickName }}
          </router-link>
        </td>
        <td class="bounty">$ {{ addCommaNumber(user.bounty) }}</td>
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
                :roundImg="true"
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
                :roundImg="true"
                size="small"
              />
            </li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { addCommaNumber } from '@/plugins'
import { mapGetters } from 'vuex'

export default {
  props: {
    ranking: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      heroes: 'getHeroes',
    })
  },
  methods: {
    findHero(name) {
      return this.heroes.find(hero => hero.name === name)
    },
    addCommaNumber(number) {
      return addCommaNumber(number)
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/components/ranking/table.scss';
</style>