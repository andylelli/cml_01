# Actual Prompt Record

- Run ID: `mystery-1779021837311`
- Project ID: ``
- Timestamp: `2026-05-17T12:46:26.576Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `50d8ef59b15721f6`

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
    "title": "The Clockwork Conspiracy",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Manor house"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "thematic murder"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "Dr. Mallory Finch: associate",
        "Captain Ivor Hale: distant relative",
        "Beatrice Quill: friend"
      ],
      "public_persona": "Wealthy heiress, vibrant and charming",
      "private_secret": "Strained relationships with family over inheritance",
      "motive_seed": "Inheritance disputes",
      "motive_strength": "moderate",
      "alibi_window": "11:00 to 11:20",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "study",
        "library"
      ],
      "behavioral_tells": [
        "frequent arguments with family"
      ],
      "stakes": "High due to inheritance",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "doctor",
      "relationships": [
        "Eleanor Voss: associate",
        "Beatrice Quill: friend"
      ],
      "public_persona": "Reputable physician",
      "private_secret": "Unsatisfied with his career, resents wealthy patients",
      "motive_seed": "Desire for wealth",
      "motive_strength": "moderate",
      "alibi_window": "10:30 to 11:10",
      "access_plausibility": "high",
      "opportunity_channels": [
        "study",
        "dining room"
      ],
      "behavioral_tells": [
        "nervous under pressure"
      ],
      "stakes": "Financial stability",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "relative",
      "relationships": [
        "Eleanor Voss: distant cousin"
      ],
      "public_persona": "Charming war veteran",
      "private_secret": "Struggling financially due to war debts",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "11:00 to 11:20",
      "access_plausibility": "high",
      "opportunity_channels": [
        "garden",
        "study"
      ],
      "behavioral_tells": [
        "avoids direct confrontation"
      ],
      "stakes": "High due to debts",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "Eleanor Voss: close friend",
        "Dr. Mallory Finch: acquaintance"
      ],
      "public_persona": "Intelligent and observant",
      "private_secret": "Unrequited love for a wealthy man",
      "motive_seed": "Protect Eleanor",
      "motive_strength": "low",
      "alibi_window": "11:00 to 11:20",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "library",
        "study"
      ],
      "behavioral_tells": [
        "sharp attention to detail"
      ],
      "stakes": "Friendship and reputation",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
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
      "summary": "When Eleanor Voss is found dead in her study, the clock shows ten minutes past eleven, leading to a web of deception surrounding her death. Beatrice Quill must unravel the truth as motives and alibis collide in the oppressive atmosphere of a country estate."
    },
    "accepted_facts": [
      "Eleanor Voss died in her study.",
      "The clock in the study showed ten minutes past eleven at the time of discovery.",
      "Witnesses noted Eleanor was to meet someone at a different time."
    ],
    "inferred_conclusions": [
      "The clock may have been tampered with to mislead the investigation."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, study, and minut to expose the false timing.",
      "delivery_path": [
        {
          "step": "Dr. Mallory Finch entered the study to adjust the clock before the murder."
        }
      ]
    },
    "outcome": {
      "result": "The time of death is misrepresented, framing the investigation."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss's death must have occurred at the time the clock indicated.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock is a reliable indicator of time, and no one questioned its accuracy.",
    "what_it_hides": "The actual time of death was much earlier, allowing the murderer to establish an alibi."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The scheduled meeting time for Eleanor's guests.",
        "The time noted on the clock at discovery."
      ],
      "windows": [
        "Alibi windows for all suspects.",
        "Time discrepancy between the clock and witness statements."
      ],
      "contradictions": [
        "Witnesses claim Eleanor was alive at the time of the meeting, but the clock shows otherwise."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The study clock",
        "Eleanor's diary"
      ],
      "permissions": [
        "Access to the study during the time of murder."
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be tampered with.",
        "Human perception of time can be unreliable."
      ],
      "traces": [
        "Fingerprints on the clock's mechanism.",
        "Discrepancies in witness timing."
      ]
    },
    "social": {
      "trust_channels": [
        "Family loyalty among heirs.",
        "Professional trust in Dr. Finch's authority."
      ],
      "authority_sources": [
        "Dr. Finch as Eleanor's physician."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows ten minutes past eleven.",
        "correction": "Eleanor's death must have occurred before this time based on witness reports.",
        "effect": "Narrows the time of death to before ten minutes past eleven.",
        "required_evidence": [
          "Witnesses noted Eleanor was to meet someone at a different time.",
          "The clock showed ten minutes past eleven."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Finch's alibi states he was in the dining room at ten minutes past eleven.",
        "correction": "His presence in the dining room does not align with the time of death given by the clock.",
        "effect": "Eliminates Dr. Finch as a credible alibi witness.",
        "required_evidence": [
          "Dr. Finch's alibi states he was in the dining room.",
          "Witness statements about Eleanor's last known time."
        ],
        "reader_observable": true
      },
      {
        "observation": "A note found in Eleanor's belongings indicates she was to meet Dr. Finch at a different time.",
        "correction": "This means the clock time must be incorrect to align with this meeting.",
        "effect": "Narrows the investigation to clock tampering.",
        "required_evidence": [
          "The note shows Eleanor was to meet Dr. Finch at a different time.",
          "Witness reports confirm Eleanor's schedule."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, study, and minut against the claimed timeline.",
    "knowledge_revealed": "Dr. Finch's clock manipulation is the only way to explain the false alibi.",
    "pass_condition": "The timing of the clock must not match the timing of Dr. Finch's pocket watch.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's indicated time of death (early) and witness's meeting time (mid) allow the reader to establish the timeline. Step 2: Dr. Finch's alibi (mid) contradicts the clock's time of death. Step 3: The note about Eleanor's meeting time identifies the clock tampering as the pivotal evidence."
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
      "test_type": "comparison of clock mechanisms"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed deceased.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Found in Eleanor's belongings"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Observed during the test"
      },
      {
        "clue_id": "clue_4",
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
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is the formidable matriarch of the Voss estate, a woman accustomed to control and respect, yet secretly wrestling with her own desires.",
    "publicPersona": "Dignified and commanding, Eleanor is seen as the backbone of the Voss family, effortlessly maintaining the estate's status.",
    "privateSecret": "She is hiding a secret affair with a younger local man, which could jeopardize her legacy.",
    "motiveSeed": "Eleanor fears losing control of the estate to her rebellious daughter, which intensifies her desire to protect her family's status.",
    "motiveStrength": "strong",
    "alibiWindow": "was seen in the garden from eight until ten, but no one can verify her exact whereabouts during the crime.",
    "accessPlausibility": "possible",
    "stakes": "She stands to lose her control over the estate and her family's reputation.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured tone, often employing formal vocabulary, but occasionally slips into sharp, cutting remarks when provoked. She has a habit of raising an eyebrow when she disapproves.",
    "internalConflict": "Eleanor grapples with the guilt of her infidelity and the fear that her daughter's defiance could unravel the life she has meticulously crafted.",
    "personalStakeInCase": "This crime matters to Eleanor not only because it threatens her estate but also because it forces her to confront the choices that have led her to this precarious position.",
    "paragraphs": [
      "Eleanor Voss stood in the garden, her hands clasped tightly around the wrought iron fence, a silent sentinel of her family's legacy. The morning light filtered through the leaves, casting patterns on the ground that reminded her of the fleeting nature of time. She had spent decades building the Voss estate into a symbol of respectability, only to feel the foundations shake beneath her feet. The whispers of her daughter’s rebellious spirit echoed in her mind, a constant reminder of the potential chaos that could ensue, should Eleanor lose her grip on the reins.",
      "The affair with the younger local man was a folly, a brief escape from the suffocating expectations of her role. Yet, as thrilling as it was, the risk of exposure loomed like a dark cloud. Eleanor had always been the one to control the narrative, to dictate the terms of propriety within her family. Now, with the specter of scandal threatening her carefully curated image, she felt the walls closing in. The tension between her desires and her responsibilities gnawed at her insides, leaving her with a sense of dread she could hardly bear.",
      "When the news of the murder reached her, Eleanor's heart raced—not simply out of fear for her family's safety but for the implications it held. The victim was a man whose presence could disrupt her carefully laid plans, one who had the potential to reveal her secret. She had been seen in the garden, yes, but the hours during the crime were unaccounted for, and the thought of being implicated sent chills down her spine. The stakes were higher than ever, and Eleanor knew she must act quickly to protect her legacy.",
      "In her mind, Eleanor began to plot her course of action, weighing her options with the precision of a chess master. She would need to confront her daughter, to remind her of the stakes involved in their family’s reputation. But how could she do so while also hiding her own transgressions? The duality of her life felt unbearable, and yet, she was determined to emerge from this chaos unscathed. As she surveyed the garden, she steeled herself for the battles ahead, both within her family and within her own heart."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a compassionate local physician whose earnest demeanor hides a web of financial desperation and moral dilemmas.",
    "publicPersona": "Respected and earnest, Dr. Finch is seen as a compassionate healer with a strong sense of duty.",
    "privateSecret": "Dr. Finch is deeply in debt due to a failed investment and is relying on a sizable inheritance to cover it.",
    "motiveSeed": "Mallory would inherit a significant amount from the victim, should they pass away unexpectedly.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed to be in his office attending patients, but records are incomplete.",
    "accessPlausibility": "easy",
    "stakes": "Losing financial stability would mean losing his practice and reputation.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory’s speech is marked by a gentle cadence, often punctuated by thoughtful pauses. He employs medical jargon when necessary but is quick to soften his language to make his patients feel at ease.",
    "internalConflict": "Mallory struggles with the knowledge that his financial troubles could lead him to make decisions that compromise his integrity as a physician.",
    "personalStakeInCase": "The murder directly impacts Mallory's financial future, forcing him to confront the lengths to which he might go to secure his inheritance.",
    "paragraphs": [
      "Dr. Mallory Finch was a man of the utmost respectability, or at least that was the facade he presented to the world. In the small town of Little Middleton, he was regarded as a healer, a trusted confidant, and a man of duty. Yet beneath that polished exterior lay a tumult of anxiety and desperation. His financial situation had spiraled out of control due to a disastrous investment in a failing medical practice. He had been counting on a sizable inheritance from a wealthy patient, but now, with the murder casting a pall over the estate, he felt the ground shift beneath him.",
      "Mallory's alibi was shaky at best; he had claimed to be in his office attending to patients, but the records were incomplete, leaving enough room for doubt. He had always prided himself on his honesty, but the thought of losing his practice—and the respect that came with it—sent him into a tailspin. The stakes were higher than ever, and with the victim’s untimely demise, he found himself contemplating a moral abyss. Would he be willing to cross a line he had always deemed uncrossable if it meant securing his future?",
      "His interactions with the townsfolk were often laced with dry humor, a coping mechanism for the weight he bore. 'Ah, another day, another ailment,' he would quip, though internally he wrestled with the knowledge that his financial troubles could lead him to consider unthinkable actions. The very thought of it made his stomach churn, yet desperation has a way of dulling one’s moral compass. He felt like a man walking a tightrope, precariously balancing between his ethical obligations and the gnawing need to survive.",
      "As the investigation unfolded, Mallory knew he had to tread carefully. He could not afford to draw suspicion—his life depended on it. The thought of being implicated in the murder was a nightmare he could hardly bear. With each passing moment, the pressure mounted, and he found himself questioning not just his actions, but the man he aspired to be. The case had become more than a professional obligation; it was a test of his character, one that would ultimately reveal whether he could rise above his fears or succumb to them."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired military officer whose stoic exterior masks a troubled past and a desperate need for redemption.",
    "publicPersona": "Ivor is seen as a stoic figure with a strong sense of honor, respected among the estate's gentry.",
    "privateSecret": "He is haunted by a war crime he committed and has been trying to atone for it.",
    "motiveSeed": "Ivor's past mistakes have made him desperate to secure an honorable legacy, which he fears the victim may threaten.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be inspecting the grounds but has no witnesses.",
    "accessPlausibility": "possible",
    "stakes": "He risks losing his reputation and the chance to amend his past.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks in a measured, deliberate manner, often punctuating his statements with a slight chuckle, as if to deflect the weight of his words. He tends to avoid eye contact when discussing his past.",
    "internalConflict": "Ivor is tormented by guilt over his past actions, grappling with the need to be seen as honorable while reconciling his history.",
    "personalStakeInCase": "The murder threatens to unravel the facade of respectability he has built, forcing him to confront his past mistakes and their implications for his future.",
    "paragraphs": [
      "Captain Ivor Hale had always been a figure of stoicism, his presence commanding respect among the estate's gentry. Yet beneath that polished exterior lay a man tormented by the shadows of his past. He had fought valiantly in the war, but the memories of a crime committed in the heat of battle haunted him relentlessly. As he surveyed the estate grounds, he felt the weight of his misdeeds pressing down on him, a constant reminder of the man he had once been—and the honor he had lost.",
      "The murder of the victim struck a nerve, for Ivor feared that it could expose the very flaws he had worked so hard to conceal. He had claimed to be inspecting the grounds at the time of the incident, but with no witnesses to corroborate his story, he felt the specter of suspicion creeping closer. The stakes were high; losing the respect he had fought to regain would mean losing himself. He often made light of his situation with self-deprecating humor, chuckling softly at his own shortcomings, but deep down, he understood the gravity of the situation.",
      "Ivor's demeanor was often a mask, a way to shield himself from the judgment of others. He would often joke, 'Ah, the honor of a soldier—so easily lost, yet so hard to regain,' but the truth was that he feared what the truth of the murder could mean for his legacy. The victim could threaten everything he had worked to build, and the thought of being implicated in such a scandal left him feeling hollow.",
      "As the investigation unfolded, Ivor found himself at a crossroads. Could he confront his past and seek redemption, or would he allow the specter of his mistakes to dictate his future? The choice weighed heavily on him, and with each passing moment, the line between honor and disgrace blurred further. In the quiet moments, when the world felt still, he knew that the truth would eventually surface, and he would have to face the consequences of his actions—both past and present."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a spirited young heiress whose rebellious nature conflicts with her family's conservative values, setting the stage for a dramatic reckoning.",
    "publicPersona": "Beatrice is viewed as a free spirit, often pushing against her family's conservative values.",
    "privateSecret": "She is secretly engaged to a man of lower social standing, which her family would vehemently oppose.",
    "motiveSeed": "Beatrice stands to inherit the bulk of the estate, and her father's death would remove obstacles to her marriage.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be attending a charity brunch in town, but timings are suspect.",
    "accessPlausibility": "unlikely",
    "stakes": "She risks losing her chance for love and independence if her family remains intact.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a lively cadence, often punctuating her thoughts with sharp wit. She has a tendency to use sarcasm and irony, especially when discussing her family's expectations.",
    "internalConflict": "Beatrice is torn between her desire for independence and her love for her family, feeling the weight of societal expectations pressing down on her.",
    "personalStakeInCase": "The murder case directly impacts her future happiness, forcing her to confront the lengths to which she would go for love and freedom.",
    "paragraphs": [
      "Beatrice Quill was known throughout Little Middleton as the spirited heiress who dared to defy the conventions of her family. With fiery hair and an even fiercer attitude, she often found herself at odds with her family's conservative values. 'Why wear a corset when you can breathe freely?' she would quip, her sardonic wit leaving a trail of raised eyebrows in her wake. Yet, beneath that rebellious exterior lay a young woman grappling with the weight of expectations—a duality that often left her feeling trapped in a gilded cage.",
      "Beneath the surface of her carefree demeanor, Beatrice harbored a secret engagement to a man of lower social standing, a union her family would never accept. The thought of her father's death, while morbid, also sparked a flicker of hope; if he were to pass, the obstacles to her marriage would vanish, and she could finally pursue the life she longed for. Yet, the murder cast a long shadow over her plans, and as she claimed to be attending a charity brunch in town, she couldn't shake the feeling that her alibi was as flimsy as her father's expectations of her.",
      "Beatrice's sardonic humor often masked her internal conflict, a way to deflect the uncomfortable reality of her situation. 'Ah, the joys of being an heiress—who knew it came with so many strings attached?' she would jest, but the truth was that each quip hid a deeper longing for autonomy. The stakes had never been higher; if her family remained intact, she risked losing her chance for love and independence, a fate she could not abide.",
      "As the investigation deepened, Beatrice felt the noose tightening. She had to navigate the treacherous waters of family loyalty and personal desire, all while maintaining the façade of innocence. Each day brought new challenges, and the murder case served as a catalyst for change—a chance for her to either break free from her family's grasp or become ensnared in their expectations forever. In her heart, she knew that the truth would reveal not just the murderer, but also her own path forward, and she was determined to find it."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Middleton Manor",
    "type": "Manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling estate shrouded in mystery and social tension, where secrets lie hidden among the opulent rooms and expansive grounds.",
    "visualDescription": "The manor boasts a grand facade of weathered stone, with ivy creeping up its walls. Gabled roofs and tall chimneys pierce the gloomy sky, while a series of interconnected wings create a labyrinthine interior. The manicured gardens, though beautiful, harbor dark corners and dense hedges that obscure sightlines.",
    "atmosphere": "A tense, foreboding air hangs over the estate, with whispers of discontent and unease echoing through its halls.",
    "paragraphs": [
      "Middleton Manor stands as a testament to a bygone era, its stone walls heavy with the weight of history and secrets. The grand entrance, flanked by weathered statues, opens to an expansive foyer where the echoes of laughter seem to linger, muted by the oppressive atmosphere. The scent of damp earth and mildew clings to the air, a reminder of the recent rains that have left the grounds glistening but treacherous. Inside, the corridors twist like a maze, with heavy oak doors leading to rooms where the past and present collide.",
      "As the sun struggles to break through the thick cloud cover, the gardens outside appear as a canvas of muted greens and browns, punctuated by the vibrant colors of late-blooming flowers. The sound of rain pattering against the leaded glass windows creates a rhythmic backdrop, mingling with the occasional creak of the manor's aged timbers. Here, the tension of the outside world seems to seep into the very fabric of the house, where the affluent facade masks a brewing discontent among its inhabitants.",
      "The isolation of Middleton Manor enhances its enigmatic allure; several miles from the nearest town, the estate feels like a world unto itself. Staff and guests alike navigate a delicate social hierarchy, with certain rooms deemed off-limits, their secrets tantalizingly out of reach. The drawing room, with its plush furnishings and dim lighting, offers a deceptive comfort, while the library, lined with dusty tomes, invites hushed whispers and furtive glances. Each corner of the manor holds the potential for discovery, yet also for danger, as the clock ticks down on the unfolding conspiracy."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "overcast with intermittent rain, typical for the season",
    "timeFlow": "Three days of mounting tension and suspicion",
    "mood": "tense due to recent social unrest and economic hardship",
    "eraMarkers": [
      "Domestic wiring with frequent outages",
      "Petrol touring cars on narrow county roads",
      "Early telephones with party-line exchanges"
    ],
    "sensoryPalette": {
      "dominant": "Damp earth and decaying wood",
      "secondary": [
        "Candle wax and tallow",
        "Muffled conversation and creaking wood"
      ]
    },
    "paragraphs": [
      "As the rain drizzles steadily, the air is thick with the scents of damp earth and decaying leaves, mixing with the faint aroma of beeswax from the candles flickering in the dimly lit hallways. The sound of water dripping from eaves creates a haunting melody, underscoring the manor's solitude. Shadows dance along the walls, accentuating the sense of isolation that permeates the estate, where every creak of the floorboards seems to echo a warning.",
      "Inside, the atmosphere grows heavier with each passing hour, as the weight of recent social unrest looms over the residents like a storm cloud. The tension is palpable, with furtive glances exchanged in the drawing room, where plush upholstery and ornate decor hide the unease beneath. Outside, the gardens, meticulously kept yet eerily silent, seem to hold their breath, waiting for the inevitable confrontation that the estate's secrets will bring."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Dimly lit with tall, shadowy shelves; a large oak table strewn with papers.",
      "sensoryDetails": {
        "sights": [
          "Dust motes drifting in candlelight",
          "Leather-bound books lining the shelves"
        ],
        "sounds": [
          "Pages turning in the silence",
          "A clock ticking in the corner"
        ],
        "smells": [
          "Old leather and musty pages",
          "Beeswax candles melting"
        ],
        "tactile": [
          "Worn oak surface of the table",
          "Cool draft from the window"
        ]
      },
      "accessControl": "Locked after dinner; only family and select guests allowed access.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops sliding down the window panes",
            "Grey light filtering through clouds"
          ],
          "sounds": [
            "Steady patter of rain on the roof",
            "Distant thunder rumbling"
          ],
          "smells": [
            "Damp wood and mildew",
            "Faint aroma of wet earth"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat, muted light filling the room",
            "Shadows lurking in corners"
          ],
          "sounds": [
            "Silence broken by the rustle of paper",
            "The distant creak of the house settling"
          ],
          "smells": [
            "Dust and aged paper",
            "Hints of tobacco smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickering against dark wood",
            "Long shadows stretching across the floor"
          ],
          "sounds": [
            "The soft ticking of a clock",
            "Muffled voices from the drawing room"
          ],
          "smells": [
            "Candle wax and old books",
            "Faint scent of pipe tobacco"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, with its towering shelves packed with tomes, exudes an air of quiet contemplation, yet it is here that the tensions of the manor come to a head. The dim light casts long shadows, creating an atmosphere ripe for secrets and revelations. A large oak table, covered in scattered papers and an overturned chair, hints at a struggle, while the scent of old leather and musty pages fills the air, suggesting years of hidden knowledge and unspoken truths.",
        "As the rain pours outside, the library becomes a sanctuary of sorts, yet the oppressive silence is broken only by the distant echoes of conversation from the drawing room. The clock ticks steadily, each second amplifying the sense of urgency. Here, among the whispers of the past, lies the key to unraveling the clockwork conspiracy that threatens to unfold."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Richly decorated with heavy drapes and ornate furnishings; a grand piano sits in the corner.",
      "sensoryDetails": {
        "sights": [
          "Glistening chandelier casting soft light",
          "Plush sofas arranged around a central table"
        ],
        "sounds": [
          "Muffled laughter and conversation",
          "The soft plucking of piano strings"
        ],
        "smells": [
          "Wood polish and fresh flowers",
          "Hints of cigar smoke"
        ],
        "tactile": [
          "Silk upholstery of the armchairs",
          "Cool marble of the fireplace mantle"
        ]
      },
      "accessControl": "Open to family and invited guests; staff may only enter with permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Drapes drawn tight against the light",
            "Raindrops pattering against the window"
          ],
          "sounds": [
            "Soft murmurs of conversation",
            "The creak of furniture as people shift"
          ],
          "smells": [
            "Freshly brewed coffee",
            "Wet wool from coats hung to dry"
          ],
          "mood": "intimate gathering"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Dull light filtering through heavy drapes",
            "Flickering candle flames on the table"
          ],
          "sounds": [
            "The rustle of newspapers",
            "Occasional laughter breaking the silence"
          ],
          "smells": [
            "Dust and faint perfume",
            "Woodsmoke from the fireplace"
          ],
          "mood": "tense conversation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Warm glow of lamps illuminating the room",
            "Reflections in polished surfaces"
          ],
          "sounds": [
            "Laughter echoing off the walls",
            "The soft notes of piano music"
          ],
          "smells": [
            "Rich tobacco and leather",
            "Hints of evening meals wafting from the kitchen"
          ],
          "mood": "relaxed yet watchful"
        }
      ],
      "paragraphs": [
        "The drawing room serves as the heart of Middleton Manor, where guests gather beneath the opulence of a shimmering chandelier. The atmosphere is a blend of elegance and tension, with deep armchairs inviting conversation while also concealing unspoken thoughts. As laughter mingles with the sound of piano keys, the air is thick with the scent of polished wood and fresh flowers, yet an undercurrent of anxiety runs through the gathering, where every glance may reveal more than intended.",
        "In the afternoons, the light dims, casting an overcast gloom that amplifies the whispers of discontent. The drawing room becomes a stage for social maneuvering, where the privileged exchange pleasantries while their minds churn with worries of the world outside. Here, the lines of class and privilege blur, and the room's very walls seem to listen, holding the secrets of those who dare to speak of the clockwork conspiracy brewing beneath the surface."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Staff gathering space",
      "visualDetails": "Functional and modest, with a long wooden table and simple chairs; a small hearth provides warmth.",
      "sensoryDetails": {
        "sights": [
          "Faded wallpaper peeling at the corners",
          "Cast-iron stove with a faint glow"
        ],
        "sounds": [
          "Clinking of dishes and muted chatter",
          "The crackle of the fire"
        ],
        "smells": [
          "Baking bread and stewing meat",
          "Lingering scents of soap and polish"
        ],
        "tactile": [
          "Worn wooden table surface",
          "Cool stone floor underfoot"
        ]
      },
      "accessControl": "Restricted to staff; only family may enter when invited.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Dull light filtering through small windows",
            "Raindrops streaking the glass"
          ],
          "sounds": [
            "Soft patter of rain on the roof",
            "The hum of conversation among staff"
          ],
          "smells": [
            "Freshly baked bread",
            "Wet earth from the garden"
          ],
          "mood": "busy and industrious"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Shadows creeping across the room",
            "Flickering candle flames on the table"
          ],
          "sounds": [
            "The clatter of utensils",
            "Occasional laughter breaking the monotony"
          ],
          "smells": [
            "Stewing meat and vegetables",
            "A hint of dust in the air"
          ],
          "mood": "tense camaraderie"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Warm glow from the hearth",
            "The table set for dinner"
          ],
          "sounds": [
            "Chairs scraping against the floor",
            "The distant chatter of guests"
          ],
          "smells": [
            "Rich aromas of the evening meal",
            "Wood smoke from the fire"
          ],
          "mood": "anticipatory"
        }
      ],
      "paragraphs": [
        "The servants' hall is a stark contrast to the opulence of the drawing room, its modest furnishings reflecting the lives of those who maintain the grandeur of Middleton Manor. The long wooden table, worn smooth by years of use, is the heart of the hall, where staff gather to share meals and gossip. The smell of baking bread wafts through the air, mingling with the warmth of the hearth, creating an atmosphere of industriousness amidst the looming tension of class disparity.",
        "As the rain patters outside, the hall buzzes with the sounds of muted chatter and clinking dishes, a brief respite from the weight of the manor's secrets. Yet, the laughter is tinged with anxiety, as whispers of unrest reach the ears of the staff, their awareness of the estate's inner workings placing them in a precarious position. Here, among the simple comforts, the clockwork conspiracy begins to take shape, with every conversation holding the potential for revelation."
      ]
    },
    {
      "id": "gardens",
      "name": "The Gardens",
      "type": "exterior",
      "purpose": "Outdoor refuge and meeting point",
      "visualDetails": "Lush greenery with winding paths and hidden alcoves; a fountain at the center.",
      "sensoryDetails": {
        "sights": [
          "Vibrant flowerbeds bursting with color",
          "Tall hedges creating secluded spots"
        ],
        "sounds": [
          "Birdsong mingling with rustling leaves",
          "The gentle trickle of water from the fountain"
        ],
        "smells": [
          "Freshly cut grass and blooming flowers",
          "Earthy aroma after rain"
        ],
        "tactile": [
          "Soft petals brushing against fingers",
          "Cool stone of the fountain edge"
        ]
      },
      "accessControl": "Open to all, but certain areas are restricted for private meetings.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Puddles forming on stone paths",
            "Bright flowers glistening with raindrops"
          ],
          "sounds": [
            "Raindrops falling on leaves",
            "Birds chirping in the wet air"
          ],
          "smells": [
            "Damp earth and fresh blooms",
            "Faint scent of wet foliage"
          ],
          "mood": "refreshing yet somber"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Muted colors in the garden",
            "Soft shadows cast by dense foliage"
          ],
          "sounds": [
            "The rustle of leaves in the breeze",
            "Distant thunder rumbling"
          ],
          "smells": [
            "Wet grass and fading flowers",
            "Hints of decaying leaves"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Golden light bathing the garden",
            "Fireflies flickering in the twilight"
          ],
          "sounds": [
            "Crickets chirping as night falls",
            "The soft splash of water from the fountain"
          ],
          "smells": [
            "Sweet scent of night-blooming flowers",
            "Cool evening air"
          ],
          "mood": "romantic intrigue"
        }
      ],
      "paragraphs": [
        "The gardens surrounding Middleton Manor are a tapestry of color and life, yet they hold an unsettling charm. Winding paths lead through vibrant flowerbeds, while tall hedges provide both beauty and concealment. At the center, a fountain trickles softly, its gentle sound a stark contrast to the tension brewing within the manor's walls. Here, the scent of freshly cut grass mingles with the earthy aroma of damp soil, creating an inviting yet deceptive atmosphere.",
        "In the mornings, rain brings a refreshing clarity to the garden, as droplets cling to petals and leaves, enhancing the colors of the blooms. Yet, the solitude of the space can quickly turn somber, as whispers of conspiracy echo in the shadows of the hedges. As evening descends, the garden transforms into a realm of intrigue, where the fading light casts long shadows, and the air is thick with the potential for secrets shared under the stars."
      ]
    }
  ],
  "note": "",
  "cost": 0.0022038274499999997,
  "durationMs": 23106
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1932,
    "month": "October",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": [
      "overcast skies",
      "intermittent rain showers",
      "chilly winds"
    ],
    "daylight": "Days are short, with daylight fading by five o'clock in the afternoon, leaving the evenings dark and dreary.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, when a thick fog begins to creep in.",
    "holidays": [
      "Halloween on October 31st"
    ],
    "seasonalActivities": [
      "apple picking at local orchards",
      "attending harvest festivals",
      "preparing for Halloween with decorations and parties"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored dark wool suit",
        "crisp white dress shirt",
        "silk tie in muted colors"
      ],
      "casual": [
        "tweed jacket",
        "knitted vest",
        "corduroy trousers"
      ],
      "accessories": [
        "felt fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "long-sleeved evening gown with a drop waist",
        "beaded clutch purse",
        "fur stole"
      ],
      "casual": [
        "knitted cardigan",
        "tea-length dress with floral prints",
        "ankle boots"
      ],
      "accessories": [
        "cloche hat adorned with ribbons",
        "string of pearls",
        "silk scarf"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco motifs in clothing and home decor",
      "the popularity of bobbed hairstyles for women",
      "the rise of modernist literature"
    ],
    "socialExpectations": [
      "men are expected to be in suits for formal events",
      "women are encouraged to wear hats in public",
      "class distinctions are pronounced in social settings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The United States is facing severe economic downturns with unemployment rates soaring",
      "Political unrest in Europe as fascist movements gain traction",
      "The British government faces challenges managing the economic crisis and public discontent"
    ],
    "politicalClimate": "A tense political atmosphere prevails, with fears of economic instability fueling both left and right-wing movements.",
    "economicConditions": "The Great Depression has left many families struggling, leading to heightened class tensions and social unrest.",
    "socialIssues": [
      "high unemployment",
      "rising prices of basic goods",
      "increasing class division"
    ],
    "internationalNews": [
      "The rise of Hitler in Germany creates anxiety across Europe",
      "The League of Nations struggles to maintain peace amidst rising militarism"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "George Gershwin's 'Rhapsody in Blue'",
        "Bing Crosby's recordings",
        "Duke Ellington's jazz orchestra"
      ],
      "films": [
        "'Scarface' directed by Howard Hawks",
        "'The Most Dangerous Game'",
        "'Grand Hotel'"
      ],
      "theater": [
        "'Of Mice and Men' by John Steinbeck",
        "'The Royal Family' by George S. Kaufman"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "The Lone Ranger"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Cathedral' by T.S. Eliot",
        "'Brave New World' by Aldous Huxley",
        "'Tobacco Road' by Erskine Caldwell"
      ],
      "popularGenres": [
        "mystery fiction",
        "social realism",
        "modernist literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first practical radio broadcast",
        "the introduction of the electric washing machine",
        "early versions of the home refrigerator"
      ],
      "commonDevices": [
        "typewriters in offices",
        "electric lights in homes",
        "telephones with rotary dials"
      ],
      "emergingTrends": [
        "the phonograph gaining popularity",
        "the rise of film as a mass entertainment medium",
        "wireless communication in homes"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A gallon of milk: one shilling",
        "A newspaper: three pence"
      ],
      "commonActivities": [
        "gathering for community events",
        "visiting local markets",
        "hosting and attending tea parties"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "Saturday night dances at local halls"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased awareness of class disparities",
      "a sense of entitlement among the wealthy",
      "sympathy for the working class"
    ],
    "gender": [
      "women are increasingly entering the workforce",
      "traditional gender roles are being challenged",
      "expectations for women to maintain domestic duties"
    ],
    "race": [
      "racial tensions are evident, particularly in urban areas",
      "increased awareness of civil rights issues"
    ],
    "generalNorms": [
      "a conservative approach to social behavior",
      "politeness and decorum are highly valued",
      "engagement in community service is encouraged"
    ]
  },
  "atmosphericDetails": [
    "The damp chill of the October air seeps into the manor, bringing with it the scent of wet leaves and woodsmoke.",
    "The flickering of candlelight dances upon the walls, casting eerie shadows that seem to whisper secrets of the past.",
    "A distant clock chimes, its sound echoing through the empty halls, marking the passage of time in a world that feels increasingly uncertain."
  ],
  "paragraphs": [
    "In October 1932, the atmosphere is thick with the weight of uncertainty as the Great Depression continues to tighten its grip on the nation. The leaves have turned a crisp brown, and the overcast skies cast a somber shadow over the manor house, where the flickering light of the fireplace struggles against the encroaching cold. Intermittent rain showers patter against the windows, creating a rhythm that echoes the nervous tension within the household. The community outside is rife with unrest, as families grapple with unemployment and despair, making the upcoming Halloween festivities feel almost hollow this year.",
    "Fashion reflects the tumultuous times, with men donning tailored dark wool suits and women opting for elegant evening gowns with drop waists, often adorned with fur stoles for warmth. Accessories such as felt fedoras and cloche hats are popular, signifying a blend of practicality and style amid economic hardship. Social events, once lavish gatherings, now reflect a more subdued elegance, where evenings are spent in dimly lit rooms discussing the latest political developments and the rising threat of fascism in Europe.",
    "Daily life revolves around community and resilience; families gather for Sunday dinners, and locals frequent markets, where the price of essential goods has escalated, yet the spirit of cooperation remains unbroken. The sound of jazz can be heard drifting from nearby homes, where radios bring a semblance of normalcy amidst the chaos. As the evenings grow longer, the manor's inhabitants might find solace in the pages of a mystery novel or the thrill of a shadowy radio drama, trying to escape the reality of their circumstances, if only for a moment."
  ],
  "note": "",
  "cost": 0.0010498388999999999,
  "durationMs": 12141
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the manor for a delayed inheritance discussion places the heirs and their associates under scrutiny, as economic strain and class tensions intensify in the shadow of rising political unrest.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class divides, with the wealthy navigating their privileges amidst a backdrop of social unrest and the threat of fascism."
  },
  "setting": {
    "location": "An expansive country estate featuring a grand main house with interconnected wings, surrounded by manicured gardens and dense woodlands.",
    "institution": "Manor house",
    "weather": "overcast with intermittent rain, typical for the season"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "Golden Age country-house murder driven by a mechanical clock-tampering method."
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
    "id": "scheduled_meeting_time",
    "value": "twenty minutes past ten",
    "description": "The time noted for the victim's meeting"
  },
  {
    "id": "guest_count",
    "value": "six",
    "description": "The total number of guests present at the estate during the murder"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The mechanism relies on the study clock to expose the false timing.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The core mechanism of the murder timing.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "Eleanor's death must have occurred before this time based on witness reports.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Contradicts the assumption of the clock's accuracy.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "Indicates the time of the clock at the moment of discovery.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Dr. Finch's alibi states he was in the dining room at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Establishes Dr. Finch's claimed location at the time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "A note found in Eleanor's belongings indicates she was to meet Dr. Finch at a different time.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "Suggests a discrepancy in the timing of events.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "His presence in the dining room does not align with the time of death given by the clock.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Contradicts Dr. Finch's alibi based on the clock's time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "temporal",
      "description": "Dr. Mallory Finch had the means and opportunity to commit the crime.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "Direct evidence linking Dr. Mallory Finch to the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at the local pub at the time of the incident.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Corroborated alibi that excludes Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Witnesses claimed Eleanor was alive at the time of the meeting, but the clock shows otherwise.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[1]",
      "pointsTo": "Further complicates the timeline of events.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "A note found in Eleanor's belongings indicates she was to meet Dr. Finch at a different time.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This means the clock time must be incorrect to align with this meeting.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The eleanor in the study indicates a reliable time for Eleanor's last moments.",
      "supportsAssumption": "Eleanor Voss's death must have occurred at the time the clock indicated.",
      "misdirection": "This suggests the eleanor is accurate, misleading the investigation."
    },
    {
      "id": "rh_2",
      "description": "Witnesses reported seeing Eleanor at the time the reliable showed.",
      "supportsAssumption": "Eleanor Voss's death must have occurred at the time the clock indicated.",
      "misdirection": "This creates an impression that all timelines vosss, obscuring the truth."
    }
  ],
  "status": "fail",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_1"
    ],
    "mid": [
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_core_elimination_chain",
      "clue_fp_contradiction_step_3"
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
  "latencyMs": 11101,
  "cost": 0.0030083476499999998
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
