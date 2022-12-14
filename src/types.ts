export enum SemverLevels {
  patch,
  minor,
  major,
}

export type TSemverLevel = keyof typeof SemverLevels

export interface IUpdate {
  packageJson: string,
  deps: {
    name: string;
    wanted: string;
    latest: string;
  }[]
}

export interface IOutdated {
  current: string,
  wanted: string,
  latest: string,
  dependent: string,
  location: string
}
