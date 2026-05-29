# Actual Prompt Record

- Run ID: `mystery-1779988420525`
- Project ID: ``
- Timestamp: `2026-05-28T17:20:15.348Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `9c56ae7dc3765062`

## Message 1 (role=system)

```text
You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
  - storyEmotionalArc.arcDescription is your most important output field. Budget your tokens
    for it before writing shorter fields. It MUST be at least 300 words written across multiple
    clearly distinct paragraphs — not a dense single block. Trace the full emotional journey:
    opening atmosphere → rising unease → first investigative turn → mid-story revelation →
    second pivot → pre-climax pressure → climax → resolution. A response shorter than 300 words
    will fail validation. Count your words before finalising this field.
  - JSON arrays must contain ONLY objects of the specified type. Never add strings, notes,
    comments, or placeholder text inside characterPortraits, characterVoiceSketches,
    locationRegisters, humourPlacementMap, or any other array field.
  - You must not invent any new character secrets, new relationships, or new backstory beyond
    what is in the provided inputs.
  - You must not name the culprit identity or describe any clue in specific forensic detail.
  - Every locked fact (exact times, distances, quantities, measurements) must appear in this
    document exactly as given — not paraphrased, not rounded, not changed.
  - Character voice sketches must be consistent with the speechMannerisms and humourStyle
    from the character profiles. A character with humourStyle: "none" must not produce wit.
  - The historical moment section must reason from the specific year and month provided.
    It must not be a general description of the decade. A reviewer should be able to
    identify the approximate date from the historicalMoment section alone.
  - All text fields must be written as if addressed to a novelist about to write this story:
    purposeful, not bureaucratic; specific, not generic.
  - FIRST-PASS CONTRACT: satisfy storyTheme, revealImplications, and arcDescription minimum lengths in the initial response; do not rely on deterministic fallback expansion.
  - humourPlacementMap: every entry (all 12 scene positions) MUST include a non-empty
    "rationale" string. This applies to "forbidden" entries too — explain WHY it is forbidden.
    Omitting rationale on any entry will cause schema validation failure.
  - FIRST-PASS CONTRACT: include all required humourPlacementMap scene positions exactly once in the initial response.

You will produce a single JSON object. Return only the JSON. No preamble, no commentary.
```

## Message 2 (role=user)

```text
## INPUTS

### CASE
{
  "meta": {
    "title": "The Pendulum's False Hour",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "Early telephone usage",
        "Mechanical clocks and pendulums",
        "Fingerprinting and basic ballistics",
        "Strict social hierarchies in country estates",
        "No modern forensic technologies"
      ]
    },
    "setting": {
      "location": "Voss Manor",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "Manor house on country estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical clock-tampering concealed murder"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [
        "Daughter of the victim",
        "Respected among family and staff"
      ],
      "public_persona": "Composed and observant family member",
      "private_secret": "Keen interest in horology and mechanical devices",
      "motive_seed": "Desire to uncover truth and protect family name",
      "motive_strength": "moderate",
      "alibi_window": "Evening of the murder, 10:30 PM to midnight",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Free movement within manor after dinner",
        "Access to study and clock",
        "Private conversations with staff"
      ],
      "behavioral_tells": [
        "Careful questioning",
        "Attention to detail",
        "Reserved demeanor"
      ],
      "stakes": "Family reputation and estate stability",
      "evidence_sensitivity": [
        "Clock mechanics",
        "Witness statements timing",
        "Physical clock traces"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Family physician and confidante",
      "relationships": [
        "Longtime family doctor",
        "Trusted by victim",
        "Known to Eleanor"
      ],
      "public_persona": "Calm, professional medical expert",
      "private_secret": "Financially strained, anxious about estate's health",
      "motive_seed": "Potential financial gain from estate's downfall",
      "motive_strength": "moderate",
      "alibi_window": "Dinner hour, 8:30 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to victim's quarters for checkups",
        "Presence in house during evening",
        "Access to mechanical devices as medical hobby"
      ],
      "behavioral_tells": [
        "Nervous when questioned about timing",
        "Avoids speaking of clock",
        "Deflects inquiries about wax residue"
      ],
      "stakes": "Debt and potential inheritance",
      "evidence_sensitivity": [
        "Wax residue",
        "Medical timing records",
        "Suspicious alibi gaps"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "45-55",
      "role_archetype": "Estate manager and former military officer",
      "relationships": [
        "Long-serving estate manager",
        "Known disciplinarian to staff",
        "Collector of clocks and mechanical devices"
      ],
      "public_persona": "Authoritative, reliable, punctual",
      "private_secret": "Harbors resentment over estate finances",
      "motive_seed": "Frustration with declining estate and victim's decisions",
      "motive_strength": "moderate",
      "alibi_window": "Around murder time, claims stable inspection 10:45 PM to 11:15 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all estate grounds including clock room",
        "Private key to study and clock maintenance tools",
        "Stable lantern access"
      ],
      "behavioral_tells": [
        "Insists on punctuality",
        "Defensive about clock handling",
        "Claims no clock tampering knowledge"
      ],
      "stakes": "Professional pride and job security",
      "evidence_sensitivity": [
        "Clock suspension spring scratches",
        "Stable lantern timing",
        "Access logs"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Lady's maid and confidante to Eleanor",
      "relationships": [
        "Close to Eleanor Voss",
        "Friendly with household staff",
        "Privy to gossip and hidden movements"
      ],
      "public_persona": "Loyal, discreet, observant",
      "private_secret": "Knows about clock irregularities",
      "motive_seed": "Protect Eleanor and family reputation",
      "motive_strength": "low",
      "alibi_window": "Claims to be in servants’ quarters 10:30 PM to 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to victim’s private rooms",
        "Movements through service corridors",
        "Knowledge of clock winding routines"
      ],
      "behavioral_tells": [
        "Hints at noticing faint ticking changes",
        "Reluctant to speak about clock",
        "Mentions soot on pendulum bob"
      ],
      "stakes": "Employment and trust of family",
      "evidence_sensitivity": [
        "Pendulum soot marks",
        "Witnessed clock ticking irregularity",
        "Servants’ schedules"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Captain Ivor Hale"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "At the isolated Voss Manor in Little Middleton, Yorkshire, the head of the estate is found murdered. The manor’s grand clock stopped at ten minutes past eleven, suggesting the time of death. However, a meticulous investigation by Eleanor Voss reveals that the clock was tampered with, misleading everyone about the true timing of events. Through careful examination of the clock’s suspension spring, pendulum soot, and witness statements, Eleanor exposes Captain Ivor Hale as the culprit who manipulated the clock’s pendulum mechanism to hide the murder’s true time and evade suspicion."
    },
    "accepted_facts": [
      "The manor’s grandfather clock stopped at ten minutes past eleven.",
      "Fine scratches found on the clock’s pendulum suspension spring.",
      "A subtle soot mark observed on the pendulum bob.",
      "Beatrice Quill noticed faint irregular ticking during the evening.",
      "Captain Hale claimed to be inspecting the stables between 10:45 PM and 11:15 PM.",
      "Victim was found dead before the clock stopped.",
      "The sundial reading contradicted the clock reading.",
      "Stable lantern was extinguished after the murder."
    ],
    "inferred_conclusions": [
      "The clock was deliberately wound back by forty minutes.",
      "The pendulum’s altered oscillation caused accelerated time rollback.",
      "The murder occurred earlier than the clock’s stopped time indicated.",
      "Captain Hale’s alibi is falsified due to timing contradictions.",
      "Clock tampering was premeditated and executed to mislead investigators."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "Captain Ivor Hale manipulated the grandfather clock’s pendulum suspension spring, causing it to wind back forty minutes while accelerating the pendulum’s oscillations. This physical law exploitation created an illusion that the clock stopped at ten past eleven, misleading all about the true murder time which was earlier. Fine scratches on the suspension spring and soot on the pendulum bob arose from this tampering. Witnesses’ reports of ticking irregularities and timing contradictions with the sundial and stable lantern reveal the deception.",
      "delivery_path": [
        {
          "step": "Captain Hale accessed the clock room with the study key after dinner."
        },
        {
          "step": "He carefully altered the suspension spring tension to rewind the clock backward."
        },
        {
          "step": "He extinguished the stable lantern later to create a false timeline."
        },
        {
          "step": "The altered pendulum oscillation accelerated the clock’s rollback unnoticed."
        },
        {
          "step": "The clock stopped at a falsified time, concealing the actual murder moment."
        }
      ]
    },
    "outcome": {
      "result": "The false clock time misled all into believing the murder occurred later, allowing Captain Hale to fabricate an alibi and initially evade suspicion."
    }
  },
  "false_assumption": {
    "statement": "The stopped manor clock’s displayed time of ten minutes past eleven accurately marks the time of the murder.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock is a trusted timekeeper in the household; witnesses report hearing it strike around that time; the stopped clock’s hands align with the victim’s last confirmed sighting.",
    "what_it_hides": "The clock was deliberately wound back by forty minutes via suspension spring tampering, causing an unobservable acceleration of pendulum oscillations that concealed the true, earlier murder time."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock stopped at 11:10 PM",
        "Stable lantern extinguished after murder",
        "Victim last seen alive before 11:00 PM"
      ],
      "windows": [
        "Alibi window of Captain Hale: 10:45 PM to 11:15 PM",
        "Eleanor Voss’ presence in study: 10:30 PM to midnight"
      ],
      "contradictions": [
        "Clock time vs sundial solar time mismatch",
        "Stable lantern extinguishing time later than clock stop",
        "Witnesses heard faint irregular ticking before clock stopped"
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Beatrice Quill"
      ],
      "objects": [
        "Grandfather clock",
        "Clock suspension spring",
        "Stable lantern",
        "Study room key"
      ],
      "permissions": [
        "Captain Hale has access to clock room and study",
        "Eleanor has free access to manor",
        "Dr. Finch limited to medical areas",
        "Beatrice limited to servants’ quarters and family rooms"
      ]
    },
    "physical": {
      "laws": [
        "Pendulum oscillation period depends on suspension spring tension and length",
        "Mechanical clocks cannot run backwards without tampering",
        "Wax melting rate affected by heat from lantern",
        "Soot deposits occur from smoke exposure"
      ],
      "traces": [
        "Fine scratches on suspension spring",
        "Soot mark on pendulum bob",
        "Faint ticking irregularity in clock",
        "Wax drips on stable floor"
      ]
    },
    "social": {
      "trust_channels": [
        "Family trust in Captain Hale’s punctuality",
        "Staff reliance on clock time for duties",
        "Eleanor’s authority as victim’s daughter"
      ],
      "authority_sources": [
        "Captain Hale’s role as estate manager",
        "Eleanor’s social standing as family member",
        "Dr. Finch’s medical expertise"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Fine scratches are visible on the clock’s pendulum suspension spring under close inspection.",
        "correction": "These scratches indicate recent tampering inconsistent with normal clock maintenance schedules.",
        "effect": "Narrows suspect pool to those with access and mechanical knowledge, eliminating Dr. Finch and Beatrice due to lack of access or expertise.",
        "required_evidence": [
          "Fine scratches on clock’s suspension spring",
          "Access permissions showing Captain Hale’s legitimate presence in clock room",
          "Beatrice Quill’s limited access to clock room",
          "Dr. Finch’s alibi during clock maintenance times"
        ],
        "reader_observable": true
      },
      {
        "observation": "Beatrice Quill reports hearing a faint irregular ticking from the grandfather clock during the evening, inconsistent with normal operation.",
        "correction": "The ticking irregularity aligns with a mechanical alteration causing accelerated pendulum oscillations.",
        "effect": "Eliminates suspects who were absent during the ticking irregularity and narrows timing window for clock tampering.",
        "required_evidence": [
          "Beatrice’s witness statement about clock ticking",
          "Clock mechanical principles regarding pendulum oscillations",
          "Witness logs of Captain Hale’s movements around 10:45 PM",
          "Eleanor’s presence in the manor at the time"
        ],
        "reader_observable": true
      },
      {
        "observation": "The stable lantern was extinguished after the clock stopped, as evidenced by soot patterns and temperature residue inconsistent with claimed timing.",
        "correction": "The extinguishing of the lantern postdates the clock’s stopped time, contradicting Captain Hale’s alibi of stable inspection during the murder time.",
        "effect": "Eliminates Captain Hale’s alibi, placing him at the manor during the critical time window.",
        "required_evidence": [
          "Soot patterns on stable floor",
          "Lantern glass temperature residue",
          "Captain Hale’s statement about stable inspection time",
          "Clock stopped time at 11:10 PM"
        ],
        "reader_observable": true
      },
      {
        "observation": "The sundial’s shadow reading at the time of murder does not correspond with the grandfather clock’s stopped time, showing a solar time discrepancy of over forty minutes.",
        "correction": "This discrepancy confirms the clock’s time is artificially altered, supporting the clock winding back hypothesis.",
        "effect": "Confirms the false assumption about clock time and narrows timing of murder to earlier than 11:10 PM.",
        "required_evidence": [
          "Sundial shadow angle and position",
          "Historical solar azimuth data for the day",
          "Clock stopped time reading",
          "Gardener’s report of sundial adjustments"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled comparison of the grandfather clock’s pendulum suspension spring tension and oscillation timing is conducted alongside sundial solar readings and stable lantern extinguishing records to prove that the clock was deliberately wound back by forty minutes, creating a false timeline. The test exposes the contradiction between Captain Hale’s alibi and physical clock evidence, confirming his premeditated tampering and guilt.",
    "knowledge_revealed": "The clock’s mechanical alteration and timing contradictions prove Captain Hale’s guilt and premeditation in manipulating the clock to conceal the murder time.",
    "pass_condition": "The evidence conclusively shows the suspension spring’s tampering and accelerated pendulum oscillation, invalidating Captain Hale’s alibi and confirming the murder occurred earlier than the clock’s stopped time.",
    "evidence_clues": [
      "clue_9",
      "clue_mechanism_visibility_core",
      "clue_6"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The fine scratches on the suspension spring and access permissions reveal who could tamper with the clock. Step 2: Beatrice’s report of ticking irregularity and knowledge of pendulum mechanics narrow the timing and suspects. Step 3: The soot patterns and lantern extinguishing timing contradict Captain Hale’s alibi. Step 4: The sundial’s solar reading discrepancy confirms the clock’s false time. The discriminating test uses all these clues to definitively prove Captain Hale’s guilt."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 3,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 5,
      "essential_clues_before_test": true,
      "early_clues_min": 2,
      "mid_clues_min": 2,
      "late_clues_min": 1
    },
    "discriminating_test_requirements": {
      "timing": "early_act3",
      "must_reference_inference_step": true
    }
  },
  "prose_requirements": {
    "discriminating_test_scene": {
      "act_number": 3,
      "scene_number": 4,
      "required_elements": [
        "Execute the pendulum suspension spring tension comparison",
        "Compare sundial solar time to clock time",
        "Present soot and lantern timing contradictions",
        "Observe Captain Hale’s inability to reconcile evidence",
        "Draw conclusion of guilt based on timing contradictions"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verified by staff and limited access to clock room",
        "supporting_clues": [
          "Dr. Finch’s presence during dinner hour",
          "No access to clock room at tampering time"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Servants’ quarters log and consistent schedule",
        "supporting_clues": [
          "Beatrice’s alibi 10:30 PM to 11:30 PM",
          "Limited access to clock room"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Presence in study and impartial investigation",
        "supporting_clues": [
          "Eleanor’s alibi and status as detective",
          "No physical evidence linking to tampering"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with mechanical evidence and alibi contradictions"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "The formidable matriarch of Voss Manor, Eleanor commands respect with her poised dignity, while privately wrestling with the estate’s financial decline.",
    "publicPersona": "Eleanor Voss is the very image of aristocratic composure. As estate owner and family head, she manages Voss Manor with a strict but fair hand, hosting formal gatherings that reinforce her social standing. Her genteel hospitality masks a steely resolve to maintain her family’s legacy amidst mounting pressures.",
    "privateSecret": "Behind closed doors, Eleanor harbors deep anxiety about Voss Manor’s precarious finances. She has engaged in covert dealings with creditors, desperate to stave off ruin. This knowledge gnaws at her, threatening the façade of control she so carefully cultivates.",
    "motiveSeed": "N/A (detective)",
    "motiveStrength": "weak",
    "alibiWindow": "Present hosting a formal luncheon in the drawing room from 1pm until the discovery of the body at 3:15pm",
    "accessPlausibility": "easy",
    "stakes": "Her social standing and family legacy hang in the balance. Proving her competence against rising financial and social pressures is paramount, as any scandal could shatter the fragile respect she commands.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "Eleanor speaks with measured grace, her tone calm and deliberate, often using formal constructions and subtle irony. She rarely raises her voice but lets a pointed remark or a carefully chosen phrase carry the weight of her wit. Her humour is dry and understated, revealing itself in quiet asides rather than overt jokes.",
    "internalConflict": "Eleanor wrestles with the fear that her efforts to preserve the estate’s reputation may be futile. The weight of impending financial collapse and the threat of scandal challenge her identity as the family’s unwavering pillar.",
    "personalStakeInCase": "This case is deeply personal; the murder strikes at the heart of her family and her life’s work. She must navigate the investigation with care to protect the estate and her own fragile authority, proving she remains the head of Voss Manor in more than name.",
    "paragraphs": [
      "Eleanor Voss holds court in the drawing room of Voss Manor with the poise of a seasoned matriarch. Her presence commands the room, a blend of aristocratic dignity and sharp intellect. Yet beneath her composed exterior lies a woman burdened by the relentless decline of her family’s fortune, a secret she guards as fiercely as the manor itself.",
      "Her management style is strict but just, balancing tradition with the harsh realities of a changing world. Eleanor’s genteel hospitality masks a steely resolve to maintain appearances, even as creditors’ letters pile up in secret drawers. She moves through the household with the assurance of someone who has weathered storms before, though this one threatens to unravel everything.",
      "During the luncheon on the day of the murder, Eleanor’s keen eye misses little. Her questions are polite but probing, her conversation measured. She is aware of the undercurrents among her guests, the subtle tensions that might otherwise go unnoticed. Her role as amateur sleuth is born not of choice but necessity, as the official investigation seems blind to the nuances only she can discern.",
      "Eleanor’s humour is a shield and a sword. Delivered with understated elegance, her dry wit cuts through pretense without ever seeming unkind. It is a tool she wields sparingly, revealing a mind that sees far more than it says. This subtlety makes her both respected and underestimated—a duality she understands well.",
      "Her internal conflict simmers beneath the surface. Eleanor fears that the truth of the estate’s decline—and the secrets she keeps—may come to light, undermining her authority and shattering the family’s reputation. This fear drives her determination to solve the crime herself, to prove that she remains the true head of Voss Manor, capable of steering it through its darkest hour.",
      "The stakes could not be higher. Beyond justice for the victim, Eleanor fights for the survival of her family’s legacy. Every revelation in the case threatens to unravel the delicate social fabric she has maintained. Her investigation is as much about safeguarding the future as it is about uncovering the past."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected county physician whose professional reputation and career hang by a thread, Dr. Finch conceals a dangerous secret that could destroy her.",
    "publicPersona": "Dr. Mallory Finch is known throughout the county as a consummate professional—discreet, competent, and trusted. Her medical expertise has earned her a place among the local elite, where her reputation for confidentiality is as valued as her skill.",
    "privateSecret": "Beneath this veneer lies a troubling secret: Dr. Finch recently uncovered that the victim suffered from a serious health condition, one that the victim kept hidden to preserve social standing. More damning, Dr. Finch fears exposure of a misdiagnosis on her part, which could ruin her career and invite scandal.",
    "motiveSeed": "Stands to lose professional reputation and lucrative contracts if victim reveals her secret misdiagnosis; feared victim would report malpractice, ending her career.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed to be attending a neighboring patient at the time of murder, verified partially but with some gaps between 2:45pm and 3:10pm",
    "accessPlausibility": "possible",
    "stakes": "Her entire professional standing and future income depend on maintaining discretion and silence. In a competitive medical community stratified by social connections, reputation is currency.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory’s speech is precise and measured, often punctuated by a sharp, dry wit that surfaces in moments of tension. She favors succinct, sometimes clinical phrasing but occasionally allows a sardonic comment to slip through, revealing a mind both analytical and guarded.",
    "internalConflict": "Mallory struggles with the ethical dilemma of protecting her career at the cost of truth and justice. The pressure to conceal her professional failings clashes with a genuine desire to do right by her patients and the victim’s memory.",
    "personalStakeInCase": "The victim’s death threatens to expose a misdiagnosis that could end Mallory’s medical career and disgrace her in the eyes of the community. This case is a battle for survival, both professional and personal.",
    "paragraphs": [
      "Dr. Mallory Finch moves through Voss Manor with the assuredness of one accustomed to command, her medical bag a quiet testament to her profession. To outsiders, she is the epitome of discretion and competence, a trusted figure in the county’s social and medical circles. Yet beneath this polished exterior, a storm brews.",
      "The victim’s concealed health condition was a ticking time bomb, one Mallory discovered with growing dread. The potential scandal of a misdiagnosis, if revealed, would not just ruin her reputation but could end her career. She finds herself caught in a web of fear and calculation, balancing professional ethics against self-preservation.",
      "Her alibi is careful but imperfect. While attending to a neighbor’s patient, she admits to gaps in her whereabouts during the critical window. This ambiguity weighs heavily, as the stakes are nothing less than her livelihood. Mallory’s knowledge of medicine provides crucial insights, yet also exposes her vulnerabilities.",
      "Mallory’s humour is a shield, dry and cutting, often veiled beneath formal politeness. She wields it sparingly but effectively, defusing tension with a well-timed quip or a sardonic observation. This wit hints at a sharp mind constantly analyzing the motives and weaknesses of those around her.",
      "The internal conflict is acute. Mallory’s professional integrity battles with the instinct to protect herself at all costs. The victim’s death is not merely a tragedy but a potential unraveling of her carefully constructed life. This tension drives her actions and colours her interactions with others.",
      "Her personal stake is profound. The investigation threatens to expose secrets that could destroy her standing and livelihood. Every piece of evidence uncovered feels like a step closer to professional exile, making the quest for truth as much a fight for survival as for justice."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A disciplined, brusque estate manager and former military officer, Captain Hale is torn between loyalty to tradition and the harsh realities threatening his position.",
    "publicPersona": "Captain Ivor Hale commands respect through his strict enforcement of estate rules and his military bearing. His efficiency is unquestioned, though his brusque manner and rigid discipline often alienate the staff he manages.",
    "privateSecret": "Beneath his stern exterior, Hale harbors resentment toward the victim’s plans to cut staff and reduce wages. Secretly, he has negotiated with rival estates, seeking to secure his future should he lose his post.",
    "motiveSeed": "Faced with dismissal and loss of livelihood if victim’s reforms proceed; believed murder could halt the changes and preserve his position and income.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been inspecting the stables between 2:30pm and 3:00pm; no direct witnesses but staff recall seeing him near outbuildings.",
    "accessPlausibility": "easy",
    "stakes": "His social status and financial security rest on maintaining his role. The decline of the estate threatens his place in a fading class system, making resistance to change a matter of survival.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Hale speaks in clipped military cadence, favoring brevity and command. Yet, when relaxed or frustrated, he slips into dry, self-deprecating remarks that reveal a weary awareness of his own limitations and the changing world around him.",
    "internalConflict": "Hale is caught between his ingrained sense of duty and the pragmatic need to adapt or lose everything. His loyalty to the estate clashes with his fear of social and economic demotion.",
    "personalStakeInCase": "The murder threatens the very future of his livelihood and social standing. Hale’s involvement is driven by a desire to protect his position and resist the upheaval the victim’s reforms would bring.",
    "paragraphs": [
      "Captain Ivor Hale carries himself with the rigid discipline of a former military officer, his presence imposing across the grounds of Voss Manor. His management of the estate is marked by efficiency and order, yet his brusque manner often alienates those under his charge. To Hale, the estate is more than a job—it is a bastion of tradition.",
      "Recent financial strains and the victim’s plans for staff cuts have unsettled him deeply. Beneath his stern exterior simmers a resentment born of fear: the prospect of losing his position and the status it affords. Secret negotiations with rival estates reveal his desperation to secure a foothold should the worst come to pass.",
      "On the afternoon of the murder, Hale claims to have been inspecting the stables, a solitary figure seen only at a distance by the staff. The lack of direct witnesses to his precise movements leaves room for doubt. His access to the manor and grounds is unquestioned, his authority unquestioned, yet the tensions within him are palpable.",
      "His humour is a quiet surprise—self-deprecating and dry, it surfaces in moments of candid conversation. Hale can joke about his own stubbornness or the fading relevance of his class, revealing a man who knows the world is changing faster than he can keep pace.",
      "Internally, Hale battles a profound conflict. His military sense of duty and loyalty to the estate clash with the pragmatic reality that change may be inevitable. The fear of losing his place in a declining social order weighs heavily, coloring his every action and decision.",
      "The stakes are deeply personal. The murder threatens to accelerate the changes Hale fears most, potentially ending his career and social standing. His resolve to uncover the truth is entangled with a desire to preserve the world he has known, making his role in the investigation both professional and existential."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An ambitious and secretive personal secretary whose desperate desire for upward mobility drives her to dangerous choices.",
    "publicPersona": "Beatrice Quill is the embodiment of efficiency and loyalty as the victim’s personal secretary. Known for her discretion and competence, she is admired for her quiet dedication and aspires to transcend her modest beginnings.",
    "privateSecret": "Beneath this facade, Beatrice has been embezzling from estate funds. The victim’s recent scrutiny and audits threaten to expose her theft, risking disgrace and financial ruin.",
    "motiveSeed": "Faced immediate disgrace and ruin if exposed; believed murder was necessary to silence the victim before audits concluded.",
    "motiveStrength": "strong",
    "alibiWindow": "Reportedly in the study typing correspondence until just before the estimated time of death, but no witnesses verify her whereabouts after 3:00pm",
    "accessPlausibility": "easy",
    "stakes": "Her ambitions for social advancement and financial independence are at stake. Exposure would destroy all she has schemed for, making the crime a desperate gambit to protect her future.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with polished poise, often employing a veneer of politeness that thinly veils a sharp, sometimes cutting wit. Her remarks can carry a subtle edge, a social precision that disarms or unsettles her interlocutors.",
    "internalConflict": "Beatrice is torn between her desire to rise above her origins and the guilt of betraying the trust placed in her. Her ambition drives reckless decisions that clash with moments of genuine remorse.",
    "personalStakeInCase": "The case threatens to unravel her carefully constructed path to advancement. Exposure would mean not only disgrace but the loss of all hope for a better life, making her involvement a desperate fight for survival.",
    "paragraphs": [
      "Beatrice Quill moves through Voss Manor with the polished efficiency of a woman who knows her place—but dreams of a higher one. As the victim’s personal secretary, she is the epitome of discretion and diligence, managing correspondence and schedules with quiet competence. Yet beneath this polished surface lies a restless ambition.",
      "Her embezzlement of estate funds is a secret she guards jealously, aware that the victim’s recent audits threaten to expose her. The fear of disgrace and financial ruin weighs heavily, pushing her toward desperate measures. The murder, in her mind, is a calculated risk to silence the threat before it becomes reality.",
      "Beatrice’s alibi is thin; she was last seen typing in the study shortly before the estimated time of death, but no one can confirm her whereabouts thereafter. This gap fuels suspicion, as does her easy access to the victim and the manor’s inner workings.",
      "Her humour is a blend of polite savagery and social finesse. She wields wit like a finely honed blade, delivering remarks that are courteous on the surface but laced with subtle barbs. This style serves both to mask her insecurities and to assert control in social interactions.",
      "Inside, Beatrice grapples with conflicting emotions. Her ambition drives her toward reckless decisions, yet moments of guilt and self-doubt flicker through her carefully constructed persona. She is caught between the desire for advancement and the moral cost of her actions.",
      "The stakes could not be higher. This case threatens to undo all her efforts to climb the social ladder. Exposure would mean not only personal ruin but the end of her dreams for independence and status. Her involvement in the investigation is as much about saving herself as about the search for truth."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Voss Manor",
    "type": "Manor house on country estate",
    "place": "Ashcombe, Devonshire",
    "country": "England",
    "summary": "Voss Manor, a sprawling 18th-century country house nestled in the remote Devonshire countryside near Ashcombe village, serves as both family residence and agricultural hub, its vast grounds punctuated by gardens, stables, and outbuildings.",
    "visualDescription": "The manor’s grey stone façade is weathered by time and damp, with tall mullioned windows set deep in thick walls, steep slate roofs punctuated by ornate chimneys, and creeping ivy climbing the corners. The grounds spread wide with clipped box hedges, gravel drives, and dense woodland beyond, while the stables and outbuildings cluster near the rear, their timber framing darkened by rain and age.",
    "atmosphere": "A brooding, formal atmosphere pervades Voss Manor, underscored by the ever-present threat of rain and fog that muffles sound and narrows sightlines, while the social hierarchies within the household add a layer of tense restraint.",
    "paragraphs": [
      "Voss Manor stands isolated amidst the rolling Devonshire hills, its stone walls weather-beaten by decades of relentless drizzle and wind. The approach road, a narrow and rutted country lane, winds through dense hedgerows, the last glimpse of civilization several miles behind. The manor’s architecture is imposing yet compartmentalized; high stone walls and heavy oak doors restrict movement, while narrow corridors and staircases create natural bottlenecks. At dusk, the estate’s extensive gardens and woodland rapidly darken, limiting visibility and fostering a sense of seclusion.",
      "Inside, polished dark wood paneling and heavy velvet drapes absorb the scarce light filtering through rain-streaked windows. The family quarters are richly appointed but carefully segregated from servant areas by locked doors and discreet passages. The servants’ schedules are tightly regimented; their footsteps echo faintly on stone floors, while whispered conversations are held in hushed corners. The telephone party line crackles intermittently in the library, and the ticking of the grandfather clock in the hall punctuates the heavy silence.",
      "Beyond the house, the estate’s agricultural operations hum quietly under the damp skies. The stables emit the musky scent of hay and horses, while the vegetable gardens lie sodden under the grey heavens. The gatekeeper secures the wrought-iron gates at nightfall, ensuring no unauthorised entry. The isolation of Voss Manor, combined with the strict social codes and the manor’s labyrinthine layout, creates a setting ripe for secrets, concealment, and slow-burning tension.",
      "The manor’s atmosphere is charged with the unease of the era—economic uncertainty and political unrest abroad cast long shadows within these walls. Guests and family alike navigate the formal etiquette with careful precision, their conversations laced with subtext. Each room holds its own story, each corridor a potential hiding place, as the manor itself seems to hold its breath beneath the relentless Devon rain."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "overcast skies with intermittent drizzle common, creating damp and muddy conditions on estate grounds",
    "timeFlow": "Three days of mounting tension culminating in a climactic revelation",
    "mood": "tense and formal, underscored by social unease from economic pressures and political uncertainties abroad",
    "eraMarkers": [
      "petrol touring cars on country roads",
      "domestic telephone lines with party-line exchanges",
      "manual typewriters for correspondence and record-keeping",
      "battery-powered radios common in sitting rooms",
      "passenger steam trains connecting nearest town to major cities",
      "telephones connected via manual exchanges, often party-line"
    ],
    "sensoryPalette": {
      "dominant": "damp stone and wet earth",
      "secondary": [
        "wood smoke and beeswax polish",
        "heavy velvet drapes and worn leather"
      ]
    },
    "paragraphs": [
      "The persistent drizzle softens the landscape around Voss Manor, saturating the earth and darkening the stone walls to a somber grey. The air is thick with the scent of damp moss and wet wood, mingled with the faint smoke of peat fires burning low within the hearths. Footsteps on gravel paths are muffled by a layer of soaked leaves, while the occasional drip of rain from eaves punctuates the heavy silence. Inside, the scent of beeswax polish and old leather lingers beneath the muted glow of gaslight and candles, evoking a world caught between tradition and change.",
      "Sound is subdued by the thick walls and heavy furnishings, with the soft ticking of clocks and the distant murmur of voices carrying through closed doors. The estate’s isolation is palpable, emphasized by the limited road access and locked gates that close at night. The manor’s architecture, with its narrow corridors and locked chambers, creates a labyrinthine environment where secrets thrive and every shadow may conceal a clue or a threat. The atmosphere is one of constrained elegance, where every detail—from the creak of a floorboard to the whisper of silk—carries weight."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Voss Manor Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A high-ceilinged room lined with dark oak bookcases filled with leather-bound volumes; heavy velvet drapes frame tall mullioned windows; a large mahogany desk dominates the centre, cluttered with papers and a manual typewriter; a roaring stone fireplace with wrought-iron tools; Persian rugs soften the stone floor.",
      "sensoryDetails": {
        "sights": [
          "flickering candle flames",
          "rain-streaked window panes",
          "glossy leather-bound books",
          "polished mahogany desk surface",
          "glowing embers in hearth",
          "scattered typed papers"
        ],
        "sounds": [
          "crackling fire",
          "soft rustle of turning pages",
          "distant ticking of grandfather clock",
          "muffled footsteps on stone floor",
          "whispered voices beyond door",
          "occasional telephone ring"
        ],
        "smells": [
          "beeswax polish",
          "old leather and paper",
          "smoky peat fire",
          "faint scent of pipe tobacco",
          "musty book bindings",
          "damp stone walls"
        ],
        "tactile": [
          "worn leather armchair",
          "smooth polished wood",
          "rough stone hearth edge",
          "cool brass lamp fittings",
          "crisp typed paper edges",
          "velvet curtain folds"
        ]
      },
      "accessControl": "Library remains locked after dinner; family members and select staff permitted access during the day; visitors admitted only by invitation; servants restricted to cleaning duties outside visiting hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "grey light filtering through curtains",
            "glossy wet garden views"
          ],
          "sounds": [
            "steady drumming on roof slates",
            "water trickling in gutter spouts",
            "distant low thunder"
          ],
          "smells": [
            "damp earth",
            "wet stone",
            "smoky peat fire"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light",
            "shadows without edges",
            "dust motes in still air"
          ],
          "sounds": [
            "silence broken by clock ticking",
            "creak of settling timbers",
            "soft rustle of pages"
          ],
          "smells": [
            "beeswax polish",
            "dust",
            "woodsmoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight catching brass fittings",
            "long shadows across floorboards",
            "flickering firelight on bookshelves"
          ],
          "sounds": [
            "tick of mantel clock",
            "distant voices from below stairs",
            "fire crackling softly"
          ],
          "smells": [
            "candle wax",
            "tobacco smoke",
            "cold fireplace ash"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library at Voss Manor is a sanctuary of order and knowledge amid the sprawling estate, its dark oak shelves laden with volumes that speak of history, law, and literature. The heavy velvet drapes, drawn against the persistent drizzle outside, deepen the room’s shadows, while the roaring peat fire offers a flickering warmth that barely dispels the chill seeping through the stone walls. The large mahogany desk, cluttered with typed and handwritten correspondence, commands the room’s centre, its surface scarred by years of use.",
        "This room’s atmosphere is one of restrained formality, where silence is punctuated only by the occasional crackle of the fire or the faint ticking of the grandfather clock. The scent of beeswax polish and old leather mingles with the faint smoke of a pipe long extinguished, while the worn leather armchair invites reflection or quiet plotting. Access is tightly controlled, the library locked after dinner, ensuring that only those with explicit permission may enter, preserving the room’s secrets and clues within its shadowed recesses."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants' Hall",
      "type": "interior",
      "purpose": "Gathering space for staff; clue discovery",
      "visualDetails": "A modest room with plain wooden tables and benches, whitewashed walls, a large cast-iron stove in one corner, and a small window looking out onto the kitchen courtyard; well-worn floorboards and a hanging rack for coats and boots.",
      "sensoryDetails": {
        "sights": [
          "glimmer of polished pewter plates",
          "glowing stove embers",
          "streaks of morning light",
          "coats and boots hanging",
          "simple crockery on tables",
          "scuffed floorboards"
        ],
        "sounds": [
          "clinking of utensils",
          "low murmur of voices",
          "footsteps on wooden floor",
          "occasional laughter",
          "crackling stove fire",
          "distant kitchen clatter"
        ],
        "smells": [
          "boiling stew",
          "wet wool and leather",
          "smoke from stove",
          "fresh bread",
          "soapy water",
          "damp stone"
        ],
        "tactile": [
          "rough wooden bench",
          "warm stove surface",
          "cool stone windowsill",
          "coarse woolen clothing",
          "smooth ceramic mug",
          "sticky wooden table"
        ]
      },
      "accessControl": "Restricted to household staff only; no family members permitted; staff must report movements here before and after shifts; locked at night with keys held by senior housekeeper.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through small window",
            "steam rising from mugs",
            "wet coats hanging"
          ],
          "sounds": [
            "water dripping from boots",
            "murmur of waking voices",
            "stove crackling"
          ],
          "smells": [
            "hot porridge",
            "damp wool",
            "smoky stove"
          ],
          "mood": "busy anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering",
            "empty tables",
            "shadows near corners"
          ],
          "sounds": [
            "distant kitchen noises",
            "soft footsteps",
            "quiet breathing"
          ],
          "smells": [
            "cleaning soap",
            "cold stone",
            "lingering stew aroma"
          ],
          "mood": "quiet tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm stove glow",
            "shadows on walls",
            "empty mugs on table"
          ],
          "sounds": [
            "soft chatter",
            "fire crackle",
            "closing door"
          ],
          "smells": [
            "smoke and soot",
            "washed linens",
            "earthy dampness"
          ],
          "mood": "relaxed respite"
        }
      ],
      "paragraphs": [
        "The servants’ hall is a humble refuge from the grandeur of the manor, its plain wooden tables and benches worn smooth by years of use. The cast-iron stove radiates a comforting heat, the centrepiece around which the staff gather for meals and brief respites. The room hums with quiet activity, the clatter of crockery mingling with low voices and occasional laughter, a stark contrast to the formality beyond the servant’s corridors.",
        "Despite its modesty, the hall is a nexus of information and movement within the estate. Access is strictly limited to staff, and the housekeeper holds the keys, ensuring order and discipline. The smells of boiling stew and fresh bread fill the air, while the dampness of the outside world clings to wet coats and boots hung near the window. It is here that whispered confidences and observations often surface, making the hall a vital location for uncovering hidden clues."
      ]
    },
    {
      "id": "estate_gardens",
      "name": "Formal Gardens",
      "type": "exterior",
      "purpose": "Outdoor setting for meetings and clue discovery",
      "visualDetails": "Manicured box hedges form symmetrical parterres around gravel paths; stone statues and sundials punctuate the green; large ancient oaks and yews create shaded groves; a wrought-iron bench sits beneath a weathered pergola entwined with climbing roses.",
      "sensoryDetails": {
        "sights": [
          "clipped box hedges",
          "rain-darkened gravel paths",
          "stone statues weathered by moss",
          "shadows beneath ancient oaks",
          "dripping rose petals",
          "gleam of wrought-iron bench"
        ],
        "sounds": [
          "soft rustle of leaves",
          "drip of water from eaves",
          "distant bird calls",
          "footsteps on gravel",
          "murmur of wind",
          "faint creak of pergola"
        ],
        "smells": [
          "wet earth and moss",
          "fragrant climbing roses",
          "fresh-cut grass",
          "damp stone",
          "pine resin",
          "decaying leaves"
        ],
        "tactile": [
          "rough stone statue surface",
          "cool wrought-iron bench",
          "soft rose petals",
          "damp gravel crunch",
          "smooth box hedge leaves",
          "chill mist on skin"
        ]
      },
      "accessControl": "Gardens are accessible to family and select visitors during daylight; locked gates restrict access after dusk; servants maintain grounds early morning and late afternoon; isolation limits chance encounters.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-slicked leaves",
            "grey sky through branches",
            "pools on gravel paths"
          ],
          "sounds": [
            "steady rain drip",
            "soft splash of puddles",
            "distant thunder rumble"
          ],
          "smells": [
            "wet earth",
            "fresh rain on roses",
            "damp moss"
          ],
          "mood": "melancholy isolation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on hedges",
            "deep shadows under trees",
            "dim reflections in puddles"
          ],
          "sounds": [
            "rustling leaves",
            "far-off bird song",
            "soft wind whispers"
          ],
          "smells": [
            "damp grass",
            "pine resin",
            "earthy decay"
          ],
          "mood": "brooding stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "long shadows on gravel",
            "silver moonlight on leaves",
            "glint of dew on roses"
          ],
          "sounds": [
            "night insects chirping",
            "soft breeze",
            "distant owl call"
          ],
          "smells": [
            "cool night air",
            "fresh-cut grass",
            "faint floral perfume"
          ],
          "mood": "quiet suspense"
        }
      ],
      "paragraphs": [
        "The formal gardens at Voss Manor offer a meticulously maintained outdoor refuge, where clipped box hedges and symmetrical parterres frame the gravel paths that wind through stone statues and ancient trees. The ever-present drizzle darkens the foliage and saturates the earth, lending a somber tone to the greenery. A wrought-iron bench beneath a pergola entwined with roses provides a secluded spot for private conversations or furtive meetings.",
        "The gardens’ layout, with their deep shadows and hidden groves, creates natural concealment and limits sightlines, especially as daylight fades. Access is carefully regulated, with gates locked at dusk and groundskeepers attending to the plants during the quieter hours. The mingling scents of wet earth, moss, and fragrant roses combine with the muffled sounds of dripping water and rustling leaves, crafting an atmosphere charged with both beauty and latent unease."
      ]
    },
    {
      "id": "stable_yard",
      "name": "Stable Yard",
      "type": "exterior",
      "purpose": "Agricultural hub; potential clue discovery",
      "visualDetails": "A courtyard enclosed by timber-framed stables and tack rooms; cobbled surfaces worn smooth; stacks of hay bales and leather harnesses hanging on walls; heavy wooden doors secured with iron bolts; lanterns mounted on walls for night illumination.",
      "sensoryDetails": {
        "sights": [
          "glossy horse coats",
          "stacked hay bales",
          "worn leather bridles",
          "cobblestone courtyard",
          "iron lanterns unlit",
          "muddy hoofprints"
        ],
        "sounds": [
          "soft neighs and snorts",
          "clatter of hooves on stone",
          "rustle of hay",
          "creak of wooden doors",
          "distant crow of rooster",
          "drip of water from eaves"
        ],
        "smells": [
          "fresh hay and straw",
          "earthy dampness",
          "horse sweat and leather",
          "wood smoke from nearby chimney",
          "wet stone",
          "oily harness polish"
        ],
        "tactile": [
          "rough hay stalks",
          "smooth horsehair",
          "cool iron door handles",
          "chilled cobblestone",
          "coarse leather straps",
          "damp wooden beams"
        ]
      },
      "accessControl": "Access limited to stable staff and authorized family members; gates locked at night with keys held by stablemaster; visitors escorted when present; work schedules strictly observed.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "wet cobblestones",
            "shiny horse coats",
            "grey skies over yard"
          ],
          "sounds": [
            "dripping water",
            "soft neighing",
            "footsteps splashing mud"
          ],
          "smells": [
            "wet hay",
            "earthy dampness",
            "smoke from chimney"
          ],
          "mood": "busy, damp routine"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light on wooden beams",
            "shadows under eaves",
            "stillness in yard"
          ],
          "sounds": [
            "distant crowing",
            "soft rustle of hay",
            "quiet hooves"
          ],
          "smells": [
            "leather and sweat",
            "damp stone",
            "wood smoke"
          ],
          "mood": "steady calm"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glimmer of lantern light",
            "long shadows on cobbles",
            "shiny harness fittings"
          ],
          "sounds": [
            "soft neighs",
            "closing wooden doors",
            "night breeze"
          ],
          "smells": [
            "cool night air",
            "fresh hay",
            "smoky warmth"
          ],
          "mood": "quiet closure"
        }
      ],
      "paragraphs": [
        "The stable yard is a functional heart of the estate’s agricultural life, its timber-framed buildings enclosing a cobbled courtyard where horses are groomed and harnesses maintained. The scent of fresh hay and leather mingles with the earthy dampness that clings to the stone underfoot, while the soft sounds of neighing and the occasional creak of wooden doors fill the air. Lanterns mounted on the walls promise dim illumination after dusk, though their light is often swallowed by the heavy evening mist.",
        "Access here is tightly controlled, with only stable staff and authorized family permitted beyond the gates, which are securely locked at night. The routine of the yard is steady and disciplined, with work beginning early and ending as daylight fades. The combination of tactile textures—the rough hay, smooth horsehair, and cold iron fittings—grounds the space in practical reality, making it a crucial setting for the discovery of physical clues hidden amidst everyday activity."
      ]
    }
  ],
  "note": "",
  "cost": 0.00683034,
  "durationMs": 44298
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1937,
    "month": "March",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "March",
    "weather": [
      "overcast skies with frequent intermittent drizzle",
      "damp and muddy conditions on estate grounds",
      "chilly mornings with occasional gusts of wind"
    ],
    "daylight": "Increasing daylight with sunset around 6:15 pm, twilight lingering softly, mornings growing brighter by the week",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded and household routines wind down",
    "holidays": [
      "St. Patrick's Day (March 17)",
      "Mothering Sunday (variable date in March, observed this year on March 21)"
    ],
    "seasonalActivities": [
      "early spring garden preparation, including pruning and planting of hardy bulbs",
      "fox hunting preparations with riders dusting off tack and attending meet-ups",
      "afternoon tea gatherings in heated drawing rooms to escape the damp chill"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece worsted wool suits in muted greys and browns",
        "single-breasted jackets with wide lapels and high-waisted trousers",
        "silk ties with subtle geometric patterns"
      ],
      "casual": [
        "knitted argyle sweater vests over collared shirts",
        "plus-fours (knickerbockers) for country walks",
        "tweed shooting jackets with elbow patches"
      ],
      "accessories": [
        "felt trilby hats",
        "leather gloves",
        "silver pocket watches with chain"
      ]
    },
    "womensWear": {
      "formal": [
        "bias-cut silk dresses with modest necklines and three-quarter sleeves",
        "tailored wool coats with fur collars",
        "seamed stockings and T-strap leather shoes"
      ],
      "casual": [
        "knitted twinsets paired with calf-length skirts",
        "beret hats and knitted scarves for outings",
        "gloves in pastel shades"
      ],
      "accessories": [
        "small leather handbags",
        "brooches featuring floral motifs",
        "pearl necklaces and simple gold rings"
      ]
    },
    "trendsOfTheMoment": [
      "streamlined silhouettes inspired by Art Deco",
      "increasing popularity of sportswear for country pursuits",
      "pastel color palettes blending with traditional country hues"
    ],
    "socialExpectations": [
      "men expected to don formal attire for dinner and estate business",
      "women to maintain ladylike poise and modest dress in public and private",
      "strict dress codes for servants reflecting hierarchy and role"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Spanish Civil War escalates, with British public opinion divided",
      "King Edward VIII's abdication crisis looms, creating societal unease",
      "British rearmament efforts begin quietly amid European tensions"
    ],
    "politicalClimate": "A period of cautious conservatism with growing anxiety over fascist movements abroad, while domestic politics focus on economic recovery and social stability",
    "economicConditions": "Slow recovery from the Great Depression with rural estates feeling financial strain; unemployment remains a concern in industrial regions",
    "socialIssues": [
      "class tensions heightened by economic pressures on landed gentry and working classes",
      "debate over women’s roles post-suffrage and increased presence in the workforce",
      "concerns over national security and impending war"
    ],
    "internationalNews": [
      "Japanese military actions in China provoke global concern",
      "Germany’s remilitarization of the Rhineland challenges Versailles Treaty"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby’s crooning hits like 'Sweet Leilani'",
        "Duke Ellington’s jazz orchestras gaining wider audiences",
        "Gracie Fields’ music hall performances"
      ],
      "films": [
        "The release of 'The Awful Truth' starring Cary Grant and Irene Dunne",
        "Charlie Chaplin’s 'Modern Times' continues to resonate",
        "British films such as 'The Edge of the World' gain critical attention"
      ],
      "theater": [
        "Noël Coward’s comedies remain popular in London",
        "Agatha Christie’s mysteries performed on stage",
        "Musical revues featuring dance and comedy in West End"
      ],
      "radio": [
        "BBC Home Service broadcasts news and drama serials",
        "Variety shows featuring live music and comedy",
        "Children’s Hour providing storytelling and educational content"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s 'Death on the Nile' published early 1937",
        "John Steinbeck’s 'Of Mice and Men' gaining transatlantic notice",
        "Daphne du Maurier’s growing reputation with atmospheric novels"
      ],
      "popularGenres": [
        "detective mysteries",
        "social realism novels",
        "romantic thrillers"
      ]
    },
    "technology": {
      "recentInventions": [
        "improvements in radio receiver sensitivity",
        "introduction of more reliable petrol engines for touring cars",
        "early experiments with practical television broadcasting"
      ],
      "commonDevices": [
        "domestic telephones with party-line exchanges",
        "battery-powered radios in sitting rooms",
        "manual typewriters for correspondence"
      ],
      "emergingTrends": [
        "increased automobile ownership among upper classes",
        "growing use of wireless communication for news",
        "early adoption of electric kitchen appliances in affluent homes"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: four pence",
        "gallon of petrol: ten pence",
        "taxi ride across town: two shillings"
      ],
      "commonActivities": [
        "afternoon tea rituals",
        "country estate hunts and shooting parties",
        "listening to radio broadcasts after dinner"
      ],
      "socialRituals": [
        "formal evening dinners with strict seating arrangements",
        "Sunday church attendance followed by family gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "rigid distinctions between landowning gentry and service staff preserved",
      "deference expected from lower classes despite economic hardships"
    ],
    "gender": [
      "women encouraged to embody grace and domesticity, yet some entering workforce",
      "men expected to uphold social and financial leadership",
      "social etiquette restricts informal interactions between genders in public"
    ],
    "race": [
      "British imperial attitudes dominate, with limited awareness of colonial dissent",
      "racial prejudices prevalent but rarely openly challenged in upper-class circles"
    ],
    "generalNorms": [
      "formal politeness governs social interactions",
      "privacy and discretion highly valued within landed estates",
      "conservative views on morality and propriety shape behavior"
    ]
  },
  "atmosphericDetails": [
    "The persistent scent of wet earth and damp leaves pervades the manor grounds under gray skies",
    "The steady tapping of rain against leaded glass windows punctuates the quiet tension inside the drawing room",
    "Faint strains of a gramophone playing jazz filter through the heavy curtains in the evening"
  ],
  "paragraphs": [
    "March 1937 finds the country manor shrouded in a damp, gray atmosphere as intermittent drizzle softens the estate’s sprawling grounds into mud and slick pathways. The chill of early spring lingers in the air, making the warmth of the drawing room fires and afternoon teas especially welcome. Outside, preparations for the coming fox hunting season begin in earnest, with riders tending to tack and hounds in the misty mornings. The calendar marks St. Patrick’s Day and the approaching Mothering Sunday, occasions observed quietly within the household’s strict social order.",
    "Fashion at the manor reflects a blend of tradition and modernity. Men wear sharply tailored three-piece suits for formal occasions, while adopting tweeds and plus-fours for casual country pursuits. Women are clad in softly flowing bias-cut dresses that echo the Art Deco influence, paired with fur-trimmed coats and delicate accessories such as pearl necklaces and floral brooches. Servants maintain a precise uniformity in dress, underscoring the clear class distinctions that pervade daily life. The mood is tense and formal, shaped by the estate’s financial caution amid wider economic uncertainty and the shadow of political unrest in Europe.",
    "Culturally, the manor’s occupants engage with the broader world through radio broadcasts of BBC news and drama, while evenings might be spent listening to Bing Crosby’s crooning or enjoying the latest Agatha Christie novel, freshly published and eagerly discussed. The political climate is fraught, with the Spanish Civil War and the looming abdication crisis stirring unease among the upper classes. Despite these pressures, daily rituals such as formal dinners, church attendance, and carefully observed etiquette maintain a veneer of stability. Yet beneath this surface, the estate’s social fabric is taut, a delicate balance of tradition, change, and concealed anxieties."
  ],
  "note": "This temporal context is tailored precisely to March 1937 on an English country estate, reflecting authentic seasonal, social, and cultural details to ground a mystery narrative in a vivid historical moment.",
  "cost": 0.009987970000000002,
  "durationMs": 59765
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amidst economic strain and political unease, the Voss family and their trusted circle convene at their isolated country manor under rigid social codes, where secrets and suspicions intertwine within the estate’s formal hierarchy.",
  "era": {
    "decade": "1930s",
    "socialStructure": "A strict class hierarchy separates the landed gentry from their servants, enforcing formal etiquette and controlled interactions, while the Great Depression pressures estate finances and rising European tensions breed private anxieties."
  },
  "setting": {
    "location": "A large, privately owned country house with extensive grounds including gardens, stables, and outbuildings, serving as both family residence and agricultural hub.",
    "institution": "Manor house on country estate",
    "weather": "Overcast skies with intermittent drizzle, creating damp and muddy conditions on estate grounds"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "A classic Golden Age country-house mystery where mechanical clock tampering conceals deadly intent, unfolding under tense formalities and social pressures that complicate truth and trust."
}

### LOCKED_FACTS
[
  {
    "id": "clock_reading",
    "value": "ten minutes past eleven",
    "description": "The exact time shown on the stopped clock face"
  },
  {
    "id": "tamper_amount",
    "value": "forty minutes",
    "description": "The exact amount the clock was wound back"
  },
  {
    "id": "pendulum_length",
    "value": "fourteen inches",
    "description": "Length of the pendulum rod measured after tampering"
  },
  {
    "id": "room_temperature",
    "value": "seventy-two degrees Fahrenheit",
    "description": "Recorded ambient temperature in the clock room at time of murder"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "Fine scratches are visible on the clock’s pendulum suspension spring under close inspection, indicating recent physical interference.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "These scratches reveal tampering on the clock's suspension spring, a key temporal clue.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "These scratches indicate recent tampering inconsistent with normal clock maintenance schedules, suggesting deliberate manipulation.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The scratches contradict the assumption of routine maintenance, pointing to foul play.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "Beatrice Quill reports hearing a faint irregular ticking from the grandfather clock during the evening before the clock stopped.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This testimony supports the presence of mechanical irregularity in the clock’s operation.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "testimonial",
      "description": "The ticking irregularity aligns with a mechanical alteration causing accelerated pendulum oscillations, contradicting the clock’s normal function.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This contradiction links the ticking irregularity to tampering, reinforcing the temporal manipulation theory.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "The stable lantern was extinguished after the clock stopped, as evidenced by soot patterns and temperature readings in the stable.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This observation establishes a timeline where the lantern extinguishing postdates the clock stopping.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The extinguishing of the lantern postdates the clock’s stopped time, contradicting Captain Hale’s alibi that he was in the stable before the clock stopped.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This contradiction undermines Captain Hale’s timeline, implicating him in the murder timeframe.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "The sundial’s shadow reading at the time of murder does not correspond with the grandfather clock’s displayed time of ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "This observation reveals a discrepancy between solar time and the clock’s time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "This discrepancy confirms the clock’s time is artificially altered, supporting the clock winding back forty minutes before the murder.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "The contradiction confirms deliberate manipulation of the clock’s time to mislead the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "Captain Ivor Hale manipulated the grandfather clock’s pendulum suspension spring, causing it to wind back forty minutes while accelerating the pendulum oscillation.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "This observation reveals the core mechanism of the temporal manipulation central to the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "A controlled comparison of the grandfather clock’s pendulum suspension spring tension and oscillation rate before and after tampering shows accelerated movement inconsistent with normal function.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "This evidence must be observed before the discriminating test to understand the clock’s altered behavior.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "temporal",
      "description": "Captain Ivor Hale is uniquely linked to the clock tampering by the distinctive fine scratches on the pendulum suspension spring matching his known handling patterns.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "This observation directly implicates Captain Ivor Hale rather than any other suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "behavioral",
      "description": "Visible documents and letters in Captain Ivor Hale’s study reveal his frustration with the declining estate and the victim’s recent decisions, indicating premeditation.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[2]",
      "pointsTo": "This behavioral clue shows Captain Ivor Hale’s motive and planning before the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because her alibi is corroborated by medical records and multiple witnesses placing her away from the scene during the murder timeframe.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This elimination narrows the suspect list by excluding Dr. Mallory Finch based on solid evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_12",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because her medical timing records and wax residue analysis confirm she was engaged in surgery during the murder, while Captain Ivor Hale had access to the clock mechanism.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[1]",
      "pointsTo": "This testimonial evidence further excludes Dr. Mallory Finch and points toward Captain Ivor Hale as the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "These scratches indicate recent tampering inconsistent with normal clock maintenance schedules, explicitly overturning the false assumption that the stopped manor clock’s displayed time of ten minutes past eleven accurately marks the time of the murder.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradiction chain dismantles the false timeline assumption using concrete, reader-visible evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_13",
      "category": "physical",
      "description": "Soot marks on the pendulum bob correspond with the timing of the stable lantern extinguishing, linking the clock’s mechanical state to the stable’s lighting conditions.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[2]",
      "pointsTo": "This physical evidence supports the timeline of events around the clock stopping and lantern extinguishing.",
      "placement": "mid",
      "criticality": "supporting",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_14",
      "category": "physical",
      "description": "Wax drips on the stable floor match the composition of the stable lantern’s candle, confirming the lantern was lit until shortly after the clock stopped.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "This physical trace corroborates the lantern extinguishing timeline.",
      "placement": "mid",
      "criticality": "supporting",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "category": "temporal",
      "description": "Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock stopped at eleven ten in the evening remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The manor displayed’s minutes time of ten minutes past eleven is supported by the butler’s statement that he saw the displayed minutes at that time, suggesting the murder occurred then.",
      "supportsAssumption": "The stopped manor clock’s displayed time of ten minutes past eleven accurately marks the time of the murder.",
      "misdirection": "This testimony appears reliable but does not account for the displayed’s manor, thus misleading the reader away from the true mechanism."
    },
    {
      "id": "rh_2",
      "description": "The regular marks of the manor accurately as reported by a servant before it trusted supports the assumption that the accurately was functioning normally until the moment of the murder.",
      "supportsAssumption": "The stopped manor clock’s displayed time of ten minutes past eleven accurately marks the time of the murder.",
      "misdirection": "This observation ignores the subtle irregular marks caused by eleven, thus reinforcing the false assumption."
    }
  ],
  "status": "pass",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_mechanism_visibility_core"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_11",
      "clue_core_elimination_chain",
      "clue_12",
      "clue_core_contradiction_chain",
      "clue_13",
      "clue_14",
      "clue_culprit_direct_captain_ivor_hale"
    ],
    "late": [
      "clue_late_optional_slot_1"
    ]
  },
  "fairPlayChecks": {
    "allEssentialCluesPresent": true,
    "noNewFactsIntroduced": true,
    "redHerringsDontBreakLogic": true
  },
  "latencyMs": 45733,
  "cost": 0.0051278899999999995
}

---

## OUTPUT INSTRUCTIONS

Produce a single JSON object with ALL of the following fields.

Return the JSON object directly — no preamble, no markdown fences, no commentary.

ARRAYS RULE: Every array field (characterPortraits, characterVoiceSketches, locationRegisters,
humourPlacementMap) must contain ONLY the specified object type. Do NOT include strings, notes,
comments, or extra placeholder entries anywhere inside an array. Each array element must be a
valid JSON object conforming to the schema below.

MANDATORY FIELD LENGTHS:
- storyEmotionalArc.arcDescription: MINIMUM 300 words (target 350).
  This is the most important field. Plan your token budget for it FIRST.
  Write multiple distinct paragraphs tracing the full emotional journey:
    Para 1 — Opening atmosphere and the weight of the initial crime
    Para 2 — Rising investigation: first clues, first false leads, emotional cost
    Para 3 — Mid-story pivot: something changes the investigator's direction
    Para 4 — Second turn: a revelation recolours earlier events
    Para 5 — Pre-climax and climax: mounting pressure and confrontation
    Para 6 — Resolution: what the ending costs emotionally for each character
  A single dense paragraph will fail the validation gate regardless of word count. Count your words.
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
- revealImplications: MINIMUM 90 words. Three earlier scenes, each revisited with one full sentence
  of analysis. Aim for 120 words.
- storyTheme: MINIMUM 25 words. Write a complete sentence with a subject, main clause, and a nuanced
  qualifier about the story's deeper meaning. Not a title, a noun phrase, or a fragment.
  A storyTheme shorter than 25 words will fail the quality gate.
- SELF-CHECK CONTRACT (INTERNAL): before returning JSON, verify the minimum lengths and required scene-position coverage are already satisfied on this first pass.

Required structure:
{
  "status": "final",
  "storyTheme": "<one sentence — story's deeper meaning, not a plot summary>",
  "historicalMoment": {
    "specificDate": "<year and month from TEMPORAL_CONTEXT exactly>",
    "eraRegister": "<200-300 words: what is it like to live through this specific moment>",
    "currentTensions": ["<3-5 concrete current-event pressures at this date>"],
    "physicalConstraints": ["<3-6 era-specific physical constraints on movement and communication>"],
    "emotionalRegister": "<one sentence: dominant collective emotional state at this date>",
    "wartimeServiceContext": { "serviceStatus": "...", "socialTexture": "...", "absenceEffect": "..." }
  },
  "characterPortraits": [
    {
      "name": "<exact name from CASE.cast>",
      "portrait": "<80-120 words: this character's relationship to the historical moment>",
      "eraIntersection": "<one sentence: how their private situation intersects with the historical moment>"
    }
  ],
  "characterVoiceSketches": [
    {
      "name": "<exact name from CASE.cast>",
      "voiceDescription": "<one sentence: how this character sounds and speaks — functional, no labels>",
      "fragments": [
        { "register": "comfortable", "text": "<2-4 lines of actual speech, no attribution>" },
        { "register": "evasive", "text": "<2-4 lines of actual speech>" },
        { "register": "stressed", "text": "<2-4 lines of actual speech>" }
      ],
      "humourNote": "<one sentence — include only if humourLevel > 0 in profiles>"
    }
  ],
  "locationRegisters": [
    {
      "locationId": "<must match a keyLocation id from LOCATION_PROFILES>",
      "name": "<location name>",
      "emotionalRegister": "<60-100 words: what it feels like to be here in this story>",
      "eraNote": "<one sentence: era-specific constraint on this location — optional>",
      "cameraAngle": "<one sentence: emotional stance for a writer entering this space>"
    }
  ],
  "storyEmotionalArc": {
    "dominantRegister": "<one sentence: story's overall emotional character>",
    "arcDescription": "<300-400 words: emotional map of the journey, not a plot summary>",
    "turningPoints": [
      { "position": "opening", "emotionalDescription": "<one sentence>" },
      { "position": "early", "emotionalDescription": "<one sentence>" },
      { "position": "first_turn", "emotionalDescription": "<one sentence>" },
      { "position": "mid", "emotionalDescription": "<one sentence>" },
      { "position": "second_turn", "emotionalDescription": "<one sentence>" },
      { "position": "pre_climax", "emotionalDescription": "<one sentence>" },
      { "position": "climax", "emotionalDescription": "<one sentence>" },
      { "position": "resolution", "emotionalDescription": "<one sentence>" }
    ],
    "endingNote": "<one sentence: what emotional register does the ending carry>"
  },
  "humourPlacementMap": [
    { "scenePosition": "opening_scene",       "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "first_investigation",  "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "body_discovery",       "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "first_interview",      "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "domestic_scene",       "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "mid_investigation",    "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "second_interview",     "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "tension_scene",        "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "pre_climax",           "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "discriminating_test",  "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "revelation",           "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "resolution",           "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" }
  ],
  "breakMoment": {
    "character": "<non-culprit, non-detective cast member>",
    "scenePosition": "<one of the 12 humour positions — best at tension_scene or pre_climax>",
    "form": "<specific: how loss of control manifests>",
    "narrativeFunction": "<one sentence: why this moment matters>"
  },
  "revealImplications": "<90-150 words: 2-3 earlier story moments the final revelation will retroactively recolour>",
  "validationConfirmations": {
    "noNewCharacterFacts": true,
    "noNewPlotFacts": true,
    "castComplete": true,
    "eraSpecific": true,
    "lockedFactsPreserved": true,
    "humourMapComplete": true
  }
}

IMPORTANT RULES for humourPlacementMap:
- "body_discovery", "discriminating_test", "revelation": ALWAYS "forbidden". No exceptions.
- "tension_scene", "pre_climax": "forbidden" unless a character has humourLevel > 0.7 AND no direct threat/violence. Then "conditional" with explicit condition.
- Characters with humourLevel < 0.3 must NOT appear in permittedCharacters.
- The detective may appear in permittedCharacters only for "domestic_scene" and "resolution", and only with "understatement" or "dry_wit".
- All 12 scene positions must be present in humourPlacementMap.

IMPORTANT: characterPortraits and characterVoiceSketches must each have exactly one entry per cast member in CASE.cast, in the same order.
```
