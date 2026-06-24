import { afterEach, describe, expect, it } from "vitest";
import { escalateRetryTemperature } from "../client.js";

describe("escalateRetryTemperature — retry salt", () => {
  afterEach(() => {
    delete process.env.LLM_RETRY_TEMP_ESCALATION;
  });

  it("does not change the temperature on the first attempt (1-based)", () => {
    expect(escalateRetryTemperature(0.2, 1)).toBe(0.2);
    expect(escalateRetryTemperature(0.7, 0)).toBe(0.7);
  });

  it("escalates by a fixed step per retry", () => {
    expect(escalateRetryTemperature(0.2, 2)).toBeCloseTo(0.32, 5); // first retry
    expect(escalateRetryTemperature(0.2, 3)).toBeCloseTo(0.44, 5); // second retry
  });

  it("caps the escalated temperature so it never runs away", () => {
    expect(escalateRetryTemperature(0.7, 10)).toBe(0.9);
  });

  it("never returns below the base temperature", () => {
    expect(escalateRetryTemperature(0.85, 2)).toBeGreaterThanOrEqual(0.85);
  });

  it("can be disabled via LLM_RETRY_TEMP_ESCALATION=off", () => {
    process.env.LLM_RETRY_TEMP_ESCALATION = "off";
    expect(escalateRetryTemperature(0.2, 5)).toBe(0.2);
  });
});
