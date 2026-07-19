# Actual Prompt Record

- Run ID: `mystery-1784453886696`
- Project ID: ``
- Timestamp: `2026-07-19T09:41:03.651Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `0348335df3c63cd8`

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
    "author": "Mystery Writer",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Grand Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical tampering"
    }
  },
  "death_method": "struck with a heavy object",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Hotel manager",
      "private_secret": "Former soldier",
      "motive_seed": "Protecting hotel reputation",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM - 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Lobby",
        "Terrace"
      ],
      "behavioral_tells": [],
      "stakes": "Hotel's future",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Expert",
      "relationships": [],
      "public_persona": "Local physician",
      "private_secret": "Pursuing an affair",
      "motive_seed": "Protecting reputation",
      "motive_strength": "high",
      "alibi_window": "9:00 PM - 10:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Clinic",
        "Hotel"
      ],
      "behavioral_tells": [],
      "stakes": "Professional integrity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Witness",
      "relationships": [],
      "public_persona": "Retired naval officer",
      "private_secret": "Hides a gambling problem",
      "motive_seed": "Financial desperation",
      "motive_strength": "low",
      "alibi_window": "8:30 PM - 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Terrace"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation among peers",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Assistant",
      "relationships": [],
      "public_persona": "Hotel staff",
      "private_secret": "Secretly in love with Hugo",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM - 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Back office",
        "Lobby"
      ],
      "behavioral_tells": [],
      "stakes": "Personal happiness",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Private investigator",
      "private_secret": "Close friend of the victim",
      "motive_seed": "Seeking justice",
      "motive_strength": "high",
      "alibi_window": "8:00 PM - 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Terrace",
        "Lobby"
      ],
      "behavioral_tells": [],
      "stakes": "Friendship loyalty",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Businessman",
      "private_secret": "Involved in shady dealings",
      "motive_seed": "Fear of exposure",
      "motive_strength": "high",
      "alibi_window": "evening",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation and life",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
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
      "summary": "In a grand seaside hotel, the mysterious death of businessman Hugo Vane stirs tensions among the guests and staff. As the clock strikes an unusual hour, a detective unravels a mechanical tampering that reveals hidden motives and dark secrets."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A clock was rewound to misrepresent the time of death, aligning it with a scheduled inspection.",
      "delivery_path": [
        {
          "step": "Clock in the lobby was tampered with to show a false time."
        }
      ]
    },
    "outcome": {
      "result": "The false time misled investigators and concealed the true time of death."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred during a routine inspection when the clock showed the time of death.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appeared to match the schedule of the inspection, making it seem like a plausible time.",
    "what_it_hides": "The actual time of death was much earlier, revealing the tampering."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses claim Captain Hale was near the lobby when the clock struck the hour.",
      "A conversation overheard about gambling debts making him desperate."
    ],
    "the_one_flaw": "The time of death was proven to be earlier than the clock indicated, eliminating his opportunity.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Captain Hale's gambling debts become a suspicious motive.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "His debts were unrelated to the murder and stemmed from his own failures.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Beatrice Quill's unrequited love for Hugo hints at a motive.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "Her feelings were known, but she had no reason to kill him.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "rationale": "All suspects were present at the hotel during the incident, with no outsiders involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock in the lobby"
      ],
      "windows": [
        "8:00 PM - 10:00 PM"
      ],
      "contradictions": [
        "Clock showed a different time than witness accounts."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Sylvia Trent"
      ],
      "objects": [
        "Lobby clock"
      ],
      "permissions": [
        "Staff had access to the clock for maintenance."
      ]
    },
    "physical": {
      "laws": [
        "Mechanical principles of clockwork"
      ],
      "traces": [
        "Scratch marks on clock indicating tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Hotel staff"
      ],
      "authority_sources": [
        "Dr. Finch's medical authority."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The lobby clock shows a time inconsistent with the witness accounts.",
        "correction": "The clock must have been tampered with to show a false time.",
        "effect": "Narrows the investigation to focus on those who had access to the clock.",
        "required_evidence": [
          "Clock in the lobby showed a time that was questioned by witnesses.",
          "Witnesses stated they heard the clock strike at an unusual hour."
        ],
        "reader_observable": true
      },
      {
        "observation": "A scratch is found on the clock's base, indicating recent handling.",
        "correction": "This suggests someone tampered with the clock shortly before the murder.",
        "effect": "Eliminates suspects who did not have access to the clock.",
        "required_evidence": [
          "Scratch marks on the clock indicating tampering.",
          "Timeline of access shows only Dr. Finch had opportunity around that time."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses claim the clock struck an unusual hour, different from the scheduled inspection.",
        "correction": "This confirms the clock was set forward to mislead investigators.",
        "effect": "Narrows the suspect list to those with the technical knowledge to tamper.",
        "required_evidence": [
          "Witness statements about the clock striking incorrectly.",
          "Dr. Finch is known to have mechanical knowledge from his medical background."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A comparison of the lobby clock's timing with the actual time of death, using witness statements and the clock's scratch marks.",
    "knowledge_revealed": "The clock was tampered with just before the murder, implicating Dr. Finch.",
    "pass_condition": "The evidence shows the clock was set to a false time, confirming Dr. Finch's guilt.",
    "evidence_clues": [
      "clue_2",
      "clue_4",
      "clue_core_contradiction_chain",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock showing a different time and witness accounts (early) leads to the conclusion of tampering. Step 2: Scratch marks reveal recent handling (mid) eliminate those without access. Step 3: The incorrect striking time implicates those with mechanical knowledge (discriminating test)."
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
        "Observe the clock's reaction or result",
        "Draw conclusion about guilt"
      ],
      "test_type": "mechanical comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His gambling debts do not indicate motive for murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her affection for Hugo was known but unacted upon.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: evening",
        "supporting_clues": []
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
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Physical evidence of clock tampering"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_1",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
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
    "summary": "Eleanor Voss, a socialite caught in a web of financial deceit, is charming yet desperate, striving to maintain her image while teetering on the edge of ruin.",
    "publicPersona": "Charming and elegant, Eleanor is often seen hosting lavish parties at the seaside hotel.",
    "privateSecret": "She is deeply in debt and relies on her connections to maintain her lifestyle.",
    "motiveSeed": "Eleanor stands to gain financial support from a wealthy benefactor if the victim is out of the picture.",
    "motiveStrength": "moderate",
    "alibiWindow": "was seen at the bar from eight to nine",
    "accessPlausibility": "easy",
    "stakes": "Her reputation and financial stability.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a lilting, melodic tone, often punctuating her sentences with a disarming laugh. She tends to soften harsh truths with a charming smile, using genteel phrases that mask her underlying desperation.",
    "signatureTic": "Oh darling, you must see it from my perspective!",
    "internalConflict": "Eleanor grapples with the fear that her facade of wealth and charm will crumble, exposing her as a fraud.",
    "personalStakeInCase": "This crime matters deeply to Eleanor because it could either solidify her connections or unravel her carefully constructed life.",
    "paragraphs": [
      "Eleanor Voss glided through the hotel lobby as if she were the very essence of grace, every step a calculated performance. She dazzled her guests with a smile that could light up the darkest corners of the seaside hotel, her laughter echoing around the grand hall like the tinkling of crystal chandeliers. Yet beneath the surface of her polished exterior lay a tumultuous sea of anxiety. The debts that clung to her like a shadow threatened to drown her in disgrace, and the weight of her social climbing pressed heavier with each passing day.",
      "At the bar, Eleanor could be found from eight to nine, nursing a cocktail that mirrored her life: beautiful on the outside but dangerously mixed within. Her laughter danced around her words as she spun tales of her glamorous life, but each anecdote was laced with a silent plea for validation. She often glanced around, searching for the wealthy benefactor who could rescue her from her financial abyss. In her mind, the end of Hugo Vane's life could very well be the beginning of her salvation.",
      "Though she cultivated friendships with the elite, Eleanor's heart was a tempest of fear and longing. She feared that if the truth of her financial ruin came to light, her social standing would evaporate like mist at dawn. It was a precarious existence, one that made her both charming and cunning, capable of using her allure to manipulate the people around her. 'Oh darling, you must see it from my perspective!' she would say, but the truth was, she often lost sight of her own perspective amid the chaos of her lies.",
      "As the investigation unfolded, Eleanor felt the walls closing in around her. The very connections she relied on for survival now felt like shackles, binding her to a fate she could neither control nor escape. Would she finally confront her dependence on others, or would she continue to dance on the precipice of ruin, hoping that her charm could deflect the impending storm?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician, conceals a dark side as she navigates the thin line between ambition and ethics in her medical practice.",
    "publicPersona": "Respected and compassionate, Dr. Finch is known for helping the community and providing pro bono care.",
    "privateSecret": "She is conducting unauthorized experiments on patients for her own research.",
    "motiveSeed": "Dr. Finch fears the victim will expose her unethical practices in the medical field.",
    "motiveStrength": "strong",
    "alibiWindow": "in surgery from seven to ten",
    "accessPlausibility": "possible",
    "stakes": "Her career and reputation in the medical community.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with a measured, clinical tone, often slipping into technical jargon when discussing her work. She has a habit of raising an eyebrow when challenged, and her responses are often laced with a subtle irony that hints at her moral ambiguity.",
    "signatureTic": "It's all in the details, really.",
    "internalConflict": "Dr. Finch wrestles with the guilt of her unethical practices and the fear that her ambition may lead to her downfall.",
    "personalStakeInCase": "This crime is personal for Dr. Finch because it threatens to expose her transgressions and shatter her hard-earned reputation.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the sterile light of her operating room, the scent of antiseptic hanging in the air like a shroud. To the outside world, she was a pillar of the community, a compassionate healer whose hands worked miracles. Yet, beneath her calm demeanor lay a tempest of ambition and desperation. The unauthorized experiments she conducted in the shadows of her practice were a testament to her relentless pursuit of knowledge, but they also marked the beginning of her moral decay.",
      "During her alibi of surgery from seven to ten, Dr. Finch was in her element, performing procedures with precision while her mind raced with thoughts of the victim who held the key to her undoing. She feared exposure; the very thought of her unethical practices being laid bare sent shivers down her spine. 'It's all in the details, really,' she would often tell her colleagues, but the details of her own life were becoming increasingly difficult to manage.",
      "As she navigated the complex landscape of her profession, Dr. Finch found herself at a crossroads. The respect she garnered from her peers was a double-edged sword; it granted her access to the upper echelons of society, but it also heightened the stakes of her hidden transgressions. With the threat of exposure looming, her heart raced with the knowledge that one misstep could unravel everything she had worked for.",
      "In the wake of the investigation, Dr. Finch was forced to confront the very ethics she had long ignored. Would she cling to her ambition at all costs, or would the truth of her actions force her to reassess her values? The delicate balance between ambition and integrity hung in the balance, and the outcome remained uncertain, as dark as the specter of her deeds."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, grapples with a hidden past of smuggling that threatens to resurface and tarnish his honorable reputation.",
    "publicPersona": "Ivor is a stern but fair figure, respected for his service and leadership.",
    "privateSecret": "He has a hidden history of smuggling during the war.",
    "motiveSeed": "Captain Hale wants to maintain silence about his past, which the victim discovered.",
    "motiveStrength": "moderate",
    "alibiWindow": "was on the terrace from eight to nine-thirty",
    "accessPlausibility": "possible",
    "stakes": "His honor and freedom.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks in a commanding tone, his words clipped and direct. He often employs nautical jargon, and his sentences tend to be short, reflecting his military background. When he does use humor, it is often dry and to the point, lacking any embellishment.",
    "signatureTic": "In my experience, that's a slippery slope.",
    "internalConflict": "Captain Hale is haunted by guilt over his past, struggling to reconcile his honorable public persona with the shame of his hidden history.",
    "personalStakeInCase": "This crime matters to Captain Hale because it threatens to expose his past, jeopardizing the respect he has earned and the life he has built.",
    "paragraphs": [
      "Captain Ivor Hale stood on the terrace, the salty sea breeze ruffling his neatly combed hair. To the guests of the seaside hotel, he was a figure of authority—a retired naval officer with a reputation for honor and leadership. Yet, lurking beneath the surface of his stoic demeanor was the weight of a past he wished to forget. The smuggling operations he had participated in during the war were a stain on his conscience, one he feared would come to light.",
      "From eight to nine-thirty, Hale maintained his presence on the terrace, observing the ebb and flow of the guests as they mingled. His commanding gaze swept over the crowd, but his mind was elsewhere, fixated on the victim who had unearthed his dark secret. 'In my experience, that's a slippery slope,' he would mutter, a phrase that had served him well in navigating the treacherous waters of both the sea and society. But now, it seemed, the slope had become too steep to traverse.",
      "As the investigation unfolded, Hale felt the tightening grip of fear around his throat. The very honor he had fought to uphold was at risk, and he could not allow his past to surface. He was a man of principles, yet the specter of his former life haunted him, whispering doubts into his ear. Would he be forced to confront the ghosts of his past, or could he silence them once and for all?",
      "In the depths of his turmoil, Captain Hale faced a choice. Would he continue to hide behind the façade of respectability, or would he embrace the truth, no matter the cost? The stakes were high, and the clock was ticking, each tick resonating with the weight of his decisions as he awaited the inevitable reckoning."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious journalist, is torn between her desire for success and the ethical boundaries she is willing to cross to achieve it.",
    "publicPersona": "Beatrice is a passionate and driven journalist seeking her next big story.",
    "privateSecret": "She has been fabricating sources to get ahead in her career.",
    "motiveSeed": "Beatrice wants to stop the victim from publishing a story that could ruin her career.",
    "motiveStrength": "moderate",
    "alibiWindow": "interviewing guests from seven to nine",
    "accessPlausibility": "possible",
    "stakes": "Her credibility and career trajectory.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with an energetic and animated tone, often punctuating her sentences with dramatic flair. She has a tendency to use rhetorical questions to engage her audience and often resorts to sarcasm when discussing her competitors.",
    "signatureTic": "What’s the story here?",
    "internalConflict": "Beatrice struggles with the realization that her ambition may come at the cost of her integrity, torn between her desire for success and her ethical boundaries.",
    "personalStakeInCase": "This crime is personal for Beatrice because it could mean the end of her career if the truth about her fabrications comes to light.",
    "paragraphs": [
      "Beatrice Quill was a whirlwind of energy, her presence in the hotel lobby akin to a storm brewing on the horizon. With a notepad clutched in one hand and a pen poised like a sword, she was on the hunt for her next big story. The thrill of the chase fueled her ambition, but beneath the surface of her fervor lay a hidden truth: she had been fabricating sources to propel her career forward. The very foundation of her success was built on the shaky ground of deceit.",
      "From seven to nine, Beatrice flitted between guests, her laughter ringing out like a bell as she interviewed them for her latest piece. 'What’s the story here?' she would ask, her eyes glinting with the hunger for a scoop. Yet, as she gathered information, a gnawing sense of dread tugged at her conscience. The victim was poised to publish a story that could ruin her, and the thought sent a shiver down her spine. She was caught in a web of her own making, and the stakes had never been higher.",
      "As the investigation unfolded, Beatrice found herself at a crossroads. Her ambition had driven her to the brink of ethical collapse, and the fear of exposure loomed large. She often resorted to sarcasm as a defense mechanism, masking her inner turmoil with a veneer of humor. But deep down, she knew the truth: if her fabrications were revealed, her credibility would crumble like a house of cards, leaving her with nothing but the ashes of her dreams.",
      "In the face of adversity, Beatrice faced a choice: would she cling to her ambition, even if it meant sacrificing her integrity, or would she find the courage to confront her past and seek redemption? The clock was ticking, and the truth was a relentless tide, threatening to wash away the life she had so carefully constructed."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, the determined hotel manager, navigates the pressures of her role while concealing her own financial mismanagement that could jeopardize her career.",
    "publicPersona": "Sylvia is the efficient and charismatic manager of the hotel, well-liked by guests.",
    "privateSecret": "She has been hiding her own financial mismanagement of the hotel.",
    "motiveSeed": "Sylvia fears the victim will expose her financial troubles to the hotel owners.",
    "motiveStrength": "strong",
    "alibiWindow": "was managing the front desk from eight to nine",
    "accessPlausibility": "easy",
    "stakes": "Her job and reputation.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a warm, welcoming tone, often using anecdotes to connect with her audience. She has a tendency to pause for effect, allowing her words to resonate, while her humor often emerges in the form of gentle observations about the world around her.",
    "signatureTic": "You know, it’s the little things that matter.",
    "internalConflict": "Sylvia is torn between her desire to maintain her professional image and the nagging guilt of her financial mismanagement.",
    "personalStakeInCase": "This crime matters to Sylvia because it could expose her secrets and threaten her professional reputation, risking everything she has worked for.",
    "paragraphs": [
      "Sylvia Trent stood behind the front desk of the hotel, her demeanor radiating warmth and efficiency. Guests flocked to her, drawn not only by her charm but by the air of competence she exuded. Yet beneath the polished surface lay a well of anxiety; the financial mismanagement of the hotel was a secret she guarded fiercely. The weight of her responsibilities pressed down on her, and the fear of exposure loomed like a dark cloud over her head.",
      "During her alibi from eight to nine, Sylvia was a whirlwind of activity, managing the front desk with a grace that belied her inner turmoil. 'You know, it’s the little things that matter,' she would say to guests, offering them a smile while her mind raced with thoughts of the victim who threatened to unravel her life. The knowledge that her financial troubles could be laid bare sent shivers through her, and she was determined to keep her secrets hidden at all costs.",
      "As the investigation unfolded, Sylvia felt the pressure mounting. Her professional image was at stake, and the thought of the victim's potential revelations made her heart race. She often employed gentle observations in her conversations, using humor as a shield against the mounting stress. But deep down, she knew that the little things she once cherished could quickly become her undoing if the truth were to surface.",
      "In the face of uncertainty, Sylvia was forced to confront her own choices. Would she continue to hide behind the facade of a competent manager, or would she embrace the truth and risk everything for the sake of honesty? The stakes had never been higher, and as the clock ticked away, she realized that the time for reckoning was drawing near."
    ],
    "order": 5
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
    "summary": "A grand Art Deco hotel overlooking the turbulent sea, where elegance meets the tension of wartime uncertainty.",
    "visualDescription": "High ceilings adorned with geometric patterns, large windows framing stormy ocean views, and a terrace lined with wrought-iron railings.",
    "atmosphere": "A blend of opulence and anxiety, where the beauty of the sea contrasts with the unease lingering among the guests.",
    "paragraphs": [
      "The Grand Seaside Hotel rises majestically against the rugged coastline of Brighton, its Art Deco facade shimmering with a touch of glamour even under the oppressive overcast sky. The lobby, with its towering ceilings and polished marble floors, welcomes guests with a sense of grandeur, though a palpable tension lingers in the air. The rhythmic crash of waves against the cliffs outside echoes the turmoil within, as whispers of recent events travel like the cold sea breeze through the common areas.",
      "As guests gather on the expansive terrace, the salty tang of the ocean mingles with the scent of damp earth, creating an atmosphere that is both refreshing and foreboding. The soft glow of gas lamps begins to flicker as dusk approaches, casting long shadows that dance over the weathered stone. Conversations are punctuated by the distant sound of a radio broadcasting news of the war, reminding everyone of the world beyond the hotel’s walls.",
      "Each room holds its secrets, the doors adorned with brass numbers that gleam under the dim lighting. Staff move discreetly, their eyes scanning for any unusual behavior among the guests. The hotel’s isolation along a remote stretch of coast means that help is far away, and the sense of surveillance is heightened by the knowledge that staff-only areas are off-limits to most. The atmosphere is thick with unspoken fears, as if the very walls are listening.",
      "With the storm clouds gathering overhead, the Grand Seaside Hotel stands as a sanctuary and a prison, where the beauty of the seaside is overshadowed by the mystery of a crime that has shaken its foundations. As the clock ticks ominously in the lobby, the tension mounts, and every guest becomes a potential suspect, trapped in a web of intrigue and deception."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with a chance of rain, typical of coastal climates in the 1940s, creating a moody and tense environment.",
    "timeFlow": "Two days of escalating mystery and suspicion.",
    "mood": "Tense and suspenseful, with guests on edge due to recent events and the lingering effects of war.",
    "eraMarkers": [
      "Radio broadcasting news updates",
      "Art Deco design elements",
      "Limited access to upper floors"
    ],
    "sensoryPalette": {
      "dominant": "Salty sea air and dampness",
      "secondary": [
        "Flickering gas lamp light",
        "Whispers of anxious guests"
      ]
    },
    "paragraphs": [
      "The atmosphere within the Grand Seaside Hotel is thick with unease, as the overcast sky looms heavily over its elegant structure. The salty tang of the ocean air mixes with the scent of damp wood, creating an oppressive environment where every creak of the floorboards seems amplified. Guests, dressed in war-time attire, exchange glances filled with unspoken questions, the tension palpable as they navigate the luxurious yet stifling surroundings.",
      "As the evening descends, the flickering gas lamps cast shadows that stretch and twist across the lobby, enhancing the sense of foreboding. The distant sound of waves crashing against the cliffs serves as a constant reminder of the isolation that surrounds the hotel. Conversations fall to hushed tones, punctuated by the crackle of the radio broadcasting news from the front lines, reminding everyone of the turmoil outside this sanctuary of elegance."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Ocean View Suite",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Lavishly appointed room with ocean views, heavy drapes, and an ornate chandelier.",
      "sensoryDetails": {
        "sights": [
          "dark curtains billowing with wind",
          "scattered papers on the floor",
          "broken glass on the carpet",
          "stained rug near the fireplace"
        ],
        "sounds": [
          "howling wind outside",
          "distant thunder rumbling",
          "the ticking clock on the mantel",
          "the faint murmur of guests below"
        ],
        "smells": [
          "salt air mingling with perfume",
          "burnt tobacco lingering",
          "old leather and dust",
          "damp wood from the balcony"
        ],
        "tactile": [
          "cold marble floor",
          "soft velvet upholstery",
          "rough edge of shattered glass",
          "chill from the open window"
        ]
      },
      "accessControl": "Restricted access; only staff and authorized guests allowed after hours; daily logs maintained for guest entries.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked balcony railings",
            "grey clouds obscuring the sun",
            "dripping eaves outside",
            "faded floral wallpaper peeling"
          ],
          "sounds": [
            "steady rain pattering on the roof",
            "water dripping from the gutters",
            "the creak of the old building",
            "muffled voices from the hallway"
          ],
          "smells": [
            "fresh rain on pavement",
            "mildew in the corners",
            "faint scent of coffee from below",
            "cold stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "shadows creeping across the floor",
            "dust motes dancing in the air",
            "faded photographs on the walls"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the murmur of guests in the lobby",
            "the rustle of newspaper pages",
            "the clinking of glassware"
          ],
          "smells": [
            "old paper and ink",
            "beeswax from candles",
            "lingering perfume",
            "woodsmoke from distant chimneys"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on the walls",
            "stars twinkling outside",
            "silhouettes of guests at the bar"
          ],
          "sounds": [
            "the tick of the mantel clock",
            "laughter from the terrace",
            "the clinking of glasses",
            "the low hum of conversation"
          ],
          "smells": [
            "the aroma of fine whiskey",
            "candle wax melting",
            "freshly polished wood",
            "the faint scent of jasmine from the garden"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Ocean View Suite, once a symbol of luxury, now stands as a stark reminder of betrayal. The heavy curtains billow in the wind, revealing a chaotic scene within. Scattered papers lie haphazardly across the floor, hints of a struggle echoing in the silence. The air is thick with the scent of salt and perfume, mingling uneasily with the burnt tobacco that clings to the upholstery. Outside, the storm builds, but within these walls, the true tempest brews.",
        "As the clock ticks ominously on the mantel, the room feels suspended in time, each second stretching into eternity. The faint murmur of guests below serves as a haunting backdrop, their laughter a stark contrast to the tension hanging in the air. Every creak of the floorboards seems to amplify the dread, as if the suite itself is holding its breath, waiting for the next revelation to surface in the murky depths of the evening."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Spacious area with a grand staircase, ornate chandeliers, and plush seating arrangements.",
      "sensoryDetails": {
        "sights": [
          "opulent chandeliers casting golden light",
          "marble floors reflecting movement",
          "lush plants in decorative pots",
          "large windows framing the ocean"
        ],
        "sounds": [
          "the echo of footsteps on marble",
          "soft jazz music from the radio",
          "the murmur of conversations",
          "the rustle of newspapers"
        ],
        "smells": [
          "freshly polished wood",
          "cooked meals wafting from the kitchen",
          "the scent of flowers",
          "candle wax from sconces"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft velvet cushions",
          "coolness of glass tabletops",
          "warmth from the fireplace"
        ]
      },
      "accessControl": "Open to all guests during operational hours; monitored by staff; restricted access after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "drops of water on window panes",
            "reflections in puddles on the floor",
            "shadows from the chandeliers"
          ],
          "sounds": [
            "rain tapping against the windows",
            "the hum of the radiator",
            "soft laughter from the breakfast crowd",
            "the clinking of cutlery"
          ],
          "smells": [
            "fresh coffee brewing",
            "warm pastries from the kitchen",
            "wet earth from outside",
            "the scent of damp flowers"
          ],
          "mood": "somber warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting elongated shadows",
            "gathered groups of guests in hushed conversations",
            "the flicker of gas lamps",
            "the glint of polished surfaces"
          ],
          "sounds": [
            "the crackle of the radio",
            "the soft shuffle of feet",
            "distant laughter from the terrace",
            "the ticking of a clock"
          ],
          "smells": [
            "scent of old books",
            "the aroma of brewing tea",
            "dusty air from the corners",
            "the faint whiff of cigars"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glowing chandeliers illuminating the space",
            "the silhouette of guests against the window",
            "shadows playing on the walls",
            "the flicker of candle flames"
          ],
          "sounds": [
            "the soft jazz playing in the background",
            "clinking glasses from the bar",
            "laughter spilling from the terrace",
            "the rustle of evening gowns"
          ],
          "smells": [
            "the scent of fine whiskey",
            "freshly cut flowers",
            "the warmth of baked goods",
            "the faint aroma of cologne"
          ],
          "mood": "elegant intrigue"
        }
      ],
      "paragraphs": [
        "The Grand Lobby serves as the heart of the hotel, its grandeur unmatched with high ceilings and ornate chandeliers shimmering under the soft glow of gaslight. Guests drift in and out, their conversations a blend of laughter and hushed tones, as if secrets are exchanged beneath the watchful eyes of the staff. The scent of polished wood mingles with the aroma of fresh pastries, creating a welcoming yet charged atmosphere.",
        "As evening approaches, the lobby transforms into a stage of elegance, where the soft strains of jazz fill the air, and the flickering candlelight dances across the marble floors. Guests gather in plush seating arrangements, their silhouettes casting long shadows against the walls. Yet, beneath the veneer of sophistication, an undercurrent of tension hums, as each guest knows that not everything is as it seems within these storied walls."
      ]
    },
    {
      "id": "terrace",
      "name": "The Ocean Terrace",
      "type": "exterior",
      "purpose": "Social gathering space",
      "visualDetails": "Expansive terrace with wrought-iron railings, overlooking the tumultuous ocean waves below.",
      "sensoryDetails": {
        "sights": [
          "crashing waves against the rocks",
          "seagulls soaring overhead",
          "storm clouds gathering on the horizon",
          "twinkling lights from distant ships"
        ],
        "sounds": [
          "the roar of the ocean",
          "wind whistling through railings",
          "distant laughter from guests",
          "the creak of the terrace underfoot"
        ],
        "smells": [
          "brine of the sea",
          "wet stone and earth",
          "freshly cut grass from the gardens",
          "the faint scent of jasmine"
        ],
        "tactile": [
          "rough texture of wrought iron",
          "cool breeze against the skin",
          "smooth stones underfoot",
          "the chill of the ocean air"
        ]
      },
      "accessControl": "Open to all guests; monitored by staff; closed during severe weather.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets on the railing",
            "grey mist hovering over the ocean",
            "puddles forming on the terrace",
            "blurred outlines of distant ships"
          ],
          "sounds": [
            "rain tapping against the iron",
            "the distant crash of waves",
            "soft murmurs of early risers",
            "the rustle of wet leaves"
          ],
          "smells": [
            "fresh rain mingling with salt",
            "the earthy scent of wet soil",
            "the aroma of brewing coffee",
            "the dampness of the ocean"
          ],
          "mood": "reflective solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds rolling in",
            "waves crashing with white foam",
            "the silhouette of a lone figure"
          ],
          "sounds": [
            "the roar of the ocean",
            "the wind whipping through the terrace",
            "the distant sound of laughter",
            "the occasional cry of a gull"
          ],
          "smells": [
            "the briny scent of the sea",
            "the dampness of approaching rain",
            "the faint whiff of tobacco",
            "the scent of blooming flowers"
          ],
          "mood": "sombre contemplation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the sun setting over the horizon",
            "twinkling stars appearing in the sky",
            "the glow of lanterns illuminating the terrace",
            "silhouettes of couples enjoying the view"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "laughter mingling with the breeze",
            "the soft clinking of glasses",
            "the rustle of evening gowns"
          ],
          "smells": [
            "the sweet scent of blooming jasmine",
            "the aroma of grilled seafood",
            "the refreshing coolness of the sea air",
            "the faint smoke of distant bonfires"
          ],
          "mood": "romantic intrigue"
        }
      ],
      "paragraphs": [
        "The Ocean Terrace, with its wrought-iron railings and breathtaking views, serves as a gathering place for guests seeking solace or companionship. The crashing waves below echo the turbulent emotions of those who stand at the edge, contemplating their secrets while the salty breeze tousles their hair. As storm clouds gather on the horizon, the atmosphere is charged, each gust of wind carrying whispers of uncertainty.",
        "In the evening, the terrace transforms into a realm of romance, where lanterns flicker and laughter dances on the air. Couples lean over the railings, captivated by the mesmerizing sunset, while the scent of jasmine wafts through the air, mingling with the aromas of dinner being prepared inside. Yet, beneath the beauty lies an undercurrent of tension, as shadows lengthen, and the mystery of the hotel deepens with each passing moment."
      ]
    },
    {
      "id": "staff_quarters",
      "name": "The Staff Quarters",
      "type": "interior",
      "purpose": "Restricted area",
      "visualDetails": "Simple, functional rooms with utilitarian furnishings and low ceilings.",
      "sensoryDetails": {
        "sights": [
          "bare light bulbs hanging from wires",
          "stacked linens and uniforms",
          "narrow hallways with peeling paint",
          "old photographs on the walls"
        ],
        "sounds": [
          "whispers among staff members",
          "the shuffle of feet on linoleum",
          "the distant sound of guests laughing",
          "the ticking of a wall clock"
        ],
        "smells": [
          "clean linen and soap",
          "the faint scent of cooking",
          "mustiness of old wood",
          "the aroma of coffee brewing"
        ],
        "tactile": [
          "rough fabric of uniforms",
          "cold metal of doorknobs",
          "smooth surface of wooden tables",
          "the chill of the air"
        ]
      },
      "accessControl": "Staff-only access; monitored by head staff; entry logged for security.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets running down the window",
            "grey light filtering into the room",
            "muddy footprints on the floor",
            "clothes hanging to dry"
          ],
          "sounds": [
            "the patter of rain on the roof",
            "quiet conversations among staff",
            "the clinking of dishes in the kitchen",
            "the distant sound of thunder"
          ],
          "smells": [
            "freshly brewed coffee",
            "the scent of damp earth",
            "the aroma of frying bacon",
            "the faint smell of wet linen"
          ],
          "mood": "busy preparation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows pooling in corners",
            "the flickering of a single bulb",
            "staff moving about with purpose",
            "the clutter of daily tasks"
          ],
          "sounds": [
            "the hum of the radio",
            "the rustle of papers",
            "soft laughter shared in the hall",
            "the ticking of a clock"
          ],
          "smells": [
            "the scent of old wood",
            "the aroma of cleaning products",
            "the faint smell of food cooking",
            "the musk of worn fabric"
          ],
          "mood": "tense efficiency"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "dim light casting shadows",
            "the glow of lamps in the hall",
            "staff members unwinding after shifts",
            "the scattering of personal items"
          ],
          "sounds": [
            "the chatter of staff sharing stories",
            "the distant music from the lobby",
            "the closing of doors",
            "the soft flutter of paper"
          ],
          "smells": [
            "the aroma of a hearty stew",
            "freshly cut flowers from the lobby",
            "the scent of polished wood",
            "the faint smell of smoke"
          ],
          "mood": "relaxed camaraderie"
        }
      ],
      "paragraphs": [
        "The Staff Quarters, a stark contrast to the opulence of the hotel above, are functional and utilitarian, designed to serve the needs of the hardworking individuals who keep the Grand Seaside Hotel running. Bare light bulbs dangle from the ceiling, casting a harsh glow on the simple furnishings. The air is filled with the scent of clean linens and soap, a reminder of the daily routines that unfold in this hidden corner of the establishment.",
        "As the morning rain patters against the windows, staff members bustle about, exchanging quiet conversations and laughter. The sound of clinking dishes from the kitchen mingles with the aroma of freshly brewed coffee, creating a sense of camaraderie among the workers. Yet, the clock ticks steadily, a reminder that the guests above are oblivious to the life and secrets that pulse beneath the surface of the hotel's grandeur."
      ]
    }
  ],
  "note": "",
  "cost": 0.0026236847999999997,
  "durationMs": 25795
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1947,
    "month": "May",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "May",
    "weather": [
      "overcast skies",
      "occasional drizzle",
      "cool breezes from the coast"
    ],
    "daylight": "Daylight hours lengthen, with the sun rising around 5:30 AM and setting around 8:30 PM, offering a mix of light and shadow.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, with guests lingering in dimly lit lounges.",
    "holidays": [
      "May Day (May 1)",
      "Memorial Day (last Monday of May)"
    ],
    "seasonalActivities": [
      "flower shows in local parks",
      "outdoor picnics as the weather warms",
      "fishing trips along the coast"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suits in navy or charcoal",
        "crisp white dress shirts",
        "silk ties with geometric patterns"
      ],
      "casual": [
        "tweed jackets with elbow patches",
        "khaki trousers",
        "lightweight cotton sweaters"
      ],
      "accessories": [
        "fedora hats",
        "leather gloves",
        "wristwatches with leather straps"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with cinched waists",
        "structured blouses with full skirts",
        "elegant hats adorned with flowers"
      ],
      "casual": [
        "swing skirts paired with fitted cardigans",
        "capri pants and short-sleeve blouses",
        "lightweight summer coats"
      ],
      "accessories": [
        "pearl necklaces",
        "matching gloves",
        "small handbags"
      ]
    },
    "trendsOfTheMoment": [
      "post-war fashion revival",
      "influence of Hollywood styles",
      "increasing use of synthetic fabrics"
    ],
    "socialExpectations": [
      "emphasis on modesty in women's fashion",
      "formal dress codes for hotel dining",
      "growing acceptance of women in business roles"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Tensions rise in Europe as the Iron Curtain descends",
      "The onset of the Marshall Plan to rebuild European economies",
      "The first successful test of the atomic bomb in Nevada"
    ],
    "politicalClimate": "A divided Europe, with the US and USSR emerging as superpowers, leading to increasing Cold War tensions.",
    "economicConditions": "Post-war economic recovery is underway, but rationing still affects many goods, including clothing and fuel.",
    "socialIssues": [
      "Struggles for civil rights gaining attention",
      "Labor strikes in various industries seeking better wages",
      "The push for gender equality in the workforce"
    ],
    "internationalNews": [
      "UN peacekeeping discussions",
      "Geopolitical maneuvering in Asia and Europe as nations realign",
      "Reports of refugee crises in war-torn areas"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Doris Day's 'Sentimental Journey'",
        "Nat King Cole's smooth jazz tunes"
      ],
      "films": [
        "'It's a Wonderful Life'",
        "'The Best Years of Our Lives'",
        "'Gentleman's Agreement'"
      ],
      "theater": [
        "'Annie Get Your Gun'",
        "'Finian's Rainbow'",
        "'The King and I'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'Fibber McGee and Molly'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'1984' by George Orwell",
        "'The Naked and the Dead' by Norman Mailer"
      ],
      "popularGenres": [
        "detective fiction",
        "post-war realism",
        "social commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "the first commercial jet airliner",
        "early computers in development"
      ],
      "commonDevices": [
        "early television sets with limited programming",
        "record players for home entertainment",
        "film cameras for amateur photography"
      ],
      "emergingTrends": [
        "increased interest in consumer electronics",
        "the growth of suburban living",
        "the rise of the automobile culture"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Men's dress shirt: seven shillings"
      ],
      "commonActivities": [
        "Attending local fairs and festivals",
        "Going to the cinema for evening entertainment",
        "Dining in hotel restaurants featuring live music"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "Weekly dances at community halls",
        "Evening strolls along the waterfront"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Growing middle class due to post-war economic expansion",
      "Stigmas attached to poverty from the war",
      "Increased social mobility for some demographics"
    ],
    "gender": [
      "Women are gaining more independence and entering the workforce",
      "Traditional roles still prevalent in many families",
      "Continued push for equal rights and representation"
    ],
    "race": [
      "Civil rights movements beginning to challenge segregation",
      "Awareness of racial inequalities increasing",
      "Tensions between communities due to post-war migrations"
    ],
    "generalNorms": [
      "Respect for authority and tradition",
      "Emerging counterculture among the youth",
      "Focus on family values and community support"
    ]
  },
  "atmosphericDetails": [
    "The scent of rain mingling with fresh flowers, as hotel guests wander through the gardens, seeking moments of respite.",
    "An underlying tension in the air, as whispers of rumors and secrets ripple through the dimly lit lounges, where shadows dance across the walls.",
    "The muted sounds of a jazz band playing softly in the background, providing a soundtrack to the uneasy conversations of patrons nursing their drinks."
  ],
  "paragraphs": [
    "In May 1947, the coastal hotel stands as a refuge against the overcast skies, where a soft drizzle occasionally interrupts the tranquility of the gardens. Spring is in full bloom, yet the air is thick with tension, a residue of the recent war still lingering in the minds of the guests. As they sip cocktails in the lounge, whispers of the Iron Curtain and the unfolding Cold War punctuate their conversations, while the scent of damp earth and blooming flowers mixes with the aroma of rich tobacco smoke.",
    "Fashion this spring reflects a society in transition. Men don double-breasted suits with crisp white shirts, while women embrace tea-length dresses adorned with floral patterns, a nod to the season's vibrancy. Hats are a staple, with women often seen in elegant designs embellished with delicate flowers. The attire signifies not only personal style but also a collective resilience, as the country begins to recover from the war's ravages and women step more boldly into the public sphere.",
    "Daily life unfolds with a mixture of old rituals and new expectations. Family dinners on Sundays remain common, yet now there are dances at the local community halls, where couples twirl under dimmed lights to the latest jazz tunes. Prices reflect the economic recovery, with a loaf of bread costing just four pence, allowing families to indulge in outings to the cinema or local fairs, seeking joy amidst the shadows of their recent past. The tension in the air not only heightens the mystery of the hotel but also underscores the shifting dynamics of post-war society."
  ],
  "note": "",
  "cost": 0.00107864625,
  "durationMs": 17508
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A grand seaside hotel hosts a gathering of guests and staff, where the pressures of post-war society and the looming threat of the Cold War create an atmosphere ripe for tension and intrigue.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The impact of WWII has led to shifting gender roles with women entering the workforce, while class distinctions remain pronounced, and the fear of global conflict adds pressure to personal relationships."
  },
  "setting": {
    "location": "A grand seaside hotel with Art Deco influences",
    "institution": "Hotel",
    "weather": "Overcast with a chance of rain, typical of coastal climates in the 1940s"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a mechanical clock-tampering method, where a rewound timepiece staged the apparent time of death."
}

### LOCKED_FACTS
[
  {
    "id": "time_of_death",
    "value": "ten minutes past midnight",
    "description": "The clock was set to this time after the murder."
  },
  {
    "id": "actual_time",
    "value": "twenty minutes past eleven",
    "description": "The actual time of death based on witness accounts."
  },
  {
    "id": "clock_winding",
    "value": "three full turns",
    "description": "The number of turns made to rewind the clock."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 16,
  "countsByPlacement": {
    "early": 5,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 14,
    "supporting": 1,
    "optional": 1
  },
  "redHerringCount": 0,
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
      "id": "clue_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "supporting",
      "category": "testimonial"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_early_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
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
