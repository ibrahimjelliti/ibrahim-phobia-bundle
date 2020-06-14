const packagePhobia = require('../packagePhobia');
const packageinstaller = require('../packageInstaller');
const packageBuilder = require('../packageBuilder');
const packageVersion = require('../packageversion')
const fs = require('fs-extra');
const zlib = require('zlib');

const mockAssests = {
    stats: {
        toJson: function () {
            return {
                assets: [
                    {
                        name: 'main.bundle.js',
                        size: 10240
                    }
                ]
            }
        }
    }
};

describe('packagePhobia', () => {
    test('should get the cost of a package', async () => {
        zlib.gzipSync = jest.fn().mockReturnValue('wxyz');
        packageVersion.getLatestVersions = jest.fn().mockResolvedValue(['1.0.0', '2.0.0']);
        packageinstaller.installPackage = jest.fn();
        fs.readFileSync = jest.fn();
        packageBuilder.compile = jest.fn().mockResolvedValue(mockAssests);
        const results = await packagePhobia('react');
        expect(results.sizes).toEqual([
            { "gzip": 4, "minified": 10240, "name": "react@1.0.0" },
            { "gzip": 4, "minified": 10240, "name": "react@2.0.0" }
        ]);

    }, 300000);
});