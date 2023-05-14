<template>
  <section v-if="itemBuild">
    <div class="content-top">
      <div class="inner-size-basic">
        <item-box
          :item="itemBuild.hero"
          :wanted-paper="true"
          :size="'big'"
          :show-bounty="false"
          :customBadge="itemBuild.hero.name"
        />
        <div class="area-page-title">
          <div class="align-left">
            <h2 class="page-title">{{ itemBuild.title }}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="inner-size-basic mrg-top-medium">
      <section>
        <h2 class="ir-hidden">아이템빌드</h2>
        <item-build
          v-if="buildInfoString"
          :build-info="buildInfoString"
        />
      </section>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ItemBuild from '../../../components/item/ItemBuild.vue'

export default {
  components: {
    ItemBuild
  },
  data() {
    return {
      buildInfoString: null,
    }
  },
  computed: {
    ...mapGetters({
      itemBuild: 'itemBuild/getItemBuild'
    }),
  },
  async created() {
    const res = await this.getItemBuild(this.$route.params.id)
    if(!res) return
    this.buildInfoString = JSON.stringify(this.itemBuild)
  },
  methods: {
    ...mapActions({
      getItemBuild: 'itemBuild/GET_ITEM_BUILD'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/item-build/my/id.scss';
</style>