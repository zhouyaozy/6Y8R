'use strict'

const { paginate, PAGE_DEFAULT_SIZE } = require('./constants')

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

/**
 * Emit debug logs that describe a pagination request and its resulting slice.
 * Only emits output when NODE_DEBUG=semver is set, matching the existing
 * debug guard. Returns the paginated result so callers can log-and-use in one
 * expression.
 *
 * @param {string} label Label describing the source list (e.g. 'RELEASE_TYPES').
 * @param {Array} items The list being paginated.
 * @param {number} [page=1] 1-based page number.
 * @param {number} [size=PAGE_DEFAULT_SIZE] Items per page.
 * @returns {{ items: Array, page: number, size: number, total: number, totalPages: number }}
 */
debug.paginate = (label, items, page = 1, size = PAGE_DEFAULT_SIZE) => {
  const result = paginate(items, page, size)
  debug(
    label,
    'page=' + result.page,
    'size=' + result.size,
    'total=' + result.total,
    'totalPages=' + result.totalPages,
    'slice=[' + result.items.join(', ') + ']',
  )
  return result
}

module.exports = debug
