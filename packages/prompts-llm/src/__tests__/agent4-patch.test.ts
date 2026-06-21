import { describe, expect, it } from "vitest";
import { validateCml } from "@cml/cml";
import {
  applyPatchInCode,
  getAtPath,
  parseErrorPath,
  patchCmlNode,
  pathToString,
  setAtPath,
  validateContract,
  type CmlDoc,
  type Validator,
} from "../agent4-patch.js";

// ── path addressing (pure) ───────────────────────────────────────────────────

describe("parseErrorPath / get / set", () => {
  it("parses dotted + indexed validateCml error paths", () => {
    expect(parseErrorPath("CASE.meta.crime_class.category must be one of murder, theft")).toEqual([
      "CASE", "meta", "crime_class", "category",
    ]);
    expect(parseErrorPath("CASE.inference_path.steps[2].required_evidence[0] is too abstract")).toEqual([
      "CASE", "inference_path", "steps", 2, "required_evidence", 0,
    ]);
    expect(parseErrorPath("Payload must be an object")).toBeNull();
  });

  it("get/set round-trip and pathToString", () => {
    const doc = { CASE: { cast: [{ name: "A" }, { name: "B" }] } } as CmlDoc;
    expect(getAtPath(doc, ["CASE", "cast", 1, "name"])).toBe("B");
    expect(setAtPath(doc, ["CASE", "cast", 1, "name"], "Z")).toBe(true);
    expect(getAtPath(doc, ["CASE", "cast", 1, "name"])).toBe("Z");
    expect(setAtPath(doc, ["CASE", "nope", "x"], 1)).toBe(false);
    expect(pathToString(["CASE", "inference_path", "steps", 2, "required_evidence", 0])).toBe(
      "CASE.inference_path.steps[2].required_evidence[0]",
    );
  });

  it("applyPatchInCode mutates ONLY the target node — every other node is byte-identical", () => {
    const doc = { CASE: { meta: { title: "T" }, cast: [{ name: "A", age: 40 }, { name: "B" }] } } as CmlDoc;
    const patched = applyPatchInCode(doc, ["CASE", "cast", 0, "name"], "Z")!;
    expect(getAtPath(patched, ["CASE", "cast", 0, "name"])).toBe("Z");
    // input untouched (no in-place mutation)
    expect(getAtPath(doc, ["CASE", "cast", 0, "name"])).toBe("A");
    // every sibling node identical
    expect(getAtPath(patched, ["CASE", "meta"])).toEqual(getAtPath(doc, ["CASE", "meta"]));
    expect(getAtPath(patched, ["CASE", "cast", 0, "age"])).toBe(40);
    expect(getAtPath(patched, ["CASE", "cast", 1])).toEqual({ name: "B" });
  });
});

// ── orchestration + contract (mock validator) ────────────────────────────────

// A toy validator: title must be non-empty and must not contain "bad".
const mockValidator: Validator = (doc) => {
  const errors: string[] = [];
  const title = String(getAtPath(doc, ["CASE", "meta", "title"]) ?? "");
  if (!title) errors.push("CASE.meta.title is required");
  if (title.includes("bad")) errors.push("CASE.meta.title contains a forbidden word");
  const name = getAtPath(doc, ["CASE", "cast", 0, "name"]);
  if (name === "BAD") errors.push("CASE.cast[0].name is invalid");
  return { valid: errors.length === 0, errors };
};

describe("patchCmlNode — orchestration", () => {
  it("applies node-scoped patches until valid", async () => {
    const doc = { CASE: { meta: { title: "" }, cast: [{ name: "BAD" }] } } as CmlDoc;
    const propose = ({ path }: { path: (string | number)[] }) =>
      path.join(".") === "CASE.meta.title" ? "A Good Title" : "Good";
    const r = await patchCmlNode({ cml: doc, propose, validator: mockValidator });
    expect(r.validation.valid).toBe(true);
    expect(r.applied.map((a) => a.path).sort()).toEqual(["CASE.cast[0].name", "CASE.meta.title"]);
    expect(r.rejected).toEqual([]);
  });

  it("REJECTS a patch that fixes the target but introduces a NEW error (the §9.2 contract)", async () => {
    const doc = { CASE: { meta: { title: "" } } } as CmlDoc;
    const propose = () => "bad title"; // clears "is required" but trips "forbidden word"
    const r = await patchCmlNode({ cml: doc, propose, validator: mockValidator });
    expect(r.validation.valid).toBe(false);
    expect(r.applied).toEqual([]);
    expect(r.rejected[0].reason).toMatch(/new error/);
    // the original target error is still present (the bad patch was not applied)
    expect(r.validation.errors).toContain("CASE.meta.title is required");
  });

  it("skips unaddressable errors and never spins forever", async () => {
    const unaddressable: Validator = () => ({ valid: false, errors: ["Payload must be an object"] });
    const r = await patchCmlNode({ cml: { CASE: {} }, propose: () => "x", validator: unaddressable });
    expect(r.applied).toEqual([]);
    expect(r.rejected[0].reason).toMatch(/unaddressable/);
  });

  it("terminates (via skip) when the proposer can never fix the error", async () => {
    const doc = { CASE: { meta: { title: "" } } } as CmlDoc;
    const r = await patchCmlNode({ cml: doc, propose: () => "", validator: mockValidator, maxPatches: 20 });
    expect(r.validation.valid).toBe(false);
    expect(r.applied).toEqual([]); // "" never clears "is required"
  });
});

// ── integration with the REAL validateCml ────────────────────────────────────

describe("patchCmlNode — real validateCml (Spike A: patch beats rewrite, with contract)", () => {
  const fixture = (): CmlDoc => ({
    CML_VERSION: 2.0,
    CASE: { meta: { crime_class: { category: "homicide", subtype: "poisoning" } } },
  });

  it("a node patch fixes the enum error and introduces NO new failures (contract holds)", () => {
    const before = fixture();
    const catErr = validateCml(before).errors.find((e) => e.startsWith("CASE.meta.crime_class.category"))!;
    expect(catErr).toMatch(/must be one of/);
    const after = applyPatchInCode(before, ["CASE", "meta", "crime_class", "category"], "murder")!;
    const contract = validateContract(before, after, catErr);
    expect(contract.targetFixed).toBe(true);
    expect(contract.newlyFailing).toEqual([]);
    expect(contract.ok).toBe(true);
  });

  it("patchCmlNode fixes the targeted enum error without touching the other (real) errors", async () => {
    const before = fixture();
    const propose = ({ path }: { path: (string | number)[] }) =>
      pathToString(path) === "CASE.meta.crime_class.category" ? "murder" : undefined;
    const r = await patchCmlNode({ cml: before, propose });
    expect(r.applied.some((a) => a.path === "CASE.meta.crime_class.category")).toBe(true);
    // the enum error is gone…
    expect(r.validation.errors.some((e) => /crime_class\.category must be one of/.test(e))).toBe(false);
    // …and no patch ever introduced a new error (every applied patch passed the contract)
    const baselineErrors = new Set(validateCml(before).errors);
    for (const e of r.validation.errors) expect(baselineErrors.has(e)).toBe(true);
  });
});
