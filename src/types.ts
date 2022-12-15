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

export interface INPMModule {
  current?: string,
  wanted: string,
  latest: string,
  dependent: string,
  location?: string
}

export interface IGoModule {
  Path: string;
  Main?: boolean;
  GoMod?: string;
  GoVersion?: string;
  Version?: string;
  Time?: string;
  Indirect?: boolean;
  Update?: {
    Path: string;
    Version: string;
    Time: string;
  };
  Replace?: {
    Path: string;
    Dir: string;
    GoMod: string;
    GoVersion: string;
  };
}
