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

export interface IGoModuleUpdate {
  Path: string;
  Version: string;
  Update: {
    Path: string;
    Version: string;
    Time: string;
  };
}

export interface IGoModule extends Partial<IGoModuleUpdate> {
  Main?: boolean;
  GoMod?: string;
  GoVersion?: string;
  Time?: string;
  Indirect?: boolean;
  Replace?: {
    Path: string;
    Dir: string;
    GoMod: string;
    GoVersion: string;
  };
  Error?: {
    Err: string;
  }
}
