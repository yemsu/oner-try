export const CommonBaseButton = () => import('../..\\src\\components\\common\\BaseButton.vue' /* webpackChunkName: "components/common-base-button" */).then(c => wrapFunctional(c.default || c))
export const CommonBaseInput = () => import('../..\\src\\components\\common\\BaseInput.vue' /* webpackChunkName: "components/common-base-input" */).then(c => wrapFunctional(c.default || c))
export const CommonBaseSkeleton = () => import('../..\\src\\components\\common\\BaseSkeleton.vue' /* webpackChunkName: "components/common-base-skeleton" */).then(c => wrapFunctional(c.default || c))
export const CommonBookmarkButton = () => import('../..\\src\\components\\common\\BookmarkButton.vue' /* webpackChunkName: "components/common-bookmark-button" */).then(c => wrapFunctional(c.default || c))
export const CommonMainLogo = () => import('../..\\src\\components\\common\\MainLogo.vue' /* webpackChunkName: "components/common-main-logo" */).then(c => wrapFunctional(c.default || c))
export const CommonTitleContent = () => import('../..\\src\\components\\common\\TitleContent.vue' /* webpackChunkName: "components/common-title-content" */).then(c => wrapFunctional(c.default || c))
export const CommonTopMenuBar = () => import('../..\\src\\components\\common\\TopMenuBar.vue' /* webpackChunkName: "components/common-top-menu-bar" */).then(c => wrapFunctional(c.default || c))
export const CommonVTab = () => import('../..\\src\\components\\common\\VTab.vue' /* webpackChunkName: "components/common-v-tab" */).then(c => wrapFunctional(c.default || c))
export const ItemBadges = () => import('../..\\src\\components\\item\\itemBadges.vue' /* webpackChunkName: "components/item-badges" */).then(c => wrapFunctional(c.default || c))
export const ItemBookmarks = () => import('../..\\src\\components\\item\\ItemBookmarks.vue' /* webpackChunkName: "components/item-bookmarks" */).then(c => wrapFunctional(c.default || c))
export const ItemBox = () => import('../..\\src\\components\\item\\ItemBox.vue' /* webpackChunkName: "components/item-box" */).then(c => wrapFunctional(c.default || c))
export const ItemCheckerBoard = () => import('../..\\src\\components\\item\\ItemCheckerBoard.vue' /* webpackChunkName: "components/item-checker-board" */).then(c => wrapFunctional(c.default || c))
export const ItemDetailInfo = () => import('../..\\src\\components\\item\\ItemDetailInfo.vue' /* webpackChunkName: "components/item-detail-info" */).then(c => wrapFunctional(c.default || c))
export const ItemImage = () => import('../..\\src\\components\\item\\ItemImage.vue' /* webpackChunkName: "components/item-image" */).then(c => wrapFunctional(c.default || c))
export const ItemLink = () => import('../..\\src\\components\\item\\ItemLink.vue' /* webpackChunkName: "components/item-link" */).then(c => wrapFunctional(c.default || c))
export const ItemList = () => import('../..\\src\\components\\item\\ItemList.vue' /* webpackChunkName: "components/item-list" */).then(c => wrapFunctional(c.default || c))
export const ItemTable = () => import('../..\\src\\components\\item\\ItemTable.vue' /* webpackChunkName: "components/item-table" */).then(c => wrapFunctional(c.default || c))
export const ItemTree = () => import('../..\\src\\components\\item\\ItemTree.vue' /* webpackChunkName: "components/item-tree" */).then(c => wrapFunctional(c.default || c))
export const ItemTreeDepth = () => import('../..\\src\\components\\item\\ItemTreeDepth.vue' /* webpackChunkName: "components/item-tree-depth" */).then(c => wrapFunctional(c.default || c))
export const ItemSynergyDesc = () => import('../..\\src\\components\\item\\SynergyDesc.vue' /* webpackChunkName: "components/item-synergy-desc" */).then(c => wrapFunctional(c.default || c))
export const LayoutFloatingMenu = () => import('../..\\src\\components\\layout\\FloatingMenu.vue' /* webpackChunkName: "components/layout-floating-menu" */).then(c => wrapFunctional(c.default || c))
export const LayoutFooter = () => import('../..\\src\\components\\layout\\Footer.vue' /* webpackChunkName: "components/layout-footer" */).then(c => wrapFunctional(c.default || c))
export const LayoutGoogleLoginButton = () => import('../..\\src\\components\\layout\\GoogleLoginButton.vue' /* webpackChunkName: "components/layout-google-login-button" */).then(c => wrapFunctional(c.default || c))
export const LayoutHeader = () => import('../..\\src\\components\\layout\\Header.vue' /* webpackChunkName: "components/layout-header" */).then(c => wrapFunctional(c.default || c))
export const SearchBox = () => import('../..\\src\\components\\search\\SearchBox.vue' /* webpackChunkName: "components/search-box" */).then(c => wrapFunctional(c.default || c))
export const SearchBoxSkeleton = () => import('../..\\src\\components\\search\\SearchBoxSkeleton.vue' /* webpackChunkName: "components/search-box-skeleton" */).then(c => wrapFunctional(c.default || c))
export const SearchContainer = () => import('../..\\src\\components\\search\\SearchContainer.vue' /* webpackChunkName: "components/search-container" */).then(c => wrapFunctional(c.default || c))
export const PagesCompositionSearchBox = () => import('../..\\src\\components\\pages\\composition\\SearchBox.vue' /* webpackChunkName: "components/pages-composition-search-box" */).then(c => wrapFunctional(c.default || c))
export const PagesCharacterSearchBox = () => import('../..\\src\\components\\pages\\character\\SearchBox.vue' /* webpackChunkName: "components/pages-character-search-box" */).then(c => wrapFunctional(c.default || c))
export const PagesRankingTable = () => import('../..\\src\\components\\pages\\ranking\\Table.vue' /* webpackChunkName: "components/pages-ranking-table" */).then(c => wrapFunctional(c.default || c))

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
