import crypto from "node:crypto";

export function verifyAnnotationOnlyDiff({ originalSource, instrumentedSource }) {
  if (typeof originalSource !== "string" || typeof instrumentedSource !== "string") {
    throw new Error("verifyAnnotationOnlyDiff requires originalSource and instrumentedSource strings");
  }
  const errors = [];
  if (/\bbeginDrawing\s*\(|\bendDrawing\s*\(/.test(originalSource)) {
    errors.push("original source already contains drawing annotation calls");
  }
  const output = [];
  let open = false;
  let scopeCount = 0;
  for (const line of linesWithEndings(instrumentedSource)) {
    const body = line.replace(/(?:\r\n|\n|\r)$/, "");
    const trimmed = body.trim();
    if (isBeginLine(trimmed)) {
      if (open) errors.push("nested beginDrawing scope");
      open = true;
      scopeCount++;
      continue;
    }
    if (trimmed === "endDrawing();") {
      if (!open) errors.push("endDrawing without matching beginDrawing");
      open = false;
      continue;
    }
    if (/\bbeginDrawing\s*\(|\bendDrawing\s*\(/.test(body)) {
      errors.push("annotation call must occupy its own single line");
    }
    output.push(line);
  }
  if (open) errors.push("unclosed beginDrawing scope");
  if (scopeCount === 0) errors.push("instrumented source contains no annotation scopes");
  const reconstructed = output.join("");
  if (reconstructed !== originalSource) errors.push("non-annotation source difference detected");
  return Object.freeze({
    passed: errors.length === 0,
    inserted_scope_count: scopeCount,
    non_annotation_diff_count: reconstructed === originalSource ? 0 : 1,
    original_sha256: sha256(originalSource),
    instrumented_sha256: sha256(instrumentedSource),
    reconstructed_sha256: sha256(reconstructed),
    errors,
  });
}

// A begin line must be exactly one `beginDrawing(<arguments>);` call statement. Argument text may contain
// quoted `;` but never a bare one, so a smuggled second statement such as
// `beginDrawing({ type: "player", object: p }); addScore(999);` can never be mistaken for an annotation line.
const BEGIN_DRAWING_LINE = /^beginDrawing\((?:[^;"'`]|"[^"\n]*"|'[^'\n]*'|`[^`\n]*`)+\);$/;

function isBeginLine(value) {
  return BEGIN_DRAWING_LINE.test(value);
}

function linesWithEndings(value) {
  return value.match(/[^\r\n]*(?:\r\n|\n|\r|$)/g).filter((line, index, values) => (
    line.length > 0 || index < values.length - 1
  ));
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
