import { defineConfig } from 'vitepress'
import { substitutionsReplacer } from './plugins/substitutions-replacer.js'
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
  // repository point to GitHub (see plugins/source-links.js).
  ignoreDeadLinks: false,
  substitutions: {},
  themeConfig: {
    outline: {
      level: [2, 3],
    },
    search: {
      provider: 'local',
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
  overrideMarkdownConfig?.(md)
}

// The part of Google Tag Manager that goes right after <body>, which the
// head option cannot place.
const overrideTransformHtml = mergedConfig.transformHtml
mergedConfig.transformHtml = async (code, id, context) => {
  const html = (await overrideTransformHtml?.(code, id, context)) ?? code
  const noscript = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`

  return html.replace(/<body([^>]*)>/, (body) => `${body}${noscript}`)
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
