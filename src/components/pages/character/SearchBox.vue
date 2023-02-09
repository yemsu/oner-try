<template>
  <search-box
    category="닉네임(대소문자 구분)"
    :matchingData="{type: 'string', data: matchingData}"
    :rankingList="rankingList"
    :size="size"
    resultPath="/character"
    :paramKey="['nickname']"
    :use-param="false"
    :use-auto-enter="false"
    alert-message="존재하지 않는 닉네임이거나, 보유 캐릭터가 없습니다."
    @onSearch="fnSearch"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  props: {
    matchingData: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: () => "basic"
    },
    fnSearch: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      rankingList: null,
    }
  },
  computed: {
    ...mapGetters({
      gameUsers: 'character/getGameUsers',
      pageViews: 'pageView/getCharacter',
      pageViewRanking: 'pageView/getCharacterSearchRanking',
    }),
  },
  async created() {
    if(this.pageViews.length === 0) await this.getPageView(10)
    this.rankingList = this.pageViewRanking.map(data => Object.keys(data)[0])
  },
  methods: {
    ...mapActions({
      getPageView: 'pageView/GET_CHARACTER',
    }),
  }
}
</script>