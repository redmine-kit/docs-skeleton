import { defineConfig } from 'vitepress'
import { substitutionsReplacer } from './plugins/substitutions-replacer.js'
import { mermaid } from './plugins/mermaid.js'
import { deepMerge, loadConfigOverrides } from './utils.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { isExcluded, markdownPath, writeMarkdownOutput } from './markdown-output.js'

// Google Tag Manager for every site built from this skeleton.
const gtmId = 'GTM-KG4K9SHS'

const defaultConfig = {
  srcDir: 'docs',
  head: [
    ['script', {}, `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`],
  ],
  title: 'Redmine Theme',
  description: 'Documentation of a redmine-kit repository',
  // Links between pages are checked at build time; links to files of the
  // repository point to GitHub (see plugins/source-links.js). Links to
  // localhost (the address of a local Redmine in examples) are not checked.
  ignoreDeadLinks: 'localhostLinks',
  // The search's web components (theme/components/SiteSearch.vue)
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('pagefind-'),
      },
    },
  },
  substitutions: {},
  themeConfig: {
    outline: {
      level: [2, 3],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framework': ['vue']
        }
      }
    }
  },
  markdown: {
    lineNumbers: true,
  },
  locales: {}
}

const overrides = await loadConfigOverrides(import.meta.url)
const mergedConfig = deepMerge(defaultConfig, overrides)

// Configure markdown plugins after mergedConfig is available
const overrideMarkdownConfig = mergedConfig.markdown.config
mergedConfig.markdown.config = (md) => {
  md.use(substitutionsReplacer, { substitutions: mergedConfig.substitutions || {} })
  md.use(mermaid)
  overrideMarkdownConfig?.(md)
}

// The part of Google Tag Manager that goes right after <body>, which the
// head option cannot place.
const overrideTransformHtml = mergedConfig.transformHtml
mergedConfig.transformHtml = async (code, id, context) => {
  const html = (await overrideTransformHtml?.(code, id, context)) ?? code
  const noscript = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`

  return withSearchIndex(html.replace(/<body([^>]*)>/, (body) => `${body}${noscript}`), context)
}

// The search index (Pagefind, pagefind.yml) takes each page's content, not
// the header, sidebar and footer, with the name of its site, which the search
// across the sites shows with each result. The 404 page has no content to
// index. On a home layout page the index takes the whole page with its hero.
function withSearchIndex(html, { pageData, siteData }) {
  if (pageData.isNotFound) {
    return html
  }

  const locale = pageData.relativePath.startsWith('ja/') ? 'ja' : 'root'
  const value = (text) => text.replace(/,/g, ' ').replace(/[&"<>]/g, (c) => `&#${c.charCodeAt(0)};`)
  const site = value(siteData.locales?.[locale]?.title || siteData.title)
  const home = pageData.frontmatter?.layout === 'home'
  const attributes = `data-pagefind-body data-pagefind-meta="site:${site}"`
  const target = home ? /<div class="VPHome"/ : /<div ([^>]*?)class="vp-doc /
  const indexed = html.replace(target, (tag) => tag.replace('<div ', `<div ${attributes} `))

  // The hero's heading runs its lines together, so a home page gets its title
  // on the heading (one meta per attribute)
  return home
    ? indexed.replace(/<h1 class="heading"/, `<h1 data-pagefind-meta="title:${value(pageData.frontmatter.title || site)}" class="heading"`)
    : indexed
}

// The favicon and the image of link previews are in docs/public/, from the
// Redmine Kit logo (redmine-kit/brand).
const base = mergedConfig.base || '/'
mergedConfig.head = [
  ...(mergedConfig.head || []),
  ['link', { rel: 'icon', href: `${base}favicon.ico`, sizes: '48x48' }],
  ['link', { rel: 'icon', href: `${base}favicon.svg`, type: 'image/svg+xml' }],
  ['link', { rel: 'apple-touch-icon', href: `${base}apple-touch-icon.png` }],
]

// Open Graph and Twitter card tags of every page, for link previews. The URL
// of the page and of the image need the site's address (sitemap.hostname).
const siteUrl = mergedConfig.sitemap?.hostname
const ogTransformHead = mergedConfig.transformHead
mergedConfig.transformHead = async (context) => {
  const head = (await ogTransformHead?.(context)) || []
  const { pageData, siteData, title, description } = context

  if (pageData.isNotFound) {
    return head
  }

  const ja = pageData.relativePath.startsWith('ja/')
  const tags = [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: (ja && siteData.locales.ja?.title) || siteData.title }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:locale', content: ja ? 'ja_JP' : 'en_US' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ]

  if (siteUrl) {
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
    tags.push(
      ['meta', { property: 'og:url', content: new URL(path, siteUrl).href }],
      ['meta', { property: 'og:image', content: new URL('og-image.png', siteUrl).href }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { property: 'og:image:alt', content: 'Redmine Kit' }],
    )
  }

  return [...head, ...tags]
}

// Markdown version of every page, llms.txt and llms-full.txt for AI tools
// (see markdown-output.js). `markdownOutput: false` turns it off; an object
// passes options (`transform`, `llmsTxt`).
const markdownOutput = mergedConfig.markdownOutput
delete mergedConfig.markdownOutput

if (markdownOutput !== false) {
  const overrideTransformHead = mergedConfig.transformHead
  mergedConfig.transformHead = async (context) => {
    const head = (await overrideTransformHead?.(context)) || []
    const { pageData, siteConfig } = context
    const source = join(siteConfig.srcDir, pageData.filePath)

    if (pageData.isNotFound || pageData.relativePath === '404.md' || !pageData.filePath || isExcluded(readFileSync(source, 'utf-8'))) {
      return head
    }

    return [
      ...head,
      ['link', { rel: 'alternate', type: 'text/markdown', href: `${siteConfig.site.base}${markdownPath(pageData.relativePath)}` }],
    ]
  }

  const overrideBuildEnd = mergedConfig.buildEnd
  mergedConfig.buildEnd = async (siteConfig) => {
    const { pages, files } = writeMarkdownOutput(siteConfig, {
      substitutions: mergedConfig.substitutions,
      ...(typeof markdownOutput === 'object' ? markdownOutput : {}),
    })
    siteConfig.logger.info(`Markdown output: ${pages} pages, ${files.join(', ')}`)
    await overrideBuildEnd?.(siteConfig)
  }
}


export default defineConfig(mergedConfig)
