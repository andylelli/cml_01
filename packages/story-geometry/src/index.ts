/**
 * @cml/story-geometry — Agent 7.5, the Story Geometry compiler.
 *
 * Derives a small, machine-checkable contract for the finished manuscript — two times, one clincher,
 * the method's signature in chapter one, and what each of the load-bearing chapters must and must not
 * contain — checks it against the OUTLINE before a prose token is spent, and re-checks it against the
 * finished text as an acceptance test whose failures become regeneration feedback rather than pasted
 * sentences.
 *
 * It owns no clue, no scene assignment, and no sentence: the plant schedule stays with
 * `@cml/beat-scheduler`, the clue set with `@cml/clue-spec`, solvability with Agent 6, and prose with
 * Agent 9. See architecture/GEOMETRY-AGENT-DESIGN.md and architecture/STORY-GEOMETRY.md.
 */

export type {
  ChapterContract,
  ChapterRole,
  ClearanceBudget,
  Clincher,
  FalseSolutionGeometry,
  GeometryAcceptanceOptions,
  GeometryAcceptanceReport,
  GeometryChapter,
  GeometryCheck,
  GeometryClue,
  GeometryDeriveInput,
  GeometryField,
  GeometryGrid,
  GeometryOutline,
  GeometryResolution,
  GeometryScene,
  GeometryClosure,
  GeometryUnmet,
  GeometryViolation,
  MethodSignature,
  StoryGeometry,
  TimeModel,
} from "./types.js";

export {
  caseOf,
  checkRevealBinding,
  deathMethodSignatureTerms,
  deriveStoryGeometry,
  flattenScenes,
  resolveRevealChapter,
  roleOf,
  selectClincherClue,
  summariseTrace,
} from "./derive.js";

export { checkGeometryClosure } from "./closure.js";
export {
  accusationConfirmedDisclosure,
  chapterIndexFor,
  chapterScopedViolations,
  checkManuscriptGeometry,
  detectAftermathRepeatParagraphs,
  detectPrematureCulpritDisclosure,
  disclosureMatcher,
  findManuscriptDisclosure,
  foldTypography,
  nameMatcher,
  namesCulpritAsGuilty,
} from "./accept.js";
export { applyGeometryOutlineRepair, type GeometryRepairResult } from "./repair.js";
export {
  GEOMETRY_CODES_WITHOUT_PROSE_REPAIR,
  GEOMETRY_CODES_WITH_OWN_PASS,
  GEOMETRY_VIOLATION_CODES,
  type GeometryViolationCode,
} from "./codes.js";
export {
  buildGeometryChapterBlock,
  buildGeometryRunBlocks,
  type GeometryPromptBlock,
} from "./prompt.js";
