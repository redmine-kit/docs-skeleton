<script>
// Shared by every diagram of the page.
let queue = Promise.resolve()
</script>

<script setup>
// A Mermaid diagram from a ```mermaid fence (plugins/mermaid.js). Mermaid is
// loaded only in the browser, and the diagram follows the light and dark
// appearance with Mermaid's own themes. Without JavaScript, the code is shown.
import { computed, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({ code: { type: String, required: true } })
const { isDark } = useData()
const source = computed(() => decodeURIComponent(props.code))
const svg = ref('')
const failed = ref(false)
let counter = 0

async function render() {
  try {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: isDark.value ? 'dark' : 'default' })
    const id = `mermaid-${Math.random().toString(36).slice(2)}-${counter++}`
    svg.value = (await mermaid.render(id, source.value)).svg
    failed.value = false
  } catch {
    // A diagram Mermaid cannot read stays as code.
    failed.value = true
  }
}

// Mermaid does not finish when several diagrams render at the same time, so
// the diagrams of a page render one after another.
function draw() {
  queue = queue.then(render)
}

onMounted(draw)
watch(isDark, draw)
</script>

<template>
  <!-- The SVG comes from Mermaid with securityLevel 'strict', which removes scripts and event handlers. -->
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="svg && !failed"
    class="mermaid-diagram"
    v-html="svg"
  />
  <!-- eslint-enable vue/no-v-html -->
  <pre
    v-else
    class="mermaid-source"
  ><code>{{ source }}</code></pre>
</template>

<style scoped>
.mermaid-diagram {
  margin: 16px 0;
  overflow-x: auto;
}

.mermaid-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>
