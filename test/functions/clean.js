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

test('clean with loose option', (t) => {
  t.equal(clean('  =v1.2.3   ', { loose: true }), '1.2.3',
    'loose mode should work like strict')
  t.equal(clean('1.2.3-rc.1+build.123', { loose: true }), '1.2.3-rc.1',
    'loose mode strips build metadata')
  t.end()
})

test('clean includes build metadata when includePrerelease option is set', (t) => {
  t.equal(clean('1.2.3+build.123', { includePrerelease: true }), '1.2.3',
    'includePrerelease does not affect version output')
  t.end()
})

test('clean edge cases', (t) => {
  t.equal(clean(''), null, 'empty string returns null')
  t.equal(clean('   '), null, 'whitespace only returns null')
  t.equal(clean('=v'), null, 'prefix-only string returns null')
  t.equal(clean('^1.2.3'), null, 'caret range returns null')
  t.equal(clean('invalid'), null, 'garbage string returns null')
  t.end()
})

test('clean with SemVer object', (t) => {
  const sv = new SemVer('1.2.3')
  t.equal(clean(sv), '1.2.3', 'SemVer object returns its version')

  const svPre = new SemVer('2.0.0-rc.1')
  t.equal(clean(svPre), '2.0.0-rc.1', 'SemVer object with prerelease returns its version')
  t.end()
})