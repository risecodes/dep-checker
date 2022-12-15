import * as path from 'node:path';
import { exec } from 'child_process';
import glob from 'glob';
import { DEP_CHECKER_IGNORE } from './constants';
import { INPMModule, IUpdate, IUpdates } from './types';
import { filterSemverLevel } from './utils';

const CMD = 'npm outdated --json';
const PACKAGE_JSON = 'package.json';

const IGNORE = [
  ...DEP_CHECKER_IGNORE?.split(/\s+/) || [],
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
        console.log('Executing `npm outdated` failed:\n', stderr);
        reject(err);
      }
    });
  });
};

const getAllUpdates = async () => {
  const locations = glob.sync(`**/${PACKAGE_JSON}`, { ignore: IGNORE }).map(pl => path.dirname(pl));
  const updates: IUpdates[] = [];
  for (const location of locations) {
    console.log(`Entering ${location} ...`);
    const update = await getUpdates(location);
    if (update.modules.length) {
      console.log(`Found updates: ${JSON.stringify(update, null, 2)}`);
      updates.push(update);
    }
  }
  return updates;
};

export default getAllUpdates;
