'use strict'

const t = require('tap')
const constants = require('../../internal/constants')

t.match(constants, {
  MAX_LENGTH: Number,
  MAX_SAFE_COMPONENT_LENGTH: Number,
  MAX_SAFE_INTEGER: Number,
  RELEASE_TYPES: Array,
  SEMVER_SPEC_VERSION: String,
  paginateConstants: Function,
  PAGINATION: Object,
}, 'got appropriate data types exported')

t.test('paginateConstants', t => {
  const result = constants.paginateConstants(1, 2)
  t.equal(result.page, 1, 'page is correct')
  t.equal(result.limit, 2, 'limit is correct')
  t.ok(result.total > 0, 'total is correct')
  t.equal(Object.keys(result.data).length, 2, 'data size matches limit')

  const resultDefault = constants.paginateConstants()
  t.equal(resultDefault.page, constants.PAGINATION.DEFAULT_PAGE, 'default page is correct')
  t.equal(resultDefault.limit, constants.PAGINATION.DEFAULT_LIMIT, 'default limit is correct')
  t.end()
})
