import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Deep merge function to handle nested objects
export function deepMerge(target, source) {
  if (!isObject(target) || !isObject(source)) {
    return source
  }

  const output = { ...target }

  Object.keys(source).forEach(key => {
    if (isObject(source[key]) && isObject(target[key])) {
      output[key] = deepMerge(target[key], source[key])
      return
    }

    output[key] = source[key]
  })

  return output
}

export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Load configuration overrides from config.js if it exists
 *
 * config.js exports either an object or a function. A function receives the
 * helpers passed here and returns the object (or a promise of it).
 *
 * @param {string} importMetaUrl - import.meta.url from the calling module
 * @param {object} helpers - Helpers passed to a config function
 * @returns {Promise<object>} The configuration overrides or an empty object
 */
export async function loadConfigOverrides(importMetaUrl, helpers = {}) {
  const __dirname = dirname(fileURLToPath(importMetaUrl))
  const configPath = join(__dirname, '../config.js')

  if (!existsSync(configPath)) {
    return {}
  }

  const overrides = (await import(configPath)).default

  return typeof overrides === 'function' ? await overrides(helpers) : overrides
}
