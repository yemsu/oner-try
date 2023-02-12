<template>
  <div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      equipments: 'mrpg/getEquipments',
      materials: 'mrpg/getMaterials',
    })
  },
  async created() {
    if(this.equipments.length === 0) await this.getEquipments()
    if(this.materials.length === 0) await this.getMaterials()
    console.log('created', this.equipments, this.materials)
  },
  methods: {
    ...mapActions({
      getEquipments: 'mrpg/GET_EQUIPMENTS',
      getMaterials: 'mrpg/GET_MATERIALS',
    })
  }
}
</script>

<style lang="scss" scoped></style>