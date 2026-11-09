/**
 * Turns ```mermaid fences into the <Mermaid> component, which draws the
 * diagram in the browser (theme/components/Mermaid.vue). GitHub draws the same
 * fences itself, so the Markdown stays as it is.
 */
export function mermaid(md) {
  const fence = md.renderer.rules.fence

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    if (token.info.trim() !== 'mermaid') {
      return fence(tokens, idx, options, env, self)
    }

    return `<Mermaid code="${encodeURIComponent(token.content)}" />`
  }
}
