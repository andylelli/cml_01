import json, sys

RUN_ID = sys.argv[1] if len(sys.argv) > 1 else "run_eb0dd67d-30dd-48d9-9ae8-5f14c8ddfbb3"

with open(r'C:\CML\data\store.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

events = [e for e in data.get('runEvents', []) if e.get('runId') == RUN_ID]
print('Events for run %s (%d total):' % (RUN_ID, len(events)))
for e in events:
    ts = (e.get('timestamp') or '?')[:19]
    step = e.get('step', '?')
    msg = e.get('message', '')
    print('  %s | %-22s | %s' % (ts, step, msg))
