import { afterEach, describe, expect, it, vi } from "vitest";
import { readBooleanFlag } from "../flags.js";

/** Owner decision 9 (ORC-Q05, 2026-10-01): one boolean-flag vocabulary, a warning on anything else. */
describe("readBooleanFlag", () => {
  afterEach(() => { vi.restoreAllMocks(); });

  it("reads 1|true|yes|on as on and 0|false|no|off as off, any case, trimmed", () => {
    for (const v of ["1", "true", "YES", " On "]) expect(readBooleanFlag("F", false, { F: v })).toBe(true);
    for (const v of ["0", "False", "no", "OFF "]) expect(readBooleanFlag("F", true, { F: v })).toBe(false);
  });

  it("an unset or empty flag is its default, silently", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(readBooleanFlag("F", true, {})).toBe(true);
    expect(readBooleanFlag("F", false, { F: "  " })).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });

  it("any other value — y, n, enabled — is the default, warned once per flag", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(readBooleanFlag("UNKNOWN_A", false, { UNKNOWN_A: "y" })).toBe(false);
    expect(readBooleanFlag("UNKNOWN_A", false, { UNKNOWN_A: "y" })).toBe(false);
    expect(readBooleanFlag("UNKNOWN_B", true, { UNKNOWN_B: "enabled" })).toBe(true);
    expect(warn).toHaveBeenCalledTimes(2);
    expect(String(warn.mock.calls[0][0])).toMatch(/UNKNOWN_A="y" is not a recognised value/);
  });
});
