<template>
  <div class="inner-size-basic">
    <h2 class="ir-hidden">목표 아이템 설정</h2>
    <div
      v-if="!isLogin || itemSettingList.length === 0"
      class=""
    >
      <p><span v-if="!isLogin">구글 로그인 후, </span>목표 아이템을 설정하고 하나씩 달성해 나가보세요!</p>
      <p>아이템 선택하면, 필요한 재료 아이템을 확인할 수 있습니다.</p>
      <p>재료 아이템이 조합아이템이라면, 해당 아이템의 재료 아이템까지 확인하실 수 있어요!</p>
      <p>재료 아이템을 습득했다면, 체크! 해주세요.</p>
      <p>목표 아이템을 위해 필요한 재료아이템 총합도 확인할 수 있습니다. 체크한 아이템은 계산에서 제외됩니다!</p>
    </div>
    <div v-if="isLogin">
      <make-item-setting
        v-if="equipTypeOptions && characterOptions && equipmentTypes && equipMatchingDataList"
        :equip-type-options="equipTypeOptions"
        :character-options="characterOptions"
        :equipment-types="equipmentTypes"
        :equip-matching-data-list="equipMatchingDataList"
        @onUpdateSelectItem="onUpdateSelectItem"
        @submit="onSubmit"
      />

      <!-- 리스트 -->
      <section>
        <h2>나의 목표 아이템 세팅</h2>
        <div
          v-for="({title, character, items, id}, i) in itemSettingList"
          :key="`itemSetting${i}`"
        >
          <p>{{ title }}</p>
          <p>{{ character }}</p>
          <ul>
            <li
              v-for="(itemName, i) in items"
              :key="`savedItem${i}`"
            > 
              {{ itemName }}
            </li>
          </ul>
          <base-button
            @click="deleteItemSetting(id)"
          >
            삭제
          </base-button>
          <base-button
            :link-to="`/my/item-setting/view?id=${id}`"
          >
            자세히 보기
          </base-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'
import MakeItemSetting from '@/components/pages/my/item-setting/MakeItemSetting.vue'
import { getValueList } from '@/plugins/utils'
import { characterDefs, totalOptions, itemTypeNames } from '@/plugins/utils/item-def-mrpg'
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'item-setting',
  components: {
    BaseButton,
    MakeItemSetting
  },
  data() {
    return {
      equipMatchingDataList: null,
      equipmentTypes: null,
      characterOptions: [],
      // 아이템 필터
      equipTypeOptions: []
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin',
      equipments: 'mrpg/getEquipments',
      materials: 'mrpg/getMaterials',
      itemSettingList: 'item-setting/getItemSettingList',
    }),
  },
  async created() {
    if(this.equipments.length === 0) await this.getEquipments()
    if(this.materials.length === 0) await this.getMaterials()

    this.setEquipMatchingDataList()
    this.setEquipmentTypes()
    this.setCharacterOptions()
    this.setEquipTypeOptions()
  },
  mounted() {
    this.getItemSettingList()

  },
  methods: {
    ...mapMutations({
      addItemSetting: 'item-setting/ADD_ITEM_SETTING',
      deleteItemSetting: 'item-setting/DELETE_ITEM_SETTING'
    }),
    ...mapActions({
      getEquipments: 'mrpg/GET_EQUIPMENTS',
      getMaterials: 'mrpg/GET_MATERIALS',
      getItemSettingList: 'item-setting/GET_ITEM_SETTING_LIST',
    }),
    setEquipMatchingDataList() {
      this.equipMatchingDataList = getValueList(this.equipments, 'name')
    },
    setEquipmentTypes() {
      const equipmentTypeValues = getValueList(this.equipments, 'type')
      this.equipmentTypes = [...new Set(equipmentTypeValues)]
    },
    setCharacterOptions() {
      const characterOptions = characterDefs.reduce((result, crr) => {
        const { mainStat, characters } = crr
        const options = characters.map(({ name, job }) => ({
          text: `${name} : ${job}`
        }))
        result.push(Object.assign({}, { 
          title: totalOptions[mainStat],
          options
        }))
        return result
      }, [])
      
      this.characterOptions = characterOptions
    },
    setEquipTypeOptions() {
      const options = this.equipmentTypes.map(key => ({text: itemTypeNames[key]}))
      const equipTypeOptions = [{ title: '타입', options }]
      this.equipTypeOptions = equipTypeOptions
    },
    onUpdateSelectItem(name) {
      console.log('onUpdateSelectItem', name)
      this.equipMatchingDataList = this.equipMatchingDataList.filter((itemName) => itemName !== name)
    },
    onSubmit(result) {
      // id setting
      let resultData = null
      // get data and check has data
      const savedItemSetting = localStorage.getItem('itemSetting')
      if(savedItemSetting) {
        const data = JSON.parse(savedItemSetting)
        result.id = data.length // set id 
        data.push(result)
        resultData = data
      } else {
        result.id = 0 // set id 
        resultData = [result]
      }
      // send data
      localStorage.setItem('itemSetting', JSON.stringify(resultData))
      // client update
      this.addItemSetting(result)
    }
  }
}
</script>

<style lang="scss" scoped></style>