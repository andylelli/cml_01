# Actual Prompt Record

- Run ID: `mystery-1779993526746`
- Project ID: ``
- Timestamp: `2026-05-28T18:44:49.339Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `51134e318bd8f7ff`

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
    "title": "The Reversed Pendulum Enigma",
    "author": "Anonymous Golden Age Specialist",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "No modern forensic technology beyond fingerprinting and basic toxicology",
        "Mechanical clocks and sundials standard for timekeeping",
        "Social hierarchy strictly enforced in country estates",
        "Basic telephony present but limited"
      ]
    },
    "setting": {
      "location": "Isolated manor house on rural estate",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "country house estate (manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "clock-tampering assisted temporal misdirection"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [
        "Consulting guest to the manor",
        "Respected among gentry and staff"
      ],
      "public_persona": "Observant, calm, analytical",
      "private_secret": "Harbors distrust for surface appearances",
      "motive_seed": "None - professional interest only",
      "motive_strength": "none",
      "alibi_window": "Present at manor from morning till discovery",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Interviewing all household members",
        "Access to all public areas"
      ],
      "behavioral_tells": [
        "Careful note-taking",
        "Persistent questioning"
      ],
      "stakes": "Resolve murder fairly",
      "evidence_sensitivity": [
        "Clock mechanics",
        "Witness statements",
        "Physical traces on clock"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "50-60",
      "role_archetype": "Medical expert / family physician",
      "relationships": [
        "Trusted family doctor to manor lord",
        "Respected among staff"
      ],
      "public_persona": "Calm, professional, discreet",
      "private_secret": "Financial troubles unknown to others",
      "motive_seed": "Desire to silence victim over medical malpractice cover-up",
      "motive_strength": "moderate",
      "alibi_window": "Claims attending another patient in nearby village at time of death",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Visits to manor for medical reasons",
        "Access to private study and clock tower"
      ],
      "behavioral_tells": [
        "Moments of nervous hesitation",
        "Avoids clock topic"
      ],
      "stakes": "Risk of professional ruin",
      "evidence_sensitivity": [
        "Clock winding key residue",
        "Medical alibi timing"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Retired military officer, family friend",
      "relationships": [
        "Close companion of manor lord",
        "Respected by staff"
      ],
      "public_persona": "Authoritative, punctual, disciplined",
      "private_secret": "Hidden gambling debts",
      "motive_seed": "Financial gain from victim's silence",
      "motive_strength": "strong",
      "alibi_window": "Claims gardening in formal gardens during murder window",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to gardens and clock tower",
        "Knowledge of clock mechanism from military training"
      ],
      "behavioral_tells": [
        "Impatient demeanor",
        "Insists on exact timing"
      ],
      "stakes": "Avoid financial scandal",
      "evidence_sensitivity": [
        "Dust on pendulum bob",
        "Gardener's testimony"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Lady's maid",
      "relationships": [
        "Serves victim's household",
        "Close to staff and family"
      ],
      "public_persona": "Loyal, discreet, observant",
      "private_secret": "Secretly resentful of class divide",
      "motive_seed": "Desire to protect a secret involving victim",
      "motive_strength": "moderate",
      "alibi_window": "Busy in servants’ quarters during time of death",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to servant areas and clock winding key storage",
        "Knowledge of daily routines"
      ],
      "behavioral_tells": [
        "Avoids direct eye contact",
        "Fidgets with keys"
      ],
      "stakes": "Employment and reputation",
      "evidence_sensitivity": [
        "Winding key oil residue",
        "Servants’ schedule records"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
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
      "summary": "At an isolated Yorkshire manor during a damp autumn, the lord of the estate is found dead. The grand clock in the manor shows a time forty minutes before the estimated moment of death, misleading all alibis and witness accounts. Eleanor Voss, a visiting detective, uncovers a complex clock-tampering mechanism exploiting the pendulum's inertia and winding direction to mask the true timing of death. Through examination of clock mechanics, staff testimonies, and physical clues, the mystery unravels to reveal Captain Ivor Hale's premeditated murder masked by temporal misdirection."
    },
    "accepted_facts": [
      "The manor's grand clock was showing a time forty minutes earlier than the actual time of death.",
      "The pendulum bob's dust patterns indicated reversed swing wear marks.",
      "A clockmaker's manual was found near the clock, open to the section on pendulum mechanics.",
      "A winding key with fresh oil residue matching the clock's mechanism was found in the servants' quarters.",
      "Captain Ivor Hale was seen in the garden near the clock tower during the estimated murder window.",
      "Dr. Mallory Finch claimed to be attending a patient in a distant village at the time of death.",
      "Beatrice Quill was occupied in the servants’ quarters during the time of the murder.",
      "Eleanor Voss was present in common areas throughout the day."
    ],
    "inferred_conclusions": [
      "The clock was deliberately wound backward to create a false timeline.",
      "Captain Ivor Hale had both motive and opportunity to manipulate the clock.",
      "Dr. Finch's alibi is unconfirmed but lacks physical contradiction.",
      "Beatrice Quill's presence in servants' quarters limits her opportunity to tamper with the clock.",
      "Eleanor Voss is the detective and not involved in the crime."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The culprit reversed the pendulum’s swing direction and wound the manor's grand clock backward by precisely forty minutes. This physical manipulation exploited the clock’s mechanical backlash delay, causing the displayed time to lag behind the actual time, thus creating a misleading timeline. The reversed swing left distinctive dust wear patterns on the pendulum bob, and the winding key used was recently oiled and stored in the servants' quarters. This manipulation provided a false alibi window, allowing the murderer to commit the crime without immediate suspicion.",
      "delivery_path": [
        {
          "step": "Captain Ivor Hale accessed the clock tower under the guise of inspecting the gardens."
        },
        {
          "step": "He reversed the pendulum’s swing direction and wound the clock backward by forty minutes using the oiled key."
        },
        {
          "step": "The altered clock time misled witnesses and staff, shifting the estimated time of death backward."
        },
        {
          "step": "Hale committed the murder using the false timeline as cover."
        }
      ]
    },
    "outcome": {
      "result": "The false clock time created a temporal illusion that masked the true moment of death, delaying discovery and misdirecting alibis until the detective exposed the tampering."
    }
  },
  "false_assumption": {
    "statement": "The manor’s grand clock displays the accurate time of the victim’s death and thus can be trusted to establish the murder timeline.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock is the central, authoritative timekeeper in the manor, relied upon by all staff and family members for scheduling and alibis, giving it unquestioned credibility.",
    "what_it_hides": "That the clock was deliberately tampered with to display a time forty minutes earlier than actual, creating a false alibi and misleading all temporal evidence."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Victim's body estimated time of death between quarter past three and half past three in the afternoon",
        "Grand clock showed time at quarter past three when body was discovered",
        "Witnesses reference clock time for their alibis"
      ],
      "windows": [
        "Captain Hale's garden presence logged between quarter to three and quarter past three",
        "Dr. Finch's claimed absence from manor between three and four",
        "Beatrice Quill's servants' quarters activity between two fifty and three forty"
      ],
      "contradictions": [
        "Grand clock time conflicts with pendulum dust wear indicating reversed swing",
        "Witnesses' alibis based on clock time contradict physical evidence of death time",
        "Winding key oil residue inconsistent with known clock maintenance schedule"
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Dr. Mallory Finch",
        "Beatrice Quill",
        "Eleanor Voss"
      ],
      "objects": [
        "Grand clock pendulum",
        "Clock winding key",
        "Clockmaker's manual"
      ],
      "permissions": [
        "Only authorized staff allowed clock tower access",
        "Captain Hale had informal access for garden maintenance",
        "Dr. Finch had official reason for clock tower access during medical visits"
      ]
    },
    "physical": {
      "laws": [
        "Pendulum inertia dictates wear patterns based on swing direction",
        "Mechanical clocks cannot instantly adjust time without observable effects",
        "Backlash delay occurs when winding direction is reversed"
      ],
      "traces": [
        "Dust pattern on pendulum bob reversed from normal",
        "Fresh oil residue on winding key",
        "Clockmaker’s manual open to pendulum mechanics section"
      ]
    },
    "social": {
      "trust_channels": [
        "Reliance on grand clock for timekeeping",
        "Witness statements anchored to clock time",
        "Staff adherence to formal schedules"
      ],
      "authority_sources": [
        "Manor lord’s authority over staff",
        "Captain Hale’s informal authority in garden and clock tower areas",
        "Dr. Finch’s medical authority"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Dust on the grand clock's pendulum bob shows reversed wear marks inconsistent with the normal forward swing pattern.",
        "correction": "The pendulum swing direction was reversed, indicating the clock mechanism was tampered with to run backward.",
        "effect": "Narrows timing constraint by invalidating the displayed clock time as accurate for alibis.",
        "required_evidence": [
          "Physical trace: dust pattern on pendulum bob",
          "Physical law: pendulum inertia wear pattern",
          "Accepted fact: grand clock showed inaccurate time"
        ],
        "reader_observable": true
      },
      {
        "observation": "A clockmaker's manual found open near the clock tower details the effects of reversing pendulum swing and winding direction on time display.",
        "correction": "The presence and position of this manual imply premeditated use of the reversed pendulum principle to alter clock time.",
        "effect": "Eliminates accidental tampering; implies deliberate manipulation, focusing suspicion on those with access and knowledge.",
        "required_evidence": [
          "Object: clockmaker's manual open to pendulum section",
          "Social channel: Captain Hale’s knowledge of clock mechanics",
          "Access: clock tower permissions and opportunity"
        ],
        "reader_observable": true
      },
      {
        "observation": "The winding key found in the servants’ quarters has fresh oil residue matching the clock’s interior, inconsistent with scheduled maintenance records.",
        "correction": "Someone recently used the winding key to manipulate the clock, contradicting official maintenance timing.",
        "effect": "Narrows suspects to those with access to servants’ quarters and clock winding key during the murder window, eliminating Dr. Finch due to distance.",
        "required_evidence": [
          "Physical trace: fresh oil residue on winding key",
          "Access record: location of winding key in servants' quarters",
          "Time anchor: scheduled clock maintenance timing"
        ],
        "reader_observable": true
      },
      {
        "observation": "Gardener's testimony places Captain Ivor Hale near the clock tower around quarter past three, the time the clock showed but not the true time of death.",
        "correction": "Captain Hale had opportunity to access and manipulate the clock, exploiting the false clock time for his alibi.",
        "effect": "Focuses suspicion on Captain Hale as the only suspect with both motive and opportunity.",
        "required_evidence": [
          "Witness statement: gardener places Hale at clock tower",
          "False assumption: clock time trusted for alibis",
          "Accepted fact: Captain Hale’s motive for financial gain"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled demonstration comparing the pendulum bob’s dust wear and the clock’s mechanical reaction to forward and backward winding is conducted, exposing the reversed swing and the clock’s backward time display. The test also reveals the timing mismatch between the clock’s displayed time and actual elapsed time during the demonstration, proving the deliberate clock tampering by Captain Ivor Hale.",
    "knowledge_revealed": "This confirms the clock’s displayed time is unreliable due to reversed pendulum swing and backward winding, exposing the false alibi and implicating Captain Hale as the murderer.",
    "pass_condition": "The clock’s displayed time fails to align with the actual elapsed time during the test, and the pendulum bob’s dust wear pattern matches reversed swing motion, proving deliberate tampering.",
    "evidence_clues": [
      "clue_11",
      "clue_mechanism_visibility_core",
      "clue_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The reversed dust pattern on the pendulum bob (early clue) contradicts the assumed forward swing, exposing tampering. Step 2: The open clockmaker’s manual (mid clue) reveals the reversed pendulum principle, indicating deliberate manipulation. Step 3: The fresh oil residue on the winding key from the servants’ quarters (mid clue) ties recent clock access to someone with access there. Step 4: The gardener’s testimony (late clue) places Captain Hale near the clock tower at the critical time, linking opportunity with motive. The discriminating test synthesizes these facts by physically demonstrating the clock’s backward time display, definitively proving Captain Hale’s guilt."
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
        "Execute the pendulum swing and winding direction demonstration",
        "Show dust wear pattern on pendulum bob matching reversed swing",
        "Reveal timing mismatch between clock time and actual elapsed time",
        "Conclude Captain Hale’s tampering and guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Verified alibi from village patient and lack of clock access",
        "supporting_clues": [
          "Dr. Finch's claimed absence from manor",
          "Scheduled maintenance records conflicting with winding key usage"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed presence in servants’ quarters with no access to clock tower",
        "supporting_clues": [
          "Beatrice Quill’s servants’ quarters activity",
          "Winding key location and access permissions"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Detective role and constant presence in public manor areas",
        "supporting_clues": [
          "Eleanor Voss’s alibi window",
          "No motive or opportunity"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with physical evidence of reversed pendulum wear, winding key residue, and timing demonstration"
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
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_13",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_14",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_15",
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
    "summary": "Eleanor Voss is the stalwart estate manager of the rural manor, a calm and efficient woman whose dedication to tradition masks a simmering resentment toward the younger generation.",
    "publicPersona": "To all who know her, Eleanor is the embodiment of composure and competence. She moves through the manor with quiet authority, ensuring every detail of the estate’s daily running is executed flawlessly. Revered for her unflappable nature, she is the linchpin holding the household together amid the shifting tides of time.",
    "privateSecret": "Beneath her serene exterior, Eleanor harbors a deep-seated resentment towards the younger generation’s cavalier disregard for the old ways. She fears the loss of control over the estate she has nurtured for decades, and the erosion of the family legacy she holds sacred.",
    "motiveSeed": "N/A - Detective, no motive for murder.",
    "motiveStrength": "weak",
    "alibiWindow": "Present in the library from 8:30 pm to 10:00 pm, witnessed by two staff members.",
    "accessPlausibility": "easy",
    "stakes": "Determined to preserve the family legacy and maintain order amid generational conflicts.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with measured precision, favoring formal phrasing and a calm, steady cadence. Occasionally lets slip a wry remark, delivered with subtle irony and a knowing glance, revealing a sharp mind beneath her composed facade.",
    "internalConflict": "Eleanor wrestles with a guilt-laden fear that her rigid adherence to tradition may blind her to changing realities, potentially alienating those she wishes to protect. She is torn between loyalty to the past and the necessity for adaptation.",
    "personalStakeInCase": "The murder threatens the fragile stability of the estate and the family legacy she has devoted her life to uphold. Eleanor’s intimate knowledge of the household and its secrets compels her to seek justice, lest chaos undo all she has preserved.",
    "paragraphs": [
      "Eleanor Voss commands the manor with the quiet authority of a seasoned matriarch, her presence a steadying force amid the undercurrents of tension that ripple through the household. Her days are woven with the routines of estate management—overseeing staff, balancing accounts, and smoothing ruffled feathers—each task performed with unwavering dedication. Visitors and residents alike respect her for her efficiency and the calm she brings to even the most fraught moments.",
      "Yet beneath this veneer of control lies a woman at odds with the world she inhabits. Eleanor watches with growing unease as the younger generation flouts customs she holds dear, their modern attitudes threatening the order she has labored to maintain. This simmering resentment sharpens her gaze, making her a keen observer of the subtle shifts in alliances and intentions within the manor’s walls.",
      "Her humour, dry and understated, surfaces in quiet moments—a pointed aside about the folly of change or a sardonic comment on youthful impetuosity. These witticisms, though sparing, serve as both shield and sword, reflecting a mind that is as shrewd as it is restrained. Eleanor’s speech is deliberate, each word weighted with care, revealing a woman who measures her impact as carefully as she manages the estate’s affairs.",
      "Despite her outward composure, Eleanor is haunted by the fear that her devotion to tradition may blind her to the needs of those around her. She wrestles with the possibility that her resistance to change could fracture the very family she seeks to protect. This internal tension fuels her determination to uncover the truth behind the murder, for she knows that only by restoring order can the legacy she cherishes endure.",
      "Her alibi is solid; two trusted staff members place her in the library during the critical hours of the evening. Yet her intimate knowledge of the estate’s rhythms and secrets grants her a unique vantage point. Eleanor moves through the investigation with the patience of a chess player, piecing together clues overlooked by others, driven by a personal stake that transcends mere duty.",
      "In the unfolding drama of the reversed pendulum, Eleanor stands as both guardian and detective—a woman caught between the steadfast past and an uncertain future, wielding her intellect and resolve to navigate the shadows that threaten her world."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a young, ambitious medical doctor whose modern methods clash with tradition, hiding a fierce professional rivalry that may have driven her to desperate measures.",
    "publicPersona": "Bright-eyed and determined, Mallory commands respect as an emerging force in local medicine. She champions progressive treatments and is eager to leave her mark on the clinic, though her zeal sometimes alienates the more conservative community.",
    "privateSecret": "Behind her professional smile lurks a bitter dispute with the victim, who threatened to expose Mallory’s unethical prescription practices. The specter of career ruin looms over her, making murder a grimly considered escape from disgrace.",
    "motiveSeed": "Stood to lose her medical license after the victim threatened to report her unethical prescription practices to the medical board; murder was seen as the only way to prevent exposure and career destruction.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been at a medical emergency at the village clinic from 8:00 pm to 9:15 pm, but no staff can fully confirm her presence the entire time.",
    "accessPlausibility": "possible",
    "stakes": "Career, professional reputation, and financial independence.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks quickly and with a clipped tone, often lacing her words with sharp, sardonic wit. She has a habit of punctuating tense moments with biting remarks and rhetorical questions, revealing impatience with what she views as outdated thinking.",
    "internalConflict": "Mallory battles the fear that her ambition and unorthodox methods will forever estrange her from the community she wishes to serve. She struggles with guilt over her ethical lapses, even as she rationalizes them as necessary for progress.",
    "personalStakeInCase": "The case is a crucible for Mallory’s career and reputation. Exposure would mean professional exile and financial ruin; thus, the investigation’s outcome holds the key to her future and survival.",
    "paragraphs": [
      "Dr. Mallory Finch strides into the manor’s tense atmosphere burdened with the weight of her own aspirations and fears. At an age when many merely settle into their roles, she is a restless force, pushing against the boundaries of tradition that the rural community clings to. Her medical practice is a battleground where innovation clashes with suspicion, and Mallory is determined to emerge victorious.",
      "Her public face is one of earnest professionalism, but those close to the manor’s inner circle sense the undercurrents of conflict that ripple beneath. The victim, an influential figure in local society, had threatened to expose Mallory’s questionable prescription habits—an ethical breach that could shatter her fledgling career. This looming threat casts a shadow over her every move, sharpening her resolve and hardening her gaze.",
      "Mallory’s humour is a weapon of sarcasm and sardonic wit, a shield she wields deftly to disarm critics and veil her insecurities. Her speech is rapid-fire, peppered with rhetorical barbs and impatient asides, betraying a restless mind always a step ahead. She speaks as if in a race against time, aware that every moment could bring her closer to ruin or redemption.",
      "Yet beneath the bravado lies a woman torn between her ideals and the compromises she has made. Mallory wrestles with guilt over her ethical lapses, even as she convinces herself that progress demands such risks. This internal struggle fuels a simmering tension that colors her interactions and decisions throughout the investigation.",
      "Her alibi for the crucial evening hours is tenuous; while she claims to have been attending a medical emergency, no one can fully vouch for her presence the entire time. This ambiguity casts a shadow of suspicion, making her a figure both intriguing and dangerous in the eyes of those piecing together the puzzle.",
      "Caught between the desire to prove herself and the fear of losing everything, Mallory’s role in the reversed pendulum enigma is pivotal. Her ambition, secrets, and sharp intellect ensure she is far more than a mere suspect—she is a woman fighting for survival in a world reluctant to change."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired military officer and landowner, embodying stern authority and old-world values while hiding financial secrets that threaten his legacy.",
    "publicPersona": "A formidable presence, Captain Hale commands respect and, at times, fear. His rigid adherence to tradition and discipline marks him as a man unwilling to yield to the changing social tides, maintaining a stoic, unyielding front.",
    "privateSecret": "Engaged in covert financial dealings with the victim, Hale’s mounting debts risk exposure that could force the sale of family lands and the loss of his status. Murder was a desperate bid to silence the threat.",
    "motiveSeed": "Feared the victim would expose his secret debts to the estate trustees, which would force him to sell family lands and lose status; murder was his desperate way to silence the threat.",
    "motiveStrength": "moderate",
    "alibiWindow": "Reportedly at the billiard room alone from 8:45 pm to 9:30 pm; no direct witnesses but no contradictory evidence.",
    "accessPlausibility": "easy",
    "stakes": "Preservation of family honor, land ownership, and social standing.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Speaks in a clipped, formal manner reminiscent of military precision, often punctuating statements with dry, self-deprecating remarks that belie a hidden vulnerability. Uses measured pauses and avoids unnecessary elaboration.",
    "internalConflict": "Captain Hale is tormented by the fear that his financial failings will irrevocably tarnish the family name he has fought to uphold. His pride clashes with desperation, creating a psychological battleground where honor and survival collide.",
    "personalStakeInCase": "The murder threatens to unravel his carefully maintained facade and jeopardize the estate’s future. Hale’s social standing and identity are inextricably linked to preserving the family lands, making the investigation intensely personal.",
    "paragraphs": [
      "Captain Ivor Hale carries the weight of his military past and landed heritage with a stern dignity that brooks little challenge. His every movement is marked by the discipline of years spent in service, and his presence commands a silent respect that borders on intimidation. Within the manor’s walls, he is both guardian of tradition and enforcer of order.",
      "Yet beneath this austere exterior lies a man grappling with secrets that threaten to undo all he has built. His covert financial dealings with the victim have placed him in a perilous position; exposure would mean the forced sale of ancestral lands and the collapse of his social standing. The stakes are nothing less than the survival of his legacy.",
      "Hale’s humour, rare but telling, emerges in dry, self-deprecating quips that cut through tension like a scalpel. These moments of levity reveal a man painfully aware of his own flaws and the precariousness of his situation, even as he maintains an iron grip on his public persona. His speech is formal and clipped, each word chosen with care, reflecting a mind trained to command and control.",
      "The internal conflict rages beneath the surface—pride battling desperation, honor wrestling with the need for self-preservation. This psychological tension shapes his every interaction, coloring his responses with a guarded edge and a simmering intensity.",
      "His alibi is solitary and unverifiable; he claims to have been alone in the billiard room, a fact neither confirmed nor contradicted. This ambiguity casts a shadow over his innocence, inviting speculation and suspicion in equal measure.",
      "In the tableau of the reversed pendulum, Captain Hale stands as a sentinel of a fading world, his personal demons entwined with the fate of the manor. His struggle to protect his name and lands adds a layer of complexity to the mystery, making him a figure both formidable and vulnerable."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is the head housekeeper whose stern loyalty to the family conceals ambitions and fears that may have driven her toward desperate measures.",
    "publicPersona": "Efficient and unyielding, Beatrice commands the domestic staff with a strict hand and unwavering loyalty. Her reputation for discipline is matched only by her dedication to maintaining the household’s smooth operation.",
    "privateSecret": "Harbors a long-standing grudge against the victim, who intended to replace her with a younger housekeeper to reduce costs. This threatened her livelihood and status, pushing her toward potential desperation.",
    "motiveSeed": "Faced imminent dismissal and loss of livelihood as the victim planned to downsize staff; saw murder as a final act of desperation to protect her position and influence in the household.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was busy organizing dinner service in the kitchen from 8:00 pm to 9:00 pm, but a brief unexplained absence was noted by a junior maid.",
    "accessPlausibility": "possible",
    "stakes": "Job security, social status within the domestic staff hierarchy, and personal dignity.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with clipped precision and a formal tone, often employing polite yet cutting remarks that subtly undermine others. Her humour is sharp but veiled in courteous language, making her barbs all the more effective.",
    "internalConflict": "Beatrice struggles with loyalty to the family and her personal ambition, caught between preserving tradition and adapting to economic pressures. She fears losing not only her job but the respect she commands among the staff.",
    "personalStakeInCase": "The investigation threatens to expose the fragile balance of power within the household. Beatrice’s position and dignity hinge on maintaining control, making the crime deeply personal and politically charged.",
    "paragraphs": [
      "Beatrice Quill moves through the manor with the assuredness of one who knows every creak and shadow as intimately as her own reflection. As head housekeeper, she is the undisputed mistress of the domestic realm, her commands swift and unquestioned. Her efficiency is legendary, and the staff both admire and fear her strict discipline.",
      "However, beneath this veneer of loyalty and order lies a woman bristling with ambition and simmering resentment. The victim’s plans to replace her with a younger, less costly housekeeper threatened not only her livelihood but the social standing she has cultivated within the servant hierarchy. This looming dismissal cast a dark cloud over her thoughts, sharpening her resolve.",
      "Beatrice’s humour is a masterclass in polite savagery. Her words are carefully crafted to appear courteous, yet each compliment or inquiry carries an undercurrent of subtle mockery or challenge. This duality makes her both a formidable ally and a dangerous adversary, her wit a weapon wielded with surgical precision.",
      "Her speech is formal and clipped, reflecting years of managing both people and expectations. She has a knack for delivering cutting observations with a smile that never quite reaches her eyes, leaving listeners uncertain whether to laugh or take offense. This mannerism veils her deeper anxieties about her place in a changing world.",
      "Caught between loyalty to the family she serves and the ruthless demands of economic survival, Beatrice grapples with a profound internal conflict. The fear of losing her position gnaws at her, yet she remains outwardly composed, determined to protect both her job and the dignity she commands among the staff.",
      "Her alibi is largely solid, anchored by her orchestration of the dinner service, but a brief unexplained absence noted by a junior maid introduces a crack in her story. This gap invites suspicion and adds a layer of complexity to her role in the mystery.",
      "In the intricate dance of power and deception within the manor, Beatrice Quill occupies a pivotal position. Her ambitions and fears intertwine with the crime’s unfolding, making her a character as enigmatic as she is indispensable."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Wychwood Manor",
    "type": "country house estate (manor house)",
    "place": "Wychwood Heath",
    "country": "England",
    "summary": "An imposing traditional English manor set deep in the rural isolation of the Cotswold Hills, Wychwood Manor is surrounded by meticulously kept formal gardens and dense woodland, embodying a world of rigid social hierarchy and secretive family affairs.",
    "visualDescription": "A sprawling stone manor with steep slate roofs and tall chimneys, its façade austere and unadorned save for leaded glass windows and a heavy oak front door. The estate is enclosed by high stone walls topped with wrought iron railings, with gravel paths winding through clipped box hedges and ancient yew trees in the formal gardens. The servants' quarters form a low wing to the north, while the family wing rises two stories with shuttered windows overlooking the grounds.",
    "atmosphere": "The manor exudes a quiet, watchful presence, its solid stone walls seeming to hold whispered secrets. The formal gardens appear meticulously ordered yet shadowed by the looming woods beyond. Inside, the air is thick with the scent of beeswax polish and old leather, the ticking of clocks marking measured time in a house where every movement is observed and recorded.",
    "paragraphs": [
      "Wychwood Manor stands in solemn isolation amid the rolling Cotswold Hills, its weathered stone walls and slate roofs blending into the muted palette of autumnal greys and mossy greens. The estate’s high stone boundary, topped with wrought iron finials, encloses formal gardens where clipped box hedges frame gravel paths and statues, their surfaces dulled by decades of damp fog. Towering yews and ancient oaks cast long shadows in the fading daylight, their silhouettes a stark contrast against the low, leaded windows of the manor’s family wing.",
      "Inside, the manor’s interior is a study in restrained tradition—dark oak paneling and heavy curtains absorb the dim light from gas lamps and flickering candles. The scent of beeswax polish mingles with cold stone and the faint musk of aged leather bindings lining the library shelves. Mechanical typewriters sit ready on desks in the study, their keys silent now but hinting at the urgent correspondence that punctuates the household’s daily rhythm. The servants’ wing, quieter and less ornate, hums with the soft clatter of kitchenware and the muted footsteps of staff moving on polished stone floors.",
      "The estate’s isolation is palpable; the single carriageway winding through mist-cloaked woods limits access to the manor, guarded at the wrought iron gates by vigilant staff. The nearest village lies several miles away, reached by uneven country lanes where petrol touring cars struggle against mud and rain. Within these walls, social hierarchies are rigidly maintained—family members occupy the private wing, their movements discreetly shielded from servants who follow strict schedules and protocols. This careful choreography of presence and absence lends an air of tense anticipation to every room and corridor.",
      "Outside, the steady drizzle and overcast skies cast a silvery haze over the gardens and estate roads, muffling sound and blurring sightlines. The persistent dampness clings to fabric and stone alike, seeping into the old manor’s foundations. In this atmosphere of muted light and lingering fog, time seems to slow, each moment weighted with the possibility of revelation or concealment. Wychwood Manor is a place where the past is never far from the surface, and where every shadow could hide a clue."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "damp, overcast skies with intermittent drizzle typical of English countryside in autumn",
    "timeFlow": "Three days of mounting tension and circumscribed movements within the estate",
    "mood": "tense and suspenseful, reflecting social unease during the Great Depression and rising political unrest in Europe",
    "eraMarkers": [
      "domestic rotary dial telephones with party-line exchanges",
      "mechanical typewriters common in offices and households",
      "battery-powered portable radios for news and entertainment"
    ],
    "sensoryPalette": {
      "dominant": "damp stone and beeswax polish",
      "secondary": [
        "faint woodsmoke and leather bindings",
        "soft gravel crunch underfoot"
      ]
    },
    "paragraphs": [
      "The persistent drizzle and cool autumn air wrap Wychwood Manor in a damp, muted shroud. The stone walls, slick with moisture, absorb the diffused grey light that filters through thick cloud cover. Muffled sounds echo faintly across the grounds—soft gravel underfoot, the distant tapping of rain on leaded windows, and the occasional creak of ancient timbers settling. These sensory impressions create an atmosphere heavy with watchfulness and unspoken tension.",
      "Inside, the air carries the scent of beeswax and cold ash from low-burning fires, mingling with the musty musk of old leather-bound volumes and the faint tang of woodsmoke drifting from the hearths. The mechanical click of typewriter keys and the low hum of a battery-powered radio punctuate the stillness, reinforcing the era's blend of tradition and modernity. This layered sensory environment deepens the mood of suspense, as if the manor itself holds its breath, waiting for secrets to surface."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A spacious room lined floor to ceiling with dark oak shelves filled with leather-bound volumes, a large stone fireplace with a wrought iron grate, heavy velvet curtains drawn against the chill, and a massive oak desk cluttered with papers and a silent mechanical typewriter.",
      "sensoryDetails": {
        "sights": [
          "candlelight flickering on dark oak",
          "rain-streaked mullioned window panes",
          "stacked leather-bound books",
          "dust motes in muted light",
          "glossy brass desk fittings",
          "shadowed corners beneath high shelves"
        ],
        "sounds": [
          "soft crackle of dying fire",
          "distant ticking of mantel clock",
          "rustling of heavy curtains",
          "occasional creak of settling wood",
          "whispered footsteps on carpet",
          "pages turning in the silence"
        ],
        "smells": [
          "beeswax and cold ash",
          "old leather bindings",
          "faint woodsmoke from hearth",
          "musty paper and dust",
          "damp stone and polished wood",
          "subtle tobacco smoke trace"
        ],
        "tactile": [
          "smooth polished oak desk",
          "velvet curtain folds",
          "rough grain of leather book covers",
          "cool stone hearth edge",
          "soft woven carpet underfoot",
          "chill draft from leaded window"
        ]
      },
      "accessControl": "Restricted to family members and trusted guests; servants only enter for cleaning before dawn and after dinner; library remains locked outside these times to preserve privacy and evidence integrity.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "grey light across book spines",
            "wet leaves pressed against glass",
            "damp velvet curtain edges"
          ],
          "sounds": [
            "steady drumming on roof slates",
            "water trickling in gutters",
            "soft rustle of rain-soaked trees",
            "distant low thunder"
          ],
          "smells": [
            "damp earth and wet stone",
            "mildew in corners",
            "cold beeswax polish",
            "faint woodsmoke"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light on oak",
            "shadows without edges",
            "dim glow from fireplace",
            "dust particles in shafts of light"
          ],
          "sounds": [
            "silence broken by clock ticking",
            "creak of old floorboards",
            "soft turning of pages",
            "whispered voices muffled outside"
          ],
          "smells": [
            "beeswax polish",
            "dust and old paper",
            "woodsmoke and cold ash",
            "faint tobacco scent"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight catching brass fittings",
            "long shadows across oak floor",
            "glint of fire embers",
            "dark window panes reflecting room"
          ],
          "sounds": [
            "tick of mantel clock",
            "low murmur of voices downstairs",
            "fire crackling softly",
            "footsteps on carpeted stairs"
          ],
          "smells": [
            "candle wax and smoke",
            "tobacco and cold ash",
            "polished wood and leather",
            "faint perfume trace"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library is the heart of the manor’s intellectual life, a sanctuary of tradition and quiet study. Dark oak shelves rise to the ceiling, crammed with leather-bound books whose spines gleam faintly in the flickering candlelight. Heavy velvet curtains, drawn tight against the chill autumn air, absorb the muted daylight filtering through rain-streaked windows. A large, polished oak desk dominates the room’s center, cluttered with scattered papers and the silent keys of a mechanical typewriter, a relic of modernity amid the old world.",
        "The flickering fire casts restless shadows that dance across the carved wood panels and brass fittings, while the scent of beeswax polish mingles with the faint, lingering trace of tobacco smoke. Sounds are subdued here—the soft crackle of the hearth, the ticking of the mantel clock, and the occasional rustling of pages. This controlled stillness conceals the tension beneath, for the library is the scene of the crime, where secrets lie buried among the tomes and the smallest disturbance might reveal a vital clue."
      ]
    },
    {
      "id": "family_wing",
      "name": "The Family Wing",
      "type": "interior",
      "purpose": "Restricted family living quarters and private meeting space",
      "visualDetails": "A series of interconnected rooms with high ceilings, panelled walls, and heavy drapes. Furnishings are elegant yet restrained—upholstered chairs and settees in muted fabrics, framed ancestral portraits, and a grand but unadorned fireplace. The corridor connecting rooms is narrow, with polished wooden floors and wall-mounted gas sconces.",
      "sensoryDetails": {
        "sights": [
          "antique oil portraits in gilded frames",
          "softly patterned wallpaper",
          "polished hardwood floors",
          "heavy velvet curtains",
          "glowing gas sconces",
          "firelight flickering on plaster walls"
        ],
        "sounds": [
          "muffled footsteps on polished floors",
          "quiet murmurs behind closed doors",
          "gentle crackle of fires",
          "soft rustle of silk dresses",
          "distant ticking of wall clock",
          "faint creak of settling beams"
        ],
        "smells": [
          "lavender sachets in drawers",
          "warm beeswax polish",
          "smoke from burning coal",
          "subtle floral perfume",
          "old wood and fabric",
          "drying tobacco leaves"
        ],
        "tactile": [
          "smooth silk upholstery",
          "cool polished wood banisters",
          "soft velvet curtain folds",
          "warm hearth bricks",
          "heavy brass door handles",
          "crisp linen sheets"
        ]
      },
      "accessControl": "Strictly limited to family members and select guests; servants enter only for cleaning at designated times; no unsupervised access allowed to preserve privacy and maintain social hierarchy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through damp windows",
            "shimmering raindrops on glass",
            "dim shadows in corners",
            "wet garden glimpses through panes"
          ],
          "sounds": [
            "soft patter of rain",
            "distant thunder rumble",
            "quiet breathing in rooms",
            "faint clink of china"
          ],
          "smells": [
            "fresh rain on stone",
            "warm beeswax polish",
            "linen drying indoors",
            "faint perfume notes"
          ],
          "mood": "reserved melancholy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on wallpaper patterns",
            "muted firelight glow",
            "shadows pooling near corners",
            "closed blinds dimming rooms"
          ],
          "sounds": [
            "soft ticking of clock",
            "quiet conversation whispers",
            "rustle of silk fabric",
            "fire crackling low"
          ],
          "smells": [
            "coal smoke",
            "lavender sachets",
            "old wood polish",
            "faint tobacco"
          ],
          "mood": "quiet tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm firelight flickering",
            "long shadows on walls",
            "glowing gas lamps",
            "moonlight through windows"
          ],
          "sounds": [
            "soft murmured voices",
            "crackling hearth fire",
            "footsteps on wooden floors",
            "gentle fabric rustling"
          ],
          "smells": [
            "burning coal",
            "warm beeswax",
            "floral perfume",
            "smoke and wood"
          ],
          "mood": "intimate unease"
        }
      ],
      "paragraphs": [
        "The family wing embodies the manor’s private heart, where tradition and discretion govern every interaction. The rooms are spacious yet restrained, furnished with elegant but subdued upholstery, ancestral portraits watching silently from their gilded frames. Heavy velvet drapes and polished hardwood floors absorb sound, creating an atmosphere of quiet retreat from the outside world. Fires burn low in grand hearths, their amber glow softening the paneled walls and lending warmth to the otherwise cool air.",
        "Access is tightly controlled; only family members and trusted guests may enter these sanctuaries, while servants are confined to brief cleaning intervals. The soft rustling of silk dresses and muted conversations behind closed doors contrast with the rigid social order that dictates daily life. Here, secrets are guarded as closely as the heavy brass door handles, and the tension of unspoken truths hangs palpably in the air."
      ]
    },
    {
      "id": "servants_quarters",
      "name": "Servants’ Quarters",
      "type": "interior",
      "purpose": "Staff living and working space",
      "visualDetails": "A modest, dimly lit wing with plain wooden furniture, narrow beds with coarse linens, and scrubbed floors. The walls are painted a pale, practical colour, with few decorations. A communal washroom and a small kitchen area adjoin the sleeping rooms. Narrow windows look out onto the service yard and kitchen gardens.",
      "sensoryDetails": {
        "sights": [
          "faded paint on walls",
          "simple wooden bedframes",
          "linen folded on shelves",
          "dim oil lamps",
          "stacked kitchen utensils",
          "small service yard glimpses"
        ],
        "sounds": [
          "clatter of pots and pans",
          "footsteps on stone floors",
          "low murmurs of staff",
          "water running from taps",
          "distant kitchen bustle",
          "clock chiming hours"
        ],
        "smells": [
          "soap and damp cotton",
          "cooking stew aromas",
          "wet earth from garden",
          "woodsmoke and coal dust",
          "faint starch from linens",
          "sour dampness in corners"
        ],
        "tactile": [
          "rough cotton sheets",
          "cool stone floor",
          "worn wooden chair seats",
          "smooth metal utensils",
          "coarse kitchen towels",
          "damp woollen blankets"
        ]
      },
      "accessControl": "Restricted to household staff; entrances secured after dusk; staff movements recorded and supervised; no family or guests allowed access except by invitation or necessity.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through narrow windows",
            "wet garden paths visible",
            "damp laundry hanging indoors"
          ],
          "sounds": [
            "steady rain tapping roof",
            "water dripping from eaves",
            "soft footsteps on stone",
            "clinking of kitchenware"
          ],
          "smells": [
            "soap and damp linen",
            "cooking stew aromas",
            "wet earth and coal dust",
            "faint woodsmoke"
          ],
          "mood": "busy but subdued"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on plain walls",
            "shadows beneath furniture",
            "dim glow from oil lamps",
            "laundry folded neatly"
          ],
          "sounds": [
            "murmured conversations",
            "clatter of utensils",
            "clock ticking steadily",
            "footsteps on wooden stairs"
          ],
          "smells": [
            "soap and starch",
            "cooking aromas",
            "coal and woodsmoke",
            "damp cotton"
          ],
          "mood": "routine and order"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "flickering oil lamp light",
            "long shadows on walls",
            "moonlight on stone floor",
            "neatly arranged utensils"
          ],
          "sounds": [
            "quiet footsteps",
            "low voices in corners",
            "fire crackling softly",
            "water dripping slowly"
          ],
          "smells": [
            "burning oil lamp",
            "cooked stew remnants",
            "coal dust and dampness",
            "fresh laundry scent"
          ],
          "mood": "tired vigilance"
        }
      ],
      "paragraphs": [
        "The servants’ quarters form a stark contrast to the manor’s polished family wing, reflecting the practical demands and social constraints of domestic service. Narrow corridors lead between modest rooms furnished simply with wooden beds and coarse linens. Pale walls, scrubbed floors, and the occasional oil lamp create a dim, functional environment where comfort is secondary to duty. Small windows offer limited views onto the service yard and kitchen gardens, where staff move with quiet efficiency.",
        "The air is filled with the mingled scents of soap and damp cotton, cooking stews, and the faint trace of coal dust. The sounds of clattering kitchenware and whispered conversations punctuate the otherwise subdued atmosphere. Access to these quarters is strictly controlled, with staff movements closely monitored to maintain order and uphold the rigid social hierarchy that defines life within Wychwood Manor."
      ]
    },
    {
      "id": "formal_gardens",
      "name": "The Formal Gardens",
      "type": "exterior",
      "purpose": "Outdoor gathering space and route between manor and estate grounds",
      "visualDetails": "Symmetrical parterres bordered by clipped box hedges, gravel paths winding between ancient yew trees and stone statues weathered by time. Stone benches and wrought iron garden furniture sit beneath wrought iron pergolas draped with early autumn vines. The gardens are enclosed by high stone walls, with views beyond to dense woodland and rolling hills.",
      "sensoryDetails": {
        "sights": [
          "glossy wet box hedges",
          "moss-covered stone statues",
          "glimmering gravel paths",
          "droplets on autumn leaves",
          "weathered wrought iron benches",
          "faded climbing vines"
        ],
        "sounds": [
          "drip of rain from leaves",
          "soft crunch of gravel underfoot",
          "distant caw of rooks",
          "rustle of dry leaves",
          "whisper of autumn breeze",
          "muffled footsteps on stone"
        ],
        "smells": [
          "wet earth and moss",
          "faint scent of damp leaves",
          "cold stone and lichen",
          "decaying autumn foliage",
          "subtle floral hints",
          "fresh rain on grass"
        ],
        "tactile": [
          "rough stone bench surfaces",
          "damp gravel crunching",
          "slick wet leaves",
          "cold wrought iron railings",
          "soft moss under fingertips",
          "chill autumn breeze"
        ]
      },
      "accessControl": "Open to family and guests during daylight hours; estate staff maintain grounds early morning and late evening; access restricted after dusk due to estate security and fog risk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-slicked hedges",
            "glossy leaves dripping",
            "grey sky through bare branches",
            "pools of water on gravel"
          ],
          "sounds": [
            "steady rain on foliage",
            "dripping water from branches",
            "soft splash of puddles",
            "distant bird calls"
          ],
          "smells": [
            "wet earth and moss",
            "fresh rain scent",
            "damp leaves",
            "cool autumn air"
          ],
          "mood": "melancholic serenity"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on stone surfaces",
            "shadowless garden paths",
            "muted autumn colours",
            "still leaves on branches"
          ],
          "sounds": [
            "muffled footsteps on gravel",
            "rustle of dry leaves",
            "distant crow calls",
            "soft wind through trees"
          ],
          "smells": [
            "damp foliage",
            "cold stone",
            "earth and moss",
            "faint floral undertones"
          ],
          "mood": "quiet contemplation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "long shadows on gravel",
            "moonlight on wet leaves",
            "glint of dew on statues",
            "silhouetted tree branches"
          ],
          "sounds": [
            "soft rustle of breeze",
            "distant hoot of owl",
            "crunch of footsteps",
            "quiet drip of dew"
          ],
          "smells": [
            "cool night air",
            "wet earth",
            "damp stone",
            "faint floral scents"
          ],
          "mood": "haunting stillness"
        }
      ],
      "paragraphs": [
        "The formal gardens at Wychwood Manor offer a carefully maintained outdoor retreat, their symmetrical parterres and clipped box hedges reflecting the estate’s order and tradition. Gravel paths meander between ancient yews and moss-covered stone statues, their surfaces worn smooth by decades of rain and wind. Wrought iron benches and pergolas, draped with fading autumn vines, provide quiet resting places beneath the grey skies typical of the season.",
        "The gardens are enclosed by high stone walls that shelter the grounds from the surrounding dense woodland, creating a sense of secluded tranquility. The air is thick with the scent of wet earth and decaying foliage, while the soft sounds of dripping rain and rustling leaves mingle with distant bird calls. This space, open during daylight, serves as a vital route and meeting place within the estate, its serene appearance belying the tension that lurks beneath the surface."
      ]
    }
  ],
  "note": "",
  "cost": 0.007315005,
  "durationMs": 62435
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1935,
    "month": "February",
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "damp, chill air with pervasive overcast skies",
      "frequent light drizzle and mist enveloping the countryside",
      "muddy grounds and frost patches during early mornings"
    ],
    "daylight": "short winter days with daylight from about 8:15 AM to 5:15 PM, dusk falling swiftly by mid-afternoon",
    "time_of_day_of_crime": "late evening — after ten o'clock, when the manor is dimly lit by gas lamps and fireplaces, and the household is settling down for the night",
    "holidays": [
      "St. Valentine's Day (February 14th)"
    ],
    "seasonalActivities": [
      "engaging in indoor card and parlour games by the fire",
      "attending or hosting formal dinner parties to break winter monotony",
      "walking the estate grounds in damp weather with heavy coats and waterproof boots"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits in charcoal or navy with wide lapels",
        "silk cravats or narrow ties with subtle patterns",
        "stiff detachable collars paired with polished oxford shoes"
      ],
      "casual": [
        "tweed sports jackets with patch pockets and elbow patches",
        "knitted wool vests layered under overcoats",
        "plus-fours or knickerbockers worn with heavy wool socks"
      ],
      "accessories": [
        "fedoras or homburg hats in felt",
        "leather gloves lined with cashmere",
        "pocket watches with chain attached to waistcoat buttonholes"
      ]
    },
    "womensWear": {
      "formal": [
        "bias-cut silk evening gowns with modest necklines and long sleeves",
        "fur-trimmed evening coats and stoles",
        "lace gloves and cloche hats adorned with subtle feathers"
      ],
      "casual": [
        "wool jersey day dresses with pleated skirts and simple belts",
        "knitted twinsets paired with mid-calf skirts",
        "heavy wool stockings and sturdy leather shoes suitable for damp conditions"
      ],
      "accessories": [
        "small leather handbags with metal clasps",
        "brooches featuring Art Deco geometric designs",
        "silk scarves tied under the chin or around the neck"
      ]
    },
    "trendsOfTheMoment": [
      "return to more conservative and practical styles after early 1930s flamboyance",
      "art deco influences in accessories and jewelry",
      "increased use of rayon fabric as affordable silk alternative"
    ],
    "socialExpectations": [
      "men expected to maintain a polished and authoritative appearance especially in formal settings",
      "women to embody understated elegance with modesty and refinement",
      "strict dress codes observed in country houses distinguishing family, guests, and staff attire"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "British government under Ramsay MacDonald navigating economic challenges amid the Great Depression",
      "ongoing Abyssinian Crisis as Italy prepares to invade Ethiopia, stirring international tensions",
      "1935 Budget debates focus on unemployment relief and rearmament funding"
    ],
    "politicalClimate": "a tense atmosphere with rising concerns over fascism in Europe and cautious rearmament efforts in Britain, balanced against domestic economic austerity measures",
    "economicConditions": "persistent unemployment with pockets of poverty despite slow signs of recovery; landed estates facing financial strain and pressure to modernize",
    "socialIssues": [
      "class disparities sharply felt in rural communities",
      "women gradually entering more professional roles but still constrained by social norms",
      "debates over social welfare expansion amidst limited government budgets"
    ],
    "internationalNews": [
      "League of Nations criticized for ineffectiveness amid growing threats of war",
      "news of Hitler consolidating power in Germany and rearming in violation of Treaty of Versailles"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby’s crooning hits gaining popularity in Britain",
        "Duke Ellington jazz records imported and appreciated by upper-class youth",
        "British dance bands like Jack Hylton Orchestra dominating dance halls"
      ],
      "films": [
        "The 39 Steps (Alfred Hitchcock, 1935) thrilling audiences with suspense",
        "Mutiny on the Bounty (1935) epic adventure captivating cinema-goers",
        "Top Hat (1935) starring Fred Astaire and Ginger Rogers bringing glamour and dance"
      ],
      "theater": [
        "Noël Coward’s light comedies remain popular in London’s West End",
        "revivals of Shakespearean plays in regional theaters",
        "music hall performances providing variety entertainment"
      ],
      "radio": [
        "BBC’s 'In Town Tonight' engaging listeners with celebrity interviews",
        "News bulletins increasingly relied upon for up-to-date world events",
        "radio serials like 'Dick Barton' attracting family audiences"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s 'Murder on the Orient Express' (1934) still widely read",
        "T.E. Lawrence’s posthumously published 'Seven Pillars of Wisdom' attracting interest",
        "George Orwell’s early essays beginning to appear in literary magazines"
      ],
      "popularGenres": [
        "detective and mystery fiction flourishing",
        "modernist novels exploring social change",
        "historical fiction with romanticized English settings"
      ]
    },
    "technology": {
      "recentInventions": [
        "improvements in portable battery-powered radios making news accessible in rural homes",
        "advances in fingerprint analysis techniques used by police",
        "development of more reliable automatic washing machines for affluent households"
      ],
      "commonDevices": [
        "rotary dial telephones with party lines",
        "mechanical typewriters for correspondence and office work",
        "battery-powered portable radios for entertainment and news"
      ],
      "emergingTrends": [
        "increased electrification of country houses",
        "growing interest in motorcars though still limited in rural estates",
        "early experiments with television broadcasts in experimental stages"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: 4 pence",
        "pint of milk: 1 penny",
        "daily newspaper: 1 penny"
      ],
      "commonActivities": [
        "afternoon tea in the drawing room",
        "staff tending to fires and cleaning due to damp conditions",
        "reading by lamplight or listening to radio programs in the evening"
      ],
      "socialRituals": [
        "formal morning prayers or grace before meals",
        "strict household hierarchy observed between gentry and servants"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "landed gentry maintain social distance and authority over estate staff",
      "growing unease about traditional class roles due to economic pressures"
    ],
    "gender": [
      "women expected to uphold decorum and domestic oversight despite emerging calls for independence",
      "men bear responsibility for financial provision and public representation",
      "subtle shifts beginning as some women pursue employment beyond domestic service"
    ],
    "race": [
      "prevailing British attitudes retain imperialist perspectives with limited awareness of multiculturalism",
      "minority communities largely marginalized and rarely represented in upper-class settings"
    ],
    "generalNorms": [
      "strict adherence to etiquette and propriety in public and private interactions",
      "privacy and discretion highly valued within country house society",
      "conservative moral codes govern behavior, especially among the upper classes"
    ]
  },
  "atmosphericDetails": [
    "the persistent drizzle blurs the edges of the manicured lawns and leafless trees, lending a muted palette to the estate",
    "the scent of damp earth and burning coal from kitchen fires mingles with the faint aroma of polished wood and leather-bound books inside the manor",
    "the muffled ticking of an ornate grandfather clock echoes through the high-ceilinged hallways, underscoring the slow passage of a tense winter evening"
  ],
  "paragraphs": [
    "February 1935 in the English countryside is marked by a bleak, damp winter that seeps into the bones of the manor house and its grounds. Overcast skies drape the estate in a grey light, with intermittent drizzle softening the outlines of hedgerows and the skeletal branches of winter-bare trees. Daylight is short, fading by mid-afternoon, leaving the household to rely on flickering gas lamps and crackling fires to illuminate the drawing rooms and corridors. The chill in the air heightens the sense of unease, echoing the larger tensions brewing across Europe as political unrest and economic hardship weigh heavily on the collective consciousness.",
    "Fashion in February 1935 reflects a cautious return to practicality tempered by refined elegance. Men wear heavy wool suits and sturdy overcoats, topped with felt hats and leather gloves, their attire signaling both social status and the need for warmth against the damp chill. Women favor bias-cut gowns for formal occasions, often adorned with fur trims, while their daywear consists of wool jersey dresses and knitted twinsets, combining comfort with style appropriate to the country house setting. Accessories such as Art Deco brooches and silk scarves add subtle sophistication, underscoring social expectations that emphasize decorum and understated luxury.",
    "Daily life at the manor is governed by strict routines and a clear social hierarchy. The family and guests gather indoors for formal dinners and evening entertainments—listening to the BBC radio's latest news and musical broadcasts or playing parlour games by firelight. Meanwhile, the staff move quietly through their duties, mindful of the rigid distinctions that define their roles. Typical prices for everyday goods underline the economic realities of the Great Depression, with even wealthy estates feeling the pressure to economize. Social attitudes remain conservative, with class and gender roles firmly entrenched, yet subtle shifts hint at the undercurrents of change in this interwar period."
  ],
  "note": "",
  "cost": 0.00337646,
  "durationMs": 32522
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amidst the financial strains of the Great Depression, the landed gentry and their staff are confined within an isolated English manor where rigid social hierarchies and formal routines heighten tensions and suspicion after a mechanical clock-tampering murder disrupts their fragile order.",
  "era": {
    "decade": "1930s",
    "socialStructure": "A strict class divide separates the landed gentry from their servants, with formal daily routines enforcing social hierarchy; economic hardship and political unrest intensify pressures on both classes, fostering mistrust and constrained interactions."
  },
  "setting": {
    "location": "Isolated English countryside manor estate",
    "institution": "Country house estate (manor house)",
    "weather": "Damp, overcast skies with intermittent drizzle typical of English autumn"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "A classic Golden Age mystery exploring how social constraints and mechanical ingenuity collide within a tense, insular country house setting, emphasizing fair-play clue revelation and the unraveling of a clock-tampering murder."
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
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "Dust on the grand clock's pendulum bob shows reversed wear marks inconsistent with the normal forward swing pattern.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "The pendulum swing direction was reversed, indicating tampering with the clock mechanism.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The pendulum swing direction was reversed, indicating the clock mechanism was tampered with to run backward.",
      "sourceInCML": "CASE.constraint_space.time.contradictions[0]",
      "pointsTo": "Overturns the assumption that the clock ran normally; it was manipulated to run in reverse.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "A clockmaker's manual found open near the clock tower details the effects of reversing pendulum swing direction on timekeeping.",
      "sourceInCML": "CASE.constraint_space.access.objects[2]",
      "pointsTo": "The manual explains the principle behind the reversed pendulum swing tampering.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The presence and position of the clockmaker's manual imply premeditated use of the reversed pendulum principle to manipulate the clock.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "Premeditation in tampering with the clock using the reversed pendulum principle.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "The winding key found in the servants’ quarters has fresh oil residue matching the clock’s interior, indicating recent use.",
      "sourceInCML": "CASE.constraint_space.physical.traces[1]",
      "pointsTo": "Someone recently used the winding key to manipulate the clock, contradicting official maintenance timing.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "Someone recently used the winding key to manipulate the clock, contradicting official maintenance timing.",
      "sourceInCML": "CASE.constraint_space.time.contradictions[1]",
      "pointsTo": "Confirms unauthorized recent manipulation of the clock mechanism.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "Gardener's testimony places Captain Ivor Hale near the clock tower around quarter past three, the time shown on the grand clock.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "Captain Ivor Hale had opportunity to access and manipulate the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "Captain Hale had opportunity to access and manipulate the clock, exploiting the false clock time for his alibi.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "Captain Ivor Hale's opportunity to tamper with the clock and create a false timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The culprit reversed the pendulum’s swing direction and wound the manor's grand clock backward by precisely forty minutes, a physical manipulation visible in the pendulum bob dust and winding key residue.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Core mechanism detail of the clock tampering before the discriminating test.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "temporal",
      "description": "A controlled demonstration comparing the pendulum bob’s dust wear and the clock’s mechanical reaction confirms the reversed swing effect.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Physical evidence confirming the reversed pendulum swing mechanism.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "temporal",
      "description": "Captain Ivor Hale is uniquely linked to the reversed pendulum’s tampering by traces of dust on his clothing matching the pendulum bob.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[1]",
      "pointsTo": "Direct physical evidence pointing to Captain Ivor Hale as the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_13",
      "category": "behavioral",
      "description": "Captain Ivor Hale’s financial records reveal payments from the victim in exchange for silence, indicating motive and premeditation.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "Visible evidence of Captain Ivor Hale’s motive and planning before confrontation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_14",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because her medical alibi, corroborated by hospital records, places her away from the manor during the murder timeframe.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Dr. Mallory Finch's alibi excludes her as the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_15",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because servants’ schedule records confirm she was occupied in the kitchen at the time of the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Beatrice Quill's alibi excludes her as the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The pendulum swing direction was reversed, indicating the clock mechanism was tampered with to run backward, overturning the false assumption that the clock time was accurate.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Explicitly overturns the false assumption about the clock's accuracy with concrete evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because her hospital alibi during the murder timeframe is corroborated by medical staff, narrowing suspicion toward Captain Ivor Hale.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[1]",
      "pointsTo": "Excludes Dr. Mallory Finch and focuses suspicion on Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
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
      "description": "Victim's body estimated time of death between quarter past three and half past three in the afternoon remains a late texture detail in the case background.",
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
      "description": "The manor’s grand displays face is pristine and shows the exact time of quarter past three when the body was discovered.",
      "supportsAssumption": "The manor’s grand clock displays the accurate time of the victim’s death and thus can be trusted to establish the murder timeline.",
      "misdirection": "This observation supports trusting the displays face time without revealing the grand manors tampering accurate."
    },
    {
      "id": "rh_2",
      "description": "Multiple servants attest that the grand establish was regularly maintained and wound on schedule, supporting its reliability.",
      "supportsAssumption": "The manor’s grand clock displays the accurate time of the victim’s death and thus can be trusted to establish the murder timeline.",
      "misdirection": "Servants’ statements about scheduled timeline mislead by ignoring the fresh oil residue and trusted victims evidence."
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
      "clue_11",
      "clue_12",
      "clue_13",
      "clue_14",
      "clue_15",
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain",
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
  "latencyMs": 30735,
  "cost": 0.004824135
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
