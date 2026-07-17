# Actual Prompt Record

- Run ID: `mystery-1784265614158`
- Project ID: `unknown`
- Timestamp: `2026-07-17T05:22:29.242Z`
- Agent: `NoveltySkeletonJudge`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.1`
- Max Tokens: `600`
- Attempt: `first`
- Prompt Hash: `5280f914ced6dd20`

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
mechanism: The mechanism relies on drown, chart, and indicat to expose the false timing.
false_assumption.type: temporal
false_assumption.statement: Dr. Mallory Finch drowned at high tide, making her death appear accidental.
discriminating_test.method: trap
discriminating_test.design: The discriminating test compares drown, claim, and chart against the claimed timeline.
inference: The discriminating test compares drown, claim, and chart against the claimed timeline.
premise: During a weekend retreat at a seaside hotel, Dr. Mallory Finch is found drowned just as the tide rises. Eleanor Voss investigates the circumstances, uncovering a web of jealousy and deception leading to a shocking conclusion.

Return the JSON fingerprint.
```
