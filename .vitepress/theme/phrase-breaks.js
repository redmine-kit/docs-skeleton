// Japanese headings and the hero break between phrases (BudouX), not between
// any two characters: 「Redmine のための / オープンソースのツール」. Body text
// (paragraphs, lists, tables) keeps the browser's line breaking. BudouX marks the
// phrase boundaries with <wbr> (not with zero-width spaces, which would end up
// in copied text) and sets `word-break: keep-all` on the block, so lines break
// only there. It runs in the browser after each page renders, on Japanese
// pages only, and leaves code alone.
import { HTMLProcessingParser, jaModel } from 'budoux'

// The blocks to process; nested matches are covered by their outermost block.
const SELECTOR = [
  '.VPHero .name',
  '.VPHero .text',
  '.VPHero .tagline',
  '.vp-doc h1',
  '.vp-doc h2',
  '.vp-doc h3',
  '.vp-doc h4',
].join(', ')

let parser

export function applyPhraseBreaks() {
  if (typeof document === 'undefined' || !document.documentElement.lang.startsWith('ja')) {
    return
  }

  parser ??= new HTMLProcessingParser(jaModel, { separator: document.createElement('wbr') })

  for (const element of document.querySelectorAll(SELECTOR)) {
    if (element.dataset.phraseBreaks || element.parentElement?.closest(SELECTOR)) {
      continue
    }

    parser.applyToElement(element)
    element.dataset.phraseBreaks = ''
  }
}
