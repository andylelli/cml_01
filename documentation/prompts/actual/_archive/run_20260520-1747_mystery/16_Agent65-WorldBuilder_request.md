# Actual Prompt Record

- Run ID: `mystery-1779299227274`
- Project ID: ``
- Timestamp: `2026-05-20T17:50:47.133Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `3c9638b54bbac856`

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
    "title": "The Clock's Deception",
    "author": "AI Mystery Writer",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (acquaintance)",
        "Beatrice Quill (detective)"
      ],
      "public_persona": "Charming hostess with a keen interest in literature.",
      "private_secret": "Involved in a financial scandal.",
      "motive_seed": "Financial stress due to the Great Depression.",
      "motive_strength": "high",
      "alibi_window": "11:00 AM - 11:30 AM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Garden entrance",
        "Library"
      ],
      "behavioral_tells": [],
      "stakes": "Preservation of reputation and estate.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "friend",
      "relationships": [
        "Eleanor Voss (friend)",
        "Captain Ivor Hale (colleague)",
        "Beatrice Quill (detective)"
      ],
      "public_persona": "Respected physician, dedicated to patient care.",
      "private_secret": "Struggling financially, involved in risky investments.",
      "motive_seed": "Financial desperation.",
      "motive_strength": "moderate",
      "alibi_window": "11:00 AM - 11:30 AM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Study",
        "Garden"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation and finances.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "30-40",
      "role_archetype": "acquaintance",
      "relationships": [
        "Eleanor Voss (acquaintance)",
        "Dr. Mallory Finch (colleague)",
        "Beatrice Quill (detective)"
      ],
      "public_persona": "Charming military officer, admired by guests.",
      "private_secret": "Harboring unrequited feelings for Eleanor.",
      "motive_seed": "Jealousy over Eleanor's financial dealings.",
      "motive_strength": "low",
      "alibi_window": "11:00 AM - 11:30 AM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Library",
        "Garden"
      ],
      "behavioral_tells": [],
      "stakes": "His feelings for Eleanor.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "detective",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (colleague)",
        "Captain Ivor Hale (acquaintance)"
      ],
      "public_persona": "Sharp-witted investigator known for her keen observations.",
      "private_secret": "Has a hidden past involving a previous case.",
      "motive_seed": "Desire for justice.",
      "motive_strength": "high",
      "alibi_window": "11:00 AM - 11:30 AM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Study",
        "Library"
      ],
      "behavioral_tells": [],
      "stakes": "Professional integrity.",
      "evidence_sensitivity": [],
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
      "summary": "During a tense gathering at the estate of Eleanor Voss, the charming hostess is found dead under mysterious circumstances. All evidence points to a tampered clock, leading to a complex web of motives and deceit as the guests grapple with the timing of the events that led to her demise."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock in the study was tampered with, showing the time as quarter past eleven instead of the actual time of the murder.",
      "delivery_path": [
        {
          "step": "Eleanor was seen alive at quarter to eleven."
        },
        {
          "step": "The clock was adjusted to mislead everyone about the time of death."
        },
        {
          "step": "The actual time of death was around ten past eleven."
        }
      ]
    },
    "outcome": {
      "result": "Dr. Mallory Finch is revealed as the murderer."
    }
  },
  "false_assumption": {
    "statement": "The murder must have occurred after Eleanor's last known interaction with guests.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock shows a time that suggests everyone was accounted for.",
    "what_it_hides": "The true time of death was much earlier, allowing for the killer to have left the scene unnoticed."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Eleanor seen at quarter to eleven",
        "Clock shows quarter past eleven"
      ],
      "windows": [
        "11:00 AM - 11:30 AM"
      ],
      "contradictions": [
        "Clock shows incorrect time",
        "Witness statements conflict with clock time"
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Eleanor Voss",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Clock",
        "Note",
        "Garden entrance"
      ],
      "permissions": [
        "Access to Study",
        "Access to Garden"
      ]
    },
    "physical": {
      "laws": [
        "Timekeeping accuracy",
        "Physical access limitations"
      ],
      "traces": [
        "Dust on clock",
        "Freshly disturbed soil in the garden"
      ]
    },
    "social": {
      "trust_channels": [
        "Friendship between Eleanor and Dr. Finch"
      ],
      "authority_sources": [
        "Dr. Finch's medical credentials"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock shows the time as quarter past eleven.",
        "correction": "The clock has been tampered with to mislead the investigation.",
        "effect": "Narrows the time of death to before this indicated time.",
        "required_evidence": [
          "Eleanor was last seen alive at quarter to eleven.",
          "Witness statements confirm Eleanor's movements.",
          "The clock hands are dusty, indicating they were not recently adjusted."
        ],
        "reader_observable": true
      },
      {
        "observation": "A note found in Eleanor's hand mentions an appointment at quarter past eleven.",
        "correction": "The note suggests Eleanor was expecting to meet someone at this time.",
        "effect": "Indicates that Eleanor was alive until just before the time the clock shows.",
        "required_evidence": [
          "The note itself detailing the appointment.",
          "Witness statements that Eleanor planned to leave the study.",
          "Dr. Finch's alibi places him away from the clock at this time."
        ],
        "reader_observable": true
      },
      {
        "observation": "Freshly disturbed soil indicates a struggle occurred in the garden.",
        "correction": "The struggle likely happened just before Eleanor was killed.",
        "effect": "Eliminates Captain Hale as he was seen away from the garden.",
        "required_evidence": [
          "Footprints leading from the garden to the house.",
          "Witness statements placing Finch in the vicinity of the garden.",
          "The time of death calculated based on disturbance patterns."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, quarter, and eleven against the claimed timeline.",
    "knowledge_revealed": "The discrepancy between the clock and Dr. Finch's watch proves the clock was tampered with.",
    "pass_condition": "Dr. Finch's watch must show a time consistent with the actual events leading to Eleanor's death.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's tampered time and Eleanor's last sighting help establish the timeline. Step 2: The note reveals her expected meeting time. Step 3: The struggle's evidence eliminates other suspects and leads directly to Finch's guilt."
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
        "Observe the clock's time compared to Dr. Finch's watch",
        "Draw conclusion about tampering"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proving his alibi of being seen away from the garden.",
        "supporting_clues": [
          "clue_2",
          "clue_3"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Eleanor is deceased.",
        "supporting_clues": [
          "clue_1"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of clock tampering."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation of the clock."
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Finding the note in Eleanor's hand."
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Observation of the disturbed soil."
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
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a charming socialite, is known for her charitable endeavours and elegant gatherings, yet beneath her polished exterior lies a web of deceit and desperation.",
    "publicPersona": "With a radiant smile and a heart that seems perpetually engaged in philanthropic pursuits, Eleanor is the darling of Little Middleton's elite. Her soirées are the talk of the town, and her charitable work has earned her a reputation as a benevolent heiress. She navigates the social scene with grace, ensuring that everyone sees her as the epitome of generosity and charm.",
    "privateSecret": "However, Eleanor is ensnared in a financial quagmire, having embezzled substantial funds from her late father's estate to maintain her lavish lifestyle. The weight of her debt looms over her like a dark cloud, and she fears exposure more than anything else.",
    "motiveSeed": "Eleanor stands to inherit her father's estate but is threatened by the victim's plans to alter the will, which could strip her of her financial security and social standing.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims she was in the garden from eight until nine-thirty, tending to the flowers, a task she finds both therapeutic and distracting.",
    "accessPlausibility": "easy",
    "stakes": "If the truth comes to light, Eleanor risks losing not just her inheritance but the very status she has fought so hard to maintain.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Eleanor speaks with an articulate and refined cadence, often punctuating her sentences with light laughter. She has a tendency to use flowery language, particularly when discussing her charitable efforts, but her sarcasm surfaces when she feels threatened or cornered.",
    "internalConflict": "Eleanor grapples with the moral implications of her deception, torn between her desire for social acceptance and the guilt of her actions that jeopardize her father’s legacy.",
    "personalStakeInCase": "This crime matters deeply to Eleanor because it threatens her carefully curated existence; exposure could lead to scandal, shattering the illusion of her perfect life.",
    "paragraphs": [
      "Eleanor Voss stood in the garden, the moonlight casting a silver sheen on the flowers she had claimed to be tending. She was the embodiment of grace, but as she bent to adjust a wilting petal, her heart raced with the knowledge that her carefully constructed world was on the brink of collapse. The late-night gatherings had become a façade, a way to distract from her financial ruin that loomed like a spectre over her every decision.",
      "To the outside world, Eleanor was the charming heiress, always gracious and poised, often seen at charity events with a smile that could melt the iciest of hearts. Yet, behind closed doors, her laughter echoed hollowly, filled with the secrets of her embezzlement. The threat posed by the victim’s intent to alter the will sent shivers down her spine; it was a direct challenge to the security she clung to with desperate hands.",
      "Her alibi was simple enough — a stroll through the garden, a place where she could pretend to be one with nature while plotting her next move. The irony was not lost on her; she was nurturing flowers while simultaneously poisoning her future. If anyone discovered the truth, she would be cast out from the very society she sought to dominate, her name synonymous with scandal.",
      "Eleanor's internal conflict festered within, a battle between her ambition and her conscience. She envisioned her life unraveling, the whispers and pointed fingers that would follow her should her secrets be laid bare. This crime, this murder, was not just an event to her; it was a potential door to her salvation or her doom. And as she looked up at the stars, she wondered how far she was willing to go to protect her legacy."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician with a passion for healing, yet her commitment to her patients is overshadowed by her morally questionable experiments.",
    "publicPersona": "Known for her dedication to the community and her patients, Dr. Finch is often regarded as the backbone of Little Middleton's healthcare. With a warm demeanor and a steady hand, she is beloved by many, often seen at the local hospital or attending to patients in their homes, embodying the spirit of a true healer.",
    "privateSecret": "Behind this facade lies a darker truth: Mallory has been conducting unethical experiments to secure funding for her practice, risking the safety of her patients in pursuit of financial stability.",
    "motiveSeed": "The victim’s threat to expose her malpractice looms over her, putting her career and reputation in jeopardy.",
    "motiveStrength": "compelling",
    "alibiWindow": "Dr. Finch claims she attended a dinner at the manor from seven until nine, surrounded by the very people who would vouch for her.",
    "accessPlausibility": "possible",
    "stakes": "If discovered, her career as a respected physician would be irreparably damaged, along with her livelihood and the trust of her community.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with a calm, measured tone, often adopting a clinical vocabulary that underscores her profession. Her humor is subtle, often laced with irony, and she has a habit of pausing for emphasis, allowing her words to resonate.",
    "internalConflict": "Mallory is caught in a moral quagmire, torn between her ambition to succeed and the ethical implications of her actions, fearing that her desire for recognition may lead to irreversible harm.",
    "personalStakeInCase": "This case hits home for Mallory as it directly threatens her career; the victim’s knowledge could unravel her life’s work and destroy her reputation.",
    "paragraphs": [
      "Dr. Mallory Finch surveyed the dining room, the laughter of her fellow guests a stark contrast to the turmoil brewing within her. She was a physician, a healer, yet she felt like a fraud, concealing her unethical practices beneath a veneer of professionalism. The very patients she swore to protect were at risk from her desperate attempts to secure funding for her practice, and the weight of that secret pressed heavily on her conscience.",
      "To the townsfolk, she was the epitome of compassion, always ready with a comforting word or a steady hand. But as she engaged in polite conversation, her mind raced with the implications of the victim's threat to expose her misdeeds. The stakes had never been higher; her reputation and livelihood hung in the balance, and the thought of losing everything she had worked for was unbearable.",
      "Mallory's alibi was as solid as the oak table before her, yet she felt the unease gnawing at her gut. Dinner had been a pleasant distraction, but as the clock ticked on, she could not shake the feeling that time was running out for her. The victim's knowledge was a ticking bomb, and she was the one who had set it in motion. Each laugh from the guests felt like a reminder of the deception she was ensnared in.",
      "In that moment, Mallory's internal conflict became palpable. She wanted to be a respected figure, a beacon of hope in the community, yet the very foundation of her career was built on shaky ground. The thought of exposure filled her with dread, and as she raised her glass in a toast, she couldn't help but wonder if this would be her last moment of camaraderie before the truth shattered her world."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a dignified retired naval officer, struggles with resentment towards the victim who threatens his family's legacy and honor.",
    "publicPersona": "With an air of authority and a penchant for storytelling, Captain Hale is a revered figure in Little Middleton. His military past lends him a distinguished presence, often reminiscing about his days at sea, captivating audiences with tales of valor and honor. He is respected, yet carries an air of nostalgia for a time that has long since passed.",
    "privateSecret": "Beneath the surface, Hale harbors a deep-seated resentment towards the victim, who has usurped family land and wealth, threatening the legacy he holds dear.",
    "motiveSeed": "The victim's plans to sell the family estate for profit strike at the very heart of Hale's identity, as he views it as a direct assault on his family's honor.",
    "motiveStrength": "strong",
    "alibiWindow": "Ivor insists he was in the study from eight-thirty until ten, presumably with a glass of brandy and a book, reminiscing about days gone by.",
    "accessPlausibility": "possible",
    "stakes": "For Ivor, the stakes are monumental; his family's legacy and honor hang in the balance, and he feels the weight of history pressing down upon him.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor's speech is punctuated by a commanding tone, often laced with dry wit. He has an affinity for grandiose language, frequently drawing on naval metaphors, and his laughter is deep, often tinged with bitterness.",
    "internalConflict": "Ivor grapples with the realization that his rigid adherence to tradition may be leading him down a path of resentment rather than acceptance, forcing him to confront the changing tides of his life.",
    "personalStakeInCase": "This crime matters deeply to Ivor as it threatens not only his familial legacy but also the honor he has fought to uphold throughout his life.",
    "paragraphs": [
      "Captain Ivor Hale leaned back in his study, the shadows dancing across the walls as the hour grew late. He gazed at the framed photographs of his ancestors, the proud men and women who had shaped his family’s legacy. But as he sipped his brandy, a bitter taste lingered in his mouth, for he knew that the victim's plans to sell the family estate were a direct affront to everything he held dear.",
      "To the townsfolk, Ivor was a dignified figure, often regaling them with tales of his naval exploits. Yet beneath that polished exterior lay a man grappling with resentment. The victim had usurped his family’s wealth, and each passing day felt like a reminder of his fading legacy. His alibi was solid; he had been in the study, but the thought of the victim’s betrayal gnawed at him like a persistent itch he could not scratch.",
      "The stakes were high, and Ivor felt the weight of history pressing upon him. He had devoted his life to upholding his family's honor, yet he found himself at a crossroads. Would he cling to the past, or would he adapt to the changing tides that threatened to wash away everything he had known? His internal conflict brewed like a storm on the horizon, a battle between tradition and the inevitable evolution of time.",
      "As he contemplated the events of the evening, Ivor's sardonic humor surfaced, tinged with bitterness. 'Ah, the folly of youth,' he mused aloud, 'they know not the price of ambition.' Yet, deep down, he knew he was as much a prisoner of his own making, caught between the legacy he cherished and the reality that loomed ever closer."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a cunning governess, navigates the complexities of her ambitions and relationships, all while hiding a scandalous affair.",
    "publicPersona": "Sweet and diligent, Beatrice is the devoted governess to the Hale children, often seen as a nurturing figure who provides both education and care. Her gentle demeanor and unwavering commitment to her charges earn her the affection of the family and community alike.",
    "privateSecret": "However, beneath her sweet exterior, Beatrice is entangled in an affair with Captain Hale, using it as a means to secure a better position in life.",
    "motiveSeed": "The victim's threat to dismiss her jeopardizes not only her relationship with Hale but also her aspirations for a more secure future.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims she was in the nursery with the children from eight until nine, ensuring they were tucked in and safe.",
    "accessPlausibility": "easy",
    "stakes": "Her ambitions and relationship with Hale are at risk, and she feels the pressure of her precarious position.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks in a soft, melodic tone, often punctuating her sentences with gentle laughter. She has a tendency to use endearing phrases and often downplays her own significance, which belies her cunning nature.",
    "internalConflict": "Beatrice struggles with her desire for upward mobility against the reality of her position, feeling torn between her ambitions and the moral implications of her actions.",
    "personalStakeInCase": "This crime matters to Beatrice because it threatens her future with Captain Hale; should the victim's threats materialize, her dreams of a better life could vanish.",
    "paragraphs": [
      "Beatrice Quill stood in the nursery, surrounded by the soft glow of nightlights and the gentle sounds of sleeping children. As the governess, she was the picture of nurturing care, yet behind her sweet smile lay a web of ambition that could ensnare her if she wasn’t careful. She had become entangled with Captain Hale, a relationship that promised more than mere affection; it was her ticket to a life of security.",
      "To the world, Beatrice was the diligent caretaker, always ready with a kind word and a patient smile. But as she tucked the children into bed, her mind raced with the implications of the victim's threats. Dismissal from her position would not only sever her connection to the Hale family but would also jeopardize her future with Ivor, a prospect that filled her with dread. Her alibi was airtight; she had been in the nursery, yet the uncertainty gnawed at her.",
      "The stakes were high, and Beatrice felt the pressure mounting. She had dreams of climbing the social ladder, of escaping the confines of her current role, yet the reality of her affair weighed heavily on her conscience. She often found herself caught between the allure of ambition and the moral quandaries of her choices. With each passing day, the risk of exposure loomed larger, threatening to unravel everything she had worked for.",
      "As she reflected on her situation, Beatrice's self-deprecating humor emerged, a defense mechanism against the harsh realities of her life. 'Oh, if only I could teach ambition as easily as I teach the children,' she mused, a bittersweet smile gracing her lips. Yet, deep down, she knew that her cunning nature could either lead her to triumph or plunge her into chaos, and she was determined to navigate the treacherous waters ahead."
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
    "summary": "An expansive manor house with grand architecture, surrounded by sprawling gardens and a sense of isolation that heightens the atmosphere of mystery.",
    "visualDescription": "The manor boasts a stately façade of weathered stone, adorned with ivy creeping up its walls; large bay windows reflect the overcast sky, while intricate woodwork around the doors hints at a bygone elegance.",
    "atmosphere": "A palpable tension lingers in the air, amplified by the isolation and the recent unsettling events that have transpired within its walls.",
    "paragraphs": [
      "Little Middleton Manor stands as a testament to a bygone era, its grand façade looming over the sprawling gardens that stretch into the misty distance. The air is thick with the scent of damp earth and wet foliage, as rain showers intermittently sweep across the grounds, casting a shadow of gloom upon the estate. The sound of water trickling in the gutters mixes with the distant call of a lark, creating an eerie contrast to the unease that pervades the manor, where laughter once echoed but now hangs heavy with secrets.",
      "Upon entering the manor, one is greeted by the rich aroma of polished wood and beeswax, a stark reminder of the care taken to maintain its former glory. The drawing room, with its plush velvet drapes and antique furniture, feels like a voyeuristic glimpse into a world of opulence, now tainted by the recent tragedy. The flicker of candlelight casts dancing shadows across the walls, revealing family portraits that seem to watch over the unfolding drama with silent judgment.",
      "The layout of the manor is labyrinthine, with hidden nooks and crannies that create opportunities for concealment and discovery alike. Guests are often guided through the public spaces, while the upper floors remain a mystery, restricted to select family members and staff. This careful segregation of spaces mirrors the rigid class structures of the time, where the Great Depression has heightened social tensions, making every interaction loaded with unspoken implications.",
      "As the day wanes, the atmosphere shifts, the gardens outside becoming a darkened maze shrouded in mist. The distant sound of a clock strikes the hour, its echo reverberating through the halls, reminding all within that time is both a friend and a foe. With each passing moment, the tension mounts, as the truth behind the clock's deception threatens to unravel, revealing the tangled web of relationships and motives hidden within the grand walls of Little Middleton Manor."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "overcast with occasional rain showers, typical of the English countryside",
    "timeFlow": "Days of mounting tension leading to the revelation of dark secrets",
    "mood": "tense, with an underlying sense of unease due to recent events",
    "eraMarkers": [
      "Petrol touring cars parked along the gravel drive",
      "Typewriters clacking in the study",
      "Early telephone exchanges buzzing with gossip"
    ],
    "sensoryPalette": {
      "dominant": "The musty scent of damp stone and decay",
      "secondary": [
        "The soft rustle of silk curtains",
        "The distant sound of thunder rolling in"
      ]
    },
    "paragraphs": [
      "A heavy stillness blankets the estate, punctuated only by the occasional flutter of leaves and the distant rumble of thunder. The overcast sky casts a pall over the manor, where shadows stretch long and the air is laden with the scent of impending rain. The gardens, once vibrant with blooms, now seem to retreat into the earth, mirroring the secrets buried beneath the surface of this seemingly tranquil home.",
      "In the heart of the manor, the ticking of clocks echoes like a heartbeat, each second a reminder of the tension that hangs in the air. As dusk approaches, the flickering candlelight reveals the deep lines of worry etched on the faces of its inhabitants, their whispered conversations tinged with suspicion and fear. The manor, with its many wings and hidden corridors, transforms into a character of its own, harboring both the memories of joy and the specter of tragedy that now pervades its halls."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Dark oak shelves lined with dusty tomes, a large fireplace dominating one wall, deep armchairs arranged around a small table",
      "sensoryDetails": {
        "sights": [
          "Shadows flickering from the fireplace",
          "Candlelight illuminating leather-bound books",
          "Dust motes dancing in the air"
        ],
        "sounds": [
          "The crackle of burning logs",
          "The rustle of pages turning",
          "A distant clock chiming"
        ],
        "smells": [
          "Beeswax and old leather",
          "A hint of damp stone",
          "Cold ash lingering in the air"
        ],
        "tactile": [
          "Worn leather armchair cushions",
          "The chill of the marble fireplace surround",
          "Smooth, cool pages of ancient books"
        ]
      },
      "accessControl": "Accessible to family and select guests; staff must knock and wait for permission to enter.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streaking the windowpanes",
            "Grey light filtering through heavy drapes"
          ],
          "sounds": [
            "Steady drumming of rain on the roof",
            "The soft patter of droplets hitting the ground"
          ],
          "smells": [
            "Fresh, damp earth",
            "A hint of mildew in the air",
            "Cold stone from the fireplace"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light dulling colors",
            "Long shadows creeping across the floor"
          ],
          "sounds": [
            "The creaking of the old oak beams",
            "Distant whispers echoing in the silence"
          ],
          "smells": [
            "Dusty books and woodsmoke",
            "A lingering scent of polished furniture"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight reflecting off polished surfaces",
            "Last rays of sunlight fading through the windows"
          ],
          "sounds": [
            "The tick of a mantel clock",
            "Soft laughter from the drawing room"
          ],
          "smells": [
            "Candle wax melting",
            "A hint of tobacco smoke",
            "The fading warmth of the fire"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, with its dark oak shelves and high ceiling, exudes an air of quiet contemplation, but now it feels like a stage for secrets. The flickering candlelight barely illuminates the spines of forgotten tomes, casting eerie shadows that seem to whisper of the past. In one corner, a large fireplace, now cold and empty, looms over the room, its mantle adorned with trinkets that speak of better days. This is where the final act unfolded, leaving behind an unsettling stillness that betrays the violent history etched into the very walls.",
        "As the rain patters against the windows, the atmosphere grows heavier, thick with the scent of damp wood and lingering fear. The worn leather armchairs, once inviting, now feel like prison cells, holding the weight of unspoken words. The distant sound of a clock ticking seems to mock the stillness, each tick a reminder that time is running out for those entangled in the mystery that has unfolded here."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Luxurious furnishings, a grand piano in the corner, large windows draped with heavy curtains",
      "sensoryDetails": {
        "sights": [
          "Richly colored rugs on polished wood floors",
          "Gilded frames holding family portraits",
          "The flickering glow of a fire"
        ],
        "sounds": [
          "The soft thud of footsteps on carpet",
          "Murmurs of conversation",
          "The distant sound of a piano playing"
        ],
        "smells": [
          "Lavender and sandalwood incense",
          "The faint scent of freshly polished furniture",
          "A hint of smoke from the fireplace"
        ],
        "tactile": [
          "Soft velvet upholstery",
          "Cool marble fireplace surround",
          "Warmth radiating from the fire"
        ]
      },
      "accessControl": "Open to guests during gatherings; private conversations may occur but are often overheard.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Dull light filtering through rain-soaked curtains",
            "Puddles forming on the terrace outside"
          ],
          "sounds": [
            "Rain tapping against the window",
            "The sound of a piano playing softly"
          ],
          "smells": [
            "Wet earth and damp fabric",
            "A hint of mildew in the air"
          ],
          "mood": "sombre"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light dulling the colors of the room",
            "Shadows creeping across the furniture"
          ],
          "sounds": [
            "The creaking of old timbers",
            "Soft laughter echoing in the distance"
          ],
          "smells": [
            "Dust and old books",
            "Lingering scent of a recently extinguished fire"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight casting a warm glow",
            "The last rays of sunlight illuminating the room"
          ],
          "sounds": [
            "The soft clinking of glasses",
            "The hum of conversation"
          ],
          "smells": [
            "Freshly brewed tea",
            "A hint of tobacco smoke",
            "The sweet scent of pastries"
          ],
          "mood": "festive yet uneasy"
        }
      ],
      "paragraphs": [
        "The drawing room, with its lavish furnishings and grand piano, serves as a social hub for the manor's inhabitants. Sunlight streaming through the large windows casts a warm glow on the rich textures of the room, inviting guests to relax and engage in whispered conversations. However, beneath the surface of hospitality lies a current of tension, as each guest is acutely aware of the secrets swirling around them, hidden behind polite smiles and forced laughter.",
        "As the evening progresses, the atmosphere shifts; the flickering candlelight creates a dance of shadows that feels almost alive, while the distant sound of a clock ticking serves as a reminder of the passage of time. The scents of lavender and sandalwood mingle with the warmth of the fire, wrapping the room in a deceptive comfort. In this space, where laughter and tension coexist, the truth is as elusive as the shadows that play across the walls."
      ]
    },
    {
      "id": "garden",
      "name": "The Garden",
      "type": "exterior",
      "purpose": "Isolation and concealment",
      "visualDetails": "Overgrown hedges, winding paths, and a dilapidated gazebo shrouded in ivy",
      "sensoryDetails": {
        "sights": [
          "Wildflowers struggling to bloom",
          "Overgrown paths and tangled vines",
          "A broken fountain at the center"
        ],
        "sounds": [
          "The rustling of leaves in the wind",
          "Birds chirping in the distance",
          "The distant rumble of thunder"
        ],
        "smells": [
          "Freshly turned soil",
          "A hint of decay from fallen leaves",
          "The fragrance of wildflowers"
        ],
        "tactile": [
          "Rough bark of ancient trees",
          "Soft petals brushing against fingers",
          "The chill of damp earth underfoot"
        ]
      },
      "accessControl": "Accessible to all, but certain areas are overgrown and avoided; staff only venture here for maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops clinging to leaves",
            "Muddy paths glistening in the grey light"
          ],
          "sounds": [
            "Puddles forming beneath the trees",
            "The soft pattering of rain on flower petals"
          ],
          "smells": [
            "Wet earth and fresh grass",
            "A hint of mildew in the air"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light dulling the colors of the flowers",
            "Shadows lengthening across the garden"
          ],
          "sounds": [
            "The distant sound of a clock chiming",
            "A soft breeze rustling through the leaves"
          ],
          "smells": [
            "Damp earth and decaying foliage",
            "A hint of sweet wildflowers"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Stars beginning to twinkle in the twilight",
            "Shadows creeping across the garden paths"
          ],
          "sounds": [
            "Crickets chirping in the evening air",
            "The distant sound of laughter from the manor"
          ],
          "smells": [
            "Night-blooming flowers releasing their fragrance",
            "Cool breeze carrying hints of fresh grass"
          ],
          "mood": "mysterious"
        }
      ],
      "paragraphs": [
        "The garden surrounding Little Middleton Manor is a tangled labyrinth of overgrown hedges and winding paths, where nature has begun to reclaim its territory. The air is thick with the scent of damp earth and the fragrance of wildflowers that struggle to bloom amidst the encroaching foliage. This once meticulously maintained space now harbors secrets, with the dilapidated gazebo shrouded in ivy serving as a silent witness to whispered conversations and clandestine meetings.",
        "As evening falls, the garden transforms into a shadowy realm, where the last flickers of daylight fade and the stars begin to twinkle overhead. The rustling leaves and distant sounds of laughter from the manor create an atmosphere of mystery, as if the garden itself is holding its breath, waiting for the next chapter of intrigue to unfold. Here, in this secluded enclave, the truth may be hidden, waiting to be uncovered by those daring enough to venture into the darkened paths."
      ]
    }
  ],
  "note": "",
  "cost": 0.0020824715999999996,
  "durationMs": 30636
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1934,
    "month": "January",
    "day": null,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "overcast skies with intermittent rain",
      "chilly winds sweeping across the fields",
      "muddy roads from recent downpours"
    ],
    "daylight": "Short winter days with twilight descending by four o'clock, leaving the countryside in a shroud of early darkness",
    "time_of_day_of_crime": "Late evening — between eight and ten o'clock at night, when shadows deepen and the house feels particularly isolated",
    "holidays": [
      "New Year's Day (January 1)"
    ],
    "seasonalActivities": [
      "hunting on the estate grounds",
      "attending local dances in the village hall",
      "enjoying fireside gatherings with storytelling"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "dark wool three-piece suits",
        "tailored overcoats with velvet collars",
        "cravats replacing ties for evening wear"
      ],
      "casual": [
        "tweed jackets for country outings",
        "corduroy trousers for comfort",
        "woolen sweaters with patterns"
      ],
      "accessories": [
        "leather gloves",
        "newsboy caps",
        "pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dresses with drop waists",
        "satin evening gowns with long sleeves",
        "fur stoles for added warmth"
      ],
      "casual": [
        "knitted cardigans",
        "checkered skirts",
        "blouses with puffed sleeves"
      ],
      "accessories": [
        "cloche hats adorned with ribbons",
        "pearl necklaces",
        "gloves that match the dress"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design and fashion",
      "the rise of sportswear for women",
      "the popularity of tailored suits for men"
    ],
    "socialExpectations": [
      "strict adherence to class distinctions",
      "ladies expected to maintain decorum in public",
      "men are to be chivalrous and protective"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "economic tensions in the UK due to the ongoing effects of the Great Depression",
      "increased discussions about the rise of fascism in Europe",
      "political unrest stemming from the recent election results"
    ],
    "politicalClimate": "A period of instability and uncertainty, with local elections reflecting a divided populace and growing support for extremist parties",
    "economicConditions": "High unemployment rates and food prices fluctuating, creating a strain on everyday life for the working class",
    "socialIssues": [
      "class disparity exacerbated by economic hardship",
      "gender roles questioned as women seek employment",
      "debates on immigration policies"
    ],
    "internationalNews": [
      "Hitler consolidating power in Germany",
      "increased tensions in the Far East as Japan expands its influence",
      "news of unrest in Italy under Mussolini"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'The Man I Love' by George Gershwin",
        "'Puttin' on the Dog' by the Savoy Orpheans",
        "jazz tunes from Duke Ellington"
      ],
      "films": [
        "'The Thin Man' starring William Powell and Myrna Loy",
        "'The Private Life of Don Juan' featuring Douglas Fairbanks",
        "'The Count of Monte Cristo' starring Robert Donat"
      ],
      "theater": [
        "'The Royal Family', a comedic take on theatrical life",
        "'Tobacco Road', a drama about poverty",
        "'The Last of Mrs. Cheyney', a comedy of manners"
      ],
      "radio": [
        "The BBC's Evening News",
        "music programs featuring popular orchestras",
        "dramatizations of literary classics"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in Mesopotamia' by Agatha Christie",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Glass Key' by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "romantic novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first car radio",
        "the development of the automatic telephone exchange",
        "advancements in motion picture technology"
      ],
      "commonDevices": [
        "telephones in most homes",
        "typewriters in offices",
        "gramophones for playing records"
      ],
      "emergingTrends": [
        "the rise of home entertainment systems",
        "increased interest in aviation technology",
        "growing popularity of automobiles for leisure travel"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Coal scuttle refill: one shilling sixpence",
        "Taxi across town: two shillings"
      ],
      "commonActivities": [
        "visiting the local pub for socializing",
        "participating in community events such as dances",
        "enjoying afternoon tea with neighbors"
      ],
      "socialRituals": [
        "formal Sunday dinners with family",
        "evening games of bridge or charades",
        "seasonal charity balls to raise funds for the less fortunate"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "strong feelings of class superiority among the wealthy",
      "growing resentment among the working class towards the elite",
      "social mobility viewed as threatening to traditional hierarchies"
    ],
    "gender": [
      "women increasingly assertive in seeking careers",
      "men expected to be the primary breadwinners",
      "traditional gender roles still prevalent in many areas"
    ],
    "race": [
      "racial tensions exacerbated by economic conditions",
      "increased visibility of anti-immigrant sentiments",
      "cultural appreciation of non-Western art and literature growing but limited"
    ],
    "generalNorms": [
      "formal dress required for social gatherings",
      "strict etiquette observed in upper-class circles",
      "expectation of punctuality and decorum in public spaces"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth mixed with the faint aroma of wood smoke from the estate's chimneys",
    "The soft patter of rain against the windowpanes, creating a rhythm that heightens the sense of isolation",
    "The low murmur of voices from the drawing room, punctuated by the clinking of teacups and the occasional laughter, masking an underlying tension"
  ],
  "paragraphs": [
    "In January 1934, the English countryside is enveloped in a cloak of overcast skies, with rain showers sweeping through the fields, muddying the once pristine estate grounds. The chill in the air carries a sense of unease, as the darkening days draw early nightfall, and the manor house stands stoic against the encroaching gloom. Inside, the warmth of the fire contrasts sharply with the biting cold outside, creating a microcosm of safety amidst the world’s uncertainties.",
    "Fashion reflects the era’s complexities, as men don dark wool suits and tailored overcoats adorned with velvet collars, while women embrace the elegance of tea dresses with drop waists and fur stoles for warmth. Accessories like leather gloves and cloche hats add a touch of sophistication, yet the practicality of corduroy trousers and knitted cardigans reveals a growing trend towards comfort in the face of economic hardship. The social expectations of the time remain rigid, with strict adherence to class distinctions dictating interactions within the manor.",
    "Daily life in January 1934 is marked by community gatherings and social rituals, with villagers attending dances in local halls and enjoying fireside storytelling on long winter nights. Prices for basic commodities remain reasonable, yet the shadow of the Great Depression lingers, creating a palpable tension between classes. As the evening draws in, the sounds of jazz music waft from the gramophones, blending with the laughter from the drawing room, where card games and conversations mask the underlying fears of the political climate and economic instability that threaten to unravel the very fabric of society."
  ],
  "note": "",
  "cost": 0.00112557225,
  "durationMs": 17577
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense inheritance gathering at the manor, under the shadow of the Great Depression and rising fascism, compels heirs and staff to navigate strict social hierarchies amidst growing class tensions.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class tensions are heightened by economic hardship, with strict hierarchies influencing interactions and political discussions reflecting the rise of fascism in Europe."
  },
  "setting": {
    "location": "An expansive manor house in the English countryside, surrounded by large gardens and multiple wings for servants and guests.",
    "institution": "Country house estate",
    "weather": "Overcast with occasional rain showers, typical of the English countryside."
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
    "id": "appointment_time",
    "value": "a quarter past eleven",
    "description": "The time mentioned in a note found with the victim"
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
      "description": "The clock shows the time as quarter past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time displayed is inconsistent with witness statements.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The clock has been tampered with to mislead the investigation.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The clock's incorrect time casts doubt on the timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "A note found in Eleanor's hand mentions an appointment at quarter past eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "Eleanor was expecting to meet someone at that time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The note suggests Eleanor was expecting to meet someone at this time.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "Indicates a motive for the meeting.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "Freshly disturbed soil indicates a struggle occurred in the garden.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Evidence of a confrontation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The struggle likely happened just before Eleanor was killed.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Establishes a timeline for the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock in the study was tampered with, showing the time as quarter past eleven instead of the actual time of the murder.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[2]",
      "pointsTo": "Reveals the core mechanism of the deception.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock has been tampered with to mislead the investigation.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Contradicts the assumption that the clock shows the correct time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Dr. Mallory Finch was seen in the study at the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Eliminates Dr. Mallory Finch as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "temporal",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Eleanor seen at quarter to eleven remains a late texture detail in the case background.",
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
      "description": "Witnesses claim that the murder must have occurred after known's last known interaction with guests.",
      "supportsAssumption": "The murder must have occurred after Eleanor's last known interaction with guests.",
      "misdirection": "This statement is misleading as it does not account for the tampering of the eleanors."
    },
    {
      "id": "rh_2",
      "description": "Some believe that interaction was alone in the house when the murder took place.",
      "supportsAssumption": "The murder must have occurred after Eleanor's last known interaction with guests.",
      "misdirection": "This theory overlooks potential accomplices who could have entered unnoticed."
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
      "clue_core_contradiction_chain",
      "clue_culprit_direct_dr_mallory_finch"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_core_elimination_chain"
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
  "latencyMs": 12775,
  "cost": 0.00400630725
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
