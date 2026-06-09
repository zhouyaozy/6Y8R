'use strict'

const { test } = require('tap')
const clean = require('../../functions/clean')
const SemVer = require('../../classes/semver')

test('clean tests', (t) => {
  [
    ['1.2.3', '1.2.3'],
    [' 1.2.3 ', '1.2.3'],
    [' 1.2.3-4 ', '1.2.3-4'],
    [' 1.2.3-pre ', '1.2.3-pre'],
    ['  =v1.2.3   ', '1.2.3'],
    ['v1.2.3', '1.2.3'],
    [' v1.2.3 ', '1.2.3'],
    ['\t1.2.3', '1.2.3'],
    ['>1.2.3', null],
    ['~1.2.3', null],
    ['<=1.2.3', null],
    ['1.2.x', null],
    ['0.12.0-dev.1150+3c22cecee', '0.12.0-dev.1150'],
  ].forEach(([range, version]) => {
    const msg = `clean(${range}) = ${version}`
    t.equal(clean(range), version, msg)
  })
  t.end()
})

test('clean handles non-string inputs safely', (t) => {
  t.equal(clean(null), null)
  t.equal(clean(undefined), null)
  t.equal(clean(12345), null)
  t.equal(clean(new SemVer('1.2.3')), '1.2.3')
  t.end()
})
