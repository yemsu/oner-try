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
        if(this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
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
      isVisible: false,
      timer: null
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
  z-index: $toast-popup-z-index;
  min-width: 250px;
  padding: 10px 20px;
  background-color: var(--color-pure-white);
  border: 1px solid var(--color-point);
  border-radius: 10px;
  transform: translateX(-50%);
  text-align: center;
  box-shadow: 0 0 30px 15px var(--color-shadow);
}
</style>