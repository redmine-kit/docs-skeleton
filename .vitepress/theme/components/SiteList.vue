<script setup>
// Cards of the repositories in sites.js, for the top page:
//   <SiteList group="plugins" lang="en" />
import { docsUrl, githubUrl, groups, llmsUrl, statusLabels } from '../../sites.js'

const props = defineProps({
  group: { type: String, required: true },
  lang: { type: String, default: 'en' },
})

const labels = {
  en: { docs: 'Documentation', markdown: 'Markdown', markdownTitle: 'The documentation as Markdown (llms.txt)', github: 'GitHub' },
  ja: { docs: 'ドキュメント', markdown: 'Markdown', markdownTitle: 'ドキュメントの Markdown(llms.txt)', github: 'GitHub' },
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
            :href="llmsUrl(item, lang)"
            :title="label('markdownTitle')"
            target="_self"
          >{{ label('markdown') }}</a>
          <a :href="githubUrl(item)">{{ label('github') }}</a>
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
</style>
