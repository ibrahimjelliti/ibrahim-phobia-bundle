const packageVersion = require('../packageversion');
const request = require('request');

const react_mock = require('./version-mocks/react.mock.json');
const unknown = require('./version-mocks/unknown-package.mock.json');
const oneVersion = require('./version-mocks/one-version.mock.json');
const missingVersion = require('./version-mocks/missing-major.mock.json');
const prerelease = require('./version-mocks/prerelease.mock.json');

describe('version test suite', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should call request get', () => {
        const spy = jest.spyOn(request, 'get').mockImplementation(() => { });
        packageVersion.getLatestVersions('react');
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.calls[0][0]).toEqual('https://registry.npmjs.org/react');
    });

    test('should return list of latest versions', done => {
        jest.spyOn(request, 'get').mockImplementation((url, cb) => {
            cb(null, {}, JSON.stringify(react_mock));
        });
        packageVersion.getLatestVersions('react').then(error => {
            expect(error).toEqual(['15.6.2', '16.12.0', '16.13.0', '16.13.1']);
            done();
        });
    });

    test('should not return any version if package is unknown', done => {
        jest.spyOn(request, 'get').mockImplementation((url, cb) => {
            cb(null, { statusCode: 404 }, JSON.stringify(unknown));
        });
        packageVersion.getLatestVersions('qwerty123').catch(error => {
            expect(error).toEqual('Package does not exists');
            done();
        });
    });

    test('should not return previous major version if not exists', done => {
        jest.spyOn(request, 'get').mockImplementation((url, cb) => {
            cb(null, {}, JSON.stringify(oneVersion));
        });
        packageVersion.getLatestVersions('masta').then(version => {
            expect(version).toEqual(['1.0.0']);
            done();
        });
    });

    test('should work if latest major version is missing', done => {
        jest.spyOn(request, 'get').mockImplementation((url, cb) => {
            cb(null, {}, JSON.stringify(missingVersion));
        });
        packageVersion.getLatestVersions('toto').then(version => {
            expect(version).toEqual(['0.0.2', '2.0.2']);
            done();
        });
    });

    test('should filter out prerelease versions', done => {
        jest.spyOn(request, 'get').mockImplementation((url, cb) => {
            cb(null, {}, JSON.stringify(prerelease));
        });
        packageVersion.getLatestVersions('react').then(version => {
            expect(version).toEqual(['0.0.1']);
            done();
        });
    });
});
