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
      itemBuilds: 'itemBuild/getItemBuilds'
    })
  },
  async created() {
    await this.getItemBuilds({
      character: 'all',
      page: 1
    })
    console.log('itemBuilds', this.itemBuilds)
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