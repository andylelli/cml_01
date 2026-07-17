# Actual Prompt Record

- Run ID: `mystery-1784148466901`
- Project ID: ``
- Timestamp: `2026-07-15T20:52:25.073Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `8f189d855bf91233`

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
    "title": "Tide of Deceit",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "drowning"
    }
  },
  "death_method": "drowned",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Victim's friend"
      ],
      "public_persona": "Charming socialite",
      "private_secret": "Hides her past connection with the victim",
      "motive_seed": "Jealousy over a personal affair",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Beach access",
        "Hotel lobby"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Reputation at stake if secret revealed",
      "evidence_sensitivity": [
        "Witness account of her presence"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Victim's colleague"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Disagrees with the victim's medical ethics",
      "motive_seed": "Professional rivalry",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 8:45 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical office",
        "Beach area"
      ],
      "behavioral_tells": [
        "Uncharacteristically evasive"
      ],
      "stakes": "Career integrity",
      "evidence_sensitivity": [
        "Medical records"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "victim",
      "relationships": [
        "Fellow hotel guest"
      ],
      "public_persona": "Retired naval officer",
      "private_secret": "Has a hidden past related to wartime actions",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "evening",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [
        "Victim's niece"
      ],
      "public_persona": "Innocent young woman",
      "private_secret": "Desires inheritance from the victim",
      "motive_seed": "Financial security",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel room",
        "Beach area"
      ],
      "behavioral_tells": [
        "Nervous when discussing inheritance"
      ],
      "stakes": "Possible financial gain",
      "evidence_sensitivity": [
        "Will document"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Victim's acquaintance"
      ],
      "public_persona": "Sophisticated socialite",
      "private_secret": "Had a romantic interest in the victim",
      "motive_seed": "Unrequited love",
      "motive_strength": "low",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Lounge area",
        "Beach access"
      ],
      "behavioral_tells": [
        "Overly emotional when questioned"
      ],
      "stakes": "Emotional turmoil",
      "evidence_sensitivity": [
        "Witness accounts"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [
        "All suspects"
      ],
      "public_persona": "Diligent investigator",
      "private_secret": "Hides personal connection to one suspect",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "evening",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Eleanor Voss"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In the overcast gloom of a seaside hotel, Captain Ivor Hale is found drowned just as the tide turns. As the detective Hugo Vane navigates through a web of jealousy, professional rivalry, and hidden motives, he uncovers the truth that the timing of the tide and the victim's drowning are not what they seem."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The victim was drowned at low tide, but all evidence points to high tide due to manipulated clocks and tide charts.",
      "delivery_path": [
        {
          "step": "Witnesses recall seeing the victim at the beach at a time when the tide should have been high."
        },
        {
          "step": "A misaligned tide chart was found in the victim's room, suggesting a planned manipulation."
        },
        {
          "step": "The hotel clock was tampered with to appear accurate at the time of the drowning."
        }
      ]
    },
    "outcome": {
      "result": "The true timeline reveals the victim was already dead before high tide."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred during high tide, as indicated by the hotel clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The victim was last seen on the beach during what witnesses claimed was high tide.",
    "what_it_hides": "The victim was actually drowned during low tide, and the evidence was manipulated to mislead the investigation."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Witnesses heard him arguing with the victim shortly before the drowning.",
      "He was seen near the beach area around the time of the murder."
    ],
    "the_one_flaw": "Dr. Finch's alibi is confirmed by the medical office logs showing he was attending to patients during the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses claim to have seen Captain Hale near the beach at a time when he should have been elsewhere.",
      "points_at_suspect": "Eleanor Voss",
      "innocent_explanation": "She was actually in the lobby at that time, confirmed by hotel staff.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A bottle of liquor is found near the scene, suggesting the victim was intoxicated and fell into the water.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "It belonged to another guest who was known for drinking heavily.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "rationale": "All suspects were present at the hotel during the time of the murder, with no indication of outsiders."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The victim's last confirmed sighting was at the hotel lobby at 8:15 PM."
      ],
      "windows": [
        "The tide was high at 8:30 PM.",
        "The victim was reported missing at 8:45 PM."
      ],
      "contradictions": [
        "The victim's watch was found stopped at 8:10 PM."
      ]
    },
    "access": {
      "actors": [
        "All suspects had access to the beach."
      ],
      "objects": [
        "The hotel clock and tide chart."
      ],
      "permissions": [
        "All guests had access to common areas."
      ]
    },
    "physical": {
      "laws": [
        "The tide rises and falls predictably based on lunar cycles."
      ],
      "traces": [
        "Footprints leading away from the beach."
      ]
    },
    "social": {
      "trust_channels": [
        "Witnesses trusted hotel staff."
      ],
      "authority_sources": [
        "The hotel manager's timeline was accepted as fact."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The victim's watch was found stopped at 8:10 PM.",
        "correction": "This indicates the victim was already dead before high tide.",
        "effect": "Narrows the time of death to before 8:10 PM, eliminating high tide as a possibility.",
        "required_evidence": [
          "The victim's watch details",
          "Witness statements about the last sighting"
        ],
        "reader_observable": true
      },
      {
        "observation": "A misaligned tide chart was found in the victim's room.",
        "correction": "This suggests the victim was manipulated into a false timeline.",
        "effect": "Eliminates the credibility of the tide schedule as being accurate.",
        "required_evidence": [
          "The misaligned tide chart",
          "Comparison with actual tide tables"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall seeing the victim at the beach just before 8:15 PM.",
        "correction": "Their accounts are based on a misinterpretation of the tide timings.",
        "effect": "Narrows the timeline leading to the murder, suggesting premeditated deception.",
        "required_evidence": [
          "Witness accounts",
          "Hotel staff timelines"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Compare the time on the hotel clock with the tide chart during the time of death to reveal discrepancies.",
    "knowledge_revealed": "The clock was manipulated to suggest a false high tide.",
    "pass_condition": "Demonstrating that the victim was drowned at low tide, not high tide.",
    "evidence_clues": [
      "clue_11",
      "clue_4",
      "clue_mechanism_visibility_core",
      "clue_fp_contradiction_step_2"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The victim's watch stopped at 8:10 PM (early) indicates the death occurred before high tide. Step 2: The misaligned tide chart (mid) suggests manipulation of evidence. Step 3: Witnesses' accounts do not align with the timeline established by the tide charts (discriminating test) proving the death occurred at low tide."
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
        "Observe the discrepancies between the clock and tide chart",
        "Draw conclusion about the true time of death"
      ],
      "test_type": "comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verified by medical office logs",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm she was elsewhere during death",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness accounts confirm her location at the time",
        "supporting_clues": [
          "clue_id_7",
          "clue_id_8"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: evening",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of manipulated timeline"
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
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation of the victim's watch"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witnesses confirming their observations"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Discovery of the misaligned tide chart in the victim's room"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_culprit_direct_eleanor_voss",
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
    "summary": "Eleanor Voss, a socialite with a charming facade, grapples with the weight of her mounting debts and desperate ambitions.",
    "publicPersona": "Eleanor is the life of every party, her laughter echoing through the halls of the seaside hotel, always with a dazzling smile and a well-timed compliment for anyone who crosses her path. Her philanthropic efforts are praised, yet they mask a more sinister need for validation and financial security.",
    "privateSecret": "Beneath the glitzy exterior lies a woman ensnared by debt, her survival hinged on securing a wealthy marriage. The pressure to maintain her social standing is suffocating, and she often finds herself ensnared in a web of deceit, using her charm to manipulate those around her.",
    "motiveSeed": "Eleanor's desire to elevate her status through a wealthy marriage drives her actions, leading her to consider drastic measures to ensure her future.",
    "motiveStrength": "strong",
    "alibiWindow": "She claims to have spent the hour between 8 PM and 9 PM strolling along the beach, a convenient alibi that leaves room for doubt.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Eleanor are high; her reputation and financial future hang in the balance, making her a prime suspect in a crime that could unravel her carefully curated life.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a lilting, melodic tone, often punctuating her sentences with a light laugh or a dismissive wave of her hand. She has a habit of turning compliments into backhanded remarks, revealing her underlying competitiveness.",
    "signatureTic": "Oh, darling, isn't that just delightful?",
    "internalConflict": "Eleanor grapples with the fear of losing everything she has built, torn between her aspirations and the reality of her debts. The looming threat of exposure weighs heavily on her conscience.",
    "personalStakeInCase": "This crime matters to Eleanor not just as a suspect but as a potential turning point; it could either ruin her or provide a chance to reinvent herself.",
    "paragraphs": [
      "Eleanor Voss floated through the ballroom like a shimmering mirage, her laughter a siren's call to the wealthy and influential. She wore her charm like a designer gown, tailored to perfection, yet beneath the fabric of her socialite persona lay a heart heavy with secrets. The debts had piled up like discarded invitations, each one a reminder of her precarious position. She was a social climber, not by choice but by necessity, and every party was a stage where she performed her role as the benevolent philanthropist, all while plotting her next ascent.",
      "The seaside hotel was a haven for her ambitions, a place where she could mingle with the elite and, perhaps, find a wealthy suitor to rescue her from her financial prison. But Eleanor was no naive damsel; she understood the game. She had learned to wield her beauty and charm like weapons, ready to strike at a moment's notice. Her laughter masked the desperation that gnawed at her insides, and she had grown adept at manipulating the affections of those around her, often with a smile that could disarm even the most cynical of hearts.",
      "Yet, as the tide of deceit rolled in, Eleanor found herself ensnared in a web of her own making. The victim's death threatened to expose her secrets, and the very connections she relied upon for survival could turn against her. The thought of being unmasked as a fraud sent shivers down her spine. She had always been the one pulling the strings, but now, the strings were tangled, and she feared she might be the one to pay the price.",
      "As the investigation unfolded, Eleanor's desperation grew. She had to secure her future, and the stakes were higher than ever. Each whispered conversation and furtive glance became a potential threat, and she knew that to protect herself, she might have to make choices that would haunt her forever. The line between ambition and morality blurred, and Eleanor found herself at a crossroads, where the path to salvation could just as easily lead to her downfall."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected psychiatrist whose icy demeanor conceals a simmering resentment towards the victim.",
    "publicPersona": "In the realm of academia, Dr. Mallory Finch is a formidable presence, known for her rigorous intellect and unyielding professionalism. Yet, her aloofness often alienates her colleagues, leaving her reputation as a double-edged sword.",
    "privateSecret": "Beneath her polished exterior lies a woman consumed by envy, harboring resentment towards the victim who has overshadowed her own achievements in the field. Mallory is terrified that her unethical practices will be exposed, jeopardizing her career.",
    "motiveSeed": "The fear of losing her hard-won reputation drives Mallory to consider drastic measures, as she believes the victim holds the key to her downfall.",
    "motiveStrength": "compelling",
    "alibiWindow": "She claims to have been engaged in a conference call from 7 PM to 8 PM, a window that leaves little room for scrutiny.",
    "accessPlausibility": "unlikely",
    "stakes": "For Mallory, the stakes are nothing short of catastrophic; her entire career and standing in the community hang in the balance, and the thought of being exposed terrifies her.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks in clipped, precise sentences, often punctuating her points with a dry, sardonic wit. She has a tendency to raise an eyebrow when she feels misunderstood, as if evaluating the intelligence of her interlocutors.",
    "signatureTic": "If I may be so bold...",
    "internalConflict": "Mallory is torn between her ambition and the ethical implications of her practices. The fear of exposure gnaws at her, creating a moral conflict that threatens to unravel her carefully constructed life.",
    "personalStakeInCase": "This crime represents a pivotal moment for Mallory; if she can navigate the investigation without being implicated, she might secure her standing in the community, but the risk of exposure looms large.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the periphery of the gathering, observing the revelry with an air of detached superiority. While others mingled easily, she remained an island of intellect, her sharp gaze dissecting the interactions around her. To the untrained eye, she was the epitome of professionalism, but beneath the surface lay a simmering resentment that threatened to boil over. The victim, with her effortless charm and seemingly endless success, had become a thorn in Mallory's side, overshadowing her achievements in the psychiatric community.",
      "The conference call had provided her with a convenient alibi, but the truth was, she had spent the hour consumed by thoughts of revenge. Mallory's mind raced with the implications of the victim's potential exposure of her unethical practices. She had crossed lines for the sake of her career, and the fear of being unmasked as a fraud haunted her every waking moment. The stakes were impossibly high, and as she watched the other guests, she couldn't help but wonder if any of them suspected the darkness lurking within her.",
      "In her mind, she replayed every interaction with the victim, searching for clues of her downfall. Mallory had always been competitive, but the victim's death opened a chasm of opportunity. The thought of reclaiming her rightful place in the academic world was intoxicating, yet it came with a price. The very ambition that had propelled her forward now threatened to consume her entirely, and the ethical boundaries she had once held dear began to blur.",
      "As the investigation unfolded, Mallory found herself caught in a web of intrigue, where every whispered conversation and furtive glance felt like a threat. She knew she had to tread carefully, for any misstep could lead to her exposure. The balance between ambition and morality hung precariously, and as the tide of deception rolled in, Mallory understood that the path to her salvation might lead her into the depths of darkness."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer, whose stoic demeanor masks a deep-seated bitterness over his family's decline.",
    "publicPersona": "Ivor is seen as a pillar of dignity and honor, a man who values tradition above all else. His presence commands respect, and he carries the weight of his past with a stoic grace.",
    "privateSecret": "Yet, beneath this facade lies a man consumed by bitterness and regret, haunted by the decline of his family's fortune since the war. He feels that the victim has undermined his attempts to reclaim his family's prestige.",
    "motiveSeed": "The desire to restore his family's honor drives Ivor's actions, leading him to consider extreme measures against the victim.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claims to have been taking a stroll along the beach from 6 PM to 8 PM, a window that seems innocuous but could be scrutinized.",
    "accessPlausibility": "easy",
    "stakes": "For Ivor, the stakes are high; his legacy and connection to an affluent social circle are on the line, and the fear of losing everything he holds dear looms large.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks in a deep, commanding voice, often using short, clipped sentences that convey authority. He prefers to cut through pleasantries, opting instead for directness that can come across as brusque.",
    "signatureTic": "Honor is all we have left.",
    "internalConflict": "Ivor wrestles with feelings of inadequacy and the burden of expectation. The decline of his family's fortune weighs heavily on him, and he fears that he may never reclaim the honor he so desperately seeks.",
    "personalStakeInCase": "This crime represents a crucial juncture for Ivor; if he is implicated, his family's legacy could be irreparably tarnished, yet the desire for revenge drives him to the edge.",
    "paragraphs": [
      "Captain Ivor Hale stood at the edge of the beach, the salty air whipping around him as he contemplated the waves crashing against the shore. To the world, he was a retired naval officer, a man of honor who valued dignity above all else. His stoic demeanor commanded respect, yet within him raged a tempest of bitterness and regret. The war had stripped his family of its fortune, leaving him grappling with the remnants of a legacy he felt slipping through his fingers.",
      "The victim had become a symbol of everything he despised—a reminder of his family's decline and the social prestige that had eluded him for too long. Ivor's alibi of a stroll along the beach felt like a flimsy shield against suspicion, but he knew he had to maintain his composure. Each step he took was a reminder of the weight he carried, and the thought of reclaiming his family's honor drove him to consider measures he had once deemed unthinkable.",
      "As the investigation unfolded, Ivor found himself caught in a web of intrigue, where every glance and whisper could unravel the carefully constructed facade he had built over the years. The stakes were impossibly high; his legacy and connection to the affluent social circles he once ruled were at risk. The bitterness that had festered within him for so long now threatened to consume him, and the desire for revenge battled against the remnants of his honor.",
      "Ivor understood that the path to reclaiming his family's prestige was fraught with danger. Each decision he made could either restore his legacy or lead to its utter ruin. As the tide of deceit rolled in, he found himself at a crossroads, where the line between honor and vengeance blurred, leaving him to grapple with the dark choices that lay ahead."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a timid hotel maid who knows more about the guests than she lets on, including a secret romance.",
    "publicPersona": "Beatrice is the quintessential maid—timid and cooperative, she blends into the background, rarely drawing attention to herself. Her soft-spoken nature makes her seem harmless in the eyes of the guests.",
    "privateSecret": "However, Beatrice harbors secrets of her own, including knowledge of the guests' affairs and a secret romance that could implicate her in the victim's death.",
    "motiveSeed": "Though her feelings for her lover are genuine, jealousy over the victim's relationship with him could lead to misunderstandings.",
    "motiveStrength": "weak",
    "alibiWindow": "She claims to have been cleaning rooms from 5 PM to 9 PM, a window that provides her with ample opportunity to observe the guests.",
    "accessPlausibility": "easy",
    "stakes": "For Beatrice, the stakes are high; a wrongful accusation could ruin her job and reputation, and she fears the consequences of being drawn into the investigation.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks softly, often trailing off at the end of her sentences. She has a tendency to apologize frequently, even when there’s no need, and her nervous laughter reveals her discomfort in social situations.",
    "signatureTic": "I’m sorry, but...",
    "internalConflict": "Beatrice struggles with the weight of her secrets, torn between her loyalty to her lover and the fear of being implicated in a crime she did not commit.",
    "personalStakeInCase": "This crime matters deeply to Beatrice; if she is accused, her entire life could unravel, and she yearns to be seen as more than just a maid.",
    "paragraphs": [
      "Beatrice Quill moved through the hotel with the grace of a shadow, her presence barely registering on the radar of the bustling guests. The timid maid was a creature of habit, her life a series of routines that kept her safely tucked away from the prying eyes of the elite. She was the one who knew the secrets of the guests, the whispered conversations that echoed through the halls, yet her own life remained a mystery, even to herself.",
      "Soft-spoken and eager to please, Beatrice often found herself apologizing for things that required no apology at all. Her nervous laughter punctuated her interactions, a defense mechanism against the anxiety that gripped her whenever she was forced to engage with the guests. Yet, beneath the surface of her timid demeanor lay a heart filled with passion—a secret romance that brought her both joy and turmoil.",
      "The victim's relationship with her lover was a source of jealousy that Beatrice struggled to contain, yet she knew that her feelings could easily be misconstrued. The alibi of cleaning rooms from 5 PM to 9 PM offered her some protection, but as the investigation unfolded, the fear of being implicated loomed large. She often found herself questioning her worth, trapped in the role of the invisible maid, yearning to be seen as more than just a servant.",
      "As the investigation deepened, Beatrice felt the walls closing in around her. The weight of her secrets hung heavy on her shoulders, and she grappled with the fear of losing everything she held dear. The crime mattered to her not only as a potential suspect but as a defining moment in her life—a chance to step out of the shadows and claim her voice, even if it meant risking everything she had."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a charismatic artist whose rivalry with the victim fuels her ambition and jealousy.",
    "publicPersona": "With a free-spirited demeanor and avant-garde work, Sylvia is known in the art community for her vibrant personality and captivating creations. Her charisma draws others in, making her a beloved figure.",
    "privateSecret": "Beneath the surface of her charm lies a long-standing rivalry with the victim, who she believes has overshadowed her artistic endeavors and stolen her patron.",
    "motiveSeed": "Sylvia sees the victim's death as a potential opportunity to gain the favor of the patron she covets.",
    "motiveStrength": "strong",
    "alibiWindow": "She claims to have been painting in her room from 7 PM to 9 PM, a plausible alibi that could be easily checked.",
    "accessPlausibility": "possible",
    "stakes": "For Sylvia, the stakes are high; her career and artistic integrity depend on her reputation, and the fear of losing her patron drives her ambition.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Sylvia speaks with a lively cadence, often gesturing wildly as she talks. Her sentences are peppered with artistic jargon, and she has a tendency to interject humor into even the most serious of conversations.",
    "signatureTic": "It's all about the brush strokes, darling.",
    "internalConflict": "Sylvia struggles with her envy and the fear of being overshadowed. The desire to prove herself often leads her to question her worth as an artist.",
    "personalStakeInCase": "This crime matters to Sylvia as it represents a chance to reclaim her position in the art world; if she can navigate the investigation without suspicion, she might finally gain the recognition she deserves.",
    "paragraphs": [
      "Sylvia Trent was a whirlwind of color and charisma, her laughter ringing through the halls of the seaside hotel like a melody. As an artist, she captivated audiences with her avant-garde creations, yet beneath the vibrant exterior lay a simmering jealousy that threatened to consume her. The victim, with her effortless charm and magnetic presence, had long overshadowed Sylvia's artistic endeavors, leaving her feeling like a mere footnote in the story of the art world.",
      "In her mind, the hours spent painting in her room were a sanctuary, a place where she could escape the harsh realities of competition. Yet, as the investigation unfolded, the death of the victim opened a door to opportunity that Sylvia had long desired. The thought of gaining her coveted patron's favor sent a thrill through her, yet the fear of being implicated gnawed at her conscience. The stakes were high; her career depended on her reputation, and she knew that any misstep could lead to disaster.",
      "Sylvia's sardonic wit often masked her insecurities, and she found solace in humor. She spoke in lively bursts, her hands dancing through the air as she described her artistic visions. Yet, the underlying tension of rivalry simmered just beneath the surface, a reminder that her worth as an artist was constantly being questioned. The line between ambition and jealousy blurred, and she struggled to reconcile her desire for recognition with the fear of becoming what she despised.",
      "As the investigation deepened, Sylvia found herself at a crossroads, where her dreams of artistic success clashed with the reality of the crime. The weight of her rivalry with the victim hung heavily on her, and she knew that to reclaim her position in the art world, she would have to confront not only her envy but also the darkness that lay within. The tide of deceit threatened to wash away everything she had worked for, and Sylvia had to navigate the dangerous waters of ambition and morality."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a wealthy businessman whose impeccable public persona hides a world of shady dealings.",
    "publicPersona": "As a successful and influential businessman, Hugo is known for his philanthropy and support of local businesses. He is well-liked and respected in the community, often seen as a pillar of success.",
    "privateSecret": "However, Hugo's wealth is built on a foundation of shady dealings, and he fears that the victim's connections to his business could threaten his empire.",
    "motiveSeed": "The victim's potential exposure of his illicit activities drives Hugo to consider drastic actions to protect his empire.",
    "motiveStrength": "strong",
    "alibiWindow": "He claims to have been in the hotel's bar from 6 PM to 10 PM, a window that provides him ample opportunity for interaction but could also be scrutinized.",
    "accessPlausibility": "easy",
    "stakes": "For Hugo, the stakes are monumental; his reputation and wealth are on the line, and the fear of losing everything he has built drives his actions.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with a smooth, polished cadence, often peppering his dialogue with anecdotes and observations from his business dealings. He has a knack for making even the most mundane topics sound intriguing.",
    "signatureTic": "You see, it’s all about the bottom line.",
    "internalConflict": "Hugo wrestles with the duality of his life; the persona he presents to the world is at odds with the reality of his dealings. The fear of exposure creates a moral conflict that he struggles to navigate.",
    "personalStakeInCase": "This crime represents a pivotal moment for Hugo; if he can navigate the investigation without being implicated, he might preserve his empire, but the risk of exposure looms large.",
    "paragraphs": [
      "Hugo Vane held court in the hotel's bar, his polished charm drawing in guests like moths to a flame. To the world, he was the epitome of success, a businessman whose philanthropy was only rivaled by his wealth. Yet, behind the charming smile lay a labyrinth of shady dealings that could crumble at any moment. The victim's connections to his business dealings threatened to expose a world that he had carefully hidden from the public eye.",
      "As he engaged in conversation, his smooth cadence and observational wit made him a delight to listen to. Hugo had a talent for making even the most mundane topics sound fascinating, and his anecdotes flowed effortlessly. But beneath that polished exterior, a storm brewed. The alibi of spending the evening in the bar felt flimsy, and the fear of being implicated gnawed at him like a relentless tide. The stakes were monumental; his reputation and wealth were on the line, and he couldn't afford to lose everything he had built.",
      "The investigation cast a shadow over Hugo's carefully constructed life, and he found himself wrestling with the duality of his existence. The persona he presented to the world was at odds with the reality of his dealings, creating a moral conflict that left him feeling unmoored. Each conversation felt like a potential trap, and the fear of exposure loomed large, threatening to unravel the empire he had worked tirelessly to build.",
      "As the investigation unfolded, Hugo understood that he stood at a crossroads. The choices he made could either preserve his empire or lead to its utter ruin. The tide of deceit rolled in, and as he navigated the treacherous waters of suspicion, Hugo had to confront the darkness within himself and decide how far he was willing to go to protect what he held dear."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Seabreeze Hotel",
    "type": "Hotel",
    "place": "St. Ives",
    "country": "England",
    "summary": "An elegant seaside hotel with Art Deco charm, overlooking a secluded beach on the rugged Cornish coast.",
    "visualDescription": "The Seabreeze Hotel rises majestically with its whitewashed façade and geometric patterns, framed by lush greenery. The grand lobby features polished marble floors and a sweeping staircase, while large bay windows offer sweeping views of the tumultuous sea beyond.",
    "atmosphere": "A blend of elegance and tension, the hotel feels both inviting and foreboding.",
    "paragraphs": [
      "As the waves crash against the rocky shore, the Seabreeze Hotel stands as a beacon of elegance, its Art Deco architecture a stark contrast to the wild coastal landscape. Inside, the polished marble floors reflect the soft glow of vintage chandeliers, casting a warm light that belies the storm brewing outside. Guests mill about in the grand lobby, their conversations punctuated by the distant sound of thunder and the relentless rhythm of the ocean. The air is thick with anticipation, as if the hotel itself holds its breath, waiting for the next wave of events to unfold.",
      "The scent of salt and seaweed mingles with the faint aroma of fresh pastries wafting from the kitchen, creating an unsettling yet comforting atmosphere. The lobby is a hub of activity, with guests checking in and exchanging pleasantries, while staff maneuver through narrow hallways, their footsteps echoing softly against the walls. Yet, behind the facade of hospitality lies a sense of isolation; the hotel is far from the nearest town, and as the weather worsens, the feeling of being cut off from the outside world grows ever more palpable.",
      "Outside, the secluded beach stretches out like a forgotten secret, its golden sands now battered by the churning waves. The balconies overlooking this scene provide a vantage point for both guests and lurking shadows, where secrets can be exchanged or hidden from prying eyes. As night falls, the hotel transforms, the flickering candlelight casting long shadows that dance across the walls, weaving a tapestry of intrigue and uncertainty. The Seabreeze Hotel, with its captivating beauty, is a stage set for the drama of human nature, where every whispered conversation and every furtive glance may hide a darker truth."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain showers, typical for coastal regions in the fall.",
    "timeFlow": "Days of mounting tension, with each moment feeling stretched by the weight of secrets.",
    "mood": "Tense and suspenseful, heightened by the isolation and recent events.",
    "eraMarkers": [
      "Art Deco furnishings and intricate designs",
      "Ubiquitous radios playing news broadcasts",
      "Rationed wartime supplies in the dining room"
    ],
    "sensoryPalette": {
      "dominant": "Salty sea air and floral perfume",
      "secondary": [
        "Faint sound of jazz music",
        "Crisp scent of fresh pastries"
      ]
    },
    "paragraphs": [
      "As the storm clouds gather overhead, the Seabreeze Hotel exudes a peculiar charm mixed with an undercurrent of anxiety. The air is thick with the scent of salt and impending rain, while the distant crash of waves provides a haunting soundtrack to the unfolding drama. Each corner of the hotel seems to whisper secrets, the polished surfaces reflecting shadows that dance in the flickering light of gas lamps. Guests move about the lobby, their faces a mix of curiosity and apprehension, as they sense the tension mounting within these walls.",
      "With each passing hour, the atmosphere shifts, the once-inviting hotel morphing into a labyrinth of uncertainty. The sound of rain tapping against the windows becomes a metronome for anxiety, while the muted conversations of guests echo through the grand hall, punctuated by the occasional laughter that feels forced. The isolation of the hotel, perched on its cliffside with the ocean raging below, amplifies the feeling of being trapped, both physically and emotionally, as the storm outside mirrors the turmoil within."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Beachside Veranda",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A weathered wooden deck overlooking the tumultuous sea, with scattered chairs and a broken railing.",
      "sensoryDetails": {
        "sights": [
          "grey waves crashing against rocks",
          "storm clouds swirling overhead",
          "scattered chairs askew",
          "broken railing splintered and worn",
          "pale sand strewn with debris"
        ],
        "sounds": [
          "howling wind",
          "crashing waves",
          "distant thunder rumbling",
          "the creak of wood underfoot",
          "the flap of a loose awning"
        ],
        "smells": [
          "briny sea spray",
          "wet sand and algae",
          "damp wood",
          "faint scent of tobacco",
          "fresh rain"
        ],
        "tactile": [
          "cold metal of the railing",
          "smooth pebbles underfoot",
          "chill of ocean breeze",
          "rough wood of the deck",
          "wet fabric from rain-soaked clothing"
        ]
      },
      "accessControl": "Restricted to staff during storms; guests require permission to access the beach area.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked wooden deck",
            "mist rising from the ocean",
            "faint light filtering through clouds"
          ],
          "sounds": [
            "steady drumming of rain",
            "waves lapping softly",
            "seagulls calling in the distance"
          ],
          "smells": [
            "fresh rain on dry earth",
            "damp seaweed",
            "cool, crisp air"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey sea merging with sky",
            "dark rocks glistening with moisture",
            "shadows creeping over the sand"
          ],
          "sounds": [
            "wind whistling through the trees",
            "occasional crash of waves",
            "soft rustle of leaves"
          ],
          "smells": [
            "wet stone",
            "sea salt",
            "freshly cut grass"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues on waves",
            "long shadows stretching across the sand",
            "stars beginning to twinkle"
          ],
          "sounds": [
            "gentle lapping of waves",
            "chirping crickets",
            "soft laughter from the hotel"
          ],
          "smells": [
            "smoky firewood",
            "freshly baked bread",
            "cool night air"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Beachside Veranda, a weathered wooden deck jutting out over the tumultuous sea, serves as the backdrop for the latest chapter of intrigue. Scattered chairs lie askew, remnants of a recent gathering, while a broken railing hints at the chaos that unfolded. The grey waves crash against the rocks below, their relentless rhythm echoing the tension in the air. Overhead, storm clouds swirl ominously, casting a shadow over the scene, as if nature itself is holding its breath.",
        "As the wind howls, carrying the scent of brine and damp earth, the veranda transforms into a stage for secrets and revelations. The chill of the ocean breeze bites at exposed skin, while the creak of the wood underfoot adds to the unsettling atmosphere. Each gust of wind seems to whisper warnings, urging those who linger to retreat inside, away from the chaos that lies just beyond the railing. But for some, the allure of the unknown is too strong to resist, and the beachside becomes a place where danger and desire intertwine."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious area with high ceilings, Art Deco chandeliers, and plush seating arrangements.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "vintage chandeliers casting warm light",
          "ornate geometric patterns on walls",
          "guests mingling in elegant attire",
          "staff moving discreetly"
        ],
        "sounds": [
          "soft jazz music playing",
          "murmurs of conversation",
          "clinking of glassware",
          "footsteps echoing",
          "the rustle of silk dresses"
        ],
        "smells": [
          "freshly brewed coffee",
          "scent of polished wood",
          "light perfume and cologne",
          "faint tobacco smoke",
          "warm pastries"
        ],
        "tactile": [
          "cool marble underfoot",
          "soft upholstery of armchairs",
          "smoothness of polished wood",
          "gentle touch of silk curtains",
          "the warmth of a cup in hand"
        ]
      },
      "accessControl": "Open to guests and staff; restricted access to service areas behind the reception desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through rain-spattered windows",
            "guests with umbrellas"
          ],
          "sounds": [
            "pattering of rain on glass",
            "soft laughter",
            "distant thunder rumbling"
          ],
          "smells": [
            "wet earth",
            "freshly baked croissants",
            "steaming coffee"
          ],
          "mood": "cozy warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light dulling colors",
            "shadows creeping across the floor",
            "guests huddled in corners"
          ],
          "sounds": [
            "clock ticking softly",
            "muffled conversations",
            "the rustle of newspapers"
          ],
          "smells": [
            "damp wool",
            "scent of old books",
            "the tang of citrus"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "chandeliers sparkling in the twilight",
            "glasses clinking in toast",
            "guests in evening wear"
          ],
          "sounds": [
            "lively chatter",
            "soft jazz playing",
            "the pop of champagne corks"
          ],
          "smells": [
            "rich chocolate desserts",
            "freshly polished wood",
            "hint of smoke from a nearby fireplace"
          ],
          "mood": "festive anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby serves as the heart of the Seabreeze Hotel, a spacious area adorned with high ceilings and Art Deco chandeliers that cast a warm glow over the polished marble floors. Guests mingle in elegant attire, their laughter and conversations filling the air, while staff move discreetly through the crowd, ensuring every need is met. The scent of freshly brewed coffee mingles with the light perfume of guests, creating an atmosphere that is both inviting and charged with energy.",
        "As the day progresses, the lobby transforms with the weather outside. On rainy mornings, dim light filters through rain-spattered windows, casting shadows that dance across the room. The soft laughter of guests resonates like a comforting melody, while the scent of freshly baked croissants fills the air, inviting patrons to linger just a little longer. Yet, as clouds gather and shadows deepen, a sense of melancholy seeps into the atmosphere, as if the very walls of the hotel are absorbing the weight of unspoken secrets."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Ocean View Dining Room",
      "type": "interior",
      "purpose": "Dining and socializing space",
      "visualDetails": "A large dining area with panoramic windows, elegant table settings, and ocean-themed decor.",
      "sensoryDetails": {
        "sights": [
          "panoramic windows framing the stormy sea",
          "artistic ocean-themed murals",
          "soft candlelight flickering",
          "guests in formal attire"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft murmur of conversation",
          "the rustle of napkins",
          "the gentle sound of waves",
          "occasional laughter"
        ],
        "smells": [
          "roasted meats and fresh seafood",
          "scent of herbs and spices",
          "sweet aroma of desserts",
          "freshly baked bread",
          "the tang of citrus"
        ],
        "tactile": [
          "smooth surface of the table",
          "coolness of silverware",
          "softness of linen napkins",
          "warmth of freshly baked bread",
          "the weight of a glass in hand"
        ]
      },
      "accessControl": "Open to guests during meal times; staff only access to kitchen areas.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dimly lit dining room",
            "raindrops trickling down windows",
            "tables set for breakfast"
          ],
          "sounds": [
            "soft patter of rain",
            "clinking of dishes",
            "quiet conversations"
          ],
          "smells": [
            "freshly squeezed orange juice",
            "buttery croissants",
            "steaming coffee"
          ],
          "mood": "tranquil"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light filtering through clouds",
            "guests huddled over their meals",
            "the sea appearing more turbulent"
          ],
          "sounds": [
            "muffled conversations",
            "the sound of waves crashing",
            "the clink of glasses"
          ],
          "smells": [
            "scent of grilled fish",
            "faint hint of salt from the sea",
            "fresh herbs"
          ],
          "mood": "somber"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelit tables casting flickering shadows",
            "the sun setting over the ocean",
            "guests enjoying their meals"
          ],
          "sounds": [
            "lively chatter",
            "the clinking of wine glasses",
            "the distant sound of waves"
          ],
          "smells": [
            "aroma of rich sauces",
            "sweet scent of desserts",
            "freshly baked bread"
          ],
          "mood": "celebratory"
        }
      ],
      "paragraphs": [
        "The Ocean View Dining Room is a culinary haven, where panoramic windows provide breathtaking views of the stormy sea beyond. Elegant tables are set with fine china and flickering candles, creating an intimate atmosphere for guests to enjoy their meals. The clinking of cutlery and soft murmur of conversations blend with the gentle sound of waves, creating a symphony of relaxation and indulgence. The air is rich with the aromas of roasted meats, fresh seafood, and sweet desserts, beckoning patrons to savor every moment.",
        "As the weather shifts, so too does the mood of the dining room. On rainy mornings, the dimly lit room feels tranquil, with the soft patter of rain against the windows providing a soothing backdrop to breakfast. Guests enjoy buttery croissants and steaming coffee, their conversations hushed as they savor the moment. However, as the afternoon clouds gather, the atmosphere becomes somber; the turbulent sea serves as a reminder of the storm brewing outside, casting a shadow over the dining experience."
      ]
    },
    {
      "id": "library",
      "name": "The Hotel Library",
      "type": "interior",
      "purpose": "Quiet space for reflection and reading",
      "visualDetails": "A cozy room lined with bookshelves, leather armchairs, and a crackling fireplace.",
      "sensoryDetails": {
        "sights": [
          "flickering flames in the fireplace",
          "soft light from table lamps",
          "ornate carpets underfoot",
          "faded portraits on the walls"
        ],
        "sounds": [
          "crackling fire",
          "soft rustle of pages turning",
          "whispers of guests",
          "the ticking of a clock",
          "occasional creak of the floorboards"
        ],
        "smells": [
          "rich scent of old books",
          "smoky aroma from the fireplace",
          "dusty air",
          "subtle hint of leather",
          "the faint scent of lavender"
        ],
        "tactile": [
          "soft leather of armchairs",
          "smoothness of book covers",
          "warmth from the fire",
          "rough texture of carpet",
          "cool glass of a drink in hand"
        ]
      },
      "accessControl": "Open to guests during the day; locked after hours for privacy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through rain-soaked windows",
            "shadows dancing on the walls",
            "guests wrapped in blankets"
          ],
          "sounds": [
            "steady rainfall",
            "soft whispers",
            "the crackle of the fire"
          ],
          "smells": [
            "freshly brewed tea",
            "scent of damp paper",
            "warmth of spices"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light casting an eerie glow",
            "dust motes floating in the air",
            "guests lost in thought"
          ],
          "sounds": [
            "soft ticking of a clock",
            "muffled conversations from outside",
            "the rustling of newspapers"
          ],
          "smells": [
            "scent of old parchment",
            "faint hint of tobacco",
            "the aroma of fresh coffee"
          ],
          "mood": "pensive"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of lamps illuminating pages",
            "deep shadows in corners",
            "the last guests settling into their chairs"
          ],
          "sounds": [
            "soft laughter from other rooms",
            "the crackle of the fire",
            "the distant sound of waves"
          ],
          "smells": [
            "scent of wood smoke",
            "freshly baked cookies",
            "the faint aroma of flowers"
          ],
          "mood": "nostalgic"
        }
      ],
      "paragraphs": [
        "The Hotel Library offers a cozy sanctuary for guests seeking solace from the storm outside. Lined with shelves of leather-bound volumes, the room exudes an air of sophistication, where the flickering flames of the fireplace cast a warm glow over the plush leather armchairs. The soft rustle of pages turning and the crackling of the fire create a soothing symphony, inviting patrons to lose themselves in the stories held within the books. The rich scent of old parchment and the faint hint of lavender linger in the air, wrapping guests in a comforting embrace.",
        "As the weather shifts, so does the ambiance of the library. On rainy mornings, the dim light filtering through the rain-soaked windows creates an introspective atmosphere, where guests find solace in the pages of their books, wrapped in soft blankets. The steady rainfall outside serves as a backdrop to quiet contemplation, while the aroma of freshly brewed tea wafts in from the adjacent dining room. However, as the afternoon clouds gather, the atmosphere becomes pensive, reflecting the weight of unspoken thoughts and the mysteries that linger just beyond the walls."
      ]
    }
  ],
  "note": "",
  "cost": 0.00257063235,
  "durationMs": 43657
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1947,
    "month": "April",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "cool breezes from the coast"
    ],
    "daylight": "Days are growing longer, with daylight stretching until around 7:30 PM, casting a soft glow over the landscape.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, just after dinner service concludes.",
    "holidays": [
      "Easter Sunday (April 20, 1947)"
    ],
    "seasonalActivities": [
      "spring cleaning in homes",
      "visiting local flower shows",
      "taking early evening strolls along the coast"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suits in navy or charcoal",
        "white dress shirts with wide collars",
        "silk ties with geometric patterns"
      ],
      "casual": [
        "tweed blazers with elbow patches",
        "khaki trousers",
        "button-up shirts in pastel colors"
      ],
      "accessories": [
        "fedora hats",
        "leather gloves",
        "classic wristwatches"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with floral patterns",
        "tailored suits with fitted waistlines",
        "high-heeled pumps"
      ],
      "casual": [
        "A-line skirts paired with fitted blouses",
        "lightweight cardigans",
        "capri pants"
      ],
      "accessories": [
        "wide-brimmed hats",
        "string pearl necklaces",
        "stylish handbags"
      ]
    },
    "trendsOfTheMoment": [
      "emphasis on practicality in fashion",
      "revival of vintage styles from the 1930s",
      "adoption of softer colors and fabrics"
    ],
    "socialExpectations": [
      "men expected to wear hats in public",
      "women encouraged to maintain a polished appearance",
      "increasing acceptance of women in the workplace"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The United Nations is actively working to address post-war recovery",
      "The beginning of the Cold War is shaping international relations",
      "Strikes in various industries as workers demand better wages"
    ],
    "politicalClimate": "Tensions are high as the Cold War begins to unfold, with growing concerns over Soviet influence in Eastern Europe.",
    "economicConditions": "The economy is recovering, but inflation is causing concern among the populace, particularly in the cost of living.",
    "socialIssues": [
      "displacement of war veterans",
      "women's rights and workforce participation",
      "racial segregation and civil rights movements gaining momentum"
    ],
    "internationalNews": [
      "The Marshall Plan is announced to aid European recovery",
      "Increased military presence in Europe as NATO discussions commence"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'The Nearness of You' by Hoagy Carmichael",
        "'Straighten Up and Fly Right' by Nat King Cole",
        "'The Old Master Painter' by Bing Crosby"
      ],
      "films": [
        "'It’s a Wonderful Life' (1946)",
        "'Gentleman’s Agreement' (1947)",
        "'The Farmer’s Daughter' (1947)"
      ],
      "theater": [
        "'Annie Get Your Gun' on Broadway",
        "Revival of classic plays in local theaters"
      ],
      "radio": [
        "'The Shadow' suspense series",
        "'Suspense' anthology series",
        "'The Jack Benny Program'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Naked and the Dead' by Norman Mailer",
        "'Invisible Man' by Ralph Ellison",
        "'A Streetcar Named Desire' by Tennessee Williams"
      ],
      "popularGenres": [
        "detective fiction",
        "social commentary",
        "post-war novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "improvements in radar technology",
        "the development of early computers"
      ],
      "commonDevices": [
        "radio sets",
        "black-and-white televisions",
        "film projectors"
      ],
      "emergingTrends": [
        "increased popularity of television programming",
        "advancements in communication technology",
        "post-war consumer goods boom"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cup of coffee: six pence",
        "Taxi ride across town: two shillings"
      ],
      "commonActivities": [
        "attending church services on Sundays",
        "gathering for community picnics",
        "engaging in local sporting events"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "weekly movie nights",
        "neighborhood barbecues"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing divide between working-class and middle-class aspirations",
      "post-war optimism among the affluent"
    ],
    "gender": [
      "increased respect for women in the workforce",
      "traditional gender roles still prevalent in many households",
      "growing advocacy for women's rights"
    ],
    "race": [
      "racial tensions due to segregation and discrimination",
      "emergence of civil rights movements advocating for equality"
    ],
    "generalNorms": [
      "community-oriented living with strong social ties",
      "emphasis on family values and patriotism",
      "cautious optimism about the future"
    ]
  },
  "atmosphericDetails": [
    "The salty air mixed with dampness from recent rains creates a heavy yet fresh scent, mingling with the smell of blooming flowers.",
    "Dimly lit hallways of the hotel, echoing with hushed conversations and the clinking of glasses in the bar, heighten the sense of tension.",
    "The sound of waves crashing against the rocky shore blends with distant thunder, creating an ominous backdrop as shadows lengthen in the fading light."
  ],
  "paragraphs": [
    "April 1947 unfolds along the coastal town with an air of both renewal and tension. Overcast skies loom as the warmth of spring begins to seep into the dampness left by the recent rains. As the days grow longer, residents cautiously step outside to enjoy the fresh breezes, some visiting local flower shows and others indulging in leisurely strolls along the shore, all while the specter of the recent war still haunts their memories. With Easter approaching, families plan for gatherings, yet the underlying currents of political and social unrest keep conversations charged and wary.",
    "Fashion in this spring is marked by both practicality and a hint of elegance. Men don double-breasted suits in rich navy and charcoal, often crowned with a stylish fedora, while women embrace tea-length dresses adorned with vibrant floral prints, complemented by wide-brimmed hats. The streets are a canvas of pastel colors and sophisticated styles, reflecting a society eager to move forward yet still tethered to the past. This interplay of tradition and modernity is palpable, highlighting the duality of a world in transition.",
    "Daily life continues with a rhythm shaped by the aftermath of the war. In homes, the act of spring cleaning symbolizes a fresh start, while community picnics and neighborhood barbecues foster a sense of unity. Prices remain stable but are creeping up, with a loaf of bread costing four pence and a taxi ride across town priced at two shillings. Social rituals like Sunday family dinners and movie nights serve to strengthen bonds within families and communities, yet the lingering effects of recent social changes are felt, particularly as more women step into roles outside the home, challenging conventional norms."
  ],
  "note": "",
  "cost": 0.0010769516999999998,
  "durationMs": 14574
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a remote seaside hotel for a post-war reunion becomes a pressure cooker of secrets and tensions as the rising tide threatens to drown more than just the past.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Post-WWII trauma influences class dynamics, with increased female workforce participation creating new social pressures and tensions amidst emerging Cold War fears."
  },
  "setting": {
    "location": "A seaside hotel featuring Art Deco architecture with ocean views.",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain showers, typical for coastal regions in the fall."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a tidal-drowning method, where the flood-tide timetable and shifting sea level fix — and falsify — the window in which the victim could have drowned."
}

### LOCKED_FACTS
[
  {
    "id": "tidal_schedule",
    "value": "ten minutes past eleven",
    "description": "The hotel clock shows this time when the victim was last seen."
  },
  {
    "id": "tide_position",
    "value": "low tide",
    "description": "The position of the tide contradicts the supposed time of drowning."
  },
  {
    "id": "witness_time",
    "value": "twenty past midnight",
    "description": "A witness claims to have seen the victim alive at this time."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 7,
    "mid": 11,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 17,
    "supporting": 1,
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
      "category": "temporal"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_4",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
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
      "category": "testimonial"
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
      "category": "spatial"
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
      "category": "temporal"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "supporting",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_eleanor_voss",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_late_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
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
