'use strict'

const t = require('tap')
const constants = require('../../internal/constants')

t.test('exports expected constants and values', t => {
  t.strictSame(constants, {
    MAX_LENGTH: 256,
    MAX_SAFE_COMPONENT_LENGTH: 16,
    MAX_SAFE_BUILD_LENGTH: 250,
    MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 9007199254740991,
    RELEASE_TYPES: [
      'major',
      'premajor',
      'minor',
      'preminor',
      'patch',
      'prepatch',
      'prerelease',
    ],
    SEMVER_SPEC_VERSION: '2.0.0',
    FLAG_INCLUDE_PRERELEASE: 0b001,
    FLAG_LOOSE: 0b010,
  })
  t.end()
})
