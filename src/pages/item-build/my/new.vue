<template>
  <div>
    <div class="inner-size-basic mrg-top-medium">
      <div class="area-page-title">
        <h2 class="title">🔥 빌드 만들기</h2>
      </div>
    </div>
    <item-build-form 
      :build-info-string="buildInfoString"
      :build-title="buildTitle"
      :build-characters="buildCharacters"
      :is-on-focus-title="isOnFocusTitle"
      :is-on-focus-stack="isOnFocusStack"
      @onUpdateTitleInput="(stack) => itemStack = stack"
      @onUpdateStackInput="(title) => buildTitle = title"
      @onChangeCharacterOption="(list) => buildCharacters = list"
      @onSelectItem="onSelectItem"
      @onAddItem="onAddItem"
    />
    <div class="inner-size-basic">
      <section>
        <h2 class="ir-hidden">선택한 아이템빌드</h2>
        <item-build
          v-if="buildInfoString"
          :build-info="buildInfoString"
          :making-mode="true"
          @delete="onDeleteBuildItem"
        />
      </section>
      <wrap-buttons>
        <base-button
          type="square-round"
          size="large"
          bg="point"
          @click="onClickSave"
        >빌드 저장</base-button>
      </wrap-buttons>
    </div>
  </div>
</template>

<script>
import setMeta from '@/plugins/utils/meta';
import ItemBuildForm from '@/components/item-build/ItemBuildForm.vue';
import WrapButtons from '@/components/common/WrapButtons.vue';
import ItemBuild from '@/components/item/ItemBuild.vue'
import BaseButton from '@/components/common/BaseButton.vue';
import { getTotalOption, getCharacterSynergies } from '@/plugins/utils/character'
import { mapGetters, mapActions } from 'vuex';
import ALERTS from '@/constants/ALERTS.js'

export default {
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `MY 빌드 만들기`,
      description: 'MY 빌드 만들기. 나만의 빌드를 만들어볼 수 잇습니다.',
    })
  },
  components: {
    ItemBuild,
    WrapButtons,
    ItemBuildForm,
    BaseButton
  },
  head() {
    return setMeta({
      url: this.$route.fullPath,
      title: `빌드 만들기`,
      description: `나만의 빌드를 만들어 보세요!`,
    })
  },
  data() {
    return {
      buildTitle: '',
      buildCharacters: [],
      buildInfo: {
        equipment: new Array(6),
        sailor: new Array(6),
        colleague: new Array(3),
        ship: new Array(1),
        ryuo: new Array(1),
        synergy: [],
        totalOption: []
      },
      buildInfoString: null,
      isSaveSuccess: false,
      isOnFocusStack: false,
      isOnFocusTitle: false,
    }
  },
  computed: {
    ...mapGetters({
      synergies: 'item/getSynergies',
      isLogin: 'auth/getIsLogin',
    })
  },
  async created() {
    if(this.synergies.length === 0) await this.getSynergies()
    this.setTotalOption()
    this.setBuildInfoString()
  },
  mounted() {
    this.addBeforeUnloadEvent()
  },
  beforeRouteLeave (to, from, next) {
    if(this.isSaveSuccess) {
      next()
      return
    }
    const willLeave = confirm('페이지를 떠나시겠습니까? \n변경사항이 저장되지 않을 수 있습니다.')
    if(willLeave) next()
  },
  beforeDestroy() {
    this.removeBeforeUnloadEvent()
  },
  methods: {
    ...mapActions({
      getSynergies: 'item/GET_SYNERGIES',
      saveItemBuild: 'itemBuild/POST_ITEM_BUILD',
    }),
    addBeforeUnloadEvent() {
      window.addEventListener('beforeunload', this.confirmClose);
    },
    removeBeforeUnloadEvent() {
      window.removeEventListener('beforeunload', this.confirmClose);
    },
    confirmClose(e) {
      e.preventDefault();
      e.returnValue = '';
    },
    setBuildInfoString() {
      this.buildInfoString = JSON.stringify(this.buildInfo)
    },
    setTotalOption() {
      this.buildInfo.totalOption = getTotalOption(this.buildInfo, this.buildInfo.synergy)
    },
    onSelectItem() {
      setTimeout(() => {
        this.isOnFocusStack = true
      }, 100);
      setTimeout(() => {
        this.isOnFocusStack = false
      }, 500)
    },
    onAddItem({ selectedItem, blankSlotIndex }) {
      this.buildInfo[selectedItem.type][blankSlotIndex] = selectedItem
      this.ProcessAfterUpdateItem(selectedItem)
    },
    ProcessAfterUpdateItem(item) {
      if(item.type === 'sailor') {
        this.buildInfo.synergy = getCharacterSynergies(this.buildInfo.sailor, this.synergies)
      } 
      this.setTotalOption()
      this.setBuildInfoString()
    },
    async onClickSave() {  
      const { equipment, sailor, colleague, ship } = this.buildInfo
      const passValidation = this.checkValidation()
      if(!passValidation) return
      const saveSuccess = await this.saveItemBuild({
        title: this.buildTitle,
        characterName: this.buildCharacters[0],
        equipment: this.stringifyForDB(equipment), 
        sailor: this.stringifyForDB(sailor), 
        colleague: this.stringifyForDB(colleague), 
        ship: this.stringifyForDB([ship[0]])
      })
      
      if(!saveSuccess) return
      this.isSaveSuccess = true
      this.$router.push('/item-build/my')
    },
    stringifyForDB(itemList) {
      const dbData = itemList
        .filter((item) => !!item)
        .map((item) => `${item.id}:${item.stack}`)
        .join(',')
      return dbData
    },
    checkValidation() {
      if(!this.isLogin) {
        alert(ALERTS.NEED_LOGIN)
        return false
      }
      const { equipment, sailor, colleague, ship } = this.buildInfo

      const alertMessages = []
      if(!this.buildTitle) {
        alertMessages.push(ALERTS.VALIDATIONS.TITLE)
        this.isOnFocusTitle = true
        setTimeout(() => {
          this.isOnFocusTitle = false
        }, 500)
      }
      if(this.buildCharacters.length === 0) {
        alertMessages.push(ALERTS.VALIDATIONS.CHARACTER)
      }
      const items = [...equipment, ...sailor, ...colleague, ...ship].filter(item => item)
      if(items.length === 0) {
        alertMessages.push(ALERTS.VALIDATIONS.ITEM)
      }
      if(alertMessages.length > 0) {
        alert(alertMessages.join('\n'))
        return false
      }    

      return true
    },
    onDeleteBuildItem({ item, index }) {
      this.buildInfo[item.type].splice(index, 1, null)
      this.ProcessAfterUpdateItem(item)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/item-build/new.scss';
</style>