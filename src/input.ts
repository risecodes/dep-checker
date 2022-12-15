import * as core from '@actions/core';
import { SemverLevels, TSemverLevel } from './types';

export const semverLevel = core.getInput('level') as TSemverLevel;

if (!(semverLevel in SemverLevels)) {
  throw new Error(`Invalid level "${semverLevel}", valid values are: major,minor,patch`);
}
