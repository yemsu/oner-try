import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0080c705 = () => interopDefault(import('..\\src\\pages\\character\\index.vue' /* webpackChunkName: "pages/character/index" */))
const _31c8e4e4 = () => interopDefault(import('..\\src\\pages\\composition\\index.vue' /* webpackChunkName: "pages/composition/index" */))
const _f5517c18 = () => interopDefault(import('..\\src\\pages\\items.vue' /* webpackChunkName: "pages/items" */))
const _e81fcb2a = () => interopDefault(import('..\\src\\pages\\items\\colleague.vue' /* webpackChunkName: "pages/items/colleague" */))
const _bfc9766c = () => interopDefault(import('..\\src\\pages\\items\\equipment.vue' /* webpackChunkName: "pages/items/equipment" */))
const _addf05f0 = () => interopDefault(import('..\\src\\pages\\items\\sailor.vue' /* webpackChunkName: "pages/items/sailor" */))
const _273034b0 = () => interopDefault(import('..\\src\\pages\\items\\ship.vue' /* webpackChunkName: "pages/items/ship" */))
const _1f008e1c = () => interopDefault(import('..\\src\\pages\\join\\index.vue' /* webpackChunkName: "pages/join/index" */))
const _38c2e4d8 = () => interopDefault(import('..\\src\\pages\\ranking\\index.vue' /* webpackChunkName: "pages/ranking/index" */))
const _78cbda0c = () => interopDefault(import('..\\src\\pages\\character\\result.vue' /* webpackChunkName: "pages/character/result" */))
const _f8bd8cc2 = () => interopDefault(import('..\\src\\pages\\composition\\_type\\_id.vue' /* webpackChunkName: "pages/composition/_type/_id" */))
const _586cabf4 = () => interopDefault(import('..\\src\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/character",
    component: _0080c705,
    name: "character"
  }, {
    path: "/composition",
    component: _31c8e4e4,
    name: "composition"
  }, {
    path: "/items",
    component: _f5517c18,
    name: "items",
    children: [{
      path: "colleague",
      component: _e81fcb2a,
      name: "items-colleague"
    }, {
      path: "equipment",
      component: _bfc9766c,
      name: "items-equipment"
    }, {
      path: "sailor",
      component: _addf05f0,
      name: "items-sailor"
    }, {
      path: "ship",
      component: _273034b0,
      name: "items-ship"
    }]
  }, {
    path: "/join",
    component: _1f008e1c,
    name: "join"
  }, {
    path: "/ranking",
    component: _38c2e4d8,
    name: "ranking"
  }, {
    path: "/character/result",
    component: _78cbda0c,
    name: "character-result"
  }, {
    path: "/composition/:type/:id?",
    component: _f8bd8cc2,
    name: "composition-type-id"
  }, {
    path: "/",
    component: _586cabf4,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
