import * as path from 'node:path';
import { exec } from 'child_process';
import glob from 'glob';
import * as core from '@actions/core';
import { IGNORE } from './config';
import { INPMModule, IUpdate, IUpdates } from './types';
import { filterSemverLevel } from './utils';

const CMD = 'npm outdated --json';
const PACKAGE_JSON = 'package.json';

const IGNORE_FOLDERS = [
  ...IGNORE,
  '**/node_modules/**',
  '.github/actions/dep-checker'
];

const parseModules = (stdout: string): IUpdate[] => {
  const modulesObject = JSON.parse(stdout) as INPMModule[];
  return Object.entries(modulesObject).map(([name, state]) => ({
    name,
    wanted: state.wanted,
    latest: state.latest
  }));
};

const getUpdates = (cwd: string): Promise<IUpdates> => {
  return new Promise((resolve, reject) => {
    exec(CMD, { cwd }, (_, stdout, stderr) => {
      try {
        const updatesList = parseModules(stdout);

        resolve({
          configFile: path.join(cwd, PACKAGE_JSON),
          modules: updatesList.filter(state => filterSemverLevel(state))
        });
      } catch (err) {
        core.error(`Command \`${CMD}\` failed:`);
        core.error(stderr);
        reject(err);
      }
    });
  });
};

const getAllUpdates = async () => {
  const configs = glob.sync(`**/${PACKAGE_JSON}`, { ignore: IGNORE_FOLDERS });
  const updates: IUpdates[] = [];
  for (const configFile of configs) {
    const location = path.dirname(configFile);
    console.log(`Scanning ${configFile} ...`);
    const update = await getUpdates(location);
    if (update.modules.length) {
      updates.push(update);
    }
  }
  return updates;
};

export default getAllUpdates;
