const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

function getWebpackConfiguration(indexPath, installPath, externals) {
  let webpackExternals = {};
  if (externals) {
    for (external of externals) {
      webpackExternals[external] = 'external';
    }
  }
  return {
    entry: { main: path.resolve('./', indexPath) },
    mode: 'production',
    output: {
      filename: 'bundle.js',
      path: path.resolve('./', installPath),
      pathinfo: false
    },
    optimization: {
      // Remove the runtime part of the bundle
      namedChunks: true,
      runtimeChunk: { name: 'runtime' },
      minimize: true,
      // Minify bundle
      minimizer: [new TerserPlugin()]
    },
    // use for missing peer dependencies
    // Maybe the missing module should be installed, as needed for the module to work
    externals: webpackExternals
  };
}

module.exports = getWebpackConfiguration;
