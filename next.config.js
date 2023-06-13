
const withTypescript = require('next-transpile-modules')([]);

// This is how we'll transpile `unizen-exchange-core` when it's ready to be imported and used
// const withTypescript = require('next-transpile-modules')(['unizen-exchange-core']);

const moduleExports = withTypescript({
  pageExtensions: [
    'page.tsx',
    'page.ts'
  ],
  images: {
    domains: [
      'api.zcx.com',
      'api-dev.zcx.com',
      'localhost'
    ]
  },
  output: 'standalone',
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true
  }
});

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = moduleExports;
