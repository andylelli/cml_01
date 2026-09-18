import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import AudioPlayer from "../AudioPlayer.vue";

/**
 * jsdom implements no media pipeline: `play()` is undefined, `duration` is NaN
 * and nothing ever fires. So the element is stubbed and the assertions are
 * about the component's OWN behaviour — what it asks the element to do, and
 * what it shows — rather than about playback, which only a browser can prove.
 */
const stubMedia = () => {
  // jsdom's `paused` is a fixed `true`, so the component — which asks the
  // element whether it is playing before deciding what to do — would only ever
  // take the play branch. The stub models that one bit of state.
  let paused = true;
  const play = vi.fn().mockImplementation(() => {
    paused = false;
    return Promise.resolve();
  });
  const pause = vi.fn().mockImplementation(() => {
    paused = true;
  });
  Object.defineProperty(window.HTMLMediaElement.prototype, "play", { configurable: true, value: play });
  Object.defineProperty(window.HTMLMediaElement.prototype, "pause", { configurable: true, value: pause });
  Object.defineProperty(window.HTMLMediaElement.prototype, "paused", {
    configurable: true,
    get: () => paused,
  });
  return { play, pause };
};

const CHAPTERS = [
  { title: "One: Arrival", file: "01-one.mp3", index: 0, startSeconds: 0, durationSeconds: 60 },
  { title: "Two: The Body", file: "02-two.mp3", index: 1, startSeconds: 61.2, durationSeconds: 90 },
  { title: "Three: The Answer", file: "03-three.mp3", index: 2, startSeconds: 152.4, durationSeconds: 30 },
];

const mountPlayer = (props: Record<string, unknown> = {}) =>
  mount(AudioPlayer, {
    props: { src: "http://localhost:3005/audio", title: "The Silent Clock", ...props },
    global: { stubs: { AppIcon: true } },
  });

describe("AudioPlayer.vue", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("points the element at the streamed URL rather than buffering a blob", () => {
    const wrapper = mountPlayer();
    const el = wrapper.find("audio");
    expect(el.attributes("src")).toBe("http://localhost:3005/audio");
    // Metadata only: an 80 MB book must not be fetched to show a duration.
    expect(el.attributes("preload")).toBe("metadata");
  });

  it("plays and pauses through the element", async () => {
    const { play, pause } = stubMedia();
    const wrapper = mountPlayer();
    const button = wrapper.get('button[aria-label="Play"]');

    await button.trigger("click");
    expect(play).toHaveBeenCalled();

    // The element drives the label, so simulate it reporting that it started.
    await wrapper.find("audio").trigger("play");
    expect(wrapper.get("button[aria-label]").attributes("aria-label")).toBe("Pause");

    await wrapper.get('button[aria-label="Pause"]').trigger("click");
    expect(pause).toHaveBeenCalled();
  });

  it("offers the remembered position instead of silently jumping to it", async () => {
    localStorage.setItem("narration-pos:case-1", "412");
    const wrapper = mountPlayer({ rememberAs: "case-1" });
    await nextTick();

    expect(wrapper.text()).toContain("You stopped at 6:52");
    // Nothing has moved until the offer is accepted.
    expect((wrapper.find("audio").element as HTMLAudioElement).currentTime).toBe(0);

    await wrapper.get("button").trigger("click"); // not the resume button; play still works
    expect(wrapper.text()).toContain("Resume");
  });

  it("ignores a remembered position that is only a few seconds in", async () => {
    localStorage.setItem("narration-pos:case-2", "4");
    const wrapper = mountPlayer({ rememberAs: "case-2" });
    await nextTick();
    expect(wrapper.text()).not.toContain("You stopped at");
  });

  it("survives storage being unavailable", async () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => mountPlayer({ rememberAs: "case-3" })).not.toThrow();
    getItem.mockRestore();
  });

  it("lists chapters and seeks to the one picked", async () => {
    const wrapper = mountPlayer({ chapters: CHAPTERS, durationHint: 182 });
    await nextTick();

    expect(wrapper.text()).toContain("3 chapters");
    expect(wrapper.text()).toContain("Two: The Body");

    stubMedia();
    const audio = wrapper.find("audio").element as HTMLAudioElement;
    const chapterButtons = wrapper.findAll("ol button");
    await chapterButtons[1].trigger("click");
    expect(audio.currentTime).toBeCloseTo(61.2, 1);
  });

  it("does not offer a chapter list for a single chapter", () => {
    const wrapper = mountPlayer({ chapters: [CHAPTERS[0]] });
    expect(wrapper.find("details").exists()).toBe(false);
  });

  it("changes playback rate on the element", async () => {
    const wrapper = mountPlayer();
    const audio = wrapper.find("audio").element as HTMLAudioElement;
    const fast = wrapper.findAll("button").find((b) => b.text() === "1.5×");
    await fast!.trigger("click");
    expect(audio.playbackRate).toBe(1.5);
    expect(fast!.attributes("aria-pressed")).toBe("true");
  });

  it("exposes a labelled, seekable range control", () => {
    const wrapper = mountPlayer({ durationHint: 182 });
    const slider = wrapper.get('input[type="range"]');
    expect(slider.attributes("aria-label")).toContain("Seek within");
    expect(slider.attributes("max")).toBe("182");
  });

  it("says so when the audio cannot be loaded", async () => {
    const wrapper = mountPlayer();
    await wrapper.find("audio").trigger("error");
    expect(wrapper.text()).toContain("could not be loaded");
  });
});
