import { fakeModules, MAJOR, MINOR, PATCH } from './const';

const reloadUtil = async (level: string) => {
  process.env.INPUT_LEVEL = level;
  return (await import('../utils'));
};

describe('SemVer levels', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Retruns only major updates', async () => {
    const { filterSemverLevel } = await reloadUtil(MAJOR);
    const filterred = Object.values(fakeModules).filter(filterSemverLevel);
    expect(filterred).toEqual([fakeModules.major]);
  });
  it('Retruns only minor + major updates', async () => {
    const { filterSemverLevel } = await reloadUtil(MINOR);
    const filterred = Object.values(fakeModules).filter(filterSemverLevel);
    expect(filterred).toEqual([fakeModules.minor, fakeModules.major]);
  });
  it('Retruns all patch + minor + major updates', async () => {
    const { filterSemverLevel } = await reloadUtil(PATCH);
    const filterred = Object.values(fakeModules).filter(filterSemverLevel);
    expect(filterred).toEqual([fakeModules.patch, fakeModules.minor, fakeModules.major]);
  });
});
