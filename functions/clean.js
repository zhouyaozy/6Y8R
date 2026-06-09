'use strict'

const parse = require('./parse')
const clean = (version, options) => {
  if (version == null) {
    return null
  }
  if (typeof version !== 'string') {
    return null
  }
  const trimmed = version.trim().replace(/^[=v]+/, '')
  if (trimmed === '') {
    return null
  }
  const s = parse(trimmed, options)
  return s ? s.version : null
}
module.exports = clean
