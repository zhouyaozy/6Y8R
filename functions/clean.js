'use strict'

const parse = require('./parse')
const clean = (version, options) => {
  const s = parse(typeof version === 'string'
    ? version.trim().replace(/^[=v]+/, '')
    : version, options)
  return s ? s.version : null
}
module.exports = clean
