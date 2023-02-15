<template>
  <div
    class="wrap-ingredients"
    style="margin-top: 10px; border: 1px solid #aaa"
  >
    <div
      v-for="(item, i) in checkboxItems"
      :key="`item${i}`"
      class="item"
    >
      <div class="wrap-checkbox">
        <input
          type="checkbox"
          :id="`item-${id}${i}`"
          :checked="checkList.includes(`item-${id}${i}`) ? true : false"
          @change="(e) => changeCheckBox(e, `item-${id}${i}`)"
        />
        <label :for="`item-${id}${i}`">
          {{ item.name }} * {{ item.number }}
          - {{ findDropMonster(item.name) }}
        </label>
      </div>
      <slot :ingredients="item.ingredients" :index="i"></slot>
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
    }
  },
  data() {
    return {
      STORAGE_NAME: null,
      checkboxItems: [],
      checkList: [],
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
        return `드랍: ${material.dropMonster}`
      }
      // 조합/드랍 무기 아이템인 경우
      const equipment = this.equipments.find(({ name }) => name === itemName)
      if(!equipment) return '❗미등록 아이템'
      if(equipment.ingredients) {
        return '조합 아이템'
      } else {
        return `드랍: ${equipment.dropMonster}`
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
    }
  }
}
</script>

<style lang="scss" scoped></style>1