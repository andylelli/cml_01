import { afterEach, describe, expect, it, vi } from "vitest";
import { buildEraConstraints } from "../shared/constraints.js";

const FLAG = "AGENT1_PERIOD_KB_ENABLED";

afterEach(() => {
  delete process.env[FLAG];
  vi.restoreAllMocks();
});

describe("Agent 1 Phase 1 — AGENT1_PERIOD_KB_ENABLED flag on buildEraConstraints", () => {
  it("default (flag unset) returns the legacy string — no KB marker, byte-identical shape", () => {
    delete process.env[FLAG];
    const out = buildEraConstraints("1930s");
    expect(out).toContain("1930s Era Constraints:");
    expect(out).not.toContain("period-kb"); // legacy path, untouched
  });

  it('"off" is explicitly the legacy path', () => {
    process.env[FLAG] = "off";
    expect(buildEraConstraints("1930s")).not.toContain("period-kb");
  });

  it('"shadow" returns the legacy artifact (never affects output) but logs a diff', () => {
    process.env[FLAG] = "shadow";
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const out = buildEraConstraints("1930s");
    expect(out).not.toContain("period-kb"); // live artifact is still legacy
    expect(info).toHaveBeenCalledOnce();
    expect(info.mock.calls[0][0]).toContain("[agent1-period-kb][shadow]");
  });

  it('"on" returns the KB-backed string (carries the period-kb provenance marker)', () => {
    process.env[FLAG] = "on";
    const out = buildEraConstraints("1930s");
    expect(out).toContain("1930s Era Constraints");
    expect(out).toContain("period-kb");
  });

  it('"on" serves every legacy decade from the KB (no silent default)', () => {
    process.env[FLAG] = "on";
    for (const decade of ["1920s", "1930s", "1940s", "1950s", "1960s"]) {
      const out = buildEraConstraints(decade);
      expect(out, decade).toContain(`${decade} Era Constraints`);
      expect(out, decade).toContain("period-kb");
    }
  });

  it('"on" with an unseeded decade falls back without throwing (explicit nearest-anchor, logged)', () => {
    process.env[FLAG] = "on";
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => buildEraConstraints("1910s")).not.toThrow();
    // garbage decade is unparseable by the KB bridge -> legacy fallback, still no throw
    expect(() => buildEraConstraints("not-a-decade")).not.toThrow();
  });
});
