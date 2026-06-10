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
  paginate: Function,
}, 'got appropriate data types exported')

t.test('paginate', t => {
  const { paginate, DEFAULT_PAGE_SIZE } = constants
  const versions = Array.from({ length: 50 }, (_, i) => `${i + 1}.0.0`)

  t.test('default page size', t => {
    const result = paginate(versions)
    t.equal(result.page, 1)
    t.equal(result.pageSize, DEFAULT_PAGE_SIZE)
    t.equal(result.total, 50)
    t.equal(result.totalPages, 3)
    t.equal(result.items.length, DEFAULT_PAGE_SIZE)
    t.equal(result.items[0], '1.0.0')
    t.equal(result.items[19], '20.0.0')
    t.end()
  })

  t.test('specific page', t => {
    const result = paginate(versions, 2)
    t.equal(result.page, 2)
    t.equal(result.items.length, DEFAULT_PAGE_SIZE)
    t.equal(result.items[0], '21.0.0')
    t.end()
  })

  t.test('last partial page', t => {
    const result = paginate(versions, 3)
    t.equal(result.page, 3)
    t.equal(result.items.length, 10)
    t.equal(result.items[0], '41.0.0')
    t.equal(result.items[9], '50.0.0')
    t.end()
  })

  t.test('custom page size', t => {
    const result = paginate(versions, 1, 5)
    t.equal(result.pageSize, 5)
    t.equal(result.items.length, 5)
    t.equal(result.totalPages, 10)
    t.end()
  })

  t.test('empty array', t => {
    const result = paginate([])
    t.equal(result.total, 0)
    t.equal(result.totalPages, 1)
    t.equal(result.items.length, 0)
    t.end()
  })

  t.test('page out of range clamps to last page', t => {
    const result = paginate(versions, 999)
    t.equal(result.page, 3)
    t.equal(result.items.length, 10)
    t.end()
  })

  t.test('page zero clamps to first page', t => {
    const result = paginate(versions, 0)
    t.equal(result.page, 1)
    t.end()
  })

  t.test('negative page clamps to first page', t => {
    const result = paginate(versions, -5)
    t.equal(result.page, 1)
    t.end()
  })

  t.end()
})
