const path = require('path');
const fs = require('fs-extra');
// compile with webpack
const webpack = require('webpack');

const getWebpackConf = require('./webpack.config');

const Build = {
  createIndex(packageName, installPath) {
    const indexPath = path.join(installPath, 'index.js');
    const importStatement = `const p = require('${packageName}');`;
    fs.writeFileSync(indexPath, importStatement);
    return indexPath;
  },

  compile(packageName, installPath, externals) {
    const indexPath = this.createIndex(packageName, installPath);
    const compiler = webpack(getWebpackConf(indexPath, installPath, externals));

    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        resolve({ stats, err });
      });
    });
  }
};

module.exports = Build;
