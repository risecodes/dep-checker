import { spawnSync } from 'node:child_process';
import { IGNORE } from '../config';
import { IModuleUpdate } from '../types';
import DepChecker from '.';

const PACKAGE_JSON = 'package.json';
const CMD_ARGS = ['outdated', '--json'];

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

export const getUpdates = (cwd: string): IModuleUpdate[] => {

  const { stdout, stderr, error } = spawnSync('npm', CMD_ARGS, { cwd, encoding: 'utf8' });
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
  ignore: IGNORE_FOLDERS
}, getUpdates);

export default NPMChecker;
