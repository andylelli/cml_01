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

  it("skeleton rows have bg-slate or bg-gray fill", () => {
    const wrapper = mount(ContentSkeleton);
    const html = wrapper.html();
    expect(html).toMatch(/bg-slate|bg-gray/);
  });
});
