import fs from "node:fs";
import { artifactContractKinds, validateArtifact } from "../runtime/index.mjs";

const [kind, inputPath] = process.argv.slice(2);
if (kind == null || inputPath == null) {
  throw new Error(`Usage: node scripts/validate-artifact.mjs <${artifactContractKinds.join("|")}> <artifact.json>`);
}
const value = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const errors = validateArtifact(kind, value);
process.stdout.write(`${JSON.stringify({ kind, valid: errors.length === 0, errors }, null, 2)}\n`);
if (errors.length > 0) process.exitCode = 1;
