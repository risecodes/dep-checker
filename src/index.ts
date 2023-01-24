import * as core from '@actions/core';
import NPMChecker from './dep-checker/npm';
import GoChecker from './dep-checker/go';
import sendReport from './report';


const main = async () => {
  const updates = [NPMChecker, GoChecker].map(checker => checker.getAvailableUpdates());
  const allModules = updates.filter(u => u.length).flat();
  core.info(JSON.stringify(allModules, null, 2));
  await sendReport(allModules);
};

main()
  .catch(error => {
    core.setFailed(error.stack);
  });
