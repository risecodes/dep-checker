import { spawnSync } from 'node:child_process';
import { IGNORE } from '../config';
import { IUpdate } from '../types';
import DepChecker from '.';

const PACKAGE_JSON = 'package.json';
const CMD_ARGS = ['outdated', '--json'];

const IGNORE_FOLDERS = [
  ...IGNORE,
  '**/node_modules/**',
  '.github/actions/dep-checker'
];

interface INPMModule {
  current?: string,
  wanted: string,
  latest: string,
  dependent: string,
  location?: string
}

const getUpdates = (cwd: string): IUpdate[] => {

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
  packageFile: PACKAGE_JSON,
  ignore: IGNORE_FOLDERS
}, getUpdates);

export default NPMChecker;