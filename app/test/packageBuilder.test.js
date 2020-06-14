const packageinstaller = require('../packageInstaller');
const packageBuilder = require('../packageBuilder');
const fs = require('fs-extra');
const path = require('path');

describe('build util', () => {
  test('should create the index js', () => {
    const installPath = packageinstaller.generateInstall('react');
    packageinstaller.installPackage('react', installPath);
    const indexPath = packageBuilder.createIndex('react', installPath);
    expect(fs.existsSync(indexPath)).toBeTruthy();
  }, 300000);

  test('should build the project', done => {
    const installPath = packageinstaller.generateInstall('react');
    packageinstaller.installPackage('react', installPath);
    packageBuilder.compile('react', installPath).then(({ stats, err }) => {
      expect(fs.existsSync(path.join(installPath, 'bundle.js'))).toBeTruthy();
      done();
    });
  }, 300000);

  test('should build the project', done => {
    const installPath = packageinstaller.generateInstall('semver', '6.3.0');
    packageinstaller.installPackage('semver', installPath);
    packageBuilder.compile('semver', installPath).then(({ stats, err }) => {
      expect(fs.existsSync(path.join(installPath, 'bundle.js'))).toBeTruthy();
      done();
    });
  }, 300000);
});
