<script setup>
// Search across every redmine-kit site, with Pagefind. Each site builds its
// own index at <base>pagefind/ (pagefind.yml, `npm run docs:build`); this
// searches the current site's index and merges the other sites' indexes from
// sites.js, so that a result can come from any site. Each result shows the
// name of its site (data-pagefind-meta, written by config.js). One index that
// fails to load makes every search fail, so only the indexes whose entry file
// loads, from the same Pagefind version, are merged; a site that is down or
// not built yet is left out and the others still answer.
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useData, withBase } from 'vitepress'
import { groups } from '../../sites.js'

// The other sites, same origin: the top site at /, the others at /<repo>/.
const bases = ['/', ...groups.flatMap((group) => group.items)
  .filter((item) => item.docs !== false)
  .map((item) => `/${item.repo}/`)]
const otherSites = bases.filter((base) => base !== withBase('/'))

const { lang } = useData()
const label = computed(() => (lang.value?.startsWith('ja') ? '検索' : 'Search'))

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

// Pagefind loads once, as soon as the page has rendered (or earlier, on hover
// or focus of the button), so that the dialog opens at once.
let loading
const load = () => {
  loading ??= (async () => {
    const own = withBase('/pagefind/')
    const [ui, , ownEntry, ...others] = await Promise.allSettled([
      import('@pagefind/component-ui'),
      import('@pagefind/component-ui/css'),
      ...[own, ...otherSites.map((base) => `${base}pagefind/`)].map(entry),
    ])
    if (ui.status !== 'fulfilled') {
      throw ui.reason
    }

    const version = ownEntry.value?.version
    const mergeIndex = otherSites
      .map((base, i) => ({ bundlePath: `${base}pagefind/`, entry: others[i] }))
      .filter(({ entry }) => entry.status === 'fulfilled' && entry.value.version === version)
      .map(({ bundlePath }) => ({ bundlePath, indexWeight: 0.6 }))

    window.PagefindComponents.configureInstance('default', { bundlePath: own, mergeIndex })
    document.querySelectorAll('.rk-search-modal pagefind-results').forEach((results) => {
      results.resultTemplate = resultTemplate
    })
    await customElements.whenDefined('pagefind-modal')
  })()

  return loading
}

const open = async () => {
  await load()
  document.querySelector('.rk-search-modal pagefind-modal')?.open()
}

// The shortcuts of VitePress's search: Cmd/Ctrl+K anywhere, "/" outside fields
const isEditing = (target) => target instanceof HTMLElement
  && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
const onKeydown = (event) => {
  const modShortcut = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)
  if (modShortcut || (event.key === '/' && !isEditing(event.target))) {
    event.preventDefault()
    open()
  }
}

onMounted(() => {
  // The key label: ⌘ on Apple systems, Ctrl elsewhere (VitePress's class)
  if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent)) {
    document.documentElement.classList.add('mac')
  }
  window.addEventListener('keydown', onKeydown)
  load()
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="rk-search">
    <button
      type="button"
      class="VPNavBarSearchButton"
      :aria-label="label"
      @click="open"
      @pointerenter="load"
      @focus="load"
    >
      <span
        class="vpi-search"
        aria-hidden="true"
      />
      <span class="text">{{ label }}</span>
      <span
        class="keys"
        aria-hidden="true"
      >
        <kbd class="key-mod" />
        <kbd class="key-k" />
      </span>
    </button>
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

<style scoped>
/* VitePress's search button (VPNavBarSearchButton.vue), whose styles are
   scoped to it; the colors for the red header are in custom.css. */
.VPNavBarSearchButton {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: var(--vp-nav-height);
  padding: 0.5rem 0.875rem;
  font-size: 1.25rem;
}

.text,
.keys {
  display: none;
}

kbd {
  font-family: inherit;
  font-weight: 500;
}

.key-mod::before {
  content: 'Ctrl';
}

:root.mac .key-mod::before {
  content: '\2318';
}

.key-k::before {
  content: 'K';
}

@media (min-width: 48rem) {
  .VPNavBarSearchButton {
    height: auto;
    padding: 0.5rem 0.75rem;
    background-color: var(--vp-c-bg-alt);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    line-height: 1;
    color: var(--vp-c-text-2);
  }

  .text {
    display: inline;
    font-size: 0.8125rem;
  }

  .keys {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    direction: ltr;
    padding: 0.25rem 0.375rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }
}
</style>
