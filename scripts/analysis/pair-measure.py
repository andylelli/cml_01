"""17-hitting-90 — the counts a matched pair is judged by, from the saved manuscript.

    python scripts/analysis/pair-measure.py <manuscript.md> [reveal_chapter=8] [closure_chapter=9]

Prints words per chapter, the page operations, the humour labels printed, the wit operations
narrated as they are performed, clock values in the closure chapter, "cleared" in the closure
chapter, and the reveal-package checks that a regex can see. What a regex cannot see is read.
"""
import re, sys

path = sys.argv[1]
reveal = int(sys.argv[2]) if len(sys.argv) > 2 else 8
closure = int(sys.argv[3]) if len(sys.argv) > 3 else 9

text = open(path, encoding="utf-8").read()
titles = re.findall(r"(?m)^## Chapter \d+:?\s*(.*)$", text)
chs = re.split(r"(?m)^## Chapter \d+.*$", text)[1:]

words = [len(c.split()) for c in chs]
print("titles :", " | ".join(t.strip() for t in titles))
print("words  :", words, "total", sum(words), "min", min(words))

def paras(c):
    return [p.strip() for p in re.split(r"\n\s*\n", c) if p.strip() and not p.strip().startswith("---")]
speech = [sum(1 for p in paras(c) if p[0] in "\"“'‘") for c in chs]
print("speech-opening paragraphs by chapter:", speech, "total", sum(speech))
print("em-dashes on the page:", text.count("—"))

labels = ["polite savagery", "dry wit", "observational humour", "deadpan", "self-deprecating", "understatement", "sardonic", "blunt humour"]
lab = {l: len(re.findall(re.escape(l), text, re.I)) for l in labels}
print("humour labels printed:", {k: v for k, v in lab.items() if v}, "total", sum(lab.values()))

narr = ["four words", "at length", "clipped to", "the line minimal", "funnier than", "with finality", "held its breath", "remained elusive"]
nar = {n: len(re.findall(re.escape(n), text, re.I)) for n in narr}
print("operations narrated:", {k: v for k, v in nar.items() if v}, "total", sum(nar.values()))

CLOCK = re.compile(r"\b(?:half past|quarter (?:past|to)|(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|twenty-five|\d{1,2}) (?:minutes? )?(?:past|to) (?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) (?:fifty|forty|twenty|ten|five)\b|\d{1,2}:\d{2})", re.I)
cl = chs[closure - 1] if len(chs) >= closure else ""
print(f"closure ch{closure}: clock values {len(CLOCK.findall(cl))}, 'cleared' {len(re.findall(r'\\bcleared\\b', cl, re.I))}, words {len(cl.split())}")

rv = chs[reveal - 1] if len(chs) >= reveal else ""
checks = {
    # "the weapon used to kill Miss Quayle" — pair 2 said weapon, not foil; a probe that missed it was a claim about the probe.
    "weapon + marks + culprit in one sentence": bool(re.search(r"[^.!?]*(?:foil|weapon)[^.!?]*(?:mark|stain|blood)[^.!?]*Kestrel|[^.!?]*Kestrel[^.!?]*(?:mark|stain|blood)[^.!?]*(?:foil|weapon)", rv, re.I)),
    "name + verb of killing": bool(re.search(r"Desmond Kestrel[^.!?]{0,40}\b(?:killed|stabbed|murdered)\b[^.!?]*Katherine", rv)),
    "window with two clock values in one sentence": bool(re.search(r"[^.!?]*twenty minutes past three[^.!?]*half past three[^.!?]*[.!?]", rv, re.I)),
    "Hector or another innocent at the window/climb": bool(re.search(r"(?:Hector|Gaunt|Neville|Lachlan|Bertram|Vance)[^.!?]{0,80}(?:sill|window|ledge|climb|cave|attempt)", rv)),
    "Desmond performs (cave/climb)": bool(re.search(r"(?:Desmond|Kestrel)[^.!?]{0,120}(?:cave|climb|ledge|lowered|dropped)", rv)),
}
for k, v in checks.items():
    print(f"reveal ch{reveal}: {'YES' if v else 'no '}  {k}")
after = rv.split("killed Katherine Quayle", 1)[1] if "killed Katherine Quayle" in rv else ""
print(f"reveal ch{reveal}: Desmond speaks after the naming — quoted lines: {len(re.findall(r'\"[^\"]{12,}\"', after))} (read them)")
print("battered:", len(re.findall(r"\bbattered\b", text, re.I)))
