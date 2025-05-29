import path from 'node:path';
import { IModuleUpdate, IPackageUpdates } from '../types';
import { filterSemverLevel } from './utils';
import * as core from '@actions/core';
import { glob } from 'glob';

interface IParams {
  packageFilename: string;
  ignore?: string[];
  getUpdates: TGetUpdates;
}

type TGetUpdates = (cwd: string) => Promise<IModuleUpdate[]>;

class DepChecker {
  packageFilename: string;
  ignore?: string[];
  getUpdates: TGetUpdates;

  constructor(params: IParams) {
    this.packageFilename = params.packageFilename;
    this.ignore = params.ignore;
    this.getUpdates = params.getUpdates;
  }

  async getAvailableUpdates(): Promise<IPackageUpdates[]> {
    const configs = await glob(`**/${this.packageFilename}`, { ignore: this.ignore });
    const updates: IPackageUpdates[] = [];
    for (const packagePath of configs) {
      core.info(`Scanning ${packagePath} ...`);
      const location = path.dirname(packagePath);
      const update = await this.getUpdates(location);
      const modules = update.filter(state => filterSemverLevel(state));
      if (modules.length) {
        updates.push({ packagePath, modules });
      }
    }
    return updates;
  }
}

export default DepChecker;
