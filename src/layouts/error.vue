<template>
  <div class="wrap-error">
    <layout-content-wrap
      size="basic"
      pd-top="none"
      :is-main-content="true"
    >
      <template v-if="error.statusCode === 600">
        <h2 class="title">
          <!-- <span class="error-code">{{error.statusCode}}</span> -->
          점검 중입니다.🧐
        </h2>
        <p class="error-desc">
          버그 수정 및 새로운 기능 오픈 준비를 위해 점검 중입니다!<br>
          30분 정도 소요될 예정입니다.
        </p>
      </template>
      <template v-else-if="error.statusCode === 404">
        <h2 class="title">
          <span class="error-code">{{error.statusCode}}</span>
          존재하지 않는 페이지 입니다.😫
        </h2>
        <p class="error-desc">url을 확인해 주세요!</p>
      </template>
      <template v-else>
        <h2 class="title">
          <span class="error-code">{{error.statusCode}}</span> 에러가 발생하였습니다.😲
        </h2>
        <p class="error-desc">새로고침이나 로그인을 다시 시도해봐주시고, <br>문제가 지속되면 해당 화면을 캡쳐하여 개발자에게 문의해주세요!</p>
        <p class="error-msg">{{ error.message }}</p>
      </template>
      <p class="text-sub">
        에러 문의 및 제보는 사이트 개선에 큰 도움이 됩니다!<br>
        👉
        <base-button
          type="text link"
          color="point-sub"
          linkTo="https://open.kakao.com/o/sSXWcmPd"
          button-title="새창(카카오톡 오픈챗)"
        >muhantry 카카오톡 오픈챗</base-button>
      </p>
      <base-button
        linkTo="/"
        type="square-round"
        bg="point"
      >메인으로 돌아가기</base-button>
    </layout-content-wrap>
  </div>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'
import setMeta from '@/plugins/utils/meta';

export default {
  components: {
    BaseButton,
  },
  head() {
    return setMeta ({
      url: this.$route.fullPath,
      title: `에러 페이지 - ${this.error?.statusCode}`,
    })
  },
  props: ['error'],
  created() {
    if(!this.error) {
      const error = new Error()
      error.statusCode = 600
      this.error = error
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.wrap-error {
  .title {
    font-size: var(--font-size-title-B);
  }
  .error-desc {
    font-size: var(--font-size-B);
  }
  .error-msg {
    font-size: var(--font-size-S);
    color: var(--font-dark-gray);
  }
  .text-sub {
    color: var(--font-dark-gray);
    a {
      color: var(--font-dark-gray);
      text-decoration: underline;
    }
  }
  .error-code {
    display: block;
    font-size: 90px;
    color: var(--font-gray);
    font-weight: var(--font-weight-B);
    line-height: 1.2;
    letter-spacing: 0.05em;
  }
}
</style>