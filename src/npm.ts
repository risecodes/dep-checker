import * as path from 'node:path';
import { exec } from 'child_process';
import { diff } from 'semver';
import glob from 'glob';
import { DEP_CHECKER_IGNORE } from './constants';
import { IOutdated, IUpdate, SemverLevels, TSemverLevel } from './types';

const CMD = 'npm outdated --json';
const PACKAGE_JSON = 'package.json';

const IGNORE = [
  ...DEP_CHECKER_IGNORE?.split(/\s+/) || [],
  '**/node_modules/**',
  '.github/actions/dep-checker'
];


const getPackagesLocation = (): string[] => {
  const packagesLocations = glob.sync('**/package.json', { ignore: IGNORE });
  return packagesLocations.map(pl => path.dirname(pl));
};

const filterSemverLevel = (state: IOutdated, semverLevel: TSemverLevel) => {
  const val = diff(state.wanted, state.latest) as TSemverLevel;
  return val && val in SemverLevels && SemverLevels[val] >= SemverLevels[semverLevel];
}

const getUpdates = (cwd: string, semverLevel: TSemverLevel): Promise<IUpdate> => {
  return new Promise((resolve, reject) => {
    exec(CMD, { cwd }, (_, stdout, stderr) => {
      try {
        const updatesMap = JSON.parse(stdout) as IOutdated[];
        const updatesList = Object.entries(updatesMap).map(([name, state]) => ({ name, ...state }));

        resolve({
          packageJson: path.join(cwd, PACKAGE_JSON),
          deps: updatesList.filter(state => filterSemverLevel(state, semverLevel))
        });
      } catch (err) {
        console.log('Executing `npm outdated` failed:\n', stderr);
        reject(err);
      }
    });
  });
};

const getAllUpdates = async (semverLevel: TSemverLevel) => {
  const locations = getPackagesLocation();
  const updates: IUpdate[] = [];
  for (const location of locations) {
    console.log(`Entering ${location} ...`);
    const update = await getUpdates(location, semverLevel);
    if (update.deps.length) {
      console.log(`Found updates: ${JSON.stringify(update, null, 2)}`);
      updates.push(update);
    }
  }
  return updates;
};

export default getAllUpdates;
