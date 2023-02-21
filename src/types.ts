export enum SemverLevels {
  patch,
  minor,
  major,
}

export type TSemverLevel = keyof typeof SemverLevels

export interface IModuleUpdate {
  name: string;
  wanted: string;
  latest: string;
}

export interface IPackageUpdates {
  packagePath: string,
  modules: IModuleUpdate[]
}

export interface IJiraTicketFields {
  summary: string;
  description: string;
  project: { key: string };
  issuetype: { name: string };
  parent?: { key: string };
}

export interface IJiraTicket {
  id: string;
  self: string;
  key: string;
  fields: IJiraTicketFields;
}
