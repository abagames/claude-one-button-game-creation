import fs from "node:fs";
import { verifyAnnotationOnlyDiff } from "../runtime/index.mjs";

const [originalPath, instrumentedPath, outputPath] = process.argv.slice(2);
if (originalPath == null || instrumentedPath == null) {
  throw new Error("Usage: node scripts/check-annotation-diff.mjs <original.js> <instrumented.js> [result.json]");
}
const result = verifyAnnotationOnlyDiff({
  originalSource: fs.readFileSync(originalPath, "utf8"),
  instrumentedSource: fs.readFileSync(instrumentedPath, "utf8"),
});
const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (outputPath == null) process.stdout.write(serialized);
else fs.writeFileSync(outputPath, serialized);
if (!result.passed) process.exitCode = 1;
