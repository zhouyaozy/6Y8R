'use strict'

const Comparator = require('./comparator.js')

module.exports = {
  SemVer: require('./semver.js'),
  Range: require('./range.js'),
  Comparator,
  formatDate: (date, pattern) => Comparator.formatDate(date, pattern),
}
