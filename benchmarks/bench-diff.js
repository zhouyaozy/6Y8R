'use strict'

const Benchmark = require('benchmark')
const diff = require('../functions/diff')
const suite = new Benchmark.Suite()

const cases = [
  ['0.0.1', '0.0.1-pre', 'patch'],
  ['0.0.1', '0.0.1-pre-2', 'patch'],
  ['1.1.0', '1.1.0-pre', 'minor'],
]

for (const [v1, v2, expected] of cases) {
  const result = diff(v1, v2)

  if (result !== expected) {
    throw new Error(`Expected diff(${v1}, ${v2}) to be ${expected}, got ${result}`)
  }

  suite.add(`diff(${v1}, ${v2}) -> ${expected}`, function () {
    diff(v1, v2)
  })
}

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: false })
