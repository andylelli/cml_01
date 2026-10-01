import { afterEach, describe, expect, it } from "vitest";

import { envNotOff, envOn } from "../jobs/env-flags.js";

/**
 * CR-22 — envOn / envNotOff are the two inline idioms they replaced, verbatim: the same words, no trim.
 * Since owner decision 9 (ORC-Q05) both read @cml/cml's one vocabulary, trimmed; anything else is the default.
 */
const NAME = "CR22_ENV_FLAGS_TEST";
const VALUES = [undefined, "", "1", "true", "TRUE", "yes", "On", "0", "false", "No", "OFF", " 1", "enabled", "y", "n"];
afterEach(() => { delete process.env[NAME]; });

describe("env-flags", () => {
  for (const value of VALUES) {
    it(`reads ${JSON.stringify(value)} in the one vocabulary (owner decision 9)`, () => {
      if (value === undefined) delete process.env[NAME]; else process.env[NAME] = value;
      const v = (process.env[NAME] ?? "").trim();
      expect(envOn(NAME)).toBe(/^(1|true|yes|on)$/i.test(v));
      expect(envNotOff(NAME)).toBe(!/^(0|false|no|off)$/i.test(v));
    });
  }
});
