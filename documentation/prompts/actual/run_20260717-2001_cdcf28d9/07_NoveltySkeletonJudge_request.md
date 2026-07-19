# Actual Prompt Record

- Run ID: `run_cdcf28d9-b08b-429d-bc7a-d50f3da66bd3`
- Project ID: `proj_60ea64d0-8bbf-4c6a-a528-7798eeaafb92`
- Timestamp: `2026-07-17T20:03:47.590Z`
- Agent: `NoveltySkeletonJudge`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.1`
- Max Tokens: `600`
- Attempt: `first`
- Prompt Hash: `4a7d8042ab79d1b7`

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
mechanism: A brief but dense cloud cover at quarter past two erased the sundial’s shadow, making witnesses mistakenly believe Lady Evelyn was alive then. Meanwhile, Charles Stanhope manipulated the manor’s mechanical clock pendulum by impeding it with a hidden latch, causing the clock to lag and then rapidly catch up. This created a false timeline supported by altered servant ledger entries and social expectations. The combined physical and social timing traps concealed the true time of death and opportunity.
false_assumption.type: temporal
false_assumption.statement: The victim was seen alive precisely at quarter past two by multiple witnesses, confirmed by the sundial’s shadow.
discriminating_test.method: constraint_proof
discriminating_test.design: A timed comparison is staged between the manor’s library clock and an external time standard using the sundial during a replicated cloudless afternoon. The test demonstrates the clock’s fifteen-minute lag caused by the pendulum latch mechanism and the sundial’s inability to cast shadows under cloud cover. This exposes the false timeline asserted by Charles Stanhope and disproves his alibi.
inference: A timed comparison is staged between the manor’s library clock and an external time standard using the sundial during a replicated cloudless afternoon. The test demonstrates the clock’s fifteen-minute lag caused by the pendulum latch mechanism and the sundial’s inability to cast shadows under cloud cover. This exposes the false timeline asserted by Charles Stanhope and disproves his alibi.
premise: During an overcast autumn afternoon at the Stanhope Manor estate in Yorkshire, Lady Evelyn Stanhope was found stabbed in the garden near the sundial. All witnesses insist she was seen alive at a quarter past two, confirmed by the sundial’s shadow. However, the overcast weather created a shadowless hour, leading to a false timeline. Inspector Harold Bramwell uncovers mechanical interference with the manor’s clocks and social logic traps in household schedules, revealing that Charles Stanhope manipulated time perceptions to conceal his guilt.

Return the JSON fingerprint.
```
