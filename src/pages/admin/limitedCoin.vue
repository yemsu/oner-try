<template>
  <div>exchange</div>
</template>

<script>
import { getRawCharacterData } from '@/plugins/utils/https'
export default {
  data() {
    return {
    }
  },
  async created() {
    const response = await getRawCharacterData({ nickName: 'muhantry' })
    if(!response) return
    console.log('response', response.data)
  }
}
</script>

<style>
</style>