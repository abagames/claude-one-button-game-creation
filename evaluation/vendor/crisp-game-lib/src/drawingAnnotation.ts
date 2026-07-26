import { Color } from "./color";
import { VectorLike } from "./vector";

export type DrawingDescriptor = {
  type: string;
  id: string | number;
};

export type DrawingObjectReference = {
  type: string;
  object: object;
};

export type DrawingSubject = string | DrawingDescriptor | DrawingObjectReference | object;

export type DrawingSourceKind =
  | "rect"
  | "box"
  | "bar"
  | "line"
  | "arc"
  | "char"
  | "text";

export type DrawingSubjectIdentity =
  | { kind: "group"; label: string }
  | { kind: "descriptor"; type: string; id: string | number }
  | { kind: "object"; type?: string; episodeRef: number };

export type DrawingHitBoxRecord = {
  source: DrawingSourceKind;
  drawIndex: number;
  pos: { x: number; y: number };
  size: { x: number; y: number };
  visible: boolean;
  color?: Color | number;
  subject: DrawingSubjectIdentity | null;
};

export type DrawingDiagnosticCode =
  | "nested_begin"
  | "end_without_begin"
  | "invalid_subject"
  | "scope_left_open"
  | "frame_reentered"
  | "record_outside_frame";

export type DrawingDiagnostic = {
  code: DrawingDiagnosticCode;
  frameSequence: number;
};

export type DrawingFrameSnapshot = {
  frameSequence: number;
  records: DrawingHitBoxRecord[];
  diagnostics: DrawingDiagnostic[];
};

let enabled = false;
let frameOpen = false;
let frameSequence = -1;
let drawIndex = 0;
let activeSubject: DrawingSubjectIdentity | null = null;
let objectIds = new WeakMap<object, number>();
let nextObjectId = 1;
let records: DrawingHitBoxRecord[] = [];
let diagnostics: DrawingDiagnostic[] = [];
let pendingDiagnostics: DrawingDiagnostic[] = [];
let lastFrame: DrawingFrameSnapshot | null = null;

export function setEnabled(value: boolean) {
  enabled = value;
  if (!enabled) {
    frameOpen = false;
    activeSubject = null;
    records = [];
    diagnostics = [];
    pendingDiagnostics = [];
    lastFrame = null;
  }
}

export function isEnabled() {
  return enabled;
}

export function resetEpisodeIdentity() {
  objectIds = new WeakMap<object, number>();
  nextObjectId = 1;
}

export function beginFrame() {
  if (!enabled) {
    return;
  }
  if (frameOpen) {
    addDiagnostic("frame_reentered");
    finishFrame();
  }
  frameSequence++;
  frameOpen = true;
  drawIndex = 0;
  activeSubject = null;
  records = [];
  diagnostics = pendingDiagnostics;
  pendingDiagnostics = [];
}

export function endFrame() {
  if (!enabled || !frameOpen) {
    return;
  }
  if (activeSubject != null) {
    addDiagnostic("scope_left_open");
    activeSubject = null;
  }
  finishFrame();
}

export function beginDrawing(subject: DrawingSubject) {
  if (!enabled) {
    return;
  }
  if (activeSubject != null) {
    addDiagnostic("nested_begin");
    return;
  }
  const identity = resolveSubject(subject);
  if (identity == null) {
    addDiagnostic("invalid_subject");
    return;
  }
  activeSubject = identity;
}

export function endDrawing() {
  if (!enabled) {
    return;
  }
  if (activeSubject == null) {
    addDiagnostic("end_without_begin");
    return;
  }
  activeSubject = null;
}

export function recordHitBox(
  source: DrawingSourceKind,
  pos: VectorLike,
  size: VectorLike,
  visible: boolean,
  color?: Color | number
) {
  if (!enabled) {
    return;
  }
  if (!frameOpen) {
    addDiagnostic("record_outside_frame");
    return;
  }
  records.push({
    source,
    drawIndex: drawIndex++,
    pos: { x: pos.x, y: pos.y },
    size: { x: size.x, y: size.y },
    visible,
    color,
    subject: cloneSubject(activeSubject),
  });
}

export function getLastFrame(): DrawingFrameSnapshot | null {
  return lastFrame == null ? null : cloneFrame(lastFrame);
}

function finishFrame() {
  lastFrame = cloneFrame({ frameSequence, records, diagnostics });
  frameOpen = false;
  activeSubject = null;
  records = [];
  diagnostics = [];
}

function resolveSubject(
  subject: DrawingSubject
): DrawingSubjectIdentity | null {
  if (typeof subject === "string") {
    return { kind: "group", label: subject };
  }
  if ((typeof subject !== "object" && typeof subject !== "function") || subject == null) {
    return null;
  }
  const candidate = subject as { type?: unknown; id?: unknown; object?: unknown };
  if (
    typeof candidate.type === "string" &&
    (typeof candidate.id === "string" || typeof candidate.id === "number")
  ) {
    return {
      kind: "descriptor",
      type: candidate.type,
      id: candidate.id,
    };
  }
  if (
    typeof candidate.type === "string" &&
    ((typeof candidate.object === "object" && candidate.object != null) ||
      typeof candidate.object === "function")
  ) {
    return {
      kind: "object",
      type: candidate.type,
      episodeRef: getEpisodeRef(candidate.object as object),
    };
  }
  return { kind: "object", episodeRef: getEpisodeRef(subject) };
}

function getEpisodeRef(subject: object): number {
  let episodeRef = objectIds.get(subject);
  if (episodeRef == null) {
    episodeRef = nextObjectId++;
    objectIds.set(subject, episodeRef);
  }
  return episodeRef;
}

function addDiagnostic(code: DrawingDiagnosticCode) {
  const destination = frameOpen ? diagnostics : pendingDiagnostics;
  destination.push({ code, frameSequence });
}

function cloneSubject(
  subject: DrawingSubjectIdentity | null
): DrawingSubjectIdentity | null {
  return subject == null ? null : { ...subject };
}

function cloneFrame(frame: DrawingFrameSnapshot): DrawingFrameSnapshot {
  return {
    frameSequence: frame.frameSequence,
    records: frame.records.map((record) => ({
      ...record,
      pos: { ...record.pos },
      size: { ...record.size },
      subject: cloneSubject(record.subject),
    })),
    diagnostics: frame.diagnostics.map((diagnostic) => ({ ...diagnostic })),
  };
}
