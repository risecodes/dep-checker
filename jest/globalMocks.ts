import * as core from '@actions/core'


jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
  switch (name) {
  case 'level': return 'major';
  default: return 'something';
  }
});


process.env.GITHUB_REPOSITORY = 'fake-owner/fake-repo';
process.env.GITHUB_REF_NAME = 'test';

// import * as s3json from '../src/utils/s3json';

// import rules from '../src/modules/filtration/test/mock/rules.json';
// import { IRules } from '../src/modules/filtration/types';

// jest.spyOn(s3json, 'initRules').mockImplementation(async () => {
//   return;
// })

// jest.spyOn(s3json, 'getRules').mockImplementation(() => rules as IRules);
