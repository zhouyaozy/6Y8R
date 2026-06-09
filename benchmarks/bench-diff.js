'use strict'

const Benchmark = require('benchmark')
const diff = require('../functions/diff')
const suite = new Benchmark.Suite()

const cases = [
  ['0.0.1', '0.0.1-pre', 'patch'],
  ['0.0.1', '0.0.1-pre-2', 'patch'],
  ['1.1.0', '1.1.0-pre', 'minor'],
  ['0.0.1-pre', '0.0.1', 'patch'],
  ['1.1.0-pre', '1.1.0', 'minor'],
  ['1.2.3', '0.2.3', 'major'],
  ['0.2.3', '1.2.3', 'major'],
  ['1.2.3', '1.3.3', 'minor'],
  ['1.2.3', '1.2.4', 'patch'],
  ['1.2.3', '2.0.0-pre', 'premajor'],
  ['1.0.1', '1.1.0-pre', 'preminor'],
  ['1.2.3', '1.2.4-pre', 'prepatch'],
  ['1.1.0-pre-1', '1.1.0-pre-2', 'prerelease'],
  ['1.0.0', '1.0.0', null],
]

for (const [v1, v2] of cases) {
  suite.add(`diff(${v1}, ${v2})`, function () {
    diff(v1, v2)
  })
}

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: false })
