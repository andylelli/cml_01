# Actual Prompt Record

- Run ID: `mystery-1784571763605`
- Project ID: ``
- Timestamp: `2026-07-20T18:26:37.597Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `e54dd292e2d59181`

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
    "title": "The Poisoned Tide",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "The Ocean View Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "delayed-action poisoning"
    }
  },
  "death_method": "poisoned with a slow-acting toxin",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp and observant guest at the hotel.",
      "private_secret": "Has a hidden past linked to the victim.",
      "motive_seed": "Concern for the victim's wellbeing.",
      "motive_strength": "weak",
      "alibi_window": "night of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Dining area"
      ],
      "behavioral_tells": [
        "Curious about the victim's health"
      ],
      "stakes": "Desire for justice",
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
      "public_persona": "Respected doctor and hotel guest.",
      "private_secret": "Knew too much about a dangerous secret.",
      "motive_seed": "Had a potential blackmail situation.",
      "motive_strength": "high",
      "alibi_window": "night of the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Lobby",
        "Dining area"
      ],
      "behavioral_tells": [
        "Nervous around certain guests"
      ],
      "stakes": "Reputation at stake",
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
      "public_persona": "A retired naval officer with a commanding presence.",
      "private_secret": "Has a gambling debt to settle.",
      "motive_seed": "Desperation for money.",
      "motive_strength": "moderate",
      "alibi_window": "night of the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining area",
        "Hotel bar"
      ],
      "behavioral_tells": [
        "Fidgeting when asked about finances"
      ],
      "stakes": "His financial future",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "An ambitious journalist.",
      "private_secret": "Has been investigating the victim.",
      "motive_seed": "Desire for a sensational story.",
      "motive_strength": "moderate",
      "alibi_window": "night of the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Lobby",
        "Dining area"
      ],
      "behavioral_tells": [
        "Excited about the victim's health issues"
      ],
      "stakes": "Career advancement",
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
      "public_persona": "A young socialite with charm.",
      "private_secret": "Has a secret crush on the victim.",
      "motive_seed": "Jealousy over attention given to others.",
      "motive_strength": "weak",
      "alibi_window": "night of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Dining area"
      ],
      "behavioral_tells": [
        "Acts nervous around the victim"
      ],
      "stakes": "Unrequited love",
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
      "public_persona": "A wealthy businessman.",
      "private_secret": "Has dealings that could ruin him.",
      "motive_seed": "Fear of exposure.",
      "motive_strength": "high",
      "alibi_window": "night of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Lobby",
        "Dining area"
      ],
      "behavioral_tells": [
        "Avoids discussing business matters"
      ],
      "stakes": "His reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Hugo Vane"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In the gloomy backdrop of a seaside hotel, Dr. Mallory Finch is found dead after a dinner party. As Eleanor Voss investigates, she uncovers a web of deceit, secrets, and a cleverly disguised poison that exploits behavioral assumptions about the guests."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on drink, dinner, and witness to expose the false timing.",
      "delivery_path": [
        {
          "step": "Hugo Vane conceals the siphon beneath the tablecloth."
        },
        {
          "step": "The poison is gradually released into Dr. Finch's drink."
        },
        {
          "step": "Dr. Finch collapses after finishing her drink, leading others to believe it was natural causes."
        }
      ]
    },
    "outcome": {
      "result": "Dr. Finch dies from a delayed reaction to the poison, and the true nature of her murder is concealed."
    }
  },
  "false_assumption": {
    "statement": "Dr. Mallory Finch had a heart condition that caused her sudden collapse.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses recall Dr. Finch appearing unwell during the evening.",
    "what_it_hides": "The true cause of death is the slow-acting poison administered by Hugo Vane."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Hale was seen arguing with Dr. Finch earlier in the evening.",
      "He has a history of violent outbursts."
    ],
    "the_one_flaw": "Captain Hale was in the bar at the time of death, as confirmed by multiple witnesses.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A glass with a puncture found near Dr. Finch's table.",
      "points_at_suspect": "Eleanor Voss",
      "innocent_explanation": "The glass was accidentally damaged during the dinner.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A note found in Dr. Finch's room mentioning a secret.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The note was part of Beatrice's research, unrelated to the murder.",
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
    "rationale": "All suspects were guests at the hotel and had access to the victim."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner party time",
        "Time of death"
      ],
      "windows": [
        "8 PM to 10 PM"
      ],
      "contradictions": [
        "Witness testimonies about Dr. Finch's health contradict her sudden death."
      ]
    },
    "access": {
      "actors": [
        "Hugo Vane",
        "Eleanor Voss"
      ],
      "objects": [
        "Tablecloth",
        "Glass"
      ],
      "permissions": [
        "All guests had access to the dining area."
      ]
    },
    "physical": {
      "laws": [
        "Poisoning laws of nature"
      ],
      "traces": [
        "Puncture in the glass",
        "Almond smell near the table"
      ]
    },
    "social": {
      "trust_channels": [
        "Hotel staff",
        "Fellow guests"
      ],
      "authority_sources": [
        "Hotel management",
        "Local police"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall Dr. Finch frequently asking for refills during dinner.",
        "correction": "This indicates she was consuming a significantly larger volume of drink than usual.",
        "effect": "Narrows opportunity for others to tamper with her drink during the evening.",
        "required_evidence": [
          "Witness statements about Dr. Finch's behavior",
          "Menu showing drink choices during dinner"
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint odor of almonds is detected near Dr. Finch's table after her collapse.",
        "correction": "The odor suggests the presence of a toxic substance typically associated with poisoning.",
        "effect": "Eliminates the possibility of natural causes for her death.",
        "required_evidence": [
          "Witness statements about the smell",
          "Post-mortem report indicating poisoning"
        ],
        "reader_observable": true
      },
      {
        "observation": "A small puncture in Dr. Finch's glass is found during investigation.",
        "correction": "This indicates that her drink may have been tampered with to release poison gradually.",
        "effect": "Narrows down the suspect pool to those who had access to her glass.",
        "required_evidence": [
          "Forensic analysis of the glass",
          "Witness accounts of who was near the table"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares dinner, drink, and witness against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are indicate, witness, and recall.",
    "pass_condition": "If any guest shows signs of poisoning, it will confirm the method used against Dr. Finch.",
    "evidence_clues": [
      "clue_mechanism_visibility_core",
      "clue_culprit_direct_1",
      "clue_6"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The witness accounts of Dr. Finch's drinking habits (early) and the almond smell (mid) point to deliberate poisoning. Step 2: The punctured glass (mid) confirms tampering, eliminating natural causes. Step 3: The discriminating test will reveal if the same method was used on other guests, confirming Hugo Vane's guilt."
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
        "Observe the guests' reactions",
        "Draw conclusion about guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi in the bar during the time of death.",
        "supporting_clues": [
          "witness statements",
          "bar tab records"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Evidence shows the note was unrelated to the murder.",
        "supporting_clues": [
          "note analysis",
          "witness statements"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm she was not in the dining area at the time.",
        "supporting_clues": [
          "witness accounts"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: night of the murder",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with gathered evidence."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_culprit_direct_hugo_vane",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Corroborated elimination"
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
        "delivery_method": "Witness statement"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a traveling journalist whose charm masks a heart burdened by secrets. As she investigates a murder that strikes too close to home, her quest for truth becomes a battle against her own emotions.",
    "publicPersona": "Charming and inquisitive, Eleanor is known for her compelling articles on social issues.",
    "privateSecret": "She is in love with the victim's fiancé, which complicates her investigation.",
    "motiveSeed": "Desires to uncover the truth but fears her own involvement will be discovered.",
    "motiveStrength": "strong",
    "alibiWindow": "Present during the entire evening, was in the dining area.",
    "accessPlausibility": "easy",
    "stakes": "Must prove her worth as a journalist while hiding her feelings for the fiancé.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured tone, often punctuating her observations with a wry smile. She has a habit of asking rhetorical questions, drawing in her listener.",
    "signatureTic": "Ah, but isn’t that the question of the hour?",
    "internalConflict": "Eleanor grapples with her growing feelings for the fiancé, torn between her personal desires and her professional ethics.",
    "personalStakeInCase": "The murder strikes at the core of her integrity as a journalist and challenges her to confront her feelings for the fiancé.",
    "paragraphs": [
      "Eleanor Voss had always been one to chase the truth, her pen dancing across the pages of her articles with an elegance that belied the chaos of the world around her. Yet, as she stood in the lavish dining area of the seaside hotel, the air thick with the scent of salt and secrets, her heart raced for reasons beyond the usual thrill of a good story. The victim, a woman of ambition and allure, had been a friend, and now, in death, she threatened to expose the tangled web of Eleanor's own affections.",
      "Over the years, Eleanor had perfected the art of charm, her smile a beacon amidst the shadows of her internal struggles. She was known for her compelling articles on social issues, but beneath the surface lay a heart burdened by unspoken desires. The fiancé, a man of striking intelligence and warmth, had captured her heart during their fleeting encounters. Now, as she delved deeper into the investigation, her love became a double-edged sword, complicating her pursuit of justice.",
      "The evening of the murder had unfolded like a twisted play, with Eleanor in the front row, witnessing the final act. She had been present, mingling with guests, her laughter a fragile façade against the backdrop of rising tensions. The dining area, once filled with animated chatter, now felt like a stage set for tragedy. Eleanor's instinct as a journalist kicked in, urging her to uncover the truth, yet a fear gnawed at her insides: what if her own feelings were laid bare in the process?",
      "As she navigated the aftermath of the murder, Eleanor found herself at a crossroads. The stakes were no longer just professional; they were deeply personal. With each revelation, she felt the weight of her secret growing heavier. Would she be able to prove her worth as a journalist while hiding her feelings for the fiancé? The answer lay in the shadows, and Eleanor was determined to bring it into the light, even if it meant confronting the truth about herself."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose life is upended when a past affair leads to murder. As she grapples with jealousy and reputation, the truth of her past threatens to unravel her present.",
    "publicPersona": "Respected doctor with a sharp mind, known for her charity work.",
    "privateSecret": "She had a brief affair with the victim, which ended badly.",
    "motiveSeed": "Jealousy over the victim's engagement and the loss of a potential partnership.",
    "motiveStrength": "weak",
    "alibiWindow": "Claimed to be in her room preparing for a conference.",
    "accessPlausibility": "possible",
    "stakes": "Could lose reputation and connections if her past with the victim is exposed.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks in a precise, clinical manner, often using medical terminology even in casual conversation. She avoids small talk, preferring to get straight to the point.",
    "signatureTic": "Let's not mince words.",
    "internalConflict": "Dr. Finch wrestles with guilt and jealousy, fearing that her past will come to light and destroy her career.",
    "personalStakeInCase": "The murder exposes her vulnerability, as her past affair with the victim threatens her professional reputation.",
    "paragraphs": [
      "Dr. Mallory Finch was a woman of science, her life meticulously organized like the instruments in her practice. Respected and admired, she had built a career on precision and compassion, but beneath her polished exterior lay a chaotic past that threatened to resurface with tragic consequences. The murder of the victim, a woman she once loved, had pulled the rug from under her feet, leaving her to grapple with the specters of jealousy and regret.",
      "The affair had been brief, a moment of passion that flickered like a candle in a storm. Mallory had thought it a secret, a harmless dalliance that would fade with time. Yet, as she sat in her room, preparing for a conference that now seemed trivial, the weight of her past loomed large. The victim’s engagement had shattered any hopes of rekindling their connection, and now, in death, the woman held the power to ruin Mallory’s carefully constructed life.",
      "Claiming to have been in her room during the murder, Mallory felt the walls closing in. She had been preparing notes, but the truth was more complicated. Her heart raced at the thought of being drawn into suspicion, her reputation as a respected physician hanging by a thread. The whispers of jealousy, the anger over lost opportunities, threatened to engulf her, leaving her vulnerable and exposed.",
      "As the investigation unfolded, Mallory faced a grim reality: her past was no longer a mere footnote in her life story; it was a potential headline. The stakes were high, and as she navigated the treacherous waters of suspicion, she realized that she must confront her demons. Would she redeem herself from the shadows of her past, or would she succumb to the jealousy that had once consumed her?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a gallant military officer, finds himself entangled in a web of betrayal and heartbreak when his past with the victim resurfaces amidst murder. His journey is one of confronting emotions that threaten his reputation.",
    "publicPersona": "Brave and gallant, Ivor is admired for his service and duty.",
    "privateSecret": "He was once romantically involved with the victim before her engagement.",
    "motiveSeed": "Bitter about the victim's betrayal; desires revenge for emotional pain.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was seen at the bar from 8 PM to 9 PM.",
    "accessPlausibility": "possible",
    "stakes": "Risks losing reputation as a war hero if his heartbreak is revealed.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a commanding presence but often slips into self-deprecating remarks, revealing a softer side. He uses military jargon occasionally, but his tone is warm and engaging.",
    "signatureTic": "Well, that’s one way to get your heart broken.",
    "internalConflict": "Ivor struggles with feelings of betrayal and the desire for revenge, battling his emotions while maintaining his heroic facade.",
    "personalStakeInCase": "The murder forces Ivor to confront his unresolved feelings for the victim and the betrayal that haunts him.",
    "paragraphs": [
      "Captain Ivor Hale was a man defined by duty and honor, his gallant demeanor earning him admiration from all corners. Yet, beneath the polished exterior lay a heart bruised by betrayal. Once romantically involved with the victim, Ivor found himself trapped in a maelstrom of emotions when their past resurfaced with the news of her murder. The memories of their time together clashed with the bitterness of her engagement, leaving him grappling with feelings he had long buried.",
      "Seen at the bar during the critical hour, Ivor had attempted to drown his sorrows in whiskey, the amber liquid a poor substitute for the warmth of the victim's affection. As he engaged in idle banter with fellow patrons, his laughter rang hollow, a mask for the turmoil within. The betrayal cut deep, and now, as he faced the fallout of her death, Ivor felt the weight of suspicion pressing upon him like a millstone.",
      "His military training had taught him to navigate danger with a steady hand, yet this emotional battlefield was foreign territory. Ivor’s heart ached with the desire for revenge, a quiet fury simmering beneath the surface. The stakes were high; his reputation as a war hero was on the line, and he feared that the truth of his past with the victim would shatter the image he had worked so hard to uphold.",
      "As the investigation progressed, Ivor found himself at a crossroads, forced to confront the ghosts of his past. Would he allow his feelings of betrayal to dictate his actions, or would he rise above the emotional turmoil? The answer lay in the shadows, and with every revelation, Ivor knew he must decide whether to face his demons or let them haunt him forever."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a glamorous socialite whose life is overshadowed by unrequited love and rivalry. As suspicion mounts around her, she must confront her feelings and the lengths she might go to for love.",
    "publicPersona": "A glamorous figure in high society, known for her wit and charm.",
    "privateSecret": "She is secretly in love with Ivor and resents the victim for taking him.",
    "motiveSeed": "Feels overlooked and seeks to eliminate her competition for Ivor's affection.",
    "motiveStrength": "weak",
    "alibiWindow": "Claimed to be at a charity event during the time of the murder.",
    "accessPlausibility": "unlikely",
    "stakes": "Could be ostracized by society if her feelings are discovered.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a polished, playful tone, often lacing her dialogue with sharp wit. She enjoys wordplay and often turns phrases to her advantage.",
    "signatureTic": "Oh darling, life is simply too short for mediocrity.",
    "internalConflict": "Beatrice struggles with feelings of inadequacy and jealousy, torn between her affections for Ivor and her desire for social acceptance.",
    "personalStakeInCase": "The murder exposes her vulnerabilities, as her unrequited love for Ivor and resentment towards the victim threaten her social standing.",
    "paragraphs": [
      "Beatrice Quill was the epitome of glamour, her presence illuminating any room she entered. A socialite with a sharp tongue and a keen eye for the latest trends, she reveled in the attention that came with her status. Yet, beneath the façade of charm lay a heart aching with unrequited love—a love directed towards Captain Ivor Hale, a man ensnared by the allure of the victim. The very sight of them together ignited a jealousy that simmered just beneath her polished exterior.",
      "Claiming to have been at a charity event during the time of the murder, Beatrice felt the weight of suspicion bearing down on her. She had navigated the treacherous waters of high society with grace, but the specter of the victim loomed large, threatening to overshadow her every move. The thought of being ostracized for her unspoken feelings sent a shiver down her spine, and as whispers filled the air, she knew she had to tread carefully.",
      "With a quick wit that could cut through tension like a knife, Beatrice often employed her charm as a shield. 'Oh darling, life is simply too short for mediocrity,' she would quip, deflecting attention from her inner turmoil. Yet, the stakes were higher than mere social standing; the fear of losing Ivor to someone she deemed lesser gnawed at her insides, pushing her to the edge of desperation.",
      "As the investigation unfolded, Beatrice found herself at a crossroads. Would she continue to harbor her feelings in silence, or would she confront the truth of her affections? The murder had thrust her into a spotlight she never desired, and as she navigated the storm of emotions, Beatrice realized that her worth extended beyond the affections of a man. The question remained: could she rise above the shadows of jealousy and embrace her true self?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a diligent hotel manager whose devotion to her work is tested when a murder threatens the reputation of her establishment. She must choose between protecting her job and revealing painful truths.",
    "publicPersona": "Diligent and attentive, Sylvia is respected and trusted by guests.",
    "privateSecret": "She harbors a secret about the victim's past that could ruin her.",
    "motiveSeed": "Wants to keep the hotel's reputation intact and fears the victim's revelations.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the lobby managing staff during the murder.",
    "accessPlausibility": "easy",
    "stakes": "Risks losing her job and the hotel’s standing if the truth comes out.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with an air of authority, her tone calm and measured. She often observes situations carefully before responding, choosing her words with precision.",
    "signatureTic": "Let’s keep things in order, shall we?",
    "internalConflict": "Sylvia is torn between her duty to protect the hotel's reputation and the moral obligation to reveal the truth about the victim.",
    "personalStakeInCase": "The murder threatens not only her job but also the integrity of the hotel she has dedicated her life to managing.",
    "paragraphs": [
      "Sylvia Trent was the backbone of the seaside hotel, her dedication evident in every aspect of its operation. Respected by guests and staff alike, she managed the establishment with a firm yet nurturing hand. But when the shocking news of a murder broke, the very foundation of her life’s work trembled. The victim, a woman entwined in secrets, held the key to a past that could unravel everything Sylvia had built.",
      "In the lobby, where laughter and clinking glasses had once filled the air, Sylvia now felt a heavy silence enveloping her. She had been managing staff during the murder, her focus unwavering, yet the weight of her secret pressed down on her like a leaden cloak. The victim's past was a Pandora's box, and Sylvia was acutely aware that opening it could spell disaster for the hotel's reputation.",
      "As she navigated the chaos of the investigation, Sylvia's observational skills became her greatest asset. 'Let’s keep things in order, shall we?' she would remind her staff, her calm demeanor masking the storm brewing within. The stakes were sky-high; her job and the hotel’s standing were on the line, and she felt the pressure to protect them at all costs.",
      "Yet, as the truth began to surface, Sylvia faced a moral dilemma. Would she continue to shield the hotel from the fallout of the victim's revelations, or would she risk everything to reveal the truth? The answers lay hidden in the shadows, and Sylvia knew she must confront her fears. The path ahead was fraught with peril, but her commitment to integrity would ultimately guide her decisions."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a suave businessman whose charm masks a web of deceit. As suspicion mounts, he must confront the consequences of his manipulative schemes that have led to murder.",
    "publicPersona": "A suave and calculating businessman, Hugo is known for his charm.",
    "privateSecret": "He is deeply in debt and was planning to manipulate the victim for financial gain.",
    "motiveSeed": "Stands to gain financially from the victim's death; had planned to coerce her into a deal.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claims to have been in a meeting during the murder.",
    "accessPlausibility": "possible",
    "stakes": "Could be ruined financially if the victim exposes his schemes.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Hugo speaks with a smooth, confident tone, often punctuating his sentences with dry humor. He enjoys playing with words and employs a charming, almost flirtatious manner.",
    "signatureTic": "Ah, but who doesn’t love a little intrigue?",
    "internalConflict": "Hugo grapples with guilt over his manipulative schemes and the realization that his actions may have led to murder.",
    "personalStakeInCase": "The murder directly threatens his financial stability, forcing him to confront his manipulations and their consequences.",
    "paragraphs": [
      "Hugo Vane was a man of many faces, his charm a carefully crafted mask that concealed a labyrinth of deceit. A businessman with a silver tongue, he navigated the world with an ease that belied the turmoil beneath. Yet, as the news of the murder rippled through the seaside hotel, Hugo felt the ground shift beneath his feet. The victim, a woman he had planned to manipulate for financial gain, now lay dead, and the stakes had never been higher.",
      "Claiming to have been in a meeting during the murder, Hugo exuded an air of confidence that seemed almost rehearsed. 'Ah, but who doesn’t love a little intrigue?' he would quip, his sardonic humor a thin veil over the mounting pressure. The truth was far more complex; he was deeply in debt, and the victim’s death presented a perilous opportunity that he had long sought. Yet, as suspicion crept closer, the walls began to close in around him.",
      "With each passing moment, guilt gnawed at Hugo’s conscience, a reminder of the manipulative schemes he had employed to climb the social ladder. The murder threatened to expose not just his financial vulnerabilities but the very essence of his character. As he faced the mounting evidence against him, Hugo realized that the charming façade he had so carefully cultivated could crumble at any moment.",
      "As the investigation unfolded, Hugo stood at a crossroads, forced to confront the consequences of his actions. Would he continue to play the game, risking everything for a chance at redemption, or would he allow his manipulations to drag him deeper into darkness? The answer lay in the shadows, and Hugo knew he must navigate the treacherous waters of his own making if he hoped to emerge unscathed."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Azure Crest Hotel",
    "type": "seaside hotel",
    "place": "Barmouth",
    "country": "Wales",
    "summary": "A grand seaside hotel perched on the rugged coastline, blending art deco elegance with coastal charm, now haunted by recent unsettling events.",
    "visualDescription": "The Azure Crest boasts a striking façade of whitewashed stucco with sweeping balconies, while its art deco interiors feature polished brass fixtures and ocean-themed murals. The lobby, with its high ceilings and grand staircase, opens to a terrace that overlooks the turbulent waves crashing against the rocky shore.",
    "atmosphere": "An air of suspense lingers, as guests exchange nervous glances amidst the stormy backdrop.",
    "paragraphs": [
      "The Azure Crest Hotel stands defiantly against the relentless winds of the Welsh coastline, its elegant lines softened by the salty air. The sound of crashing waves echoes through the narrow hallways, where the scent of damp wood and musty carpet mingles with the faintest hint of perfume. Here, in the dim light of the lobby, guests gather, their hushed conversations a backdrop to the crackle of a radio broadcasting news from afar. As the rain taps against the windows, the atmosphere thickens with tension, the weight of unspoken fears palpable in the air.",
      "In the dining area, chandeliers cast a warm glow over polished mahogany tables, yet the mood remains somber. Guests, clad in post-war attire, shift uneasily in their seats, their eyes darting to the terrace where the storm rages. Outside, the sea churns violently, a reflection of the unease within. Waitstaff, in crisp uniforms, move swiftly, their footsteps muted on the carpet, while the aroma of hearty fare struggles to mask the scent of apprehension that pervades the space.",
      "As night falls, the hotel transforms under the flickering glow of candlelight. Shadows dance along the walls, creating an unsettling play of light and dark. The sound of a distant clock ticking grows louder, marking the passage of time as the guests' nerves fray. Outside, the storm intensifies, isolating the hotel further from the world beyond. The Azure Crest, once a sanctuary, now feels like a trap, as the whispers of the past echo through its halls and the poisonous tide of secrets begins to rise."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical for coastal regions in the fall",
    "timeFlow": "Days stretch into a tense week, as the mystery unfolds amidst growing dread.",
    "mood": "tense, as guests are on edge due to recent unsettling events in the area",
    "eraMarkers": [
      "radio broadcasts filling the lobby",
      "rationed fuel affecting travel plans",
      "women in service roles within the hotel"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and damp wood",
      "secondary": [
        "crackling radio static",
        "warm candle wax"
      ]
    },
    "paragraphs": [
      "The atmosphere at The Azure Crest Hotel is thick with anticipation and unease, the salty sea air mixing with the dampness of the overcast sky. Guests move about with a shared sense of apprehension, their whispers underscored by the crackling of the radio broadcasting urgent news. The scent of damp wood and old leather furniture permeates the lobby, where flickering candlelight casts long shadows, heightening the sense of foreboding. Outside, the relentless waves crash against the cliffs, a reminder of the isolation that envelops them, while the occasional gust of wind rattles the windows.",
      "As night descends, the hotel takes on an even more sinister tone. The dimly lit corridors echo with the sound of muffled footsteps and distant murmurs, while the smell of wax from the flickering candles mingles with the musty scent of old books in the library. Each room holds its secrets, and the atmosphere is charged with unspoken fears. Tension hangs like a heavy blanket, pressing down on the guests who feel the weight of the mystery brewing within the walls of The Azure Crest."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "High ceilings adorned with art deco chandeliers; polished marble floors reflecting muted light.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "art deco chandeliers",
          "polished brass fixtures",
          "intricate wall murals",
          "large bay windows"
        ],
        "sounds": [
          "hushed conversations",
          "crackling radio broadcasts",
          "footsteps on marble",
          "the distant crash of waves",
          "soft piano music"
        ],
        "smells": [
          "damp wood and old leather",
          "freshly polished furniture",
          "faint perfume",
          "salt air from the sea",
          "smoky undertones from the kitchen"
        ],
        "tactile": [
          "cold marble underfoot",
          "smooth brass handrails",
          "plush velvet seating",
          "crisp linen napkins",
          "soft wool of coats"
        ]
      },
      "accessControl": "Open to all guests, but monitored by staff; access to adjoining hallways is limited.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "grey light filtering in",
            "wet floors reflecting light"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft murmurs of guests",
            "clanking of dishes from breakfast service"
          ],
          "smells": [
            "freshly brewed coffee",
            "wet earth",
            "cooked bacon"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "cloudy light casting gloom",
            "faded photographs on the walls"
          ],
          "sounds": [
            "silence interrupted by a distant clock",
            "the rustle of newspapers",
            "the occasional laughter from the dining area"
          ],
          "smells": [
            "dust from the old furniture",
            "faint scent of flowers",
            "stale air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "darkening sky visible through windows",
            "guests gathering for dinner"
          ],
          "sounds": [
            "soft music from the piano",
            "clinking of glasses",
            "laughter from the gathering crowd"
          ],
          "smells": [
            "warm wax from candles",
            "fresh bread baking",
            "herb-infused dishes"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Azure Crest Hotel serves as the heart of the establishment, a bustling hub where guests come to mingle and share whispers of intrigue. The high ceilings, adorned with art deco chandeliers, create an atmosphere of elegance, while polished marble floors gleam underfoot. Here, the scent of damp wood and leather is ever-present, mingling with the salty tang of the sea just beyond the large bay windows. As guests gather, the crackling of the radio fills the air, providing a backdrop of news and rumors that only heighten the tension in the room.",
        "In the mornings, the lobby is awash with a grey light filtering through rain-streaked windows, casting shadows that dance across the marble. The sound of rain drumming against the glass blends with the soft murmurs of guests discussing the latest unsettling news. A few brave souls venture outside, but the storm keeps most inside, huddled close to the warmth of the fireplace. Here, every glance is laden with suspicion, and the atmosphere is thick with unspoken fears."
      ]
    },
    {
      "id": "dining_area",
      "name": "The Dining Saloon",
      "type": "interior",
      "purpose": "Dining space for guests",
      "visualDetails": "Elegant dining tables set with fine china; large windows showcasing the tumultuous sea.",
      "sensoryDetails": {
        "sights": [
          "fine china and silverware",
          "elegantly set tables",
          "large windows overlooking the sea",
          "flickering candlelight",
          "art deco wall sconces"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft chatter of guests",
          "the distant roar of waves",
          "serving staff moving about",
          "a piano playing softly"
        ],
        "smells": [
          "aroma of hearty stew",
          "freshly baked bread",
          "cooked meats and vegetables",
          "sweet scent of desserts",
          "faint tobacco smoke"
        ],
        "tactile": [
          "smooth tablecloths",
          "cold silverware",
          "warmth from the fireplace",
          "soft upholstery of chairs",
          "crisp napkins"
        ]
      },
      "accessControl": "Open to all guests during meal times; kitchen access restricted to staff only.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "misty view of the sea",
            "rain-drops on window panes",
            "dimly lit tables"
          ],
          "sounds": [
            "soft patter of rain on glass",
            "clinking of dishes",
            "muffled conversations"
          ],
          "smells": [
            "freshly brewed coffee",
            "cooked eggs",
            "sizzling bacon"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light casting shadows",
            "empty tables waiting for guests",
            "clouds rolling in over the sea"
          ],
          "sounds": [
            "silence punctuated by the wind",
            "occasional laughter from the lobby",
            "the creaking of old furniture"
          ],
          "smells": [
            "stale air",
            "faint aroma of herbs",
            "dusty corners"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "guests enjoying their meals",
            "the setting sun visible through windows"
          ],
          "sounds": [
            "soft laughter and chatter",
            "the gentle strumming of a guitar",
            "the crackle of a fire"
          ],
          "smells": [
            "warm bread from the oven",
            "savory dishes being served",
            "fresh flowers on tables"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Dining Saloon of The Azure Crest is a feast for the senses, where the elegant decor meets the tantalizing aromas of well-prepared meals. Large windows frame the tumultuous sea, allowing the sound of crashing waves to mingle with the soft chatter of guests enjoying their meals. Tables are set with fine china and polished silverware, while flickering candlelight casts a warm glow over the atmosphere. Here, the scent of hearty stew and freshly baked bread fills the air, creating an inviting yet tense environment as conversations turn to the unsettling events surrounding them.",
        "During the morning, the dining area takes on a more somber mood, with misty views of the sea outside and rain pattering against the windows. Guests, sipping their coffee and nibbling on breakfast fare, exchange glances laden with concern. The sounds of clinking dishes and soft conversations provide a backdrop to the unease that lingers in the air, as the storm outside mirrors the tension within. Each meal becomes an exercise in caution, as whispers of intrigue and suspicion ripple through the gathering."
      ]
    },
    {
      "id": "guest_rooms",
      "name": "The Guest Rooms",
      "type": "interior",
      "purpose": "Private space for guests",
      "visualDetails": "Quaint rooms with vintage furnishings; views of the sea or garden.",
      "sensoryDetails": {
        "sights": [
          "vintage floral wallpaper",
          "quaint wooden furniture",
          "sea views from windows",
          "soft bed linens",
          "faded photographs on the walls"
        ],
        "sounds": [
          "the rustle of sheets",
          "distant waves crashing",
          "soft footsteps in the hallway",
          "the creak of old floorboards",
          "whispers from neighboring rooms"
        ],
        "smells": [
          "fresh linen",
          "faint scent of lavender",
          "mildew from the dampness",
          "dusty corners",
          "old books"
        ],
        "tactile": [
          "soft cotton sheets",
          "cool wooden furniture",
          "faded upholstery",
          "the chill of the sea breeze",
          "roughness of old floorboards"
        ]
      },
      "accessControl": "Access limited to guests assigned to each room; staff only enter for cleaning or emergencies.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "drops of water on window panes",
            "grey light filtering through curtains",
            "puddles forming outside"
          ],
          "sounds": [
            "steady rain against the glass",
            "soft murmurs from the hallway",
            "the rustling of sheets"
          ],
          "smells": [
            "damp fabric",
            "freshly brewed coffee from below",
            "mildew in corners"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows cast by clouds",
            "dimly lit corners",
            "faded colors of decor"
          ],
          "sounds": [
            "silence interrupted by distant conversations",
            "the creaking of the building",
            "occasional laughter from the lobby"
          ],
          "smells": [
            "musty air",
            "old wood",
            "faint scent of flowers from outside"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft glow of bedside lamps",
            "shadows lengthening across the room",
            "stars visible through the window"
          ],
          "sounds": [
            "the rustle of curtains in the breeze",
            "distant sounds of laughter",
            "the ticking of a clock"
          ],
          "smells": [
            "freshly laundered linens",
            "faint scent of tobacco",
            "the salty tang of the sea"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The guest rooms at The Azure Crest are a blend of quaint charm and unsettling atmosphere. Vintage floral wallpaper adorns the walls, while wooden furniture adds a touch of nostalgia. Each room offers a view, either of the crashing sea or the lush gardens, yet the serenity outside contrasts sharply with the tension within. The soft rustle of sheets and distant sounds of waves create a soothing backdrop, but whispers from neighboring rooms hint at the unease that hangs in the air. Here, guests find themselves cocooned, yet trapped by the weight of secrets.",
        "In the morning, the sound of steady rain against the glass pulls guests from their slumber, the grey light filtering through curtains casting a somber hue over the room. The smell of damp fabric lingers, mixing with the aroma of coffee wafting from below. Each creak of the old floorboards serves as a reminder of the history held within these walls. As guests prepare for the day, the atmosphere thickens with anticipation, as they wonder what lies ahead amidst the storm outside."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Quiet space for reading and reflection",
      "visualDetails": "Dark wood shelves filled with books; a large bay window offering sea views.",
      "sensoryDetails": {
        "sights": [
          "dark wooden shelves lined with books",
          "comfortable leather armchairs",
          "large bay window framing the sea",
          "faded rugs on the floor",
          "intricate moldings on the ceiling"
        ],
        "sounds": [
          "soft rustling of pages",
          "the distant crash of waves",
          "whispers of guests",
          "the ticking of a clock",
          "the creak of old furniture"
        ],
        "smells": [
          "musty scent of old books",
          "freshly polished wood",
          "a hint of salt from the sea",
          "faint aroma of tea",
          "dust motes in the air"
        ],
        "tactile": [
          "smooth leather of armchairs",
          "coolness of book spines",
          "softness of rugs underfoot",
          "the chill of the sea breeze",
          "roughness of aged pages"
        ]
      },
      "accessControl": "Access limited to guests with special permission; the door remains locked except during specific hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "rain-drops on the window",
            "shadows from the bookshelves"
          ],
          "sounds": [
            "steady rain pattering on the roof",
            "soft murmurs from the lobby",
            "the rustling of pages"
          ],
          "smells": [
            "damp paper",
            "freshly brewed tea",
            "the scent of wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "the glow of a single lamp",
            "dust motes swirling in the air"
          ],
          "sounds": [
            "silence broken by the ticking clock",
            "the low hum of the wind",
            "the creaking of old floorboards"
          ],
          "smells": [
            "dusty books",
            "faint aroma of tea",
            "the scent of polished wood"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft glow of lamps illuminating pages",
            "the last light of day fading",
            "shadows lengthening across the floor"
          ],
          "sounds": [
            "the crackle of a fire",
            "distant laughter from the dining area",
            "the rustle of pages turning"
          ],
          "smells": [
            "warm wood from the fireplace",
            "the scent of old paper",
            "freshly polished furniture"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library at The Azure Crest Hotel is a tranquil refuge, lined with dark wooden shelves filled to the brim with books, their spines worn and stories waiting to be uncovered. Comfortable leather armchairs invite guests to lose themselves in literature, while a large bay window provides a panoramic view of the tumultuous sea outside. The soft rustling of pages and distant sounds of crashing waves create an atmosphere ripe for reflection, yet a hint of tension lingers in the air, as guests may overhear whispers echoing from the hall.",
        "In the mornings, the library takes on a somber hue, with dim light filtering through the clouds outside. The steady patter of rain against the roof mixes with the scent of damp paper and freshly brewed tea, wrapping the room in an oppressive mood. Dust motes dance in the air, illuminated by the faint light, and the atmosphere thickens with an uneasy stillness. Here, amidst the stories of the past, the secrets of the present loom large, as guests seek solace in the pages while the storm rages beyond."
      ]
    }
  ],
  "note": "",
  "cost": 0.00258093,
  "durationMs": 32132
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1948,
    "month": "June",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "overcast with occasional rain",
      "cool breezes from the sea",
      "humidity rising in the afternoons"
    ],
    "daylight": "Long summer days with daylight extending to nearly ten o'clock at night, but the coastal fog can roll in unexpectedly.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests gather for cocktails in the dimly lit lounge",
    "holidays": [
      "Father's Day (June 20)"
    ],
    "seasonalActivities": [
      "beachcombing along the shore",
      "evening dances at the hotel ballroom",
      "seaside picnics with family"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "navy blue linen suit",
        "lightweight cotton dress shirt",
        "matching tie with geometric patterns"
      ],
      "casual": [
        "khaki shorts",
        "short-sleeve plaid shirt",
        "canvas slip-on shoes"
      ],
      "accessories": [
        "straw fedora",
        "leather belt with brass buckle",
        "sunglasses with round frames"
      ]
    },
    "womensWear": {
      "formal": [
        "floral tea-length dress with cap sleeves",
        "lightweight cardigan",
        "string of pearls"
      ],
      "casual": [
        "cotton sundress with a cinched waist",
        "bloomers with a matching blouse",
        "ballet flats"
      ],
      "accessories": [
        "wide-brimmed straw hat",
        "colorful silk scarf",
        "woven handbag"
      ]
    },
    "trendsOfTheMoment": [
      "bold floral prints",
      "mixing casual and formal wear",
      "emphasis on light fabrics for summer"
    ],
    "socialExpectations": [
      "men expected to wear hats outdoors",
      "women encouraged to embody femininity through dress",
      "social gatherings centered around family and community"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the Berlin Blockade continues, increasing tensions in Europe",
      "the first session of the United Nations General Assembly takes place",
      "the discovery of the polio vaccine generates excitement"
    ],
    "politicalClimate": "A climate of uncertainty as the Cold War begins to shape international relations, with many fearing communism.",
    "economicConditions": "Post-war recovery is underway, but rationing continues for many goods; the economy is slowly stabilizing.",
    "socialIssues": [
      "discussions around civil rights are gaining momentum",
      "gender roles are shifting as women continue to enter the workforce",
      "housing shortages in urban areas due to returning veterans"
    ],
    "internationalNews": [
      "the partition of India begins to take shape",
      "strikes in various industries as workers demand better conditions"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'Too-Ra-Loo-Ra-Loo-Ral'",
        "The Andrews Sisters' 'Rum and Coca-Cola'",
        "Nat King Cole's 'Nature Boy'"
      ],
      "films": [
        "'The Treasure of the Sierra Madre'",
        "'Key Largo'",
        "'The Red Shoes'"
      ],
      "theater": [
        "'Annie Get Your Gun'",
        "'South Pacific'",
        "'A Streetcar Named Desire'"
      ],
      "radio": [
        "'The Shadow'",
        "'The Jack Benny Program'",
        "'Suspense'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Naked and the Dead' by Norman Mailer",
        "'The Catcher in the Rye' by J.D. Salinger",
        "'A Streetcar Named Desire' by Tennessee Williams"
      ],
      "popularGenres": [
        "noir fiction",
        "post-war literature",
        "mystery and thriller"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "early computers like ENIAC",
        "development of jet propulsion technology"
      ],
      "commonDevices": [
        "standard radio sets",
        "black-and-white televisions",
        "film cameras"
      ],
      "emergingTrends": [
        "increased use of household appliances",
        "growing popularity of automobiles",
        "advancements in medical technology"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Coke: six pence",
        "Taxi ride across town: two shillings"
      ],
      "commonActivities": [
        "strolling along the boardwalk",
        "attending local fairs and summer festivals",
        "visiting the local cinema for the latest film"
      ],
      "socialRituals": [
        "tea time in the afternoon",
        "Sunday family dinners",
        "evening social gatherings at the hotel"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing middle class due to post-war prosperity",
      "increased awareness of social mobility"
    ],
    "gender": [
      "women are increasingly seen in professional roles",
      "traditional gender roles are being challenged"
    ],
    "race": [
      "racial segregation remains prevalent in many areas",
      "early activism begins to emerge for civil rights"
    ],
    "generalNorms": [
      "community and family are central to social life",
      "politeness and decorum expected in public behavior"
    ]
  },
  "atmosphericDetails": [
    "The salty breeze carries the scent of the ocean, mingling with the aroma of freshly prepared seafood from the hotel's kitchen.",
    "The sound of laughter and clinking glasses fills the air as guests mingle in the hotel's dimly lit lounge, their voices slightly muffled by the thick fog rolling in from the sea.",
    "The flickering light from vintage ceiling fans creates a warm, inviting glow, contrasting with the overcast sky outside, where rain occasionally patters against the windows."
  ],
  "paragraphs": [
    "In June 1948, the coastal air is thick with the scent of salt and the promise of summer. As the sun sets late, casting long shadows across the sandy beach, the seaside hotel buzzes with activity. Guests, dressed in the latest summer fashions, gather in the lounge, sharing stories of their travels while the persistent sound of waves crashing against the shore provides a constant backdrop. The atmosphere is charged with a mix of excitement and unease, as recent unsettling events in the area have left many on edge, their laughter tinged with nervousness.",
    "Fashion trends of the time reflect a society eager to revel in the joy of post-war life, with bold floral prints and lightweight fabrics dominating the scene. Men sport neatly pressed linen suits with stylish ties, while women grace the room in colorful tea-length dresses, their shoulders adorned with delicate cardigans. Accessories like straw hats and pearl necklaces complete their ensembles, creating a vibrant tableau that speaks to the era's optimistic spirit, even as shadows of the recent past linger in their minds.",
    "Daily life in June 1948 is marked by a sense of community, as families gather for tea in the afternoon and partake in seaside picnics. However, a tension simmers beneath the surface, with the impact of the Cold War beginning to shape attitudes and conversations. The sounds of a radio broadcasting the latest news from around the globe fill the hotel, while guests discuss the recent polio vaccine discovery with a mix of hope and apprehension. As the evening unfolds, the dance floor beckons, offering a brief escape from the realities of a world still grappling with the aftermath of conflict."
  ],
  "note": "",
  "cost": 0.0010657416,
  "durationMs": 21033
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "An unsettling series of events at a seaside hotel draws together guests and staff, all grappling with the societal upheaval of WWII and the emerging Cold War, as tensions rise over a mysterious poisoning incident.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The war has shifted class dynamics, with women entering the workforce and social pressures mounting as fear of espionage and betrayal permeate everyday life."
  },
  "setting": {
    "location": "a large seaside hotel with a view of the ocean",
    "institution": "seaside hotel",
    "weather": "overcast with occasional rain"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a delayed-action poison method, where the toxicology and dosage timing conceal when the fatal dose was actually administered."
}

### LOCKED_FACTS
[
  {
    "id": "time_of_death",
    "value": "half past nine at night",
    "description": "the victim's death occurred exactly thirty minutes after consuming the drink"
  },
  {
    "id": "siphon_capacity",
    "value": "two ounces",
    "description": "the amount of poison infused into the drink over the duration"
  },
  {
    "id": "refill_frequency",
    "value": "every fifteen minutes",
    "description": "the time interval at which the victim was served refills"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 15,
  "countsByPlacement": {
    "early": 5,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 14,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "testimonial"
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
      "category": "testimonial"
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
      "category": "behavioral"
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
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_hugo_vane",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
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
