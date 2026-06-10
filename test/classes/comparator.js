'use strict'

const { test } = require('tap')
const Comparator = require('../../classes/comparator')
const comparatorIntersection = require('../fixtures/comparator-intersection.js')

test('comparator testing', t => {
  const c = new Comparator('>=1.2.3')
  t.ok(c.test('1.2.4'))
  const c2 = new Comparator(c)
  t.ok(c2.test('1.2.4'))
  const c3 = new Comparator(c, true)
  t.ok(c3.test('1.2.4'))
  // test an invalid version, should not throw
  const c4 = new Comparator(c)
  t.notOk(c4.test('not a version string'))
  t.end()
})

test('tostrings', (t) => {
  t.equal(new Comparator('>= v1.2.3').toString(), '>=1.2.3')
  t.end()
})

test('formatDate', t => {
  t.equal(Comparator.formatDate('2026-06-10T15:30:00-05:00'), '2026-06-10')
  t.equal(Comparator.formatDate(new Date(Date.UTC(2026, 5, 10, 23, 59, 59))), '2026-06-10')
  t.throws(() => Comparator.formatDate('not-a-date'), new TypeError('Invalid date: not-a-date'))
  t.end()
})

test('intersect comparators', (t) => {
  t.plan(comparatorIntersection.length)
  comparatorIntersection.forEach(([c0, c1, expect, includePrerelease]) =>
    t.test(`${c0} ${c1} ${expect}`, t => {
      const comp0 = new Comparator(c0)
      const comp1 = new Comparator(c1)

      t.equal(comp0.intersects(comp1, { includePrerelease }), expect,
        `${c0} intersects ${c1}`)

      t.equal(comp1.intersects(comp0, { includePrerelease }), expect,
        `${c1} intersects ${c0}`)
      t.end()
    }))
})

test('intersect demands another comparator', t => {
  const c = new Comparator('>=1.2.3')
  t.throws(() => c.intersects(), new TypeError('a Comparator is required'))
  t.end()
})

test('ANY matches anything', t => {
  const c = new Comparator('')
  t.ok(c.test('1.2.3'), 'ANY matches anything')
  const c1 = new Comparator('>=1.2.3')
  const ANY = Comparator.ANY
  t.ok(c1.test(ANY), 'anything matches ANY')
  t.end()
})

test('invalid comparator parse throws', t => {
  t.throws(() => new Comparator('foo bar baz'),
    new TypeError('Invalid comparator: foo bar baz'))
  t.end()
})

test('= is ignored', t => {
  t.match(new Comparator('=1.2.3'), new Comparator('1.2.3'))
  t.end()
})
