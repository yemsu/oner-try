<template>
  <div
    :class="`list-check depth-${depth}`"
  >
    <div
      v-for="(item, i) in checkboxItems"
      :key="`item${i}`"
      class="box-item"
    >
      <div :class="`box-checkbox`">
        <input
          type="checkbox"
          :id="idName(id, i)"
          :checked="checkList.includes(idName(id, i))"
          @change="(e) => changeCheckBox(e, idName(id, i))"
        />
        <label :for="idName(id, i)">
          {{ item.name }} * {{ item.number }}
          <span class="drop-monster">- {{ findDropMonster(item.name) }}</span>
        </label>
        <button
          v-if="item.ingredients"
          class="button-toggle"
          @click="onToggleOffChildren(i)"
          :title="textToggle(i).title"
        >
          <i :class="`icon-arrow small border-black ${textToggle(i).arrow}`"></i>
        </button>
      </div>
      <div v-show="!toggleOffChildren.includes(i)">
        <slot
          :ingredients="item.ingredients"
          :index="i"
        ></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { 조합재료의재료세팅기 } from '@/plugins/utils/item-mrpg'
import { mapGetters } from 'vuex'

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    depth: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      STORAGE_NAME: null,
      checkboxItems: [],
      checkList: [],
      toggleOffChildren: []
    }
  },
  computed: {
    ...mapGetters({
      equipments: 'mrpg/getEquipments',
      compositionEquips: 'mrpg/getCompositionEquips',
      materials: 'mrpg/getMaterials',
    })
  },
  mounted() {
    this.setStorageName()
    this.getCheckList()
    this.setCheckboxItems()
  },
  methods: {
    setCheckboxItems() {
      /**
       * item의 ingredients 중 조합 아이템이 있지 체크하여
       * 해당 ingredients에 ingredients 값을 세팅.
       * 세팅된 값은 slot의 props로 넘어가 부모 컴포넌트에서 사용됨
       */
      const 조합재료들 = this.조합재료리스트반환(this.items)
      this.checkboxItems = 조합재료들.length > 0
        ? 조합재료의재료세팅기(this.items, 조합재료들)
        : this.items
    },
    조합재료리스트반환(items) {
      // console.log('조합재료리스트반환', items)
      const ingredientNames = items.map(({ name }) => name)
      const compositionItem = this.compositionEquips.filter(({ name }) => ingredientNames.includes(name))
      return compositionItem
    },
    findDropMonster(itemName) {
      // 재료 아이템인 경우
      const material = this.materials.find(({ name }) => name === itemName)
      if(material) {
        return `${material.dropMonster}`
      }
      // 조합/드랍 무기 아이템인 경우
      const equipment = this.equipments.find(({ name }) => name === itemName)
      if(!equipment) return '❗미등록 아이템'
      if(equipment.ingredients) {
        return '조합 아이템'
      } else {
        return `${equipment.dropMonster}`
      }
    },
    setStorageName() {
      this.STORAGE_NAME = `itemSettingCheckListView${this.$route.query.id}`
    },
    getStorage() {
      return localStorage.getItem(this.STORAGE_NAME)
    },
    getCheckList() {    
      console.log('getCheckList')
      const storage = this.getStorage()
      if(!storage) return
      this.checkList = JSON.parse(storage)
    },
    changeCheckBox(e, inputId) {
      const isChecked = e.target.checked
      // console.log("check", isChecked, this.queryId, inputId)
      
      // 체크 여부에 따라 삽입/제거
      if(isChecked) {
        this.addCheckListItem(inputId)
      } else {
        this.deleteCheckListItem(inputId)
      }
    },
    addCheckListItem(inputId) {
      // 컴포넌트 데이터 업데이트
      this.checkList.push(inputId)
      // 페이지별 데이터 local storage 업데이트
      const storageData = JSON.parse(this.getStorage())
      const dataAdded = storageData
        ? storageData.concat([inputId])
        : [inputId]
      this.saveData(dataAdded)
      console.log('add', inputId, this.checkList)
    },
    deleteCheckListItem(inputId) {
      // 컴포넌트 데이터 업데이트
      this.checkList = this.checkList.filter(id => inputId !== id)
      // 페이지별 데이터 local storage 업데이트
      const storageData = JSON.parse(this.getStorage())
      const dataDeleted = storageData.filter(id => id !== inputId)
      this.saveData(dataDeleted)
      console.log('add', inputId, this.checkList)
    },
    saveData(data) {
      localStorage.setItem(
        this.STORAGE_NAME,
        JSON.stringify(data)
      )
    },
    textToggle(i) {
      const isShow = !this.toggleOffChildren.includes(i)
      const data = {
        title: `조합 ${isShow ? '닫기' : '보기'}`,
        arrow: isShow ? 'up' : 'down'
      }
      return data
    },
    onToggleOffChildren(i) {
      console.log('ontoggle1', [...this.toggleOffChildren], i)
      if(this.toggleOffChildren.includes(i)) {
        this.toggleOffChildren = this.toggleOffChildren.filter(index => index !== i)
      } else {
        this.toggleOffChildren.push(i)
      }
      console.log('ontoggle2', [...this.toggleOffChildren], i)
    },
    idName(id, i) {
      return `item-${id}${i}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/pages/my/item-setting/ItemCheckList.scss';
</style>