import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ErrorNotification from "../ErrorNotification.vue";
import type { ErrorItem } from "../types";

describe("ErrorNotification.vue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders empty state when no errors", () => {
    const wrapper = mount(ErrorNotification, {
      props: { errors: [] },
    });
    expect(wrapper.find(".error-notification").exists()).toBe(false);
  });

  it("renders error with correct severity styling", () => {
    const errors: ErrorItem[] = [
      {
        id: "1",
        timestamp: Date.now(),
        severity: "error",
        scope: "test",
        message: "Test error",
      },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    const errorCard = wrapper.find(".bg-rose-50");
    expect(errorCard.exists()).toBe(true);
    expect(errorCard.text()).toContain("Test error");
  });

  it("renders warning with correct severity styling", () => {
    const errors: ErrorItem[] = [
      {
        id: "1",
        timestamp: Date.now(),
        severity: "warning",
        scope: "test",
        message: "Test warning",
      },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    const warningCard = wrapper.find(".bg-amber-50");
    expect(warningCard.exists()).toBe(true);
    expect(warningCard.text()).toContain("Test warning");
  });

  it("renders info with correct severity styling", () => {
    const errors: ErrorItem[] = [
      {
        id: "1",
        timestamp: Date.now(),
        severity: "info",
        scope: "test",
        message: "Test info",
      },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    const infoCard = wrapper.find(".bg-blue-50");
    expect(infoCard.exists()).toBe(true);
    expect(infoCard.text()).toContain("Test info");
  });

  it("shows error details when provided", () => {
    const errors: ErrorItem[] = [
      {
        id: "1",
        timestamp: Date.now(),
        severity: "error",
        scope: "test",
        message: "Test error",
        details: "Detailed error information",
      },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    expect(wrapper.text()).toContain("Detailed error information");
  });

  it("emits dismiss event when close button clicked", async () => {
    const errors: ErrorItem[] = [
      {
        id: "1",
        timestamp: Date.now(),
        severity: "error",
        scope: "test",
        message: "Test error",
      },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("dismiss")).toBeTruthy();
    expect(wrapper.emitted("dismiss")?.[0]).toEqual(["1"]);
  });

  it("displays multiple errors up to max (3)", () => {
    const errors: ErrorItem[] = [
      {
        id: "1",
        timestamp: Date.now(),
        severity: "error",
        scope: "test",
        message: "Error 1",
      },
      {
        id: "2",
        timestamp: Date.now(),
        severity: "error",
        scope: "test",
        message: "Error 2",
      },
      {
        id: "3",
        timestamp: Date.now(),
        severity: "error",
        scope: "test",
        message: "Error 3",
      },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    expect(wrapper.text()).toContain("Error 1");
    expect(wrapper.text()).toContain("Error 2");
    expect(wrapper.text()).toContain("Error 3");
  });

  it("shows 'more' indicator when more than 3 errors", () => {
    const errors: ErrorItem[] = [
      { id: "1", timestamp: Date.now(), severity: "error", scope: "test", message: "Error 1" },
      { id: "2", timestamp: Date.now(), severity: "error", scope: "test", message: "Error 2" },
      { id: "3", timestamp: Date.now(), severity: "error", scope: "test", message: "Error 3" },
      { id: "4", timestamp: Date.now(), severity: "error", scope: "test", message: "Error 4" },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    expect(wrapper.text()).toContain("1 more errors");
  });

  it.skip("auto-dismisses info messages after 5 seconds", async () => {
    // TODO: Auto-dismiss not implemented yet in component
    const errors: ErrorItem[] = [
      {
        id: "1",
        timestamp: Date.now(),
        severity: "info",
        scope: "test",
        message: "Test info",
      },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    expect(wrapper.emitted("dismiss")).toBeFalsy();

    vi.advanceTimersByTime(5000);
    await nextTick();

    expect(wrapper.emitted("dismiss")).toBeTruthy();
    expect(wrapper.emitted("dismiss")?.[0]).toEqual(["1"]);
  });

  it("does not auto-dismiss error messages", async () => {
    const errors: ErrorItem[] = [
      {
        id: "1",
        timestamp: Date.now(),
        severity: "error",
        scope: "test",
        message: "Test error",
      },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    vi.advanceTimersByTime(10000);
    await nextTick();

    expect(wrapper.emitted("dismiss")).toBeFalsy();
  });

  it("does not auto-dismiss warning messages", async () => {
    const errors: ErrorItem[] = [
      {
        id: "1",
        timestamp: Date.now(),
        severity: "warning",
        scope: "test",
        message: "Test warning",
      },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    vi.advanceTimersByTime(10000);
    await nextTick();

    expect(wrapper.emitted("dismiss")).toBeFalsy();
  });

  it("displays scope", () => {
    const errors: ErrorItem[] = [
      {
        id: "1",
        timestamp: Date.now(),
        severity: "error",
        scope: "validation",
        message: "Test error",
      },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    expect(wrapper.text()).toContain("validation");
  });

  it("shows most recent errors first", () => {
    const errors: ErrorItem[] = [
      { id: "1", timestamp: 1000, severity: "error", scope: "test", message: "Old error" },
      { id: "2", timestamp: 3000, severity: "error", scope: "test", message: "New error" },
      { id: "3", timestamp: 2000, severity: "error", scope: "test", message: "Middle error" },
    ];
    const wrapper = mount(ErrorNotification, {
      props: { errors },
    });

    const cards = wrapper.findAll(".rounded-lg.shadow-lg");
    expect(cards[0].text()).toContain("New error");
    expect(cards[1].text()).toContain("Middle error");
    expect(cards[2].text()).toContain("Old error");
  });
});
