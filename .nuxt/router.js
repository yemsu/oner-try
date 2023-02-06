import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0ce0f9dc = () => interopDefault(import('..\\src\\pages\\character\\index.vue' /* webpackChunkName: "pages/character/index" */))
const _b230840a = () => interopDefault(import('..\\src\\pages\\composition\\index.vue' /* webpackChunkName: "pages/composition/index" */))
const _153a6f7d = () => interopDefault(import('..\\src\\pages\\items.vue' /* webpackChunkName: "pages/items" */))
const _cf5f657c = () => interopDefault(import('..\\src\\pages\\items\\colleague.vue' /* webpackChunkName: "pages/items/colleague" */))
const _a70910be = () => interopDefault(import('..\\src\\pages\\items\\equipment.vue' /* webpackChunkName: "pages/items/equipment" */))
const _06161191 = () => interopDefault(import('..\\src\\pages\\items\\sailor.vue' /* webpackChunkName: "pages/items/sailor" */))
const _6f19510e = () => interopDefault(import('..\\src\\pages\\items\\ship.vue' /* webpackChunkName: "pages/items/ship" */))
const _7c6fe16f = () => interopDefault(import('..\\src\\pages\\ranking\\index.vue' /* webpackChunkName: "pages/ranking/index" */))
const _18fdac57 = () => interopDefault(import('..\\src\\pages\\character\\_nickname.vue' /* webpackChunkName: "pages/character/_nickname" */))
const _042176e8 = () => interopDefault(import('..\\src\\pages\\composition\\_type\\_id.vue' /* webpackChunkName: "pages/composition/_type/_id" */))
const _63acd78f = () => interopDefault(import('..\\src\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _0ce0f9dc,
    name: "character"
  }, {
    path: "/composition",
    component: _b230840a,
    name: "composition"
  }, {
    path: "/items",
    component: _153a6f7d,
    name: "items",
    children: [{
      path: "colleague",
      component: _cf5f657c,
      name: "items-colleague"
    }, {
      path: "equipment",
      component: _a70910be,
      name: "items-equipment"
    }, {
      path: "sailor",
      component: _06161191,
      name: "items-sailor"
    }, {
      path: "ship",
      component: _6f19510e,
      name: "items-ship"
    }]
  }, {
    path: "/ranking",
    component: _7c6fe16f,
    name: "ranking"
  }, {
    path: "/character/:nickname",
    component: _18fdac57,
    name: "character-nickname"
  }, {
    path: "/composition/:type/:id?",
    component: _042176e8,
    name: "composition-type-id"
  }, {
    path: "/",
    component: _63acd78f,
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
