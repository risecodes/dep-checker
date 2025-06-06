import { AxiosError } from 'axios';
import * as core from '@actions/core';

import sendReport from './report';
import packageSystems from './package-systems';
import { printAxiosError } from './utils';

const main = async () => {
  const updatesPromises = packageSystems.map(checker => checker.getAvailableUpdates());
  const updates = await Promise.all(updatesPromises).then(updates => updates.flat());
  if (updates.length) {
    core.info('Found updates:');
    core.info(JSON.stringify(updates, null, 2));
    await sendReport(updates);
  } else {
    core.info('Everything is up-do-date');
  }
};

main()
  .catch((error) => {
    if (error instanceof AxiosError) printAxiosError(error);
    core.setFailed(error.stack);
  });
