<script setup>
// Logos of the organization's sponsors in sites.js, with the logo for the
// light or the dark appearance, under a heading of the page:
//   ## Sponsors
//
//   <Sponsors><a href="https://www.keyselect.co.jp/">KEY SELECT</a></Sponsors>
// `ids` limits the list (e.g. ids="keyselect"); without it, every sponsor.
// The links inside are what GitHub shows, since it does not know the
// component; the site shows the logos instead.
import { useData } from 'vitepress'
import { sponsorIds, sponsors } from '../../sites.js'
import keyselectLogo from '../assets/keyselect-logo.svg'
import keyselectLogoDark from '../assets/keyselect-logo-dark.svg'
import localstackLogo from '../assets/localstack-logo.svg'
import localstackLogoDark from '../assets/localstack-logo-dark.svg'

const logos = {
  // Sized so that the letters of the two logos are about the same height
  keyselect: { light: keyselectLogo, dark: keyselectLogoDark, width: 136, height: 29 },
  localstack: { light: localstackLogo, dark: localstackLogoDark, width: 98, height: 23 },
}

const props = defineProps({
  ids: { type: String, default: '' },
})

const { isDark } = useData()
const items = sponsorIds(props.ids)
  .filter((id) => logos[id])
  .map((id) => ({ id, ...sponsors[id], logo: logos[id] }))
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
  /* Bottom-aligned, the letters of both logos line up */
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 32px;
  margin: 16px 0;
  padding: 0;
  list-style: none;
}

.rk-sponsors li {
  margin: 0;
}

/* Blocks without the margins of images in the text, so that the list is as
   tall as the logos */
.rk-sponsors a,
.rk-sponsors img {
  display: block;
  margin: 0;
}
</style>
