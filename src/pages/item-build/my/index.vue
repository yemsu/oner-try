<template>
  <section class="inner-size-basic mrg-top-medium">
    <div class="area-page-title">
      <h2 class="title badge-text-wrap">🔥 MY 빌드</h2>        
      <element-button
        type="square-round"
        bg="point"
        link-to="/item-build/my/new"
      >+ NEW</element-button>
    </div>
    <item-build-list
      v-if="isLogin"
      :item-builds="itemBuilds"
      @delete="onBuildDelete"
    />
  </section>
</template>

<script>
import ItemBuildList from '@/components/item-build/ItemBuildList.vue';
import ItemImage from '@/components/item/ItemImage.vue';
import { mapGetters, mapActions } from 'vuex';
import setMeta from '@/plugins/utils/meta';

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `MY 빌드`,
      description: 'MY 빌드 메인 페이지. 생성한 MY 빌드 리스트를 확인하고 새로운 빌드를 생성할 수 있습니다.',
    })
  },
  components: {
    ItemImage,
    ItemBuildList
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      itemBuilds: 'itemBuild/getItemBuilds'
    })
  },
  watch: {
    isLogin(crr, prev) {
      if(crr && crr !== prev) {
        this.getItemBuilds({
          character: 'all',
          page: 1
        })
      }
    }
  },
  async mounted() {
    this.isLogin && await this.getItemBuilds({
        character: 'all',
        page: 1
      })
    setTimeout(() => {
      if(!this.isLogin) {
        alert(this.$ALERTS.NEED_LOGIN)
        this.$router.push({ name: 'auth-login' })
        return
      }
    }, 500)
  },
  methods: {
    ...mapActions({
      getItemBuilds: 'itemBuild/GET_ITEM_BUILDS',
      deleteItemBuilds: 'itemBuild/DELETE_ITEM_BUILD'
    }),
    onBuildDelete(id) {
      const isConfirm = confirm(this.$ALERTS.ITEM_SETTING.DELETE_CONFIRM)
      if(!isConfirm) return
      this.deleteItemBuilds(id)
    }
  }
}
</script>

<style>
</style>