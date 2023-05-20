const axios = require('axios')
const isDevMode = process.env.NODE_ENV === 'development'

export default {
  env: {
    APP_TITLE: 'ONER TRY',
    LOCAL_PORT: process.env.LOCAL_PORT,
    BASE_URL: isDevMode ? `http://localhost:${process.env.LOCAL_PORT}` : process.env.BASE_URL,
    API_PATH: process.env.CONT_PATH,
    AuthClientId: process.env.OAUTH_CLIENT_ID
  },
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  srcDir: 'src',

  server: {
    port: isDevMode ? process.env.LOCAL_PORT : 80
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
      { name: 'naver-site-verification', content: 'e6b1b8d06d65ff0afc03dda3fde036c9bc0d22f6' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2284%22>💀</text></svg>' }
    ],
    __dangerouslyDisableSanitizers: ['noscript', 'script'],
    script: [
      { type: 'text/javascript', src: '//wcs.naver.net/wcslog.js', async: true },
      {
        type: 'text/javascript',
        innerHTML: `if(!wcs_add) var wcs_add = {}; wcs_add['wa'] = '1501b3ca5e1f000'; if(window.wcs) { wcs_do(); }`
      },
      { type: 'text/javascript', src: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js', async: true },
      { type: 'text/javascript', src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4052679554213032', async: true, crossorigin: 'anonymous' },
      { type: 'text/javascript', src: 'https://accounts.google.com/gsi/client' },
      { type: 'text/javascript', src: 'https://fundingchoicesmessages.google.com/i/pub-4052679554213032?ers=1', async: true },
      {
        type: 'text/javascript',
        nonce: 'ye3J2pAzfL2mh7kryNp8Kw',
        innerHTML: `(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();`
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
    { src: '~/plugins/vuexPersist', mode: 'client' },
    { src: '~/constants/ALERTS', mode: 'client' },
    { src: '~/plugins/peer', mode: 'client' },
    { src: '~/plugins/fontAwesomeIcon', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/style-resources'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/gtm',
  ],
  
  gtm: {
    id: 'GTM-WBKNNNM'
  },
  
  sitemap: {
    hostname: 'https://onertry.fun',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      scss: { sourceMap: false }
    },
    terser: {
      // https://github.com/terser/terser#compress-options
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  },

  generate: {
    routes: async () => {
      const { data: { result: items } } = await axios.get('https://onerapi.xyz/api/items')
      const itemRoutes = items.filter((item) => item.ingredients)
        .map((item) => {
          return {
            route: `/composition/${item.type}/${item.id}`,
            payload: item
          }
        })
      return itemRoutes
    }
 },
 
 static: {
   prefix: false
 },
}
