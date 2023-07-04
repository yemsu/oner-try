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
          :options="[1, 2, 3, 4, 5, 6, 7, 8, 9]"
          :default-option="roomCapacity"
          label="최대 인원"
          @onChange="onChangeRoomCapacity"
        />
        <element-option-bar
          title="분류"
          size="small"
          :options="roomTypeOptions"
          :select-list="[selectedRoomType]"
          :can-multi-select="false"
          @onChange="(list) => selectedRoomType = list[0]"
        />
        <div class="wrap-checks">
          <element-input
            id="needHelper"
            label="헬퍼 요청"
            input-type="checkbox"
            @onUpdateInput="(checked) => isNeedHelper = checked"
          />
          <element-input
            id="allowBeginner"
            label="초보 가능"
            input-type="checkbox"
            @onUpdateInput="(checked) => isAllowBeginner = checked"
          />
        </div>
      </layout-create-content>
    </template>
  </top-slide-popup>
</template>

<script>
import TopSlidePopup from '@/components/common/TopSlidePopup.vue'
import { mapGetters, mapActions } from 'vuex'

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
  computed: {
    ...mapGetters({
      roomTypes: 'party/getRoomTypes'
    })
  },
  data() {
    return {
      roomTitle: '',
      roomCapacity: 6,
      isFocusTitleInput: false,
      selectedRoomType: null,
      roomTypeOptions: [],
      isNeedHelper: false,
      isAllowBeginner: false,
    }
  },
  async created() {
    if(this.roomTypes.length === 0) await this.getRoomTypes()
    this.roomTypeOptions = this.roomTypes.map(({id, name}) => ({
      id, text: name
    }))
  },
  methods: {
    ...mapActions({
      getRoomTypes: 'party/GET_ROOM_TYPES',
      postChatRoom: 'party/POST_CHAT_ROOM',
      getChatRoom: 'party/GET_CHAT_ROOM',
    }),
    onUpdateRoomTitle(value) {
      this.roomTitle = value
    },
    checkValidation() {
      const alertMessages = []
      if(!this.roomTitle) {
        alertMessages.push(this.$ALERTS.VALIDATIONS.TITLE)
      }
      if(!this.roomCapacity) {
        alertMessages.push(this.$ALERTS.VALIDATIONS.TITLE)
      }
      if(!this.selectedRoomType) {
        alertMessages.push(this.$ALERTS.VALIDATIONS.CATEGORY)
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
        capacity: this.roomCapacity,
        roomTypeId: this.selectedRoomType,
        isNeedHelper: this.isNeedHelper,
        isAllowBeginner: this.isAllowBeginner
      })
      if(!postChatRoom) {
        alert(this.$ALERTS.CHAT.CREATE_FAIL)
        return
      }
      this.getChatRoom(postChatRoom.id)
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
.wrap-checks {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>