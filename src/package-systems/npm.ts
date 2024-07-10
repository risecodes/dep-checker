import { writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as core from '@actions/core';
import semver from 'semver';
import { IGNORE } from '../config';
import { IModuleUpdate } from '../types';
import DepChecker from '../dep-checker';
import { execFilePromise } from '../utils';

const PACKAGE_JSON = 'package.json';
const NPM_CONFIG_USERCONFIG = '/tmp/dep-checker.npmrc';
const UTF8 = 'utf-8';
const NPM_ARGS = ['info', '--json', '--userconfig', NPM_CONFIG_USERCONFIG];

const IGNORE_FOLDERS = [
  ...IGNORE,
  '**/node_modules/**',
];

const NPMRC = core.getInput('npmrc');

interface NPMModule {
  name: string;
  version: string;
}

writeFileSync(NPM_CONFIG_USERCONFIG, NPMRC);

const getPackageInfo = async (dep: NPMModule) => {
  const { stdout, stderr } = await execFilePromise('npm', [...NPM_ARGS, dep.name], { encoding: UTF8 });
  if (stderr) throw new Error(stderr);

  const output = JSON.parse(stdout);
  return {
    name: dep.name,
    wanted: dep.version,
    latest: output.version,
  };
};

export const getUpdates = async (cwd: string): Promise<IModuleUpdate[]> => {
  const packageJsonPath = path.join(path.resolve(cwd), PACKAGE_JSON);

  const {
    dependencies,
    devDependencies,
    peerDependencies,
  } = JSON.parse(readFileSync(packageJsonPath, { encoding: UTF8 }));

  const depsObj = { ...dependencies, ...devDependencies, ...peerDependencies } as Record<string, string>;

  const depsArray = Object.entries(depsObj)
    .filter(([_key, value]) => semver.valid(value))
    .map(([key, value]) => ({
      name: key,
      version: semver.minVersion(value)?.version || value,
    })).sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  const depsInfo = await Promise.all(depsArray.map(dep => getPackageInfo(dep)));
  const outdated = depsInfo.filter(({ wanted, latest }) => semver.compare(wanted, latest) < 0);
  return outdated;
};

const NPMChecker = new DepChecker({
  packageFilename: PACKAGE_JSON,
  ignore: IGNORE_FOLDERS,
  getUpdates,
});

export default NPMChecker;
