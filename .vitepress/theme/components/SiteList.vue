<script setup>
// Cards of the repositories in sites.js, for the top page:
//   <SiteList group="plugins" lang="en" />
import { docsUrl, githubUrl, groups, llmsUrl, statusLabels } from '../../sites.js'

const props = defineProps({
  group: { type: String, required: true },
  lang: { type: String, default: 'en' },
})

const labels = {
  en: { docs: 'Documentation', markdownTitle: 'The documentation as Markdown (llms.txt)', github: 'GitHub repository' },
  ja: { docs: 'ドキュメント', markdownTitle: 'ドキュメントの Markdown(llms.txt)', github: 'GitHub のリポジトリ' },
}
const label = (key) => (labels[props.lang] ?? labels.en)[key]
const t = (entry) => entry[props.lang] ?? entry.en
const items = (groups.find((g) => g.id === props.group) ?? { items: [] }).items
const home = (item) => docsUrl(item, props.lang) ?? githubUrl(item)
</script>

<template>
  <ul class="rk-grid">
    <li
      v-for="item in items"
      :key="item.repo"
      class="rk-card"
    >
      <a
        class="rk-name"
        :href="home(item)"
        target="_self"
      >{{ item.name }}</a>
      <span
        v-if="item.name !== `redmine-kit/${item.repo}`"
        class="rk-repo"
      >redmine-kit/{{ item.repo }}</span>
      <p class="rk-desc">
        {{ t(item) }}
      </p>
      <div class="rk-meta">
        <span
          v-if="item.status"
          class="rk-status"
        >{{ t(statusLabels[item.status]) }}</span>
        <span class="rk-links">
          <a
            v-if="docsUrl(item, lang)"
            :href="docsUrl(item, lang)"
            target="_self"
          >{{ label('docs') }}</a>
          <a
            v-if="llmsUrl(item, lang)"
            class="rk-icon-link"
            :href="llmsUrl(item, lang)"
            :title="label('markdownTitle')"
            :aria-label="label('markdownTitle')"
            target="_self"
          >
            <!-- Markdown mark, in the style of the Lucide icons of VitePress -->
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <rect
                  x="2"
                  y="5"
                  width="20"
                  height="14"
                  rx="2"
                />
                <path d="M6 15V9l3 3l3-3v6m5-6v6m-2.5-2.5L17 15l2.5-2.5" />
              </g>
            </svg>
          </a>
          <a
            class="rk-icon-link"
            :href="githubUrl(item)"
            :title="label('github')"
            :aria-label="label('github')"
          >
            <!-- "github" icon of Lucide (ISC) -->
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </g>
            </svg>
          </a>
        </span>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.vp-doc ul.rk-grid,
ul.rk-grid {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 12px;
}

.vp-doc li.rk-card,
li.rk-card {
  margin: 0;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background-color: color-mix(in srgb, var(--vp-c-bg-soft) 50%, var(--vp-c-bg));
  transition: border-color 0.25s;
}

li.rk-card:hover {
  border-color: var(--vp-c-brand-1);
}

.vp-doc a.rk-name,
a.rk-name {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

a.rk-name:hover {
  color: var(--vp-c-brand-1);
}

.rk-repo {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
  overflow-wrap: anywhere;
}

.vp-doc p.rk-desc,
p.rk-desc {
  margin: 0;
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.rk-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 12px;
  margin-top: 4px;
}

.rk-status {
  padding: 0 8px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 20px;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-default-soft);
}

.rk-links {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  font-size: 13px;
}

.vp-doc .rk-links a,
.rk-links a {
  font-weight: 500;
  text-decoration: none;
}

.rk-links a:hover {
  text-decoration: underline;
}

.vp-doc .rk-links a.rk-icon-link,
.rk-links a.rk-icon-link {
  display: inline-flex;
  color: var(--vp-c-text-2);
}

.vp-doc .rk-links a.rk-icon-link:hover,
.rk-links a.rk-icon-link:hover {
  color: var(--vp-c-brand-1);
}

.rk-icon-link svg {
  width: 18px;
  height: 18px;
}
</style>
