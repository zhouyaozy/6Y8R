'use strict'

const main = () => {
  const t = require('tap')
  const { spawn } = require('child_process')
  t.plan(2)
  t.test('without env set', t => {
    const c = spawn(process.execPath, [__filename, 'child'], { env: {
      ...process.env,
      NODE_DEBUG: '',
    } })
    const err = []
    c.stderr.on('data', chunk => err.push(chunk))
    c.on('close', (code, signal) => {
      t.equal(code, 0, 'success exit status')
      t.equal(signal, null, 'no signal')
      t.equal(Buffer.concat(err).toString('utf8'), '', 'got no output')
      t.end()
    })
  })
  t.test('with env set', t => {
    const c = spawn(process.execPath, [__filename, 'child'], { env: {
      ...process.env,
      NODE_DEBUG: 'semver',
    } })
    const err = []
    c.stderr.on('data', chunk => err.push(chunk))
    c.on('close', (code, signal) => {
      t.equal(code, 0, 'success exit status')
      t.equal(signal, null, 'no signal')
      const output = Buffer.concat(err).toString('utf8')
      t.match(output, /SEMVER hello, world/, 'got expected output')
      t.match(output, /SEMVER \[Page 1\/2\] \(Total: 3\) \[ 1, 2 \]/, 'got paginated output array')
      t.match(output, /SEMVER \[Page 1\/2\] \(Total: 3\) \{ a: 1, b: 2 \}/, 'got paginated output object')
      t.end()
    })
  })
  t.end()
}

if (process.argv[2] === 'child') {
  const debug = require('../../internal/debug')
  debug('hello, world')
  debug.debugPaginated([1, 2, 3], 1, 2)
  debug.debugPaginated({ a: 1, b: 2, c: 3 }, 1, 2)
} else {
  main()
}
