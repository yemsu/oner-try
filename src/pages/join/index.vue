<template>
  <div class="wrap-content small center">
    <section>
      <label for="nickName" class="title">
        <h2>ONER TRY에서 사용할 닉네임을 입력해주세요 💀</h2>
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
        <p :class="LengthNoticeClassName">4자리 이상</p>
        <p v-if="showDupleNotice" :class="duplNoticeClassName">
          {{ isDuplNick ? '사용중인 닉네임' : '사용 가능한 닉네임'}}
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import BaseInput from '@/components/common/BaseInput.vue'
import { getIsDuplNick } from "@/plugins/utils/https"

export default {
  components: {
    BaseInput
  },
  data() {
    return {
      inputValue: '',
      isDuplNick: false,
      isDupleNickWatcher: false
    }
  },
  watch: {
    isDuplNick(crr, pre) {
      this.isDupleNickWatcher = crr
    }
  },
  computed: {
    noInputValue() {
      return this.inputValue === ''
    },
    hasOtherType() {
      if(!this.inputValue) return false
      
      const reg = /[a-zA-Z0-9\[\]-_.]/gim;
      const checkTextType = this.inputValue.match(reg)
      return checkTextType?.length !== this.inputValue.length
    },
    isUnderLength() {
      return this.inputValue.length < 4
    },
    typeNoticeClassName() {
      if(this.noInputValue) return ''
      return this.hasOtherType ? 'text-block' : 'text-pass' 
    },
    LengthNoticeClassName() {
      if(this.noInputValue) return ''
      return this.isUnderLength ? 'text-block' : 'text-pass'
    },
    showDupleNotice() {
      console.log('showduple', !this.hasOtherType, this.isUnderLength)
      return !this.hasOtherType && !this.isUnderLength
    },
    duplNoticeClassName() {
      if(this.noInputValue) return ''
      console.log('duplNoticeClassName', this.isDuplNick, this.isDupleNickWatcher)
      return this.isDupleNickWatcher ? 'text-block' : 'text-pass'
    },
  },
  methods: {
    updateInput(value) {
      this.inputValue = value
      this.checkDupleNick()
    },
    onEnterInput() {
      
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

<style lang="scss">
  .wrap-content {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30vh;
  }
  .title {
    display: block;
    margin-bottom: 30px;
  }
  .text-block {
    color: $color-ban;
    &:after {
      content: ' ❌';
    }
  }
  .text-pass {
    color: $badge-color-green;
    &:after {
      content: ' ✔';
    }
  }
  .wrap-text {
    margin-top: 10px;
    text-align: right;
  }
</style>