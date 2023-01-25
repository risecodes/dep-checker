import DepChecker from '..';
import { SemverLevels } from '../../types';
import { PACKAGE_FILE } from '../../../jest/const';

const PATCH = SemverLevels[0];
const MINOR = SemverLevels[1];
const MAJOR = SemverLevels[2];

const fakeModules = {
  patch: { name: 'fakePatch', wanted: '1.0.0', latest: '1.0.1' },
  minor: { name: 'fakeMinor', wanted: '1.0.0', latest: '1.1.0' },
  major: { name: 'fakeMajor', wanted: '1.0.0', latest: '2.0.0' },
};

const mockGetUpdates = jest.fn(() => Object.values(fakeModules));

describe('DepChecker.getAvailableUpdates', () => {
  let testChecker: DepChecker;
  const setConfigs = async (level: string) => {
    process.env.INPUT_LEVEL = level;

    const DepChecker = (await import('..')).default;
    testChecker = new DepChecker({
      packageFilename: PACKAGE_FILE,
    }, mockGetUpdates);
  };


  beforeEach(() => {
    jest.resetModules();
  });

  describe('Basic logic', () => {
    it('Returns object with list of modules to be updated', async () => {
      await setConfigs(PATCH);
      const [{ packagePath, modules }] = testChecker.getAvailableUpdates();
      expect(modules).toHaveLength(3);
      expect(modules).toEqual(Object.values(fakeModules));
      expect(packagePath).toEqual(PACKAGE_FILE);
    });
  });

  describe('SemVer levels', () => {
    it('Retruns only major updates', async () => {
      await setConfigs(MAJOR);
      const [{ modules }] = testChecker.getAvailableUpdates();
      expect(modules).toHaveLength(1);
      expect(modules).toEqual([fakeModules.major]);
    });
    it('Retruns only minor + major updates', async () => {
      await setConfigs(MINOR);
      const [{ modules }] = testChecker.getAvailableUpdates();
      expect(modules).toHaveLength(2);
      expect(modules).toEqual([fakeModules.minor, fakeModules.major]);
    });
    it('Retruns all patch + minor + major updates', async () => {
      await setConfigs(PATCH);
      const [{ modules }] = testChecker.getAvailableUpdates();
      expect(modules).toHaveLength(3);
      expect(modules).toEqual([fakeModules.patch, fakeModules.minor, fakeModules.major]);
    });
  });
});
