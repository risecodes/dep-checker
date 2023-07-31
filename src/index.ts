import * as core from '@actions/core';
import sendReport from './report';

import packageSystems from './package-systems';


const main = async () => {
  const updates = packageSystems
    .map(checker => checker.getAvailableUpdates())
    .flat();

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
