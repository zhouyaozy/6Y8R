'use strict'

const { test } = require('tap')
const constants = require('../../internal/constants')

test('exports correct data types', (t) => {
  t.match(constants, {
    MAX_LENGTH: Number,
    MAX_SAFE_COMPONENT_LENGTH: Number,
    MAX_SAFE_BUILD_LENGTH: Number,
    MAX_SAFE_INTEGER: Number,
    RELEASE_TYPES: Array,
    SEMVER_SPEC_VERSION: String,
    FLAG_INCLUDE_PRERELEASE: Number,
    FLAG_LOOSE: Number,
  }, 'all expected keys with correct types')
  t.end()
})

test('MAX_LENGTH', (t) => {
  t.equal(constants.MAX_LENGTH, 256)
  t.end()
})

test('MAX_SAFE_COMPONENT_LENGTH', (t) => {
  t.equal(constants.MAX_SAFE_COMPONENT_LENGTH, 16)
  t.end()
})

test('MAX_SAFE_BUILD_LENGTH', (t) => {
  t.equal(constants.MAX_SAFE_BUILD_LENGTH, constants.MAX_LENGTH - 6)
  t.end()
})

test('MAX_SAFE_INTEGER', (t) => {
  t.equal(constants.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
  t.end()
})

test('SEMVER_SPEC_VERSION', (t) => {
  t.equal(constants.SEMVER_SPEC_VERSION, '2.0.0')
  t.end()
})

test('RELEASE_TYPES', (t) => {
  t.same(constants.RELEASE_TYPES, [
    'major',
    'premajor',
    'minor',
    'preminor',
    'patch',
    'prepatch',
    'prerelease',
  ])
  t.end()
})

test('FLAG_INCLUDE_PRERELEASE', (t) => {
  t.equal(constants.FLAG_INCLUDE_PRERELEASE, 0b001)
  t.end()
})

test('FLAG_LOOSE', (t) => {
  t.equal(constants.FLAG_LOOSE, 0b010)
  t.end()
})
