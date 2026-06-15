import json, sys

RUN_ID = sys.argv[1] if len(sys.argv) > 1 else "run_3f883410-f9c1-4245-ad3f-459e017ab4de"

with open(r'C:\CML\data\store.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

run = data['runs'].get(RUN_ID, {})
print(f"Run: {RUN_ID}")
print(f"Status: {run.get('status')}")
print(f"ProjectId: {run.get('projectId')}")
print(f"CreatedAt: {run.get('createdAt')}")
print()

events = [e for e in data.get('runEvents', []) if e.get('runId') == RUN_ID]
print(f"Events ({len(events)}):")
for e in events:
    ts = e.get('timestamp', '?')[:19] if e.get('timestamp') else '?'
    print(f"  {ts} | {e.get('step','?'):20s} | {e.get('message','?')}")
