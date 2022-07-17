<template>
  <div id="googleButton"></div>
</template>

<script>
import * as jose from 'jose'

export default {
  mounted() {
    setTimeout(() => {
      // https://developers.google.com/identity/gsi/web/reference/js-reference#CredentialResponse
      // initialize Google Sign in  
      google.accounts.id.initialize({
          client_id: '899883406328-71437rt8e2ba6v8ivtkglju4k23jc5af.apps.googleusercontent.com',
          callback: this.handleCredentialResponse, //method to run after user clicks the Google sign in button
          context: 'signin'
        })
        
      // render button
      google.accounts.id.renderButton(
          document.getElementById('googleButton'),
          { 
            type: 'standard',
            size: 'small',
            text: 'signin',
            shape: 'rectangular',
            logo_alignment: 'left',
            // theme: 'filled_blue',
            // width: 60,
          }
        )
    }, 300);
  },
  
  methods: {
    handleCredentialResponse(response) {
      const claims = jose.decodeJwt(response.credential)
      console.log('claims', claims)
      this.$emit('handleCredential', claims.jti)
    }
  }
}
</script> 

<style>
</style>