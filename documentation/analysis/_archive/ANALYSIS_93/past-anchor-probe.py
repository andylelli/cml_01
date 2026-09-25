# -*- coding: utf-8 -*-
import io, re, glob, os, statistics

# A PAST-ANCHOR: a clause that puts a named span of time between now and an earlier event.
# Deliberately structural, like wit-density's shapes - not a judgement about whether it is moving.
ANCHOR = re.compile(
    r'\b(?:ever since|years ago|years before|years earlier|months ago|since the war|'
    r'when he was|when she was|when they were|at the age of|as a (?:boy|girl|child|young man|young woman)|'
    r'had been .{0,40}\b(?:since|for) (?:\w+ )?(?:years|months)|'
    r'in (?:1[6-9]\d\d|20\d\d)|the (?:winter|summer|spring|autumn) of (?:1[6-9]\d\d|20\d\d)|'
    r'used to be|had once been|before the war|after the war|in those days|in her youth|in his youth)\b',
    re.I)

def words(t): return len(t.split())

def score(path):
    t = io.open(path, encoding='utf-8', errors='ignore').read()
    w = words(t)
    if w < 6000: return None
    return (os.path.basename(path), w, len(ANCHOR.findall(t)), round(10000.0*len(ANCHOR.findall(t))/w, 1))

canon = [s for s in (score(p) for p in sorted(glob.glob('library/texts/*.txt'))) if s]
ours  = [s for s in (score(p) for p in sorted(glob.glob('stories/*/*.md'))) if s]

def show(label, rows):
    if not rows:
        print(label, "- none"); return
    per = sorted(r[3] for r in rows)
    print("%s: n=%d  median %.1f  range %.1f - %.1f" % (label, len(rows), statistics.median(per), per[0], per[-1]))
    return statistics.median(per)

print("PAST-ANCHORS per 10,000 words")
cm = show("  canon", canon)
om = show("  ours ", ours)
if cm and om: print("  ratio: %.1fx" % (cm/om if om else 0))
print()
print("  lowest canon book: %.1f" % min(r[3] for r in canon))
below = [r for r in ours if r[3] < min(x[3] for x in canon)]
print("  our books below the lowest canon book: %d of %d" % (len(below), len(ours)))
print()
for r in sorted(ours, key=lambda x: -x[3])[:3]: print("   ours best  %5.1f  %s" % (r[3], r[0][:52]))
for r in sorted(canon, key=lambda x: x[3])[:3]: print("   canon low  %5.1f  %s" % (r[3], r[0][:52]))
