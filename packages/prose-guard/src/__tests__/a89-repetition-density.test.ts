import { describe, expect, it } from "vitest";
import {
  repetitionDensity,
  repetitionWords,
  summariseRepetitionDensity,
  REPETITION_CORPUS_MEDIAN_PER_10K,
} from "../repetition-density.js";

/**
 * A_89 C2 — the reader of run 88651 listed eight lines as "generator scaffolding rather than
 * finished prose". None of them exists in our source: they are the model's own words, repeated.
 * MEASURED over 212 archived manuscripts — corpus median 17.3 repeated six-word spans per 10k words;
 * that book scored 118.8, ranking 25th worst, and was marked `prose` 6/10.
 */
describe("A_89 C2 — repeated-span density", () => {
  it("KNOWN-POSITIVE: a repeated span is counted", () => {
    const text = "the same six word span here ".repeat(4);
    expect(repetitionDensity(text).repeatedSpans).toBeGreaterThan(0);
  });

  it("KNOWN-NEGATIVE: prose that never repeats scores zero", () => {
    const text = "one two three four five six seven eight nine ten eleven twelve";
    expect(repetitionDensity(text).repeatedSpans).toBe(0);
    expect(repetitionDensity(text).per10k).toBe(0);
  });

  it("needs THREE occurrences, not two — twice is a callback, three times is a tic", () => {
    const twice = "a span repeated only two times. a span repeated only two times.";
    expect(repetitionDensity(twice).repeatedSpans).toBe(0);
    const thrice = "a span repeated only two times. ".repeat(3);
    expect(repetitionDensity(thrice).repeatedSpans).toBeGreaterThan(0);
  });

  it("reports the worst offenders with their counts", () => {
    const text = "the murder window she recalled could not exceed ten minutes. ".repeat(4);
    const d = repetitionDensity(text);
    expect(d.worst.length).toBeGreaterThan(0);
    expect(d.worst[0].count).toBeGreaterThanOrEqual(3);
  });

  it("the summary carries the corpus median so a single number means something", () => {
    const quiet = summariseRepetitionDensity(repetitionDensity("one two three four five six seven eight"));
    expect(quiet).toContain(String(REPETITION_CORPUS_MEDIAN_PER_10K));
    expect(quiet).toContain("Normal");
    const loud = summariseRepetitionDensity(repetitionDensity("the same six word span here ".repeat(30)));
    expect(loud).toContain("WORTH A LOOK BEFORE READING");
  });

  it("short or empty input is handled, not thrown on", () => {
    expect(() => repetitionDensity("")).not.toThrow();
    expect(repetitionDensity("").repeatedSpans).toBe(0);
    expect(() => repetitionDensity(null as any)).not.toThrow();
  });

  it("worstLimit defaults to five and widens only when asked", () => {
    // A 14-word line said three times has nine distinct six-word windows, each repeated three times.
    const text = "the watch had stopped at ten minutes past three and nobody said a word ".repeat(3);
    expect(repetitionDensity(text).worst).toHaveLength(5);
    expect(repetitionDensity(text, 6, 3, 100).worst.length).toBeGreaterThan(5);
    // The headline numbers do not depend on how many spans are listed.
    expect(repetitionDensity(text, 6, 3, 100).per10k).toBe(repetitionDensity(text).per10k);
    expect(repetitionDensity(text, 6, 3, 100).repeatedSpans).toBe(repetitionDensity(text).repeatedSpans);
  });

  it("a reported span is a window over repetitionWords, not a substring of the prose", () => {
    // Anything that must find a span again in the text has to normalise the text the same way:
    // "twenty-five" is two words here, and a comma is a space. findings.ts block 5 relies on this.
    const line = "The clock stopped at twenty-five minutes past three, and nobody argued. ";
    const text = line.repeat(3);
    const { worst } = repetitionDensity(text);
    expect(worst.length).toBeGreaterThan(0);
    const words = repetitionWords(text);
    for (const { span } of worst) {
      const want = span.split(" ");
      expect(want).toHaveLength(6);
      expect(words.some((_, i) => want.every((w, k) => words[i + k] === w))).toBe(true);
    }
    expect(repetitionWords("Twenty-five, o'clock; “didn’t”")).toEqual(["twenty", "five", "o'clock", "didn", "t"]);
  });
});
