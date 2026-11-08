import { defineConfig } from 'vitepress'
import { substitutionsReplacer } from './plugins/substitutions-replacer.js'
import { deepMerge, loadConfigOverrides, applyBaseToHeadTags } from './utils.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { isExcluded, markdownPath, writeMarkdownOutput } from './markdown-output.js'

const defaultConfig = {
  srcDir: 'docs',
  title: 'Redmine Theme',
  description: 'Documentation of a redmine-theme repository',
  ignoreDeadLinks: true,
  substitutions: {},
  themeConfig: {
    outline: {
      level: [2, 3],
    },
    search: {
      provider: 'local',
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    versionBanner: false
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

// Apply base path to head tags if base is specified
if (overrides.base) {
  applyBaseToHeadTags(mergedConfig, overrides.base)
}

export default defineConfig(mergedConfig)
