'use strict'

const comparator = require('./comparator.js')

module.exports = {
  SemVer: require('./semver.js'),
  Range: require('./range.js'),
  Comparator: comparator.Comparator,
  formatDate: comparator.formatDate,
}
