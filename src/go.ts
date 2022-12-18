import path from "node:path";
import { exec } from "node:child_process";
import { glob } from "glob";
import * as core from "@actions/core";
import { IGoModule, IUpdate, IUpdates } from "./types";
import { filterSemverLevel } from "./utils";
import { DEP_CHECKER_IGNORE } from "./constants";


const CMD = "go list -u -m -e -json all";
const GO_MOD = 'go.mod';
const IGNORE = DEP_CHECKER_IGNORE?.split(/\s+/) || [];

const parseModules = (stdout: string): IUpdate[] => {
  return stdout.trim()
    .split(/\n(?=\{)/) // Split list of objects
    .map(obj => {
      const module = JSON.parse(obj) as IGoModule;
      if (module.Error) core.warning(module.Error.Err);
      return module;
    })
    .filter(module => {
      return !module.Indirect && module.Update?.Version && module.Version;
    })
    .map(({ Path, Version, Update }) => ({
      name: Path,
      wanted: Version!,
      latest: Update?.Version!
    }));
};

const getUpdates = (cwd: string): Promise<IUpdates> => {
  return new Promise((resolve, reject) => {
    exec(CMD, { cwd }, (err, stdout, stderr) => {
      try {
        const updatesList = parseModules(stdout);
        resolve({
          configFile: path.join(cwd, GO_MOD),
          modules: updatesList.filter(state => filterSemverLevel(state))
        });
      } catch (err) {
        core.error(`Command \`${CMD}\` failed:`);
        core.error(stderr);
        reject(err);
      }
    });
  });
};

const getAllUpdates = async () => {
  const configs = glob.sync(`**/${GO_MOD}`, { ignore: IGNORE });
  const updates: IUpdates[] = [];
  for (const configFile of configs) {
    const location = path.dirname(configFile);
    console.log(`Scanning ${configFile} ...`);
    const update = await getUpdates(location);
    if (update.modules.length) {
      updates.push(update);
    }
  }
  return updates;
};

export default getAllUpdates;
