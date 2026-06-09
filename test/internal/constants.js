'use strict'

const t = require('tap')
const constants = require('../../internal/constants')

t.match(constants, {
  DEFAULT_DISPLAY_PAGE_SIZE: Number,
  MAX_LENGTH: Number,
  MAX_SAFE_COMPONENT_LENGTH: Number,
  MAX_SAFE_INTEGER: Number,
  RELEASE_TYPES: Array,
  SEMVER_SPEC_VERSION: String,
  paginateDisplay: Function,
}, 'got appropriate data types exported')

t.test('paginateDisplay returns a simple page payload', t => {
  t.same(constants.paginateDisplay([
    '1.0.0',
    '2.0.0',
    '3.0.0',
  ], {
    page: 2,
    pageSize: 2,
  }), {
    page: 2,
    pageSize: 2,
    totalItems: 3,
    totalPages: 2,
    hasPreviousPage: true,
    hasNextPage: false,
    lines: ['3.0.0'],
    header: 'Page 2/2 (3-3 of 3)',
    text: 'Page 2/2 (3-3 of 3)\n3.0.0',
  })

  t.end()
})

t.test('paginateDisplay falls back to defaults for invalid options', t => {
  t.match(constants.paginateDisplay([], {
    page: 0,
    pageSize: 0,
  }), {
    page: 1,
    pageSize: constants.DEFAULT_DISPLAY_PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
    lines: [],
    header: 'Page 1/1 (0 items)',
    text: 'Page 1/1 (0 items)',
  })

  t.end()
})
