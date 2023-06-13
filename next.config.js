
const withTypescript = require('next-transpile-modules')([]);

const moduleExports = withTypescript({
  pageExtensions: [
    'page.tsx',
    'page.ts'
  ],
  output: 'standalone'
});

module.exports = moduleExports;
