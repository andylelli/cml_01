# Actual Prompt Record

- Run ID: `mystery-1784576119605`
- Project ID: `unknown`
- Timestamp: `2026-07-20T19:37:31.321Z`
- Agent: `NoveltySkeletonJudge`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.1`
- Max Tokens: `600`
- Attempt: `first`
- Prompt Hash: `b76d1b20de4aadba`

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
mechanism: Hugo Vane was deliberately drowned during high tide to create the appearance of an accident, while the actual time of the murder was masked by a manipulated hotel clock.
false_assumption.type: temporal
false_assumption.statement: Hugo drowned due to an unfortunate accident caused by high tide.
discriminating_test.method: trap
discriminating_test.design: Reconstruct the timeline of events using tide charts and clock discrepancies to demonstrate how the murder was timed to occur during high tide, while the clock misled investigators.
inference: Reconstruct the timeline of events using tide charts and clock discrepancies to demonstrate how the murder was timed to occur during high tide, while the clock misled investigators.
premise: In the midst of a stormy night at a coastal hotel, the body of Hugo Vane is discovered drowned just as the tide reached its peak. As tensions rise among the guests, Detective Eleanor Voss must untangle a web of lies and rivalries to uncover the truth behind the seemingly accidental death.

Return the JSON fingerprint.
```
