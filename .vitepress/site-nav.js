/**
 * Header menu shared by every site of the organization (the top page and the
 * documentation site of each repository), built from sites.js.
 */
import { githubUrl, groups, siteUrl } from './sites.js'

const labels = {
  root: { home: 'Home' },
  ja: { home: 'ホーム' },
}

/**
 * A page of another site under https://redmine-kit.github.io/: it opens in
 * the same tab without the external link icon, like a page of the same site.
 */
const sameOrigin = (link) => ({ link, target: '_self', noIcon: true })

/**
 * @param {object} [options]
 * @param {string} [options.locale] 'root' for English or 'ja'.
 * @param {string} [options.current] The repository of the site the menu is
 *   shown on ('home' for the top page). Its entry links within the site and is
 *   highlighted.
 */
export function siteNav({ locale = 'root', current = undefined } = {}) {
  const lang = locale === 'root' ? 'en' : locale
  const prefix = locale === 'root' ? '' : `${locale}/`
  const label = labels[locale] || labels.root

  const entry = (item) => {
    if (item.repo === current) {
      return { text: item.name, link: `/${prefix}`, activeMatch: '^/' }
    }
    return { text: item.name, ...sameOrigin(`${siteUrl}${item.repo}/${prefix}`) }
  }

  const home = current === 'home' ? { link: `/${prefix}`, activeMatch: `^/${prefix}$` } : sameOrigin(`${siteUrl}${prefix}`)
  const menus = groups.map((group) => {
    // A repository without a documentation site links to GitHub.
    const items = group.items.map((item) => (item.docs === false ? { text: item.name, link: githubUrl(item) } : entry(item)))
    const here = items.some((item) => item.activeMatch)
    return { text: group[lang] ?? group.en, ...(here ? { activeMatch: '^/' } : {}), items }
  }).filter((menu) => menu.items.length > 0)

  return [{ text: label.home, ...home }, ...menus]
}
