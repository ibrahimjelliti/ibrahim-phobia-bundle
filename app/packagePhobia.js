const packageInstaller = require('./packageInstaller');
const packageVersion = require('./packageversion');
const packageBuilder = require('./packageBuilder');
const axios = require('axios');
const zlib = require('zlib');
const fs = require('fs-extra');
const path = require('path');
const storage = require('node-persist');

storage.init();

const registryURL = `https://registry.npmjs.com`;

function getMinifiedSize(jsonStats) {
  return jsonStats.assets.find(asset => asset.name === 'main.bundle.js').size;
}

function getGzipSize(installPath) {
  const bundleContents = fs.readFileSync(path.join(installPath, 'main.bundle.js'));
  return zlib.gzipSync(bundleContents, {}).length;
}

function getModuleNotFoundError(errors) {
  const moduleNotFoundErrors = errors.filter(
    error => error.indexOf('Module not found: Error') !== -1
  );

  if (moduleNotFoundErrors.length === 0) {
    return [];
  }

  const moduleNotFoundsRegex = /Can't resolve '(.+)' in/;

  return moduleNotFoundErrors.map(err => {
    const matches = err.toString().match(moduleNotFoundsRegex);
    return matches[1];
  });
}

// entrypoint 
async function packagePhobia(packageName) {

  const packageData = await axios.get(`${registryURL}/${packageName}`);
  const packageVersions = await packageVersion.getLatestVersions(packageName);

  //API response structure
  let bundlepPhobia = {
    name: packageData.data._id,
    description: packageData.data.description,
    sizes: [],
    versions: packageVersions
  }

  for (const versionToInstall of packageVersions) {
    const versionedName = `${packageName}@${versionToInstall}`;
    /**
     *  check if package is in persist cache
     * if yes get value and continue to next version in the loop
    */
    const versionedNameCachedValue = await storage.getItem(versionedName)
    if (versionedNameCachedValue) {
      console.log(versionedName, ' found in the persisted cache :)');
      bundlepPhobia.sizes.push(versionedNameCachedValue)
      continue;
    }

    const installPath = packageInstaller.generateInstall(versionedName);

    packageInstaller.installPackage(versionedName, installPath);
    const { stats } = await packageBuilder.compile(packageName, installPath);

    let jsonStats = stats.toJson();

    if (jsonStats.errors) {
      const externals = getModuleNotFoundError(jsonStats.errors);
      if (externals) {
        const { stats } = await packageBuilder.compile(packageName, installPath, externals);
        jsonStats = stats.toJson();
      } else {
        throw new Error('Compilation error');
      }
    }

    const versionedNameStats = {
      name: versionedName,
      minified: getMinifiedSize(jsonStats),
      gzip: getGzipSize(installPath)
    };

    bundlepPhobia.sizes.push(versionedNameStats)
    // persist caching of the versionedName. even if the process killed the data remain persisted ;)
    await storage.setItem(versionedName, versionedNameStats)
  }
  return bundlepPhobia;
}

module.exports = packagePhobia;
