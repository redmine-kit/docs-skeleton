import DefaultTheme from 'vitepress/theme-without-fonts'
import PageLoader from "./components/PageLoader.vue";
import MarkdownLinks from "./components/MarkdownLinks.vue";
import MovedAnchor from "./components/MovedAnchor.vue";
import SiteList from "./components/SiteList.vue";
import './custom.css'
import { h } from "vue";

// Other sites on the same origin (https://redmine-kit.github.io/<repo>/)
// are outside this site's base. A link into one of them must be a full page
// load, because the client-side router of this site doesn't know its pages.
const isOtherSite = (pathname, base) => !pathname.startsWith(base)

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => [
        h(PageLoader),
      ],
      // Links to the Markdown of the page (its .md version and its source),
      // on the row of the "Edit this page" link. `doc-after` covers a page
      // without a doc footer.
      'doc-footer-before': () => h(MarkdownLinks),
      'doc-after': () => h(MarkdownLinks, { standalone: true }),
      // Links to a heading that moved to another page of the site
      'layout-bottom': () => h(MovedAnchor),
    })
  },
  enhanceApp({ app, router }) {
    // Cards of the organization's repositories, for the top page
    app.component('SiteList', SiteList)

    if (typeof window === 'undefined') {
      return
    }

    // The client-side router only knows the pages of this site. Hand links into
    // the other sites to the browser as a normal page load.
    const go = router.go.bind(router)
    router.go = async (href, options) => {
      const url = new URL(href, window.location.href)
      if (url.origin === window.location.origin && isOtherSite(url.pathname, import.meta.env.BASE_URL)) {
        window.location.assign(url.href)

        return
      }

      await go(href, options)
    }
  },
}
