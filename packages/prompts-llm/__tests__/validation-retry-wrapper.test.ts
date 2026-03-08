import { describe, expect, it, vi } from "vitest";
import { withValidationRetry } from "../src/utils/validation-retry-wrapper.js";

describe("withValidationRetry", () => {
  it("returns immediately when first attempt validates", async () => {
    const generateFn = vi.fn().mockResolvedValue({ result: { value: 1 }, cost: 0.25 });
    const validationFn = vi.fn().mockReturnValue({ valid: true, errors: [], warnings: [] });

    const result = await withValidationRetry({
      maxAttempts: 3,
      agentName: "Agent Test",
      generateFn,
      validationFn,
    });

    expect(generateFn).toHaveBeenCalledTimes(1);
    expect(validationFn).toHaveBeenCalledTimes(1);
    expect(result.attempts).toBe(1);
    expect(result.totalCost).toBe(0.25);
    expect(result.validationResult.valid).toBe(true);
    expect(result.result).toEqual({ value: 1 });
  });

  it("returns the actual last attempted result when retries are exhausted", async () => {
    const generateFn = vi
      .fn()
      .mockResolvedValueOnce({ result: { value: "attempt-1" }, cost: 0.1 })
      .mockResolvedValueOnce({ result: { value: "attempt-2" }, cost: 0.2 });

    const validationFn = vi
      .fn()
      .mockReturnValueOnce({ valid: false, errors: ["err-1"], warnings: [] })
      .mockReturnValueOnce({ valid: false, errors: ["err-2"], warnings: [] });

    const result = await withValidationRetry({
      maxAttempts: 2,
      agentName: "Agent Test",
      generateFn,
      validationFn,
    });

    expect(generateFn).toHaveBeenCalledTimes(2);
    expect(validationFn).toHaveBeenCalledTimes(2);
    expect(generateFn).toHaveBeenNthCalledWith(2, 2, ["err-1"]);

    expect(result.attempts).toBe(2);
    expect(result.totalCost).toBeCloseTo(0.3);
    expect(result.result).toEqual({ value: "attempt-2" });
    expect(result.validationResult.valid).toBe(false);
    expect(result.validationResult.errors).toEqual(["err-2"]);
    expect(result.retryHistory).toHaveLength(2);
  });
});
