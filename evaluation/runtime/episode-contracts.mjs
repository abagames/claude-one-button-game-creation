import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { validateInputSequence } from "./input-sequence.mjs";

const inputSchema = readSchema("input-sequence.v1.schema.json");
const requestSchema = readSchema("episode-run-request.v0.schema.json");
const resultSchema = readSchema("private-episode-result.v0.schema.json");
const ajv = new Ajv2020({ allErrors: true, strict: true });
ajv.addSchema(inputSchema);
const validateRequestSchema = ajv.compile(requestSchema);
const validateResultSchema = ajv.compile(resultSchema);

export function validateEpisodeRequest(value) {
  const errors = schemaErrors(validateRequestSchema, value);
  errors.push(...validateInputSequence(value?.input_sequence));
  return [...new Set(errors)];
}

export function assertValidEpisodeRequest(value) {
  const errors = validateEpisodeRequest(value);
  if (errors.length > 0) throw new Error(`Invalid episode request: ${errors.join("; ")}`);
  return value;
}

export function validatePrivateEpisodeResult(value) {
  return schemaErrors(validateResultSchema, value);
}

export function assertValidPrivateEpisodeResult(value) {
  const errors = validatePrivateEpisodeResult(value);
  if (errors.length > 0) throw new Error(`Invalid private episode result: ${errors.join("; ")}`);
  return value;
}

function schemaErrors(validate, value) {
  if (validate(value)) return [];
  return (validate.errors ?? []).map((error) => `${error.instancePath} ${error.message}`);
}

function readSchema(name) {
  return JSON.parse(
    fs.readFileSync(fileURLToPath(new URL(`../schemas/${name}`, import.meta.url)), "utf8")
  );
}
