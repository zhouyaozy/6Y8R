'use strict'

const t = require('tap')
const constants = require('../../internal/constants')

t.match(constants, {
  MAX_LENGTH: Number,
  MAX_SAFE_COMPONENT_LENGTH: Number,
  MAX_SAFE_BUILD_LENGTH: Number,
  MAX_SAFE_INTEGER: Number,
  RELEASE_TYPES: Array,
  SEMVER_SPEC_VERSION: String,
  FLAG_INCLUDE_PRERELEASE: Number,
  FLAG_LOOSE: Number,
}, 'got appropriate data types exported')
