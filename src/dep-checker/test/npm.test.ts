import { getUpdates } from '../npm';
import { CWD } from './const';

const fakeModuleName = 'fake-module';

const fakeModules = {
  [fakeModuleName]: {
    current: '1.0.0',
    wanted: '1.0.0',
    latest: '2.0.0',
    dependent: 'dep-checker',
    location: '/Users/user/dep-checker'
  }
};

jest.mock('node:child_process', () => {
  return {
    spawnSync: jest.fn(() => ({
      stdout: JSON.stringify(fakeModules, null, 2),
      stderr: '',
      error: null
    }))
  };
});

describe('NPMChecker', () => {
  describe('getUpdates', () => {
    it('Returns modules list', () => {
      const modules = getUpdates(CWD);
      expect(modules).toHaveLength(1);
      expect(modules[0]).toEqual({
        name: fakeModuleName,
        wanted: fakeModules[fakeModuleName].wanted,
        latest: fakeModules[fakeModuleName].latest,
      });
    });
  });
});
