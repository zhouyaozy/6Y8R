'use strict'

const Benchmark = require('benchmark')
const SemVer = require('../classes/semver')
const suite = new Benchmark.Suite()

const comparisons = require('../test/fixtures/comparisons')

for (const [v0, v1] of comparisons) {
  if (typeof v0 !== 'string' || typeof v1 !== 'string') {
    continue
  }
  suite.add(`compare ${v0} to ${v1}`, function () {
    const semver = new SemVer(v0)
    semver.compare(v1)
  })
}

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('error', function (event) {
    console.error(String(event.target.error))
  })
  .run({ async: false })
