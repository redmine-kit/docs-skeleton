/**
 * Configuration overrides for the documentation site of a repository in the
 * redmine-kit organization, built from the `docs/` folder of the repository
 * and published at https://redmine-kit.github.io/<repo>/.
 *
 * Used by .github/workflows/repo-docs.yml, which copies this file to
 * `config.js`. Everything is derived from the repository, so repositories
 * need no configuration of their own:
 *
 * - DOCS_REPOSITORY (required): owner/repo, e.g. redmine-kit/redmine_lookbook
 * - DOCS_BRANCH: branch the docs are built from (default: main)
 * - DOCS_SOURCE: path of the repository's checkout; its LICENSE file is
 *   linked from the footer
 * - DOCS_TITLE: site title (default: the `#` heading of `docs/README.md`)
 * - DOCS_DESCRIPTION: site description (default: the repository description)
 *
 * `docs/README.md` is the home page and other Markdown files in `docs/` are
 * further pages. The sidebar lists the pages and their `##` headings: the home
 * page first, then the pages in the order `docs/README.md` links them, then
 * the pages it doesn't link, by path.
 *
 * A Japanese translation goes in `docs/ja/`, with the same file names
 * (`docs/ja/README.md`, `docs/ja/setup.md`, ...). When `docs/ja/README.md`
 * exists, the site gets a Japanese locale at `/<repo>/ja/` with its own
 * sidebar and labels, and a language switcher. Pages that are not translated
 * yet are simply missing from the Japanese sidebar.
 */
import { existsSync, readdirSync, readFileSync } from 'fs'
import { dirname, join, posix, relative } from 'path'
import { fileURLToPath } from 'url'
import { createMarkdownRenderer, disposeMdItInstance } from 'vitepress'
import { sourceLinks } from './.vitepress/plugins/source-links.js'
import { siteNav } from './.vitepress/site-nav.js'
import { sitesMarkdown, sponsorsMarkdown } from './.vitepress/sites.js'

const root = dirname(fileURLToPath(import.meta.url))
const srcDir = join(root, 'docs')

/**
 * Heading anchors as GitHub creates them, so links such as
 * `[Writing previews](#writing-previews)` work both on GitHub and on the site.
 */
const githubSlugify = (text) => text
  .trim()
  .toLowerCase()
  .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '')
  .replace(/ /g, '-')

/**
 * The pages are GitHub Markdown, not Vue templates: keep `{{ ... }}` (e.g. in
 * GitHub Actions expressions) as text instead of evaluating it. Fenced code
 * blocks already have v-pre.
 */
function noInterpolation(md) {
  const { code_inline: codeInline, text } = md.renderer.rules

  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    tokens[idx].attrSet('v-pre', '')

    return codeInline(tokens, idx, options, env, self)
  }

  md.renderer.rules.text = (tokens, idx, options, env, self) => {
    const html = text ? text(tokens, idx, options, env, self) : md.utils.escapeHtml(tokens[idx].content)

    return html.includes('{{') ? `<span v-pre>${html}</span>` : html
  }
}

const toRoute = (page) => page.replace(/(^|\/)README\.md$/, '$1index.md')

function findPages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      return entry.name === 'public' || entry.name === 'node_modules' ? [] : findPages(path)
    }

    return entry.name.endsWith('.md') ? [posix.normalize(relative(srcDir, path))] : []
  })
}

function pageLink(route) {
  const link = `/${route.replace(/\.md$/, '')}`

  return link.endsWith('/index') ? link.slice(0, -'index'.length) : link
}

/**
 * Pages that a page links, in the order of the links, e.g. `['setup.md',
 * 'usage.md']` for `[Setup](setup.md) ... [Usage](usage.md#options)`.
 */
function linkedPages(tokens, page, pages) {
  const linked = []

  for (const token of tokens) {
    for (const child of token.children || []) {
      const href = child.type === 'link_open' ? child.attrGet('href') : null
      if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(href)) {
        continue
      }

      let path
      try {
        path = decodeURI(href.replace(/[?#].*$/, ''))
      } catch {
        continue
      }

      const target = posix.normalize(posix.join(posix.dirname(page), path))
      const dir = target === '.' ? '' : `${target.replace(/\/$/, '')}/`
      const found = [target, `${dir}README.md`, `${dir}index.md`].find((candidate) => pages.includes(candidate))
      if (found && !linked.includes(found)) {
        linked.push(found)
      }
    }
  }

  return linked
}

/**
 * The sidebar and the heading anchors of every page.
 *
 * One sidebar group per page, listing its `##` headings: the home page first,
 * then the pages in the order the home page links them, then the other pages
 * by path. With several pages, the groups are collapsible and only the group
 * of the current page is expanded.
 *
 * `anchors` maps every heading anchor to the first page (in the order of the
 * sidebar) that has it, so that the theme can forward links to a section that
 * moved to another page, e.g. `/#configuration` to `/configuration.html#configuration`
 * (see MovedAnchor.vue). Anchors of `<a id="..."></a>` tags count too, so
 * that the English anchors of translated headings are forwarded.
 */
async function buildSidebar(pages, prefix = '') {
  const md = await createMarkdownRenderer(srcDir, {
    anchor: { slugify: githubSlugify },
    headers: { level: [2] },
  })

  try {
    const parsed = new Map()

    for (const page of pages) {
      const source = readFileSync(join(srcDir, page), 'utf-8')
      const env = { path: join(srcDir, page), relativePath: page, cleanUrls: false }
      const tokens = md.parse(source, { ...env })
      await md.renderAsync(source, env)

      parsed.set(page, { env, tokens })
    }

    const home = pages.find((page) => toRoute(page) === `${prefix}index.md`)
    const linked = home ? linkedPages(parsed.get(home).tokens, home, pages) : []
    const rank = (page) => {
      if (page === home) {
        return -1
      }

      const index = linked.indexOf(page)

      return index === -1 ? linked.length : index
    }
    const sorted = [...pages].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))

    const groups = []
    const anchors = {}

    for (const page of sorted) {
      const { env, tokens } = parsed.get(page)
      const link = pageLink(toRoute(page))
      const title = env.frontmatter?.title || env.title || page

      groups.push({
        text: md.utils.escapeHtml(title),
        link,
        ...(pages.length > 1 ? { collapsed: true } : {}),
        items: (env.headers || []).map((header) => ({
          text: header.title,
          link: `${link}#${header.slug}`,
        })),
      })

      for (const token of tokens) {
        const ids = token.type === 'heading_open'
          ? [token.attrGet('id')]
          : [...anchorTags(token)]
        for (const id of ids) {
          if (id && !(id in anchors)) {
            anchors[id] = link
          }
        }
      }
    }

    return { sidebar: groups, anchors: pages.length > 1 ? anchors : {} }
  } finally {
    // createMarkdownRenderer() caches its instance; drop it so that VitePress
    // creates its own with the full markdown configuration.
    disposeMdItInstance()
  }
}

/**
 * The `id` of `<a id="..."></a>` tags in an HTML token (a block or inline
 * HTML token, or the inline children of a paragraph).
 */
function* anchorTags(token) {
  const html = token.type === 'html_block' || token.type === 'html_inline' ? token.content : ''
  for (const match of html.matchAll(/<a\s+id="([^"]+)"/g)) {
    yield match[1]
  }
  for (const child of token.children || []) {
    yield* anchorTags(child)
  }
}

/**
 * The title of a home page: `title` in its front matter, or its first `#`
 * heading outside code blocks.
 */
function readTitle(file) {
  const path = join(srcDir, file)
  if (!existsSync(path)) {
    return undefined
  }

  const source = readFileSync(path, 'utf-8')
  const frontMatter = source.match(/^---\n([\s\S]*?)\n---\n/)
  const title = frontMatter && frontMatter[1].match(/^title:\s*["']?(.+?)["']?\s*$/m)
  if (title) {
    return title[1]
  }

  const heading = source
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/^(```|~~~)[\s\S]*?^\1/gm, '')
    .match(/^# (.+)$/m)

  return heading ? heading[1].trim() : undefined
}

function findLicense(source) {
  if (!source || !existsSync(source)) {
    return undefined
  }

  return readdirSync(source).find((name) => /^(LICENSE|LICENCE|COPYING)(\.[a-z]+)?$/i.test(name))
}

export default async () => {
  const repository = process.env.DOCS_REPOSITORY
  if (!repository || !repository.includes('/')) {
    throw new Error('Set DOCS_REPOSITORY to the repository (owner/repo).')
  }

  const [owner, repo] = repository.split('/')
  const branch = process.env.DOCS_BRANCH || 'main'
  const source = process.env.DOCS_SOURCE
  const license = findLicense(source)
  const pages = findPages(srcDir)
  const jaPages = pages.filter((page) => page.startsWith('ja/'))
  const enPages = pages.filter((page) => !page.startsWith('ja/'))
  const { sidebar, anchors } = await buildSidebar(enPages)
  const ja = jaPages.some((page) => toRoute(page) === 'ja/index.md') ? await buildSidebar(jaPages, 'ja/') : null

  const title = process.env.DOCS_TITLE || readTitle('README.md') || repo
  const description = process.env.DOCS_DESCRIPTION || `Documentation of ${repository}`
  const repoUrl = `https://github.com/${repository}`
  // The repository <owner>.github.io is the organization's top site, at /.
  const topSite = repo.toLowerCase() === `${owner.toLowerCase()}.github.io`
  const base = topSite ? '/' : `/${repo}/`
  const siteUrl = `https://${owner.toLowerCase()}.github.io${base}`
  const licenseLink = license && `<a href="${repoUrl}/blob/${branch}/${license}">${license}</a>`

  // The header menu of every site; its entry for this site is highlighted.
  const current = topSite ? 'home' : repo
  // In the Markdown version of the pages, <Sponsors> (any site's top page) and,
  // on the organization's top page, <SiteList group="..." /> become Markdown
  // lists; llms.txt of the top site lists every site.
  const sponsorsTag = /<Sponsors\b[^>]*>[\s\S]*?<\/Sponsors>|<Sponsors\s*\/>/g
  const markdownOutput = {
    transform: (content, { locale }) => {
      const replaced = content.replace(sponsorsTag, () => sponsorsMarkdown())

      return topSite
        ? replaced.replace(/<SiteList\s+group="([^"]+)"[^>]*\/>/g, (_, group) => sitesMarkdown(locale === 'ja' ? 'ja' : 'en', group))
        : replaced
    },
    ...(topSite ? {
      llmsTxt: (locale) => `## ${locale === 'ja' ? 'サイト' : 'Sites'}\n\n` + sitesMarkdown(locale === 'ja' ? 'ja' : 'en'),
    } : {}),
  }

  return {
    base,
    markdownOutput,
    title,
    description,
    rewrites: toRoute,
    sitemap: {
      hostname: siteUrl,
    },
    markdown: {
      anchor: {
        slugify: githubSlugify,
      },
      config: (md) => {
        md.use(sourceLinks, { repository, branch, pages })
        md.use(noInterpolation)
      },
    },
    themeConfig: {
      // Every site's header shows Redmine Kit with its icon (docs/public, from
      // redmine-kit/brand) and links to the organization's top site.
      logo: '/favicon.svg',
      siteTitle: 'Redmine Kit',
      ...(topSite ? {} : { logoLink: { link: `https://${owner.toLowerCase()}.github.io/`, target: '_self' } }),
      nav: siteNav({ current }),
      ...(ja ? {
        search: {
          provider: 'local',
          options: {
            locales: {
              ja: {
                translations: {
                  button: { buttonText: '検索', buttonAriaLabel: '検索' },
                  modal: {
                    noResultsText: '見つかりませんでした',
                    resetButtonTitle: 'クリア',
                    footer: { selectText: '選択', navigateText: '移動', closeText: '閉じる' },
                  },
                },
              },
            },
          },
        },
      } : {}),
      sidebar,
      // Heading anchor => page, for links to a section on another page
      headingAnchors: anchors,
      socialLinks: [
        { icon: 'github', link: repoUrl },
      ],
      editLink: {
        pattern: `${repoUrl}/edit/${branch}/docs/:path`,
        text: 'Edit this page on GitHub',
      },
      footer: {
        message: [
          licenseLink ? `See ${licenseLink} for copyright and license information.` : '',
          'An unofficial project for Redmine.',
        ].filter(Boolean).join(' '),
        copyright: '',
      },
    },
    ...(ja ? {
      locales: {
        root: { label: 'English', lang: 'en' },
        ja: {
          label: '日本語',
          lang: 'ja',
          title: readTitle('ja/README.md') || title,
          themeConfig: {
            ...(topSite ? {} : { logoLink: { link: `https://${owner.toLowerCase()}.github.io/ja/`, target: '_self' } }),
            nav: siteNav({ locale: 'ja', current }),
            sidebar: ja.sidebar,
            headingAnchors: ja.anchors,
            editLink: {
              pattern: `${repoUrl}/edit/${branch}/docs/:path`,
              text: 'GitHub でこのページを編集',
            },
            docFooter: { prev: '前のページ', next: '次のページ' },
            outline: { label: 'このページの内容' },
            returnToTopLabel: 'ページの先頭へ',
            sidebarMenuLabel: 'メニュー',
            darkModeSwitchLabel: 'ダークモード',
            footer: {
              message: [
                licenseLink ? `著作権とライセンスについては、${licenseLink} を参照してください。` : '',
                'Redmine の非公式のプロジェクトです。',
              ].filter(Boolean).join(''),
              copyright: '',
            },
          },
        },
      },
    } : {}),
  }
}
