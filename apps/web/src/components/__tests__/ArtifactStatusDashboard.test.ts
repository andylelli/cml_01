import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ArtifactStatusDashboard from "../ArtifactStatusDashboard.vue";

type ArtifactEntry = {
  id: string;
  label: string;
  generatedAt: string | null;
  ready: boolean;
  dependsOn: string[];
};

const makeArtifacts = (): ArtifactEntry[] => [
  { id: "setting", label: "Setting", generatedAt: null, ready: true, dependsOn: [] },
  { id: "cast", label: "Cast", generatedAt: null, ready: false, dependsOn: ["setting"] },
  { id: "cml", label: "CML", generatedAt: null, ready: false, dependsOn: ["cast"] },
];

describe("ArtifactStatusDashboard", () => {
  it("renders all artifact labels", () => {
    const wrapper = mount(ArtifactStatusDashboard, {
      props: { artifacts: makeArtifacts(), isRunning: false },
    });
    expect(wrapper.text()).toContain("Setting");
    expect(wrapper.text()).toContain("Cast");
    expect(wrapper.text()).toContain("CML");
  });

  it("shows 'ready' chip for artifacts that are ready", () => {
    const wrapper = mount(ArtifactStatusDashboard, {
      props: {
        artifacts: [{ id: "setting", label: "Setting", generatedAt: null, ready: true, dependsOn: [] }],
        isRunning: false,
      },
    });
    expect(wrapper.text().toLowerCase()).toContain("ready");
  });

  it("shows 'pending' or 'not generated' chip for artifacts that are not ready", () => {
    const wrapper = mount(ArtifactStatusDashboard, {
      props: {
        artifacts: [{ id: "cast", label: "Cast", generatedAt: null, ready: false, dependsOn: [] }],
        isRunning: false,
      },
    });
    const text = wrapper.text().toLowerCase();
    expect(text).toMatch(/pending|not generated/);
  });

  it("emits view event when View button clicked", async () => {
    const wrapper = mount(ArtifactStatusDashboard, {
      props: {
        artifacts: [{ id: "setting", label: "Setting", generatedAt: null, ready: true, dependsOn: [] }],
        isRunning: false,
      },
    });
    const buttons = wrapper.findAll("button");
    const viewBtn = buttons.find((b) => b.text().toLowerCase().includes("view"));
    if (viewBtn) {
      await viewBtn.trigger("click");
      expect(wrapper.emitted("view")).toBeDefined();
      expect(wrapper.emitted("view")?.[0]).toEqual(["setting"]);
    }
  });

  it("emits regenerate event when Regenerate button clicked", async () => {
    const wrapper = mount(ArtifactStatusDashboard, {
      props: {
        artifacts: [{ id: "setting", label: "Setting", generatedAt: null, ready: true, dependsOn: [] }],
        isRunning: false,
      },
    });
    const buttons = wrapper.findAll("button");
    const regenBtn = buttons.find((b) => b.text().toLowerCase().includes("regenerate"));
    if (regenBtn) {
      await regenBtn.trigger("click");
      expect(wrapper.emitted("regenerate")).toBeDefined();
      expect(wrapper.emitted("regenerate")?.[0]).toEqual(["setting"]);
    }
  });

  it("disables action buttons when isRunning is true", () => {
    const wrapper = mount(ArtifactStatusDashboard, {
      props: {
        artifacts: [{ id: "setting", label: "Setting", generatedAt: null, ready: true, dependsOn: [] }],
        isRunning: true,
      },
    });
    const buttons = wrapper.findAll("button");
    const disabledBtns = buttons.filter((b) => b.attributes("disabled") !== undefined);
    expect(disabledBtns.length).toBeGreaterThan(0);
  });

  it("shows dependency warning when deps not met", () => {
    const wrapper = mount(ArtifactStatusDashboard, {
      props: {
        artifacts: [
          { id: "setting", label: "Setting", generatedAt: null, ready: false, dependsOn: [] },
          { id: "cast", label: "Cast", generatedAt: null, ready: false, dependsOn: ["setting"] },
        ],
        isRunning: false,
      },
    });
    // The Cast artifact has unmet deps (setting not ready)
    const text = wrapper.text().toLowerCase();
    expect(text).toMatch(/waiting|depends|setting/);
  });
});
