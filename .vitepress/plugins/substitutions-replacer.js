/**
* Markdown-it plugin for replacing text placeholders
*
* Replaces placeholders such as |version| with the values in the `substitutions`
* option of config.js.
* Supports optional formatting (bold, italic, code, or none).
*/

/**
* Format a value based on the specified format type
* @param {string} value - The value to format
* @param {string} format - Format type: 'bold', 'italic', 'code', or 'none'
* @returns {string} Formatted value
*/
export function formatValue(value, format = 'none') {
  switch (format) {
    case 'bold':
      return `**${value}**`
    case 'italic':
      return `*${value}*`
    case 'code':
      return `\`${value}\``
    default:
      return value
  }
}

/**
* Create a text substitution plugin
* @param {Object} md - markdown-it instance
* @param {Object} options - plugin options
* @param {Object} options.substitutions - Object with placeholder keys and values
* @returns {void}
*/
export function substitutionsReplacer(md, options = {}) {
  const substitutions = options.substitutions || {}

  // Store original render method
  const originalRender = md.render.bind(md)

  md.render = function(src, env = {}) {
    // Process each substitution
    for (const [placeholder, config] of Object.entries(substitutions)) {
      // Support both simple string values and objects with format options
      const value = typeof config === 'string' ? config : config.value
      const format = typeof config === 'object' && config.format ? config.format : 'none'

      // Create regex to match the placeholder (escape special regex characters)
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(escapedPlaceholder, 'g')

      // Replace with formatted value
      src = src.replace(regex, formatValue(value, format))
    }

    return originalRender(src, env)
  }
}

export default substitutionsReplacer
