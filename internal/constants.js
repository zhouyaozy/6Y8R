'use strict'

const { debugPaginated } = require('./debug')

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

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 5,
}

/* istanbul ignore next */
const paginateConstants = (page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => {
  const exportsObj = module.exports
  const keys = Object.keys(exportsObj).filter(k => k !== 'paginateConstants' && k !== 'PAGINATION')

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const result = {
    page,
    limit,
    total: keys.length,
    totalPages: Math.ceil(keys.length / limit),
    data: {},
  }

  keys.slice(startIndex, endIndex).forEach(k => {
    result.data[k] = exportsObj[k]
  })

  // 使用 debug.js 中的分页显示方法输出当前页数据
  debugPaginated(result.data, page, limit)

  return result
}

module.exports = {
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
  PAGINATION,
  paginateConstants,
}
