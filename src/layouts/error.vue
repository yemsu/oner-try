<template>
  <div class="wrap-error">
    <layout-content-wrap
      size="basic"
      pd-top="none"
      :is-main-content="true"
    >
      <template v-if="pageError.statusCode === 600">
        <common-main-notice
          title="점검 중입니다.🧐"
          :point-text="pageError.statusCode"
        >
          동료 콤비 및 신규 스탯 추가를 위해 점검 중입니다!<br>
          약 30분 소요될 예정입니다. (10:00 ~ 10:30)
        </common-main-notice>
      </template>
      <template v-else-if="pageError.statusCode === 404">
        <common-main-notice
          title="존재하지 않는 페이지 입니다.😫"
          :point-text="pageError.statusCode"
        > 
          url을 확인해 주세요!
        </common-main-notice>
      </template>
      <template v-else>
        <common-main-notice
          title="에러가 발생하였습니다.😲"
          :point-text="pageError.statusCode"
          :sub-text="pageError.message"
        >
          새로고침이나 로그인을 다시 시도해봐주시고, <br>문제가 지속되면 해당 화면을 캡쳐하여 개발자에게 문의해주세요!
        </common-main-notice>
      </template>
      <p class="text-sub-2">
        에러 문의 및 제보는 사이트 개선에 큰 도움이 됩니다!<br>
        👉
        <element-button
          type="text link"
          color="point-sub"
          linkTo="https://open.kakao.com/o/sSXWcmPd"
          button-title="새창(카카오톡 오픈챗)"
        >muhantry 카카오톡 오픈챗</element-button>
      </p>
      <element-button
        linkTo="/"
        type="square-round"
        bg="point"
      >메인으로 돌아가기</element-button>
    </layout-content-wrap>
  </div>
</template>

<script>
import setMeta from '@/plugins/utils/meta';

export default {
  head() {
    return setMeta ({
      url: this.$route.fullPath,
      title: `에러 페이지 - ${this.error?.statusCode}`,
    })
  },
  props: ['error'],
  data() {
    return {
      pageError: null
    }
  },
  created() {
    if(!this.error) {
      const error = new Error()
      error.statusCode = 600
      this.pageError = error
      return
    }
    this.pageError = this.error
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.text-sub-2 {
  color: var(--font-gray);
  a {
    color: var(--font-gray);
    text-decoration: underline;
  }
}
</style>