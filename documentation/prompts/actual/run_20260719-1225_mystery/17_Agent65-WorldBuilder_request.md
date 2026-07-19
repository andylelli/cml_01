# Actual Prompt Record

- Run ID: `mystery-1784463921571`
- Project ID: ``
- Timestamp: `2026-07-19T12:29:08.631Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `1d8f25e991b47d17`

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
    "title": "The Masquerade of Authority",
    "author": "Agent 5",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Brighton",
      "place": "Coastal Hotel",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "impersonation"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Respected investigator",
      "private_secret": "Struggles with authority figures",
      "motive_seed": "Desire for justice",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Solving the case and restoring her reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Renowned physician",
      "private_secret": "Had enemies due to controversial practices",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "none",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "none",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Retired naval officer",
      "private_secret": "Resents medical professionals",
      "motive_seed": "Jealousy over Dr. Finch's reputation",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Protecting his reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Hotel manager",
      "private_secret": "Involved in unethical practices",
      "motive_seed": "Financial gain from Dr. Finch's death",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Maintaining her position",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Socialite and guest",
      "private_secret": "Had a secret affair with Dr. Finch",
      "motive_seed": "Fear of exposure",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Protecting her reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Local politician",
      "private_secret": "Involved in bribery with Dr. Finch",
      "motive_seed": "Fear of scandal",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Protecting his career",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
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
      "summary": "During a charity event at a coastal hotel, Dr. Mallory Finch is found strangled in her room. As Detective Eleanor Voss investigates, layers of deception unfold, revealing an intricate web of impersonation and authority manipulation."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murderer impersonated a hotel staff member to create a false alibi and manipulate witnesses.",
      "delivery_path": [
        {
          "step": "The murderer disguised themselves as a hotel staff member to exit the scene unnoticed."
        }
      ]
    },
    "outcome": {
      "result": "The true identity of the murderer is revealed through the analysis of witness testimony and physical evidence."
    }
  },
  "false_assumption": {
    "statement": "The murderer was in the dining area at the time of the murder, as several witnesses confirm.",
    "type": "authority",
    "why_it_seems_reasonable": "Witnesses trust the authority of the hotel staff, believing they were serving during the murder.",
    "what_it_hides": "The murderer was actually present in the victim's room, disguised as a staff member."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Captain Hale had a known resentment towards Dr. Finch due to her controversial practices.",
      "Witnesses recall seeing him near the victim's room shortly before the murder."
    ],
    "the_one_flaw": "There is no evidence linking Captain Hale directly to the murder scene, and he has a solid alibi corroborated by hotel staff.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses claimed to have seen Captain Hale arguing with Dr. Finch earlier in the day.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was a misunderstanding regarding a medical issue and did not escalate.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A broken vase was found in Dr. Finch's room, suggesting a struggle.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The vase was knocked over by the wind during a storm, not during a confrontation.",
      "resolved_in_chapter": 5
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel during the charity event and had potential motives."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Quarter past nine",
        "Ten o'clock"
      ],
      "windows": [
        "Nine-thirty to ten o'clock"
      ],
      "contradictions": [
        "Witnesses saw the staff member at ten o'clock, but Dr. Finch was already dead by then."
      ]
    },
    "access": {
      "actors": [
        "Hotel staff",
        "Guests"
      ],
      "objects": [
        "Dr. Finch's room",
        "Dining area"
      ],
      "permissions": [
        "Staff entry to guest rooms",
        "Guest access to dining area"
      ]
    },
    "physical": {
      "laws": [
        "Physical presence required to commit the murder",
        "Disguise must be convincing"
      ],
      "traces": [
        "Staff uniform found in the victim's room",
        "Footprints leading from the beach to the hotel"
      ]
    },
    "social": {
      "trust_channels": [
        "Authority of hotel staff",
        "Witness credibility"
      ],
      "authority_sources": [
        "Hotel management",
        "Local law enforcement"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses state they saw a hotel staff member serving drinks in the dining area at quarter past nine.",
        "correction": "This suggests a staff member could not have been in two places at once.",
        "effect": "Narrows suspect pool to those who could access Dr. Finch's room.",
        "required_evidence": [
          "Witness statements about seeing the staff member",
          "Timeline of events leading up to the murder"
        ],
        "reader_observable": true
      },
      {
        "observation": "A discarded staff uniform with a unique insignia was found in Dr. Finch's room.",
        "correction": "This indicates someone used a disguise to impersonate hotel staff.",
        "effect": "Eliminates Eleanor Voss as a suspect since she was not wearing the uniform.",
        "required_evidence": [
          "Description of the staff uniform",
          "Witness accounts of the staff member's actions"
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock in the lobby was stopped at quarter past nine, inconsistent with witness timings.",
        "correction": "This shows the time of death was misrepresented by the manipulated clock.",
        "effect": "Narrows the timeline of suspects to those present at quarter past nine.",
        "required_evidence": [
          "Witness accounts of the clock's time",
          "Physical evidence of clock tampering"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Confronting the staff member with the discarded uniform's unique insignia, revealing they could not have been in the dining area.",
    "knowledge_revealed": "The staff member's peculiar mannerisms and access to Dr. Finch's room are identified.",
    "pass_condition": "If the staff member admits to being in Dr. Finch's room, it confirms the impersonation.",
    "evidence_clues": [
      "clue_3",
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core",
      "clue_id_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements about the staff member (early) and the timeline (mid) establish a contradiction. Step 2: The discarded uniform clue (mid) reveals the impersonation. Step 3: The clock tampering (discriminating test) confirms the timeline manipulation."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 3,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 3,
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
        "Execute the discriminating test",
        "Observe the culprit's reaction or result",
        "Draw conclusion about guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her presence at the hotel is accounted for by multiple witnesses.",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness accounts discredit any involvement in the murder.",
        "supporting_clues": [
          "clue_id_7",
          "clue_id_8"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Clear evidence showing his alibi during the murder.",
        "supporting_clues": [
          "clue_id_9",
          "clue_id_10"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness account"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_id_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness account"
      },
      {
        "clue_id": "clue_id_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_9",
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
    "summary": "A traveling journalist with a sharp eye for detail, Eleanor finds herself entangled in a web of deceit and danger in Brighton. As she investigates the murder of a fellow guest, her own struggles with identity and belonging come to the forefront.",
    "publicPersona": "Charming and observant, Eleanor is known for her insightful articles on social issues.",
    "privateSecret": "Struggles with her own identity after returning from the war, feeling like an outsider.",
    "motiveSeed": "Concerned about the hotel’s reputation and her friend's safety.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in her room during the initial dinner service.",
    "accessPlausibility": "easy",
    "stakes": "Eleanor's career could be damaged if the murder draws negative attention to her work.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often inserting witty observations about her surroundings. She tends to frame her thoughts in the form of rhetorical questions, leading her listeners to ponder alongside her.",
    "signatureTic": "Well, isn't that just the way of it?",
    "internalConflict": "Haunted by her experiences in the war, Eleanor grapples with feelings of inadequacy and alienation, questioning her role in a world that seems to have moved on without her.",
    "personalStakeInCase": "The murder could jeopardize her professional reputation and the safety of her friend, pushing her to confront her own fears.",
    "paragraphs": [
      "Eleanor Voss had always been a keen observer, a trait that served her well in her profession as a journalist. With her sharp wit and charming demeanor, she had gained a reputation for uncovering the truth behind social issues. Yet, beneath the polished exterior lay a woman grappling with her own demons. Returning from the war, Eleanor felt like a stranger in her own skin, struggling with an identity that was no longer clear to her.",
      "As she settled into the lavish Brighton hotel, Eleanor's instincts were piqued by the undercurrents of tension among the guests. When the murder of a fellow guest occurred, Eleanor felt an unsettling mix of concern for the hotel's reputation and a protective instinct for her friend, who was at the center of the unfolding chaos. The stakes were high, and Eleanor knew that her career could be at risk if the investigation spiraled into scandal.",
      "Eleanor's alibi during the initial dinner service was solid; she had been in her room, penning her thoughts about society's complexities. Yet, as the pieces of the puzzle began to emerge, she found herself drawn into the investigation, determined to uncover the truth. Her access to the guests was easy, and her charm often disarmed even the most guarded individuals. However, the deeper she delved, the more she realized that her past experiences were influencing her present choices.",
      "In the midst of her investigation, Eleanor faced an internal conflict that threatened to unravel her. Memories of the war haunted her, and she questioned if she was truly equipped to confront the dark realities surrounding her. Despite her fears, Eleanor sought to assert her skills, vowing to stand up against the dismissive attitudes of others. In doing so, she hoped to reclaim her sense of identity and purpose, one article—and one truth—at a time."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected physician with a hidden past, Dr. Mallory Finch becomes the unwitting victim in a deadly game. As her secrets threaten to surface, the stakes of her survival grow ever higher.",
    "publicPersona": "Dedicated and well-respected in the community for her medical contributions.",
    "privateSecret": "Hides a past affair with the victim that could ruin her career.",
    "motiveSeed": "Fears exposure of her affair would lead to professional disgrace.",
    "motiveStrength": "strong",
    "alibiWindow": "At a medical conference across town, unconfirmed by anyone present.",
    "accessPlausibility": "unlikely",
    "stakes": "Her reputation and career as a physician are at stake.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks with a clinical precision, often using medical jargon that reflects her profession. She tends to be direct and straightforward, avoiding any unnecessary embellishments.",
    "signatureTic": "It's a matter of life and death.",
    "internalConflict": "Dr. Finch is torn between her professional integrity and the fear of losing everything she has worked for, haunted by the shadows of her past.",
    "personalStakeInCase": "The murder brings her past affair into the spotlight, threatening her career and reputation as a physician.",
    "paragraphs": [
      "Dr. Mallory Finch had always been a pillar of the Brighton community, known for her dedication to her patients and her unwavering commitment to the medical profession. Yet, beneath her polished exterior lay a tumultuous secret that could shatter her carefully constructed life. The affair she had with the victim was a chapter she wished to forget, but the murder forced her to confront the specter of her past.",
      "As the news of the murder spread, Dr. Finch found herself at a medical conference across town, her alibi unconfirmed by anyone present. The irony was not lost on her; while she was meant to be discussing life-saving techniques, the shadows of her own choices loomed larger than ever. The fear of exposure gnawed at her, threatening to unravel her career and reputation as a respected physician.",
      "In the days that followed, Dr. Finch's access to the investigation was limited, as she was viewed as a potential suspect rather than a victim. The community that once revered her now eyed her with suspicion, and she felt the walls closing in. The stakes were high, and each interaction felt like a tightrope walk between maintaining her innocence and guarding her secret.",
      "As Dr. Finch navigated the treacherous waters of suspicion, she faced an internal conflict that left her morally compromised. The weight of her past choices bore down on her, forcing her to reevaluate her priorities and the consequences of her actions. If she wanted to reclaim her life and career, she would need to confront her past head-on, even if it meant risking everything she held dear."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired naval officer haunted by his past, Captain Ivor Hale finds himself embroiled in a murder investigation that threatens to expose his darkest secrets. Balancing his stoic exterior with inner turmoil, he grapples with the consequences of his actions.",
    "publicPersona": "Stoic and disciplined, known for his service and integrity.",
    "privateSecret": "Struggling with PTSD and guilt over a war incident that involved the victim's family.",
    "motiveSeed": "Believes the victim was planning to expose his past, risking his peace.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed to have been on the balcony during the murder, but no witnesses.",
    "accessPlausibility": "possible",
    "stakes": "Ivor risks losing his newfound tranquility and respect in the community.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks in a measured, deliberate manner, often punctuated by long pauses that give weight to his words. He tends to use military jargon and occasionally injects self-deprecating humor to deflect deeper inquiries.",
    "signatureTic": "I suppose that’s the price of service.",
    "internalConflict": "Ivor's struggle with PTSD and guilt manifests as a constant battle between his desire for peace and the haunting memories of the past.",
    "personalStakeInCase": "The investigation threatens to expose his past actions, risking the peace he has fought so hard to maintain.",
    "paragraphs": [
      "Captain Ivor Hale had always been a man of integrity, his stoic demeanor a testament to years of service in the navy. But beneath the surface, he was a man tormented by the ghosts of his past. The incident that had claimed the lives of the victim's family weighed heavily on his conscience, and the thought that the victim might expose him filled him with dread.",
      "When the murder occurred, Ivor found himself in a precarious position. He claimed to have been on the balcony during the time of the incident, but with no witnesses to corroborate his alibi, suspicion loomed over him like a dark cloud. The community that once admired him now questioned his integrity, and Ivor felt the walls closing in on his newfound tranquility.",
      "Despite his attempts to maintain a stoic facade, Ivor's internal conflict raged within him. The memories of war and the guilt that accompanied them haunted him, and he grappled with the fear that the truth would emerge, shattering the fragile peace he had built. As the investigation unfolded, he found himself torn between protecting his reputation and confronting the past that refused to let him go.",
      "In the face of adversity, Ivor's self-deprecating humor surfaced at unexpected moments, a defense mechanism against the weight of his guilt. Yet, as he navigated the murky waters of suspicion, he realized that true strength lay not in hiding from his past but in confronting it. If he wanted to redeem himself and find closure, he would need to face the truth, no matter how painful."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An ambitious hotel maid with dreams of a better life, Beatrice Quill finds herself entangled in a murder investigation that tests her resolve and morality. Her resentment towards the wealthy guests fuels her ambitions, but her choices may lead to unexpected consequences.",
    "publicPersona": "Bright and eager, Beatrice is determined to rise above her station.",
    "privateSecret": "Resentful of the wealthy guests, she dreams of revenge for her family's hardships.",
    "motiveSeed": "Believes the victim was hoarding wealth while her family struggled.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was cleaning a nearby room at the time of the murder, but few can corroborate.",
    "accessPlausibility": "easy",
    "stakes": "Her future and ability to escape poverty depend on her success in this environment.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a youthful exuberance, often punctuating her sentences with sarcastic remarks. She has a habit of using colloquial expressions that reflect her working-class background, making her relatable yet sharp.",
    "signatureTic": "Must be nice to have money.",
    "internalConflict": "Beatrice wrestles with her deep-seated resentment towards the wealthy while grappling with the desire to rise above her circumstances without losing her moral compass.",
    "personalStakeInCase": "The murder investigation could either propel her upward or drag her down, and she must navigate her ambitions carefully.",
    "paragraphs": [
      "Beatrice Quill was no ordinary hotel maid; she was a dreamer, a young woman determined to rise above her station. With each room she cleaned, she envisioned a life free from the shackles of poverty, a life where she could escape the hardships that had plagued her family for generations. Yet, her ambition was often overshadowed by a simmering resentment towards the wealthy guests she served.",
      "The murder of a fellow guest sent shockwaves through the hotel, and Beatrice found herself in the eye of the storm. While she had been cleaning a nearby room at the time of the incident, her alibi was flimsy at best, and the suspicion that fell upon her was palpable. As she navigated the investigation, her access to the guests was easy, yet each interaction left her feeling more and more trapped in a world she both aspired to and despised.",
      "Beatrice's internal conflict was a constant battle; she wanted to succeed, to escape the life she had always known, but her resentment towards the wealthy often clouded her judgment. The victim, in her eyes, represented everything that was wrong with society—the hoarding of wealth while families like hers struggled to make ends meet. As the investigation unfolded, Beatrice found herself at a crossroads, torn between her ambitions and the moral implications of her choices.",
      "With a sardonic wit that often caught others off guard, Beatrice used humor as a shield against the harsh realities of her life. Her quips, laced with sarcasm, reflected her frustration and determination to rise above her circumstances. But as the stakes grew higher, Beatrice realized that revenge would not yield the fulfillment she sought. If she wanted to achieve her dreams, she would need to find a way to navigate the treacherous waters of ambition without losing herself in the process."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A wealthy socialite with a façade of elegance, Sylvia Trent hides a desperate truth. As she maneuvers through the complexities of high society, her greed and manipulations lead her down a dark path.",
    "publicPersona": "Elegant and poised, Sylvia is at the center of high society.",
    "privateSecret": "In deep financial trouble due to poor investments, hoping to secure a will.",
    "motiveSeed": "Stands to inherit a substantial amount from the victim’s estate.",
    "motiveStrength": "strong",
    "alibiWindow": "Was at a charity event, but no one can confirm her whereabouts after dinner.",
    "accessPlausibility": "unlikely",
    "stakes": "Her social standing and financial stability depend on the victim's death.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with an air of sophistication, often using flowery language and subtle innuendos. She has a tendency to sprinkle her conversations with carefully crafted compliments that can cut deeper than they seem.",
    "signatureTic": "One must play the cards one is dealt.",
    "internalConflict": "Sylvia grapples with the consequences of her manipulative behavior and the fear of losing everything she has built.",
    "personalStakeInCase": "The murder poses a threat to her financial stability and social standing, pushing her to navigate the investigation with cunning.",
    "paragraphs": [
      "Sylvia Trent was the epitome of elegance, her poised demeanor masking the turmoil that brewed beneath the surface. As a wealthy socialite at the center of high society, she had perfected the art of manipulation, using charm and wit to ascend the social ladder. Yet, her carefully curated life was teetering on the brink of collapse due to poor investments that had left her in dire financial straits.",
      "When the murder occurred, Sylvia's alibi placed her at a charity event, but as the investigation unfolded, her whereabouts after dinner became a point of contention. The stakes were high; she stood to inherit a substantial amount from the victim’s estate, and the thought of losing everything sent her into a frenzy of calculated maneuvering. The pressure to maintain her social standing weighed heavily on her, and she was determined to do whatever it took to protect her interests.",
      "Sylvia's access to the investigation was limited, as her financial troubles painted her as a potential suspect. However, her polished exterior and polite savagery allowed her to navigate the murky waters of suspicion with a veneer of grace. She wielded her words like weapons, using compliments to disarm and innuendos to manipulate, all while carefully concealing her desperation.",
      "As the investigation drew closer to the truth, Sylvia faced an internal conflict that threatened to unravel her. The consequences of her manipulations loomed large, and she grappled with the fear of losing everything she had built. If she wanted to emerge unscathed, she would need to confront the darkness within and navigate the investigation with cunning, all while maintaining the façade of the perfect socialite."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A cynical investigator with a sharp tongue, Hugo Vane finds himself drawn into the complexities of a murder case that tests his ethical boundaries. As he navigates the investigation, he must confront his own shadows.",
    "publicPersona": "Skeptical and sharp-tongued, Hugo often challenges the status quo.",
    "privateSecret": "May have been involved in shady dealings with the victim.",
    "motiveSeed": "Could expose the victim's secrets to further his own career.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be out for a late-night walk, but no one saw him.",
    "accessPlausibility": "possible",
    "stakes": "His future as an investigator depends on maintaining a reputation for integrity.",
    "humourStyle": "blunt",
    "humourLevel": 0.7,
    "speechMannerisms": "Hugo speaks in a direct, no-nonsense manner, often laced with sarcasm. He has a tendency to cut to the chase, preferring blunt honesty over pleasantries.",
    "signatureTic": "Let’s not kid ourselves here.",
    "internalConflict": "Hugo wrestles with the ethical implications of his past actions and the fear that they may come to light during the investigation.",
    "personalStakeInCase": "The investigation threatens to expose his own questionable dealings, putting his career at risk.",
    "paragraphs": [
      "Hugo Vane was no stranger to the darker side of human nature. As a cynical investigator, he had seen it all—lies, deceit, and the masks people wore to hide their true selves. His sharp tongue and blunt demeanor often put him at odds with the status quo, but he relished the challenge. However, the murder case that had landed in his lap was unlike any he had encountered before, forcing him to confront his own shadows.",
      "When the murder occurred, Hugo claimed to have been out for a late-night walk, but with no one to corroborate his story, suspicion loomed over him like a dark cloud. The stakes were high; his reputation as an investigator depended on maintaining a façade of integrity. Yet, the whispers of his past dealings with the victim threatened to unravel everything he had built.",
      "Navigating the investigation required a delicate balance of skepticism and cunning. Hugo's access to the suspects was plausible, but as he dug deeper, he found himself wrestling with the ethical implications of his past actions. The fear that his own secrets would come to light gnawed at him, pushing him to question the very foundations of his career.",
      "With a blunt honesty that often caught others off guard, Hugo used humor as both a shield and a weapon. His sardonic remarks cut through the tension, revealing the absurdity of the situation while masking his own insecurities. As he delved deeper into the case, he realized that the investigation was not just about uncovering the truth behind the murder; it was also a reckoning with his own ethical boundaries and the choices that had led him to this moment."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Grand Seaside Hotel",
    "type": "Hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A coastal hotel with art deco charm, harboring secrets beneath its polished surface.",
    "visualDescription": "Art deco architecture with sweeping curves and geometric motifs; grand lobby adorned with polished marble and brass accents; dining area featuring large windows framing the restless sea.",
    "atmosphere": "A blend of elegance and tension, where every shadow holds a secret.",
    "paragraphs": [
      "The Grand Seaside Hotel stands majestically on the cliffs of Brighton, its art deco façade catching the muted light of an overcast sky. The grand lobby, with its sweeping marble floors and brass fixtures, offers a deceptive sense of warmth. Guests bustle about, their voices blending with the soft hum of the radio broadcasting the latest news, while the salty sea breeze wafts through the open doors, mingling with the scent of fresh coffee from the dining area. Yet, beneath the surface, a palpable tension lingers, hinting at the mysteries concealed within its walls.",
      "The dining area, a long expanse of elegant tables, overlooks the turbulent sea, where waves crash against the cliffs below. Diners gaze out at the gray horizon, their faces reflecting a mixture of anticipation and unease. The clinking of cutlery and murmurs of conversation create a rhythm, yet the occasional crack of thunder outside seems to punctuate the unease. Each dish served carries the weight of unspoken secrets, as guests exchange furtive glances, their masks of civility barely concealing their underlying motives.",
      "As evening descends, the hotel transforms into a stage for intrigue. The soft glow of art deco sconces casts elongated shadows across the walls, creating an atmosphere thick with suspense. The sound of rain pattering against the windows adds to the sense of isolation, while the distant crash of waves serves as a reminder of the precarious cliffside location. Here, in this elegant yet foreboding space, the lines between friend and foe blur, and every whispered word could unravel a hidden truth."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain showers, typical for a coastal setting",
    "timeFlow": "Three days of mounting tension leading up to the masquerade ball.",
    "mood": "tense and suspenseful, with a sense of impending revelation",
    "eraMarkers": [
      "ubiquitous radio in the lobby",
      "early television set in the lounge",
      "post-war automobile parking in front"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and polished marble",
      "secondary": [
        "brass and velvet elegance",
        "crackling radio static"
      ]
    },
    "paragraphs": [
      "The salty sea air mingles with the scent of polished marble, filling the Grand Seaside Hotel with an air of sophistication. The muted sounds of the ocean crashing against the cliffs below create a constant backdrop, while the occasional crackle of the radio punctuates the atmosphere. This is a place where every detail matters, where elegance is intertwined with the weight of unspoken truths.",
      "As the rain begins to fall, the hotel takes on a more somber tone. The dim lighting casts flickering shadows across the walls, and the scent of damp wood mixes with the aroma of fresh coffee from the dining area. Guests huddle together, their laughter mingling with the distant sound of thunder, creating a symphony of unease that resonates throughout the space."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space and information exchange",
      "visualDetails": "Expansive space with high ceilings, marble floors, and brass fixtures; large reception desk at the entrance.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "brass-framed mirrors",
          "geometric art deco patterns",
          "large potted palms",
          "dimly lit corners"
        ],
        "sounds": [
          "soft murmurs of conversation",
          "clinking of glasses",
          "crackling radio broadcasts",
          "footsteps on marble",
          "distant laughter"
        ],
        "smells": [
          "fresh coffee and pastries",
          "polished wood and varnish",
          "salty sea air",
          "damp fabric from rain",
          "scent of old leather"
        ],
        "tactile": [
          "smooth marble underfoot",
          "cool brass fixtures",
          "plush velvet chairs",
          "rough fabric of damp coats",
          "hard wooden reception desk"
        ]
      },
      "accessControl": "Open to all guests; staff-only areas behind the reception; restricted access to the lounge and dining area during peak hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "rain-streaked windows",
            "water pooling on marble"
          ],
          "sounds": [
            "steady drumming on the roof",
            "muffled conversations",
            "soft footsteps on wet floors"
          ],
          "smells": [
            "damp earth and rain",
            "freshly brewed coffee",
            "scent of polished wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light casting shadows",
            "clouds gathering outside",
            "flickering lights in the corners"
          ],
          "sounds": [
            "the distant ticking of a clock",
            "soft whispers",
            "the buzz of a radio"
          ],
          "smells": [
            "dust and old books",
            "scent of wax polish",
            "faint tobacco smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting on surfaces",
            "glimpse of the sunset through windows"
          ],
          "sounds": [
            "the distant sound of waves",
            "clinking of glasses",
            "murmurs of a gathering crowd"
          ],
          "smells": [
            "freshly baked bread",
            "candle wax",
            "scent of floral arrangements"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby, with its soaring ceilings and polished marble floors, serves as the heart of the hotel. Guests mingle beneath the ornate chandeliers, their laughter mingling with the soft crackle of the radio broadcasting the news. The scent of fresh coffee wafts from the nearby café, where weary travelers seek refuge from the dampness outside. Yet, amidst the elegance, a sense of unease lingers, as if the very walls hold secrets waiting to be uncovered.",
        "As the evening approaches, the lobby transforms into a stage for intrigue. The flickering light from the sconces casts shadows that dance across the marble, while the sound of rain pattering against the windows creates an almost hypnotic rhythm. Guests exchange glances, their expressions masked with feigned cordiality, masking the tension that simmers just below the surface."
      ]
    },
    {
      "id": "dining_area",
      "name": "Dining Area",
      "type": "interior",
      "purpose": "Dining and social interaction",
      "visualDetails": "Long tables set with fine china; large windows overlooking the tumultuous sea; art deco murals adorning the walls.",
      "sensoryDetails": {
        "sights": [
          "elegantly set tables",
          "waving curtains in the breeze",
          "murmurs of diners",
          "bright brass light fixtures",
          "ocean view through large windows"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft chatter of guests",
          "the crash of waves outside",
          "occasional laughter",
          "the hum of conversation"
        ],
        "smells": [
          "roasted meats and herbs",
          "freshly baked bread",
          "scent of citrus from desserts",
          "damp sea air",
          "hint of wine"
        ],
        "tactile": [
          "smooth tablecloths",
          "cold ceramic plates",
          "hard wooden chairs",
          "soft napkins",
          "rough texture of the walls"
        ]
      },
      "accessControl": "Open for guests during meal hours; staff only during preparation; closed for private events.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "cloudy skies reflected in the windows",
            "raindrops sliding down glass",
            "dimly lit tables"
          ],
          "sounds": [
            "soft patter of rain",
            "quiet whispers of early diners",
            "the rustle of newspapers"
          ],
          "smells": [
            "freshly brewed tea",
            "warm pastries",
            "scent of wet earth"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across tables",
            "faint reflections in glassware",
            "glistening silverware"
          ],
          "sounds": [
            "the distant crash of waves",
            "muffled conversations",
            "clinking of glasses"
          ],
          "smells": [
            "cooked seafood",
            "scent of herbs",
            "hint of citrus"
          ],
          "mood": "suspenseful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candle flames dancing on tables",
            "glimmer of silverware",
            "twinkling stars outside"
          ],
          "sounds": [
            "soft music playing",
            "laughter of guests",
            "clinking of glasses"
          ],
          "smells": [
            "delicate aroma of flowers",
            "scent of fine wine",
            "freshly grilled meats"
          ],
          "mood": "romantic anticipation"
        }
      ],
      "paragraphs": [
        "The dining area, with its sweeping views of the ocean, serves as a focal point for the hotel's social life. Guests gather around long tables, their conversations punctuated by the clinking of cutlery and the soft hum of music. The aroma of freshly prepared meals fills the air, blending with the salty scent of the sea. However, the atmosphere is tinged with tension, as subtle glances and whispered conversations hint at deeper secrets lurking beneath the surface.",
        "As the evening unfolds, the ambiance shifts. Candlelight flickers across the tables, casting shadows that dance along the walls. The sound of waves crashing against the cliffs outside becomes a distant echo, while the laughter of guests masks the undercurrents of suspicion and intrigue. Here, in this elegant setting, every meal served could be the last for someone, and every conversation might unveil a hidden truth."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "Rooftop Terrace",
      "type": "exterior",
      "purpose": "Outdoor gathering and observation point",
      "visualDetails": "Open terrace with wrought iron railings; stunning views of the coastline; scattered seating areas with weathered cushions.",
      "sensoryDetails": {
        "sights": [
          "expansive views of the ocean",
          "dark clouds looming overhead",
          "flickering lights from the hotel below",
          "waves crashing against the rocks",
          "silhouettes of guests against the sky"
        ],
        "sounds": [
          "howling wind",
          "distant thunder",
          "soft whispers of guests",
          "the crash of waves",
          "clinking of glasses"
        ],
        "smells": [
          "salt from the sea",
          "wet stone and earth",
          "scent of rain on the breeze",
          "faint floral notes",
          "lingering smoke from fire pits"
        ],
        "tactile": [
          "cold metal railing",
          "rough texture of stone tiles",
          "soft cushions damp with rain",
          "chill of the evening air",
          "smooth glass of a drink"
        ]
      },
      "accessControl": "Restricted access during storms; open to guests only after sunset; monitored by staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "misty coastline shrouded in rain",
            "raindrops falling from the railings",
            "grey clouds overhead"
          ],
          "sounds": [
            "steady drizzle on surfaces",
            "distant rumble of thunder",
            "soft rustling of leaves"
          ],
          "smells": [
            "damp earth and sea air",
            "scent of fresh rain",
            "hint of wet foliage"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "darkening skies",
            "shadows cast by clouds",
            "waves crashing violently"
          ],
          "sounds": [
            "wind picking up",
            "the distant roar of the ocean",
            "muffled voices of guests"
          ],
          "smells": [
            "sharp scent of rain",
            "scent of wet stone",
            "hint of smoke from a nearby fire"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "stars twinkling above",
            "glow of the moonlight on the water",
            "soft silhouettes of guests"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant sound of music"
          ],
          "smells": [
            "fresh sea air",
            "scent of blooming night flowers",
            "hint of charcoal from a grill"
          ],
          "mood": "romantic intrigue"
        }
      ],
      "paragraphs": [
        "The rooftop terrace offers a breathtaking view of the coastline, a perfect spot for guests to unwind. However, with the encroaching storm clouds, the atmosphere is thick with tension. The howling wind carries whispers of conversations, and the scent of salt and wet stone fills the air. Here, the secrets of the hotel seem to linger in the shadows, waiting for the right moment to be revealed.",
        "As evening falls, the terrace transforms into a sanctuary of intrigue. The clear sky reveals a blanket of stars, while the distant sound of waves creates a soothing backdrop. Yet, the chill in the air serves as a reminder of the storm that looms, and the soft murmurs of guests hint at the secrets they carry. In this suspended moment, anything could happen, and the night holds the promise of revelations yet to come."
      ]
    },
    {
      "id": "kitchen",
      "name": "Hotel Kitchen",
      "type": "interior",
      "purpose": "Food preparation and staff area",
      "visualDetails": "Functional space filled with stainless steel appliances; large prep tables; bustling staff moving about.",
      "sensoryDetails": {
        "sights": [
          "gleaming stainless steel surfaces",
          "large pots simmering on the stove",
          "staff in white uniforms",
          "fresh ingredients neatly arranged",
          "steam rising from cooking"
        ],
        "sounds": [
          "clattering pots and pans",
          "sizzling on the stove",
          "staff communicating briskly",
          "water running in the sink",
          "the hum of refrigerators"
        ],
        "smells": [
          "aroma of sautéed vegetables",
          "fresh herbs and spices",
          "scent of baked goods",
          "hint of smoke from overcooked food",
          "sharp scent of cleaning agents"
        ],
        "tactile": [
          "smooth stainless steel countertops",
          "warmth from ovens",
          "coolness of refrigerated items",
          "rough fabric of aprons",
          "hard tiles underfoot"
        ]
      },
      "accessControl": "Staff only; entry restricted to kitchen staff during meal prep; closed off to guests.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked windows",
            "steam rising in the air",
            "dim lighting from overhead fixtures"
          ],
          "sounds": [
            "pattering rain on the roof",
            "hushed conversations",
            "clinking of utensils"
          ],
          "smells": [
            "freshly baked bread",
            "scent of brewed coffee",
            "aroma of sizzling bacon"
          ],
          "mood": "busy and chaotic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "cloudy light filtering through windows",
            "staff moving efficiently",
            "food being plated"
          ],
          "sounds": [
            "the hiss of frying pans",
            "voices calling orders",
            "the whir of mixers"
          ],
          "smells": [
            "rich scent of stews",
            "fresh herbs",
            "hint of cleaning products"
          ],
          "mood": "tense urgency"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of warm lights",
            "food being plated elegantly",
            "busy staff preparing for service"
          ],
          "sounds": [
            "soft music playing",
            "clinking of dishes",
            "laughter from the dining area"
          ],
          "smells": [
            "delicious aromas wafting",
            "scent of desserts baking",
            "hint of spices"
          ],
          "mood": "anticipatory excitement"
        }
      ],
      "paragraphs": [
        "The hotel kitchen buzzes with activity, a hive of energy where delicious meals are prepared for the guests. Staff in crisp white uniforms move swiftly between stations, their conversations punctuated by the clatter of pots and pans. The air is thick with the aroma of sautéed vegetables and freshly baked bread, creating an inviting atmosphere that contrasts sharply with the tension brewing just outside its doors.",
        "As evening approaches, the kitchen reaches a fever pitch. The glow of warm lights illuminates the workspace, where chefs meticulously plate dishes to be served. The sound of laughter and conversation from the dining area filters in, blending with the sizzling sounds of food preparation. In this bustling environment, secrets simmer alongside the sauces, and every dish could carry a hidden message."
      ]
    }
  ],
  "note": "",
  "cost": 0.002408868,
  "durationMs": 23853
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1940,
    "month": "October",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "cool breezes from the coast"
    ],
    "daylight": "Daylight begins to fade early, with sunset around 5:45 PM, leading to long evenings shrouded in darkness.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after the dinner service has concluded.",
    "holidays": [
      "Halloween (October 31)"
    ],
    "seasonalActivities": [
      "attending local harvest festivals",
      "preparing for Halloween with decorations and costumes",
      "gathering for evening walks in the crisp air"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suit in dark navy",
        "white dress shirt with a stiff collar",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "tweed blazer",
        "flannel trousers",
        "knit sweater"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "classic wristwatch"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress with a cinched waist",
        "cloche hat adorned with feathers",
        "pearl necklace"
      ],
      "casual": [
        "sweater with a fitted silhouette",
        "high-waisted trousers",
        "printed scarf"
      ],
      "accessories": [
        "shoulder bag",
        "gloves made of soft leather",
        "nylon stockings"
      ]
    },
    "trendsOfTheMoment": [
      "tailored silhouettes for both men and women",
      "the resurgence of bold colors for evening wear",
      "the popularity of hats as a staple accessory"
    ],
    "socialExpectations": [
      "men are expected to wear suits for formal occasions",
      "women are encouraged to dress elegantly even for casual outings",
      "social etiquette emphasizes politeness and formality in public interactions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Blitz continues in London, with air raids causing widespread destruction",
      "U.S. President Franklin D. Roosevelt's third term campaign focuses on foreign policy and support for Britain",
      "The Lend-Lease Act is under discussion to provide aid to Allies"
    ],
    "politicalClimate": "Tensions are rising in Europe as World War II progresses, with Britain facing significant challenges in its defense against Nazi Germany.",
    "economicConditions": "Britain is experiencing rationing due to the war, leading to scarcity of goods and inflation, while the U.S. economy is slowly recovering from the Great Depression.",
    "socialIssues": [
      "Increased participation of women in the workforce as men are deployed to war",
      "Racial tensions are simmering in the U.S. due to segregation policies",
      "Discussions around civil liberties in wartime"
    ],
    "internationalNews": [
      "Reports of German advances in Europe",
      "The U.S. Navy is bolstering its presence in the Atlantic",
      "Discussions of potential diplomatic relations with the Soviet Union"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's 'In the Mood'",
        "Bing Crosby's 'I'll Be Seeing You'",
        "The Andrews Sisters' 'Boogie Woogie Bugle Boy'"
      ],
      "films": [
        "'Rebecca' directed by Alfred Hitchcock",
        "'The Great Dictator' by Charlie Chaplin",
        "'The Letter' starring Bette Davis"
      ],
      "theater": [
        "'The Sins of the Fathers' on Broadway",
        "'The Ghost Train'",
        "'The Voice of the Turtle'"
      ],
      "radio": [
        "The Jack Benny Program",
        "The Shadow",
        "Suspense"
      ]
    },
    "literature": {
      "recentPublications": [
        "'For Whom the Bell Tolls' by Ernest Hemingway",
        "'The Grapes of Wrath' by John Steinbeck",
        "'The Maltese Falcon' by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery",
        "war fiction",
        "romantic novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "The first practical radar systems are becoming operational",
        "Advancements in film technology are enhancing movie production",
        "The introduction of synthetic rubber due to wartime shortages"
      ],
      "commonDevices": [
        "Battery-operated radios are prevalent in households",
        "Early television sets are being tested in select homes",
        "Basic types of telephones are common for communication"
      ],
      "emergingTrends": [
        "Increased use of propaganda in media",
        "Civil defense drills becoming part of community life",
        "Expansion of public transportation infrastructure"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Coal scuttle refill: one shilling sixpence"
      ],
      "commonActivities": [
        "Families gather for evening radio programs",
        "Neighbors socialize during weekend harvest festivals",
        "Men frequent pubs for drinks and camaraderie after work"
      ],
      "socialRituals": [
        "Evening tea gatherings among friends",
        "Sunday family dinners with an emphasis on traditional meals"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "There is a growing awareness of class disparities due to the war effort",
      "Working-class solidarity is emphasized as people unite against common challenges"
    ],
    "gender": [
      "Women are increasingly seen in roles traditionally held by men",
      "There are ongoing discussions about women's rights and equality in the workforce",
      "Expectations for women to maintain household duties even while working"
    ],
    "race": [
      "Racial segregation remains a contentious issue, particularly in the U.S.",
      "Awareness of racial inequalities is rising among activists"
    ],
    "generalNorms": [
      "Politeness and formality are highly valued in social interactions",
      "Community involvement is encouraged as a means of coping with wartime stress"
    ]
  },
  "atmosphericDetails": [
    "The smell of damp earth and fallen leaves fills the air, intensified by the recent rain.",
    "Street lamps cast a soft glow, illuminating the slick cobblestones as patrons scurry back to their hotels.",
    "The distant sound of a radio playing a popular tune seeps through the walls, mixing with the chatter of guests enjoying their evening."
  ],
  "paragraphs": [
    "In October 1940, the coastal city is shrouded in a veil of overcast skies, with rain showers that intermittently drench the streets, creating a reflective sheen on the pavement. The brisk autumn wind carries the scent of damp earth and decaying leaves, a reminder of the seasonal shift. As the sun sets early, around 5:45 PM, the mood within the Hotel is tense yet vibrant, with guests mingling in the lounge, sipping cocktails as they await the evening’s masquerade ball. The approaching Halloween adds an air of anticipation, with decorations appearing in shop windows, hinting at the festive spirit amidst the looming shadows of war.",
    "Fashion is a reflection of both elegance and practicality this season. Men don tailored suits in dark hues, with double-breasted jackets paired with crisp white shirts and silk ties that reflect the bold geometric patterns of the time. Women, too, embrace the post-war aesthetic, sporting tea-length dresses that cinch at the waist, often accessorized with cloche hats adorned with feathers. The atmosphere is one of poised sophistication, where every detail, from the polished leather shoes to the immaculate makeup, speaks to a collective desire for normalcy in turbulent times.",
    "Daily life is characterized by the rhythm of wartime routines, where rationing influences every aspect of purchasing and meal preparation. A loaf of bread costs four pence, and families often gather around the radio for entertainment after long hours of work. The evening tea gatherings serve as a crucial social ritual, allowing friends to reconnect and share news while navigating the complexities of life during a global conflict. The class distinctions persist, yet there is a growing solidarity as communities come together, united by shared challenges and the pursuit of a better future."
  ],
  "note": "",
  "cost": 0.00113991075,
  "durationMs": 10779
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a coastal hotel for a charity event brings together a diverse group, where post-war tensions and shifting social roles create an atmosphere ripe for deception and intrigue.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of war has led to increased roles for women in the workforce, while class distinctions remain sharp, and the looming threat of the Cold War fosters paranoia and suspicion."
  },
  "setting": {
    "location": "A large, coastal hotel with art deco architecture overlooking the ocean.",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain showers, typical for a coastal setting."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an impersonation method, where a masquerade of double identity — a disguise exploited to seem to be in two places — breaks the assumed alibi."
}

### LOCKED_FACTS
[
  {
    "id": "murder_time",
    "value": "a quarter past nine",
    "description": "The exact time of the murder as established by witnesses."
  },
  {
    "id": "staff_uniform_count",
    "value": "two",
    "description": "The number of discarded staff uniforms found near the scene."
  },
  {
    "id": "witness_count",
    "value": "four",
    "description": "The number of witnesses who confirmed seeing the staff member."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 26,
  "countsByPlacement": {
    "early": 8,
    "mid": 17,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 25,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_4",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_id_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_2",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_id_3",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_id_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_id_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    }
  ]
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
