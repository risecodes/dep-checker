import path from "node:path";
import { exec } from "node:child_process";
import { glob } from "glob";
import { IGoModule, IUpdate, IUpdates } from "./types";
import { filterSemverLevel } from "./utils";


// const CMD = "go list -u -m -f '{{if and (not (or .Indirect .Main)) .Update}}{{.}}{{end}}' all";
const CMD = "go list -u -m -json all";
const GO_MOD = 'go.mod';

const parseModules = (stdout: string): IUpdate[] => {
  return stdout.trim()
    .split(/\n(?=\{)/) // Split list of objects
    .map(obj => JSON.parse(obj) as IGoModule)
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
        console.log(`Executing \`${CMD}\` failed:`);
        console.log(stderr);
        reject(err);
      }
    });
  });
};

const getAllUpdates = async () => {
  const locations = glob.sync(`**/${GO_MOD}`).map(pl => path.dirname(pl));
  const updates: IUpdates[] = [];
  for (const location of locations) {
    console.log(`Entering ${location} ...`);
    const update = await getUpdates(location);
    if (update.modules.length) {
      console.log(`Found updates: ${JSON.stringify(update, null, 2)}`);
      updates.push(update);
    }
  }
  return updates;
};

export default getAllUpdates;
