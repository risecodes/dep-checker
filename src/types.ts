export enum SemverLevels {
  patch,
  minor,
  major,
}

export type TSemverLevel = keyof typeof SemverLevels

export interface IUpdate {
  name: string;
  wanted: string;
  latest: string;
}

export interface IUpdates {
  configFile: string,
  modules: IUpdate[]
}
