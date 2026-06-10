'use strict'

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

/* istanbul ignore next */
const debugPaginated = (data, page = 1, limit = 10) => {
  if (
    typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)
  ) {
    const items = Array.isArray(data) ? data : Object.entries(data)
    const total = items.length
    const totalPages = Math.ceil(total / limit)
    const current = Math.min(Math.max(1, page), totalPages || 1)
    const start = (current - 1) * limit

    const pageData = items.slice(start, start + limit)

    debug(
      `[Page ${current}/${totalPages}] (Total: ${total})`,
      Array.isArray(data) ? pageData : Object.fromEntries(pageData)
    )
  }
}

module.exports = Object.assign(debug, {
  debugPaginated,
})
