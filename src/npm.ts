import * as path from 'node:path';
import { exec } from 'child_process';
import { diff } from 'semver';
import glob from 'glob';
import { DEP_CHECKER_IGNORE, DEP_CHECKER_LEVEL } from './constants';
import { IOutdated, IUpdate, ELevels, TLevels } from './types';

const CMD = 'npm outdated --json';
const PACKAGE_JSON = 'package.json';

const IGNORE = [
  ...DEP_CHECKER_IGNORE?.split(/\s+/) || [],
  '**/node_modules/**',
  '.github/actions/dep-checker'
];

if (!(DEP_CHECKER_LEVEL in ELevels)) {
  throw new Error(`Invalid level "${DEP_CHECKER_LEVEL}", valid values are: major,minor,patch`);
}

const LEVEL = ELevels[DEP_CHECKER_LEVEL as TLevels];


const getPackagesLocation = (): string[] => {
  const packagesLocations = glob.sync('**/package.json', { ignore: IGNORE });
  return packagesLocations.map(pl => path.dirname(pl));
};

const filterLevel = (state: IOutdated) => {
  const level = diff(state.wanted, state.latest) as TLevels;
  return level && level in ELevels && ELevels[level] >= LEVEL;
}

const getUpdates = (cwd: string): Promise<IUpdate> => {
  return new Promise((resolve, reject) => {
    exec(CMD, { cwd }, (_, stdout, stderr) => {
      try {
        const updatesMap = JSON.parse(stdout) as IOutdated[];
        const updatesList = Object.entries(updatesMap).map(([name, state]) => ({ name, ...state }));

        resolve({
          packageJson: path.join(cwd, PACKAGE_JSON),
          deps: updatesList.filter(filterLevel)
        });
      } catch (err) {
        console.log('Executing `npm outdated` failed:\n', stderr);
        reject(err);
      }
    });
  });
};

const getAllUpdates = async () => {
  const locations = getPackagesLocation();
  const updates: IUpdate[] = [];
  for (const location of locations) {
    console.log(`Entering ${location} ...`);
    const update = await getUpdates(location);
    if (update.deps.length) {
      console.log(`Found updates: ${JSON.stringify(update, null, 2)}`);
      updates.push(update);
    }
  }
  return updates;
};

export default getAllUpdates;
