'use strict'

const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

const MAX_SAFE_COMPONENT_LENGTH = 16

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

const DEFAULT_DISPLAY_PAGE_SIZE = 5

const normalizePositiveInteger = (value, fallback) => {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : fallback
}

const formatDisplayItem = (value) => {
  if (typeof value === 'string') {
    return value
  }

  if (value === null) {
    return 'null'
  }

  if (typeof value === 'undefined') {
    return 'undefined'
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value)
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const paginateDisplay = (items, options = {}) => {
  const list = Array.isArray(items) ? items : [items]
  const pageSize = normalizePositiveInteger(options.pageSize, DEFAULT_DISPLAY_PAGE_SIZE)
  const totalItems = list.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const page = Math.min(normalizePositiveInteger(options.page, 1), totalPages)
  const startIndex = totalItems === 0 ? 0 : (page - 1) * pageSize
  const endIndex = totalItems === 0 ? 0 : Math.min(startIndex + pageSize, totalItems)
  const lines = list.slice(startIndex, endIndex).map(formatDisplayItem)
  const header = totalItems === 0
    ? 'Page 1/1 (0 items)'
    : `Page ${page}/${totalPages} (${startIndex + 1}-${endIndex} of ${totalItems})`

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
    lines,
    header,
    text: [header, ...lines].join('\n'),
  }
}

module.exports = {
  DEFAULT_DISPLAY_PAGE_SIZE,
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  paginateDisplay,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
}
