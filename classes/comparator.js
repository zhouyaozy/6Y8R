'use strict'

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    comp = comp.trim().split(/\s+/).join(' ')
    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
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

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    }
    if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    options = parseOptions(options)

    if (this.#isBelowZero(comp, options)) {
      return false
    }

    if (this.#sameDirection(comp)) {
      return true
    }
    if (this.#oppositeDirection(comp, options)) {
      return true
    }

    return false
  }

  #isBelowZero (comp, options) {
    if (options.includePrerelease) {
      return this.value === '<0.0.0-0' || comp.value === '<0.0.0-0'
    }
    return this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0')
  }

  #sameDirection (comp) {
    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
      return true
    }
    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
      return true
    }
    if (
      this.semver.version === comp.semver.version &&
      this.operator.includes('=') &&
      comp.operator.includes('=')
    ) {
      return true
    }
    return false
  }

  #oppositeDirection (comp, options) {
    if (
      cmp(this.semver, '<', comp.semver, options) &&
      this.operator.startsWith('>') &&
      comp.operator.startsWith('<')
    ) {
      return true
    }
    if (
      cmp(this.semver, '>', comp.semver, options) &&
      this.operator.startsWith('<') &&
      comp.operator.startsWith('>')
    ) {
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
