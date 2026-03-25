const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    alias: {
      '@pagopa/selfcare-common-frontend$': path.resolve(
        __dirname,
        'node_modules/@pagopa/selfcare-common-frontend/lib/index.js'
      ),
    },
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      });

      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        /Failed to parse source map/,
      ];

      const hasHMR = webpackConfig.plugins.some(
        (p) => p.constructor.name === 'HotModuleReplacementPlugin'
      );
      if (!hasHMR) {
        webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
      }

      return webpackConfig;
    },
  },
};