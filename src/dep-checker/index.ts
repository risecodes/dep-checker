import path from 'node:path';
import { IModuleUpdate, IPackageUpdates } from '../types';
import { filterSemverLevel } from './utils';
import * as core from '@actions/core';
import { glob } from 'glob';



interface IParams {
  packageFilename: string;
  ignore?: string[];
}

type TGetUpdates = (cwd: string) => IModuleUpdate[];

class DepChecker {
  packageFilename: string;
  ignore?: string[];
  getUpdates: TGetUpdates;

  constructor(parameters: IParams, getUpdates: TGetUpdates) {
    this.packageFilename = parameters.packageFilename;
    this.ignore = parameters.ignore;
    this.getUpdates = getUpdates;
  }


  getAvailableUpdates(): IPackageUpdates[] {
    const configs = glob.sync(`**/${this.packageFilename}`, { ignore: this.ignore });
    const updates: IPackageUpdates[] = [];
    for (const packagePath of configs) {
      core.info(`Scanning ${packagePath} ...`);
      const location = path.dirname(packagePath);
      const update = this.getUpdates(location);
      const modules = update.filter(state => filterSemverLevel(state));
      if (modules.length) {
        updates.push({ packagePath, modules });
      }
    }
    return updates;
  }

}

export default DepChecker;
