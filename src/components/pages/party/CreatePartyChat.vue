<template>
  <top-slide-popup
    :show="show"
    popup-title="내 빌드 공유하기"
    button-type="confirm"
    class="create-item-setting"
    @close="close()"
    @cancel="close()"
    @submit="submit()"
  >
    <template v-slot:content>
      <layout-create-content>
        <element-input
          id="roomTitle"
          label="파티 제목"
          placeholder="파티 제목"
          :value="roomTitle"
          :focus-time="isFocusTitleInput"
          @onUpdateInput="onUpdateRoomTitle"
        />
        <element-select
          id="roomCapacity"
          :options="[2, 3, 4, 5, 6]"
          :default-option="roomCapacity"
          label="최대 인원"
          @onChange="onChangeRoomCapacity"
        />
      </layout-create-content>
    </template>
  </top-slide-popup>
</template>

<script>
import TopSlidePopup from '@/components/common/TopSlidePopup.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    TopSlidePopup
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      roomTitle: '',
      roomCapacity: 6,
      isFocusTitleInput: false,
    }
  },
  methods: {
    ...mapActions({
      postChatRoom: 'party/POST_CHAT_ROOM',
    }),
    onUpdateRoomTitle(value) {
      this.roomTitle = value
    },
    checkValidation() {
      const alertMessages = []
      if(!this.roomTitle) {
        alertMessages.push('📌 제목을 입력해 주세요')
      }
      if(!this.roomCapacity) {
        alertMessages.push('📌 최대 인원을 선택해 주세요')
      }

      if(alertMessages.length > 0) {
        alert(alertMessages.join('\n'))
        if(alertMessages.find(msg => msg.includes('제목'))) {
          this.focusToTitleInput()
        } 
        return false
      }
      return true
    },
    focusToTitleInput() {
      this.isFocusTitleInput = true
      setTimeout(() => {
        this.isFocusTitleInput = false
      }, 500)
    },
    onChangeRoomCapacity(value) {
      this.roomCapacity = value
    },
    async createChatRoom() {
      const postChatRoom = await this.postChatRoom({
        title: this.roomTitle,
        gameType: 'oner',
        capacity: this.roomCapacity
      })
      if(postChatRoom) {
        this.$router.push({
          name: 'party-view',    
          query: {
            id: postChatRoom.id
          }
        })
      } else {
        alert(this.$msg.failCreate)
      }
      this.resetData()
    },
    resetData() {
      this.roomTitle = ''
    },
    close() {
      this.$emit('close')
      this.resetData()
    },
    submit() {
      const checkValidation = this.checkValidation()
      if(!checkValidation) return
      this.createChatRoom()
      this.close()
    },
  }
}
</script>

<style lang="scss" scoped>
</style>