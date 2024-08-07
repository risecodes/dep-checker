import { diff } from 'semver';
import { LEVEL } from '../config';
import { IModuleUpdate, SemverLevels, TSemverLevel } from '../types';

export const filterSemverLevel = (state: IModuleUpdate) => {
  const val = diff(state.wanted, state.latest) as TSemverLevel;
  return val && val in SemverLevels && SemverLevels[val] >= SemverLevels[LEVEL];
};
