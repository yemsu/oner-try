<template>
  <div class="wrap-join-content">
    <section>
      <label for="nickName">
        <h2 class="title">ONER TRY에서 사용할 닉네임을 입력해주세요 💀</h2>
      </label>
      <base-input 
        id="nickName"
        size="big"
        category="닉네임"
        :value="inputValue"
        @onUpdateInput="updateInput"
        @onEnter="onEnterInput"
      />
      <div class="wrap-text">
        <p :class="typeNoticeClassName">영문/숫자/특수기호 - _ . [ ]만 사용 가능</p>
        <p :class="LengthNoticeClassName">4자리 이상, 15자리 이하</p>
        <p v-if="showDupleNotice" :class="duplNoticeClassName">
          {{ isDuplNick ? '사용중인 닉네임' : '사용 가능한 닉네임'}}
        </p>
      </div>
      <div class="wrap-buttons align-right">
        <button
          v-if="isAllPass"
          class="btn-enter"
          @click="onEnterInput"
        >ENTER를 눌러 회원가입 🎉</button>
      </div>
    </section>

    <!-- <section
      v-if="joinStep === 2"
      class="section-step-2"
    >
      <h2 class="title">👇 닉네임 최종 컨펌! </h2>
      <div class="wrap">
        <p class="text-result">{{ this.inputValue }}</p>
      </div>
      <div class="wrap-buttons">
        <base-button
          class="btn-confirm"
          bg="active"
          type="square-round"
          size="large"
          @click="joinSuccess"
        >컨펌 완료 (ctrl enter)</base-button>
        <base-button
          class="btn-re"
          bg="inActive"
          type="square-round"
          size="large"
          @click="joinStep = 1"
        >다시 정할래요 (backspace)</base-button>
      </div>
    </section> -->
  </div>
</template>

<script>
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { getIsDuplNick, postUserJoin } from "@/plugins/utils/https"
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    BaseInput,
    BaseButton
  },
  data() {
    return {
      inputValue: '',
      isDuplNick: false,
      isDupleNickWatcher: false,
      isPopupVisible: false,
    }
  },
  watch: {
    isDuplNick(crr, pre) {
      this.isDupleNickWatcher = crr
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin'
    }),
    noInputValue() {
      return this.inputValue === ''
    },
    isPassTextType() {
      if(!this.inputValue) return false
      
      const reg = /[a-zA-Z0-9\[\]-_.]/gim;
      const checkTextType = this.inputValue.match(reg)
      return checkTextType?.length === this.inputValue.length
    },
    isPassLength() {
      return this.inputValue.length >= 4 && this.inputValue.length <= 15
    },
    typeNoticeClassName() {
      if(this.noInputValue) return ''
      return this.isPassTextType ? 'text-pass' : 'text-block'
    },
    LengthNoticeClassName() {
      if(this.noInputValue) return ''
      return this.isPassLength ? 'text-pass' : 'text-block'
    },
    showDupleNotice() {
      return this.isPassTextType && this.isPassLength
    },
    duplNoticeClassName() {
      if(this.noInputValue) return ''
      console.log('duplNoticeClassName', this.isDuplNick, this.isDupleNickWatcher)
      return this.isDupleNickWatcher ? 'text-block' : 'text-pass'
    },
    isAllPass() {
      return !this.isDupleNickWatcher && this.isPassTextType && this.isPassLength
    }
  },
  mounted() {
    this.isLogin && this.$router.push('/')
  },
  methods: {
    ...mapMutations({
      setIsLogin: 'auth/SET_IS_LOGIN'
    }),
    updateInput(value) {
      this.inputValue = value
      this.checkDupleNick()
    },
    async onEnterInput() {
      if(!this.isAllPass) return

      const res = await postUserJoin({ 
        nick: this.inputValue,
        idToken: sessionStorage.getItem('GCID')
      })
      sessionStorage.removeItem('GCID')
      sessionStorage.setItem('JUID', res.token)
      this.setIsLogin(true)
      this.$router.push('/')
    },
    async checkDupleNick() {
      if(!this.showDupleNotice) return
      
      console.log('this.inputValue', this.inputValue)
      const checkDuplNick = await getIsDuplNick({ nick: this.inputValue })
      this.isDuplNick = checkDuplNick
      console.log("checkDuplNick", checkDuplNick, this.isDuplNick)
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/join/index.scss';
</style>