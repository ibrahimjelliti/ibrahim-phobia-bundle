const request = require('request');
const semver = require('semver');
const LastNVersions = 3;
const Version = {
  getLatestVersions(packageName) {
    return new Promise((resolve, reject) => {
      request.get('https://registry.npmjs.org/' + packageName, (error, response, body) => {
        if (error) {
          reject('HTTP error ');
          return;
        }

        if (response && response.statusCode === 404) {
          reject('Package does not exists');
          return;
        }

        const packageInfo = JSON.parse(body);
        // filtered out Pre release versions 
        const allSortedVersions = Object.keys(packageInfo.versions)
          .sort(semver.compare)
          .filter(v => semver.prerelease(v) === null);

        const currentMajorVersion = semver.major(allSortedVersions.slice(-1)[0]);

        const lastVersions = allSortedVersions
          .filter(version => semver.major(version) === currentMajorVersion)
          .slice(-LastNVersions); //sign - to get last N versions

        let previousVersion = undefined;
        if (currentMajorVersion > 0) {
          previousVersion = allSortedVersions
            .reverse()
            .find(v => semver.major(v) !== currentMajorVersion);
        }

        if (previousVersion) {
          resolve([previousVersion, ...lastVersions]);
        } else {
          resolve([...lastVersions]);
        }
      });
    });
  }
};

module.exports = Version;
