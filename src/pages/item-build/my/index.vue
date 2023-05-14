<template>
  <section class="inner-size-basic mrg-top-medium">
    <div class="area-page-title">
      <h2 class="title badge-text-wrap">🔥 MY 빌드</h2>        
      <base-button
        type="square-round"
        bg="point"
        link-to="my/new"
      >+ NEW</base-button>
    </div>
    <item-build-list
      :item-builds="itemBuilds"
    />
  </section>
</template>

<script>
import ItemBuildList from '@/components/item-build/ItemBuildList.vue';
import BaseButton from '@/components/common/BaseButton.vue'
import ItemImage from '@/components/item/ItemImage.vue';
import ALERTS from '@/constants/ALERTS'
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    BaseButton,
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
        alert(ALERTS.NEED_LOGIN)
        this.$router.push({ name: 'auth-login' })
        return
      }
    }, 500)
  },
  methods: {
    ...mapActions({
      getItemBuilds: 'itemBuild/GET_ITEM_BUILDS'
    })
  }
}
</script>

<style>
</style>