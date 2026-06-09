'use strict'

const parse = require('./parse')
const clean = (version, options) => {
  const v = typeof version === 'string'
    ? version.trim().replace(/^[=v]+/, '')
    : version
  const s = parse(v, options)
  return s ? s.version : null
}
module.exports = clean
