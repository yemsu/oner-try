<template>
  <div
    :class="[
      'adsense',
      `type-${type}`,
      position ? `pos-${position}` : '',
      `layout-${containerSize}`,
      { 'shade': isLocal },
      adStatus,
    ]"
    
    >
    <ins
      :class="`adsbygoogle ${name}`"
      ref="adsense"
      data-ad-client="ca-pub-4052679554213032"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
      :data-full-width-responsive="fullWidthResponsive"
      :style="adStyle"
    ></ins>
   </div>
</template>
 
 <script>
 export default {
  props: {
    adSlot: {
      type: String,
      required: true
    },
    adFormat: {
      type: String,
      default: () => ''
    },
    fullWidthResponsive: {
      type: String,
      default: () => ''
    },
    adStyle: {
      type: String,
      default: () => ''
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true // side-fix, content-bottom, content-top
    },
    position: {
      type: String,
      default: () => ''
    },
    containerSize: {
      type: String,
      default: () => 'basic'
    },
  },
  data() {
    return {
      isLocal: process.env.NODE_ENV === 'development',
      adStatus: null,
    }
  },
   mounted() {
    if(this.isLocal) return
     this.$nextTick(() => {
       try {
        this.executeWindowAds()
       } catch(e) {
         console.log('google ads error', e)
       }
     }) 
   },
   methods: {
    executeWindowAds() {
      setTimeout(() => {
        // console.log('executeWindowAds type', this.type, '/', this.position)
        // console.log('executeWindowAds before', JSON.stringify(window.adsbygoogle))
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
        this.setAdStatus()
        // console.log('executeWindowAds after', window.adsbygoogle,)
      }, 300)
    },
    setAdStatus() {
      const target = document.querySelector(`ins[data-ad-slot="${this.adSlot}"]`);      
      const observer = new MutationObserver(([mutation]) => {
        if(mutation.attributeName === 'data-ad-status') {
          this.adStatus = mutation.target.dataset.adStatus
          observer.disconnect();
        }
      });
      const config = { attributes: true };
      // 감시자 옵션 포함, 대상 노드에 전달
      observer.observe(target, config);
    }
  }
}
 </script>
 
<style lang="scss" scoped>
@import '@/assets/style/components/common/BaseAdsense.scss';
</style>