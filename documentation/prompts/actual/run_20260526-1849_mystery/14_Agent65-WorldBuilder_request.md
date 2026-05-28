# Actual Prompt Record

- Run ID: `mystery-1779821356623`
- Project ID: ``
- Timestamp: `2026-05-26T19:02:37.096Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `e408ef5b4acfc0ce`

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
    "title": "The Clock's Deceit",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Grand Manor House",
      "country": "England",
      "institution": "Country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "clock tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Wealthy heiress",
      "private_secret": "Had a hidden affair",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Life and reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Eleanor's confidant"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Unrequited love for Eleanor",
      "motive_seed": "Desire",
      "motive_strength": "high",
      "alibi_window": "11:00-11:30",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Medical tools"
      ],
      "behavioral_tells": [
        "Nervous when speaking about Eleanor"
      ],
      "stakes": "Heartbreak",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Eleanor's acquaintance"
      ],
      "public_persona": "Charming war veteran",
      "private_secret": "Gambling debts",
      "motive_seed": "Financial pressure",
      "motive_strength": "moderate",
      "alibi_window": "11:00-11:30",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Household staff access"
      ],
      "behavioral_tells": [
        "Fidgeting when discussing money"
      ],
      "stakes": "Financial ruin",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Detective",
      "relationships": [
        "Friend of Eleanor"
      ],
      "public_persona": "Intrepid investigator",
      "private_secret": "Resents the upper class",
      "motive_seed": "Justice",
      "motive_strength": "high",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
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
      "summary": "During a family gathering at a grand manor house in Little Middleton, Eleanor Voss is found dead. As suspicions arise, Beatrice Quill takes on the challenge of uncovering the truth, revealing the deceptive tampering of a clock that misled everyone about the time of death."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock in the study was intentionally wound back to create a false timeline of the murder.",
      "delivery_path": [
        {
          "step": "The clock was tampered with to show a different time than it should."
        }
      ]
    },
    "outcome": {
      "result": "The false timeline misled the investigation, allowing the true culprit to evade suspicion."
    }
  },
  "false_assumption": {
    "statement": "Eleanor must have been killed shortly before she was found, based on the time shown on the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock displayed the time of death accurately at first glance.",
    "what_it_hides": "The clock had been tampered with, misleading everyone about the actual time of death."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "11:10 AM - Time of discovery",
        "11:00 AM - Last seen alive"
      ],
      "windows": [
        "10:30 AM - 11:00 AM - Possible murder window"
      ],
      "contradictions": [
        "Clock shows time of 11:10 AM but witness saw Eleanor alive at 10:45 AM"
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The clock",
        "Eleanor's diary"
      ],
      "permissions": [
        "Access to the study"
      ]
    },
    "physical": {
      "laws": [
        "Principle of time accuracy in mechanical clocks"
      ],
      "traces": [
        "No fingerprints on the clock's winding mechanism"
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor's trust in her friends"
      ],
      "authority_sources": [
        "Dr. Mallory Finch's medical authority"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows ten minutes past eleven when discovered.",
        "correction": "The clock's time is inconsistent with witness reports of Eleanor's last sighting.",
        "effect": "Narrows time of death to between 10:30 AM and 11:00 AM, eliminating any suspect claiming to have seen her alive after this window.",
        "required_evidence": [
          "Clock shows ten minutes past eleven",
          "Witness accounts confirm Eleanor was last seen at 10:45 AM"
        ],
        "reader_observable": true
      },
      {
        "observation": "Eleanor's diary records her last known movements matched with the clock's time.",
        "correction": "The diary's records are inconsistent with the clock's showing, suggesting tampering.",
        "effect": "Narrows the suspect list to those who had access to the clock.",
        "required_evidence": [
          "Eleanor's diary detailing her schedule",
          "Witness reports of the timeline"
        ],
        "reader_observable": true
      },
      {
        "observation": "There are no fingerprints on the clock's winding mechanism.",
        "correction": "The lack of evidence suggests the clock was wound back after the murder.",
        "effect": "Eliminates Dr. Mallory Finch as the only possible suspect since they are known to have been in a different location.",
        "required_evidence": [
          "No fingerprints on the clock",
          "Alibi confirmation for Dr. Mallory Finch"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, study, and minut against the claimed timeline.",
    "knowledge_revealed": "The clock's internal mechanism shows recent tampering that contradicts the claimed time.",
    "pass_condition": "If the clock is shown to have been wound back, it confirms the false timeline.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_fp_contradiction_step_1",
      "clue_4"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock showing ten minutes past eleven and witness accounts (early) reveal the timeline discrepancy. Step 2: Eleanor's diary and the clock's time (mid) confirm the tampering. Step 3: The lack of fingerprints (discriminating test) identifies the tampering method."
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
        "Observe the clock's mechanism for tampering",
        "Draw conclusion about the timeline"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by witness statements",
        "supporting_clues": [
          "Eleanor's diary",
          "Clock's time"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Lack of access to the clock",
        "supporting_clues": [
          "No fingerprints on the clock",
          "Witness account of location"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation of the clock"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Eleanor's diary revealed"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
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
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Fingerprints examined"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
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
        "delivery_method": "Behavioral observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a charismatic socialite, adept at hosting lavish gatherings that mask her struggle to maintain her family's crumbling fortune. Beneath the glitzy facade lies a woman fiercely determined to secure her children's future amidst the threat of financial ruin.",
    "publicPersona": "Eleanor is the epitome of sophistication, known for her exquisite taste in decor and the grandeur of her soirées. Guests are drawn to her magnetic charm and effortless ability to make everyone feel welcome, even as she juggles the precarious balance of her family's legacy.",
    "privateSecret": "Eleanor is grappling with the reality of her family's financial decline, a burden she keeps hidden behind a polished smile. The looming threat of a new will that could strip her of her inheritance weighs heavily on her mind, igniting a fierce protectiveness over her children's future.",
    "motiveSeed": "Driven by a desperate need to secure her family's estate for her children, Eleanor is willing to do whatever it takes to maintain their status and legacy, even if it means resorting to drastic measures.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have been in the garden from seven to eight, mingling with guests and ensuring the evening's festivities ran smoothly.",
    "accessPlausibility": "easy",
    "stakes": "For Eleanor, the stakes are her children's future and the preservation of her family's name, which she believes is worth any sacrifice.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a melodic tone, often punctuating her sentences with a soft laugh. She has a penchant for grandiloquent phrases but can swiftly pivot to sharp wit when needed, revealing her intelligence beneath the charm.",
    "internalConflict": "Eleanor wrestles with the fear of losing everything she has built for her family. The pressure to uphold appearances while facing the reality of their situation creates a constant tension within her.",
    "personalStakeInCase": "This crime matters to Eleanor not just as a social obligation but as a deeply personal fight to protect her family's legacy and safeguard her children's future.",
    "paragraphs": [
      "Eleanor Voss glided through the garden, her sequined gown shimmering under the soft glow of the lanterns. Guests laughed and clinked glasses, but beneath the surface of her enchanting soirée lay a tempest of anxiety. The threat of financial ruin loomed over her like a dark cloud, and she clung to the hope that this night would reaffirm her family's status amongst the elite of Little Middleton.",
      "As she engaged in polite conversation, Eleanor's mind raced. The new will, a whispered rumor that had reached her ears, could strip her of the very foundation she had built for her children. She had always been the gracious hostess, but now she felt like a soldier on the front lines, ready to defend her territory at all costs. After all, what good was charm when the very essence of her family's legacy was at stake?",
      "Her laughter rang out, a beautiful facade that masked her inner turmoil. She had perfected the art of polite savagery, wielding her wit like a sword to cut through the superficiality of social gatherings. Yet, behind her poised exterior, Eleanor was a woman on the brink of desperation, willing to do anything to secure her children's inheritance, even if it meant stepping into morally murky waters.",
      "As the clock chimed, marking the hour when the evening's merriment would reach its peak, Eleanor caught sight of the victim. A chill ran down her spine, and she knew that whatever secrets were hidden in the folds of this night would demand more than just a charming smile to navigate. With her children's future at stake, Eleanor prepared to fight tooth and nail to protect what was hers."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a dedicated physician renowned for her progressive ideas. However, she is haunted by a past medical mistake that threatens to unravel her career when a victim threatens to expose the truth.",
    "publicPersona": "Mallory is a respected doctor in Little Middleton, known for her innovative approaches to patient care and her empathetic manner. Her patients trust her implicitly, and she takes pride in her work, often going above and beyond to ensure their well-being.",
    "privateSecret": "Mallory carries the heavy burden of guilt from a past medical error that led to a patient’s untimely demise. This secret lingers like a shadow, threatening her reputation and weighing on her conscience.",
    "motiveSeed": "The victim's intent to expose her medical negligence during a family gathering strikes fear into Mallory's heart, as it could devastate her hard-earned reputation and future.",
    "motiveStrength": "moderate",
    "alibiWindow": "Mallory claims to have been in her clinic treating a patient from six to eight, a statement that could be corroborated by her staff.",
    "accessPlausibility": "possible",
    "stakes": "For Mallory, the stakes are high; her professional reputation and future hang in the balance, and the specter of her past looms large over her.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory's speech is precise and measured, often punctuated by thoughtful pauses. She tends to use medical terminology but balances it with an approachable demeanor, making her both authoritative and relatable.",
    "internalConflict": "The guilt from her past mistake weighs heavily on Mallory, leading her to fear that the truth will not only ruin her career but also expose her as a failure in the eyes of those she strives to help.",
    "personalStakeInCase": "This crime matters to Mallory not just as a medical professional but as a chance for redemption; she must confront her past mistakes while navigating the dangerous waters of her present.",
    "paragraphs": [
      "Dr. Mallory Finch sat in her clinic, the faint sound of a ticking clock reminding her of the passing time. Each tick resonated with the guilt she carried, a constant reminder of the life she could not save. Patients came and went, but the shadow of her past mistake remained, haunting her every move and decision.",
      "As she treated her patients with care and compassion, Mallory's mind was often elsewhere, consumed by the fear that her past would catch up with her. The victim's threat to expose her negligence hung over her like a guillotine, poised to sever the delicate threads of her career. She had worked tirelessly to build her reputation, and the thought of losing it all was unbearable.",
      "Her colleagues admired her progressive ideas, but Mallory found herself withdrawing into her own thoughts, where the weight of her guilt grew heavier. She often relied on her dry wit as a defense mechanism, using humor to deflect the uncomfortable questions that arose when the topic of medical errors surfaced. Yet, beneath the surface, Mallory was a woman grappling with her conscience, torn between the desire to protect her career and the need to confront her past.",
      "As the evening unfolded, Mallory felt the pressure mounting. She was determined to prove herself, not just as a doctor but as a person capable of facing her fears head-on. The clock continued to tick, a reminder that time was running out, and she knew she had to confront the truth, no matter the cost."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired navy officer with a gallant public persona, yet his heart is burdened by resentment towards the Voss family, whom he believes wronged him during his service.",
    "publicPersona": "Ivor is viewed as a gallant former sailor, regaling listeners with tales of valor and honor. His presence commands respect, and he is often sought out for advice on matters of duty and courage.",
    "privateSecret": "Beneath the surface, Ivor harbors a deep resentment towards the Voss family, believing they manipulated family connections to ruin his career, leaving him with a sense of betrayal that festers within.",
    "motiveSeed": "Ivor believes the victim betrayed him by using their family influence to manipulate events that led to his career's downfall, igniting a desire for vindication.",
    "motiveStrength": "compelling",
    "alibiWindow": "Ivor claims to have been at the local pub from five to seven, a statement corroborated by the bartender on duty.",
    "accessPlausibility": "unlikely",
    "stakes": "For Ivor, the stakes are high; he seeks the restoration of his name and a chance to confront those he feels have wronged him.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Ivor speaks with a commanding presence, often employing a mixture of naval jargon and colloquial expressions. His sardonic humor emerges through wry observations, often aimed at the absurdities of civilian life.",
    "internalConflict": "Ivor is torn between his desire for vengeance and the realization that holding onto resentment may prevent him from moving forward. His bitterness is a double-edged sword that he struggles to wield.",
    "personalStakeInCase": "This crime matters to Ivor as it represents an opportunity for him to reclaim his dignity and confront the injustices of his past, making it a deeply personal battle.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the bar, a glass of whiskey in hand, as he regaled the patrons with tales of his naval exploits. The laughter and camaraderie surrounded him, but inside, a storm brewed. The Voss family had cast a long shadow over his life, their perceived betrayal festering like an untreated wound.",
      "To the outside world, Ivor was a gallant figure, a man of honor and valor. Yet, beneath his sardonic humor lay a heart filled with resentment. He believed the victim had manipulated family connections to orchestrate his downfall, a betrayal that threatened to define his legacy. The thought of confronting the Voss family filled him with a mixture of anger and determination.",
      "His speech carried the cadence of a seasoned officer, punctuated by naval jargon that often amused those around him. Ivor had a way of using humor to mask his bitterness, making sardonic remarks about the absurdities of civilian life. Yet, as he shared his stories, his eyes betrayed a longing for vindication, a chance to reclaim the honor he felt had been stripped away.",
      "As the evening wore on, Ivor sensed that the time for confrontation was approaching. The victim's demise had cast a spotlight on the very grievances he had harbored for so long. It was a moment of reckoning, and for Ivor, the stakes could not be higher. He was ready to seek the truth, not just for himself but to finally put the past to rest."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious journalist eager to make her mark in the world, but her desperation for a scoop leads her into murky waters when a victim possesses information that could change her career.",
    "publicPersona": "Beatrice is an aspiring journalist known for her tenacity and ambition. She is often seen chasing stories with a fervor that both impresses and concerns her peers.",
    "privateSecret": "Behind her drive lies a mounting debt and a desperate need for a breakthrough story that could secure her career, pushing her to the edge of ethical boundaries.",
    "motiveSeed": "The victim held evidence of corruption that Beatrice could expose, presenting an opportunity to elevate her career and escape her financial troubles.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims to have been in the library reviewing notes from five to eight, a statement that could be easily verified.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, the stakes are not only financial stability but also the chance to establish herself as a serious journalist in a competitive field.",
    "humourStyle": "blunt",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks rapidly, often cutting to the chase without unnecessary embellishments. Her bluntness can be disarming, and she frequently employs sharp remarks that reflect her keen observations.",
    "internalConflict": "Beatrice struggles with the ethics of her ambition, torn between her desire for success and the moral implications of her actions as she navigates the complexities of the investigation.",
    "personalStakeInCase": "This crime matters to Beatrice as it represents her chance to prove herself and escape the financial burdens that threaten to derail her career.",
    "paragraphs": [
      "Beatrice Quill paced the library, her fingers dancing over the pages of her notes as she hunted for the next big story. Her ambition burned bright, but beneath it lay a gnawing desperation. Debt loomed over her like a dark cloud, and the thought of failure was unbearable. She needed a breakthrough, and fast.",
      "Her eyes lit up at the mention of the victim, who held the key to exposing corruption that could catapult her career into the limelight. Beatrice was willing to do whatever it took to secure that scoop, even if it meant skirting the edges of ethics. Her blunt demeanor often startled those around her, as she cut through the fluff to get to the heart of the matter.",
      "While her peers admired her tenacity, they also worried about her relentless pursuit of success. Beatrice had a knack for sharp observations, often delivering them with a bluntness that left listeners reeling. Yet, as she navigated the murky waters of the investigation, she found herself grappling with the moral implications of her ambition.",
      "As the clock ticked on, Beatrice felt the pressure mounting. The stakes were higher than ever; it wasn't just about her career anymore. It was about proving to herself that she could rise above her circumstances, and she was determined to uncover the truth, no matter the cost."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Little Middleton Manor",
    "type": "Country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A grand manor house nestled in the English countryside, surrounded by sprawling gardens and a labyrinth of hedgerows, where secrets linger in every shadow.",
    "visualDescription": "The manor features a tall gabled roof, intricate stonework, and leaded glass windows, with ivy creeping up its weathered facade. A central courtyard, flanked by elegant wings, leads to meticulously manicured gardens, where the scent of damp earth mingles with the crisp autumn air.",
    "atmosphere": "An air of tension permeates the estate, shadowed by class discord and recent political upheaval.",
    "paragraphs": [
      "Little Middleton Manor stands like a sentinel against the rolling hills of the English countryside, its imposing silhouette a testament to the wealth and status of the family that resides within. The grand entrance, flanked by towering columns, opens into an expansive hallway adorned with portraits of stern ancestors, their eyes seemingly following every movement. The echo of footsteps on polished wood floors mingles with the distant sound of rustling leaves, creating an atmosphere thick with unspoken words and hidden truths.",
      "Beyond the grand staircase lies a series of locked rooms, each harboring secrets of the household, their contents concealed from prying eyes. The gardens, though beautiful, present a maze of hedgerows that obscure sightlines, allowing for whispers and furtive movements beneath the cover of overhanging branches. The scent of damp earth and decaying leaves fills the air, a reminder of the autumn chill that settles in as the sun retreats behind thick clouds, casting a pall over the estate.",
      "In the evenings, the manor transforms under the flickering glow of gas lamps, shadows dancing across the walls as guests gather in the drawing room. The tension is palpable, conversations laced with the recent shifts in society that echo through the halls. Outside, the sound of rain begins to patter against the leaded glass windows, a rhythmic reminder of nature's presence, adding to the sense of impending revelation that looms over the gathering.",
      "As the clock strikes the hour, the chime reverberates through the manor, each note a reminder of the delicate balance between time and truth. Every tick seems to resonate with the unspoken fears of the inhabitants, a constant reminder that the past is never truly buried. In this estate where every corner holds a story, the clock's deceit may be the key to unraveling the mystery that binds them all."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain showers, typical for the English countryside in autumn.",
    "timeFlow": "Days of mounting tension leading to an explosive revelation.",
    "mood": "Tense, due to underlying class tensions and recent political shifts.",
    "eraMarkers": [
      "petrol touring cars on winding roads",
      "early telephones in the drawing room",
      "typewriters clacking in the study"
    ],
    "sensoryPalette": {
      "dominant": "Damp earth and decaying leaves",
      "secondary": [
        "Gaslight flickering in shadows",
        "Creaking floorboards underfoot"
      ]
    },
    "paragraphs": [
      "The atmosphere within Little Middleton Manor is suffused with a palpable tension, the air thick with the scent of damp earth and the rustle of leaves outside. As the overcast skies loom, the estate feels isolated, a world unto itself, where whispers of class discord weave through the grand hallways. The flickering gaslight casts long shadows, revealing only fragments of the truth that lie hidden within its walls.",
      "Outside, the gardens are a labyrinth of hedgerows, their dense foliage creating pockets of concealment where secrets may linger. The distant sound of rain patters against the leaded glass, a rhythmic reminder of the storm brewing not just in the skies but within the hearts of its inhabitants. Each drop seems to echo the mounting tension, as if nature itself holds its breath, waiting for the inevitable clash of truths to unfold."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Dark wood shelves lined with leather-bound books; a large oak desk in the center; a single gas lamp casting shadows.",
      "sensoryDetails": {
        "sights": [
          "leather-bound tomes on dark shelves",
          "flickering gas lamp shadows",
          "dust motes in the air",
          "stacks of paper on the desk"
        ],
        "sounds": [
          "crackling fire in the hearth",
          "pages turning in the silence",
          "distant clock ticking"
        ],
        "smells": [
          "old leather and dust",
          "smoky wood from the fire",
          "cold stone beneath the windows"
        ],
        "tactile": [
          "worn leather armchair",
          "smooth oak desk surface",
          "chill draft from the window"
        ]
      },
      "accessControl": "Family and select guests only; staff permitted during the day; locked after dinner.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "grey light illuminating the room"
          ],
          "sounds": [
            "steady drumming on the roof",
            "soft splashes against the ground"
          ],
          "smells": [
            "damp earth and mildew",
            "cold stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light",
            "shadows creeping along the walls"
          ],
          "sounds": [
            "the creak of old timbers",
            "distant murmurs from the hallway"
          ],
          "smells": [
            "woodsmoke",
            "old books and dust"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on polished wood",
            "long shadows across the floor"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "soft laughter from the drawing room"
          ],
          "smells": [
            "candle wax",
            "tobacco smoke",
            "freshly brewed tea"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary of knowledge and secrets, is dimly lit, the flickering gas lamp casting wavering shadows against the dark oak shelves. Here, the air is thick with the scent of old leather and dust, the quiet broken only by the soft crackle of the fire in the hearth. Stacks of papers litter the large oak desk, hinting at the frantic activity that has transpired within these walls, while the distant ticking of the clock seems to mock the stillness, each tick a reminder of the time slipping away.",
        "In the corner, a worn leather armchair sits invitingly, yet it feels ominous under the weight of hidden truths. The chill draft from the window sends a shiver through the room, and the shadows seem to close in, creating an atmosphere heavy with secrets. Outside, the rain begins to fall, adding a rhythmic patter that mingles with the unease lingering in the air, as if the very walls are holding their breath, waiting for the next revelation."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Lavishly decorated with rich fabrics and ornate furniture; large windows overlooking the gardens.",
      "sensoryDetails": {
        "sights": [
          "opulent drapes in deep burgundy",
          "gold-framed mirrors reflecting light",
          "a grand piano in the corner"
        ],
        "sounds": [
          "soft laughter echoing",
          "the rustle of silk dresses",
          "the crackle of the fire"
        ],
        "smells": [
          "freshly polished wood",
          "scent of expensive perfume",
          "woodsmoke from the hearth"
        ],
        "tactile": [
          "soft velvet cushions",
          "cool marble fireplace surround",
          "warmth of the fire"
        ]
      },
      "accessControl": "Open to guests during gatherings; family access at all times; staff permitted only during events.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through the windows",
            "damp curtains clinging to the glass"
          ],
          "sounds": [
            "rain tapping against the glass",
            "muffled conversations from the hallway"
          ],
          "smells": [
            "damp fabric",
            "cold stone from the fireplace"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering in",
            "shadows playing on the walls"
          ],
          "sounds": [
            "the ticking of a clock",
            "soft whispers among guests"
          ],
          "smells": [
            "dust in the air",
            "faint aroma of tea"
          ],
          "mood": "tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight illuminating the room",
            "sparkling crystal chandelier"
          ],
          "sounds": [
            "clinking glasses",
            "lively conversation"
          ],
          "smells": [
            "scent of fresh flowers",
            "rich tobacco"
          ],
          "mood": "elegant anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room is a lavishly appointed space, where the rich hues of burgundy and gold create an atmosphere of opulence. Large windows overlook the gardens, framing the changing seasons outside while the inside is alive with the sound of soft laughter and the crackle of the fire. Plush velvet cushions invite relaxation, yet the tension in the air is palpable, as conversations dance around unspoken truths and hidden motives.",
        "As guests gather, the scent of expensive perfume mingles with the aroma of freshly brewed tea, masking an undercurrent of unease. The flickering candlelight casts playful shadows, creating a dynamic backdrop for the evening's interactions. Each tick of the clock reminds them that time is fleeting, and the secrets lurking in the corners of the room are as present as the guests themselves, waiting for the right moment to emerge."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Staff gathering space",
      "visualDetails": "Simple furnishings; a large wooden table at the center; a small fireplace for warmth.",
      "sensoryDetails": {
        "sights": [
          "worn wooden table",
          "faded wallpaper peeling at the edges",
          "dimly lit by a single gas lamp"
        ],
        "sounds": [
          "clatter of dishes",
          "soft murmurs of conversation",
          "crackling fire"
        ],
        "smells": [
          "cooked meats and vegetables",
          "freshly baked bread",
          "wood smoke from the fire"
        ],
        "tactile": [
          "rough wooden benches",
          "cool stone floor",
          "warmth from the fire"
        ]
      },
      "accessControl": "Restricted to staff; guests not permitted; meals served during specific hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain dripping from the eaves",
            "grey light filtering in"
          ],
          "sounds": [
            "water dripping on the ground",
            "distant thunder"
          ],
          "smells": [
            "freshly brewed tea",
            "wet earth outside"
          ],
          "mood": "sombre"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "flickering light from the lamp"
          ],
          "sounds": [
            "the clatter of dishes",
            "low conversations about the family"
          ],
          "smells": [
            "cooked vegetables",
            "faint aroma of herbs"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from the fireplace",
            "table set for dinner"
          ],
          "sounds": [
            "laughter echoing",
            "the popping of the fire"
          ],
          "smells": [
            "savory dishes being served",
            "freshly baked pie"
          ],
          "mood": "relaxed camaraderie"
        }
      ],
      "paragraphs": [
        "The servants' hall is a stark contrast to the opulence of the drawing room, its simple furnishings and worn wooden table bearing the marks of many meals shared in quiet companionship. Dimly lit by a single gas lamp, the space feels both intimate and isolating, where the clatter of dishes and soft murmurs of conversation create a backdrop to the lives of those who keep the manor running. The scent of cooked meats and freshly baked bread fills the air, providing a momentary comfort in the face of mounting tension.",
        "As the rain taps against the windows, the atmosphere grows heavy with unspoken words and shared glances, revealing the class tensions that simmer just beneath the surface. The warmth from the small fireplace offers physical comfort, yet the cool stone floor reminds them of their place in the household hierarchy. Each day brings new challenges, and the weight of secrets held in the manor above feels almost tangible, as if the very walls of the servants' hall are privy to the unfolding drama."
      ]
    },
    {
      "id": "cellar",
      "name": "The Cellar",
      "type": "interior",
      "purpose": "Storage and concealment",
      "visualDetails": "Dark, damp space lined with shelves; barrels and crates stacked against the walls; a single flickering bulb overhead.",
      "sensoryDetails": {
        "sights": [
          "shadows lurking in corners",
          "barrels stacked haphazardly",
          "dust motes suspended in the air"
        ],
        "sounds": [
          "dripping water echoing",
          "soft scurrying of mice",
          "creaking wood"
        ],
        "smells": [
          "musty earth and stale air",
          "faint scent of aging wine",
          "damp wood"
        ],
        "tactile": [
          "cool damp stone walls",
          "rough wooden crates",
          "slippery floor"
        ]
      },
      "accessControl": "Access limited to staff; locked during gatherings; entry permitted for storage only.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dark shadows deepening",
            "water pooling on the floor"
          ],
          "sounds": [
            "rain pattering above",
            "dripping water"
          ],
          "smells": [
            "damp stone",
            "moldy wood"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flickering bulb casting uneven light",
            "dark corners obscured"
          ],
          "sounds": [
            "soft scurrying of rodents",
            "dripping water echoing"
          ],
          "smells": [
            "earthy dampness",
            "faint scent of vinegar"
          ],
          "mood": "claustrophobic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "shadows stretching across the floor",
            "flickering bulb casting eerie light"
          ],
          "sounds": [
            "the silence of stillness",
            "occasional creak of wood"
          ],
          "smells": [
            "stale air",
            "scent of old barrels"
          ],
          "mood": "ominous"
        }
      ],
      "paragraphs": [
        "The cellar is a dark, damp space, the air thick with the musty odor of earth and stale air. Shadows cling to the corners, and the flickering bulb overhead casts an uneven light across the stacked barrels and crates, creating an atmosphere of foreboding. The cool stone walls seem to close in, and the sound of dripping water echoes ominously, as if the very walls are witnesses to the secrets held within.",
        "As the rain patters above, the cellar takes on an even more sinister tone, with shadows deepening and water pooling on the floor. The faint scurrying of mice adds to the sense of unease, each sound amplified in the silence. This space, intended for storage, serves as a reminder of the layers of concealment and the darkness that lies beneath the surface of Little Middleton Manor."
      ]
    }
  ],
  "note": "",
  "cost": 0.0022310706,
  "durationMs": 149841
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1932,
    "month": "August",
    "day": null,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "August",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "humidity in the air"
    ],
    "daylight": "Long summer days, with daylight lingering until around eight-thirty in the evening.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Bank Holiday on the first Monday of August"
    ],
    "seasonalActivities": [
      "picnics in the countryside",
      "garden parties",
      "fishing in local rivers"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored three-piece suits with wide lapels",
        "crisp white dress shirts",
        "bow ties or narrow neckties"
      ],
      "casual": [
        "lightweight linen trousers",
        "short-sleeve cotton shirts",
        "tweed caps"
      ],
      "accessories": [
        "leather gloves",
        "walking sticks",
        "silver pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dresses with floral patterns",
        "cloche hats adorned with ribbons",
        "pearl necklaces"
      ],
      "casual": [
        "light cotton blouses paired with high-waisted skirts",
        "sundresses",
        "cardigans"
      ],
      "accessories": [
        "silk scarves",
        "canvas handbags",
        "beaded clutch purses"
      ]
    },
    "trendsOfTheMoment": [
      "art deco influences in design",
      "rise of sportswear",
      "adoption of more practical fabrics"
    ],
    "socialExpectations": [
      "men are expected to wear hats outdoors",
      "women's fashion emphasizes modesty and elegance",
      "social gatherings often require formal attire"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "debate over unemployment relief in Parliament",
      "growing unrest in British cities due to economic hardship",
      "rising concerns about fascism in Europe"
    ],
    "politicalClimate": "A climate of uncertainty, with political parties struggling to address the deepening economic crisis.",
    "economicConditions": "The Great Depression casts a shadow over the economy, leading to high unemployment rates and increasing class divides.",
    "socialIssues": [
      "widespread poverty affecting working-class families",
      "strikes and protests gaining traction",
      "class tensions between landowners and their estate workers"
    ],
    "internationalNews": [
      "Hitler consolidating power in Germany",
      "growing apprehension about Italy's expansionist ambitions",
      "British Empire's diminishing global influence"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'The Best Things in Life Are Free' by Buddy DeSylva",
        "'My Heart Stood Still' by Richard Rodgers",
        "'Ain't She Sweet' by Milton Ager"
      ],
      "films": [
        "'Scarface' directed by Howard Hawks",
        "'The Front Page' directed by Lewis Milestone",
        "'Shanghai Express' directed by Josef von Sternberg"
      ],
      "theater": [
        "'The Royal Family' by George S. Kaufman and Edna Ferber",
        "'The Front Page' by Ben Hecht and Charles MacArthur"
      ],
      "radio": [
        "'The Shadow' radio program",
        "'Amos 'n' Andy' comedy series",
        "'The Radio Mystery Theater'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Mews' by Agatha Christie",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Glass Key' by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery",
        "detective fiction",
        "social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercially available television in the UK",
        "early electric refrigerators",
        "advancements in radio technology"
      ],
      "commonDevices": [
        "petrol-powered cars",
        "typewriters in offices",
        "early telephones in homes"
      ],
      "emergingTrends": [
        "increased use of radio for entertainment",
        "growing popularity of cinema as a social outing",
        "development of more efficient household appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: 4 pence",
        "a pint of milk: 1 penny",
        "a taxi ride across town: 2 shillings"
      ],
      "commonActivities": [
        "afternoon tea in gardens",
        "visiting local fairs",
        "attending cricket matches"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "dance evenings at local halls"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased resentment from the working class towards the upper class",
      "landowners maintaining traditional authority despite economic pressure"
    ],
    "gender": [
      "women increasingly participating in the workforce",
      "traditional gender roles still prevalent in middle and upper classes",
      "growing advocacy for women's rights"
    ],
    "race": [
      "racial tensions muted but underlying due to economic strains",
      "increasing awareness of social justice issues"
    ],
    "generalNorms": [
      "politeness and decorum in social interactions",
      "stiff upper lip attitude prevalent among the upper class",
      "strong community ties among working-class neighborhoods"
    ]
  },
  "atmosphericDetails": [
    "The air was thick with humidity, carrying the earthy scent of damp grass and impending rain.",
    "The distant rumble of thunder echoed like a warning as overcast skies loomed ominously above the country estate.",
    "The chatter from guests at afternoon teas mingled with the sound of a gramophone playing a popular tune, creating a juxtaposition of joy and tension."
  ],
  "paragraphs": [
    "In August 1932, the English countryside is a tapestry of green, overcast skies casting a muted light over grand country estates. The humid air is punctuated by occasional rain showers, leaving trails of moisture on the manicured lawns, where garden parties and picnics are held under heavy canopies. Long summer days allow for leisurely afternoons, but the atmosphere is fraught with underlying tensions as the Great Depression looms over the nation, casting a pall over even the most genteel gatherings.",
    "Fashion reflects this delicate balance between aspiration and reality, with men donning tailored three-piece suits adorned with wide lapels and crisp white shirts. Women favor elegant tea dresses with floral motifs, accessorized with cloche hats and pearl necklaces, reflecting their social status yet tempered by the economic strain. The adherence to formal attire for social events remains strong, as social expectations dictate that even the most casual of gatherings be tinged with a sense of propriety.",
    "Daily life is a dance of routine punctuated by the harsh realities of economic hardship. A loaf of bread costs a mere four pence, but for many, this is a luxury. Families gather for Sunday dinners, and community ties are reinforced through shared rituals, such as afternoon teas and dance evenings. Yet, the strain of class divides is palpable, with rising discontent among estate workers as they navigate the complexities of servitude in an era marked by class struggle and shifting social norms."
  ],
  "note": "",
  "cost": 0.0010404537,
  "durationMs": 67287
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A family gathering for a will reading amidst the Great Depression exposes class tensions and political anxieties, drawing together heirs, staff, and guests under one roof with secrets to protect.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class divisions are pronounced, with the upper class grappling with dwindling wealth and the working class feeling the strain of economic hardship, leading to heightened social pressures and political discourse."
  },
  "setting": {
    "location": "A grand manor house with sprawling gardens, multiple wings, and a central courtyard.",
    "institution": "Country house estate",
    "weather": "Overcast with occasional rain showers, typical for the English countryside in autumn."
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
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past eleven when discovered.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time of discovery is eleven ten in the morning.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Eleanor's diary records her last known movements matched with the clock's time.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Eleanor's last movements align with the time shown on the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The clock's time is inconsistent with witness reports of Eleanor's last sighting.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The time shown on the clock contradicts what witnesses claim.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "There are no fingerprints on the clock's winding mechanism.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "The absence of fingerprints suggests tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "The lack of evidence suggests the clock was wound back after the murder.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The clock's time may have been altered to mislead.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "behavioral",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The diary's records are inconsistent with the clock's showing, suggesting tampering.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The discrepancies indicate possible manipulation of the timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at the pub from ten thirty in the morning to eleven thirty in the morning.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale has a corroborated alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock in the study was intentionally wound back to create a false timeline of the murder.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This indicates a deliberate act to mislead the investigation.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "spatial",
      "description": "Eleanor's body was found in the study, where the clock is located.",
      "sourceInCML": "CASE.constraint_space.access.objects[0]",
      "pointsTo": "The location of the body is crucial to the timeline.",
      "placement": "mid",
      "criticality": "supporting",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "physical",
      "description": "A broken vase was found near Eleanor's body.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "The broken vase may indicate a struggle.",
      "placement": "mid",
      "criticality": "supporting",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "behavioral",
      "description": "Dr. Mallory Finch displayed unusual nervousness when questioned about the timeline.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "His behavior raises suspicion.",
      "placement": "mid",
      "criticality": "supporting",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "eleven ten in the morning - Time of discovery remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past eleven when discovered.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The clock's time is inconsistent with witness reports of Eleanor's last sighting.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Eleanor was known to have many enemies who could have wanted her dead.",
      "supportsAssumption": "Eleanor must have been killed shortly before she was found.",
      "misdirection": "This distracts from the evidence pointing towards Dr. Mallory Finch."
    },
    {
      "id": "rh_2",
      "description": "The study was often left unlocked, allowing anyone access.",
      "supportsAssumption": "Eleanor must have been killed shortly before she was found.",
      "misdirection": "This misleads the reader away from the specific evidence against Dr. Mallory Finch."
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
      "clue_1",
      "clue_2",
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core",
      "clue_fp_contradiction_step_1"
    ],
    "mid": [
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_core_elimination_chain",
      "clue_6",
      "clue_7",
      "clue_8"
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
  "latencyMs": 48417,
  "cost": 0.00287825835
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
