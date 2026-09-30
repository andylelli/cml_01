import { afterEach, describe, expect, it } from "vitest";

import { envNotOff, envOn } from "../jobs/env-flags.js";

/**
 * CR-22 — envOn / envNotOff are the two inline idioms they replaced, verbatim: the same words, no trim.
 * A flag moved onto them keeps its vocabulary (R1); unifying vocabularies is ORC-Q05.
 */
const NAME = "CR22_ENV_FLAGS_TEST";
const VALUES = [undefined, "", "1", "true", "TRUE", "yes", "On", "0", "false", "No", "OFF", " 1", "enabled", "y", "n"];
afterEach(() => { delete process.env[NAME]; });

describe("env-flags", () => {
  for (const value of VALUES) {
    it(`reads ${JSON.stringify(value)} exactly as the inline idioms did`, () => {
      if (value === undefined) delete process.env[NAME]; else process.env[NAME] = value;
      expect(envOn(NAME)).toBe(/^(1|true|yes|on)$/i.test(process.env[NAME] ?? ""));
      expect(envNotOff(NAME)).toBe(!/^(0|false|no|off)$/i.test(process.env[NAME] ?? ""));
    });
  }
});
