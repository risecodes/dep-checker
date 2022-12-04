import * as fs from 'node:fs';
import * as path from 'node:path';
import { exec } from 'child_process';
import { diff } from 'semver';
import { IGNORE_FOLDERS } from './constants';
import { IOutdated, IUpdate } from './types';

const CMD = 'npm outdated --json';
const MAJOR = 'major';
const PACKAGE_JSON = 'package.json';
const PREFIX_LENGTH = process.cwd().length + 1;


const getPackagesLocation = (dirPath: string): string[] => {
  const files = fs.readdirSync(dirPath).map(file => {
    return path.join(dirPath, file);
  });

  const packagesLocation: string[][] = [];

  for (const file of files) {
    if (fs.statSync(file).isDirectory()) {
      if (!IGNORE_FOLDERS.includes(file.slice(PREFIX_LENGTH))) {
        packagesLocation.push(getPackagesLocation(file));
      }
    } else if (path.basename(file) === PACKAGE_JSON) {
      packagesLocation.push([path.dirname(file)]);
    }
  }

  return packagesLocation.flat().sort();

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
          packageJson: path.join(cwd, PACKAGE_JSON).slice(PREFIX_LENGTH),
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
  const locations = getPackagesLocation(process.cwd());
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
