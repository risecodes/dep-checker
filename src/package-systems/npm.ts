import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import * as core from '@actions/core';
import { IGNORE } from '../config';
import { IModuleUpdate } from '../types';
import DepChecker from '../dep-checker';

const PACKAGE_JSON = 'package.json';
const NPM_CONFIG_USERCONFIG = '/tmp/dep-checker.npmrc';
const UTF8 = 'utf-8';

const NPMRC = core.getInput('npmrc');

const IGNORE_FOLDERS = [
  ...IGNORE,
  '**/node_modules/**',
];

interface INPMModule {
  current?: string,
  wanted: string,
  latest: string,
  dependent: string,
  location?: string
}

const setup = () => {
  if (!NPMRC) return;
  writeFileSync(NPM_CONFIG_USERCONFIG, NPMRC);
};

export const getUpdates = (cwd: string): IModuleUpdate[] => {

  setup();

  const npmArgs = ['outdated', '--json'];
  if (NPMRC) npmArgs.push('--userconfig', NPM_CONFIG_USERCONFIG);

  const { stdout, stderr, error } = spawnSync('npm', npmArgs, { cwd, encoding: UTF8 });
  if (error) throw error;
  if (stderr) throw new Error(stderr);

  const modules = JSON.parse(stdout) as INPMModule[];

  return Object.entries(modules)
    .map(([name, state]) => ({
      name,
      wanted: state.wanted,
      latest: state.latest
    }));
};

const NPMChecker = new DepChecker({
  packageFilename: PACKAGE_JSON,
  ignore: IGNORE_FOLDERS,
  getUpdates
});

export default NPMChecker;
