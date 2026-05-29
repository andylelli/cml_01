# Actual Prompt Record

- Run ID: `run_668d76eb-84ec-44e1-92c8-983847bfe020`
- Project ID: `proj_1b04b300-22bb-4793-9b2c-a2c7829205da`
- Timestamp: `2026-05-29T17:17:18.273Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `3e3ceb2d2721d9aa`

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
    "title": "The Autumn Clock Conspiracy",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "Use period-appropriate technology including manually wound clocks, telegrams, and early telephones.",
        "Employ forensic techniques available in the 1930s such as fingerprinting and basic toxicology.",
        "Incorporate social and class hierarchies typical of English country estates during the Great Depression.",
        "Ensure all physics and mechanical principles align with 1930s knowledge, including clock mechanics and sundial geometry."
      ]
    },
    "setting": {
      "location": "English countryside",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "Country house estate (Manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "manor house time-falsification murder"
    }
  },
  "cast": [
    {
      "name": "Inspector Lionel Hargrave",
      "age_range": "50-60",
      "role_archetype": "Detective",
      "relationships": [
        "Official investigator summoned by the Ashcombe family"
      ],
      "public_persona": "Methodical and respected police inspector",
      "private_secret": "Has a personal appreciation for mechanical puzzles",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Official investigation access"
      ],
      "behavioral_tells": [
        "Meticulous note-taking",
        "Persistent questioning"
      ],
      "stakes": "Resolve the murder and restore order",
      "evidence_sensitivity": [
        "Clock mechanics",
        "Witness testimonies"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Evelyn Ashcombe",
      "age_range": "30-40",
      "role_archetype": "Heiress",
      "relationships": [
        "Daughter of the Ashcombe family, hosts the manor",
        "Close but tense relationship with victim Charles Wentworth"
      ],
      "public_persona": "Elegant and composed lady of the house",
      "private_secret": "Secretly resents victim for business interference",
      "motive_seed": "Financial control and family honor at risk",
      "motive_strength": "moderate",
      "alibi_window": "Between nine and eleven o'clock in the drawing room",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Home access",
        "Private conversations with victim"
      ],
      "behavioral_tells": [
        "Calm demeanor",
        "Occasional evasiveness when questioned about timing"
      ],
      "stakes": "Protect family reputation and estate",
      "evidence_sensitivity": [
        "Alibi integrity",
        "Access to victim"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Charles Wentworth",
      "age_range": "55-65",
      "role_archetype": "victim",
      "relationships": [
        "Business partner with Evelyn Ashcombe's family",
        "Known for strict and sometimes abrasive personality"
      ],
      "public_persona": "Respected yet feared manor guest",
      "private_secret": "Had enemies due to business deals",
      "motive_seed": "N/A (victim)",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Victim, not suspect"
      ],
      "behavioral_tells": [
        "No known behavioral tells (deceased)"
      ],
      "stakes": "N/A",
      "evidence_sensitivity": [
        "Time of death",
        "Last known movements"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Margaret Blythe",
      "age_range": "40-50",
      "role_archetype": "Housekeeper",
      "relationships": [
        "Oversees the manor's domestic staff",
        "Respects Evelyn but is wary of outsiders"
      ],
      "public_persona": "Stern but fair caretaker",
      "private_secret": "Knows about the clock's internal workings due to past repair involvement",
      "motive_seed": "Loyalty to family and fear of scandal",
      "motive_strength": "low",
      "alibi_window": "Claimed in the kitchen between ten and eleven o'clock",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to manor interiors",
        "Knowledge of clock mechanisms"
      ],
      "behavioral_tells": [
        "Guarded speech",
        "Subtle hints about clock tampering"
      ],
      "stakes": "Maintain order and reputation",
      "evidence_sensitivity": [
        "Clock mechanics",
        "Staff schedules"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Henry Pritchard",
      "age_range": "45-55",
      "role_archetype": "Gardener",
      "relationships": [
        "Long-time employee of the Ashcombe estate",
        "Holds grudges over recent pay cuts"
      ],
      "public_persona": "Quiet and observant groundskeeper",
      "private_secret": "Resentful of upper-class mistreatment",
      "motive_seed": "Resentment and financial hardship",
      "motive_strength": "moderate",
      "alibi_window": "Outside near the garden gate from nine-thirty to ten-thirty",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to garden and gates",
        "Knowledge of sundial and shadows"
      ],
      "behavioral_tells": [
        "Avoids direct eye contact",
        "Frequently checks watch"
      ],
      "stakes": "Job security and personal dignity",
      "evidence_sensitivity": [
        "Shadow angles",
        "Movement timings"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Evelyn Ashcombe"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In the shadowed autumn of Little Middleton, the respected manor guest Charles Wentworth is found dead in the Ashcombe estate. The stopped manor clock points to just after eleven o'clock, suggesting the time of death. Yet, evidence of tampering with this clock and contradictory witness testimonies indicate a complex manipulation of time to mask the true moment of murder. Inspector Lionel Hargrave must untangle the manufactured timeline, deciphering mechanical clues and social schedules to expose the murderer among the inhabitants and servants of the manor."
    },
    "accepted_facts": [
      "Charles Wentworth was found dead in the manor library.",
      "The manor clock in the library stopped at a quarter past eleven.",
      "Evelyn Ashcombe claims to have been in the drawing room between nine and eleven o'clock.",
      "Margaret Blythe states she was in the kitchen between ten and eleven o'clock.",
      "Henry Pritchard was observed near the garden gate between half past nine and half past ten.",
      "Visible scratch marks found on the clock winding key inconsistent with forward winding.",
      "Witness reports the clock was last correctly wound before dinner at seven o'clock.",
      "Gardener's diary notes the sun position and shadow angles at various times that day."
    ],
    "inferred_conclusions": [
      "The clock's hands were wound backward, falsifying the time of death.",
      "The actual time of death was closer to just after eleven forty, not just after eleven.",
      "Evelyn Ashcombe's alibi overlaps suspiciously with the expected murder time when corrected for clock tampering.",
      "Margaret Blythe's kitchen alibi is corroborated by staff bell logs.",
      "Henry Pritchard's claimed presence near the garden gate is verified by shadow angle measurements."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murderer wound the manor clock backward by forty minutes to create a false timeline placing the victim’s death earlier than it actually occurred. This reverse winding is physically detectable due to mechanical resistance, spring tension, and scratch marks on the winding key. The false timeline misleads witnesses and investigators, allowing the murderer to claim an alibi during the apparent time of death while committing the crime later. Social schedules and shadow-angle-based timing further constrain suspects, exposing contradictions in their testimonies when aligned with the true time.",
      "delivery_path": [
        {
          "step": "The murderer accessed the library clock and forcibly rewound it backward by exactly forty minutes after the murder."
        },
        {
          "step": "The clock’s mainspring tension and scratch marks on the winding key provide physical proof of backward winding."
        },
        {
          "step": "Witnesses relying on the clock time give alibis covering the falsified earlier time, which conflict with physical and social timing constraints."
        },
        {
          "step": "The gardener’s diary and sundial observations mathematically contradict the false timeline, particularly for Henry Pritchard’s claimed whereabouts."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is established as just after eleven forty, eliminating suspects whose alibis only cover the falsified earlier interval. Evelyn Ashcombe’s alibi collapses under scrutiny, revealing her as the murderer who manipulated the clock to conceal the actual timing."
    }
  },
  "false_assumption": {
    "statement": "The manor clock’s stopped time accurately indicates the time of death, and all witness alibis are based on this correct clock time.",
    "type": "temporal",
    "why_it_seems_reasonable": "The stopped clock is a central, authoritative timepiece in the manor and is generally trusted by all residents and staff. Witnesses reference this clock time in their statements, reinforcing its reliability.",
    "what_it_hides": "The clock was deliberately wound backward after the murder, falsifying the time of death and allowing the murderer to fabricate an alibi based on the incorrect timeline."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Manor dinner ended at seven o'clock",
        "Clock stopped at quarter past eleven",
        "Gardener observed garden gate shadows at half past nine and half past ten"
      ],
      "windows": [
        "Evelyn Ashcombe in drawing room between nine and eleven",
        "Margaret Blythe in kitchen between ten and eleven",
        "Henry Pritchard near garden gate between nine thirty and ten thirty"
      ],
      "contradictions": [
        "Clock mainspring tension inconsistent with quarter past eleven",
        "Scratch marks on winding key incompatible with forward winding",
        "Shadow angles at garden gate contradict Henry's claimed timeline",
        "Staff bell logs contradict Margaret's presence outside kitchen",
        "Evelyn’s alibi overlaps with actual murder time when corrected for clock tampering"
      ]
    },
    "access": {
      "actors": [
        "Evelyn Ashcombe",
        "Margaret Blythe",
        "Henry Pritchard",
        "Charles Wentworth"
      ],
      "objects": [
        "Library clock",
        "Winding key",
        "Garden gate",
        "Staff bell"
      ],
      "permissions": [
        "Evelyn Ashcombe has unrestricted access to manor interiors",
        "Margaret Blythe supervises kitchen and staff areas",
        "Henry Pritchard controls garden and grounds access"
      ]
    },
    "physical": {
      "laws": [
        "Clock mainspring resists backward winding, leaving physical evidence",
        "Sunlight angle changes cause shadow displacement on garden gate over time"
      ],
      "traces": [
        "Scratch marks on clock winding key",
        "Mainspring tension measurement",
        "Dust disturbance inside clock case",
        "Shadow angles on garden gate",
        "Staff bell usage logs"
      ]
    },
    "social": {
      "trust_channels": [
        "Servants’ mutual corroboration of schedules",
        "Family reliance on manor clock for timing",
        "Gardener’s diary as trusted record of natural time indicators"
      ],
      "authority_sources": [
        "Inspector Hargrave’s investigative mandate",
        "Housekeeper Margaret Blythe’s knowledge of clock maintenance",
        "Evelyn Ashcombe’s control over household affairs"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Scratch marks on the clock winding key show wear inconsistent with normal forward winding.",
        "correction": "The clock was recently wound backward, which is mechanically difficult and leaves distinct marks.",
        "effect": "Narrows the window of the murder time to after the apparent clock time, eliminating suspects with alibis before eleven forty.",
        "required_evidence": [
          "Visible scratch marks on the clock winding key inconsistent with forward winding",
          "Clock mainspring tension unusually high for quarter past eleven",
          "Dust disturbance pattern inside the clock indicating recent tampering",
          "Witness noting that the clock was last correctly wound before dinner at seven o'clock"
        ],
        "reader_observable": true
      },
      {
        "observation": "The gardener’s diary notes the sun’s position and corresponding shadow angle at half past ten, matching the shadow cast on the garden gate.",
        "correction": "Henry Pritchard was near the garden gate at half past ten, verified by shadow geometry, contradicting any claim placing him inside the manor after this time.",
        "effect": "Eliminates Henry Pritchard as suspect for a murder time after eleven o'clock.",
        "required_evidence": [
          "Gardener's diary noting sun position and shadow angles",
          "Photograph of the garden gate showing shadow angle matching diary",
          "Witness statements confirming Henry Pritchard near garden gate between nine thirty and ten thirty"
        ],
        "reader_observable": true
      },
      {
        "observation": "Staff bell logs and kitchen duty rosters confirm Margaret Blythe was in the kitchen between ten and eleven, consistent with her claimed alibi.",
        "correction": "Margaret’s alibi is solid for the true murder time after eleven forty, removing her from suspicion.",
        "effect": "Eliminates Margaret Blythe as suspect for the murder.",
        "required_evidence": [
          "Staff bell usage times indicating kitchen staff presence",
          "Laundry logs and meal serving times consistent with Margaret’s kitchen presence",
          "Multiple servant statements corroborating Margaret’s location"
        ],
        "reader_observable": true
      },
      {
        "observation": "Evelyn Ashcombe’s claimed presence in the drawing room between nine and eleven conflicts with the corrected later murder time after eleven forty.",
        "correction": "Evelyn’s alibi only covers the falsified clock time; she had opportunity during the true murder window to commit the crime.",
        "effect": "Narrows suspicion to Evelyn Ashcombe as the primary culprit.",
        "required_evidence": [
          "Evelyn Ashcombe’s statement placing her in the drawing room between nine and eleven",
          "Clock tampering evidence shifting actual time of death to after eleven forty",
          "Absence of other suspects with opportunity after eleven forty"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled comparison is conducted between the clock’s mainspring tension and the timing of the last winding marks on the key, contrasted against a known correctly wound reference clock. This test exposes the physical impossibility of the clock showing quarter past eleven naturally and confirms backward winding. Evelyn Ashcombe’s alibi is tested against this corrected timeline, revealing her presence unsupportable during the true time of death.",
    "knowledge_revealed": "The backward winding of the clock and the falsified alibi of Evelyn Ashcombe are exposed, conclusively proving her guilt.",
    "pass_condition": "The mainspring tension and scratch marks confirm backward winding, and Evelyn fails to account for her whereabouts during the corrected murder time window.",
    "evidence_clues": [
      "clue_11",
      "clue_8",
      "clue_16"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The physical evidence on the clock winding key and mainspring tension (visible scratch marks, dust disturbance inside the clock, and witness statements about the clock’s last winding) reveal the backward winding, falsifying the clock time. Step 2: The gardener’s diary and shadow angle photograph confirm Henry Pritchard’s location, eliminating him. Step 3: Staff bell logs and servant statements verify Margaret Blythe’s kitchen alibi, clearing her. Step 4: Evelyn Ashcombe’s alibi conflicts with the corrected murder time, focusing suspicion on her. The discriminating test uses only these established evidences to confirm backward winding and expose Evelyn’s false alibi."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 4,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 4,
      "essential_clues_before_test": true,
      "early_clues_min": 2,
      "mid_clues_min": 1,
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
        "Execute the mainspring tension and winding key scratch mark comparison",
        "Contrast with a correctly wound reference clock",
        "Highlight Evelyn Ashcombe’s conflicting alibi against the corrected timeline",
        "Conclude Evelyn’s guilt based on physical and testimonial contradictions"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Margaret Blythe",
        "act_number": 3,
        "scene_number": 2,
        "clearance_method": "Staff bell logs and multiple servant testimonies confirm her kitchen presence",
        "supporting_clues": [
          "Staff bell usage times indicating kitchen staff presence",
          "Multiple servant statements corroborating Margaret’s location"
        ]
      },
      {
        "suspect_name": "Henry Pritchard",
        "act_number": 3,
        "scene_number": 3,
        "clearance_method": "Gardener’s diary and shadow angle photograph confirm garden gate presence at claimed time",
        "supporting_clues": [
          "Gardener's diary noting sun position and shadow angles",
          "Photograph of the garden gate showing shadow angle matching diary"
        ]
      },
      {
        "suspect_name": "Inspector Lionel Hargrave",
        "act_number": 3,
        "scene_number": 1,
        "clearance_method": "Official investigator with no motive or opportunity",
        "supporting_clues": []
      },
      {
        "suspect_name": "Charles Wentworth",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation using clock physical evidence and alibi contradictions to expose Evelyn Ashcombe"
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
        "clue_id": "clue_16",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_culprit_direct_evelyn_ashcombe",
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
    "name": "Inspector Lionel Hargrave",
    "summary": "A seasoned detective with a reputation for methodical justice, grappling with his own doubts amid a high-stakes manor murder.",
    "publicPersona": "Inspector Hargrave is the embodiment of old-school policing: methodical, unwavering, and respected by peers and the local aristocracy alike. His presence commands a quiet authority, and his interrogation style—rooted in patience and keen observation—often unravels the most tangled of lies. The local gentry trust him to handle delicate matters with discretion, even when political pressure mounts.",
    "privateSecret": "Beneath his composed exterior, Hargrave wrestles with a creeping uncertainty about his own instincts. The modern criminal’s guile and sophistication sometimes elude him, and he fears that his once sharp intuition is dulling with age. This self-doubt gnaws at him, threatening to undermine his confidence just when the case demands his utmost clarity.",
    "motiveSeed": "N/A - Investigator",
    "motiveStrength": "weak",
    "alibiWindow": "N/A - on duty at the manor from 8 PM until after midnight",
    "accessPlausibility": "easy",
    "stakes": "His professional reputation hangs in the balance, complicated by political pressure from the manor’s aristocracy to resolve the matter quietly and swiftly.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Hargrave speaks with deliberate precision, favoring measured phrases and a calm cadence. He often employs subtle irony and dry wit, especially when probing contradictions, and has a habit of pausing thoughtfully before delivering a pointed observation. His tone is formal yet approachable, never rushed, inviting reflection.",
    "internalConflict": "Hargrave is torn between his loyalty to the traditional methods of policing that defined his career and the necessity to adapt to a rapidly changing social and criminal landscape. The fear that his fading intuition might allow the murderer to slip through his grasp weighs heavily on him.",
    "personalStakeInCase": "This investigation is more than a professional duty; it tests Hargrave’s very competence and legacy. The manor’s elite expect discretion and success, and failure here could tarnish his decades-long career and self-worth.",
    "paragraphs": [
      "Inspector Lionel Hargrave arrived at the Ashcombe manor with the steadfast air of a man who has seen countless crimes but remains unshaken. His reputation as a methodical and respected officer preceded him, and the local gentry welcomed his presence, confident that justice would be served with due decorum. Yet beneath this veneer of calm, Hargrave felt the subtle tremors of doubt—a nagging uncertainty about whether his instincts, honed over decades, could still outmatch the cunning of modern deceit.",
      "Throughout the investigation, Hargrave maintained his old-school interrogation style, preferring patient observation over aggressive questioning. His dry wit surfaced in moments of tension, a subtle tool to unsettle suspects without alienating them. When Evelyn Ashcombe’s alibi showed cracks, or when Charles Wentworth’s solitary witness seemed dubious, Hargrave’s precise phrasing and calm demeanor chipped away at their defenses, revealing glimpses of truth.",
      "The inspector’s internal struggle was palpable. He knew the manor’s elite expected a swift resolution, and the political pressures to conclude the case quietly weighed heavily upon him. Yet, he resisted any temptation to rush, determined to uphold his principles even if it meant confronting uncomfortable truths about the family’s secrets and his own limitations.",
      "Hargrave’s speech was marked by thoughtful pauses and a formal cadence, reflecting his respect for the gravity of the situation. His dry wit was never gratuitous but wielded with surgical precision, often highlighting contradictions with a quiet irony that invited suspects to reconsider their statements. This balance of formality and subtle humor made him both intimidating and approachable.",
      "As the investigation deepened, Hargrave’s conflict between tradition and innovation intensified. The manor’s social complexities and the cunning of suspects challenged his reliance on intuition. Yet, it was precisely this tension that propelled him forward, forcing him to reconcile his fading confidence with the demands of justice.",
      "Ultimately, this case was more than a professional challenge; it was a crucible testing Hargrave’s legacy. Success would reaffirm his place among the finest detectives, while failure threatened to consign him to the shadows of obsolescence. Each step he took was shadowed by the fear that his best years might be behind him, making every clue uncovered a personal victory against doubt."
    ],
    "order": 1
  },
  {
    "name": "Evelyn Ashcombe",
    "summary": "A charming heiress with a dazzling public image, whose desperate financial secrets and ambition conceal a potentially deadly motive.",
    "publicPersona": "Evelyn Ashcombe is the quintessential socialite of the English countryside, known for her grace, charm, and the glittering charity balls she hosts. Her presence lights up drawing rooms and salons, and she moves effortlessly among the influential, always with a poised smile and impeccable manners. To the world, she is the embodiment of refinement and benevolence.",
    "privateSecret": "Beneath this polished veneer lies a woman burdened by significant debts and a precarious financial situation. Desperate to secure her inheritance, Evelyn has resorted to forging financial documents—a secret the victim had uncovered and threatened to expose, putting her social standing and future at dire risk.",
    "motiveSeed": "Stands to inherit the estate only if the victim dies before finalizing a new will that would disinherit her; the victim had discovered Evelyn's forged financial documents and threatened exposure.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed to be in the ballroom from 8:15 PM to 9:00 PM, witnessed by several guests, but with a brief unexplained absence around 8:45 PM.",
    "accessPlausibility": "possible",
    "stakes": "Her inheritance and reputation are on the line; her ambitions to cement her place among the upper class depend on maintaining control of the family wealth.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Evelyn speaks with polished elegance, often lacing her words with subtle barbs and double entendres. Her tone is measured and refined, yet her humor carries a sharp edge that surfaces in quick, biting remarks. She favors graceful phrasing and occasionally employs a coquettish inflection to disarm or distract.",
    "internalConflict": "Evelyn grapples with the gulf between her social ambitions and the moral compromises she has made. The threat of exposure forces her to confront the potential ruin of her carefully constructed identity and the price of her ruthless pursuit of status.",
    "personalStakeInCase": "The outcome of this crime directly determines Evelyn’s future; her financial survival and social standing depend on the victim’s silence, making the investigation a matter of personal survival rather than mere curiosity.",
    "paragraphs": [
      "Evelyn Ashcombe was the picture of poised charm as she moved gracefully through the mansion’s ballroom, her laughter ringing clear and inviting. To the assembled guests, she was the epitome of social grace, a woman whose refined presence and generous hosting made her the darling of the county’s elite. Yet, behind those sparkling eyes and effortless smiles, a storm brewed—one of desperation and fear.",
      "The crushing weight of debt pressed upon Evelyn’s shoulders, a secret she guarded fiercely. Her forged financial documents, a gamble to secure her inheritance, had been discovered by the victim, who threatened to shatter her social standing by exposing the truth. This threat transformed Evelyn’s charm into a shield, masking the calculated resolve beneath.",
      "Her alibi was carefully constructed, bolstered by the presence of admiring guests in the ballroom. However, the brief, unexplained absence around 8:45 PM hinted at a fracture in her otherwise impeccable facade. Evelyn’s access to the victim was plausible, and her motive compelling; the stakes could not have been higher for a woman whose ambitions hinged on consolidating family wealth.",
      "Evelyn’s speech was a study in polished elegance mixed with subtle, polite savagery. Her remarks often carried a double meaning, a sharpness concealed beneath courteous phrasing. She wielded her wit like a rapier—disarming, graceful, but capable of drawing blood when provoked. This verbal finesse was both a defense and a weapon in the tangled social web of the manor.",
      "Her internal conflict was a battle between the dazzling socialite and the desperate woman who feared ruin. The case forced Evelyn to reckon with the consequences of her ambition and the moral compromises she had made to climb the social ladder. Each revelation threatened to dismantle the carefully curated identity she had built.",
      "For Evelyn, this was no ordinary investigation—it was a crucible of survival. The crime’s resolution would determine whether she retained her place among the aristocracy or was cast into disgrace. Her personal stake was profound; the manor’s secrets and the shadows of her own making converged in a perilous dance where one misstep could mean everything."
    ],
    "order": 2
  },
  {
    "name": "Charles Wentworth",
    "summary": "The venerable patriarch whose rigid authority conceals a scandalous secret that could unravel his family’s legacy.",
    "publicPersona": "Charles Wentworth commands respect as the traditional head of the Ashcombe estate. His authoritative presence and unwavering dedication to family duty make him a pillar of the community. To outsiders, he embodies the steadfast virtues of the English landed gentry—stern, dignified, and unyielding in his commitment to legacy.",
    "privateSecret": "Behind this stern façade lies a perilous secret: a hidden second family with illegitimate heirs. The revelation of this clandestine lineage threatens to shatter the inheritance line and ignite scandal, which Charles would rather bury forever—even if it means resorting to murder.",
    "motiveSeed": "Wants to prevent victim from revealing the existence of the second family which would lead to scandal and loss of estate control; prefers murder over public disgrace.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be in his study from 8:00 PM to 9:30 PM, but the only witness is a staff member with questionable loyalty.",
    "accessPlausibility": "easy",
    "stakes": "Preserving control of the estate and protecting the family legacy from ruin are paramount, outweighing any personal scruples.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Charles speaks with measured authority, favoring concise, formal language. His tone is calm and deliberate, often employing understatement to convey disapproval or warning. He rarely indulges in humor, but when he does, it is dry and pointed, revealing a keen intellect beneath his austere demeanor.",
    "internalConflict": "Charles wrestles with the burden of his past indiscretions and the fear that his carefully maintained legacy might collapse under the weight of truth. His loyalty to family clashes with the harsh measures he considers necessary to protect them.",
    "personalStakeInCase": "This case strikes at the heart of Charles’s identity and power. The exposure of his secret family would irreparably damage his authority and the estate’s future, making the crime a matter of survival for both his name and lineage.",
    "paragraphs": [
      "Charles Wentworth carried himself with the solemn dignity befitting the patriarch of a storied estate. His presence in the manor was a constant reminder of tradition and authority, a living link to generations past. The community looked to him as a figure of stability, unwavering in his sense of duty to family and land.",
      "Yet beneath this exterior simmered a secret that threatened to undo everything he had built. A clandestine second family, hidden away from prying eyes, cast a long shadow over the inheritance line. The victim’s knowledge of this secret posed a threat so grave that Charles considered any means necessary to silence it, including murder.",
      "His alibi, anchored by a staff member of questionable loyalty, provided little comfort. The ease with which he could access the victim made his motive not only strong but chillingly plausible. For Charles, the preservation of legacy was paramount, overshadowing conscience and inviting moral compromise.",
      "His speech was marked by a restrained formality, a deliberate economy of words that conveyed authority without superfluity. When he allowed himself a wry remark, it was a quiet understatement that spoke volumes—a subtle reminder of the power he wielded beneath his austere surface.",
      "Charles’s internal conflict was profound. The weight of past transgressions bore down on him, fueling both fear and determination. The prospect of scandal threatened to unravel not just his family’s fortune but his very identity as patriarch, forcing him into a grim calculus where the end justified the means.",
      "This investigation was no mere duty; it was a battle for survival—his survival, and that of the estate he had devoted a lifetime to safeguarding. The crime at the heart of the manor was a wound that cut deeply into Charles’s soul and legacy, demanding resolution at any cost."
    ],
    "order": 3
  },
  {
    "name": "Margaret Blythe",
    "summary": "The long-serving housekeeper whose loyalty masks a simmering resentment and a desperate fear of displacement.",
    "publicPersona": "Margaret Blythe is the epitome of steadfast service, managing the Ashcombe household with quiet efficiency and unwavering discretion. Her years of dedicated work have earned her respect among staff and family alike, and she carries herself with a dignified reserve befitting her position.",
    "privateSecret": "Despite her outward loyalty, Margaret harbors deep resentment over years of mistreatment and the victim’s recent plans to replace her with younger staff. The threat of losing her livelihood and status has pushed her into a shadowed corner of desperation.",
    "motiveSeed": "Fears losing her livelihood and status within the manor; victim was about to dismiss her and she saw no legal recourse.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was supervising kitchen staff from 7:30 PM to 9:00 PM, but briefly left near the victim’s quarters around 8:40 PM.",
    "accessPlausibility": "possible",
    "stakes": "Her job security and dignity as a senior servant are at risk, making the case a matter of personal survival and pride.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Margaret speaks with a steady, no-nonsense tone, often punctuated by wry, self-deprecating remarks about her age and position. Her speech is plain but precise, occasionally slipping into dry humor that serves as both shield and solace. She tends to be succinct, with a practical rhythm that reflects years of managing household affairs.",
    "internalConflict": "Margaret struggles with her loyalty to the estate and the bitter realization that her years of service may be discarded. The fear of displacement clashes with her ingrained sense of duty and pride in her work.",
    "personalStakeInCase": "The investigation threatens Margaret’s livelihood and identity. Losing her position would mean not only financial insecurity but also the loss of a role that has defined her life, making the case deeply personal.",
    "paragraphs": [
      "Margaret Blythe had been the unseen backbone of the Ashcombe estate for decades, her steady hand guiding the household through countless seasons. Her loyalty was unquestioned, and her discretion legendary. She carried herself with a quiet dignity that commanded respect, even from those above her station.",
      "Yet beneath this composed exterior lay a simmering resentment. Years of hard work had not shielded her from mistreatment, and the victim’s recent decision to replace her with younger staff struck at the core of her identity. The threat of dismissal was not just a professional blow but a profound personal loss.",
      "On the night of the murder, Margaret’s alibi was solid for the most part, supervising the kitchen staff. However, a brief absence near the victim’s quarters around 8:40 PM raised questions. Her access was plausible, and her motive—rooted in fear and desperation—was moderate but credible.",
      "Margaret’s speech bore the marks of her pragmatic nature. She spoke plainly, with a rhythm honed by years of household management. Her humor was self-deprecating, often making light of her advancing years or her tendency to be overlooked, a subtle defense against the harsh realities she faced.",
      "Her internal conflict was a painful tug-of-war between loyalty and survival. The estate was more than a workplace; it was a community and a source of pride. The possibility of losing her place there threatened to unravel her sense of self, forcing her to weigh duty against self-preservation.",
      "For Margaret, this case was not merely about uncovering a murderer but about fighting for her place in a world that seemed ready to cast her aside. The stakes were deeply personal, and every revelation was a reminder of what was at risk."
    ],
    "order": 4
  },
  {
    "name": "Henry Pritchard",
    "summary": "The estranged nephew and ambitious businessman whose covert plans threaten the old order, placing him under deadly suspicion.",
    "publicPersona": "Henry Pritchard is a confident, outspoken entrepreneur, proud of his industrial achievements and new money status. Often derided by his aristocratic relatives, he embraces his outsider role with a brash charm and unapologetic ambition. His presence at the manor is marked by a boldness that unsettles traditional sensibilities.",
    "privateSecret": "Behind his confident exterior, Henry has been secretly negotiating to buy out family holdings, aiming to dismantle the old aristocratic control and reshape the estate’s future. His covert land deals threaten the stability cherished by the family and the victim was poised to expose him.",
    "motiveSeed": "Stands to inherit nothing if victim’s new will stands; victim had uncovered Henry’s covert land deals threatening the estate’s stability and was prepared to expose him.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be at a local pub from 8:00 PM to 9:30 PM, but no witnesses recall seeing him during a critical 15-minute window.",
    "accessPlausibility": "possible",
    "stakes": "Henry’s desire to break into the upper class and secure financial dominance drives his ambition, making the investigation a pivotal moment in his quest for power.",
    "humourStyle": "blunt",
    "humourLevel": 0.5,
    "speechMannerisms": "Henry speaks with directness and a certain brusqueness, favoring straightforward, unvarnished language that sometimes borders on rudeness. He rarely minces words and often uses sharp, blunt humor to challenge social pretensions. His speech is fast-paced, reflecting his restless energy and impatience.",
    "internalConflict": "Henry wrestles with the tension between his ambition and the estrangement from his family. His desire to prove himself clashes with the resentment he feels for their snobbery and rejection.",
    "personalStakeInCase": "The case strikes at Henry’s very future—his plans to gain financial control and social acceptance hinge on the victim’s silence and the outcome of the investigation.",
    "paragraphs": [
      "Henry Pritchard strode into the Ashcombe manor with the confidence of a man accustomed to shaking up old orders. His reputation as a brash industrialist and new money outsider preceded him, often earning scorn from the aristocratic family he was related to but never fully accepted by. Yet Henry wore this disdain as a badge of honor, unafraid to challenge tradition.",
      "Beneath his bold exterior, Henry harbored secret ambitions that threatened the estate’s stability. His covert negotiations to acquire family lands and wrest control from the old guard were a ticking time bomb. The victim’s discovery of these plans and intent to expose them placed Henry firmly in the crosshairs of suspicion.",
      "His alibi for the night was the local pub, a claim weakened by the absence of witnesses during a critical fifteen-minute window. His access to the manor was not straightforward, but possible, especially given his familiarity with the estate. The moderate strength of his motive reflected both his ambition and the real threat the victim posed to his plans.",
      "Henry’s speech was characterized by bluntness and a brisk pace. He spoke plainly, eschewing the elaborate politeness of the manor’s inhabitants. His humor was sharp and unfiltered, often used to puncture social pretensions and assert his outsider status. This directness could alienate or disarm, depending on his audience.",
      "Internally, Henry was torn between his yearning for acceptance and the bitterness of family estrangement. His drive to succeed was fueled as much by a desire to prove himself as by genuine ambition. This tension colored his interactions and decisions throughout the investigation.",
      "The case was more than a mere legal matter for Henry; it was a crossroads that could either open the door to his full integration into the upper class or cement his status as an outcast. The stakes were high, and every revelation carried the weight of his future."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "Ashcombe Manor",
    "type": "Country house estate (Manor house)",
    "place": "Ashcombe Village",
    "country": "England",
    "summary": "A grand 1930s English manor set amidst rolling countryside, Ashcombe Manor is a bastion of aristocratic tradition and social hierarchy, surrounded by extensive gardens, stables, and service wings.",
    "visualDescription": "Ashcombe Manor rises with imposing stone façades, mullioned windows, and steep slate roofs darkened by autumn rains. The estate is divided into distinct wings: the family’s private quarters overlook manicured gardens; the guest wing features bay windows and wrought-iron balconies; the servants’ quarters lie discreetly to the north, adjacent to the stables and kitchens. Gravel drives curve through ancient oaks and lead to a gated entrance marked by wrought iron and stone pillars.",
    "atmosphere": "The manor exudes a genteel yet tense atmosphere, with hushed footsteps on polished oak floors and the faint ticking of clocks echoing through high-ceilinged hallways. Overcast skies filter muted light through stained glass, while the scent of damp earth and woodsmoke lingers in the corridors. Social protocols and rigid class distinctions underscore every interaction, reinforcing the isolation and secrecy within the estate’s walls.",
    "paragraphs": [
      "Ashcombe Manor stands several miles from Ashcombe Village and the nearest railway station, nestled in the English countryside where dense woodlands give way to neatly clipped gardens and expansive lawns. Its stone walls, weathered by decades of rain, enclose a world of strict social order: the landed gentry occupy the east wing’s ornate chambers, while guests are confined to the south wing’s more modest but elegant suites. The servants’ quarters and service areas occupy the northern wing, accessible only through a separate courtyard and discreet back entrances. This layout ensures clear separation, limiting unauthorized access and preserving the family’s privacy.",
      "The manor’s interior is a labyrinth of polished oak panels, heavy velvet drapes, and antique furnishings that absorb the quiet tension permeating the house. Domestic electric lighting casts a warm amber glow after dusk, while the occasional crackle from the manual telephone switchboard punctuates the silence. The library, lined with leather-bound volumes and illuminated by brass sconces, serves as a favored retreat but also a repository of secrets and correspondence typed on the estate’s typewriters. Throughout the house, the ticking of multiple clocks—a grand grandfather clock in the hall, smaller mantel clocks in sitting rooms—marks time with an unyielding rhythm, underscoring the narrative’s mounting suspense.",
      "Outside, the estate’s vast grounds are shrouded in autumn mist and intermittent drizzle. Gravel paths wind through rose gardens now faded and wet, while the stables echo with the soft nickering of horses sheltered from the chill. The gatehouse controls the sole vehicular access via a narrow country lane, where the occasional petrol-powered automobile arrives or departs under the watchful eye of the estate’s head porter. The isolation imposed by distance and weather complicates communication with the outside world, reliant on party-line telephones and telegrams sent from the village post office miles away.",
      "Daily routines within Ashcombe Manor are governed by strict schedules and protocols. Staff movements are tightly controlled: kitchen and housekeeping staff operate from dawn to late evening, while family members and guests observe formal mealtimes and social hours in the drawing room or conservatory. Visitors must sign in at the gatehouse and are escorted by a member of the household staff, reinforcing the estate’s insularity. This rigid order both conceals and reveals, shaping the mystery’s unfolding secrets."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast skies with intermittent rain typical of English countryside in autumn",
    "timeFlow": "Three days of mounting tension culminating in a stormy night",
    "mood": "A tense yet genteel atmosphere underscored by underlying social tensions and economic uncertainty",
    "eraMarkers": [
      "domestic electric lighting with brass fittings",
      "wired telephones with manual switchboards",
      "typewriters in family study and office",
      "radio broadcasts from the village hall",
      "petrol-powered automobiles on gravel drives",
      "party-line telephone system connecting manor to village exchange"
    ],
    "sensoryPalette": {
      "dominant": "damp earth and woodsmoke",
      "secondary": [
        "crackling coal fires",
        "old leather and beeswax polish"
      ]
    },
    "paragraphs": [
      "The persistent autumn rain softens the edges of Ashcombe Manor’s stonework, soaking into the gravel paths and saturating the surrounding gardens with a rich, loamy scent. Within the manor, the mingling aromas of beeswax polish and burning coal provide a warm counterpoint to the chilly drafts slipping beneath heavy doors. The constant ticking of clocks punctuates the otherwise still air, while muted voices and the occasional clink of fine china echo faintly in the drawing rooms. This interplay of damp chill and domestic warmth creates a setting ripe for secrets to surface amid the veneer of aristocratic calm.",
      "Outside, the estate’s isolation is accentuated by the low-hanging mist, which muffles sounds and blurs sightlines beyond the immediate grounds. The rustle of wind through bare branches and the soft patter of rain on slate roofs form a natural symphony that both soothes and unsettles. The faint rumble of a petrol car on the distant lane or the chime of a village clock tower underscores the slow passage of time, while inside, the warmth of the hearth and the faint scent of tobacco smoke invite confidences and betrayals alike."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Ashcombe Manor Woodland Clearing",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A small clearing surrounded by dense, rain-slicked oaks and brambles, with a muddy earth floor uneven from recent footsteps and wheel tracks. Fallen leaves mottle the ground in shades of ochre and rust. The area is partially obscured by low-hanging fog, limiting visibility beyond a few yards.",
      "sensoryDetails": {
        "sights": [
          "wet autumn leaves",
          "fog-draped tree trunks",
          "muddy wheel ruts",
          "scattered broken twigs",
          "grey overcast sky",
          "damp moss-covered stones"
        ],
        "sounds": [
          "distant dripping water",
          "soft crunch of leaves",
          "rustling underbrush",
          "occasional bird call",
          "muffled footsteps on mud",
          "faint wind through branches"
        ],
        "smells": [
          "damp earth and leaf mold",
          "wet moss and bark",
          "smoke from distant chimneys",
          "faint scent of woodsmoke",
          "decaying foliage",
          "cold autumn air"
        ],
        "tactile": [
          "slick mud underfoot",
          "rough bark of trees",
          "cold, damp air",
          "wet leaves brushing skin",
          "chill wind on face",
          "soft mossy ground"
        ]
      },
      "accessControl": "Accessible only by footpaths from the manor grounds; estate staff and family members restricted except during daylight hours; local police allowed during investigation phase.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-dappled leaves",
            "grey mist hovering low",
            "glossy wet bark",
            "pools of rainwater",
            "darkened soil patches",
            "dripping branches"
          ],
          "sounds": [
            "steady rain patter",
            "water dripping off leaves",
            "soft mud squelch",
            "distant thunder rumble",
            "rustling wet foliage",
            "bird calls muffled by rain"
          ],
          "smells": [
            "fresh rain on earth",
            "wet leaf decay",
            "cold damp air",
            "smoke from manor chimneys",
            "moss and bark",
            "peaty soil"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light",
            "shadows softened by fog",
            "faint outlines of trees",
            "damp leaves glistening",
            "muddy ground textures",
            "twisted bramble silhouettes"
          ],
          "sounds": [
            "occasional distant crow",
            "leaves rustling faintly",
            "soft wind sighing",
            "footsteps muffled by moss",
            "branches creaking gently",
            "quiet dripping water"
          ],
          "smells": [
            "wet earth and moss",
            "faint woodsmoke",
            "damp leaf mold",
            "musty bark",
            "cold, heavy air",
            "smoldering peat"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "long shadows through trees",
            "pale twilight sky",
            "glimmering dew on leaves",
            "silhouetted branches",
            "damp earth darkened",
            "faint stars emerging"
          ],
          "sounds": [
            "chirping crickets",
            "soft breeze whispering",
            "distant owl hoot",
            "dry leaves rustling",
            "footsteps on gravel",
            "night insects buzzing"
          ],
          "smells": [
            "cool night air",
            "damp moss and earth",
            "smoke from nearby fires",
            "faint herbal scents",
            "crisp autumn foliage",
            "wood fire embers"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The woodland clearing where the crime occurred is secluded, hemmed in by ancient oaks whose branches intertwine to form a near-impenetrable canopy. The earth is churned and muddy from recent rain and footsteps, with broken twigs and crushed leaves scattered about, betraying signs of struggle or hurried passage. Low-hanging mist clings to the undergrowth, obscuring sightlines beyond a few yards and lending an eerie stillness to the scene.",
        "Access to this clearing is strictly controlled; only family members and trusted staff may approach during daylight hours, and then only with permission. The dense foliage and uneven terrain make it difficult for outsiders to enter unnoticed, while the frequent rain and fog complicate the preservation of physical evidence. The scent of damp earth mingles with faint woodsmoke drifting from the manor’s chimneys, underscoring the estate’s isolation and the mystery simmering within its grounds."
      ]
    },
    {
      "id": "library",
      "name": "Ashcombe Manor Library",
      "type": "interior",
      "purpose": "Clue discovery and gathering space",
      "visualDetails": "A high-ceilinged room lined with dark oak bookcases filled with leather-bound volumes. A large mullioned window overlooks the gardens, filtered by heavy velvet drapes. The polished parquet floor reflects the warm glow of brass wall sconces and a crackling coal fire in the stone hearth. A heavy mahogany desk with a typewriter and scattered papers occupies a corner.",
      "sensoryDetails": {
        "sights": [
          "glossy leather book spines",
          "flickering firelight reflections",
          "brass candle sconces",
          "heavy velvet curtains",
          "ink-stained papers",
          "polished parquet floor"
        ],
        "sounds": [
          "crackling coal fire",
          "pages rustling softly",
          "typewriter keys clicking",
          "distant ticking grandfather clock",
          "muted footsteps on wood",
          "quiet rustle of curtains"
        ],
        "smells": [
          "aged leather and paper",
          "beeswax polish",
          "smoky coal fire",
          "faint pipe tobacco",
          "oak wood polish",
          "musty parchment"
        ],
        "tactile": [
          "smooth leather armrests",
          "cool brass fittings",
          "rough book spines",
          "warm hearth stones",
          "crisp paper edges",
          "velvet curtain folds"
        ]
      },
      "accessControl": "Restricted to family members and select guests; locked after dinner; household staff permitted only during daytime cleaning hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through wet windows",
            "misty garden views",
            "damp velvet curtains",
            "soft fire glow",
            "scattered ink blotches",
            "shimmering wet leaves"
          ],
          "sounds": [
            "rain tapping windowpanes",
            "fire crackling low",
            "pages turning slowly",
            "quiet footsteps approaching",
            "typewriter clacks",
            "clock ticking steadily"
          ],
          "smells": [
            "damp paper and leather",
            "smoky coal fire",
            "wet earth faintly",
            "beeswax polish",
            "tobacco smoke traces",
            "fresh rain on stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on bookshelves",
            "shadowed corners",
            "faint dust motes",
            "muted firelight",
            "yellowed pages",
            "dim wood grain"
          ],
          "sounds": [
            "soft crackle of fire",
            "pages flipping slowly",
            "distant clock chimes",
            "rustling drapes",
            "faint whisper of voices",
            "typewriter tapping"
          ],
          "smells": [
            "aged leather",
            "coal smoke",
            "beeswax",
            "dust and paper",
            "tobacco",
            "wood polish"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm firelight glow",
            "candle flicker on brass",
            "deep shadows",
            "glossy book spines",
            "reflections on polished wood",
            "soft velvet folds"
          ],
          "sounds": [
            "fire crackling brightly",
            "quiet footsteps",
            "mantel clock ticking",
            "soft page turns",
            "whispered conversations",
            "typewriter keys"
          ],
          "smells": [
            "burning coal",
            "leather bindings",
            "candle wax",
            "tobacco smoke",
            "wood polish",
            "ink and paper"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library serves as both a sanctuary and a strategic gathering place within Ashcombe Manor. Its dark oak shelves hold volumes that speak to the family’s lineage and secrets, while the heavy velvet drapes and crackling hearth provide warmth against the chill autumn air. The presence of a typewriter and scattered papers suggests recent correspondence or note-taking, making it a likely location for discovering clues or overhearing whispered confidences.",
        "Access is carefully regulated to preserve privacy and prevent contamination of evidence. The locked doors after dinner ensure the room is undisturbed overnight, while daytime cleaning by staff is supervised. The filtered light through the mullioned window casts shifting shadows, enhancing the room’s atmosphere of quiet tension and layered secrets."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants’ Hall",
      "type": "interior",
      "purpose": "Staff gathering and informal communication",
      "visualDetails": "A modest, functional room with simple wooden tables and benches, whitewashed walls, and a large stone hearth providing heat. Rows of hooks hold aprons and uniforms. A small window overlooks the kitchen courtyard, and a manual telephone switchboard sits on a side table. The floor is worn flagstone, smoothed by years of foot traffic.",
      "sensoryDetails": {
        "sights": [
          "whitewashed plaster walls",
          "rough wooden tables",
          "hanging linen aprons",
          "flickering hearth flames",
          "manual telephone switchboard",
          "worn flagstone floor"
        ],
        "sounds": [
          "low murmur of voices",
          "clinking cutlery and cups",
          "crackling firewood",
          "telephone switch clicks",
          "footsteps on stone floor",
          "rustling fabric"
        ],
        "smells": [
          "freshly baked bread",
          "soap and starch",
          "smoky hearth fire",
          "linen and damp wool",
          "earthy kitchen herbs",
          "polished wood"
        ],
        "tactile": [
          "rough timber bench",
          "cool stone floor",
          "warm hearth bricks",
          "coarse linen cloth",
          "smooth wooden tabletop",
          "heavy iron stove"
        ]
      },
      "accessControl": "Restricted to domestic staff during designated breaks and shifts; family and guests prohibited except by invitation or urgent necessity.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "damp aprons hanging",
            "grey light through window",
            "steam rising from kettles",
            "glowing hearth embers",
            "wet boots at door",
            "shiny switchboard buttons"
          ],
          "sounds": [
            "rain tapping roof",
            "soft chatter among staff",
            "fire crackling low",
            "telephone clicks",
            "pots clinking gently",
            "footsteps on stone"
          ],
          "smells": [
            "fresh bread baking",
            "soap suds",
            "damp wool and linen",
            "smoky hearth",
            "herbal tea",
            "earthy kitchen aromas"
          ],
          "mood": "busy but subdued"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light through window",
            "steam from teapots",
            "folded linens",
            "flickering firelight",
            "worn wooden surfaces",
            "neatly arranged utensils"
          ],
          "sounds": [
            "murmured conversations",
            "fire crackling softly",
            "telephone switchboard clicks",
            "footsteps pacing",
            "rustling fabric",
            "clinking cups"
          ],
          "smells": [
            "soap and starch",
            "smoky fire",
            "fresh bread crust",
            "herbal scents",
            "damp wool",
            "polished wood"
          ],
          "mood": "quiet vigilance"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm fire glow",
            "neatly hung uniforms",
            "shimmering polished surfaces",
            "soft shadows on walls",
            "empty tables",
            "glossy switchboard keys"
          ],
          "sounds": [
            "crackling fire",
            "distant footsteps",
            "quiet breathing",
            "telephone humming",
            "rustling fabric",
            "soft clock ticking"
          ],
          "smells": [
            "smoky hearth",
            "clean linen",
            "wood polish",
            "faint cooking aromas",
            "warm tea",
            "freshly swept stone"
          ],
          "mood": "calm but watchful"
        }
      ],
      "paragraphs": [
        "The Servants’ Hall is the heart of domestic life within Ashcombe Manor’s service wing. Its simple furnishings and functional layout reflect the practical needs of the household staff, who gather here during breaks to share meals and exchange news. The large stone hearth provides a comforting warmth against the chill, while the manual telephone switchboard facilitates communication across the sprawling estate. This space is a crucible of informal intelligence and quiet camaraderie, where secrets may be overheard or shared.",
        "Access is strictly limited to staff, reinforcing the social divide that permeates the manor. The worn flagstone floor and whitewashed walls speak to years of constant use, while the hanging uniforms and aprons mark the rhythms of daily labor. The scent of fresh bread mingles with soap and woodsmoke, creating a sensory backdrop that is both homely and charged with the undercurrents of tension beneath the surface."
      ]
    },
    {
      "id": "gatehouse",
      "name": "Ashcombe Manor Gatehouse",
      "type": "transitional",
      "purpose": "Access control and visitor reception",
      "visualDetails": "A small stone building with leaded glass windows and a heavy oak door reinforced with wrought iron. The gatehouse overlooks the gravel driveway leading to the manor’s main entrance, flanked by tall stone pillars topped with weathered finials. Inside, a wooden desk cluttered with visitor logs and telegrams sits beneath a wall-mounted manual telephone switchboard. Lanterns hang outside to illuminate the entry at night.",
      "sensoryDetails": {
        "sights": [
          "weathered stone walls",
          "glossy visitor logs",
          "oak door with iron fittings",
          "flickering lantern light",
          "worn wooden desk",
          "lead glass windowpanes"
        ],
        "sounds": [
          "clinking gate chains",
          "footsteps on gravel",
          "telephone switch clicks",
          "rustling paper",
          "distant carriage wheels",
          "muted voices"
        ],
        "smells": [
          "damp stone and moss",
          "wood polish",
          "coal smoke from nearby chimneys",
          "leather-bound logbooks",
          "fresh autumn leaves",
          "wet gravel dust"
        ],
        "tactile": [
          "rough stone walls",
          "smooth oak desk surface",
          "cool iron gate chains",
          "worn leather logbook cover",
          "chilled gravel underfoot",
          "heavy wooden door"
        ]
      },
      "accessControl": "The sole vehicular and pedestrian entry point; guarded by the head porter who controls all access; visitors must sign in and be escorted beyond the gatehouse.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "wet gravel driveway",
            "grey sky reflections",
            "glowing lanterns",
            "damp moss patches",
            "darkened stonework"
          ],
          "sounds": [
            "steady rain on roof",
            "chains rattling softly",
            "footsteps splashing gravel",
            "telephone clicks",
            "distant carriage wheels",
            "rustling wet leaves"
          ],
          "smells": [
            "fresh rain on stone",
            "damp moss",
            "coal smoke",
            "wet earth",
            "wood polish",
            "autumn foliage"
          ],
          "mood": "oppressive vigilance"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on stone",
            "shadowed driveway",
            "flickering lantern glow",
            "worn logbooks",
            "dark oak desk",
            "grey sky backdrop"
          ],
          "sounds": [
            "soft rain drips",
            "footsteps crunching gravel",
            "paper rustling",
            "telephone switch clicks",
            "distant voices",
            "chains swaying gently"
          ],
          "smells": [
            "coal smoke",
            "damp stone",
            "wood polish",
            "wet leaves",
            "fresh earth",
            "leather bindings"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glowing lantern light",
            "long shadows on gravel",
            "dark oak desk",
            "shimmering logbook pages",
            "starry sky overhead",
            "polished iron gate"
          ],
          "sounds": [
            "quiet footsteps",
            "chains softly clinking",
            "telephone humming",
            "distant carriage wheels",
            "rustling leaves",
            "soft night breeze"
          ],
          "smells": [
            "cool night air",
            "wood polish",
            "coal smoke",
            "fresh earth",
            "leather",
            "autumn leaves"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The gatehouse is the manor’s sentinel, standing guard at the entrance to Ashcombe’s sprawling grounds. Its stone walls and heavy oak door evoke a sense of permanence and control, while inside, the head porter manages the flow of visitors and deliveries with a keen eye. The visitor logs and telegrams on the wooden desk record comings and goings, serving as a vital checkpoint in the unfolding mystery.",
        "Illuminated by lanterns after dark, the gatehouse is both a physical and symbolic barrier between the estate and the outside world. The sounds of rattling chains and footsteps on gravel mix with the faint hum of the manual telephone switchboard, underscoring the tension inherent in controlling access to a property steeped in secrets and social strictures."
      ]
    }
  ],
  "note": "",
  "cost": 0.0076697150000000006,
  "durationMs": 54175
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1934,
    "month": "March",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "March",
    "weather": [
      "chilly with frequent overcast skies",
      "intermittent light rain and occasional fog in the mornings",
      "muddy grounds from thawing frost and lingering winter dampness"
    ],
    "daylight": "Increasing daylight with sunset around 6:00 pm, mornings brightening earlier but often still grey and misty",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner and when the household has retired to drawing rooms or bedrooms",
    "holidays": [
      "St. David's Day (March 1, observed in Wales)",
      "Mothering Sunday (fourth Sunday in Lent, March 11 in 1934)",
      "Saint Patrick's Day (March 17)"
    ],
    "seasonalActivities": [
      "Early spring planting and preparation of vegetable gardens",
      "Afternoon tea gatherings in the manor's drawing room",
      "Hunting meetings winding down for the season, with hunts replaced by long countryside walks"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece wool suits in muted greys and browns with wide lapels",
        "double-breasted overcoats with velvet collar trim",
        "stiff detachable collars paired with striped dress shirts and silk ties"
      ],
      "casual": [
        "knitted argyle pattern sweaters layered over button-down shirts",
        "plus-fours or tweed knickerbockers for outdoor country wear",
        "flat caps or felt trilbies for walks"
      ],
      "accessories": [
        "pocket watches on silver chains",
        "leather gloves with buttoned cuffs",
        "silk scarves knotted under collar"
      ]
    },
    "womensWear": {
      "formal": [
        "bias-cut silk dresses with modest necklines and three-quarter sleeves",
        "fur stoles or collars draped over tailored wool coats",
        "cloche hats adorned with feathers or silk ribbons"
      ],
      "casual": [
        "knitted cardigans over pleated skirts",
        "wool stockings with garters",
        "leather lace-up boots suitable for countryside walks"
      ],
      "accessories": [
        "long pearl necklaces or brooches",
        "kid leather gloves",
        "small structured handbags with metal clasps"
      ]
    },
    "trendsOfTheMoment": [
      "shift from flapper styles to more mature, streamlined silhouettes",
      "use of rich textures such as velvet, silk, and fine wool",
      "increased popularity of country sportswear reflecting outdoor leisure"
    ],
    "socialExpectations": [
      "men expected to maintain formal dress at social events despite economic strain",
      "women to exhibit modesty and decorum, with emphasis on careful grooming",
      "strict adherence to class-based dress codes, particularly for estate staff versus gentry"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The British government debates responses to ongoing Great Depression hardships, including unemployment benefits",
      "Rising political tensions in Europe with Adolf Hitler consolidating power in Germany",
      "The Special Areas Act 1934 passed to provide economic relief to depressed regions in Britain"
    ],
    "politicalClimate": "A tense but cautious atmosphere marked by efforts to balance social welfare with fears of political extremism, with the National Government holding power",
    "economicConditions": "Persistent high unemployment and agricultural depression strain rural estates, leading to reduced incomes for landed gentry and greater reliance on tenant farming",
    "socialIssues": [
      "Growing class tensions between landowners and laborers amid economic hardship",
      "Debate over women's roles in workforce versus traditional domestic expectations",
      "Concerns over rising fascism and communism influencing British politics"
    ],
    "internationalNews": [
      "Germany openly defies Treaty of Versailles restrictions, expanding its military",
      "The United States continues slow recovery efforts following the 1929 crash, with Roosevelt's New Deal policies underway"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Duke Ellington - 'Sophisticated Lady'",
        "Bing Crosby - 'Just One More Chance'",
        "Al Bowlly - 'Love Is the Sweetest Thing'"
      ],
      "films": [
        "The Thin Man (1934)",
        "It Happened One Night (1934)",
        "Manhattan Melodrama (1934)"
      ],
      "theater": [
        "Noël Coward's 'Design for Living'",
        "Agatha Christie's 'Murder on the Nile'",
        "Musical revue 'Ever Green' by Rodgers and Hart"
      ],
      "radio": [
        "BBC Home Service nightly news broadcasts",
        "The Detective Story Hour",
        "Children’s Hour featuring storytelling and music"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie's 'Murder on the Orient Express' (1934)",
        "William Faulkner's 'Light in August' (1934)",
        "Daphne du Maurier's early short stories gaining attention"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "Social realism reflecting economic hardships",
        "Romantic novels with escapist themes"
      ]
    },
    "technology": {
      "recentInventions": [
        "Improved domestic electric refrigerators becoming more common though still luxury",
        "Advances in radio receiver design increasing household access",
        "Improvements in telephone switchboards enabling better rural connectivity"
      ],
      "commonDevices": [
        "Electric lamps with frosted glass shades",
        "Manual typewriters for correspondence",
        "Wired landline telephones with rotary dials"
      ],
      "emergingTrends": [
        "Growing ownership of radios as a primary news and entertainment source",
        "Early experiments with talking pictures replacing silent films",
        "More widespread use of electric lighting reducing reliance on gas lamps"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 4 pence",
        "Pint of milk: 1.5 pence",
        "Taxi ride across town: 2 shillings"
      ],
      "commonActivities": [
        "Afternoon tea rituals with scones and finger sandwiches",
        "Sunday church attendance for social and spiritual gathering",
        "Daily correspondence by letters typed or handwritten"
      ],
      "socialRituals": [
        "Formal dinners with multiple courses and strict seating arrangements",
        "Sunday walks through estate grounds to observe spring's arrival"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Landed gentry maintain paternalistic attitudes towards estate workers with an emphasis on hierarchy",
      "Working class increasingly aware of political movements advocating for rights and improved conditions"
    ],
    "gender": [
      "Women expected to embody modesty and domesticity but some begin engaging in limited professional roles",
      "Men pressured to uphold financial responsibility and stoicism amid hardship",
      "Social etiquette enforces gender-specific behavior in public and private spheres"
    ],
    "race": [
      "Predominantly white rural English community with limited racial diversity",
      "Underlying colonial attitudes prevalent towards people in British Empire overseas"
    ],
    "generalNorms": [
      "Strict observance of formal social protocols in country houses",
      "Deference to social superiors in speech and behavior expected",
      "Privacy and discretion highly valued, particularly concerning scandal"
    ]
  },
  "atmosphericDetails": [
    "The persistent scent of damp earth and wet leaves fills the manor’s extensive gardens.",
    "Soft glow of electric lamps mingles with the crackling warmth of coal fires in drawing rooms.",
    "Muffled sounds of distant church bells and the occasional clatter of horse-drawn carriages on muddy lanes."
  ],
  "paragraphs": [
    "March 1934 in the English countryside is a time of cautious spring renewal beneath a veil of lingering winter gloom. Overcast skies and intermittent light rain saturate the manor gardens, the earth soft and muddy from thawing frost. Daylight stretches longer each day, yet the mornings remain misty, casting a silvery haze over the estate's sprawling grounds. The household settles into the rhythms of early spring—gardens are prepared for planting, and the final hunting meets have given way to leisurely walks through dew-laden hedgerows. Social occasions center on refined afternoon teas and formal dinners by lamplight, where the genteel atmosphere belies the undercurrent of anxiety stemming from economic uncertainty and shifting social orders.",
    "Fashion in March 1934 reflects a move away from the flamboyant styles of the previous decade toward a more mature elegance. Men in the manor favor three-piece wool suits with wide lapels, complemented by double-breasted overcoats trimmed with velvet, while their casual country attire includes tweed plus-fours and argyle sweaters. Women adopt bias-cut silk dresses and tailored wool coats accented with fur stoles, pairing these with cloche hats and delicate gloves that speak to both practicality and refinement. Accessories such as pearl necklaces, pocket watches, and silk scarves underscore a commitment to traditional decorum despite financial constraints. The clothing worn reinforces social hierarchies, with estate staff in simpler, serviceable attire sharply distinguished from the polished dress of the gentry.",
    "The cultural landscape is rich with the era’s popular entertainment—radio broadcasts provide nightly news and serialized dramas, while the cinema offers escapism in films like 'The Thin Man' and 'It Happened One Night.' Literary works such as Agatha Christie's latest mysteries captivate readers, feeding a national appetite for detective stories that mirror the era’s fascination with crime and order. Technological advances, including improved radios and electric lighting, permeate daily life, yet the manor remains a place where tradition and social rituals—like formal dinners and Sunday church attendance—govern behavior. Social attitudes emphasize class distinction and gender roles, with an abiding expectation of deference and discretion, even as the wider world grapples with political upheaval and economic hardship.",
    "In this manor house, the tension is palpable beneath the polished veneer. The fading authority of the landed gentry amidst the Great Depression's impact sharpens class divisions, while the household staff navigate strict hierarchical codes. The scent of damp earth, the flicker of lamplight against dark wood panels, and the muffled sounds of a distant church bell create an atmosphere both intimate and charged with unspoken conflict. As March progresses, uncertainty hangs in the air—political unrest abroad and economic strains at home contribute to an uneasy mood that sets the stage for intrigue within these stately walls."
  ],
  "note": "This temporal context is carefully constructed to reflect the precise conditions of March 1934 in rural England, integrating authentic seasonal weather, fashion, current affairs, and cultural atmosphere to root the mystery firmly in its historical moment.",
  "cost": 0.010501075000000002,
  "durationMs": 51972
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amidst the economic strains of the Great Depression, the landed gentry and their staff are confined within a socially rigid English manor where formal protocols and class divisions heighten tensions as a murder disrupts their fragile order.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Pronounced class distinctions separate the aristocratic family, their domestic staff, and the local populace, with formal hierarchies and strict protocols governing all interactions within the manor, intensified by economic hardship affecting estate finances and local employment."
  },
  "setting": {
    "location": "Large English manor house set within extensive grounds including gardens, stables, and service quarters",
    "institution": "Country house estate (Manor house)",
    "weather": "Overcast skies with intermittent rain typical of English countryside in autumn"
  },
  "castAnchors": [
    "Inspector Lionel Hargrave",
    "Evelyn Ashcombe",
    "Charles Wentworth",
    "Margaret Blythe",
    "Henry Pritchard"
  ],
  "theme": "A classic murder mystery underscored by genteel social tensions and economic uncertainty within a closed, hierarchical country estate."
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
      "description": "Scratch marks on the clock winding key show wear inconsistent with normal forward winding, indicating tampering.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The clock winding key has scratch marks that contradict normal usage, suggesting backward winding.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The clock was recently wound backward, which is mechanically difficult and leaves distinct marks on the winding mechanism.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the assumption that the clock time is accurate and supports the backward winding theory.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "The gardener’s diary notes the sun’s position and corresponding shadow angle at half past ten, matching observed shadows at the garden gate.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "The gardener’s diary provides a reliable temporal reference for half past ten based on shadow geometry.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "Henry Pritchard was near the garden gate at half past ten, verified by shadow geometry, contradicting his claimed timeline.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Henry Pritchard's claimed timeline is contradicted by shadow evidence placing him at the garden gate at half past ten.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Staff bell logs and kitchen duty rosters confirm Margaret Blythe was in the kitchen between ten and eleven.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Margaret Blythe's presence in the kitchen during the critical timeframe is corroborated by staff logs.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "Margaret’s alibi is solid for the true murder time after eleven forty, removing her from suspicion.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Margaret Blythe is eliminated as a suspect because her alibi covers the actual time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "Evelyn Ashcombe’s claimed presence in the drawing room between nine and eleven conflicts with the corroborated staff movements.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "Evelyn Ashcombe’s alibi is questionable due to conflicting witness movements.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "Evelyn’s alibi only covers the falsified clock time; she had opportunity during the true murder window when the clock was wound backward.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "Evelyn Ashcombe’s alibi fails when correcting for the clock tampering, indicating opportunity.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The murderer wound the manor clock backward by forty minutes to create a false timeline placing the victim’s death earlier than it actually occurred.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "This core mechanism detail explains the manipulation of the timeline via the manor clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock was recently wound backward, which is mechanically difficult and leaves distinct marks, overturning the assumption that the clock’s stopped time is accurate.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "This evidence explicitly contradicts the false assumption that the clock stopped time is correct.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Margaret Blythe because staff bell logs and kitchen duty rosters confirm she was in the kitchen between ten and eleven, well before the actual murder time.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Margaret Blythe’s alibi is corroborated by official staff records, excluding her from suspicion and narrowing the solution toward Evelyn Ashcombe.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_11",
      "category": "temporal",
      "description": "A controlled comparison is conducted between the clock’s mainspring tension and the timing of the last winding, revealing inconsistencies with the stopped time.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "This physical evidence supports the conclusion that the clock was manipulated and does not show the true time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "temporal",
      "description": "Evelyn Ashcombe’s unique trace is the backward winding of the manor clock, linking her directly to the murder mechanism.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "This mechanism detail points uniquely to Evelyn Ashcombe as the murderer.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_13",
      "category": "behavioral",
      "description": "Evelyn Ashcombe’s financial documents reveal control over family assets and a motive to preserve family honor, indicating premeditation.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "Visible evidence of Evelyn’s motive and planning before the confrontation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_14",
      "category": "testimonial",
      "description": "Eliminates Henry Pritchard because shadow angles at the garden gate place him there at half past ten, contradicting his claimed timeline and excluding him from the murder window.",
      "sourceInCML": "CASE.cast[4].alibi_window",
      "pointsTo": "Henry Pritchard’s alibi is corroborated by shadow geometry, excluding him from suspicion.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_15",
      "category": "testimonial",
      "description": "Eliminates Margaret Blythe and narrows the solution toward Evelyn Ashcombe because Margaret’s alibi is corroborated by staff bell logs and kitchen rosters, while Evelyn’s timeline overlaps with the true murder time after correcting for clock tampering.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This elimination explicitly excludes Margaret Blythe and highlights Evelyn Ashcombe as the prime suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_16",
      "category": "temporal",
      "description": "The clock mainspring tension measurement is inconsistent with the clock stopping at quarter past eleven, supporting the theory of tampering.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "Physical evidence that the clock’s stopped time does not reflect the true time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_evelyn_ashcombe",
      "category": "temporal",
      "description": "Direct evidence ties Evelyn Ashcombe to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Evelyn Ashcombe had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Manor dinner ended at seven o'clock remains a late texture detail in the case background.",
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
      "description": "The stopped clocks’s stopped time at quarter past accurately is consistent with the victim’s death time as per initial witness statements.",
      "supportsAssumption": "The manor clock’s stopped time accurately indicates the time of death.",
      "misdirection": "This misleads by reinforcing the false assumption that the clocks’s stopped time is accurate and dismisses the possibility of tampering."
    },
    {
      "id": "rh_2",
      "description": "Staff and witnesses all base their alibis on the based witness’s stopped time, which appears reliable and uncontested.",
      "supportsAssumption": "All witness alibis are based on the correct clock time.",
      "misdirection": "This misdirection supports the false assumption by suggesting no reason to doubt the witness’s time, ignoring the alibis winding evidence."
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
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain",
      "clue_11",
      "clue_12",
      "clue_13",
      "clue_14",
      "clue_15",
      "clue_16",
      "clue_culprit_direct_evelyn_ashcombe"
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
  "latencyMs": 43485,
  "cost": 0.005072195
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
