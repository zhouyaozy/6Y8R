'use strict'

const { test } = require('tap')
const clean = require('../../functions/clean')

test('clean tests', (t) => {
  // [range, version]
  // Version should be detectable despite extra characters
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

test('clean strips leading = and v prefixes', (t) => {
  t.equal(clean('=1.2.3'), '1.2.3', 'strips single =')
  t.equal(clean('==1.2.3'), '1.2.3', 'strips multiple =')
  t.equal(clean('v1.2.3'), '1.2.3', 'strips single v')
  t.equal(clean('vv1.2.3'), '1.2.3', 'strips multiple v')
  t.equal(clean('=v1.2.3'), '1.2.3', 'strips =v combination')
  t.equal(clean('v=1.2.3'), '1.2.3', 'strips v= combination')
  t.end()
})

test('clean returns null for invalid versions', (t) => {
  t.equal(clean('not a version'), null, 'non-version string')
  t.equal(clean(''), null, 'empty string')
  t.equal(clean('   '), null, 'whitespace only')
  t.equal(clean('1.2'), null, 'incomplete version')
  t.equal(clean('1'), null, 'single number')
  t.end()
})

test('clean preserves prerelease and build metadata', (t) => {
  t.equal(clean('1.0.0-alpha.1'), '1.0.0-alpha.1', 'prerelease with dot')
  t.equal(clean('1.0.0-beta+build.123'), '1.0.0-beta', 'prerelease with build metadata stripped by parse')
  t.equal(clean('v2.0.0-rc.1'), '2.0.0-rc.1', 'v prefix with prerelease')
  t.end()
})
