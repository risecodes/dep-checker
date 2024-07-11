import { writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import * as core from '@actions/core';
import { IModuleUpdate } from '../types';
import { IGNORE } from '../config';
import DepChecker from '../dep-checker';
import { execFilePromise } from '../utils';

const GO_MOD = 'go.mod';
const CMD_ARGS = ['list', '-u', '-m', '-e', '-json', 'all'];
const NETRC_PATH = `${homedir()}/.netrc`;

interface IGoModule {
  Path: string;
  Main?: boolean;
  GoMod?: string;
  GoVersion?: string;
  Time?: string;
  Indirect?: boolean;
  Version?: string;
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
  Error?: {
    Err: string;
  };
}

const NETRC_CONFIG = core.getInput('netrc');
writeFileSync(NETRC_PATH, NETRC_CONFIG);

export const getUpdates = async (cwd: string): Promise<IModuleUpdate[]> => {
  const { stdout, stderr } = await execFilePromise('go', CMD_ARGS, { cwd, encoding: 'utf8' });
  if (stderr) throw new Error(stderr);

  return stdout.trim()
    .split(/\n(?=\{)/) // Split list of objects
    .map((obj) => {
      const module = JSON.parse(obj) as IGoModule;
      if (module.Error) core.warning(module.Error.Err);
      return module;
    })
    .filter((module): module is Required<Pick<IGoModule, 'Path' | 'Version' | 'Update'>> => {
      return !module.Indirect && !!module.Update?.Version && !!module.Version;
    })
    .map(({ Path, Version, Update }) => ({
      name: Path,
      wanted: Version,
      latest: Update?.Version,
    }));
};

const GoChecker = new DepChecker({
  packageFilename: GO_MOD,
  ignore: IGNORE,
  getUpdates,
});

export default GoChecker;
