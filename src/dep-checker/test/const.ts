import { SemverLevels } from '../../types';

export const PATCH = SemverLevels[0];
export const MINOR = SemverLevels[1];
export const MAJOR = SemverLevels[2];

export const fakeModules = {
  patch: { name: 'updatePatch', wanted: '1.0.0', latest: '1.0.1' },
  minor: { name: 'updateMinor', wanted: '1.0.0', latest: '1.1.0' },
  major: { name: 'updateMajor', wanted: '1.0.0', latest: '2.0.0' },
};
