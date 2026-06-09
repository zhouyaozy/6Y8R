'use strict'

const { spawn } = require('child_process')
const t = require('tap')

const runChild = (NODE_DEBUG) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [__filename, 'child'], {
    env: {
      ...process.env,
      NODE_DEBUG,
    },
  })
  const err = []

  child.stderr.on('data', chunk => err.push(chunk))
  child.on('error', reject)
  child.on('close', (code, signal) => resolve({
    code,
    signal,
    stderr: Buffer.concat(err).toString('utf8'),
  }))
})

const main = async () => {
  await t.test('without semver in NODE_DEBUG', async t => {
    const result = await runChild('notsemver,http')
    t.strictSame(result, {
      code: 0,
      signal: null,
      stderr: '',
    })
  })

  await t.test('with semver in NODE_DEBUG', async t => {
    const result = await runChild('http,SemVer,fs')
    t.strictSame(result, {
      code: 0,
      signal: null,
      stderr: 'SEMVER hello, world\n',
    })
  })
}

if (process.argv[2] === 'child') {
  require('../../internal/debug')('hello, world')
} else {
  main()
}
