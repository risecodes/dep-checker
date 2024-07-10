export enum SemverLevels {
  patch,
  minor,
  major,
}

export type TSemverLevel = keyof typeof SemverLevels;

export interface IModuleUpdate {
  name: string;
  wanted: string;
  latest: string;
}

export interface IPackageUpdates {
  packagePath: string;
  modules: IModuleUpdate[];
}
