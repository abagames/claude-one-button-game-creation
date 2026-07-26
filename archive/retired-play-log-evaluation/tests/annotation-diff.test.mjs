import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { verifyAnnotationOnlyDiff } from "../runtime/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const original = [
  "function update() {",
  "  const collision = box(player.pos, 4);",
  "  if (collision.isColliding.rect.red) {",
  "    end();",
  "  }",
  "}",
  "",
].join("\n");

function instrumented(...lines) {
  return lines.join("\n");
}

test("annotation-only scopes reconstruct the original exactly", () => {
  const result = verifyAnnotationOnlyDiff({
    originalSource: original,
    instrumentedSource: instrumented(
      "function update() {",
      "  beginDrawing({ type: \"player\", object: player });",
      "  const collision = box(player.pos, 4);",
      "  endDrawing();",
      "  if (collision.isColliding.rect.red) {",
      "    end();",
      "  }",
      "}",
      "",
    ),
  });

  assert.equal(result.passed, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.inserted_scope_count, 1);
  assert.equal(result.non_annotation_diff_count, 0);
  assert.equal(result.reconstructed_sha256, result.original_sha256);
});

test("a statement smuggled onto the beginDrawing line fails closed", () => {
  const result = verifyAnnotationOnlyDiff({
    originalSource: original,
    instrumentedSource: instrumented(
      "function update() {",
      "  beginDrawing({ type: \"player\", object: player }); addScore(999);",
      "  const collision = box(player.pos, 4);",
      "  endDrawing();",
      "  if (collision.isColliding.rect.red) {",
      "    end();",
      "  }",
      "}",
      "",
    ),
  });

  assert.equal(result.passed, false);
  assert.equal(result.non_annotation_diff_count, 1);
  assert.ok(result.errors.includes("annotation call must occupy its own single line"));
  assert.notEqual(result.reconstructed_sha256, result.original_sha256);
});

test("a statement smuggled onto the endDrawing line fails closed", () => {
  const result = verifyAnnotationOnlyDiff({
    originalSource: original,
    instrumentedSource: instrumented(
      "function update() {",
      "  beginDrawing({ type: \"player\", object: player });",
      "  const collision = box(player.pos, 4);",
      "  endDrawing(); player.pos.x = clamp(player.pos.x, 0, 99);",
      "  if (collision.isColliding.rect.red) {",
      "    end();",
      "  }",
      "}",
      "",
    ),
  });

  assert.equal(result.passed, false);
  assert.ok(result.errors.includes("annotation call must occupy its own single line"));
});

test("quoted semicolons inside annotation arguments stay legal", () => {
  const result = verifyAnnotationOnlyDiff({
    originalSource: original,
    instrumentedSource: instrumented(
      "function update() {",
      "  beginDrawing({ type: \"player;primary\", object: player });",
      "  const collision = box(player.pos, 4);",
      "  endDrawing();",
      "  if (collision.isColliding.rect.red) {",
      "    end();",
      "  }",
      "}",
      "",
    ),
  });

  assert.equal(result.passed, true);
  assert.equal(result.inserted_scope_count, 1);
});

test("an empty beginDrawing call is not an annotation scope", () => {
  const result = verifyAnnotationOnlyDiff({
    originalSource: original,
    instrumentedSource: instrumented(
      "function update() {",
      "  beginDrawing();",
      "  const collision = box(player.pos, 4);",
      "  endDrawing();",
      "  if (collision.isColliding.rect.red) {",
      "    end();",
      "  }",
      "}",
      "",
    ),
  });

  assert.equal(result.passed, false);
});

test("nested, unclosed, and unmatched scopes fail closed", () => {
  const nested = verifyAnnotationOnlyDiff({
    originalSource: original,
    instrumentedSource: instrumented(
      "function update() {",
      "  beginDrawing({ type: \"player\", object: player });",
      "  beginDrawing({ type: \"hazard\", object: hazard });",
      "  const collision = box(player.pos, 4);",
      "  endDrawing();",
      "  endDrawing();",
      "  if (collision.isColliding.rect.red) {",
      "    end();",
      "  }",
      "}",
      "",
    ),
  });
  assert.equal(nested.passed, false);
  assert.ok(nested.errors.includes("nested beginDrawing scope"));

  const unclosed = verifyAnnotationOnlyDiff({
    originalSource: original,
    instrumentedSource: instrumented(
      "function update() {",
      "  beginDrawing({ type: \"player\", object: player });",
      "  const collision = box(player.pos, 4);",
      "  if (collision.isColliding.rect.red) {",
      "    end();",
      "  }",
      "}",
      "",
    ),
  });
  assert.equal(unclosed.passed, false);
  assert.ok(unclosed.errors.includes("unclosed beginDrawing scope"));

  const unmatched = verifyAnnotationOnlyDiff({
    originalSource: original,
    instrumentedSource: instrumented(
      "function update() {",
      "  const collision = box(player.pos, 4);",
      "  endDrawing();",
      "  if (collision.isColliding.rect.red) {",
      "    end();",
      "  }",
      "}",
      "",
    ),
  });
  assert.equal(unmatched.passed, false);
  assert.ok(unmatched.errors.includes("endDrawing without matching beginDrawing"));
});

test("gameplay edits outside annotation scopes fail closed", () => {
  const result = verifyAnnotationOnlyDiff({
    originalSource: original,
    instrumentedSource: instrumented(
      "function update() {",
      "  beginDrawing({ type: \"player\", object: player });",
      "  const collision = box(player.pos, 5);",
      "  endDrawing();",
      "  if (collision.isColliding.rect.red) {",
      "    end();",
      "  }",
      "}",
      "",
    ),
  });

  assert.equal(result.passed, false);
  assert.ok(result.errors.includes("non-annotation source difference detected"));
});

test("an already annotated original is rejected", () => {
  const result = verifyAnnotationOnlyDiff({
    originalSource: instrumented(
      "function update() {",
      "  beginDrawing({ type: \"player\", object: player });",
      "  const collision = box(player.pos, 4);",
      "  endDrawing();",
      "}",
      "",
    ),
    instrumentedSource: instrumented(
      "function update() {",
      "  beginDrawing({ type: \"player\", object: player });",
      "  const collision = box(player.pos, 4);",
      "  endDrawing();",
      "}",
      "",
    ),
  });

  assert.equal(result.passed, false);
  assert.ok(result.errors.includes("original source already contains drawing annotation calls"));
});

test("shipped fixture game pairs pass the annotation-only gate", () => {
  const gamesDirectory = path.join(root, "tests/fixtures/games");
  const gameIds = fs.readdirSync(gamesDirectory);
  assert.ok(gameIds.length >= 2, "fixture games must cover a positive and a negative control");
  for (const gameId of gameIds) {
    const result = verifyAnnotationOnlyDiff({
      originalSource: fs.readFileSync(path.join(gamesDirectory, gameId, "original/main.js"), "utf8"),
      instrumentedSource: fs.readFileSync(path.join(gamesDirectory, gameId, "instrumented/main.js"), "utf8"),
    });
    assert.deepEqual(result.errors, [], `${gameId} annotation diff errors`);
    assert.equal(result.passed, true, `${gameId} annotation-only gate`);
    assert.ok(result.inserted_scope_count >= 2, `${gameId} annotation scope count`);
  }
});
