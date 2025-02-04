"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
var ora = require('ora');
var childProcess = require('child_process');
const utils_1 = tslib_1.__importStar(require("./utils"));
const project_infos_1 = tslib_1.__importDefault(require("./project-infos"));
jest.mock('ora');
jest.mock('child_process', () => ({
    execSync: jest.fn()
}));
jest.mock('./utils', () => ({
    getPackageJson: jest.fn(),
    getProjectName: jest.fn(() => 'readme-md-generator'),
    getAuthorWebsiteFromGithubAPI: jest.fn(() => 'https://www.franck-abgrall.me/'),
    getPackageManagerFromLockFile: jest.fn(() => 'yarn')
}));
const succeed = jest.fn();
const fail = jest.fn();
ora.mockReturnValue({
    start: () => ({
        succeed,
        fail
    })
});
describe('pinfo', () => {
    describe('getProjectInfos', () => {
        it('should call ora with correct parameters', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield project_infos_1.default.getProjectInfos();
            expect(ora).toHaveBeenCalledTimes(1);
            expect(ora).toHaveBeenCalledWith('Gathering project infos');
            expect(succeed).toHaveBeenCalledTimes(1);
            expect(succeed).toHaveBeenCalledWith('Project infos gathered');
        }));
        it('should return correct infos', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const packgeJsonInfos = utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                version: '0.1.3',
                description: 'CLI that generates beautiful README.md files.',
                author: 'Franck Abgrall',
                license: 'MIT',
                homepage: 'https://github.com/kefranabg/readme-md-generator',
                repository: {
                    type: 'git',
                    url: 'git+https://github.com/kefranabg/readme-md-generator.git'
                },
                bugs: {
                    url: 'https://github.com/kefranabg/readme-md-generator/issues'
                },
                engines: {
                    npm: '>=5.5.0',
                    node: '>=9.3.0'
                }
            });
            utils_1.default.getPackageJson = jest.fn().mockReturnValueOnce(Promise.resolve(packgeJsonInfos));
            childProcess.execSync.mockReturnValue('https://github.com/kefranabg/readme-md-generator.git');
            const projectInfos = yield project_infos_1.default.getProjectInfos();
            expect(projectInfos).toEqual(utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                description: 'CLI that generates beautiful README.md files.',
                version: '0.1.3',
                author: 'Franck Abgrall',
                repositoryUrl: 'https://github.com/kefranabg/readme-md-generator',
                homepage: 'https://github.com/kefranabg/readme-md-generator',
                contributingUrl: 'https://github.com/kefranabg/readme-md-generator/blob/master/CONTRIBUTING.md',
                authorWebsite: 'https://www.franck-abgrall.me/',
                githubUsername: 'kefranabg',
                engines: {
                    npm: '>=5.5.0',
                    node: '>=9.3.0'
                },
                licenseName: 'MIT',
                licenseUrl: 'https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE',
                documentationUrl: 'https://github.com/kefranabg/readme-md-generator#readme',
                isGithubRepos: true,
                isJSProject: true,
                issuesUrl: 'https://github.com/kefranabg/readme-md-generator/issues',
                hasStartCommand: false,
                hasTestCommand: false,
                packageManager: 'yarn'
            }));
        }));
        it('should return correct infos when repos is not github', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const packgeJsonInfos = utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                version: '0.1.3',
                description: 'CLI that generates beautiful README.md files.',
                author: 'Franck Abgrall',
                license: 'MIT',
                homepage: 'https://gitlab.com/kefranabg/readme-md-generator',
                repository: {
                    type: 'git',
                    url: 'git+https://gitlab.com/kefranabg/readme-md-generator.git'
                },
                bugs: {
                    url: 'https://gitlab.com/kefranabg/readme-md-generator/issues'
                },
                engines: {
                    npm: '>=5.5.0',
                    node: '>=9.3.0'
                }
            });
            utils_1.default.getPackageJson = jest.fn().mockReturnValueOnce(Promise.resolve(packgeJsonInfos));
            childProcess.execSync.mockReturnValue('https://github.com/kefranabg/readme-md-generator.git');
            const projectInfos = yield project_infos_1.default.getProjectInfos();
            expect(projectInfos).toEqual({
                name: 'readme-md-generator',
                description: 'CLI that generates beautiful README.md files.',
                version: '0.1.3',
                author: 'Franck Abgrall',
                repositoryUrl: 'https://gitlab.com/kefranabg/readme-md-generator',
                contributingUrl: 'https://gitlab.com/kefranabg/readme-md-generator/blob/master/CONTRIBUTING.md',
                homepage: 'https://gitlab.com/kefranabg/readme-md-generator',
                githubUsername: undefined,
                authorWebsite: undefined,
                engines: {
                    npm: '>=5.5.0',
                    node: '>=9.3.0'
                },
                licenseName: 'MIT',
                licenseUrl: undefined,
                documentationUrl: undefined,
                isGithubRepos: false,
                isJSProject: true,
                issuesUrl: 'https://gitlab.com/kefranabg/readme-md-generator/issues',
                hasStartCommand: false,
                hasTestCommand: false,
                packageManager: 'yarn'
            });
        }));
        it('should return correct infos when package.json is not defined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            utils_1.default.getPackageJson = jest.fn().mockReturnValueOnce(Promise.resolve(undefined));
            childProcess.execSync.mockReturnValue('https://github.com/kefranabg/readme-md-generator.git');
            const projectInfos = yield project_infos_1.default.getProjectInfos();
            expect(projectInfos).toEqual(utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                description: undefined,
                version: undefined,
                author: undefined,
                repositoryUrl: 'https://github.com/kefranabg/readme-md-generator',
                contributingUrl: 'https://github.com/kefranabg/readme-md-generator/blob/master/CONTRIBUTING.md',
                homepage: undefined,
                githubUsername: 'kefranabg',
                authorWebsite: 'https://www.franck-abgrall.me/',
                engines: undefined,
                licenseName: undefined,
                licenseUrl: 'https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE',
                documentationUrl: 'https://github.com/kefranabg/readme-md-generator#readme',
                isGithubRepos: true,
                isJSProject: false,
                issuesUrl: 'https://github.com/kefranabg/readme-md-generator/issues',
                hasStartCommand: false,
                hasTestCommand: false
            }));
        }));
        it('should return correct infos when repos is not github and package.json are not defined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            utils_1.default.getPackageJson = jest.fn().mockReturnValueOnce(Promise.resolve(undefined));
            childProcess.execSync.mockReturnValue('https://gitlab.com/kefranabg/readme-md-generator.git');
            const projectInfos = yield project_infos_1.default.getProjectInfos();
            expect(projectInfos).toEqual(utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                description: undefined,
                version: undefined,
                author: undefined,
                repositoryUrl: 'https://gitlab.com/kefranabg/readme-md-generator',
                authorWebsite: undefined,
                contributingUrl: 'https://gitlab.com/kefranabg/readme-md-generator/blob/master/CONTRIBUTING.md',
                homepage: undefined,
                githubUsername: undefined,
                engines: undefined,
                licenseName: undefined,
                licenseUrl: undefined,
                documentationUrl: undefined,
                isGithubRepos: false,
                isJSProject: false,
                issuesUrl: 'https://gitlab.com/kefranabg/readme-md-generator/issues',
                hasStartCommand: false,
                hasTestCommand: false
            }));
        }));
        it('should return correct infos when git config and package.json are not defined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            utils_1.default.getPackageJson = jest.fn().mockReturnValueOnce(Promise.resolve(undefined));
            childProcess.execSync.mockImplementation(() => {
                throw new Error('error');
            });
            const projectInfos = yield project_infos_1.default.getProjectInfos();
            expect(projectInfos).toEqual(utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                description: undefined,
                version: undefined,
                author: undefined,
                repositoryUrl: undefined,
                contributingUrl: undefined,
                homepage: undefined,
                authorWebsite: undefined,
                githubUsername: undefined,
                engines: undefined,
                licenseName: undefined,
                licenseUrl: undefined,
                documentationUrl: undefined,
                isGithubRepos: false,
                isJSProject: false,
                testCommand: undefined,
                hasStartCommand: false,
                hasTestCommand: false
            }));
        }));
        it('should return correct infos when git config is not defined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const packgeJsonInfos = utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                version: '0.1.3',
                description: 'CLI that generates beautiful README.md files.',
                author: 'Franck Abgrall',
                license: 'MIT',
                homepage: 'https://github.com/kefranabg/readme-md-generator',
                repository: {
                    type: 'git',
                    url: 'git+https://github.com/kefranabg/readme-md-generator.git'
                },
                bugs: {
                    url: 'https://github.com/kefranabg/readme-md-generator/issues'
                },
                engines: {
                    npm: '>=5.5.0',
                    node: '>=9.3.0'
                }
            });
            utils_1.default.getPackageJson = jest.fn().mockReturnValueOnce(Promise.resolve(packgeJsonInfos));
            childProcess.execSync.mockImplementation(() => {
                throw new Error('error');
            });
            const projectInfos = yield project_infos_1.default.getProjectInfos();
            expect(projectInfos).toEqual(utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                description: 'CLI that generates beautiful README.md files.',
                version: '0.1.3',
                author: 'Franck Abgrall',
                repositoryUrl: 'https://github.com/kefranabg/readme-md-generator',
                contributingUrl: 'https://github.com/kefranabg/readme-md-generator/blob/master/CONTRIBUTING.md',
                homepage: 'https://github.com/kefranabg/readme-md-generator',
                githubUsername: 'kefranabg',
                authorWebsite: 'https://www.franck-abgrall.me/',
                engines: {
                    npm: '>=5.5.0',
                    node: '>=9.3.0'
                },
                licenseName: 'MIT',
                licenseUrl: 'https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE',
                documentationUrl: 'https://github.com/kefranabg/readme-md-generator#readme',
                isGithubRepos: true,
                isJSProject: true,
                issuesUrl: 'https://github.com/kefranabg/readme-md-generator/issues',
                hasStartCommand: false,
                hasTestCommand: false,
                packageManager: 'yarn'
            }));
        }));
        it('should return correct infos when author is defined as an object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const packgeJsonInfos = utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                version: '0.1.3',
                description: 'CLI that generates beautiful README.md files.',
                author: {
                    name: 'Franck Abgrall',
                    email: 'abgrallkefran@gmail.com',
                    url: ''
                },
                license: 'MIT',
                homepage: 'https://github.com/kefranabg/readme-md-generator',
                repository: {
                    type: 'git',
                    url: 'git+https://github.com/kefranabg/readme-md-generator.git'
                },
                bugs: {
                    url: 'https://github.com/kefranabg/readme-md-generator/issues'
                },
                engines: {
                    npm: '>=5.5.0',
                    node: '>=9.3.0'
                }
            });
            utils_1.default.getPackageJson = jest.fn().mockReturnValueOnce(Promise.resolve(packgeJsonInfos));
            childProcess.execSync.mockReturnValue('https://github.com/kefranabg/readme-md-generator.git');
            const projectInfos = yield project_infos_1.default.getProjectInfos();
            expect(projectInfos).toEqual(utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                description: 'CLI that generates beautiful README.md files.',
                version: '0.1.3',
                author: 'Franck Abgrall',
                repositoryUrl: 'https://github.com/kefranabg/readme-md-generator',
                homepage: 'https://github.com/kefranabg/readme-md-generator',
                contributingUrl: 'https://github.com/kefranabg/readme-md-generator/blob/master/CONTRIBUTING.md',
                githubUsername: 'kefranabg',
                authorWebsite: 'https://www.franck-abgrall.me/',
                engines: {
                    npm: '>=5.5.0',
                    node: '>=9.3.0'
                },
                licenseName: 'MIT',
                licenseUrl: 'https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE',
                documentationUrl: 'https://github.com/kefranabg/readme-md-generator#readme',
                isGithubRepos: true,
                isJSProject: true,
                issuesUrl: 'https://github.com/kefranabg/readme-md-generator/issues',
                hasStartCommand: false,
                hasTestCommand: false,
                packageManager: 'yarn'
            }));
        }));
        it('should return correct infos when lock file is found', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const packgeJsonInfos = utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                version: '0.1.3',
                description: 'CLI that generates beautiful README.md files.',
                author: 'Franck Abgrall',
                license: 'MIT',
                homepage: 'https://github.com/kefranabg/readme-md-generator',
                repository: {
                    type: 'git',
                    url: 'git+https://github.com/kefranabg/readme-md-generator.git'
                },
                bugs: {
                    url: 'https://github.com/kefranabg/readme-md-generator/issues'
                },
                engines: {
                    npm: '>=5.5.0',
                    node: '>=9.3.0'
                },
                scripts: {
                    start: 'node src/index.ts',
                    test: 'jest'
                }
            });
            utils_1.default.getPackageJson = jest.fn().mockReturnValueOnce(Promise.resolve(packgeJsonInfos));
            utils_1.default.getPackageManagerFromLockFile = jest.fn().mockReturnValueOnce('yarn');
            childProcess.execSync.mockReturnValue('https://github.com/kefranabg/readme-md-generator.git');
            const projectInfos = yield project_infos_1.default.getProjectInfos();
            expect(projectInfos).toEqual(utils_1.PackageJson.ForceCreateUnsafeFromInterface({
                name: 'readme-md-generator',
                description: 'CLI that generates beautiful README.md files.',
                version: '0.1.3',
                author: 'Franck Abgrall',
                repositoryUrl: 'https://github.com/kefranabg/readme-md-generator',
                homepage: 'https://github.com/kefranabg/readme-md-generator',
                contributingUrl: 'https://github.com/kefranabg/readme-md-generator/blob/master/CONTRIBUTING.md',
                authorWebsite: 'https://www.franck-abgrall.me/',
                githubUsername: 'kefranabg',
                engines: {
                    npm: '>=5.5.0',
                    node: '>=9.3.0'
                },
                licenseName: 'MIT',
                licenseUrl: 'https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE',
                documentationUrl: 'https://github.com/kefranabg/readme-md-generator#readme',
                isGithubRepos: true,
                isJSProject: true,
                issuesUrl: 'https://github.com/kefranabg/readme-md-generator/issues',
                hasStartCommand: true,
                hasTestCommand: true,
                packageManager: 'yarn'
            }));
        }));
    });
});
//# sourceMappingURL=project-infos.spec.js.map