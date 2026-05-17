# Actual Prompt Record

- Run ID: `mystery-1778880718700`
- Project ID: ``
- Timestamp: `2026-05-15T21:35:14.054Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `0969fa6afa8e0bd6`

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
    "author": "Unknown",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Country house estate (Manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "poisoning"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Respected hostess and keen observer.",
      "private_secret": "Struggles with class tensions in her social circle.",
      "motive_seed": "Desire to maintain social order.",
      "motive_strength": "high",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the clock",
        "Familiarity with the house"
      ],
      "behavioral_tells": [
        "Calm demeanor amidst chaos"
      ],
      "stakes": "Establishing her reputation as a detective.",
      "evidence_sensitivity": [
        "High sensitivity to time-related discrepancies"
      ],
      "culprit_eligibility": "locked",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "suspect",
      "relationships": [
        "Close friend of the victim"
      ],
      "public_persona": "Respected physician.",
      "private_secret": "Financial struggles due to the Great Depression.",
      "motive_seed": "Desire for the victim's inheritance.",
      "motive_strength": "moderate",
      "alibi_window": "Ten minutes before the murder.",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Regular visitor to the manor"
      ],
      "behavioral_tells": [
        "Nervous when discussing the clock"
      ],
      "stakes": "Financial security.",
      "evidence_sensitivity": [
        "Sensitivity to alibi scrutiny"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "Charming but secretive.",
      "private_secret": "Has a gambling debt.",
      "motive_seed": "Need for money.",
      "motive_strength": "low",
      "alibi_window": "Arrived just after the murder.",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Guest of the manor"
      ],
      "behavioral_tells": [
        "Avoids eye contact when pressed"
      ],
      "stakes": "Avoiding exposure of his debts.",
      "evidence_sensitivity": [
        "Sensitive to gambling discussions"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "suspect",
      "relationships": [
        "Distant relative of the victim"
      ],
      "public_persona": "Ambitious social climber.",
      "private_secret": "Plans to marry into wealth.",
      "motive_seed": "Desire for social advancement.",
      "motive_strength": "high",
      "alibi_window": "No alibi.",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Familiar with the manor's layout"
      ],
      "behavioral_tells": [
        "Eager to discuss inheritance"
      ],
      "stakes": "Social status.",
      "evidence_sensitivity": [
        "Sensitive to discussions of wealth"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown"
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
      "summary": "In a tension-filled gathering at the manor during the early spring of the 1930s, Eleanor Voss uncovers a web of deceit surrounding the mechanical clock that marks the moments of a murder. As class tensions rise amidst the Great Depression, the true time of death becomes the key to revealing the murderer."
    },
    "accepted_facts": [
      "Eleanor Voss was found dead in her study.",
      "The mechanical clock in the study was tampered with.",
      "Dr. Mallory Finch had access to the clock."
    ],
    "inferred_conclusions": [
      "The time of death was manipulated to create an alibi."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock's hands were wound back to mislead witnesses about the time of death.",
      "delivery_path": [
        {
          "step": "The murderer adjusted the clock before the murder."
        },
        {
          "step": "The murderer established an alibi based on the manipulated time."
        }
      ]
    },
    "outcome": {
      "result": "Dr. Mallory Finch's true actions are revealed through the tampered clock."
    }
  },
  "false_assumption": {
    "statement": "The murder must have occurred during the party when all guests were present.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appeared to show a time aligned with the party's activities, misleading witnesses.",
    "what_it_hides": "The actual time of death was manipulated to allow the murderer to establish an alibi."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Ten minutes past eleven",
        "Time of the party activities"
      ],
      "windows": [
        "Alibi claims state presence during the party",
        "Witness accounts of time discrepancies"
      ],
      "contradictions": [
        "Clock shows tampered time but witnesses recall different activities."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The mechanical clock",
        "Eleanor's study"
      ],
      "permissions": [
        "Regular visitors allowed access to the study"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be tampered with."
      ],
      "traces": [
        "Smudges on the clock face indicating recent handling."
      ]
    },
    "social": {
      "trust_channels": [
        "Friends and family relationships"
      ],
      "authority_sources": [
        "Victim's established social order"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock shows ten minutes past eleven when discovered.",
        "correction": "The time displayed is inconsistent with witness accounts of when Eleanor was last seen.",
        "effect": "Narrows the time of death to before ten minutes past eleven.",
        "required_evidence": [
          "The clock in the study shows ten minutes past eleven.",
          "Witnesses recall seeing Eleanor alive around ten o'clock."
        ],
        "reader_observable": true
      },
      {
        "observation": "A slight smudge on the clock face suggests recent handling.",
        "correction": "The smudge indicates someone adjusted the clock shortly before the murder.",
        "effect": "Eliminates the possibility of the clock being inadvertently tampered with by someone other than the murderer.",
        "required_evidence": [
          "The smudge on the clock face.",
          "Witness statements about the clock's condition before the murder."
        ],
        "reader_observable": true
      },
      {
        "observation": "The room temperature is inconsistent with the claimed time of death.",
        "correction": "If the murder occurred at the time indicated by the clock, the room should have been cooler.",
        "effect": "Confirms the clock's time is manipulated and narrows the actual time of death.",
        "required_evidence": [
          "Witnesses noted the room was warmer than expected.",
          "The clock's hands were found in an unusual position."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A comparison of the time indicated on the clock and the room's temperature will reveal that the clock was tampered with to mislead.",
    "knowledge_revealed": "The clock's hands were set back, contradicting the actual conditions in the room.",
    "pass_condition": "If the clock's displayed time does not match the physical evidence of the room's temperature, it confirms tampering.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_10",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time discrepancy (early) and witness accounts (mid) let the reader identify the false timeline. Step 2: The smudge evidence (mid) confirms tampering. Step 3: The room temperature contradiction during the discriminating test reveals Dr. Mallory Finch's guilt."
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
        "Observe the contradiction between the clock's time and room temperature",
        "Draw conclusion about guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by witnesses.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No evidence linking her to the clock.",
        "supporting_clues": [
          "clue_1",
          "clue_3"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of the tampering."
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
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Temperature readings"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
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
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
    "summary": "A respected local historian with a hidden past, Eleanor Voss finds herself entangled in a web of deceit and inheritance.",
    "publicPersona": "Eleanor carries herself with a dignified grace, often seen at community events discussing the rich tapestry of Little Middleton's history. With her sharp intellect and an eye for detail, she commands respect among her peers, often sought after for her knowledge of the town's past.",
    "privateSecret": "Beneath her composed exterior lies a burden: Eleanor inherited a substantial debt from her late husband, a fact she has skillfully concealed from her friends and colleagues.",
    "motiveSeed": "The recent death of a prominent figure in the community presents an opportunity for Eleanor, as she stands to gain control over the manor and its valuable historical artifacts, which could alleviate her financial woes.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have been cataloguing artifacts in the library from five to seven, a task which could easily provide her the cover she needs.",
    "accessPlausibility": "With her role as a historian, gaining access to the manor and its contents is a mere formality, her expertise granting her the keys to its secrets.",
    "stakes": "The stakes are high for Eleanor; her financial stability is precarious, and the potential inheritance represents not only a lifeline but also a chance to restore her tarnished reputation.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks in a measured tone, often employing historical references to make her points. She has a tendency to punctuate her conversations with wry observations, revealing her intelligence and her subtle humor.",
    "internalConflict": "Eleanor grapples with feelings of betrayal and anger towards her late husband for leaving her in such a precarious situation, questioning whether his choices were driven by love or selfishness.",
    "personalStakeInCase": "This case is not just about solving a murder for Eleanor; it represents a chance to reclaim her life and secure a future unburdened by her husband's past mistakes.",
    "paragraphs": [
      "Eleanor Voss stood in the dim light of the library, surrounded by the scent of aged paper and the whispers of history. The manor's once-grand halls had become a sanctuary for her passion, but now, they echoed with the specter of her late husband’s financial misdeeds. She had devoted herself to uncovering the town's secrets, yet the greatest secret of all lay buried within her own past—a debt that threatened to consume her. The weight of it pressed heavily on her shoulders as she meticulously catalogued each artifact, her fingers brushing against the cool surfaces of history.",
      "As a respected member of the community, Eleanor had cultivated an image of integrity and knowledge. Yet, behind her polished exterior, she wrestled with the knowledge that her late husband's choices had left her vulnerable. The recent death of a prominent figure had sparked a flicker of hope in her heart; if she could secure the manor and its treasures, she could finally escape the shadows of her past. Eleanor's mind raced with possibilities as she pondered the implications of inheriting the estate—financial stability, control, and perhaps even redemption.",
      "Eleanor's alibi was as solid as the heavy tomes lining the library shelves. She had been cataloguing artifacts during the time of the murder, a task that not only kept her occupied but also provided her the perfect cover. The ease with which she could access the manor's secrets was both a blessing and a curse. As a historian, she knew how to navigate the corridors of power, but now those very halls felt fraught with danger. Could she trust herself to stay above the fray, or would her desperation lead her into darker waters?",
      "As she contemplated her next steps, Eleanor couldn't shake the feeling of internal conflict. The prospect of unearthing her husband's hidden past stirred a cauldron of emotions within her—rage, betrayal, and a desperate need for closure. More than just a crime to solve, this was a chance to reclaim her identity and her future. The stakes had never been higher, and with each passing moment, she knew she was treading a fine line between justice and self-preservation."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A compassionate physician hiding a dangerous secret, Dr. Mallory Finch’s world begins to unravel as desperation takes hold.",
    "publicPersona": "Known for her dedication to her patients, Dr. Mallory Finch is viewed as a beacon of hope in Little Middleton. Her warm demeanor and tireless work ethic have earned her the affection of the community, especially among those less fortunate.",
    "privateSecret": "Beneath her caring facade lies a troubling addiction to prescription drugs, a struggle that threatens to undermine her practice and her reputation.",
    "motiveSeed": "With her practice on the verge of financial collapse, the prospect of a lucrative inheritance from the victim could provide the lifeline she desperately needs.",
    "motiveStrength": "moderate",
    "alibiWindow": "Mallory was attending a charity meeting from six to eight, an event that could easily have served as her alibi, though questions remain about her true whereabouts.",
    "accessPlausibility": "While her role as a physician grants her some access to the manor, the truth of her dependency complicates her situation, making her motives appear suspect.",
    "stakes": "The stakes for Mallory are exceptionally high; her career hangs in the balance, and the prospect of losing everything drives her to the brink of desperation.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory often speaks with a soothing cadence, her voice imbued with empathy. She occasionally deflects serious topics with self-deprecating humor, using light-hearted quips to mask her inner turmoil.",
    "internalConflict": "Mallory is torn between her ethical obligations as a doctor and the seductive pull of her addiction, fearing that her choices could jeopardize not only her career but also her identity.",
    "personalStakeInCase": "For Mallory, this crime is a personal reckoning; the chance to secure her future and reclaim her sense of purpose is too tempting to resist.",
    "paragraphs": [
      "Dr. Mallory Finch stood amidst the clamor of the charity meeting, her heart racing in tandem with her thoughts. The room buzzed with laughter and camaraderie, yet beneath the surface of her warm smile lay a tempest of anxiety. She had always prided herself on being the community's healer, a role she cherished, but the weight of her secret threatened to crush her spirit. As whispers of financial troubles swirled around her practice, she felt the claws of desperation digging deeper into her psyche.",
      "While the gathering was meant to uplift, Mallory's mind drifted to the recent death of a local luminary. The inheritance that could stem from it had sparked a flicker of hope in her heart, although she knew well that hope could be a double-edged sword. With her practice on the brink of collapse, the allure of a financial windfall was almost intoxicating. Yet, at what cost? The thought of crossing ethical lines made her stomach churn, but the reality of her addiction loomed larger than life.",
      "Claiming to be at the charity meeting during the time of the murder, Mallory felt a twinge of guilt at the deception. The façade she had built was crumbling, and the stakes continued to rise. Access to the manor was within her grasp, but she knew that her motives could be easily misconstrued. As a physician, she had earned a certain level of trust, yet her hidden struggles cast a long shadow over her intentions.",
      "As the evening wore on, Mallory wrestled with her internal conflict. The lines between her professional obligations and her personal demons blurred, leaving her feeling adrift. The idea of securing a future free from the chains of her addiction was tantalizing, yet the fear of losing her identity as a doctor paralyzed her. This case was not merely a matter of uncovering the truth; it was a crossroads that could define her life in ways she had never anticipated."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired naval officer grappling with resentment, Captain Ivor Hale finds himself ensnared in a web of family legacy and vengeance.",
    "publicPersona": "With a distinguished bearing and a penchant for grand tales of adventure, Captain Ivor Hale is a well-known figure in Little Middleton, often regaling locals with stories of his naval exploits.",
    "privateSecret": "Beneath his charming exterior, Ivor harbors a deep resentment against the victim, feeling overshadowed by their accomplishments and the legacy they have built.",
    "motiveSeed": "Ivor believes that the victim's death could restore his family's honor and secure a rightful share of the inheritance that has eluded him for far too long.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor claimed to be taking a walk in the gardens from five-thirty to six-thirty, a story that could easily be scrutinized.",
    "accessPlausibility": "His status as a former naval officer provides him with a degree of access to the manor, yet his motives raise questions about his true intentions.",
    "stakes": "For Ivor, the stakes are not merely financial; his family's pride and social standing are on the line, pushing him towards desperate measures.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with a commanding presence, often peppering his tales with sarcasm and a dry wit. He has a tendency to embellish his stories, using dramatic pauses to draw in his audience.",
    "internalConflict": "Ivor grapples with an obsession for vengeance, torn between the desire to restore his family's legacy and the realization that such pursuits often lead to futility and despair.",
    "personalStakeInCase": "This case is deeply personal for Ivor; it represents a chance to reclaim his family's honor and confront the ghosts of his past.",
    "paragraphs": [
      "Captain Ivor Hale strode through the gardens, the late afternoon sun casting long shadows across the manicured lawns. He was a man of stories, a retired naval officer whose life had been filled with adventure. Yet, beneath the surface of his distinguished persona lay a simmering resentment—a feeling that had festered over the years. The recent death of a local magnate had stirred something deep within him, igniting a fire of ambition that threatened to consume him whole.",
      "To the townsfolk, Ivor was a charming raconteur, spinning tales of valor and daring escapades. But behind the laughter, he nursed a bitterness that had long since taken root. The victim, with their dazzling legacy, had overshadowed Ivor's own family's contributions, and the thought of their death offered a glimpse of hope. Perhaps this was his chance to reclaim a share of the inheritance that had slipped through his fingers like sand.",
      "Ivor's alibi was as thin as the fabric of his stories; he had claimed to be walking in the gardens during the time of the murder. The ease with which he could access the manor only heightened the stakes, as the lines between truth and deception blurred. The thought of being scrutinized weighed heavily on him, yet the prospect of restoring his family's honor spurred him onward.",
      "As he pondered his next move, Ivor wrestled with the internal conflict that had plagued him for years. The desire for vengeance gnawed at him, but he also recognized the futility of such pursuits. Was it worth sacrificing his integrity for the sake of a legacy that may never truly belong to him? The case before him was not merely a matter of justice; it was a reckoning with his past, and Ivor knew he had to confront the demons that haunted him."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An aspiring writer caught in a tangled web of ambition and deception, Beatrice Quill's dreams hang in the balance as she navigates the aftermath of a scandalous affair.",
    "publicPersona": "With her enchanting presence and quick wit, Beatrice Quill is an aspiring writer well-liked in Little Middleton, known for her charm and ambition.",
    "privateSecret": "Beneath her captivating exterior, Beatrice has been engaged in a secret affair with the victim, hoping for a financial reward that could transform her dreams into reality.",
    "motiveSeed": "Believing that the victim would leave her a significant sum, Beatrice now risks everything as the truth of their relationship threatens to unravel her carefully constructed life.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice was in her room writing from six to eight, a solitary activity that could easily be scrutinized.",
    "accessPlausibility": "Her charm and social standing grant her access to the upper echelons of society, yet her motives cast a shadow over her intentions.",
    "stakes": "For Beatrice, the stakes are high; her dreams of becoming a successful author and achieving financial security hinge on her connection to the victim.",
    "humourStyle": "blunt",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with a refreshing candor, often using direct language and a playful tone. Her speech is peppered with sharp observations, reflecting her keen insight into human nature.",
    "internalConflict": "Beatrice battles with the consequences of her choices, torn between her ambition and the moral implications of her actions, fearing that her dreams may come at too high a price.",
    "personalStakeInCase": "This case is pivotal for Beatrice; it represents a turning point that could define her future and the path she chooses to take.",
    "paragraphs": [
      "Beatrice Quill sat at her writing desk, the late evening light casting a warm glow over the pages before her. With pen in hand, she poured her heart into her stories, weaving tales that danced between reality and fiction. Yet, as she crafted her narratives, a darker tale loomed over her life—a scandalous affair with the victim that had begun as a dream and had swiftly spiraled into a nightmare. The very foundation of her ambitions now teetered on the brink of collapse.",
      "To the outside world, Beatrice was a charming and ambitious young woman, but beneath the surface lay a secret that could unravel everything she had worked for. She had believed that the victim would leave her a generous inheritance, a financial boon that would elevate her writing career. Now, with the victim's untimely death, she faced the terrifying possibility of losing not only her dreams but also her reputation.",
      "During the time of the murder, Beatrice claimed to have been in her room writing, a solitary activity that could easily be questioned. The access she had enjoyed to the victim's life now felt like a double-edged sword, leaving her vulnerable to scrutiny. As the truth of their relationship simmered beneath the surface, she couldn't shake the feeling that her motives were being called into question, adding to the pressure she felt to succeed.",
      "In the depths of her mind, Beatrice wrestled with the internal conflict that plagued her. She had pursued her ambitions with fervor, but the reality of her choices weighed heavily on her conscience. Was the pursuit of her dreams worth the moral compromises she had made? This case was not just a matter of justice; it was a defining moment that could alter the course of her life forever. The stakes had never felt higher, and Beatrice knew she had to navigate the treacherous waters ahead with care."
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
    "type": "Country house estate (Manor house)",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Little Middleton Manor is a sprawling estate steeped in mystery, where the whispers of the past echo in its grand halls and gardens, setting the stage for intrigue and suspicion.",
    "visualDescription": "The manor boasts a façade of weathered stone, adorned with ivy that clings like secrets to its walls. Tall, narrow windows framed with dark wood cast long shadows across the manicured lawns, while a wrought iron gate opens to a gravel drive lined with ancient oaks.",
    "atmosphere": "The atmosphere is thick with tension, underscored by the scent of damp earth and the distant sound of rain tapping against the windowpanes.",
    "paragraphs": [
      "Little Middleton Manor stands as a solitary sentinel in the English countryside, its sprawling grounds enveloped in an air of timeless elegance. The overcast sky casts a muted light over the estate, where the soft patter of rain creates a rhythmic backdrop, punctuating the silence with an unsettling cadence. As guests gather within its opulent yet shadowy halls, an undercurrent of suspicion weaves through their conversations, each glance heavy with unspoken doubts. The scent of fresh blooms from the extensive gardens mingles with the dampness of the air, creating a heady perfume that masks the darker secrets lurking just beneath the surface.",
      "Upon entering the grand entrance hall, one is struck by the towering ceilings adorned with intricate plasterwork and the polished marble floors that reflect the muted light. Gas lamps flicker softly, illuminating the portraits of long-departed ancestors that seem to watch over the living with knowing eyes. The expansive space is divided by imposing columns, creating pockets of shadow where whispered conversations and furtive glances thrive. Each room branches off the hall with a sense of purpose, leading to areas both inviting and foreboding, where the past and present collide in a dance of intrigue.",
      "The estate's gardens, meticulously designed yet wild in their beauty, serve as both a sanctuary and a maze. Hedges sculpted into intricate patterns create a labyrinthine effect, limiting visibility and cloaking clandestine meetings in secrecy. The damp earth gives way to the scent of wet foliage, while the soft rustle of leaves in the breeze sounds almost like hushed confessions. As the rain intermittently falls, the droplets create a symphony of sound, punctuating the tension that hangs in the air, as if nature itself is aware of the secrets buried within this estate's history.",
      "As night descends upon Little Middleton, the manor transforms into a realm of shadows and whispers. The flickering candlelight casts dancing shapes upon the walls, and the distant tick of a grandfather clock echoes through the halls, reminding all that time is both a friend and a foe. Guests find themselves ensnared in a web of suspicion, where every creak of the old wood and every flicker of the gaslight amplifies their unease. The manor, with its grand yet isolated presence, stands ready to reveal its secrets, but only to those brave enough to confront the truth."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical of early spring.",
    "timeFlow": "Three days of mounting tension as secrets unravel and suspicions rise.",
    "mood": "Tense, with an undercurrent of suspicion among the guests.",
    "eraMarkers": [
      "Petrol touring cars parked along the gravel drive, their polished surfaces glistening in the rain.",
      "Early home telephones with rotary dials, gathering dust in the study, waiting for important calls.",
      "Typewriters in the library, their keys clacking out letters that may hold the key to the mystery."
    ],
    "sensoryPalette": {
      "dominant": "The damp, earthy smell of the rain-soaked gardens, mingling with the scent of old wood and polished brass.",
      "secondary": [
        "The soft rustle of silk dresses brushing against the polished floors as guests move through the manor.",
        "The distant sound of thunder rumbling, reminding all of the storm brewing outside and within."
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of damp earth and the subtle perfume of blooming flowers, creating an intoxicating atmosphere that both enchants and unsettles. The gentle sound of rain tapping against the windowpanes accompanies the hushed whispers of the guests, each word laced with suspicion and intrigue. Shadows stretch across the walls, and the flickering gas lamps cast an eerie glow, as if the manor itself is alive with secrets.",
      "As the hours pass, the tension within Little Middleton Manor builds palpably. The overcast sky looms like a heavy curtain, casting a pall over the estate as guests navigate the labyrinth of rooms and corridors. Each creak of the floorboards and distant clock tick seems to amplify the unease, as if the very structure of the manor is holding its breath, waiting for the inevitable revelation of truths long buried."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_entrance_hall",
      "name": "Grand Entrance Hall",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The hall features towering ceilings adorned with intricate plasterwork, and polished marble floors that reflect the soft glow of gas lamps. Portraits of ancestors gaze down from the walls, their eyes following guests as they move beneath them.",
      "sensoryDetails": {
        "sights": [
          "The opulent chandelier, dripping with crystal droplets, refracts the light into a thousand tiny rainbows, creating a mesmerizing display.",
          "Richly embroidered tapestries hang on the walls, depicting scenes of pastoral life, their colors muted yet inviting."
        ],
        "sounds": [
          "The echo of footsteps on the marble floor resonates through the hall, creating a hollow sound that seems to amplify the tension.",
          "Distant laughter and whispers filter in from the drawing room, adding to the atmosphere of intrigue and suspicion."
        ],
        "smells": [
          "The scent of polished wood mingles with the faint aroma of beeswax from the candles, creating an inviting yet somber ambiance.",
          "A hint of dampness lingers in the air, the result of the persistent rain outside, adding a layer of discomfort."
        ],
        "tactile": [
          "The coolness of the marble floor contrasts sharply with the warmth of the heavy drapery that frames the windows, creating a sensory juxtaposition.",
          "As guests brush against the tapestries, the rich texture of the fabric provides a tactile reminder of the estate's history and grandeur."
        ]
      },
      "accessControl": "Accessible to all guests during the day; locked after dinner for privacy; staff may enter for cleaning before dawn.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "grey light filtering through the heavy curtains"
          ],
          "sounds": [
            "steady drumming of rain on the roof",
            "the soft patter of droplets hitting the marble"
          ],
          "smells": [
            "damp earth",
            "the musty scent of old books from the library beyond",
            "faint traces of fresh blooms from the garden"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "the hall bathed in flat, pewter light",
            "long shadows stretching across the floor"
          ],
          "sounds": [
            "the distant chime of a clock marking the hour",
            "the creak of old timbers settling"
          ],
          "smells": [
            "the scent of polished wood",
            "dust from the tapestries",
            "the faint aroma of brewing tea from the drawing room"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering against the walls",
            "the last rays of sun illuminating the portraits"
          ],
          "sounds": [
            "the ticking of a grandfather clock in the corner",
            "muffled conversations from the drawing room"
          ],
          "smells": [
            "the warm scent of beeswax candles",
            "the aroma of tobacco smoke wafting in from the study",
            "the lingering scent of dinner"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Entrance Hall serves as the heart of the manor, where guests gather to exchange pleasantries, yet the atmosphere is thick with unspoken tension. Portraits of ancestors loom over the proceedings, their eyes seemingly aware of the secrets unfolding beneath their watchful gaze. Each arrival is met with a measured glance, the soft rustle of silk dresses and the clink of crystal glasses creating a symphony of subtle intrigue.",
        "As guests mill about, the hall transforms into a space of both welcome and wariness. The flickering gas lamps cast dancing shadows that play tricks on the eye, while the scent of polished wood and damp earth fills the air. Every creak of the floorboards amplifies the weight of suspicion, and the air is charged with the unshakeable feeling that every word spoken could be a step closer to uncovering the truth."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The library is lined with shelves of leather-bound books, their spines cracked with age and wisdom. A large oak table sits in the center, covered in papers and a typewriter, hinting at recent correspondence.",
      "sensoryDetails": {
        "sights": [
          "Soft light filters through the tall windows, illuminating dust motes that dance lazily in the air, creating an ethereal quality.",
          "The rich mahogany of the bookshelves contrasts with the faded wallpaper, which tells tales of both beauty and decay."
        ],
        "sounds": [
          "The soft rustle of pages turning is interrupted only by the occasional scratch of the typewriter keys, creating a rhythm of thought and contemplation.",
          "Outside, the sound of rain tapping against the window creates a soothing yet melancholic backdrop, enhancing the sense of isolation."
        ],
        "smells": [
          "The musty scent of old books fills the air, mingling with the faint aroma of fresh ink from the typewriter, creating a nostalgic atmosphere.",
          "A hint of tobacco lingers, suggesting that someone has taken refuge here to ponder and reflect on the mysteries at hand."
        ],
        "tactile": [
          "The smooth, cool surface of the typewriter contrasts with the rough texture of the papers strewn about, each telling its own story.",
          "As guests run their fingers along the spines of the books, the worn leather provides a tactile connection to the past, rich with untold stories."
        ]
      },
      "accessControl": "Generally accessible to guests during the day; staff may enter for cleaning; locked at night to protect valuable volumes.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft grey light filtering through the rain-streaked windows",
            "the glow of the gas lamp struggling against the gloom"
          ],
          "sounds": [
            "the steady rhythm of rain against the window",
            "the occasional thud of a book being returned to the shelf"
          ],
          "smells": [
            "the scent of damp paper",
            "the musty aroma of old leather",
            "the faint tang of ink"
          ],
          "mood": "reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "the library bathed in soft, diffuse light",
            "shadows pooling in the corners where dust gathers"
          ],
          "sounds": [
            "the distant ticking of a clock echoing the passage of time",
            "the soft scratch of a pencil as notes are taken"
          ],
          "smells": [
            "the rich scent of polished wood",
            "the aroma of fresh ink",
            "the musty odor of neglected tomes"
          ],
          "mood": "contemplative"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm candlelight flickering across the pages of an open book",
            "the last rays of sunlight casting long shadows"
          ],
          "sounds": [
            "the gentle rustle of paper as a book is closed",
            "the soft thud of footsteps approaching"
          ],
          "smells": [
            "the comforting scent of aged paper",
            "the lingering aroma of tobacco",
            "the faint sweetness of candle wax"
          ],
          "mood": "mysterious"
        }
      ],
      "paragraphs": [
        "The library serves as a treasure trove of knowledge and a potential goldmine for secrets, its walls lined with volumes that whisper of the past. A large oak table, strewn with papers and an old typewriter, invites exploration, hinting at the correspondence and clues that may lie hidden within. As guests sift through the pages, the air thickens with the scent of old leather and ink, each turn of the page echoing the weight of history.",
        "In the quiet corners of the library, tension simmers beneath the surface. The soft rustle of pages turning is a stark contrast to the distant sound of rain, creating an atmosphere ripe for revelation. As guests delve into the tomes, the knowledge contained within these walls becomes a double-edged sword, offering both insight and the potential for peril as they seek to unravel the mysteries that bind them to Little Middleton Manor."
      ]
    },
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is elegantly furnished with plush sofas and armchairs arranged around a grand fireplace, where flames flicker and cast a warm glow. Ornate mirrors reflect the light, creating an illusion of space and grandeur.",
      "sensoryDetails": {
        "sights": [
          "The rich colors of the upholstery contrast beautifully with the muted tones of the wallpaper, creating an inviting yet opulent atmosphere.",
          "A grand piano sits in the corner, its polished surface gleaming, hinting at evenings filled with music and merriment."
        ],
        "sounds": [
          "The crackle of the fire provides a comforting backdrop, while the soft murmurs of conversation weave through the air, creating a tapestry of social interaction.",
          "The delicate sound of china clinking as tea is served adds a layer of refinement to the gathering, punctuating the tension that simmers just beneath the surface."
        ],
        "smells": [
          "The aroma of freshly brewed tea mingles with the scent of polished wood, creating an atmosphere that is both cozy and sophisticated.",
          "Hints of floral perfume linger in the air, suggesting the presence of well-dressed guests who have come to share in the intrigue."
        ],
        "tactile": [
          "The soft fabric of the sofas invites guests to sink in, while the cool marble of the fireplace surround provides a contrast that keeps the space feeling dynamic.",
          "As guests hold delicate china cups, the smoothness of the porcelain contrasts with the warmth of the tea, a reminder of the comfort that hides the tension in the room."
        ]
      },
      "accessControl": "Open to all guests during the day; closed in the evenings for private gatherings; staff may enter only to serve refreshments.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft light filtering through the rain-soaked windows",
            "the flickering flames in the fireplace dancing shadows across the room"
          ],
          "sounds": [
            "the rhythmic sound of rain hitting the roof",
            "the gentle crackle of the fire as it warms the space"
          ],
          "smells": [
            "the comforting aroma of tea brewing",
            "the scent of damp wood from the rain outside",
            "the faint whiff of floral perfume"
          ],
          "mood": "intimate"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "the room filled with a soft, diffused light",
            "shadows growing longer as the day progresses"
          ],
          "sounds": [
            "the murmur of conversation punctuated by laughter",
            "the sound of china clinking as refreshments are served"
          ],
          "smells": [
            "the rich scent of freshly baked pastries",
            "the aroma of polished wood",
            "the lingering perfume of guests"
          ],
          "mood": "suspicious"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the soft glow of candlelight illuminating the room",
            "the shadows of guests moving in and out of the light"
          ],
          "sounds": [
            "the soft notes of a piano playing in the corner",
            "the quiet laughter of guests mingling"
          ],
          "smells": [
            "the sweet scent of candle wax",
            "the rich aroma of fine tobacco",
            "the lingering smell of floral arrangements"
          ],
          "mood": "festive yet tense"
        }
      ],
      "paragraphs": [
        "The drawing room, with its plush furnishings and inviting ambiance, serves as a gathering space for guests to mingle and share stories. The grand fireplace crackles softly, casting a warm glow that contrasts with the chill of the rain outside. Here, laughter mingles with whispers, each conversation a delicate dance of intrigue that keeps all on edge, as secrets hover just beneath the surface.",
        "As night falls, the drawing room becomes a stage for both camaraderie and suspicion. The flickering candlelight creates an intimate atmosphere, yet the tension is palpable as guests navigate their relationships. Each smile may hide a motive, and every glass raised in toast may conceal a deeper truth, making the drawing room a perfect setting for the unfolding mystery."
      ]
    },
    {
      "id": "study",
      "name": "Study",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The study is lined with dark wood paneling, filled with leather-bound books and the scent of pipe tobacco lingering in the air. A large mahogany desk sits cluttered with papers, a typewriter, and an ashtray overflowing with cigarette butts.",
      "sensoryDetails": {
        "sights": [
          "The dim light from a desk lamp casts shadows across the cluttered desk, creating a sense of chaos and urgency.",
          "Framed photographs of the manor's history line the walls, each telling a story of its own, but now overshadowed by the dark events unfolding."
        ],
        "sounds": [
          "The soft scratch of a pencil on paper echoes in the stillness, punctuated by the occasional creak of the old wood as if the room itself is alive.",
          "Outside, the sound of rain pelting against the window creates a rhythmic backdrop, a reminder of the storm brewing both inside and out."
        ],
        "smells": [
          "The rich aroma of pipe tobacco mingles with the musty scent of old books, creating a heady atmosphere that invites contemplation yet hints at darker secrets.",
          "A faint whiff of burnt coffee lingers, suggesting that someone has been here for far too long, lost in thought or perhaps in guilt."
        ],
        "tactile": [
          "The smooth surface of the desk contrasts with the rough texture of the papers strewn about, each one a potential clue waiting to be uncovered.",
          "As guests touch the leather-bound books, the tactile sensation connects them to the past, adding a layer of intrigue to their investigation."
        ]
      },
      "accessControl": "Restricted access; only the owner and select guests may enter; locked when not in use to protect sensitive materials.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "the dim light barely penetrating the heavy clouds",
            "raindrops trickling down the windowpanes"
          ],
          "sounds": [
            "the patter of rain on the roof",
            "the soft rustle of papers being shuffled"
          ],
          "smells": [
            "the scent of damp wood",
            "the rich aroma of tobacco",
            "the musty odor of old books"
          ],
          "mood": "contemplative"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "the study cloaked in shadows as daylight wanes",
            "papers scattered across the desk in disarray"
          ],
          "sounds": [
            "the ticking of a clock marking the passing minutes",
            "the soft sigh of the wind outside"
          ],
          "smells": [
            "the strong scent of brewed coffee",
            "the lingering aroma of tobacco",
            "the musty smell of old leather"
          ],
          "mood": "tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of a desk lamp illuminating the chaos of the desk",
            "shadows lengthening across the walls"
          ],
          "sounds": [
            "the quiet scratching of a pen against paper",
            "the faint sound of laughter from the drawing room"
          ],
          "smells": [
            "the sweet scent of cigar smoke",
            "the rich aroma of leather",
            "the faint smell of old paper"
          ],
          "mood": "foreboding"
        }
      ],
      "paragraphs": [
        "The study, a sanctuary of intellect and introspection, becomes the stage for the unfolding mystery. Lined with dark wood paneling and filled with leather-bound volumes, it holds the weight of knowledge and the scent of pipe tobacco lingering heavily in the air. Papers clutter the mahogany desk, each one a potential clue, while framed photographs of the manor's history cast a watchful eye over the proceedings, their stories now overshadowed by the events that transpire.",
        "As the hours tick by, the tension in the study becomes palpable, the air thick with the aroma of burnt coffee and pipe smoke. The soft scratch of a pencil on paper echoes in the stillness, and the distant sound of rain creates a rhythmic backdrop that heightens the sense of urgency. This room, once a refuge, now serves as a crucible where secrets are laid bare, and the truth is but a whisper away."
      ]
    }
  ],
  "note": "",
  "cost": 0.0028544043,
  "durationMs": 36230
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1932,
    "month": "November",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "Overcast skies with frequent drizzles",
      "A chill in the air signaling the onset of winter",
      "Leaves still clinging to branches, but many carpets the ground"
    ],
    "daylight": "Short days with darkness descending by 5 PM, creating a sense of early evening in the late afternoon.",
    "time_of_day_of_crime": "Evening — just after dinner when conversation flows and tensions rise.",
    "holidays": [
      "Guy Fawkes Night (Bonfire Night) on November 5"
    ],
    "seasonalActivities": [
      "Preparing for Thanksgiving with family gatherings and feasts",
      "Hunting season in the countryside, popular among the gentry",
      "Enjoying indoor games and parlour entertainment as nights grow colder"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Tailored three-piece suits in dark wool",
        "Bow ties or cravats as evening wear",
        "Overcoats with velvet collars for outdoor wear"
      ],
      "casual": [
        "Tweed jackets paired with flannel trousers",
        "Sweaters with geometric patterns worn over shirts",
        "Caps or flat caps as everyday headwear"
      ],
      "accessories": [
        "Pocket watches with fobs",
        "Leather gloves for warmth and style",
        "Canes or walking sticks for the gentry"
      ]
    },
    "womensWear": {
      "formal": [
        "Long, flowing evening gowns with dropped waists",
        "Cloche hats made from felt or straw",
        "Silk gloves that extend to the elbows for evening events"
      ],
      "casual": [
        "Tea dresses in floral patterns for afternoon outings",
        "Knit cardigans over blouses for comfort",
        "Tweed skirts paired with fitted jackets"
      ],
      "accessories": [
        "Beaded handbags for evening wear",
        "Brooches or decorative pins for added flair",
        "Silk scarves tied around the neck"
      ]
    },
    "trendsOfTheMoment": [
      "The rise of Art Deco influencing both architecture and fashion",
      "Interest in modernist literature and new theatrical styles",
      "Acceptance of mixed fabrics in clothing, such as silk and wool combinations"
    ],
    "socialExpectations": [
      "Formal attire expected at social gatherings, especially among the upper class",
      "Women are expected to maintain a modest yet fashionable appearance",
      "Class distinctions remain strong, influencing interactions at social events"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The ongoing effects of the Great Depression with unemployment rates high",
      "Tensions rising due to the rise of fascist movements in Europe",
      "Political instability in the UK with debates over economic policies"
    ],
    "politicalClimate": "A climate of uncertainty as the Labour Party faces challenges, while the Conservative Party proposes austerity measures to combat the economic crisis.",
    "economicConditions": "The economy is in dire straits, with many families struggling to make ends meet, leading to increased social unrest.",
    "socialIssues": [
      "Widespread poverty and class disparities exacerbated by the Depression",
      "Debates surrounding women's rights and their roles in society",
      "Rising anti-Semitism and xenophobia as fascist ideas spread"
    ],
    "internationalNews": [
      "The implications of the Nazi rise to power in Germany impacting British policy",
      "Unrest in the British colonies, particularly in India",
      "Economic sanctions and trade barriers affecting international relations"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "The music of Cole Porter gaining popularity with its sophisticated lyrics",
        "Bing Crosby's smooth crooning resonating with audiences",
        "Jazz continuing to flourish in urban centers"
      ],
      "films": [
        "The release of 'Scarface', a controversial yet popular gangster film",
        "Classical films like 'The Front Page' captivating audiences with sharp wit",
        "Romantic dramas like 'One Hour with You' becoming box office hits"
      ],
      "theater": [
        "Broadway shows like 'Of Thee I Sing' showcasing political satire",
        "The rise of the musical as a significant form of entertainment",
        "Local productions in small-town theaters bringing community together"
      ],
      "radio": [
        "Popular programs include 'Amos 'n' Andy', entertaining families across the nation",
        "News broadcasts shaping public opinion on current events",
        "Variety shows featuring comedians and musicians captivating listeners"
      ]
    },
    "literature": {
      "recentPublications": [
        "John Steinbeck's 'The Grapes of Wrath' stirring discussions on poverty and resilience",
        "Virginia Woolf's 'To the Lighthouse' exploring themes of consciousness and time",
        "Agatha Christie's latest Poirot mystery engaging readers with suspense"
      ],
      "popularGenres": [
        "Mystery and detective fiction, with a growing audience",
        "Social realism reflecting the struggles of the common man",
        "Modernist literature challenging traditional narratives"
      ]
    },
    "technology": {
      "recentInventions": [
        "The introduction of electric washing machines easing household chores",
        "Advancements in radio technology making broadcasts more accessible",
        "The development of the first commercially available refrigerators"
      ],
      "commonDevices": [
        "Rotary dial telephones becoming commonplace in homes",
        "Typewriters used extensively in businesses and personal correspondence",
        "Petrol-driven cars providing greater mobility for the middle classes"
      ],
      "emergingTrends": [
        "The increasing popularity of home entertainment systems",
        "Rising interest in photography as a hobby with affordable cameras",
        "The spread of public transportation networks in urban areas"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: two pence",
        "Coal scuttle refill: one shilling sixpence"
      ],
      "commonActivities": [
        "Gathering for tea in the afternoon, a staple of social life",
        "Attending local dances and social clubs for entertainment",
        "Participating in hunting or shooting parties during the season"
      ],
      "socialRituals": [
        "Sunday family meals considered a time for bonding and tradition",
        "Formal invitations to dinner parties expected to be answered promptly"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "The upper class maintains a sense of superiority over the working class",
      "Class mobility is limited, with many adhering to traditional roles",
      "Social interactions often dictated by class affiliations"
    ],
    "gender": [
      "Women increasingly advocate for their rights but still face societal restrictions",
      "Expectations for women to embody grace and domesticity remain prevalent",
      "Men are often viewed as the primary breadwinners, leading to tensions in households"
    ],
    "race": [
      "Societal prejudice against immigrant populations is evident",
      "Racism is rampant, particularly towards Jewish communities amid rising anti-Semitic sentiments",
      "Discussions around race are often avoided in polite society"
    ],
    "generalNorms": [
      "Politeness and decorum are expected in social settings",
      "Conformity to traditional values is prevalent among the upper classes",
      "Innovations in culture are often met with skepticism by older generations"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of damp leaves and the promise of winter's chill.",
    "The sound of rain tapping against the windows mingles with the hushed whispers of guests in the manor.",
    "A flickering fire casts shadows across the room, accentuating the tension simmering beneath polite conversation."
  ],
  "paragraphs": [
    "November 1932 finds the country house estate enveloped in an air of intrigue, as the overcast skies and intermittent rain reflect the growing tension among its guests. The days are short, with the sun setting by five o'clock, ushering in an early evening that heightens the sense of suspense. The chill in the air serves as a reminder of the approaching winter, and the guests, cloaked in their tailored suits and elegant gowns, navigate their interactions with a mix of civility and suspicion. With Bonfire Night just behind them, the remnants of celebrations linger in the air, though the spark of joy seems overshadowed by an unshakeable sense of dread.",
    "Fashion during this period showcases a blend of elegance and restraint, with men donning tailored three-piece suits made from dark wool and women adorned in long evening gowns featuring dropped waists. Cloche hats and silk gloves are de rigueur for the women, while men accessorize with pocket watches and leather gloves, exhibiting their social standing. The atmosphere of sophistication is palpable, yet this is juxtaposed with the undercurrents of class tensions and economic strife, as the Great Depression casts a long shadow over the festivities.",
    "Daily life in November 1932 reveals a society grappling with economic hardship, where the price of a loaf of bread remains a constant concern for many families. Social rituals, such as Sunday family dinners and afternoon tea gatherings, continue to provide a semblance of normalcy amidst the chaos. Yet, conversations often veer towards the troubling news of rising unemployment and political instability, creating a palpable unease among the guests. As they engage in parlour games and discussions of the latest literature, the specter of fascism and social injustice looms large, shaping their perspectives and interactions."
  ],
  "note": "",
  "cost": 0.0013475583,
  "durationMs": 16181
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense inheritance gathering at the manor, compounded by the Great Depression's class tensions and the looming threat of political upheaval, forces a diverse group of guests to confront their hidden agendas under the watchful eye of a mechanical clock that may hold deadly secrets.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class tensions are heightened by the Great Depression, with the wealthy and the struggling lower classes colliding in a society rife with suspicion and fear of rising fascism."
  },
  "setting": {
    "location": "A sprawling manor house set in a large estate, surrounded by extensive gardens and isolated from the nearest town.",
    "institution": "Country house estate (Manor house)",
    "weather": "Overcast with intermittent rain, typical of early spring."
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
    "id": "room_temperature",
    "value": "eighty-five degrees Fahrenheit",
    "description": "The temperature recorded at the time of the murder"
  },
  {
    "id": "weight_of_clock",
    "value": "five pounds",
    "description": "The weight of the clock, indicating it was difficult to move without leaving signs"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock shows ten minutes past eleven when discovered.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time of the murder is indicated by the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The time displayed is inconsistent with witness accounts of when Eleanor was last seen.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Contradiction in the timeline of events.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "physical",
      "description": "A slight smudge on the clock face suggests recent handling.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Indicates someone may have tampered with the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The smudge indicates someone adjusted the clock shortly before the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Suggests premeditated manipulation of the time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "The room temperature is inconsistent with the claimed time of death.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Indicates a discrepancy in the murder timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "If the murder occurred at the time indicated by the clock, the room should have been cooler.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Contradicts the timeline of the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock's hands were wound back to mislead witnesses about the time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "Reveals the method of deception regarding the murder time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The time displayed is inconsistent with witness accounts of when Eleanor was last seen.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Contradiction in the timeline of events.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at the party during the time of the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Corroborates Captain Ivor Hale's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "behavioral",
      "description": "Dr. Mallory Finch has shown a desire for Eleanor's inheritance.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "Indicates potential motive for the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was attending to guests during the time of the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Corroborates Beatrice Quill's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_10",
      "category": "temporal",
      "description": "A comparison of the time indicated on the clock and the room's temperature will reveal that the clock was tampered with.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Leads to the conclusion of tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
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
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Ten minutes past eleven remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The guests were all present during the party, making it seem impossible for anyone to commit the crime.",
      "supportsAssumption": "The murder must have occurred during the party when all guests were present.",
      "misdirection": "This misleads by suggesting that the presence of all guests eliminates any possibility of foul play, despite evidence suggesting otherwise."
    },
    {
      "id": "rh_2",
      "description": "The party activities were lively, and everyone appeared to be engaged in conversations.",
      "supportsAssumption": "The murder must have occurred during the party when all guests were present.",
      "misdirection": "This misleads by implying that the vibrant atmosphere precludes any chance of a secretive act, despite the evidence indicating tampering."
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
      "clue_3",
      "clue_4",
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_core_elimination_chain",
      "clue_8",
      "clue_9",
      "clue_10",
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
  "latencyMs": 15066,
  "cost": 0.00487860945
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
