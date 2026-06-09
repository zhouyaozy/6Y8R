'use strict'

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6

const RELEASE_TYPES = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
]

// Pagination configuration for listing/display utilities.
const PAGE_DEFAULT_SIZE = 5
const PAGE_MIN_SIZE = 1
const PAGE_MAX_SIZE = 50

/**
 * Return a paginated slice of the given items list along with metadata such
 * as total pages and current page info. Used to support simple pagination in
 * consumers that need to display a subset of a larger collection (e.g. the
 * RELEASE_TYPES list).
 *
 * @param {Array} items The full list of items to paginate.
 * @param {number} [page=1] The 1-based page number.
 * @param {number} [size=PAGE_DEFAULT_SIZE] Items per page.
 * @returns {{ items: Array, page: number, size: number, total: number, totalPages: number }}
 */
const paginate = (items, page = 1, size = PAGE_DEFAULT_SIZE) => {
  const list = Array.isArray(items) ? items : []
  const total = list.length

  const parsedSize = Number.isFinite(size) ? Math.floor(size) : Number.NaN
  const rawSize = Number.isFinite(parsedSize) && parsedSize > 0 ? parsedSize : PAGE_DEFAULT_SIZE
  const safeSize = Math.min(Math.max(rawSize, PAGE_MIN_SIZE), PAGE_MAX_SIZE)
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const totalPages = total === 0 ? 0 : Math.ceil(total / safeSize)

  const start = (safePage - 1) * safeSize
  const end = start + safeSize

  return {
    items: list.slice(start, end),
    page: safePage,
    size: safeSize,
    total,
    totalPages,
  }
}

module.exports = {
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
  PAGE_DEFAULT_SIZE,
  PAGE_MAX_SIZE,
  PAGE_MIN_SIZE,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  paginate,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
}
