# Actual Prompt Record

- Run ID: `mystery-1779912116475`
- Project ID: ``
- Timestamp: `2026-05-27T20:07:49.420Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `b8a0ecec4358ef09`

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
    "title": "The Clock's Backward Toll",
    "author": "ChatGPT, CML Specialist",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "Mechanical clocks with spring tension",
        "No electronic timekeeping",
        "Basic forensic toxicology and fingerprinting",
        "Strict class hierarchy with formal routines",
        "Limited telecommunications"
      ]
    },
    "setting": {
      "location": "Stoneleigh Manor",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "Country house estate (Manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical clock tampering temporal alibi manipulation"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [
        "Acquaintance of family",
        "Respected guest and amateur sleuth"
      ],
      "public_persona": "Calm, observant, insightful",
      "private_secret": "Possesses mechanical clock knowledge",
      "motive_seed": "Intellectual curiosity and justice",
      "motive_strength": "moderate",
      "alibi_window": "Present throughout evening",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Free movement in manor",
        "Access to study and clocks"
      ],
      "behavioral_tells": [
        "Observes details others overlook",
        "Questions assumptions"
      ],
      "stakes": "Solve murder before social scandal",
      "evidence_sensitivity": [
        "Clock mechanism",
        "Witness statements",
        "Physical traces"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Family Doctor and Suspect",
      "relationships": [
        "Longtime family physician",
        "Resents patriarch’s refusal to fund new clinic"
      ],
      "public_persona": "Professional, courteous",
      "private_secret": "Financially strained by Great Depression",
      "motive_seed": "Silencing victim who threatened exposure",
      "motive_strength": "strong",
      "alibi_window": "Claims in garden 10:30 to 11:15",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to study and grounds",
        "Knowledge of clock mechanics"
      ],
      "behavioral_tells": [
        "Avoids direct answers",
        "Nervous glances at clock"
      ],
      "stakes": "Protect professional reputation",
      "evidence_sensitivity": [
        "Clock spring marks",
        "Witness testimony",
        "Oil stains"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "45-55",
      "role_archetype": "Retired Military Officer and Suspect",
      "relationships": [
        "Old family friend",
        "Jealous of victim’s control over estate"
      ],
      "public_persona": "Stoic, disciplined",
      "private_secret": "Gambling debts",
      "motive_seed": "Blackmail by victim",
      "motive_strength": "moderate",
      "alibi_window": "Claims at stables 10:45 to 11:20",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to stables and garden paths",
        "Familiarity with estate layout"
      ],
      "behavioral_tells": [
        "Fidgety with watch",
        "Deflects questions about timing"
      ],
      "stakes": "Avoid financial ruin",
      "evidence_sensitivity": [
        "Lantern oil traces",
        "Stable boy testimony",
        "Watch timing"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Lady’s Maid and Suspect",
      "relationships": [
        "Serves victim’s family",
        "Secret resentment over treatment"
      ],
      "public_persona": "Loyal, discreet",
      "private_secret": "Blackmailed by victim",
      "motive_seed": "Desire for freedom",
      "motive_strength": "moderate",
      "alibi_window": "Claims in servants’ quarters 10:40 to 11:10",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to servants’ quarters and kitchen",
        "Knowledge of house routines"
      ],
      "behavioral_tells": [
        "Overly eager to assist",
        "Avoids mentioning clock",
        "Diary with entries about tea bell"
      ],
      "stakes": "Escape blackmail",
      "evidence_sensitivity": [
        "Tea bell mechanism",
        "Diary notes",
        "Bell hammer wear"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Dr. Mallory Finch"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "At Stoneleigh Manor, the respected family patriarch was found dead in his study on a chilly autumn morning. The grand manor clock showed the time as ten minutes past eleven, seemingly fixing the murder time. However, Eleanor Voss uncovers that the clock’s spring had been deliberately wound backward, hiding the true time of death and creating a false alibi for the killer. Through mechanical evidence and witness testimony, the illusion of timing is shattered, revealing the murderer exploiting the manor’s own timekeeping."
    },
    "accepted_facts": [
      "The manor clock stopped at ten minutes past eleven",
      "Victim was found dead in the study",
      "The clock’s winding key was found with fresh oil stains",
      "Witnesses heard the manor clock chime twice in quick succession before stopping",
      "Victim’s pocket watch stopped at a later time than the manor clock",
      "Dr. Mallory Finch was seen near the study around the true murder time",
      "Captain Ivor Hale was at the stables during the alleged murder time",
      "Beatrice Quill reported the tea bell timing consistent with normal routine"
    ],
    "inferred_conclusions": [
      "The manor clock was deliberately wound backward to show an earlier time",
      "The true time of death was later than indicated by the manor clock",
      "Dr. Mallory Finch’s alibi is false due to the timing manipulation",
      "Captain Ivor Hale’s and Beatrice Quill’s alibis hold consistent with the corrected timeline",
      "Dr. Mallory Finch is the murderer exploiting the temporal false assumption"
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on manor, clock, and study to expose the false timing.",
      "delivery_path": [
        {
          "step": "Murderer gains access to clock winding key and forces backward winding"
        },
        {
          "step": "Victim is killed during the true time window obscured by manipulated clock"
        },
        {
          "step": "Witnesses rely on the manor clock time, forming a false temporal assumption"
        },
        {
          "step": "Investigation uncovers mechanical clues and timing contradictions"
        },
        {
          "step": "Discriminating test compares clock spring tension and witness timepieces"
        }
      ]
    },
    "outcome": {
      "result": "The murderer’s false alibi is disproved, revealing Dr. Mallory Finch as the culprit exploiting mechanical clock tampering."
    }
  },
  "false_assumption": {
    "statement": "The manor clock’s displayed time accurately reflects the true time of the victim’s death.",
    "type": "temporal",
    "why_it_seems_reasonable": "The manor clock is respected and regularly maintained; witnesses heard its chimes and relied on it to mark time; the clock’s stopped time matches the estimated murder period.",
    "what_it_hides": "The clock hands were deliberately wound backward by forty minutes, creating an illusory time frame that hides the true murder timing and allows the killer a false alibi."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Manor clock stopped at ten minutes past eleven",
        "Victim’s pocket watch stopped at eleven-fifty",
        "Witness testimony on clock chimes timing"
      ],
      "windows": [
        "Suspected murder window based on clock time",
        "Actual murder window inferred from clock spring state"
      ],
      "contradictions": [
        "Victim’s pocket watch time inconsistent with manor clock",
        "Clock chimes heard twice in rapid succession before stopping"
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Eleanor Voss"
      ],
      "objects": [
        "Manor clock winding key",
        "Victim’s pocket watch",
        "Study room",
        "Stables",
        "Servants’ quarters"
      ],
      "permissions": [
        "Dr. Finch allowed in study",
        "Captain Hale allowed in stables",
        "Beatrice Quill accesses servants’ quarters"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clock spring tension cannot be increased backward without forcing",
        "Clock chimes sequence governed by gear mechanism",
        "Pocket watch wound independently, stops at true time"
      ],
      "traces": [
        "Scratch marks on clock back plate",
        "Fresh oil on winding key",
        "Victim’s pocket watch stopped later than manor clock"
      ]
    },
    "social": {
      "trust_channels": [
        "Servants trust clock to mark tea time",
        "Family members trust manor clock as official timekeeper"
      ],
      "authority_sources": [
        "Estate management controls clock maintenance",
        "Doctor’s professional access to study"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The manor clock’s winding key was found in the study with fresh oil stains and a slight scratch on the clock’s back plate consistent with forced backward winding.",
        "correction": "The clock was deliberately wound backward, not stopped naturally, indicating tampering.",
        "effect": "Narrows timing constraint to a manipulated clock timeline; eliminates assumption that clock time is reliable.",
        "required_evidence": [
          "Clock’s winding key with fresh oil stains found in study",
          "Scratch marks on clock back plate consistent with forced backward winding",
          "Manor clock stopped at ten minutes past eleven"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses heard the manor clock chime twice in quick succession just before it stopped, which is mechanically impossible under normal operation.",
        "correction": "The clock’s mechanism was disturbed causing abnormal chiming, corroborating tampering.",
        "effect": "Confirms forced mechanical interference in clock operation, supporting adjusted timeline.",
        "required_evidence": [
          "Witness testimony of manor clock chiming twice rapidly",
          "Mechanical laws of clock chimes sequence",
          "Victim’s pocket watch stopped at eleven-fifty"
        ],
        "reader_observable": true
      },
      {
        "observation": "The victim’s pocket watch was found stopped at eleven-fifty, well after the manor clock’s stopped time, indicating the victim was alive beyond the clock’s displayed time.",
        "correction": "The true time of death is later than the manor clock’s stopped time, invalidating alibis based on the manor clock.",
        "effect": "Eliminates suspects whose alibis rely on the manor clock’s incorrect time, specifically Captain Hale and Beatrice Quill’s supported alibis remain plausible; Dr. Finch’s alibi is invalidated.",
        "required_evidence": [
          "Victim’s pocket watch stopped at eleven-fifty",
          "Manor clock stopped at ten minutes past eleven",
          "Statements of Captain Hale’s presence at stables 10:45-11:20",
          "Beatrice Quill’s servants’ quarters alibi 10:40-11:10"
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Mallory Finch was seen near the study shortly after the manor clock stopped, inconsistent with her claimed alibi during the apparent murder window.",
        "correction": "Dr. Finch had opportunity to commit the murder during the true time window obscured by the clock tampering.",
        "effect": "Narrows suspect pool to Dr. Mallory Finch as only plausible culprit.",
        "required_evidence": [
          "Witness sighting of Dr. Finch near study after manor clock stopped",
          "Dr. Finch’s claimed alibi in garden 10:30 to 11:15",
          "Victim’s pocket watch stopped at eleven-fifty"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled comparison is staged at Stoneleigh Manor where the manor clock spring tension is measured alongside the winding key’s fresh oil stains and scratch marks. Witnesses recount the manor clock’s abnormal chiming, while the victim’s pocket watch time is compared to the stopped manor clock, conclusively proving the backward winding tampering and disproving Dr. Finch’s alibi.",
    "knowledge_revealed": "The test proves the manor clock’s time is shifted backward by forty minutes due to deliberate mechanical tampering, invalidating Dr. Finch’s claimed alibi and exposing her as the murderer.",
    "pass_condition": "The measured clock spring tension and mechanical evidence match the tampering signatures found on the winding key and clock plate, and the victim’s pocket watch time contradicts the manor clock’s stopped time.",
    "evidence_clues": [
      "clue_core_contradiction_chain",
      "clue_8",
      "clue_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock’s winding key oil stains and scratch marks (early clues) reveal tampering. Step 2: Witnesses’ testimony of abnormal clock chiming (mid clues) confirms mechanical disturbance. Step 3: The victim’s pocket watch time (mid to late clue) disproves the manor clock’s time and invalidates alibis. Step 4: Witness sightings place Dr. Finch at the scene after the manor clock stopped, narrowing to her guilt. The discriminating test uses these established clues to conclusively prove the temporal manipulation and Dr. Finch’s culpability, ensuring the reader can solve the mystery logically."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 3,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 4,
      "essential_clues_before_test": true,
      "early_clues_min": 1,
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
        "Execute the discriminating test with clock spring tension measurement",
        "Present witness testimony on clock chiming",
        "Compare victim’s pocket watch time to manor clock time",
        "Draw conclusion about Dr. Finch’s guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Stable boy testimony and lantern timing confirming alibi",
        "supporting_clues": [
          "Stable boy’s statement about Captain Hale’s presence",
          "Lantern oil traces consistent with claimed timeline"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Servants’ quarters alibi supported by tea bell timing and diary notes",
        "supporting_clues": [
          "Beatrice’s diary entries about tea bell",
          "Bell hammer wear consistent with normal use"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Continuous presence at manor with no opportunity for murder",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with mechanical evidence and timing contradictions"
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_13",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
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
    "summary": "A retired schoolteacher turned amateur sleuth, Eleanor Voss is a genteel observer with deep familial ties to Stoneleigh Manor, whose keen eye and extensive knowledge of family history make her an indispensable figure in unraveling the manor’s mysteries.",
    "publicPersona": "Eleanor presents herself as the quintessential English gentlewoman of her era—poised, articulate, and quietly inquisitive. She moves through Stoneleigh Manor with the grace of a long-familiar guest, engaging others with warm civility and measured curiosity. Her soft-spoken yet incisive manner invites confidences, and she is often found nestled among dusty volumes in the manor’s library, a sanctuary where she appears absorbed in genealogies and old letters.",
    "privateSecret": "Beneath her composed exterior lies a treasure trove of private knowledge: Eleanor possesses intimate access to the family’s hidden correspondences and grudges, some lingering from decades past. She has long harbored a subtle resentment toward certain family members, fueled by secrets concealed in yellowed letters and whispered rumors. This deep understanding of the family’s tangled history grants her insights that others overlook, though she guards these revelations carefully, aware that exposing them could unsettle established relationships.",
    "motiveSeed": "N/A - investigator with no personal motive",
    "motiveStrength": "weak",
    "alibiWindow": "Present in the manor library from 8pm until the body was discovered at 9:15pm",
    "accessPlausibility": "easy",
    "stakes": "Eleanor seeks justice for the victim and clarity on the family secrets that have long haunted Stoneleigh Manor. Her reputation as a reliable chronicler of the family’s history and a perceptive observer is on the line, for this investigation could either affirm or undermine her standing among the manor’s inhabitants.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Eleanor speaks with a deliberate, measured cadence, her voice soft but resolute. She favors polite, old-fashioned turns of phrase and often employs gentle irony or subtle understatement to convey her observations. Her humour emerges as quiet asides or wry comments, delivered in a tone that suggests she knows far more than she reveals.",
    "internalConflict": "Eleanor wrestles with the burden of her knowledge about the family’s past—whether to protect the fragile peace by keeping secrets or to pursue truth at the risk of irrevocable damage to relationships she values deeply.",
    "personalStakeInCase": "Having known the family for decades, Eleanor feels a profound responsibility to see justice done and the truth unearthed, not merely for the victim but to set right the historical wrongs that have long festered within Stoneleigh Manor’s walls.",
    "paragraphs": [
      "Eleanor Voss embodies the archetype of the genteel amateur sleuth, her keen intellect sharpened by years as a schoolteacher and a lifelong fascination with the complex tapestry of Stoneleigh Manor’s lineage. Though ostensibly a visitor, her presence is no mere social call; Eleanor’s familiarity with the family’s intricate dynamics and her access to private letters position her uniquely to perceive undercurrents others miss.",
      "Her approach to investigation is methodical and patient. She prefers to observe quietly, asking pointed questions with the softest of voices, encouraging others to reveal themselves unwittingly. The library is her natural habitat, where she pores over documents and letters, piecing together fragments of the past that hold clues to the present tragedy.",
      "Despite her calm exterior, Eleanor carries a private burden. She knows of old grievances and hidden resentments that have shaped the family’s interactions, and she is torn between preserving the delicate social fabric and exposing uncomfortable truths. Her knowledge is both a weapon and a weight, compelling her to seek justice while fearing the consequences of its revelation.",
      "Her humour is subtle and refined, often a quiet undercurrent beneath her observations. She employs understatement to gently highlight ironies or contradictions, never overtly mocking but always hinting at deeper complexities. This restrained wit endears her to some and puzzles others, but it serves as a shield and a means of social navigation.",
      "Eleanor’s stake in the case transcends mere curiosity. She feels a personal duty to the victim and the family’s legacy, hoping that uncovering the truth will not only solve the murder but also bring long-overdue clarity and perhaps healing to Stoneleigh Manor. Her reputation as a reliable chronicler and perceptive observer hangs in the balance, making this investigation a defining moment in her twilight years."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "The family physician with a calm, rational façade, Dr. Mallory Finch is a conflicted insider whose secret medical dealings with the victim entwine her fate with the estate’s precarious future.",
    "publicPersona": "Dr. Finch carries herself with professional composure, her demeanor steady and reassuring. Known throughout Stoneleigh Manor as a dedicated and trusted medical practitioner, she often dispenses advice with clinical precision and a soothing tone. Her presence commands respect, and she navigates the social intricacies of the family with practiced ease, always maintaining an air of calm rationality.",
    "privateSecret": "Beneath her composed exterior, Dr. Finch harbors a troubling secret: she has been clandestinely treating the victim for a debilitating condition that, if revealed, would jeopardize the legal standing of the estate. This undisclosed ailment undermines the victim’s competency and threatens to unravel the carefully arranged financial and familial order that Dr. Finch depends upon for her own security.",
    "motiveSeed": "Dr. Finch stands to gain by controlling medical records that could invalidate the victim’s legal capacity, thereby preserving her financial arrangement tied to the estate’s continuity. The victim’s recent threats to revoke this arrangement and expose malpractice placed Dr. Finch in grave jeopardy, providing a compelling motive to silence her.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been attending a house call offsite from 8:45pm to 9:20pm, but no independent verification.",
    "accessPlausibility": "possible",
    "stakes": "Her financial security and professional reputation are intimately linked to the estate’s stability. A disruption could mean personal ruin, both socially and economically.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Dr. Finch speaks with measured clarity and authority, choosing her words carefully to convey both expertise and control. Her sentences are often punctuated with a dry, sardonic wit that surfaces in moments of tension or irony, revealing a sharp mind beneath her calm surface. She rarely indulges in frivolity, but when she does, her humour is precise and cutting.",
    "internalConflict": "Dr. Finch is torn between her professional oath to do no harm and the self-preserving impulse to protect her financial and social standing. The ethical dilemma of betraying a patient’s trust versus saving herself creates a gnawing psychological tension.",
    "personalStakeInCase": "This case strikes at the heart of Dr. Finch’s livelihood and integrity. The victim’s death and the secrets surrounding it could either shield her from scandal or expose her to disgrace, making the investigation a matter of personal survival.",
    "paragraphs": [
      "Dr. Mallory Finch is the embodiment of the trusted family physician, whose calm and rational demeanor masks a turbulent inner world. For decades, she has been the unseen guardian of Stoneleigh Manor’s health, dispensing care with unwavering professionalism. Yet, her role extends beyond medicine; she is ensnared in the estate’s financial and social webs, her fortunes tied to its continuance.",
      "Her clandestine treatment of the victim for a secret illness places her in a precarious position. The illness, if revealed, would undermine the victim’s legal capacity and invalidate the current inheritance arrangements that benefit Dr. Finch. The victim’s recent threats to revoke Dr. Finch’s financial arrangement and expose her questionable practices have escalated tensions, providing a potent motive for murder.",
      "Dr. Finch’s alibi—that she was attending an offsite house call during the critical window—is unverified, and this ambiguity fuels suspicion. Her access to the manor and the victim was plausible, given her trusted status, but her movements remain shadowed by uncertainty.",
      "Her humour is a tool of defense, dry and precise, often surfacing as ironic remarks that cut through social facades. This wit is not for levity but a mechanism to maintain control in a situation spiraling beyond her grasp. It tempers the weight of her secrets and the mounting pressure of the investigation.",
      "Caught between professional ethics and personal survival, Dr. Finch grapples with the consequences of exposure. The investigation threatens to unravel her carefully constructed world, forcing her to confront whether self-preservation justifies betrayal of trust and the ultimate cost of silence."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A disciplined retired military officer and estate manager, Captain Ivor Hale harbors bitter resentment over lost inheritance prospects, making him a compelling suspect whose loyalty to the family is strained by financial desperation.",
    "publicPersona": "Captain Hale carries the bearing of a man accustomed to command—stern, precise, and unyielding. His speech is clipped, his posture erect, and his presence commanding respect within Stoneleigh Manor. As estate manager, he presents himself as the loyal steward of the family’s interests, embodying discipline and order amidst the manor’s quiet turmoil.",
    "privateSecret": "Recently passed over for a coveted inheritance role in favor of a younger relative, Captain Hale nurses a deep bitterness. Financial worries compound his resentment, and he privately contemplates drastic measures to secure his position and livelihood.",
    "motiveSeed": "Captain Hale’s motive is compelling: he intends to hasten his inheritance by eliminating the victim, who planned to alter the will to reduce his share. Fearful that legal avenues would expose his prior financial mismanagement, he prefers the certainty of murder over contestation.",
    "motiveStrength": "compelling",
    "alibiWindow": "Says he was inspecting the stables from 8pm to 9pm, corroborated only by a potentially biased staff member.",
    "accessPlausibility": "easy",
    "stakes": "The new will threatens his status and financial security, making the victim’s death a matter of survival for his pride and livelihood.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Captain Hale’s speech is direct and clipped, reflecting his military background. He often punctuates his statements with dry, self-deprecating humour that reveals a man aware of his own flaws and the irony of his predicament. His tone can shift from brusque authority to wry resignation, especially when discussing his thwarted ambitions.",
    "internalConflict": "Captain Hale is caught between his ingrained loyalty to the family and his simmering resentment over being sidelined. This tension fuels a psychological struggle between pride and desperation, as he contemplates actions that betray both his principles and duties.",
    "personalStakeInCase": "The outcome of the case directly affects Captain Hale’s future. The victim’s death could secure the inheritance he covets or doom him to financial ruin and public disgrace, making the investigation intensely personal.",
    "paragraphs": [
      "Captain Ivor Hale is the archetypal retired military man, whose every movement and word is steeped in discipline and authority. As the estate manager, he is the visible enforcer of order within Stoneleigh Manor, respected by staff and family alike. Yet beneath this veneer lies a man wrestling with profound disappointment and bitterness.",
      "Having been passed over for a significant inheritance role in favor of a younger relative, Captain Hale’s pride has been wounded deeply. His financial concerns add urgency to his resentment, and he harbors a secret hope that the victim’s demise might restore what he has lost. This motive is not merely theoretical; it is backed by a willingness to consider murder as a means to an end.",
      "His alibi, placing him at the stables during the critical hour, rests on the word of a staff member whose loyalty to him may obscure the truth. This shaky corroboration invites scrutiny and suspicion, especially given his easy access to the victim and the manor’s inner workings.",
      "Captain Hale’s humour is a surprising blend of military brusqueness and self-effacing wit. He often makes light of his own frustrations and the ironies of his situation, using humour to deflect and to cope with the gulf between his aspirations and reality.",
      "Internally, he is torn between duty and desperation. His loyalty to the family conflicts with his desire for recognition and security, creating a psychological battleground where pride and fear vie for dominance. The case’s outcome will determine not only the estate’s future but the fate of a man grappling with the consequences of his choices."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "The sharp and ambitious estate secretary with a mysterious past, Beatrice Quill is an outsider whose financial pressures and secret liaisons entangle her in the manor’s intrigue with a moderate but significant motive.",
    "publicPersona": "Beatrice presents as an efficient, capable secretary who quickly adapts to the rhythms of Stoneleigh Manor. She is well-liked for her sharp mind and cheerful demeanor, often engaging others with a warm smile and brisk professionalism. Her youth and outsider status give her a fresh perspective, though some regard her with guarded curiosity.",
    "privateSecret": "Behind this polished exterior lies a woman burdened by undisclosed debts and a clandestine relationship with an external party exerting financial pressure. These secrets fuel a quiet desperation and a willingness to maneuver within the estate’s politics to secure her future.",
    "motiveSeed": "Beatrice sees the victim’s death as an opportunity to destabilize the estate’s leadership, enabling her to leverage insider information for a lucrative position or payoff. The victim’s recent intention to terminate her employment after discovering a past indiscretion adds urgency and motive to her actions.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been organizing paperwork in her office from 8:30pm to 9:10pm; no witnesses confirm this.",
    "accessPlausibility": "possible",
    "stakes": "Her very future and financial salvation depend on maintaining or advancing her position within the estate. Failure could mean ruin.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice’s speech is brisk and candid, often laced with sardonic humour that cuts through pretense. She employs sharp, witty remarks and is quick to highlight absurdities, using humour as both a shield and a weapon. Her tone can shift from playful to biting, reflecting her complex mix of ambition and vulnerability.",
    "internalConflict": "Beatrice struggles with trust and ambition, torn between the desire for advancement and the fear of exposure. Her secret debts and relationships weigh heavily, fueling a tension between self-preservation and the risk of betrayal.",
    "personalStakeInCase": "The investigation threatens to unmask her secrets and jeopardize her precarious position. She must navigate the unfolding drama carefully, knowing that the stakes extend beyond the victim to her own survival.",
    "paragraphs": [
      "Beatrice Quill is the embodiment of the ambitious outsider, whose sharp intellect and efficient manner quickly earn her a place within the estate’s inner workings. Her youth and fresh perspective contrast with the manor’s entrenched traditions, making her both a breath of fresh air and a subject of suspicion among long-standing residents.",
      "Her past, however, is shrouded in mystery. Unbeknownst to most, Beatrice carries the heavy burden of undisclosed debts and a secret liaison that compounds her financial and emotional pressures. These hidden burdens drive her to seize any opportunity that might secure her future, even if it means navigating dangerous waters.",
      "The victim’s death presents such an opportunity. Beatrice recognizes that destabilizing the estate’s leadership could open doors for her, especially as she faces imminent dismissal following the discovery of a recent indiscretion. Her alibi is uncorroborated, placing her in a vulnerable position as suspicion mounts.",
      "Her sardonic humour is a defining trait, allowing her to deflate tension and mask vulnerability. She wields wit like a rapier, exposing hypocrisies and absurdities with a sharp tongue, yet beneath this exterior lies a woman wrestling with fear and ambition.",
      "Internally, Beatrice is caught in a web of conflicting desires—to advance, to protect her secrets, and to find genuine trust. The investigation threatens not only to reveal the truth behind the victim’s death but also to expose the precarious foundations of her own life, making her a figure of both intrigue and sympathy."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Stoneleigh Manor",
    "type": "Country house estate (Manor house)",
    "place": "Upper Wychwood",
    "country": "England",
    "summary": "Stoneleigh Manor stands as a venerable country estate nestled amid the rolling woodlands and formal gardens of Upper Wychwood, isolated several miles from the nearest village. Its imposing stone facade and mullioned windows conceal a labyrinth of family secrets beneath the veneer of genteel tradition.",
    "visualDescription": "A sprawling English manor with grey stone walls weathered by decades, tall mullioned windows catching the dim light, and steep pitched roofs capped with ornate chimneys. Formal gardens with clipped yew hedges and gravel paths frame the house, while ancillary buildings like the stables and servants’ quarters cluster discreetly near the rear. The main drive, lined with ancient oaks, curves through estate grounds shrouded in mist and fallen leaves.",
    "atmosphere": "The manor exudes a brooding presence, its traditional architecture cloaked in the chill autumn dusk. The interplay of shadow and faint gaslight, punctuated by intermittent drizzle, imbues the grounds with an air of suspense and latent menace.",
    "paragraphs": [
      "Stoneleigh Manor rises from the misty landscape of Upper Wychwood like a sentinel of an older England. Its stone facades, softened by creeping ivy and the dampness of autumn rain, reflect a fading era of aristocratic dominion. The mullioned windows, often shuttered against the chill, peer out like watchful eyes over the formal gardens where clipped yews and gravel paths weave a muted tapestry of order and restraint. The estate’s layout channels all movement along the main drive, a winding gravel road bordered by ancient oak trees whose skeletal branches creak in the wind.",
      "Beyond the manor’s imposing exterior lies a carefully regimented world, divided sharply between the family’s private wings and the servants’ quarters. The stables and ancillary buildings sit discreetly aside, their utilitarian stone walls less adorned but equally weathered by time. The estate’s isolation, several miles from the nearest village, is accentuated by the limited public transport: a solitary passenger train connects Upper Wychwood to the wider world but arrives infrequently, making the manor a self-contained microcosm after dusk.",
      "Inside, the house is steeped in period detail: heavy oak paneling, gas sconces casting flickering tobacco-yellow light, and the ever-present hum of a radio receiver tuned to distant broadcasts. Telephones on party lines offer intermittent connection with the outside, while manual typewriters clatter in the study where letters and reports are composed. Social hierarchies govern every interaction; staff move with practiced discretion, restricted after hours, while family members inhabit a world of formal routines and guarded conversations.",
      "The chill autumn air carries the faint scent of wet leaves and woodsmoke, mingling with the subtle aroma of beeswax polish and old leather from the manor’s interiors. As dusk deepens, the intermittent drizzle dampens the gravel and stone, softening footsteps and muffling voices, heightening the sense that beneath the manor’s stately calm, a darker narrative is unfolding."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Chilly autumn evening with intermittent drizzle affecting grounds and pathways",
    "timeFlow": "Three days of mounting tension culminating in a climactic revelation",
    "mood": "Tense and expectant, underscored by social unease amid economic uncertainty and political tensions in Europe",
    "eraMarkers": [
      "Radio receivers common in main rooms",
      "Domestic telephones on party lines",
      "Manual typewriters for correspondence",
      "Reliable petrol automobiles on estate grounds",
      "Passenger trains connecting to nearest village",
      "Telegram dispatches via local telegraph office"
    ],
    "sensoryPalette": {
      "dominant": "Damp stone and autumnal earth",
      "secondary": [
        "Faint tobacco smoke and beeswax polish",
        "Muffled footsteps on gravel paths"
      ]
    },
    "paragraphs": [
      "The manor and its grounds are steeped in the damp chill of a late autumn evening. Intermittent drizzle leaves the stone facades slick and dark, while the gravel paths absorb the soft patter of footsteps, muffled beneath a thick canopy of bare branches. The air is heavy with the mixed scents of wet earth, woodsmoke from distant chimneys, and the faint trace of beeswax polish lingering inside the house. The atmosphere is thick with anticipation, the estate’s isolation amplifying every creak and whisper as shadows lengthen.",
      "Inside Stoneleigh Manor, the low glow of gas sconces and the crackle of a radio broadcast mingle with the quiet rustle of paper and the occasional distant voice. The house feels alive yet constrained by invisible social codes, the formal daily routines governing movement and interaction. Outside, the intermittent drizzle weaves a fragile veil over the estate grounds, blurring sightlines and softening sound, while the cold autumn air presses in, lending a weight of foreboding to every step taken beneath the ancient oaks."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Great Hall",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A vast chamber with high timbered ceilings and heavy oak paneling, dominated by a massive stone fireplace and a grand antique clock whose hands are frozen backward. Tapestries depicting ancestral coats of arms hang along the walls, and a long polished oak table occupies the center beneath wrought iron chandeliers.",
      "sensoryDetails": {
        "sights": [
          "flickering gaslight on dark oak",
          "glinting brass clock hands",
          "shadowed tapestry folds",
          "polished oak table surface",
          "heavy velvet draperies drawn"
        ],
        "sounds": [
          "muted echoes of footsteps",
          "distant ticking from a grandfather clock",
          "soft crackle of dying firewood",
          "rustle of heavy fabric",
          "low murmur of voices beyond door"
        ],
        "smells": [
          "smoky wood ash",
          "musty tapestry fabric",
          "aged leather-bound books",
          "faint scent of beeswax polish",
          "cold stone and damp air"
        ],
        "tactile": [
          "rough-hewn oak bench",
          "cool stone floor tiles",
          "smooth brass clock face",
          "heavy velvet curtain folds",
          "chill draft from tall windows"
        ]
      },
      "accessControl": "Restricted to family and invited guests during evening gatherings; estate staff barred after dinner except for cleaning; locked overnight with security by house steward.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through leaded glass",
            "rain-streaked windowpanes",
            "damp stone hearth edges"
          ],
          "sounds": [
            "steady rain tapping roof slates",
            "dripping water from eaves",
            "soft creak of settling timbers"
          ],
          "smells": [
            "damp stone",
            "wet wood smoke",
            "cold beeswax and ash"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light on oak paneling",
            "deep shadows beneath tapestries",
            "flickering gaslight reflections"
          ],
          "sounds": [
            "silence broken by distant clock ticks",
            "soft rustle of fabric",
            "distant muffled footsteps"
          ],
          "smells": [
            "musty tapestry fabric",
            "aged leather",
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
            "long shadows across polished wood",
            "glimmer of fire embers"
          ],
          "sounds": [
            "crackling fire",
            "low voices murmuring",
            "tick of grandfather clock"
          ],
          "smells": [
            "warm beeswax",
            "tobacco smoke",
            "cold fireplace ash"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Great Hall, with its towering timbered ceiling and imposing stone hearth, holds the weight of generations beneath its oak-paneled walls. The grand antique clock, its hands mysteriously frozen backward, dominates one end, casting an eerie symbol over the scene. Heavy velvet drapes mute the outside world, and the flickering gaslight throws dancing shadows over ancestral tapestries, giving the room a somber, almost sacred atmosphere.",
        "Sounds are hushed here; footsteps echo softly on the cold stone tiles, and the faint tick of a distant grandfather clock marks time with an unsettling regularity. The air carries the mingled scents of smoky wood ash, aged leather, and beeswax polish, creating a sensory tapestry that is both comforting and disquieting. Access is tightly controlled, with the family and select guests permitted during evening gatherings, while staff are kept strictly at bay after hours, making the hall a sealed stage for the unfolding mystery."
      ]
    },
    {
      "id": "library",
      "name": "Stoneleigh Manor Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A cozy yet grand room lined floor to ceiling with leather-bound volumes. Dark mahogany shelves rise beneath stained glass windows, and a large green-shaded banker’s lamp illuminates a heavy oak desk scattered with handwritten letters and a manual typewriter. A deep wingback chair sits near a crackling fireplace.",
      "sensoryDetails": {
        "sights": [
          "rows of worn leather spines",
          "green-shaded desk lamp glow",
          "stained glass window panels",
          "scattered handwritten letters",
          "glimmer of brass lamp fittings"
        ],
        "sounds": [
          "soft crackle of burning logs",
          "rustle of turning pages",
          "faint tapping of typewriter keys",
          "quiet footsteps on thick carpet",
          "distant clock chimes"
        ],
        "smells": [
          "old paper and ink",
          "leather bindings",
          "wood smoke",
          "faint scent of pipe tobacco",
          "polished mahogany"
        ],
        "tactile": [
          "smooth leather chair armrest",
          "cool brass lamp base",
          "rough parchment paper edges",
          "soft wool carpet underfoot",
          "warm fireplace stone"
        ]
      },
      "accessControl": "Accessible to family members and senior staff during the day; locked after dusk except for the house librarian and select guests; visitors require escort.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dull grey light through stained glass",
            "rain-speckled windowpanes",
            "glossy leather book spines"
          ],
          "sounds": [
            "rain tapping on window ledges",
            "soft crackle of fireplace",
            "typewriter bell chime"
          ],
          "smells": [
            "damp paper",
            "wet leather",
            "wood smoke"
          ],
          "mood": "reflective quiet"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on mahogany shelves",
            "shadows pooling in corners",
            "faint glow from desk lamp"
          ],
          "sounds": [
            "pages turning slowly",
            "distant clock striking",
            "soft murmurs from adjoining rooms"
          ],
          "smells": [
            "aged paper",
            "leather polish",
            "smoky embers"
          ],
          "mood": "studious stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm lamp light on desk",
            "flickering fireplace shadows",
            "glint of brass fittings"
          ],
          "sounds": [
            "fire crackling",
            "quiet footsteps",
            "distant voices fading"
          ],
          "smells": [
            "pipe tobacco",
            "beeswax polish",
            "warm wood smoke"
          ],
          "mood": "intense focus"
        }
      ],
      "paragraphs": [
        "The library is a sanctuary of knowledge and quiet contemplation within Stoneleigh Manor. Floor-to-ceiling shelves lined with aged leather-bound books create a cocoon of dark mahogany and soft green lamp light. Stained glass windows filter the outside world into muted colours, while the crackle of the fireplace and the faint clatter of a manual typewriter punctuate the stillness.",
        "Scattered letters and manuscripts hint at hidden secrets, inviting careful scrutiny. The scent of old paper mingles with pipe tobacco and wood smoke, creating a rich sensory backdrop. Access is carefully controlled; the room serves as a refuge for family members and trusted staff, a place where clues may be uncovered away from prying eyes."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants' Hall",
      "type": "interior",
      "purpose": "Gathering space and staff quarters",
      "visualDetails": "A modest, functional room with plain wooden tables and benches, lit by a single gas chandelier. Walls are painted in muted cream, with a scullery door leading to the kitchens. A large clock hangs above a sideboard laden with tea urns and crockery. The floor is worn flagstone, and a coal stove radiates heat.",
      "sensoryDetails": {
        "sights": [
          "flickering gas chandelier light",
          "plain wooden tables",
          "clock face with black hands",
          "scullery door ajar",
          "tea-stained crockery"
        ],
        "sounds": [
          "clinking of china cups",
          "quiet staff chatter",
          "soft footsteps on flagstones",
          "distant clatter from kitchen",
          "steady ticking of wall clock"
        ],
        "smells": [
          "strong tea and boiled milk",
          "coal smoke",
          "stale bread and porridge",
          "wet wool uniforms",
          "damp stone walls"
        ],
        "tactile": [
          "rough wooden bench",
          "warm metal tea urn",
          "cool flagstone floor",
          "coarse wool fabric",
          "charred stove surface"
        ]
      },
      "accessControl": "Restricted to domestic staff during working hours; locked at night; family and guests strictly prohibited except by invitation; staff observe strict hierarchy within.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "damp coats hanging on hooks",
            "grey light through small window",
            "steam rising from tea urn"
          ],
          "sounds": [
            "rain tapping on windowpanes",
            "murmured morning greetings",
            "clatter of breakfast dishes"
          ],
          "smells": [
            "strong tea",
            "wet wool and coal smoke",
            "freshly baked bread"
          ],
          "mood": "brisk routine"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on wooden surfaces",
            "shadowed corners",
            "steam from recently washed cups"
          ],
          "sounds": [
            "quiet conversation",
            "distant kitchen noises",
            "steady clock ticking"
          ],
          "smells": [
            "damp stone",
            "coal smoke",
            "stale bread"
          ],
          "mood": "tired endurance"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from stove",
            "long shadows on flagstones",
            "empty tables"
          ],
          "sounds": [
            "soft footsteps fading away",
            "distant closing doors",
            "steady clock ticking"
          ],
          "smells": [
            "cold tea residue",
            "cooled coal smoke",
            "damp wool"
          ],
          "mood": "quiet exhaustion"
        }
      ],
      "paragraphs": [
        "The Servants' Hall is a stark contrast to the manor’s grandeur, reflecting the practical needs of domestic staff within its plain painted walls and worn flagstone floor. A single gas chandelier casts a flickering light over rough wooden tables and benches, while the steady ticking of a large clock keeps time over the room. The coal stove radiates a comforting heat, warding off the chill from the damp stone beneath.",
        "The air is thick with the smells of strong tea, coal smoke, and the faint tang of wet wool uniforms. Staff gather here during working hours to eat, rest, and exchange muted conversation, bound by strict social codes and hierarchy. After hours, the room is locked and silent, a quiet bastion of the servant class separate from the family’s world."
      ]
    },
    {
      "id": "estate_gardens",
      "name": "Formal Gardens",
      "type": "exterior",
      "purpose": "Outdoor setting for movement and concealment",
      "visualDetails": "Symmetrical beds of clipped yew and box hedge maze, gravel pathways lined with fallen chestnut leaves, stone benches beneath ancient oaks, and a central fountain worn smooth by time. The gardens lie between the manor and the stables, enclosed by low stone walls.",
      "sensoryDetails": {
        "sights": [
          "glossy dark green hedges",
          "fallen golden chestnut leaves",
          "smooth stone fountain basin",
          "mist-shrouded gravel paths",
          "ancient oak silhouettes"
        ],
        "sounds": [
          "soft crunch of leaves underfoot",
          "distant drip of fountain water",
          "rustle of dry foliage",
          "whispering autumn breeze",
          "far-off birdcalls"
        ],
        "smells": [
          "wet earth and moss",
          "damp leaf litter",
          "faint scent of woodsmoke",
          "fresh autumn air",
          "cold stone and dew"
        ],
        "tactile": [
          "rough bark of oak trees",
          "cool smooth stone bench",
          "crisp fallen leaves",
          "damp gravel underfoot",
          "chill autumn breeze"
        ]
      },
      "accessControl": "Open to family and guests during daylight hours; restricted after dusk with estate gates locked; staff permitted for gardening duties early morning and late afternoon only.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-beaded leaves",
            "fog clinging to hedges",
            "puddles on gravel paths"
          ],
          "sounds": [
            "steady rainfall on foliage",
            "drip from leaves",
            "soft squelch of wet earth"
          ],
          "smells": [
            "fresh rain on soil",
            "damp moss",
            "wet leaves"
          ],
          "mood": "quiet solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on wet leaves",
            "shadowless garden paths",
            "mist rising from earth"
          ],
          "sounds": [
            "rustle of dry leaves",
            "drip of lingering rain",
            "distant bird calls"
          ],
          "smells": [
            "earth and fallen leaves",
            "woodsmoke faint on breeze",
            "cold damp stone"
          ],
          "mood": "watchful stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "long shadows across gravel",
            "moonlight on stone benches",
            "glinting fountain surface"
          ],
          "sounds": [
            "soft whisper of breeze",
            "distant owl calls",
            "crunch of dry leaves"
          ],
          "smells": [
            "cool autumn air",
            "dry leaf litter",
            "faint woodsmoke"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The formal gardens at Stoneleigh Manor form a carefully tended space of symmetry and order, where clipped yew hedges and box maze beds create a structured landscape contrasting with the wildness of the surrounding woods. Gravel paths wind between stone benches and a central fountain, its basin smoothed by decades of weathering. The gardens lie nestled between the manor and stables, enclosed by low stone walls that mark the boundary between cultivated order and untamed estate grounds.",
        "In autumn, the gardens are carpeted with fallen chestnut leaves and shrouded in mist, the damp earth releasing a rich scent mingled with faint woodsmoke from nearby chimneys. Sounds are muted by the soft crunch of leaves and the whisper of a chill breeze through bare branches. The gardens serve as both a place of quiet reflection and a potential stage for clandestine movement, their sightlines broken by hedges and ancient oaks, offering concealment and mystery beneath the fading light."
      ]
    }
  ],
  "note": "",
  "cost": 0.0066521950000000005,
  "durationMs": 55752
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1936,
    "month": "September",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "September",
    "weather": [
      "chilly evenings with temperatures dropping to around 50°F (10°C)",
      "intermittent drizzle dampening gravel pathways and estate grounds",
      "morning mists lingering over fields and hedgerows"
    ],
    "daylight": "daylight hours have shortened noticeably; sunset occurs around 7:30 PM, with twilight fading by 8:00 PM",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded and the manor has settled into quiet",
    "holidays": [
      "Harvest Festival preparations begin late in the month",
      "Michaelmas (September 29) observed in rural communities"
    ],
    "seasonalActivities": [
      "harvesting apples and plums from estate orchards",
      "preparing and preserving fruits and vegetables for winter stores",
      "fox hunting season commencing with early morning meets"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece wool suits in muted earth tones like brown and grey",
        "tweed jackets with elbow patches",
        "wide-brimmed felt hats such as fedoras or trilbies"
      ],
      "casual": [
        "knitted argyle sweaters layered over collared shirts",
        "plus-fours or knickerbockers for outdoor activities",
        "leather brogue shoes with sturdy soles"
      ],
      "accessories": [
        "silk neckties with geometric patterns",
        "pocket watches on chains",
        "leather gloves for outdoor excursions"
      ]
    },
    "womensWear": {
      "formal": [
        "bias-cut evening gowns in rich fabrics like silk and velvet",
        "tailored suits with padded shoulders and peplum waists",
        "cloche hats adorned with feathers or veils"
      ],
      "casual": [
        "knee-length wool skirts paired with fitted cardigans",
        "blouses with Peter Pan collars and bow details",
        "leather ankle boots with modest heels"
      ],
      "accessories": [
        "beaded handbags or small structured purses",
        "silk scarves tied at the neck",
        "long gloves for formal occasions"
      ]
    },
    "trendsOfTheMoment": [
      "streamlined, modernist cuts emphasizing practicality mixed with elegance",
      "return to darker autumnal colors like burgundy, forest green, and navy",
      "increasing popularity of sportswear-inspired garments for country living"
    ],
    "socialExpectations": [
      "men expected to maintain a polished appearance even during leisure activities",
      "women to balance fashionable sophistication with modesty in public",
      "strict adherence to class-based dress codes within the estate and social circles"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Spanish Civil War has erupted in July 1936, stirring political debates across Europe",
      "King Edward VIII's controversial relationship with Wallis Simpson begins attracting widespread attention",
      "The British government grapples with rising unemployment amid lingering Great Depression effects"
    ],
    "politicalClimate": "Tense and uncertain, marked by fears of fascism spreading from continental Europe and debates over Britain's role in foreign conflicts",
    "economicConditions": "Slow economic recovery with persistent pockets of hardship; landed gentry face increased pressure to sustain estates amid declining agricultural profits",
    "socialIssues": [
      "class divisions remain pronounced but subtle shifts begin as some working-class voices seek greater influence",
      "women increasingly engaged in social reform and limited workforce participation",
      "racial and colonial tensions simmer within the British Empire's overseas territories"
    ],
    "internationalNews": [
      "Germany reoccupies the Rhineland in March 1936, heightening European anxieties",
      "The Berlin Summer Olympics concluded in early August, showcasing political propaganda alongside athletic prowess"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby - \"Pennies from Heaven\"",
        "Duke Ellington - \"Caravan\"",
        "Gracie Fields - \"Sing as We Go\""
      ],
      "films": [
        "\"Modern Times\" starring Charlie Chaplin (released early 1936)",
        "\"The Great Ziegfeld\" (Oscar-winning musical film)",
        "\"Sabotage\" directed by Alfred Hitchcock"
      ],
      "theater": [
        "\"Richard of Bordeaux\" by Gordon Daviot",
        "\"Call It a Day\" by Dodie Smith",
        "\"The Women\" by Clare Boothe Luce"
      ],
      "radio": [
        "BBC Home Service broadcasts popular drama serials and news",
        "\"In Town Tonight\" variety program",
        "\"The Green Goddess\" radio adaptation"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie's \"Cards on the Table\" (published June 1936)",
        "John Steinbeck's \"In Dubious Battle\" (published early 1936)",
        "Graham Greene's \"England Made Me\" (published 1935)"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "social realism",
        "modernist poetry and experimental prose"
      ]
    },
    "technology": {
      "recentInventions": [
        "improvements in radio receiver technology making sets more affordable",
        "emergence of early television experiments in Britain",
        "streamlined automobile designs gaining popularity"
      ],
      "commonDevices": [
        "domestic telephones connected to party lines",
        "manual typewriters for correspondence and record keeping",
        "wireless radios in main rooms for news and entertainment"
      ],
      "emergingTrends": [
        "increased electrification of rural estates",
        "growing use of motor cars replacing horse-drawn carriages",
        "early adoption of central heating in larger homes"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 4 pence",
        "Pint of milk: 2 pence",
        "Taxi ride across town: 2 shillings"
      ],
      "commonActivities": [
        "afternoon tea served promptly at 4 PM",
        "Sunday church attendance for estate inhabitants",
        "evening card games or radio listening in the drawing room"
      ],
      "socialRituals": [
        "formal announcement of visitors by the butler upon entry",
        "strict mealtime seating arrangements reflecting social hierarchy"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "deference to the landed gentry remains expected, though economic pressures cause subtle tensions",
      "servants maintain strict professional boundaries, rarely crossing into personal familiarity"
    ],
    "gender": [
      "men viewed as heads of households and estate managers",
      "women expected to embody grace and uphold social propriety",
      "increasing but cautious acceptance of women's roles outside traditional domestic spheres"
    ],
    "race": [
      "British Empire’s colonial attitudes persist with paternalistic views",
      "limited awareness or engagement with racial equality movements within rural England"
    ],
    "generalNorms": [
      "privacy and discretion are paramount in upper-class households",
      "public displays of emotion are restrained, especially among the gentry",
      "strict adherence to etiquette governs interactions, particularly between classes"
    ]
  },
  "atmosphericDetails": [
    "The faint scent of damp earth and fallen leaves blends with the sharp tang of wood smoke from manor chimneys.",
    "Soft footsteps echo on the wet gravel paths as servants hasten between the stables and kitchen, umbrellas held low against persistent drizzle.",
    "The ticking of an ornate grandfather clock punctuates the quiet halls, its backward toll resonating oddly in the tense evening air."
  ],
  "paragraphs": [
    "September 1936 finds the English countryside edged in the cool breath of autumn. The manor house estate is cloaked in a persistent drizzle, slicking the gravel pathways and dulling the vibrant greens of summer to muted hues. As daylight wanes before the evening meal, mists rise from the hedgerows, lending an eerie softness to the landscape. Preparations for Michaelmas and the Harvest Festival mark the rhythm of rural life, while fox hunting parties begin their early morning meets, a tradition deeply woven into the fabric of country living.",
    "Within the manor, fashion reflects the dual demands of formality and practicality. Gentlemen don tailored tweeds and three-piece suits, their felt hats pulled firmly against the chill. Ladies favor bias-cut gowns and tailored suits, accessorized with cloche hats and silk scarves that echo the era’s modernist elegance tempered by autumnal restraint. The estate’s social rituals – from the punctual serving of afternoon tea to the strict seating arrangements at dinner – preserve order amid the subtle unease bred by economic uncertainty and the political tensions looming across Europe.",
    "Daily life unfolds beneath the hum of wireless radios broadcasting news of the Spanish Civil War and King Edward VIII's increasingly scrutinized private life. The domestic telephone’s muted ring and the clack of manual typewriters punctuate the manor’s quietude. Within this structured environment, class and gender roles remain firmly entrenched, yet the pressures of the times hint at the slow stirrings of change. The air is thick with expectation, every creak and shadow a reminder that beneath the estate’s stately veneer, tensions quietly mount, awaiting the night’s backward toll."
  ],
  "note": "",
  "cost": 0.00321293,
  "durationMs": 34019
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amidst the rigid class divisions and formal routines of a self-sufficient English manor during the 1930s economic strain, the invited gentry and essential staff are confined by estate security and social protocol, intensifying tensions as a mechanical clock-tampering murder disrupts the fragile order.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Strict hierarchies separate the landed gentry from their staff, with formal daily routines enforcing social roles; the Great Depression's pressures heighten economic anxieties while the estate's self-sufficiency masks broader instability."
  },
  "setting": {
    "location": "Traditional English manor house surrounded by formal gardens, estate grounds, stables, and servants' quarters",
    "institution": "Country house estate (Manor house)",
    "weather": "Chilly autumn evening with intermittent drizzle affecting grounds and pathways"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "Classic Golden Age country-house mystery emphasizing fair-play deduction through mechanical clock tampering, set against a backdrop of social hierarchy, economic unease, and constrained isolation."
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
    "id": "spring_tension_measure",
    "value": "six pounds three ounces",
    "description": "The measured residual spring tension indicating partial rewind"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock’s mechanism relies on the manor clock and the study room setup to expose the false timing of the murder, revealing how the backward winding created a misleading time display.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The mechanism relies on manor, clock, and study to expose the false timing.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock was deliberately wound backward by exactly forty minutes, not stopped naturally, as shown by the scratch marks on the clock back plate and fresh oil stains on the winding key found in the study.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The clock was deliberately wound backward, not stopped naturally, indicating tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The manor clock’s winding key was found in the study with fresh oil stains and a slight scratch on the back plate, indicating recent use and tampering.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "The manor clock’s winding key was recently used and shows tampering signs.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Witnesses heard the manor clock chime twice in quick succession just before it stopped, an abnormal behavior indicating the clock’s mechanism was disturbed.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Witnesses heard manor clock chime twice rapidly before stopping, indicating disturbance.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The clock’s mechanism was found disturbed with scratch marks and irregularities, corroborating the abnormal chiming and tampering.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The clock’s mechanism was disturbed, confirming tampering.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The victim’s pocket watch was found stopped at eleven-fifty, well after the manor clock’s stopped time of ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Victim’s pocket watch stopped later than manor clock, indicating later time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "The true time of death is later than the manor clock’s stopped time, invalidating alibis based on the clock’s displayed time.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Death occurred later than manor clock time, contradicting alibis relying on clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "Dr. Mallory Finch was seen near the study shortly after the manor clock stopped, inconsistent with his claimed whereabouts.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "Dr. Mallory Finch was near the study after manor clock stopped, placing him at the crime scene.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "Dr. Finch had the opportunity to commit the murder during the true time window obscured by the clock tampering, as he had access and was near the study.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "Dr. Finch had opportunity to commit murder during obscured time window.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "A controlled comparison is staged at Stoneleigh Manor where the manor clock spring tension is measured at six pounds three ounces, confirming partial rewind consistent with tampering.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[3]",
      "pointsTo": "Controlled comparison at Stoneleigh Manor measures spring tension confirming tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "Dr. Mallory Finch’s unique trace is the fresh oil stains matching those on the manor clock’s winding key, linking him directly to the tampering mechanism.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "Dr. Mallory Finch is linked to the clock tampering by fresh oil stains.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "behavioral",
      "description": "Dr. Mallory Finch had been preparing to silence the victim who threatened exposure, as evidenced by his recent acquisition of oil and tools found in his quarters.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[2]",
      "pointsTo": "Dr. Mallory Finch’s premeditation to silence victim who threatened exposure.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because his alibi is corroborated by stable boy testimony and lantern oil traces placing him away from the manor during the murder time window.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale was elsewhere during the murder, excluding him as suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_12",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because her alibi is supported by servants’ quarters logs and tea bell mechanism notes confirming her presence away from the study.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Beatrice Quill was accounted for during the murder, excluding her as suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because his alibi is corroborated by stable boy testimony and lantern oil traces, narrowing the solution toward Dr. Mallory Finch.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Eliminates Captain Ivor Hale because alibi evidence excludes him, focusing suspicion on Dr. Mallory Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_13",
      "category": "physical",
      "description": "The manor clock’s winding key shows fresh oil stains and a slight scratch on the back plate, indicating recent use and tampering.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "Physical evidence of recent winding key use and tampering.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "temporal",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Manor clock stopped at ten minutes past eleven remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [],
  "status": "pass",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_mechanism_visibility_core",
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_13"
    ],
    "mid": [
      "clue_core_contradiction_chain",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_11",
      "clue_12",
      "clue_core_elimination_chain",
      "clue_culprit_direct_dr_mallory_finch"
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
  "latencyMs": 30396,
  "cost": 0.00496515
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
