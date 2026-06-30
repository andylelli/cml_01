# Actual Prompt Record

- Run ID: `run_bee5da27-8113-4876-9b8e-7807ad123346`
- Project ID: `proj_24cb9046-5c82-4239-9988-c1d26fe1ad16`
- Timestamp: `2026-06-30T08:31:27.741Z`
- Agent: `NoveltySkeletonJudge`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.1`
- Max Tokens: `600`
- Attempt: `first`
- Prompt Hash: `62e19836726d3068`

## Message 1 (role=system)

```text
You extract the ABSTRACT STRUCTURAL FINGERPRINT of a detective mystery — its structure, not its surface. Two mysteries that share zero names, places, or props can be the same trick; that sameness is what you capture. Respond with STRICT JSON and EXACTLY these five keys:
- "axis": one of ["temporal","spatial","identity","epistemic","behavioral","authority"]
- "mechanism_family": one of ["locked_room_key","locked_room_timing","alibi_fabrication","impersonation","substituted_body","poison_delayed","poison_substitution","staged_scene","unconscious_act","disguised_natural_agent","hidden_accomplice","information_leak","recorded_presence","secret_will_inheritance"]
- "false_assumption_pattern": a SHORT snake_case label for the WRONG BELIEF the reader is led to hold (abstract, surface-free, e.g. "time_of_symptom=time_of_act", "the_body_died_before_the_room_opened")
- "discriminating_test_shape": one of ["physical_trace","timetable_contradiction","behavioral_tell","identity_disambiguation","reconstruction","chemical_timing"]
- "inference_shape": a SHORT snake_case label for the DEDUCTIVE MOVE that cracks it (e.g. "decouple_act_from_symptom", "reframe_access_at_discovery")

Match the abstraction level and snake_case style of these reference fingerprints:
[{"axis":"temporal","mechanism_family":"poison_delayed","false_assumption_pattern":"time_of_symptom=time_of_act","discriminating_test_shape":"chemical_timing","inference_shape":"decouple_act_from_symptom"},{"axis":"spatial","mechanism_family":"locked_room_timing","false_assumption_pattern":"the_body_died_before_the_room_opened","discriminating_test_shape":"timetable_contradiction","inference_shape":"reframe_access_at_discovery"}]
Output ONLY the JSON object.
```

## Message 2 (role=user)

```text
CML structural fields (use these to abstract the trick — do not copy surface nouns into the labels):
mechanism: The brass bolt securing Edith's door was designed to expand and unlock gradually as the hearth fire warmed. The fire was lit shortly before quarter past nine but took at least an hour to heat the bolt enough to release it. Witnesses mistakenly believed the door was forced open immediately after lighting the fire, creating a false timeline. The culprit exploited this by committing the murder after the door unlocked naturally, giving the illusion of forced entry earlier.
false_assumption.type: temporal
false_assumption.statement: The door bolt was forced open immediately after the hearth fire was lit, indicating the murder occurred shortly after quarter past nine.
discriminating_test.method: constraint_proof
discriminating_test.design: Compare the mantel thermometer temperature curve and soot line on the door bolt latch against the witness testimony of forced entry time, combined with stable clock logs and horse exercise records, to demonstrate that the door bolt could not have been forced open at the stated time and Reggie Harcourt's alibi is false. This controlled timing reconstruction exposes the impossibility of the false timeline and singles out Reggie as the only suspect present during the actual murder window.
inference: Compare the mantel thermometer temperature curve and soot line on the door bolt latch against the witness testimony of forced entry time, combined with stable clock logs and horse exercise records, to demonstrate that the door bolt could not have been forced open at the stated time and Reggie Harcourt's alibi is false. This controlled timing reconstruction exposes the impossibility of the false timeline and singles out Reggie as the only suspect present during the actual murder window.
premise: At Langley Manor during a damp spring evening, Edith Langley is found dead in her locked room, struck fatally with a fireplace poker. All signs suggest the locked door was forced open before the murder, but the timing of events and witness statements conflict. The family and guests each have motives and alibis that seem to rule them out. Detective Felix Dryden must unravel the truth hidden within the manor's rigid schedules, the hearth’s slow thermal lock, and the deceptive timing of events to uncover the killer.

Return the JSON fingerprint.
```
