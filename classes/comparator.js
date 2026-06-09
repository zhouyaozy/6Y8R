'use strict'111

const COMPARATOR_ANY = Symbol('SemVer ANY')
const SPACE_CHARACTERS = /\s+/g

// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return COMPARATOR_ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      }
      comp = comp.value
    }

    comp = comp.trim().replace(SPACE_CHARACTERS, ' ')
    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    this.value = this.semver === COMPARATOR_ANY
      ? ''
      : this.operator + this.semver.version

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose
      ? re[t.COMPARATORLOOSE]
      : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = COMPARATOR_ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === COMPARATOR_ANY || version === COMPARATOR_ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    // A comparator with no operator is just a single SemVer — cross-check with
    // the other side as a range.
    if (this.operator === '') {
      return this.value === '' || new Range(comp.value, options).test(this.value)
    }

    if (comp.operator === '') {
      return comp.value === '' || new Range(this.value, options).test(comp.semver)
    }

    options = parseOptions(options)

    // Special cases where nothing can possibly be lower
    if (options.includePrerelease) {
      if (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0') {
        return false
      }
    } else {
      if (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0')) {
        return false
      }
    }

    // Same direction increasing (> or >=)
    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
      return true
    }

    // Same direction decreasing (< or <=)
    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
      return true
    }

    // same SemVer and both sides are inclusive (<= or >=)
    if (
      this.semver.version === comp.semver.version &&
      this.operator.includes('=') &&
      comp.operator.includes('=')
    ) {
      return true
    }

    // opposite directions: this opens lower, comp opens higher
    if (cmp(this.semver, '<', comp.semver, options) &&
      this.operator.startsWith('>') && comp.operator.startsWith('<')) {
      return true
    }

    // opposite directions: this opens higher, comp opens lower
    if (cmp(this.semver, '>', comp.semver, options) &&
      this.operator.startsWith('<') && comp.operator.startsWith('>')) {
      return true
    }

    return false
  }
}

module.exports = Comparator

const parseOptions = require('../internal/parse-options')
const { safeRe: re, t } = require('../internal/re')
const cmp = require('../functions/cmp')
const debug = require('../internal/debug')
const SemVer = require('./semver')
const Range = require('./range')
