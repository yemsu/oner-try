<template>
  <Transition name="slideUp">
    <div v-if="isVisible" class="popup-toast">
      <p>{{ message }}</p>
    </div>
  </Transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  watch: {
    isTriggerOn(crr, prev) {
      if(crr) {
        this.isVisible = true
        setTimeout(() => {
          this.setToastPopupOn(false)
          this.isVisible = false
        }, 3000)
      }
    }
  },
  computed: {
    ...mapGetters({
      isTriggerOn: 'toastPopup/getIsTriggerOn',
      message: 'toastPopup/getMessage',
    })
  },
  data() {
    return {
      isVisible: false
    }
  },
  methods: {
    ...mapMutations({
      setToastPopupOn: 'toastPopup/SET_IS_TRIGGER_ON',
    })
  }
}
</script>

<style lang="scss" scoped>
.popup-toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  min-width: 250px;
  padding: 10px 20px;
  background-color: var(--color-white);
  border: 1px solid var(--color-point);
  border-radius: 10px;
  transform: translateX(-50%);
  text-align: center;
  box-shadow: 5px 10px 20px var(--color-shadow);
}
</style>