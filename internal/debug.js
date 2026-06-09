'use strict'

const { paginateDisplay } = require('./constants')

const enabled = !!(
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
)

const emitDebugLines = (text) => {
  for (const line of text.split('\n')) {
    console.error('SEMVER', line)
  }
}

const formatPaginatedDebug = (items, options = {}) => {
  const { title } = options
  const page = paginateDisplay(items, options)
  const lines = title ? [`${title} ${page.header}`, ...page.lines] : [page.header, ...page.lines]

  return {
    ...page,
    text: lines.join('\n'),
  }
}

const debug = enabled
  ? (...args) => console.error('SEMVER', ...args)
  : () => {}

debug.enabled = enabled
debug.paginate = (items, options) => {
  const display = formatPaginatedDebug(items, options)

  if (enabled) {
    emitDebugLines(display.text)
  }

  return display
}

module.exports = debug
