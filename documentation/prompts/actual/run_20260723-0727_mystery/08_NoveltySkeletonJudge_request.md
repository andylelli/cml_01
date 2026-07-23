# Actual Prompt Record

- Run ID: `mystery-1784791658913`
- Project ID: `unknown`
- Timestamp: `2026-07-23T07:29:59.148Z`
- Agent: `NoveltySkeletonJudge`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.1`
- Max Tokens: `600`
- Attempt: `first`
- Prompt Hash: `1695f557a69e5dfb`

## Message 1 (role=system)

```text
You extract the ABSTRACT STRUCTURAL FINGERPRINT of a detective mystery — its structure, not its surface. Two mysteries that share zero names, places, or props can be the same trick; that sameness is what you capture. Respond with STRICT JSON and EXACTLY these five keys:
- "axis": one of ["temporal","spatial","identity","epistemic","behavioral","authority"]
- "mechanism_family": one of ["locked_room_key","locked_room_timing","alibi_fabrication","impersonation","substituted_body","poison_delayed","poison_substitution","staged_scene","unconscious_act","disguised_natural_agent","hidden_accomplice","information_leak","recorded_presence","secret_will_inheritance"]
- "false_assumption_pattern": a SHORT snake_case label for the WRONG BELIEF the reader is led to hold (abstract, surface-free, e.g. "time_of_symptom=time_of_act", "the_body_died_before_the_room_opened")
- "discriminating_test_shape": one of ["physical_trace","timetable_contradiction","behavioral_tell","identity_disambiguation","reconstruction","chemical_timing"]
- "inference_shape": a SHORT snake_case label for the DEDUCTIVE MOVE that cracks it (e.g. "decouple_act_from_symptom", "reframe_access_at_discovery")

Match the abstraction level and snake_case style of these reference fingerprints:
[{"axis":"epistemic","mechanism_family":"unconscious_act","false_assumption_pattern":"the_actor_acted_knowingly","discriminating_test_shape":"reconstruction","inference_shape":"reconstruct_altered_mental_state"},{"axis":"temporal","mechanism_family":"poison_delayed","false_assumption_pattern":"time_of_symptom=time_of_act","discriminating_test_shape":"chemical_timing","inference_shape":"decouple_act_from_symptom"},{"axis":"spatial","mechanism_family":"locked_room_timing","false_assumption_pattern":"the_body_died_before_the_room_opened","discriminating_test_shape":"timetable_contradiction","inference_shape":"reframe_access_at_discovery"},{"axis":"epistemic","mechanism_family":"staged_scene","false_assumption_pattern":"the_obvious_reconstruction_is_correct","discriminating_test_shape":"reconstruction","inference_shape":"overturn_obvious_reconstruction"},{"axis":"identity","mechanism_family":"poison_substitution","false_assumption_pattern":"no_motive_visible","discriminating_test_shape":"physical_trace","inference_shape":"expose_hidden_revenge_motive"},{"axis":"spatial","mechanism_family":"hidden_accomplice","false_assumption_pattern":"locked_room=>no_entry","discriminating_test_shape":"physical_trace","inference_shape":"reframe_access_via_overlooked_agent"}]
Output ONLY the JSON object.
```

## Message 2 (role=user)

```text
CML structural fields (use these to abstract the trick — do not copy surface nouns into the labels):
mechanism: Captain Ivor Hale used an identical costume to impersonate Sylvia during the event, creating a dual presence in the ballroom.
false_assumption.type: authority
false_assumption.statement: Witnesses confidently claim they saw Sylvia in the ballroom at the time of the murder.
discriminating_test.method: trap
discriminating_test.design: Comparing the measurements of the masks and costumes in Captain Hale's possession reveals they are identical.
inference: Comparing the measurements of the masks and costumes in Captain Hale's possession reveals they are identical.
premise: Amidst the glamour of a seaside gala, a beloved performer is found dead, and secrets of identity and authority unfold as a cunning masquerade complicates the investigation.

Return the JSON fingerprint.
```
