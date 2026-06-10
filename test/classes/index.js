'use strict'

const t = require('tap')
const Comparator = require('../../classes/comparator')

t.same(require('../../classes'), {
  SemVer: require('../../classes/semver'),
  Range: require('../../classes/range'),
  Comparator,
  formatDate: Comparator.formatDate,
}, 'export all classes at semver/classes')
