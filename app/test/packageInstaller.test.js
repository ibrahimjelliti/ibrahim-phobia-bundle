const packageinstaller = require('../packageInstaller');
const fs = require('fs-extra');
const path = require('path');

const packageWithoutVersion = 'react';
const packageWithVersion = 'react@16.0.0';

describe('generate install path', () => {
  test('should generate install path without a version', () => {
    let installerPath = packageinstaller.generateInstall(packageWithoutVersion);
    expect(installerPath).toEqual(expect.stringContaining('react'));
  }, 300000);

  test('should generate install path with a version', () => {
    let installerPath = packageinstaller.generateInstall(packageWithVersion);
    expect(installerPath).toEqual(expect.stringContaining('react'));
  }, 300000);
});

describe('install util', () => {
  let installPath = '';
  afterEach(() => {
    if (installPath.startsWith('tmp')) fs.removeSync(installPath);
  });

  test('should install a package without a version', () => {
    let installPath = 'tmp-test\\package-build\\package';
    packageinstaller.installPackage(packageWithVersion, installPath);
    expect(fs.existsSync(path.join(installPath, 'node_modules/react'))).toBeTruthy();
    const packageJson = require(path.resolve(
      path.join(installPath, 'node_modules/react/package.json')
    ));
    expect(packageJson.version).toBeDefined();
  }, 300000);

  test('should install a package with a version', () => {
    let installPath = 'tmp-test\\package-build\\package-with-version';
    packageinstaller.installPackage(packageWithVersion, installPath);
    expect(fs.existsSync(path.join(installPath, 'node_modules/react'))).toBeTruthy();
    const packageJson = require(path.resolve(
      path.join(installPath, 'node_modules/react/package.json')
    ));
    expect(packageJson.version).toEqual('16.0.0');
  }, 300000);
});
