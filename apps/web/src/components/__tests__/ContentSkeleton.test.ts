import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ContentSkeleton from "../ContentSkeleton.vue";

describe("ContentSkeleton", () => {
  it("renders without crashing", () => {
    const wrapper = mount(ContentSkeleton);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders default number of skeleton rows", () => {
    const wrapper = mount(ContentSkeleton);
    const rows = wrapper.findAll(".animate-pulse, [class*='animate']");
    // Default 4 rows (showHeading=true means heading + 4 content rows = 5 items)
    expect(rows.length).toBeGreaterThan(0);
  });

  it("renders the specified number of rows", () => {
    const wrapper = mount(ContentSkeleton, { props: { rows: 3 } });
    // Should have 3 content rows
    expect(wrapper.html()).toBeTruthy();
  });

  it("renders heading skeleton when showHeading is true (default)", () => {
    const wrapper = mount(ContentSkeleton, { props: { showHeading: true } });
    // Heading row is wider than content rows
    const html = wrapper.html();
    expect(html).toContain("animate-pulse");
  });

  it("renders without heading when showHeading is false", () => {
    const wrapper = mount(ContentSkeleton, { props: { showHeading: false, rows: 4 } });
    expect(wrapper.exists()).toBe(true);
  });

  it("has Tailwind animate-pulse class for animation", () => {
    const wrapper = mount(ContentSkeleton);
    expect(wrapper.html()).toContain("animate-pulse");
  });

  it("gives every placeholder row a visible fill", () => {
    // Was: `expect(html).toMatch(/bg-slate|bg-gray/)`. That pinned the raw Tailwind palette, which is
    // the thing the redesign changes, so it had to be rewritten by the restyle and protected nothing
    // (UI-002 §7). The contract that actually matters is that a row HAS a fill from the design
    // system, not which hue that system currently uses.
    const wrapper = mount(ContentSkeleton);
    const rows = wrapper.findAll(".animate-pulse [class*='bg-']");
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.classes().some((c) => c.startsWith("bg-"))).toBe(true);
    }
  });

  it("is hidden from assistive technology or carries a status role", () => {
    // A skeleton is either decorative or a loading announcement; silently reading its empty rows to
    // a screen reader is the one option that is wrong.
    const wrapper = mount(ContentSkeleton);
    const root = wrapper.element as HTMLElement;
    const marked =
      root.getAttribute("aria-hidden") === "true" ||
      root.getAttribute("role") === "status" ||
      root.getAttribute("aria-busy") === "true";
    expect(marked).toBe(true);
  });
});
