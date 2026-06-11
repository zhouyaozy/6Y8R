'use strict'

module.exports = {
  overrides: [
    {
      files: ['bin/**', 'classes/**', 'functions/**', 'internal/**', 'ranges/**'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: false,
          },
        ],
        'import/no-nodejs-modules': ['error'],
        strict: ['error', 'global'],
      },
    },
    {
      files: ['benchmarks/bench-compare.js', 'benchmarks/bench-diff.js'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'import/no-nodejs-modules': ['error'],
        'no-console': ['error'],
        strict: ['error', 'global'],
      },
    },
  ],
}
