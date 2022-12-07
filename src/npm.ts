import * as path from 'node:path';
import { exec } from 'child_process';
import { diff } from 'semver';
import glob from 'glob';
import { DEP_CHECKER_IGNORE } from './constants';
import { IOutdated, IUpdate } from './types';

const CMD = 'npm outdated --json';
const MAJOR = 'major';
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

const getUpdates = (cwd: string): Promise<IUpdate> => {
  return new Promise((resolve, reject) => {
    exec(CMD, { cwd }, (err, stdout, stderr) => {
      try {
        const updatesMap = JSON.parse(stdout) as IOutdated[];
        const updatesList = Object.entries(updatesMap).map(([name, state]) => ({ name, ...state }));

        const majorUpdates = updatesList.filter(({ wanted, latest }) => {
          return diff(wanted, latest) === MAJOR;
        }).map(({ wanted, latest, name }) => ({ wanted, latest, name }));

        resolve({
          packageJson: path.join(cwd, PACKAGE_JSON),
          deps: majorUpdates
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
