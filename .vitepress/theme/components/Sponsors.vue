<script setup>
// Logos of the organization's sponsors in sites.js, with the logo for the
// light or the dark appearance, under a heading of the page:
//   ## Sponsors
//
//   <Sponsors><a href="https://localstack.cloud">LocalStack</a></Sponsors>
// The link inside is what GitHub shows, since it does not know the component;
// the site shows the logos instead.
import { useData } from 'vitepress'
import { sponsors } from '../../sites.js'
import localstackLogo from '../assets/localstack-logo.svg'
import localstackLogoDark from '../assets/localstack-logo-dark.svg'

const logos = {
  localstack: { light: localstackLogo, dark: localstackLogoDark, width: 120, height: 28 },
}

const { isDark } = useData()
const items = Object.entries(sponsors)
  .filter(([id]) => logos[id])
  .map(([id, sponsor]) => ({ id, ...sponsor, logo: logos[id] }))
</script>

<template>
  <ul class="rk-sponsors">
    <li
      v-for="item in items"
      :key="item.id"
    >
      <a
        :href="item.url"
        target="_blank"
        rel="noopener"
      >
        <img
          :src="isDark ? item.logo.dark : item.logo.light"
          :alt="item.name"
          :width="item.logo.width"
          :height="item.logo.height"
        />
      </a>
    </li>
  </ul>
</template>

<style scoped>
.rk-sponsors {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin: 16px 0;
  padding: 0;
  list-style: none;
}

.rk-sponsors li {
  margin: 0;
}

.rk-sponsors img {
  display: block;
}
</style>
