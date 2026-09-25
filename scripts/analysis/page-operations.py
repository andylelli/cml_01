"""Page operations per chapter (17-hitting-90 03 section 1): words, paragraphs, paragraphs opening
on speech, sentences over thirty words, em-dashes however spelled.

    python scripts/analysis/page-operations.py <manuscript.md> [...]
"""
import re, sys

def chapters(text):
    parts = re.split(r'(?m)^#{1,3}\s*Chapter\s+\d+.*$', text)
    return [p for p in parts[1:] if p.strip()]

def measure(path):
    text = open(path, encoding='utf-8').read()
    chs = chapters(text)
    rows = []
    for i, ch in enumerate(chs, 1):
        paras = [p.strip() for p in re.split(r'\n\s*\n', ch) if p.strip() and not p.strip().startswith('#')]
        speech = sum(1 for p in paras if p[0] in '"“\'‘')
        sents = [s for s in re.split(r'(?<=[.!?])["”’]?\s+', ch) if s.strip()]
        long = sum(1 for s in sents if len(s.split()) > 30)
        body = re.sub(r'(?m)^-{3,}\s*$', '', ch)  # the chapter separator is not a dash
        dashes = len(re.findall(r'—|(?<!-)--(?!-)|\s-\s', body))
        words = len(ch.split())
        rows.append((i, words, len(paras), speech, long, dashes))
    return rows

for path in sys.argv[1:]:
    print(path.split('/')[-2] if '/' in path else path)
    print('ch words paras speechOpen long>30 dashes')
    tot = [0]*5
    for r in measure(path):
        print(*r)
        for k in range(5): tot[k] += r[k+1]
    print('total', *tot, 'speech share %.1f%%' % (100*tot[2]/max(1,tot[1])))
