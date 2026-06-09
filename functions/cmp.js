'use strict'

const eq = require('./eq')
const neq = require('./neq')
const gt = require('./gt')
const gte = require('./gte')
const lt = require('./lt')
const lte = require('./lte')

const unwrapVersion = (version) =>
  version && typeof version === 'object' ? version.version : version

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      return unwrapVersion(a) === unwrapVersion(b)

    case '!==':
      return unwrapVersion(a) !== unwrapVersion(b)

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp
