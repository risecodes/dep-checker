import { getUpdates } from '../../package-systems/npm';
import { CWD } from './const';

const fakeModuleName = 'fake-module';
const wanted = '1.0.0';
const latest = '2.0.0';

const fakePkgJson = {
  dependencies: {
    [fakeModuleName]: wanted
  }
};

jest.mock('node:child_process', () => {
  return {
    execFile: jest.fn((...args) => {
      const callback = args.pop();
      callback(null, {
        stdout: JSON.stringify({ version: latest }, null, 2),
        stderr: '',
      });
    })
  };
});

jest.mock('node:fs', () => {
  return {
    readFileSync: jest.fn(() => JSON.stringify(fakePkgJson)),
    writeFileSync: jest.fn(),
  };
});

describe('NPMChecker', () => {
  describe('getUpdates', () => {
    it('Returns modules list', async () => {
      const modules = await getUpdates(CWD);
      expect(modules).toHaveLength(1);
      expect(modules[0]).toEqual({
        name: fakeModuleName,
        wanted: wanted,
        latest: latest,
      });
    });
  });
});
