'use strict'

const t = require('tap')
const constants = require('../../internal/constants')

t.match(constants, {
  MAX_LENGTH: Number,
  MAX_SAFE_COMPONENT_LENGTH: Number,
  MAX_SAFE_INTEGER: Number,
  RELEASE_TYPES: Array,
  SEMVER_SPEC_VERSION: String,
  DEFAULT_PAGE_SIZE: Number,
  MAX_PAGE_SIZE: Number,
  MIN_PAGE_SIZE: Number,
}, 'got appropriate data types exported')

t.test('pagination constants have valid values', t => {
  t.ok(constants.MIN_PAGE_SIZE >= 1, 'MIN_PAGE_SIZE should be at least 1')
  t.ok(constants.DEFAULT_PAGE_SIZE >= constants.MIN_PAGE_SIZE, 'DEFAULT_PAGE_SIZE should be at least MIN_PAGE_SIZE')
  t.ok(constants.MAX_PAGE_SIZE >= constants.DEFAULT_PAGE_SIZE, 'MAX_PAGE_SIZE should be at least DEFAULT_PAGE_SIZE')
  t.end()
})
