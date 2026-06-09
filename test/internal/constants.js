'use strict'

const t = require('tap')
const constants = require('../../internal/constants')

t.match(constants, {
  MAX_LENGTH: Number,
  MAX_SAFE_COMPONENT_LENGTH: Number,
  MAX_SAFE_INTEGER: Number,
  RELEASE_TYPES: Array,
  SEMVER_SPEC_VERSION: String,
  PAGE_DEFAULT_SIZE: Number,
  PAGE_MIN_SIZE: Number,
  PAGE_MAX_SIZE: Number,
  paginate: Function,
}, 'got appropriate data types exported')

t.test('paginate default behaviour', t => {
  const r = constants.paginate(constants.RELEASE_TYPES)
  t.equal(r.page, 1, 'defaults to page 1')
  t.equal(r.size, constants.PAGE_DEFAULT_SIZE, 'defaults size to PAGE_DEFAULT_SIZE')
  t.equal(r.total, constants.RELEASE_TYPES.length, 'total matches input length')
  t.equal(r.items.length, constants.PAGE_DEFAULT_SIZE, 'returns default-sized page')
  t.equal(r.totalPages, Math.ceil(constants.RELEASE_TYPES.length / constants.PAGE_DEFAULT_SIZE), 'totalPages rounded up')
  t.end()
})

t.test('paginate respects page and size arguments', t => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
  const page1 = constants.paginate(items, 1, 3)
  const page2 = constants.paginate(items, 2, 3)
  const page3 = constants.paginate(items, 3, 3)

  t.same(page1.items, ['a', 'b', 'c'], 'page 1 items')
  t.same(page2.items, ['d', 'e', 'f'], 'page 2 items')
  t.same(page3.items, ['g'], 'last page items')
  t.equal(page1.totalPages, 3, 'expected totalPages')
  t.equal(page1.total, items.length, 'expected total')
  t.end()
})

t.test('paginate clamps size within [PAGE_MIN_SIZE, PAGE_MAX_SIZE]', t => {
  const items = Array.from({ length: 100 }, (_, i) => i)
  const invalidNegative = constants.paginate(items, 1, -5)
  const invalidZero = constants.paginate(items, 1, 0)
  const tooLarge = constants.paginate(items, 1, 10000)
  const justRight = constants.paginate(items, 1, 7)
  t.equal(invalidNegative.size, constants.PAGE_DEFAULT_SIZE, 'negative size falls back to PAGE_DEFAULT_SIZE')
  t.equal(invalidZero.size, constants.PAGE_DEFAULT_SIZE, 'zero size falls back to PAGE_DEFAULT_SIZE')
  t.equal(tooLarge.size, constants.PAGE_MAX_SIZE, 'oversized size clamped to PAGE_MAX_SIZE')
  t.equal(justRight.size, 7, 'valid size preserved')
  t.end()
})

t.test('paginate handles empty list and out-of-range pages safely', t => {
  const empty = constants.paginate([], 1, 5)
  t.same(empty.items, [], 'empty list yields empty slice')
  t.equal(empty.totalPages, 0, 'empty list yields zero totalPages')
  const beyond = constants.paginate(['x'], 99, 5)
  t.same(beyond.items, [], 'page beyond last yields empty slice')
  t.equal(beyond.page, 99, 'page value preserved')
  t.end()
})

t.test('paginate rejects non-array input gracefully', t => {
  const bogus = constants.paginate('not-an-array', 1, 5)
  t.same(bogus.items, [], 'non-array yields empty slice')
  t.equal(bogus.total, 0, 'non-array total is 0')
  t.end()
})
