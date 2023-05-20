<template>
  <element-button
    type="square-round"
    size="small"
    bg="point"
    @click="copyCharacterResult"
  >
    클립보드에 저장
  </element-button>    
</template>

<script>
import copyHtml2Img from '@/plugins/utils/copyHtml2Img'
import { mapMutations } from 'vuex';

export default {
  props: {
    copyArea: {
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    ...mapMutations({
      setToastPopupMessage: 'toastPopup/SET_MESSAGE',
      setToastPopupOn: 'toastPopup/SET_IS_TRIGGER_ON',
    }),
    async copyCharacterResult() {
      const res = await copyHtml2Img(this.copyArea)
      if(!res) {
        alert(this.$ALERTS.ITEM_SETTING.CLIPBOARD_FAIL)
        return
      }
      this.setToastPopupMessage(this.$ALERTS.ITEM_SETTING.CLIPBOARD_SUCCESS)
      this.setToastPopupOn(true)
    }
  }
}
</script>

<style>
</style>