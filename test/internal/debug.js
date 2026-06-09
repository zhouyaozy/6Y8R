'use strict'

const main = () => {
  const t = require('tap')
  const { spawn } = require('child_process')

  const runChild = (mode, env) => new Promise((resolve, reject) => {
    const c = spawn(process.execPath, [__filename, mode], { env })
    const err = []
    c.stderr.on('data', chunk => err.push(chunk))
    c.on('error', reject)
    c.on('close', (code, signal) => resolve({
      code,
      signal,
      stderr: Buffer.concat(err).toString('utf8'),
    }))
  })

  t.test('without env set', async t => {
    const { code, signal, stderr } = await runChild('child', {
      ...process.env,
      NODE_DEBUG: '',
    })

    t.equal(code, 0, 'success exit status')
    t.equal(signal, null, 'no signal')
    t.equal(stderr, '', 'got no output')
  })

  t.test('with env set', async t => {
    const { code, signal, stderr } = await runChild('child', {
      ...process.env,
      NODE_DEBUG: 'semver',
    })

    t.equal(code, 0, 'success exit status')
    t.equal(signal, null, 'no signal')
    t.equal(stderr, 'SEMVER hello, world\n', 'got expected output')
  })

  t.test('paginate with env set', async t => {
    const { code, signal, stderr } = await runChild('paginate', {
      ...process.env,
      NODE_DEBUG: 'semver',
    })

    t.equal(code, 0, 'success exit status')
    t.equal(signal, null, 'no signal')
    t.equal(stderr, 'SEMVER Versions Page 2/2 (3-3 of 3)\nSEMVER 3.0.0\n', 'got paginated output')
  })
}

if (process.argv[2] === 'child') {
  require('../../internal/debug')('hello, world')
} else if (process.argv[2] === 'paginate') {
  require('../../internal/debug').paginate([
    '1.0.0',
    '2.0.0',
    '3.0.0',
  ], {
    title: 'Versions',
    page: 2,
    pageSize: 2,
  })
} else {
  main()
}
