# Actual Prompt Record

- Run ID: `mystery-1784751055781`
- Project ID: ``
- Timestamp: `2026-07-22T20:18:57.356Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `c280c7600b7172e1`

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
    "title": "The Clockwork Deception",
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
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical tampering"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Charming socialite",
      "private_secret": "Romantic affair with Captain Hale",
      "motive_seed": "Jealousy over a broken engagement",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation at stake",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Expert witness",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Involved in a secret experiment",
      "motive_seed": "Fear of exposure",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 9:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Career at stake",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Rival",
      "relationships": [],
      "public_persona": "Charming naval officer",
      "private_secret": "Financial troubles",
      "motive_seed": "Financial gain from insurance",
      "motive_strength": "high",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "28-38",
      "role_archetype": "Innocent bystander",
      "relationships": [],
      "public_persona": "Artistic young woman",
      "private_secret": "Crush on Captain Hale",
      "motive_seed": "Unrequited love",
      "motive_strength": "low",
      "alibi_window": "8:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Heartache",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Friend",
      "relationships": [],
      "public_persona": "Loyal companion",
      "private_secret": "Protective of Eleanor",
      "motive_seed": "Jealousy towards Captain Hale",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Friendship",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Astute investigator",
      "private_secret": "Former military intelligence",
      "motive_seed": "Desire for justice",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
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
      "summary": "At a grand seaside hotel, Eleanor Voss is found strangled shortly after a party. The clock shows the time of death as ten minutes past ten, but the truth is far more sinister."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A clock was rewound to mislead witnesses about the time of death.",
      "delivery_path": [
        {
          "step": "Clock tampered with to show a false time."
        },
        {
          "step": "Witnesses misremember timing based on the clock."
        }
      ]
    },
    "outcome": {
      "result": "The real time of death was before the party began, indicating premeditation."
    }
  },
  "false_assumption": {
    "statement": "The victim died during the party as indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock showed ten minutes past ten, aligning with witness accounts.",
    "what_it_hides": "The actual time of death was before the party began."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch was seen arguing with Eleanor earlier that evening.",
      "Dr. Finch had access to the victim's room."
    ],
    "the_one_flaw": "Dr. Finch has a solid alibi verified by multiple witnesses.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken necklace found in Eleanor's room.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The necklace was broken earlier in the day during a different incident.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A witness claimed to see Captain Hale leaving the hotel shortly after the murder.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The witness misidentified Hale; it was another guest in a similar uniform.",
      "resolved_in_chapter": 5
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel, and no outsiders had access."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock shows ten minutes past ten",
        "Witnesses recall the party ending at ten o'clock"
      ],
      "windows": [],
      "contradictions": [
        "Victim's watch shows different time than the clock",
        "Witness claims to have seen the victim alive after the clock time"
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The clock",
        "Eleanor's watch"
      ],
      "permissions": []
    },
    "physical": {
      "laws": [
        "Mechanical clocks can only be adjusted manually.",
        "Timepieces must show consistent time within a reasonable error margin."
      ],
      "traces": [
        "Scratch marks on the clock indicating tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Witnesses trust the clock as a time reference."
      ],
      "authority_sources": []
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock shows the time as ten minutes past ten.",
        "correction": "The clock was tampered with to show a false time.",
        "effect": "Narrows evidence to the clock's condition.",
        "required_evidence": [
          "The clock shows ten minutes past ten",
          "Witnesses recall the party ending at ten o'clock"
        ],
        "reader_observable": true
      },
      {
        "observation": "The victim's watch shows a different time than the clock.",
        "correction": "This indicates the clock has been tampered with.",
        "effect": "Eliminates the time indicated by the clock as the time of death.",
        "required_evidence": [
          "Victim's watch shows a different time than the clock",
          "Witness claims to have seen the victim alive after the clock time"
        ],
        "reader_observable": true
      },
      {
        "observation": "Scratch marks on the clock indicate recent tampering.",
        "correction": "Recent tampering suggests premeditation.",
        "effect": "Narrows the suspect pool to those with access to the clock.",
        "required_evidence": [
          "Scratch marks on the clock indicating tampering.",
          "Witnesses trusted the clock as a time reference."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the time indicated by the victim's watch with the clock proves that the clock was tampered with to show a false time.",
    "knowledge_revealed": "The clock's tampering misled everyone about the time of death.",
    "pass_condition": "The clock shows evidence of recent tampering, which contradicts the witnesses' accounts.",
    "evidence_clues": [
      "clue_core_contradiction_chain",
      "clue_2",
      "clue_1",
      "clue_fp_contradiction_step_2"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time and witness accounts (early) show the victim's death was misrepresented. Step 2: The victim's watch contradicts the time indicated by the clock (mid). Step 3: Scratch marks on the clock indicate tampering (discriminating test) and show only Captain Hale could have done it."
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
      "test_type": "Comparison of timepieces"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Solid alibi verified by multiple witnesses.",
        "supporting_clues": [
          "Witnesses testify to Dr. Finch's activities during the time of death."
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Broken necklace was from a different incident.",
        "supporting_clues": [
          "Witnesses confirm the necklace incident occurred earlier in the day."
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No motive or opportunity.",
        "supporting_clues": [
          "Witness confirms Sylvia was in another part of the hotel."
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 8:00 PM to 9:30 PM",
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Witness observations of the clock."
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Victim's watch examination."
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Clock tampering marks found."
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
    "summary": "Eleanor Voss is the esteemed manager of the seaside hotel, whose life is intricately woven into the fabric of the community. Behind her polished exterior lies a past that threatens to unravel her carefully constructed world.",
    "publicPersona": "Respected hotel manager known for her impeccable standards and elegance.",
    "privateSecret": "Was involved in a decades-old scandal that could jeopardize her family's reputation if exposed.",
    "motiveSeed": "Her secret from the past threatened to surface, damaging the hotel's reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "was seen in the hotel office until approximately 8:45 PM",
    "accessPlausibility": "easy",
    "stakes": "Her position in the community and her family's legacy.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Eleanor speaks with a measured grace, each word carefully chosen, yet there's an undercurrent of anxiety that occasionally breaks through her composed facade.",
    "signatureTic": "One must always keep up appearances, don’t you think?",
    "internalConflict": "Eleanor grapples with the fear that her past will destroy everything she has worked for, including her family's name.",
    "personalStakeInCase": "The potential exposure of her past threatens not only her career but the legacy of her family, which she has fought to protect.",
    "paragraphs": [
      "Eleanor Voss, the hotel manager, is a woman of poise and presence, revered in the seaside community for her unyielding standards and gracious hospitality. With every meticulously arranged flower in the lobby and every perfectly pressed linen, she has created an oasis of elegance. Yet, beneath the surface lies a turbulent sea of secrets that could capsize her carefully constructed life. Eleanor often muses that life is a performance, and she plays her role to perfection, but the specter of her past looms large, threatening to pull her under.",
      "As she moves through the hotel, her footsteps echo the weight of unspoken fears. There was a time when Eleanor was not just the manager but a woman caught in a scandal that could ruin her family's reputation. Decades have passed, yet the threat of exposure hangs over her like a guillotine, waiting for the right moment to drop. The thought of her name dragged through the mud, of whispers in the community, sends a chill down her spine. She often finds herself staring out at the ocean, wondering if she could simply disappear beneath the waves, taking her secrets with her.",
      "Her alibi for the night of the incident is solid, a fact she clings to as reassurance. Seen in her office until 8:45 PM, she feels a fleeting sense of security. But what if someone were to delve deeper? What if her past were to collide with her present in a way she could not control? The stakes are high, and each passing moment feels like a countdown to catastrophe. Eleanor knows that her position in the community is fragile, held together by the thinnest of threads, and she is determined not to let anything unravel it.",
      "In conversations, Eleanor's voice is smooth, yet there's a hint of tension in her phrasing, a subtle reminder of the turmoil beneath her surface. She often finds solace in the saying, 'One must always keep up appearances, don’t you think?' It is a mantra that guides her, a reminder to maintain her composure in the face of adversity. But as the investigation unfolds, Eleanor realizes that keeping up appearances may not be enough. The truth has a way of surfacing, and when it does, she must confront the reality of her choices and the weight of her past."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a dedicated physician with a progressive vision, yet she harbors a tumultuous secret that could shatter her professional integrity and personal life.",
    "publicPersona": "Devoted doctor known for her progressive ideas and advocacy for women's rights.",
    "privateSecret": "Had a clandestine affair with Eleanor's husband years ago, causing personal turmoil.",
    "motiveSeed": "Bitter about Eleanor's unyielding moral superiority and the resurfacing of past secrets.",
    "motiveStrength": "moderate",
    "alibiWindow": "attending to patients in the waiting room until 9:15 PM",
    "accessPlausibility": "possible",
    "stakes": "Personal reputation and professional integrity are on the line.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with a directness that can be disarming, her words often laced with dry humor that reflects her struggle to maintain composure amidst chaos.",
    "signatureTic": "Well, that's one way to complicate matters.",
    "internalConflict": "Mallory is tormented by her past affair and the moral implications of her actions, grappling with feelings of guilt and resentment.",
    "personalStakeInCase": "The possibility of her past being exposed could not only ruin her reputation but also force her to confront the choices she made that led her to this point.",
    "paragraphs": [
      "Dr. Mallory Finch is the epitome of dedication, her life devoted to healing and advocating for women's rights. Yet, beneath her composed exterior lies a tangled web of emotion and regret. She is a woman who believes in progress, yet her own life feels like a series of missteps. The affair she had with Eleanor's husband is a dark chapter she wishes to forget, but the shadows of that past loom large, especially now as old secrets threaten to resurface.",
      "Every day, she walks the fine line between compassion and personal turmoil, her patients unaware of the storm that brews within her. Mallory’s alibi for the night of the incident is solid—attending to patients in the waiting room until 9:15 PM—but the knowledge that her past could surface at any moment gnaws at her. She can’t shake the bitterness that Eleanor’s moral superiority evokes in her, a constant reminder of the choices that haunt her. Mallory often finds herself muttering, 'Well, that's one way to complicate matters,' a sardonic commentary on her life’s trajectory.",
      "As the investigation unfolds, Mallory is forced to confront her feelings of inadequacy and the resentment that simmers beneath the surface. She can’t help but feel that Eleanor’s polished exterior and unwavering principles are a direct contrast to her own flawed humanity. The stakes are personal for Mallory; the exposure of her past could not only ruin her medical career but also force her to reckon with the choices she has made. In a profession where trust is paramount, she finds herself teetering on the edge of professional ruin.",
      "Navigating the complexities of her relationship with Eleanor only adds to her internal conflict. While she wishes to keep her distance, she finds herself drawn back into the orbit of the woman who represents everything she despises and admires. As she grapples with her past, Mallory must decide whether to confront her demons or allow them to dictate her future. In a world where every choice has consequences, she realizes that the truth may not only set her free but also shatter the fragile facade she has built around herself."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired Navy officer whose steadfast values are tested by the specter of a dark secret from his past, threatening to unravel the life he has built.",
    "publicPersona": "Regarded as a steadfast veteran with strict values and a sense of honor.",
    "privateSecret": "Was involved in a cover-up during the war that could ruin his reputation if exposed.",
    "motiveSeed": "Desperation to keep his dark history buried and protect his family's image.",
    "motiveStrength": "weak",
    "alibiWindow": "was in the hotel bar discussing the past with old war mates until 9:10 PM",
    "accessPlausibility": "easy",
    "stakes": "Maintaining his family's status in the community.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks in a gruff, no-nonsense manner, often punctuated by self-deprecating humor that reveals his inner turmoil and vulnerability.",
    "signatureTic": "We all have our battles, don’t we?",
    "internalConflict": "Ivor struggles with the burden of his wartime actions and the fear of losing everything he has fought to protect.",
    "personalStakeInCase": "The potential exposure of his past could tarnish his family's reputation and the honor he has built post-war.",
    "paragraphs": [
      "Captain Ivor Hale is a man of principle, a retired Navy officer whose life has been defined by duty and honor. Yet, beneath the surface of this stalwart figure lies a secret that could unravel everything he holds dear. He is regarded in the community as a steadfast veteran, but the truth of his wartime actions haunts him like a specter, a cover-up that could destroy his carefully crafted reputation. Ivor often reflects on the nature of honor, muttering to himself, 'We all have our battles, don’t we?' as he grapples with the ghosts of his past.",
      "In the hotel bar, Ivor finds solace in the company of old war mates, sharing stories that blend nostalgia with the weight of regret. His alibi is firm; he was seen there until 9:10 PM, yet the comfort of camaraderie does little to assuage his worries. The stakes are high for him, as the potential exposure of his past could not only tarnish his family's name but also force him to confront the very values he has tried to uphold. He fears that the revelation of his actions will shatter the illusion of respectability he has built since returning home.",
      "Ivor’s speech is often gruff, marked by a self-deprecating humor that belies the turmoil within. He knows that he has made mistakes, yet he clings to the belief that he can protect his family from the truth. As he navigates the investigation, he finds himself at a crossroads: to confront his past or allow it to fester in the shadows. The dichotomy of his life weighs heavily on him, the honorable captain versus the man who made choices in the heat of war that could come back to haunt him.",
      "In moments of introspection, Ivor reflects on the nature of honor and the burdens it carries. He understands that the truth has a way of surfacing, and as the investigation deepens, he realizes that he cannot hide forever. The question remains: will he stand up to the past and take responsibility for his actions, or will he allow the fear of exposure to dictate his choices? In a world where integrity is paramount, Ivor must grapple with the reality that sometimes, the battles we face are not fought on the front lines, but within ourselves."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious journalist with a nose for the truth, yet her relentless pursuit of a story threatens to consume her and those around her.",
    "publicPersona": "Ambitious journalist known for uncovering the truth in any situation.",
    "privateSecret": "Has been investigating Eleanor for a potential exposé regarding her past.",
    "motiveSeed": "Seeks to publish a story that could redeem her career and gain recognition.",
    "motiveStrength": "moderate",
    "alibiWindow": "was interviewing hotel guests in the lobby until 9:20 PM",
    "accessPlausibility": "possible",
    "stakes": "An opportunity for a career-defining breakthrough and reclaiming her reputation.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with an intense fervor, her words often rapid and punctuated by sardonic observations that reflect her sharp wit and determination.",
    "signatureTic": "Truth is a slippery fish, isn’t it?",
    "internalConflict": "Beatrice wrestles with the ethics of her pursuit, torn between ambition and the potential harm her story could cause.",
    "personalStakeInCase": "The chance to expose Eleanor could either launch her career or lead to professional ruin, making her choices all the more critical.",
    "paragraphs": [
      "Beatrice Quill is the embodiment of ambition, a journalist whose tenacity is matched only by her sharp wit. Known for her relentless pursuit of the truth, she navigates the world of news with a fervor that borders on obsession. Yet, beneath the surface lies a conflict that threatens to derail her aspirations. Beatrice has been investigating Eleanor, seeking a potential exposé that could redefine her career. In her mind, truth is a slippery fish, isn’t it? And she is determined to catch it, no matter the cost.",
      "With an alibi that places her in the hotel lobby interviewing guests until 9:20 PM, Beatrice feels a rush of adrenaline as she inches closer to a story that could bring her recognition. The stakes are high; the opportunity to reclaim her reputation is tantalizing, yet she is acutely aware of the ethical implications of her pursuit. The thought of exposing Eleanor's past sends a thrill through her, but it also brings with it a wave of guilt. Is she willing to sacrifice another's dignity for her own success? The internal conflict churns within her, a constant battle between ambition and conscience.",
      "Beatrice's speech is rapid and punctuated with sardonic observations, a reflection of her sharp intellect and determination. She often finds herself engaging in witty banter, using humor as a shield against the weight of her choices. As she delves deeper into the investigation, her observations grow darker, revealing a woman who is both driven and deeply conflicted. She knows that every word she writes could have consequences, and the thought of those consequences weighs heavily on her mind.",
      "As the investigation unfolds, Beatrice finds herself at a crossroads. The choice to expose Eleanor could either catapult her into the spotlight or lead to her professional ruin. The tension between her ambition and her moral compass grows, forcing her to confront the reality of her actions. In a world where the truth is often obscured by personal agendas, Beatrice must decide whether to chase the story at any cost or to step back and consider the lives that hang in the balance. The question looms: will she become the voice of truth, or will her ambition lead her down a darker path?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a well-connected socialite whose financial dependency on Eleanor exposes her vulnerabilities and the lengths she will go to maintain her status.",
    "publicPersona": "Well-connected socialite and influencer in the local community.",
    "privateSecret": "Has been financially dependent on Eleanor for years due to reckless investments.",
    "motiveSeed": "Could face financial ruin if Eleanor's hospital project fails, exposing her financial secrets.",
    "motiveStrength": "weak",
    "alibiWindow": "was in her suite preparing for a social event until around 9:00 PM",
    "accessPlausibility": "unlikely",
    "stakes": "Her social status and financial security are at risk.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a refined elegance that masks her insecurities, often using polite yet cutting remarks to deflect attention from her vulnerabilities.",
    "signatureTic": "Oh dear, how terribly inconvenient.",
    "internalConflict": "Sylvia struggles with her dependency on Eleanor and the fear of losing her social standing, leading to feelings of inadequacy.",
    "personalStakeInCase": "The potential failure of Eleanor's project could expose her financial secrets and threaten her carefully curated life.",
    "paragraphs": [
      "Sylvia Trent is the quintessential socialite, a figure woven into the fabric of the local community, known for her elegance and charm. Yet, beneath the polished surface lies a woman grappling with the harsh realities of her financial dependency on Eleanor. Years of reckless investments have left her vulnerable, and the thought of her social status crumbling sends waves of anxiety coursing through her. Sylvia often finds herself murmuring, 'Oh dear, how terribly inconvenient,' as she navigates the treacherous waters of her existence, always careful to maintain her facade.",
      "In the hotel, Sylvia is seen preparing for a social event, her alibi placing her in her suite until around 9:00 PM. But as the clock ticks towards uncertainty, she feels the weight of her dependency bearing down on her. The stakes are high; if Eleanor's hospital project fails, the revelation of Sylvia's financial secrets could shatter her carefully curated life. The thought of being exposed as a woman who relies on others for her status is a fate she dreads, and she is desperate to maintain the illusion of control.",
      "Her speech is marked by a polite elegance, yet there's an underlying savagery in her remarks that reveals her insecurities. Sylvia often deflects attention from her vulnerabilities with cutting humor, a defense mechanism that allows her to navigate social situations with grace. She is acutely aware of the whispers that follow her, the judgment that comes with being a woman of means yet lacking independence. In her heart, she knows that her social standing is precarious, and the fear of losing it looms large.",
      "As the investigation unfolds, Sylvia finds herself at a crossroads. The potential exposure of her financial secrets forces her to confront her dependency on Eleanor, a woman she has both admired and resented. The question becomes not just about maintaining her status, but about redefining her identity in a world that values independence. Will she cling to her facade or take the risk to confront her reality? In a society that places so much value on appearances, Sylvia must navigate the delicate balance between truth and the image she has created for herself."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a charismatic entrepreneur who finds his ambitions at odds with his friendship with Eleanor, leading to a compelling internal struggle as he navigates the investigation.",
    "publicPersona": "A charismatic entrepreneur with a talent for networking and strategy.",
    "privateSecret": "Has been harboring resentment towards Eleanor for not supporting his business ideas.",
    "motiveSeed": "Frustrated with Eleanor's refusal to invest in his ventures after years of friendship, seeing her as an obstacle.",
    "motiveStrength": "compelling",
    "alibiWindow": "was at a business meeting that ended at 8:50 PM",
    "accessPlausibility": "easy",
    "stakes": "His business success and reputation are on the line.",
    "humourStyle": "observational",
    "humourLevel": 0.6,
    "speechMannerisms": "Hugo speaks with an engaging style, often weaving in observational humor that reflects his sharp intellect and frustration with the situation.",
    "signatureTic": "Ah, the irony of it all.",
    "internalConflict": "Hugo struggles with feelings of betrayal and frustration towards Eleanor, torn between friendship and ambition.",
    "personalStakeInCase": "The outcome of the investigation could determine not only his business success but also the integrity of the relationships he values.",
    "paragraphs": [
      "Hugo Vane is a man of charisma, an entrepreneur whose talent for networking has earned him respect in the business community. However, beneath the surface lies a simmering resentment towards Eleanor, a friend who has refused to support his ventures. The irony of their friendship, once built on trust and mutual respect, now feels like a gilded cage, trapping him in a web of frustration. Hugo often finds himself muttering, 'Ah, the irony of it all,' as he navigates the complexities of their relationship amidst the chaos of the investigation.",
      "His alibi places him at a business meeting that ended at 8:50 PM, a fact he holds onto as a lifeline. Yet, as the investigation unfolds, he realizes that the stakes are higher than he anticipated. The refusal of Eleanor to invest in his ideas has left him feeling like an outsider in a world he once thought he belonged to. The potential exposure of her past could either be a boon or a bane for him, and he finds himself grappling with the implications of their intertwined fates.",
      "Hugo's speech is engaging, often laced with observational humor that reflects his sharp intellect. He has a talent for making light of serious situations, yet there's an edge to his humor that reveals his frustration. As he navigates the investigation, he is forced to confront the reality of his feelings toward Eleanor. The question of loyalty becomes intertwined with ambition, and he must decide where his true allegiances lie.",
      "As the investigation deepens, Hugo faces a reckoning. The potential fallout from Eleanor's past could redefine not only his business success but also the relationships he holds dear. In a world where ambition often comes at a cost, he must confront the tension between friendship and aspiration. The irony of their situation weighs heavily on him, and as he grapples with his emotions, he realizes that the path forward will demand difficult choices. Will he prioritize his ambition, or will he seek to mend the rift in their friendship? In a life filled with twists and turns, Hugo must navigate the delicate balance between loyalty and self-interest."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Clifftop Grand Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel with Victorian and Art Deco elegance overlooking the tumultuous sea, harboring secrets among its guests.",
    "visualDescription": "The hotel boasts a towering façade of white stucco and dark wood, with intricate cornices, tall windows, and a sweeping balcony that offers breathtaking views of the churning ocean below. The expansive lobby features polished marble floors, grand chandeliers, and period furnishings that whisper of a bygone era.",
    "atmosphere": "A blend of opulence and unease, where the sound of the waves crashes against the cliffs, echoing the tension within.",
    "paragraphs": [
      "The Clifftop Grand Hotel stands as a sentinel over the restless sea, its Victorian and Art Deco features a testament to the elegance of a bygone era. Guests enter through a grand archway, greeted by the faint scent of salt and the rich aroma of polished wood and leather. The lobby, with its high ceilings and sweeping staircase, feels both inviting and foreboding, as if the walls themselves hold secrets waiting to be unearthed. The distant sound of waves crashing against the rocks below blends with the quiet murmur of guests, creating an atmosphere thick with unspoken tension.",
      "As guests gather in the drawing room, the flickering light from the gas lamps casts long shadows that dance across the ornate wallpaper. Outside, the overcast sky looms, threatening rain, while the wind howls around the edges of the building. The hotel, perched precariously on the cliff, feels isolated from the world, with narrow hallways leading to rooms that seem to trap secrets within their doors. In this opulent yet claustrophobic space, every whispered conversation and furtive glance carries the weight of suspicion.",
      "The manicured gardens outside are a stark contrast to the turmoil inside, with vibrant flowers and neatly trimmed hedges offering a semblance of peace. Yet, the sound of the ocean crashing against the cliffs serves as a constant reminder of the storm brewing both outside and within the hearts of the guests. As the evening approaches, the atmosphere thickens, and the ticking of the mantel clocks becomes a haunting reminder of time slipping away, each stroke a countdown to a revelation that could shatter the fragile calm."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal climates",
    "timeFlow": "A weekend of escalating tension and hidden truths",
    "mood": "tense, with an undercurrent of suspicion among the guests",
    "eraMarkers": [
      "faded radio broadcasts in the background",
      "early television set flickering in the lounge",
      "post-war automobile parked in the lot",
      "rationed fuel posters on the walls"
    ],
    "sensoryPalette": {
      "dominant": "rich wood and leather with salt air",
      "secondary": [
        "crackling gas lamps",
        "distant crashing waves"
      ]
    },
    "paragraphs": [
      "The Clifftop Grand Hotel, with its opulence and seaside charm, encapsulates the essence of the 1940s. The air is tinged with the scent of salt and the lingering aroma of polished wood, creating an atmosphere that is both inviting and unsettling. Guests shuffle through the narrow hallways, their footsteps echoing against the ornate tiles, while the distant sound of waves crashing against the cliffs serves as a constant reminder of the isolation that surrounds them. Outside, the gardens bloom with vibrant colors, yet the grey skies above hint at the brewing storm, both in nature and within the hotel itself.",
      "As the weekend unfolds, tensions rise among the guests, each one harboring secrets that threaten to surface. The flickering gas lamps cast shadows that dance along the walls, creating a sense of unease as whispers fill the air. The hotel's grand staircase, lined with plush carpets, leads to rooms where the doors remain closed, hiding the mysteries within. With every tick of the clock, the atmosphere thickens, as if time itself is conspiring against them, urging the guests toward an inevitable confrontation that could change everything."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Seaside Veranda",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A sun-drenched terrace overlooking the turbulent ocean, adorned with wrought iron railings and scattered chairs, now stained with spilled drinks.",
      "sensoryDetails": {
        "sights": [
          "dark storm clouds rolling in",
          "flickering candlelight on tables",
          "ocean waves crashing against rocks",
          "broken glass glinting on the floor"
        ],
        "sounds": [
          "howling wind through the railings",
          "distant thunder rumbling",
          "dripping water from the awning",
          "soft murmurs of guests"
        ],
        "smells": [
          "fresh sea salt and damp earth",
          "spilled wine and citrus",
          "wet wood and metal",
          "faint floral perfume"
        ],
        "tactile": [
          "cold metal railing",
          "rough stone underfoot",
          "wet fabric of a discarded napkin",
          "chill from the approaching storm"
        ]
      },
      "accessControl": "Restricted to staff and detectives after the incident; guests must remain in the lobby.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops trickling down the glass",
            "grey mist enveloping the cliffs",
            "shadows of seagulls against the clouds"
          ],
          "sounds": [
            "steady patter of rain on awning",
            "soft lapping of waves",
            "distant calls of seabirds"
          ],
          "smells": [
            "damp wood and wet stone",
            "mildew from the rain",
            "sour scent of spilled drinks"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey sky above",
            "dark waves crashing violently",
            "damp chairs lined against the wall"
          ],
          "sounds": [
            "silence interrupted by thunder",
            "wind rustling through the trees",
            "the creak of the balcony"
          ],
          "smells": [
            "salt and brine",
            "wet earth",
            "faint whiff of smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset reflecting on water",
            "long shadows stretching across the terrace",
            "glow of lanterns flickering"
          ],
          "sounds": [
            "gentle waves lapping at the cliff",
            "laughter of guests in the distance",
            "the distant tick of a clock"
          ],
          "smells": [
            "fresh flowers and grass",
            "warmth of the setting sun",
            "smoky aroma of dinner"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Seaside Veranda, once a gathering place for laughter and light, now stands eerily quiet, marred by the remnants of a violent event. The wrought iron railings, slick with rain, frame a view of the ocean that roars in anger, mirroring the chaos that has unfolded. Broken glass glints ominously on the stone floor, a stark reminder of the evening's tragic turn. The air is thick with the scent of spilled wine and salt, a heady mix that hangs heavily, mingling with the dampness of the approaching storm.",
        "As the clouds gather ominously overhead, the atmosphere grows tense. The distant rumble of thunder echoes the unease among the guests, who now avoid the veranda, casting wary glances at the scene of the crime. Every corner of the terrace seems to whisper secrets, and the cold metal railings offer no comfort as the wind howls through the space. This once-vibrant terrace, with its stunning views and lively gatherings, now feels like a stage set for a tragedy yet to unfold."
      ]
    },
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Social gathering space",
      "visualDetails": "A lavishly decorated room with plush armchairs, a grand piano, and large windows draped with heavy curtains, overlooking the gardens.",
      "sensoryDetails": {
        "sights": [
          "ornate chandelier sparkling overhead",
          "richly patterned wallpaper",
          "piano keys gleaming in the light",
          "vibrant flowers in the vase"
        ],
        "sounds": [
          "soft music playing from the piano",
          "quiet laughter of guests",
          "rustling of newspapers",
          "clinking of glasses"
        ],
        "smells": [
          "freshly brewed coffee",
          "old books and leather",
          "cigarette smoke lingering",
          "scent of blooming roses"
        ],
        "tactile": [
          "soft velvet cushions",
          "cool porcelain teacups",
          "fine china under fingertips",
          "smooth wood of the piano"
        ]
      },
      "accessControl": "Open to all guests, but privacy is often sought; staff may enter to serve refreshments.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft light filtering through curtains",
            "water droplets running down the glass",
            "shadows of raindrops on the floor"
          ],
          "sounds": [
            "steady rain tapping on windows",
            "distant thunder rumbling",
            "muffled voices from the hallway"
          ],
          "smells": [
            "freshly brewed tea",
            "wet earth from the gardens",
            "dust motes dancing in the light"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "faded colors of upholstery",
            "the flicker of a candle flame"
          ],
          "sounds": [
            "silence broken by the clock ticking",
            "soft sighs of guests",
            "the rustle of a newspaper page"
          ],
          "smells": [
            "old leather and paper",
            "scent of polished wood",
            "hint of cologne in the air"
          ],
          "mood": "heavy anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light bathing the room",
            "sparkling crystal glasses",
            "the glow of the fireplace"
          ],
          "sounds": [
            "laughter ringing through the room",
            "clinking of ice in glasses",
            "the soft melody of the piano"
          ],
          "smells": [
            "warm spiced cider",
            "smoky aroma from the fireplace",
            "fresh flowers on the table"
          ],
          "mood": "festive cheer"
        }
      ],
      "paragraphs": [
        "The Drawing Room, with its plush furnishings and elegant décor, serves as a focal point for guests seeking comfort and companionship. The ornate chandelier casts a warm glow over the room, illuminating the rich patterns of the wallpaper and the gleaming piano that sits invitingly in the corner. Laughter and soft music fill the space, creating an atmosphere of relaxed sophistication, yet beneath the surface lies a current of tension as secrets simmer among the guests. The scent of fresh coffee mingles with the faint aroma of cigarette smoke, wrapping the room in an air of intrigue.",
        "As the day progresses, the mood shifts with the weather outside, reflecting the inner turmoil of those gathered within. The soft light filtering through the heavy curtains casts an intimate glow, making whispered conversations feel all the more conspiratorial. Guests exchange glances, their expressions betraying unease as the clock ticks away the moments. This drawing room, a sanctuary of sorts, becomes a stage where the unspoken drama unfolds, leaving everyone wondering who will be the first to break the silence."
      ]
    },
    {
      "id": "kitchen",
      "name": "Hotel Kitchen",
      "type": "interior",
      "purpose": "Staff-only area for food preparation",
      "visualDetails": "A bustling kitchen filled with stainless steel appliances, large prep tables, and the scent of fresh ingredients, contrasting with the elegance of the hotel.",
      "sensoryDetails": {
        "sights": [
          "gleaming pots and pans hanging",
          "steam rising from boiling pots",
          "chefs in crisp white uniforms",
          "fruits and vegetables arranged on counters"
        ],
        "sounds": [
          "clattering of dishes",
          "sizzling of food on the grill",
          "muffled conversations of staff",
          "the hum of refrigerators"
        ],
        "smells": [
          "rich aroma of roasting meats",
          "fresh herbs and spices",
          "sweet scent of pastries baking",
          "sharp tang of citrus"
        ],
        "tactile": [
          "smooth marble countertops",
          "hot metal of pots",
          "coolness of fresh produce",
          "textured fabric of aprons"
        ]
      },
      "accessControl": "Strictly staff-only; guests may not enter without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through small windows",
            "water droplets on the glass",
            "busy chefs preparing breakfast"
          ],
          "sounds": [
            "steady rain tapping on the roof",
            "the whoosh of steam from a kettle",
            "the clatter of utensils"
          ],
          "smells": [
            "freshly baked bread",
            "coffee brewing",
            "scent of wet earth outside"
          ],
          "mood": "busy yet cozy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "pans stacked in neat rows",
            "chefs moving briskly about"
          ],
          "sounds": [
            "hurry of footsteps on the tile",
            "the hiss of pans on the stove",
            "the crackle of frying food"
          ],
          "smells": [
            "savory aroma of stews",
            "sharp scent of garlic",
            "freshly chopped herbs"
          ],
          "mood": "frantic energy"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of the kitchen lights",
            "tables set for dinner",
            "desserts cooling on the counter"
          ],
          "sounds": [
            "clinking of silverware",
            "laughter of staff preparing for service",
            "the soft bubbling of sauces"
          ],
          "smells": [
            "aromatic spices filling the air",
            "warm vanilla from desserts",
            "scent of grilled meats"
          ],
          "mood": "anticipatory excitement"
        }
      ],
      "paragraphs": [
        "The Hotel Kitchen buzzes with activity, a stark contrast to the refined atmosphere of the rest of the hotel. Stainless steel appliances gleam under the bright lights, while chefs in crisp white uniforms dart between prep tables, each focused on their tasks. The rich aroma of roasting meats mingles with the scent of fresh herbs, creating a symphony of smells that entice the senses. Amid the clattering of dishes and the hissing of food on the grill, the kitchen feels alive, a heartbeat of the hotel where secrets simmer just as pot roasts do.",
        "As the day unfolds, the kitchen transforms with the changing weather outside. In the morning, the cozy warmth envelops the staff as they prepare breakfast for the guests, the sound of rain tapping rhythmically on the roof creating a comforting backdrop. By afternoon, the frantic energy takes over, with the overhead lights casting long shadows as chefs race to meet the demands of service. As evening approaches, the kitchen glows with anticipation, the scents of grilled meats and aromatic spices filling the air, a tantalizing promise of the culinary delights soon to be presented to the guests."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "Rooftop Terrace",
      "type": "exterior",
      "purpose": "Restricted access area for special events",
      "visualDetails": "An elegant terrace adorned with potted plants, offering panoramic views of the ocean and cliffs, with a wrought-iron staircase leading down.",
      "sensoryDetails": {
        "sights": [
          "potted flowers swaying in the breeze",
          "expansive view of the turbulent sea",
          "twinkling lights of distant ships",
          "clouds gathering ominously"
        ],
        "sounds": [
          "whispering wind through the plants",
          "waves crashing far below",
          "distant laughter from guests on lower floors",
          "the flutter of a flag"
        ],
        "smells": [
          "fresh sea air and salt",
          "scent of blooming flowers",
          "faint hint of smoke from nearby chimneys",
          "coolness of evening dew"
        ],
        "tactile": [
          "rough stone of the terrace floor",
          "smooth metal of the railing",
          "cool breeze brushing against skin",
          "soft petals of flowers"
        ]
      },
      "accessControl": "Access restricted to special events; locked after dark.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "misty view obscured by rain",
            "water pooling in flower pots",
            "grey clouds hanging low"
          ],
          "sounds": [
            "steady rain pattering on the floor",
            "distant thunder rumbling",
            "soft drip of water from plants"
          ],
          "smells": [
            "fresh wet earth",
            "damp flowers",
            "sour scent of rain"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds looming overhead",
            "the ocean churning below",
            "faint outlines of distant cliffs"
          ],
          "sounds": [
            "wind whipping through the terrace",
            "crashing waves echoing",
            "distant voices from the hotel"
          ],
          "smells": [
            "salty ocean air",
            "damp foliage",
            "hint of rain-soaked stone"
          ],
          "mood": "foreboding tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "spectacular sunset painting the sky",
            "glow of lanterns illuminating the terrace",
            "stars beginning to twinkle above"
          ],
          "sounds": [
            "soft laughter and music wafting up",
            "gentle waves lapping at the cliffs",
            "the rustle of leaves in the breeze"
          ],
          "smells": [
            "fresh floral scents",
            "warmth of the evening air",
            "the lingering aroma of dinner"
          ],
          "mood": "romantic anticipation"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace, a hidden gem of the Clifftop Grand Hotel, offers breathtaking views of the ocean and cliffs below. Potted plants sway gently in the breeze, their vibrant colors a stark contrast to the darkening sky. The sound of waves crashing against the rocks below mixes with the whispers of the wind, creating a serene yet eerie atmosphere. This space, often reserved for special events, feels both inviting and isolating, a place where secrets can be shared or hidden away, depending on the company one keeps.",
        "As the day transitions to evening, the terrace transforms into a magical escape. The sunset paints the sky in hues of orange and pink, while the glow of lanterns illuminates the space, casting dancing shadows on the stone floor. Laughter and music drift up from below, but the terrace remains a world of its own, where the salty air carries whispers of the past. Each moment spent here feels charged with possibility, a perfect setting for confessions or betrayals, as the stars begin to twinkle overhead, watching over the secrets that unfold."
      ]
    }
  ],
  "note": "",
  "cost": 0.0026063482500000004,
  "durationMs": 37159
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1947,
    "month": "September",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "September",
    "weather": [
      "overcast with occasional rain",
      "cool breezes from the coast",
      "occasional bursts of sunlight"
    ],
    "daylight": "Shorter days with sunset around six-thirty in the evening, making the evenings feel especially dark and tense.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when shadows lengthen and whispers fill the hallways.",
    "holidays": [
      "Labor Day (observed on the first Monday of September)"
    ],
    "seasonalActivities": [
      "attending harvest festivals",
      "visiting local fairs",
      "enjoying evening strolls along the beach"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suit jackets",
        "fedoras",
        "oxford shoes"
      ],
      "casual": [
        "tweed jackets",
        "button-up shirts with rolled sleeves",
        "slacks"
      ],
      "accessories": [
        "silk ties",
        "cufflinks",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with fitted waists",
        "pearl necklaces",
        "gloves"
      ],
      "casual": [
        "A-line skirts paired with fitted blouses",
        "cardigans",
        "simple flats"
      ],
      "accessories": [
        "wide-brimmed hats",
        "vintage brooches",
        "handbags"
      ]
    },
    "trendsOfTheMoment": [
      "the rise of colorful prints in women's dresses",
      "the popularity of tailored suits for men",
      "the emergence of casual chic as a lifestyle"
    ],
    "socialExpectations": [
      "men are expected to wear suits in formal settings",
      "women are encouraged to balance work and home life",
      "social gatherings often require dress codes"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the ongoing tension of the Cold War affecting global politics",
      "post-war recovery efforts in Europe",
      "the establishment of the United Nations and its growing role"
    ],
    "politicalClimate": "A climate of suspicion, with the Red Scare influencing American society and politics.",
    "economicConditions": "A gradual post-war economic recovery with rising consumer confidence, though shortages in some goods still persist.",
    "socialIssues": [
      "the struggle for civil rights gaining momentum",
      "gender roles evolving with more women entering the workforce",
      "the impact of returning soldiers on labor markets"
    ],
    "internationalNews": [
      "the partition of India and Pakistan causing turmoil",
      "the Marshall Plan aiding European countries",
      "tensions in Berlin over the blockade"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Ella Fitzgerald's jazz standards",
        "the rise of big band sounds"
      ],
      "films": [
        "'Gentleman's Agreement'",
        "'Miracle on 34th Street'",
        "'The Best Years of Our Lives'"
      ],
      "theater": [
        "Broadway's 'Annie Get Your Gun'",
        "the rise of regional theater productions"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Fibber McGee and Molly'",
        "'Suspense'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'The Naked and the Dead' by Norman Mailer",
        "'The Hilliker Curse' by James Salter"
      ],
      "popularGenres": [
        "detective fiction",
        "post-war drama",
        "romantic novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "the first commercial television broadcasts",
        "the development of the jet engine"
      ],
      "commonDevices": [
        "bicycles as a primary mode of transport",
        "early television sets with limited programming",
        "radios in homes and cars"
      ],
      "emergingTrends": [
        "the spread of suburban living",
        "increased leisure time leading to more consumer goods",
        "the rising popularity of automobiles"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cigarettes: one shilling",
        "Movie ticket: one shilling and sixpence"
      ],
      "commonActivities": [
        "family dinners on Sundays",
        "community gatherings at local churches",
        "attending outdoor markets"
      ],
      "socialRituals": [
        "formal tea times among women",
        "men's poker nights",
        "community potlucks"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "a growing middle class with aspirations",
      "the old aristocracy losing some of its influence"
    ],
    "gender": [
      "women gaining more rights and independence",
      "men still seen as primary breadwinners",
      "traditional gender roles slowly shifting"
    ],
    "race": [
      "increased awareness of racial inequalities",
      "tensions due to segregation and civil rights movements"
    ],
    "generalNorms": [
      "courtesy and politeness are highly valued",
      "modesty in dress is expected",
      "social hierarchy still influential but challenged"
    ]
  },
  "atmosphericDetails": [
    "The scent of rain on damp pavement mixed with salty sea air hung heavily in the hotel lobby.",
    "The low murmur of conversations blended with the crackling of a nearby radio, broadcasting the latest news of unrest abroad.",
    "Shadows danced along the ornate wallpaper, creating an atmosphere thick with tension, as guests exchanged furtive glances."
  ],
  "paragraphs": [
    "In September 1947, the coastal hotel stood as a refuge for weary travelers, its overcast skies occasionally parting to reveal fleeting glimpses of sunlight. The air was crisp, heavy with the promise of fall, while the occasional rain shower added to the ambiance of suspense that clung to the guests like a second skin. With dusk arriving earlier each day, the once vibrant chatter in the dining hall had dulled into hushed tones, as if secrets were being woven between the flickering candlelights.",
    "Fashion at this time reflected a blend of post-war optimism and traditional elegance. Men donned double-breasted suit jackets with polished oxfords, while women showcased tea-length dresses adorned with floral prints, their looks completed by pearl necklaces and gloves. The styles spoke of a society in transition, where the elegance of the past met the burgeoning freedom of the present, but within the walls of the hotel, the weight of expectation pressed heavily on each guest, making even the simplest interactions feel charged with unspoken tension.",
    "Daily life was marked by the rhythms of post-war recovery, where community potlucks and formal tea times served as social glue amid changing gender roles. Prices for everyday items reflected a growing economy—loaves of bread at four pence and movie tickets fetching one shilling and sixpence. Yet, the undercurrents of societal change simmered, as women increasingly took on roles outside the home, and men returned from war to a world that was no longer the same. With the Cold War casting a long shadow, the hotel became a microcosm of the broader social landscape, where whispers of discontent mingled with the laughter of children playing outside."
  ],
  "note": "",
  "cost": 0.0010507513499999998,
  "durationMs": 19030
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A mechanical clock-tampering murder unfolds among a diverse group of hotel guests, all grappling with the pressures of post-war recovery and shifting social norms in a tense, isolated setting.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The increasing presence of women in the workforce and the looming Cold War create a backdrop of tension and competition among guests, with class dynamics subtly influencing interactions."
  },
  "setting": {
    "location": "A grand seaside hotel built in the early 1900s, overlooking the ocean.",
    "institution": "hotel",
    "weather": "overcast with occasional rain, typical of coastal climates"
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
    "id": "clock_time",
    "value": "ten minutes past ten",
    "description": "The clock shows this time when the guests arrive."
  },
  {
    "id": "actual_time_of_death",
    "value": "half past eight",
    "description": "The victim died at this time, revealing the clock's deceit."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 10,
  "countsByPlacement": {
    "early": 4,
    "mid": 5,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 9,
    "optional": 1
  },
  "redHerringCount": 0,
  "clues": [
    {
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_2",
      "placement": "early",
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
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "physical"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
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
