import * as core from '@actions/core';
import NPMChecker from './dep-checker/npm';
import GoChecker from './dep-checker/go';
import sendReport from './report';


const main = async () => {
  const updates = [NPMChecker, GoChecker]
    .map(checker => checker.getAvailableUpdates())
    .flat()
    .filter(({ modules }) => modules.length);

  if (updates.length) {
    core.info('Found updates:');
    core.info(JSON.stringify(updates, null, 2));
    await sendReport(updates);
  } else {
    core.info('Everything is up-do-date');
  }
};

main()
  .catch(error => {
    core.setFailed(error.stack);
  });
