const axios = require('axios')

export default {
  env: {
    APP_TITLE: 'ONER TRY',
    CONT_PATH: 'https://onerapi.xyz',
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  srcDir: 'src',

  server: {
    port: process.env.NODE_ENV === 'development' ? 8082 : 80
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ONER TRY',
    htmlAttrs: {
      lang: 'ko'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/style/common.scss'],  
  styleResources: {
    scss: ['./assets/style/resources.scss']
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/style-resources'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  generate: {
    routes: function () {
      return axios.get(process.env.CONT_PATH + '/api/items')
      .then((res) => {
        return res.data.filter((item) => item.ingredients)
          .map((item) => {
            return {
              route: `/composition/${item.type}/${item.id}`,
              payload: item
            }
          })
      })
    }
 },
}
