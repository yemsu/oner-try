<template>
  <div class="inner-size-basic">
    <div>
      <base-input 
        category="제목"
        :value="inputTitle"
      />
      <select name="" id="">
        <option value="">캐릭터 선택</option>
        <option value="캐릭터1">캐릭터1</option>
        <option value="캐릭터2">캐릭터2</option>
      </select>
      <select name="" id="">
        <option value="">포지션 선택</option>
        <option value="룬파괴">룬파괴</option>
        <option value="딜러">딜러</option>
      </select>
      <p>
        –장비 착용제한- <br>
        전용무기 1, 소울링 1, 
        광대의 코 1, 
        무기 1,  
        악세 1,
      </p>

      <item-build :isBuildTool="true" />

      <textarea name="" id="" cols="30" rows="10"></textarea>
    </div>
    <button>저장하기</button>
  </div>
</template>

<script>
import ItemBuild from '@/components/item/ItemBuild.vue'
import BaseInput from '@/components/common/BaseInput.vue'
export default {
  components: {
    ItemBuild,
    BaseInput,
  },
  data() {
    return {
      inputTitle: ''
    }
  },

}
</script>

<style>
</style>2,923,077