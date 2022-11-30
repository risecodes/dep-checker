const { exec } = require('node:child_process');
const semver = require('semver');

const CMD = 'npm outdated --json';
const MAJOR = 'major';


const getUpdates = () => {
  return new Promise(resolve => {
    exec(CMD, (err, stdout, stderr) => {
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

        resolve(majorUpdates);
      } catch (err) {
        console.log('Executing `npm outdated` failed:\n', stderr);
        reject(err);
      }
    });
  })
}

module.exports = getUpdates;
