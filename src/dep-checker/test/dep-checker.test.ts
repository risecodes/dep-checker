import { PACKAGE_FILE } from '../../../jest/const';
import { fakeModules, PATCH, MINOR, MAJOR } from './const';

const mockGetUpdates = jest.fn(() => Object.values(fakeModules));

const reloadChecker = async (level: string) => {
  process.env.INPUT_LEVEL = level;

  const DepChecker = (await import('..')).default;
  return new DepChecker({
    packageFilename: PACKAGE_FILE,
  }, mockGetUpdates);
};

describe('DepChecker.getAvailableUpdates', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('Basic logic', () => {
    it('Returns object with list of modules to be updated', async () => {
      const testChecker = await reloadChecker(PATCH);
      const [{ packagePath, modules }] = testChecker.getAvailableUpdates();
      expect(modules).toEqual(Object.values(fakeModules));
      expect(packagePath).toEqual(PACKAGE_FILE);
    });
  });

  describe('SemVer levels', () => {
    it('Retruns only major updates', async () => {
      const testChecker = await reloadChecker(MAJOR);
      const [{ modules }] = testChecker.getAvailableUpdates();
      expect(modules).toEqual([fakeModules.major]);
    });
    it('Retruns only minor + major updates', async () => {
      const testChecker = await reloadChecker(MINOR);
      const [{ modules }] = testChecker.getAvailableUpdates();
      expect(modules).toEqual([fakeModules.minor, fakeModules.major]);
    });
    it('Retruns all patch + minor + major updates', async () => {
      const testChecker = await reloadChecker(PATCH);
      const [{ modules }] = testChecker.getAvailableUpdates();
      expect(modules).toEqual([fakeModules.patch, fakeModules.minor, fakeModules.major]);
    });
  });
});
