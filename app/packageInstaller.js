const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');
const shortId = require('shortid');
const sanitize = require('sanitize-filename');

//path where we install the packages
const _installPath = 'tmp/package-build';

const Install = {
  generateInstall(packageName) {
    const id = shortId.generate().slice(0, 3);
    const fileName = sanitize(`${packageName}-${id}`, { replacement: '-' });
    return path.join(_installPath, fileName);
  },
  installPackage(packageName, installPath) {
    fs.mkdirpSync(installPath);
    fs.writeFileSync(path.join(installPath, 'package.json'), JSON.stringify({ dependencies: {} }));
    childProcess.execSync(
      `npm install ${packageName} --progress false --no-package-lock --loglevel error`,
      {
        cwd: installPath,
        maxBuffer: 1024 * 500
      }
    );
    return installPath;
  }
};

module.exports = Install;
