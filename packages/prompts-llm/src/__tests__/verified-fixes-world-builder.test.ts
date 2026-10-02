import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __testables, generateWorldDocument } from "../agent65-world-builder.ts";

const FLAG = "CML_VERIFIED_FIXES";
let saved: string | undefined;
beforeEach(() => {
  saved = process.env[FLAG];
  delete process.env[FLAG];
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved;
  vi.restoreAllMocks();
});

// Production CASE.cast shape: role_archetype, no `role`.
const caseData = {
  CASE: {
    meta: { title: "The Glasshouse Affair", theme: "duty against desire" },
    cast: [
      { name: "Inspector Hale", role_archetype: "Detective Inspector" },
      { name: "Lord Ashcombe", role_archetype: "Victim" },
      { name: "Clara Venn", role_archetype: "Secretary" },
      { name: "Dr. Pell", role_archetype: "Physician" },
    ],
    culpability: { culprits: ["Clara Venn"] },
  },
};

describe("A6-D02 — default break-moment character reads role_archetype", () => {
  const pick = () => __testables.buildDefaultBreakMoment(caseData as any, undefined).character;

  it("flag OFF: `role` is absent, so the detective (first non-culprit) is chosen", () => {
    expect(pick()).toBe("Inspector Hale");
  });

  it("flag ON: neither the detective nor the victim", () => {
    process.env[FLAG] = "1";
    expect(pick()).toBe("Dr. Pell");
  });
});

describe("A6-03 — World Builder retry asks for length only after a length failure", () => {
  const inputs = {
    caseData,
    characterProfiles: { profiles: [] },
    locationProfiles: {},
    temporalContext: {},
    backgroundContext: {},
    hardLogicDevices: { devices: [] },
  } as any;

  async function retryMessages(replies: Array<{ content: string; finishReason?: string }>) {
    const sent: string[] = [];
    let i = 0;
    const client = {
      chat: vi.fn(async (req: any) => {
        const last = req.messages[req.messages.length - 1];
        if (req.logContext?.retryAttempt > 1) sent.push(String(last.content));
        const r = replies[Math.min(i++, replies.length - 1)];
        return { content: r.content, finishReason: r.finishReason ?? "stop", model: "m", usage: {}, latencyMs: 1 };
      }),
      getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
    };
    await generateWorldDocument(inputs, client as any).catch(() => undefined);
    return sent;
  }

  const LENGTH_DEMAND = "A single dense paragraph is not enough";

  it("flag OFF: a schema failure still gets the length demands", async () => {
    const sent = await retryMessages([{ content: "{}" }]);
    expect(sent.length).toBeGreaterThan(0);
    expect(sent[0]).toContain("failed validation");
    expect(sent[0]).toContain(LENGTH_DEMAND);
  });

  it("flag ON: a non-length validation failure gets no length demands", async () => {
    process.env[FLAG] = "1";
    const sent = await retryMessages([{ content: "{}" }]);
    expect(sent.length).toBeGreaterThan(0);
    expect(sent[0]).toContain("failed validation");
    expect(sent[0]).not.toContain(LENGTH_DEMAND);
    expect(sent[0]).not.toContain("MUST be at least");
  });

  it("flag OFF: an empty reply cut off at the limit is not recognised as truncation", async () => {
    const sent = await retryMessages([{ content: "", finishReason: "length" }]);
    expect(sent[0]).not.toContain("CUT OFF");
    expect(sent[0]).toContain(LENGTH_DEMAND);
  });

  it("flag ON: finishReason=length is a truncation retry", async () => {
    process.env[FLAG] = "1";
    const sent = await retryMessages([{ content: "", finishReason: "length" }]);
    expect(sent[0]).toContain("CUT OFF");
  });

  it("flag ON: a parse failure says so and asks for no length", async () => {
    process.env[FLAG] = "1";
    const sent = await retryMessages([{ content: "", finishReason: "stop" }]);
    expect(sent[0]).toContain("was not valid JSON");
    expect(sent[0]).not.toContain(LENGTH_DEMAND);
  });

  it("flag ON: a length failure keeps the length demands", () => {
    const msg = __testables.buildClassifiedRetryMessage("validation-length", "storyTheme is too short");
    expect(msg).toContain(LENGTH_DEMAND);
    expect(msg).toContain("revealImplications MUST be at least");
  });

  it("flag ON: the regex fallback still catches a guard-detected truncation", async () => {
    process.env[FLAG] = "1";
    const sent = await retryMessages([{ content: '{"status": "final", "storyTheme": "x"' }]);
    expect(sent[0]).toContain("CUT OFF");
  });
});
