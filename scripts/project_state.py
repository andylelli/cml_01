import json

with open(r'C:\CML\data\store.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

proj = 'proj_da6562ea-824a-41c4-9449-3309fcfd31bf'
runs = [(k,v) for k,v in data.get('runs',{}).items() if v.get('projectId') == proj]
print('Runs for Golden Age Prototype 06:')
for rid, r in runs:
    print('  %s status=%s createdAt=%s' % (rid, r.get('status'), r.get('createdAt')))
print()

for rid, r in runs:
    evts = [e for e in data.get('runEvents',[]) if e.get('runId') == rid]
    last_step = evts[-1].get('step') if evts else 'none'
    last_msg = evts[-1].get('message','') if evts else 'none'
    print('Run %s: %d events. Last: %s - %s' % (rid, len(evts), last_step, last_msg[:60]))

print()
reports = data.get('reports', {})
print('Reports:', len(reports))
for rk in list(reports.keys())[:10]:
    rpt = reports[rk]
    print('  %s -> runId=%s in_progress=%s score=%s' % (rk[:50], rpt.get('runId','?')[:20], rpt.get('in_progress'), rpt.get('overallScore')))
