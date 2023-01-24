import path from 'node:path';
import { IUpdate, IUpdates } from '../types';
import { filterSemverLevel } from './utils';
import * as core from '@actions/core';
import { glob } from 'glob';



interface IParams {
  packageFile: string;
  ignore?: string[];
}

type TGetUpdates = (cwd: string) => IUpdate[];

class DepChecker {
  packageFile: string;
  ignore?: string[];
  getUpdates: TGetUpdates;

  constructor(parameters: IParams, getUpdates: TGetUpdates) {
    this.packageFile = parameters.packageFile;
    this.ignore = parameters.ignore;
    this.getUpdates = getUpdates;
  }


  getAvailableUpdates(): IUpdates[] {
    const configs = glob.sync(`**/${this.packageFile}`, { ignore: this.ignore });
    const updates: IUpdates[] = [];
    for (const configFile of configs) {
      core.info(`Scanning ${configFile} ...`);
      const location = path.dirname(configFile);
      const update = this.getUpdates(location);
      const modules = update.filter(state => filterSemverLevel(state));
      if (update.length) {
        updates.push({ configFile, modules });
      }
    }
    return updates;
  }

}

export default DepChecker;
