<script setup>
// Search across every redmine-kit site, with Pagefind. Each site builds its
// own index at <base>pagefind/ (pagefind.yml, `npm run docs:build`); this
// searches the current site's index and merges the other sites' indexes from
// sites.js, so that a result can come from any site. Each result shows the
// name of its site (data-pagefind-meta, written by config.js). One index that
// fails to load makes every search fail, so only the indexes whose entry file
// loads, from the same Pagefind version, are merged; a site that is down or
// not built yet is left out and the others still answer.
import { onMounted } from 'vue'
import { withBase } from 'vitepress'
import { groups } from '../../sites.js'

// The other sites, same origin: the top site at /, the others at /<repo>/.
const bases = ['/', ...groups.flatMap((group) => group.items)
  .filter((item) => item.docs !== false)
  .map((item) => `/${item.repo}/`)]
const otherSites = bases.filter((base) => base !== withBase('/'))

const escape = (text) => String(text ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

// The built-in result, with the site's name above the page title
const resultTemplate = (result) => {
  const url = escape(result.meta?.url || result.url)
  const subResults = (result.sub_results || []).filter((sub) => sub.url !== result.url).slice(0, 3)

  return `<li class="pf-result">
  <div class="pf-result-card"><div class="pf-result-content">
    ${result.meta?.site ? `<p class="rk-result-site">${escape(result.meta.site)}</p>` : ''}
    <p class="pf-result-title"><a class="pf-result-link" href="${url}">${escape(result.meta?.title || 'Untitled')}</a></p>
    ${result.excerpt ? `<p class="pf-result-excerpt">${result.excerpt}</p>` : ''}
  </div></div>
  ${subResults.length ? `<ul class="pf-heading-chips">${subResults.map((sub) => `<li class="pf-heading-chip">
    <a class="pf-heading-link" href="${escape(sub.url)}">${escape(sub.title)}</a>
    <p class="pf-heading-excerpt">${sub.excerpt || ''}</p></li>`).join('')}</ul>` : ''}
</li>`
}

const entry = async (bundlePath) => {
  const response = await fetch(`${bundlePath}pagefind-entry.json`)
  if (!response.ok) {
    throw new Error(`${response.status} ${bundlePath}`)
  }

  return response.json()
}

onMounted(async () => {
  const own = withBase('/pagefind/')
  const [ownEntry, ...others] = await Promise.allSettled([own, ...otherSites.map((base) => `${base}pagefind/`)].map(entry))
  const version = ownEntry.value?.version
  const mergeIndex = otherSites
    .map((base, i) => ({ bundlePath: `${base}pagefind/`, entry: others[i] }))
    .filter(({ entry }) => entry.status === 'fulfilled' && entry.value.version === version)
    .map(({ bundlePath }) => ({ bundlePath, indexWeight: 0.6 }))

  await import('@pagefind/component-ui')
  await import('@pagefind/component-ui/css')
  window.PagefindComponents.configureInstance('default', { bundlePath: own, mergeIndex })
  document.querySelectorAll('.rk-search-modal pagefind-results').forEach((results) => {
    results.resultTemplate = resultTemplate
  })
})
</script>

<template>
  <div class="rk-search">
    <pagefind-modal-trigger class="rk-search-wide" />
    <pagefind-modal-trigger
      class="rk-search-compact"
      compact
    />
  </div>
  <ClientOnly>
    <Teleport to="body">
      <div class="rk-search-modal">
        <pagefind-modal reset-on-close>
          <pagefind-modal-header>
            <pagefind-input />
          </pagefind-modal-header>
          <pagefind-modal-body>
            <pagefind-summary />
            <pagefind-results />
          </pagefind-modal-body>
          <pagefind-modal-footer>
            <pagefind-keyboard-hints />
          </pagefind-modal-footer>
        </pagefind-modal>
      </div>
    </Teleport>
  </ClientOnly>
</template>
