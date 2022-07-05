<template>
  <div class="item-box-info">
    <img v-if="wantedPaper" src="@/assets/images/wanted-text.png" class="img-wanted" alt="WANTED">
    <div class="area-img">
      <img
        v-if="imgSrc"
        :src="imgSrc"
        alt=""
        class="img-item"
      />
      <p v-else-if="isNoDataItem && !roundImg" class="img-item blank no-id">
        아이템명 알려주기 click!
      </p>
      <p v-else-if="!isNoDataItem" class="img-item blank no-src">
        이미지 준비중
      </p>
      <p v-else class="img-item blank">
        ???
      </p>
      <div v-if="!onlyImg" class="badges">
        <template v-if="!wantedPaper">
          <p v-if="badgeDrop && item.dropMonster" class="badge drop-monster">
            드랍
          </p>
          <p
            v-if="isComp && badgeType"
            :class="`badge ${isRecruit ? 'recruit' : 'mix'}`"
          >
            {{ isRecruit ? '영입' : '조합'}}
          </p>
          <p v-if="item.stack" class="badge black line-gold">
            {{ item.stack }}
          </p>
          <p v-if="item.type && showType" :class="`badge type ${item.type}`">
            {{ typeName(item.type) }}
          </p>
          <p v-if="item.requiredNumber" class="badge black">
            {{ item.requiredNumber }}
          </p>
        </template>
        <p v-if="customBadge" class="badge black">
          {{ customBadge }}
        </p>
      </div>
    </div>
    <p v-if="!wantedPaper && showName" class="name"><span class="text">{{ item.name }}</span></p>
    <p v-if="wantedPaper && showBounty" class="bounty"><span class="text">$ {{ item.bounty || 0 }}</span></p>
  </div>
</template>

<script>
import { imgSrc } from '@/plugins/item'

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    showType: {
      type: Boolean,
      default: () => false
    },
    showName: {
      type: Boolean,
      default: () => true
    },
    showBounty: {
      type: Boolean,
      default: () => true
    },
    badgeDrop: {
      type: Boolean,
      default: () => true 
    },
    badgeType: {
      type: Boolean,
      default: () => true 
    },
    isComp: {
      type: Boolean,
      default: () => false
    },
    wantedPaper: {
      type: Boolean,
      default: () => false
    },
    isNoDataItem: {
      type: Boolean,
      default: () => false
    },
    onlyImg: {
      type: Boolean,
      default: () => false
    },
    roundImg: {
      type: Boolean,
      default: () => false
    },
    customBadge: {
      type: String,
      default: () => ''
    },
  },
  computed: {
    isRecruit() {
      return this.item.ingredients.length === 1
    },
    imgSrc() {
      const { type, id, groupName } = this.item
      
      const data = [type, id]
      data.forEach(key => {
        this.checkData(key) 
        return ''
      })
      const imgName = groupName || id
      // return ``
      return imgSrc(type, imgName)
    },
  },
  methods: {
    checkData(key = '') {
      if(this.item[key]) console.error(`${this.item.name} has no "${key}"`)
    },
    typeName(type) {
      switch (type) {
        case 'sailor':
          return '선원'
        case 'colleague':
          return '동료'
        case 'etcItem':
          return '기타'
        default:
          break;
      }
    },
  }
}
</script>
