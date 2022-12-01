const fs = require('node:fs');
const path = require('node:path');
const { exec } = require('node:child_process');
const semver = require('semver');
const { IGNORE_FOLDERS } = require('./constants');

const CMD = 'npm outdated --json';
const MAJOR = 'major';
const PACKAGE_JSON = 'package.json';
const PREFIX_LENGTH = process.cwd().length + 1;


const getPackagesLocation = (dirPath) => {
  const files = fs.readdirSync(dirPath).map(file => {
    return path.join(dirPath, file);
  });

  const packagesLocation = [];

  for (const file of files) {
    if (fs.statSync(file).isDirectory()) {
      if (!IGNORE_FOLDERS.includes(file.slice(PREFIX_LENGTH))) {
        packagesLocation.push(getPackagesLocation(file));
      }
    } else if (path.basename(file) === PACKAGE_JSON) {
      packagesLocation.push(path.dirname(file));
    }
  }

  return packagesLocation.flat().sort();

}

const getUpdates = (cwd) => {
  return new Promise(resolve => {
    exec(CMD, { cwd }, (err, stdout, stderr) => {
      try {
        const updatesMap = JSON.parse(stdout);
        const updatesList = Object.entries(updatesMap).map(([name, state]) => ({ name, ...state }));

        const majorUpdates = updatesList.filter(({ wanted, latest }) => {
          return semver.diff(wanted, latest) === MAJOR;
        }).map(({ wanted, latest, name }) => ({
          wanted: semver.major(wanted),
          latest: semver.major(latest),
          name
        }));

        resolve({
          package: path.join(cwd, PACKAGE_JSON).slice(PREFIX_LENGTH),
          deps: majorUpdates
        });
      } catch (err) {
        console.log('Executing `npm outdated` failed:\n', stderr);
        reject(err);
      }
    });
  })
}

const getAllUpdates = async () => {
  const locations = getPackagesLocation(process.cwd());
  const updates = [];
  for (const location of locations) {
    updates.push(await getUpdates(location));
  }
  return updates.filter(({ deps }) => deps.length);
}

module.exports = getAllUpdates;
