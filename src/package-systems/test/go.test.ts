import { getUpdates } from '../go';
import { CWD } from './const';

const fakeModule = {
  Path: 'fake-module',
  Version: 'v1.0.0',
  Time: '2023-01-01T00:00:00Z',
  Update: {
    Path: 'example.com/fake-module',
    Version: 'v1.0.1',
    Time: '2023-01-01T00:00:00Z',
  },
};
const fakeIndirectModule = {
  Path: 'indirect-module',
  Version: 'v1.0.0',
  Time: '2023-01-01T00:00:00Z',
  Update: {
    Path: 'example.com/indirect-module',
    Version: 'v1.3.0',
    Time: '2023-01-01T00:00:00Z',
  },
  Indirect: true,
};
const fakeUpToDateModule = {
  Path: 'up-to-date-module',
  Version: 'v1.0.0',
  Time: '2023-01-01T00:00:00Z',
};

const cmdOutput = [
  fakeModule,
  fakeIndirectModule,
  fakeUpToDateModule,
].map(module => JSON.stringify(module, null, '\t')).join('\n');

jest.mock('node:child_process', () => {
  return {
    execFile: jest.fn((...args) => {
      const callback = args.pop();
      callback(null, {
        stdout: cmdOutput,
        stderr: '',
      });
    }),
  };
});

describe('GoChecker', () => {
  describe('getUpdates', () => {
    it('Returns modules list', async () => {
      const modules = await getUpdates(CWD);
      expect(modules).toHaveLength(1);
      expect(modules[0]).toEqual({
        name: fakeModule.Path,
        wanted: fakeModule.Version,
        latest: fakeModule.Update.Version,
      });
    });
  });
});
