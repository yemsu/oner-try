const axios = require('axios')

export default {
  env: {
    APP_TITLE: 'ONER TRY',
    BASE_URL: 'https://onertry.fun',
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
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'google-site-verification', content: 'SeJH5Wk_WEoAYGUbt0DnIDmuRo-YLJaB2wxOMDqef3o' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2284%22>💀</text></svg>' }
    ],
    __dangerouslyDisableSanitizers: ['noscript', 'script'],
    script: [
      { type: 'text/javascript', src: '//wcs.naver.net/wcslog.js' },
      {
        type: 'text/javascript',
        innerHTML: `if(!wcs_add) var wcs_add = {}; wcs_add['wa'] = '1501b3ca5e1f000'; if(window.wcs) { wcs_do(); }`
      },
      { type: 'text/javascript', src: 'https://www.googletagmanager.com/gtag/js?id=G-8GJK6WJPDB', async: true },
      {
        type: 'text/javascript',
        innerHTML: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-8GJK6WJPDB');`
      },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/style/common.scss'],  
  styleResources: {
    scss: ['./assets/style/resources.scss']
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuexPersist', srr: false }
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
    routes: async () => {
      const { data: items } = await axios.get('https://onerapi.xyz/api/items')
      const { data: users } = await axios.get('https://onerapi.xyz/api/gameUsers')
      const itemRoutes = items.filter((item) => item.ingredients)
        .map((item) => {
          return {
            route: `/composition/${item.type}/${item.id}`,
            payload: item
          }
        })
      const characterRoutes = users
        .map((user) => {
          return {
            route: `/character/${user.nickName}`,
            payload: user
          }
        })
      return characterRoutes.concat(itemRoutes) 
    }
 },
}
