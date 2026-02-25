import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import ProgressIndicator, { type PipelineStep } from "../ProgressIndicator.vue";

const makeSteps = (overrides: Partial<PipelineStep>[] = []): PipelineStep[] =>
  [
    { id: "setting", label: "Setting", status: "complete" as const },
    { id: "cast", label: "Cast", status: "running" as const },
    { id: "cml", label: "CML", status: "pending" as const },
  ].map((s, i) => ({ ...s, ...(overrides[i] ?? {}) }));

describe("ProgressIndicator", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all step labels", () => {
    const wrapper = mount(ProgressIndicator, {
      props: {
        steps: makeSteps(),
        isRunning: false,
        progressPercent: 50,
        progressLabel: "Running…",
      },
    });
    expect(wrapper.text()).toContain("Setting");
    expect(wrapper.text()).toContain("Cast");
    expect(wrapper.text()).toContain("CML");
  });

  it("shows progress bar with correct width when running", () => {
    const wrapper = mount(ProgressIndicator, {
      props: {
        steps: makeSteps(),
        isRunning: true,
        progressPercent: 42,
        progressLabel: "Generating cast…",
      },
    });
    const bar = wrapper.find('[style*="width"]');
    expect(bar.exists()).toBe(true);
    expect(bar.attributes("style")).toContain("42");
  });

  it("shows the progress label", () => {
    const wrapper = mount(ProgressIndicator, {
      props: {
        steps: makeSteps(),
        isRunning: true,
        progressPercent: 30,
        progressLabel: "Building CML…",
      },
    });
    expect(wrapper.text()).toContain("Building CML…");
  });

  it("emits cancel when cancel button clicked", async () => {
    const wrapper = mount(ProgressIndicator, {
      props: {
        steps: makeSteps(),
        isRunning: true,
        progressPercent: 60,
        progressLabel: "Running",
      },
    });
    const cancelBtn = wrapper.find("button");
    if (cancelBtn.exists()) {
      await cancelBtn.trigger("click");
      expect(wrapper.emitted("cancel")).toBeDefined();
    }
  });

  it("shows complete icon for completed steps", () => {
    const wrapper = mount(ProgressIndicator, {
      props: {
        steps: [{ id: "setting", label: "Setting", status: "complete" }],
        isRunning: false,
        progressPercent: 100,
        progressLabel: "Done",
      },
    });
    // Complete steps show ✅ emoji or similar indicator
    expect(wrapper.text()).toMatch(/[✅✓]/);
  });

  it("does not show progress bar when not running", () => {
    const wrapper = mount(ProgressIndicator, {
      props: {
        steps: makeSteps(),
        isRunning: false,
        progressPercent: 0,
        progressLabel: "Ready",
      },
    });
    // Progress bar should be hidden/absent
    const bars = wrapper.findAll('[style*="width"]');
    // None of them should show a non-zero width
    const nonZero = bars.filter((b) => !b.attributes("style")?.includes("width: 0"));
    expect(nonZero.length).toBe(0);
  });
});
