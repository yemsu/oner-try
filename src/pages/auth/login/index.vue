<template>
  <section class="auth-login">
    <content-layout
      size="basic"
      pd-top="none"
      :is-main-content="true"
    >
      <main-logo size="medium" />
      <h2 class="title">로그인</h2>
      <google-login-button
        :is-in-page="true"
      />
    </content-layout>
  </section>
</template>

<script>
import ContentLayout from '@/components/layout/ContentLayout.vue'
import GoogleLoginButton from '@/components/layout/GoogleLoginButton.vue';
import MainLogo from '@/components/common/MainLogo.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ContentLayout,
    GoogleLoginButton,
    MainLogo,
  },
  data() {
    return {
    }
  },
  watch: {
    isLogin(crr, prev) {
      if(crr) {
        this.$router.back()
      }
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'auth/getIsLogin'
    })
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: var(--font-size-title-B);
  font-weight: var(--font-weight-XB);
}
</style>