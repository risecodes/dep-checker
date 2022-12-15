import { diff } from "semver";
import { semverLevel } from "./input";
import { IUpdate, SemverLevels, TSemverLevel } from "./types";


export const filterSemverLevel = (state: IUpdate) => {
  const val = diff(state.wanted, state.latest) as TSemverLevel;
  return val && val in SemverLevels && SemverLevels[val] >= SemverLevels[semverLevel];
}
