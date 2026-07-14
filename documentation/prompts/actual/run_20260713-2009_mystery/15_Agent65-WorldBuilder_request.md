# Actual Prompt Record

- Run ID: `mystery-1783973353370`
- Project ID: ``
- Timestamp: `2026-07-13T20:13:43.032Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `93a4bf28fc9c673c`

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
    "title": "The Silent Witness",
    "author": "Anonymous",
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
      "subtype": "identity"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp-minded detective.",
      "private_secret": "Hiding a troubled past.",
      "motive_seed": "Justice for a friend.",
      "motive_strength": "strong",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Personal redemption.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical Expert",
      "relationships": [],
      "public_persona": "A respected physician.",
      "private_secret": "Involved in illicit drug trials.",
      "motive_seed": "Fear of exposure.",
      "motive_strength": "moderate",
      "alibi_window": "Nine to ten PM.",
      "access_plausibility": "high",
      "opportunity_channels": [
        "medical supplies"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation and career.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Military Officer",
      "relationships": [],
      "public_persona": "A retired sea captain.",
      "private_secret": "Struggling with PTSD.",
      "motive_seed": "Desire for revenge.",
      "motive_strength": "weak",
      "alibi_window": "Ten to ten-thirty PM.",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Personal stability.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Socialite",
      "relationships": [],
      "public_persona": "A charming young woman.",
      "private_secret": "In debt to a dangerous acquaintance.",
      "motive_seed": "Financial desperation.",
      "motive_strength": "strong",
      "alibi_window": "Eight to nine PM.",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Escape from debt.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Writer",
      "relationships": [],
      "public_persona": "An acclaimed author.",
      "private_secret": "Researching dark themes for her next book.",
      "motive_seed": "Inspiration for her writing.",
      "motive_strength": "weak",
      "alibi_window": "Nine-thirty to ten-thirty PM.",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Creative success.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A local entrepreneur.",
      "private_secret": "Involved in shady business deals.",
      "motive_seed": "Fear of being exposed.",
      "motive_strength": "moderate",
      "alibi_window": "N/A",
      "access_plausibility": "locked",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Financial security.",
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
      "summary": "In a seaside hotel, amidst post-war trauma and rising tensions, a local entrepreneur is found dead. Detective Eleanor Voss must untangle a web of deceit, uncovering identities and false alibis, all while navigating the complex social landscape of her peers."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A gramophone in a soundproofed room masked the time of death by playing a recording that made it seem as though the victim was still alive.",
      "delivery_path": [
        {
          "step": "The gramophone was set to play a specific recording that coincided with the time of death."
        },
        {
          "step": "The murderer entered the soundproofed room prior to the murder and set the gramophone to play."
        }
      ]
    },
    "outcome": {
      "result": "The false alibi created by the gramophone misled witnesses about the victim's last moments."
    }
  },
  "false_assumption": {
    "statement": "Hugo Vane was in conversation with Dr. Mallory Finch at the time of his death.",
    "type": "identity",
    "why_it_seems_reasonable": "Witnesses reported hearing voices and laughter from the room where Vane was found.",
    "what_it_hides": "The sound was actually coming from the gramophone playing in the soundproofed room."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses believed Hale was near the victim's room due to the sounds.",
      "Hale had a motive tied to a past grievance against Vane."
    ],
    "the_one_flaw": "Hale's alibi was corroborated by multiple sources who were with him at the bar during the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken vase was found near the victim's body, suggesting a struggle.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The vase was knocked over by the victim in a drunken fit before his death.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Footprints leading to a nearby exit were found.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The footprints were made by housekeeping staff who were cleaning the area.",
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
    "rationale": "All suspects were present at the hotel during the charity event, and no outsiders had access to the victim."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The charity event started at eight PM.",
        "Vane was found dead at ten PM."
      ],
      "windows": [
        "The soundproofed room was accessed between eight-thirty and nine-thirty PM."
      ],
      "contradictions": [
        "Witnesses claimed to hear Vane speaking at nine-thirty, but he was already dead."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Beatrice Quill",
        "Captain Ivor Hale",
        "Sylvia Trent"
      ],
      "objects": [
        "The gramophone",
        "The soundproofed room"
      ],
      "permissions": [
        "Only certain staff had access to the soundproofed room."
      ]
    },
    "physical": {
      "laws": [
        "Sound travels differently in soundproofed rooms."
      ],
      "traces": [
        "The gramophone's needle was found in the 'off' position."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trusted each other due to the charity event's communal atmosphere."
      ],
      "authority_sources": [
        "The hotel's management was responsible for maintaining event security."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses heard laughter and voices from the gramophone's room at the time of the murder.",
        "correction": "The sound actually came from the gramophone, misdirecting their perception of events.",
        "effect": "Narrows the timeline of potential witnesses.",
        "required_evidence": [
          "Witness statements about sounds from the gramophone's room.",
          "The gramophone's needle was found in the 'off' position."
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints were discovered near the victim's door, leading to the soundproofed room.",
        "correction": "The footprints were from housekeeping staff, not the murderer.",
        "effect": "Eliminates Beatrice Quill as a suspect.",
        "required_evidence": [
          "Footprints found in the vicinity of the victim's door.",
          "Staff records showing housekeeping was in the area."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Mallory Finch had access to the soundproofed room and the gramophone.",
        "correction": "Finch's access to the room makes her a prime suspect.",
        "effect": "Narrows the suspect pool to Dr. Mallory Finch.",
        "required_evidence": [
          "Access records showing Finch entered the soundproofed room.",
          "Witness statements about Finch's movements during the event."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A comparison of the gramophone's recording with witness statements reveals inconsistencies.",
    "knowledge_revealed": "The gramophone's recording was tampered with to create a false narrative.",
    "pass_condition": "If the sounds recorded do not match the timeline, it proves Finch's guilt.",
    "evidence_clues": [
      "clue_4",
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements about sounds (early) and the gramophone's needle position (mid) establish a false timeline. Step 2: Footprints (mid) eliminate Beatrice Quill. Step 3: Access records (late) narrow it down to Dr. Mallory Finch, leading to the trap that reveals the tampered recording."
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
      "test_type": "audio comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "The footprints found were traced back to housekeeping staff.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: Ten to ten-thirty PM.",
        "supporting_clues": []
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: Nine-thirty to ten-thirty PM.",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
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
    "identity_rules": [
      {
        "character_name": "Dr. Mallory Finch",
        "revealed_in_act": 3,
        "before_reveal_reference": "the medical expert",
        "after_reveal_reference": "Dr. Finch"
      }
    ],
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_7",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Footprints discovered"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_5",
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
        "clue_id": "clue_8",
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Gramophone recording comparison"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a charming travel writer, finds herself entangled in a web of intrigue at a seaside hotel where a murder has occurred.",
    "publicPersona": "Charming and well-connected, known for her captivating travel articles.",
    "privateSecret": "Eleanor is haunted by a past scandal involving a former lover that she has kept hidden.",
    "motiveSeed": "Curiosity about the recent events at the hotel.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the hotel lobby interviewing guests for her article during the time of the murder.",
    "accessPlausibility": "easy",
    "stakes": "Resolving the mystery could revive her career.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks in a fluid, engaging manner, often punctuating her observations with a wry twist of irony. She has a habit of raising her eyebrows when making a point.",
    "signatureTic": "Well, isn't that just delightful?",
    "internalConflict": "Eleanor grapples with the fear that her past scandal could resurface, tarnishing her reputation and her chance for redemption.",
    "personalStakeInCase": "Solving the murder could restore her credibility as a writer and help her escape the shadows of her past.",
    "paragraphs": [
      "Eleanor Voss had always been drawn to stories, weaving them into her travel articles with the deftness of a seasoned storyteller. But this time, the tale unfolding at the seaside hotel was darker than any she had encountered. As she mingled among the guests, her charming smile and captivating anecdotes masked a gnawing curiosity about the murder that had disrupted the serene facade of the establishment. Resolved to uncover the truth, she felt a flicker of ambition reignite within her, a chance to revive her faltering career.",
      "Yet, beneath her polished exterior lay a turbulent sea of secrets. Eleanor was haunted by a past scandal involving a former lover, a scandal that had nearly ruined her. The fear of being judged, of her past being dragged into the light, loomed like a specter. The irony of investigating a murder while harboring her own dark history was not lost on her. Would she be able to confront her demons while unearthing someone else's?",
      "As she interviewed guests in the hotel lobby, her keen observational skills picked up on the nuances of their stories. Each guest seemed to carry a weight, a hidden truth that Eleanor was determined to uncover. Her alibi was solid—she was in the lobby when the murder took place—but the ease of her access to the scene also made her a potential suspect in the eyes of the very people she sought to help. Still, her passion for unraveling mysteries pushed her forward, her wit sharp as she navigated the delicate social web around her.",
      "Eleanor often found herself reflecting on her personal stake in the case. Solving the murder was not merely a professional obligation; it was a chance to reclaim her narrative. She envisioned herself as the heroine of her own story, a woman who rose from the ashes of her past. But as she delved deeper, she realized that the stakes were higher than she had anticipated. The more she uncovered, the more she felt the weight of her own secrets pressing down on her. Would unveiling the truth also mean exposing her own vulnerabilities?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician, harbors a dark secret that intertwines her fate with that of the murder victim.",
    "publicPersona": "Respected physician known for her compassionate care.",
    "privateSecret": "Mallory had a clandestine affair with the victim that ended badly, leading to public embarrassment.",
    "motiveSeed": "Feeling betrayed by the victim's recent accusations of malpractice.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the hotel medical office attending to a patient during the murder.",
    "accessPlausibility": "possible",
    "stakes": "Her reputation could be ruined by the victim's testimony.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a measured cadence, often choosing her words carefully. She has a tendency to use clinical terms even in casual conversation, which can create an unintentional distance.",
    "signatureTic": "Ah, the irony is simply delightful, isn't it?",
    "internalConflict": "Mallory is torn between her professional ethics and the desire to protect her reputation, fearing that the truth about her affair could be exposed.",
    "personalStakeInCase": "The murder investigation threatens to unravel her life, putting her career and personal life in jeopardy.",
    "paragraphs": [
      "Dr. Mallory Finch was the epitome of grace under pressure, a physician revered for her compassionate care. Yet, behind the polished facade lay a tumultuous past, one that intertwined dangerously with the murder victim. Her clandestine affair with Hugo Vane had been a reckless indulgence, a moment of weakness that now threatened to shatter her carefully constructed life. As she attended to patients in the hotel medical office, her mind raced with the implications of the murder, and the gnawing fear that her past would come back to haunt her.",
      "The accusations of malpractice levied against her by the victim had been an affront she could hardly bear. The betrayal cut deep, igniting a simmering rage that she struggled to contain. Mallory's motive was clear; the desire to silence Hugo's damaging words was a powerful driving force. Yet, her alibi placed her in a precarious position, and the whispers of suspicion began to swirl around her like a gathering storm. Could she truly claim innocence when her connection to the victim ran so deep?",
      "Her interactions were marked by a polite savagery, a sharp wit that masked the turmoil beneath. Mallory had a way of making her observations sound like medical diagnoses, dissecting the motives of those around her with a precision that both intrigued and unnerved. She found herself drawn into the investigation, a reluctant participant in a drama that threatened to expose her darkest secrets. Yet, even as she navigated the treacherous waters of suspicion, she clung to the hope that her professional standing could withstand the storm.",
      "As the investigation unfolded, Mallory grappled with her internal conflict. The need to protect her reputation clashed with her ethical obligation to reveal the truth. Each day brought her closer to a reckoning, as she weighed the cost of silence against the risk of exposure. The irony of her situation was not lost on her; a physician who had dedicated her life to healing was now entangled in a web of deceit. Would she find the courage to confront her past, or would she allow the shadows to consume her?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, is a bitter man whose past mistakes threaten to unravel him amidst a murder investigation.",
    "publicPersona": "A gruff, no-nonsense veteran admired for his service.",
    "privateSecret": "Ivor holds a grudge against the victim for revealing his wartime mistakes in a published article.",
    "motiveSeed": "Desires revenge against the victim for ruining his reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "was on the hotel balcony when the murder occurred.",
    "accessPlausibility": "easy",
    "stakes": "Ivor's honor and legacy are at stake, pushing him toward a breaking point.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks in clipped, direct sentences, often punctuating his points with a scowl. His language is straightforward, with little room for nuance.",
    "signatureTic": "War is hell, but this is ridiculous.",
    "internalConflict": "Ivor is torn between his desire for revenge against Hugo and the realization that his actions could lead to his own downfall.",
    "personalStakeInCase": "The murder investigation threatens to expose his wartime failures, jeopardizing his legacy.",
    "paragraphs": [
      "Captain Ivor Hale was a man forged by the fires of war, yet now he found himself battling a different enemy—his own past. The murder of Hugo Vane had unearthed old wounds, wounds that Ivor had tried to bury beneath layers of gruffness and stoicism. The victim's published words had cut deeper than any enemy's bullet, revealing mistakes that haunted him still. As he stood on the hotel balcony, overlooking the sea, he wrestled with the desire for revenge that bubbled within him like a tempest.",
      "His public persona was that of a respected veteran, admired for his service. But the truth was far murkier. Ivor's grudge against Hugo was a festering wound, one that threatened to consume him. The stakes were high; his honor and legacy were on the line, and he felt the pressure mounting with each passing moment. The alibi he presented was ironclad—he had been on the balcony when the murder occurred—but the proximity to the scene only fueled the rumors swirling around him.",
      "Ivor's blunt speech mirrored his outlook on life. He had little patience for pretense, and his words often cut through the air like a knife. He spoke in short, clipped phrases, unwilling to elaborate on the emotions that roiled beneath the surface. The irony of his situation gnawed at him; a man who had once commanded respect was now a suspect in a murder investigation, his past mistakes coming back to haunt him. Was his desire for vengeance worth the cost of losing everything he had fought for?",
      "As the investigation progressed, Ivor found himself at a crossroads. He had to confront his past mistakes and decide whether revenge was truly worth the price he would pay. The weight of his choices pressed heavily upon him, and he grappled with the realization that the truth might not set him free, but rather bind him to the very mistakes he sought to escape. In a world where honor was paramount, Ivor's journey became a battle for redemption, a struggle to reclaim his name before it was too late."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious socialite, finds herself in a precarious position as her debt and desperation intertwine with the murder mystery.",
    "publicPersona": "A glamorous young woman eager to make a name for herself in high society.",
    "privateSecret": "Beatrice is secretly in debt due to her extravagant lifestyle, and the victim was threatening to expose her.",
    "motiveSeed": "Wants to eliminate the risk of being publicly humiliated.",
    "motiveStrength": "strong",
    "alibiWindow": "was at a charity event hosted in the hotel during the murder.",
    "accessPlausibility": "unlikely",
    "stakes": "Her social standing and future are on the line, driving her actions.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a theatrical flair, often embellishing her stories with dramatic gestures. Her laughter, rich and infectious, can mask her underlying anxiety.",
    "signatureTic": "Oh, darling, life is just a fabulous mess, isn't it?",
    "internalConflict": "Beatrice grapples with the fear of losing her social status and the lengths she might go to protect her image.",
    "personalStakeInCase": "The murder investigation threatens to expose her debts and ruin her carefully crafted persona.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of glamour, her life a dazzling performance on the stage of high society. Yet behind the sparkling façade lay a precarious truth—she was drowning in debt. The victim, Hugo Vane, had been her unwitting tormentor, threatening to expose her financial secrets to the world. As she mingled among the charity event's guests, her laughter rang out like a bell, a mask for the anxiety that gnawed at her insides. The murder had thrown her into a whirlwind of uncertainty, and she felt the ground shifting beneath her feet.",
      "Her public persona was one of ambition and charm, yet her private life was a far cry from the glittering image she projected. Beatrice's desperation to maintain her social standing fueled her actions, leading her to contemplate drastic measures. The stakes were never higher; the potential for public humiliation loomed over her like a dark cloud. Her alibi at the charity event seemed solid, yet the whispers of suspicion began to creep in, and she found herself questioning whether her carefully constructed world could withstand the scrutiny.",
      "Beatrice's sardonic wit often surfaced in her conversations, a defense mechanism against the mounting pressure. She spoke with theatrical flair, her words flowing like a performance, yet the underlying anxiety was palpable. Her signature laugh could charm a room, but when she felt cornered, it turned into a nervous cackle. The irony of her situation was not lost on her; a woman so desperate to climb the social ladder now found herself teetering on the brink of ruin.",
      "As the investigation unfolded, Beatrice was forced to confront her internal conflict. The lengths she would go to protect her image became increasingly murky, and she wrestled with the moral implications of her choices. Would she sacrifice her integrity to preserve her social status, or could she find a way to navigate the treacherous waters of suspicion without losing herself? The murder investigation had become more than just a mystery; it was a test of her character, a chance to redefine who she was amidst the chaos."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a dedicated hotel manager, faces a moral dilemma as the murder investigation threatens to unravel her hidden connections to the victim.",
    "publicPersona": "An efficient and beloved manager who cares deeply for her staff and guests.",
    "privateSecret": "Sylvia is hiding a financial connection to the victim that could jeopardize her position.",
    "motiveSeed": "Fears exposure of her involvement in a failed business venture with the victim.",
    "motiveStrength": "moderate",
    "alibiWindow": "was seen in the hotel office preparing for the charity event.",
    "accessPlausibility": "possible",
    "stakes": "Her career and the future of the hotel depend on her maintaining control.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a warm, reassuring tone, often using inclusive language to foster a sense of camaraderie. She tends to pause thoughtfully before responding, weighing her words carefully.",
    "signatureTic": "After all, we must keep up appearances, mustn't we?",
    "internalConflict": "Sylvia struggles with the fear of losing her job and the hotel’s future while grappling with her own ethical responsibilities.",
    "personalStakeInCase": "The murder investigation threatens her career, and the possibility of exposure could destroy everything she has worked for.",
    "paragraphs": [
      "Sylvia Trent was the heart of the seaside hotel, her efficiency and warmth creating an atmosphere that welcomed guests and staff alike. Yet beneath her gentle demeanor lay a hidden truth—one that tied her to the murder victim, Hugo Vane. As she prepared for the charity event in the hotel office, her mind raced with the implications of the investigation. The financial connection she had with Hugo was a secret she had fought hard to keep buried, but now it threatened to resurface in the most devastating way.",
      "Her public persona was one of unwavering dedication, a beloved manager who cared deeply for her staff. But the stakes had never been higher; her career and the future of the hotel depended on her ability to maintain control amidst the chaos. Sylvia's alibi was plausible—she had been seen preparing for the event—but the whispers of suspicion had begun to take root. As the investigation unfolded, she felt the walls closing in, and the pressure mounted with each passing moment.",
      "Sylvia's observational humor often surfaced in her interactions, a gentle way of navigating the complexities of her role. She spoke with a warm, reassuring tone, using inclusive language that fostered a sense of camaraderie among her staff. Yet, she also knew that appearances could be deceiving, and her signature phrase reminded her of the delicate balance she had to maintain. 'After all, we must keep up appearances, mustn't we?' became a mantra, a reminder of the façade she had to uphold.",
      "As the investigation progressed, Sylvia faced an internal conflict that threatened to unravel her. The fear of losing her job loomed large, and she grappled with the ethical responsibilities of revealing her connection to Hugo. Would exposing the truth jeopardize everything she had worked for, or could she find a way to protect her hotel and its staff while still confronting her own past? The murder investigation had become a crucible, testing her resolve and forcing her to confront the choices that defined her."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a wealthy businessman, becomes the victim of a murder that exposes a tangled web of corruption and secrets.",
    "publicPersona": "A powerful and influential figure in the local business community.",
    "privateSecret": "Hugo was on the verge of exposing several financial scandals that could implicate many people.",
    "motiveSeed": "Threatened to ruin the lives of those involved in corruption.",
    "motiveStrength": "compelling",
    "alibiWindow": "N/A",
    "accessPlausibility": "possible",
    "stakes": "His death would eliminate a major threat to various individuals.",
    "characterArcPotential": "Hugo's life is cut short, leaving behind a tangled web of intrigue and suspicion.",
    "paragraphs": [
      "Hugo Vane was a titan of industry, a man whose influence reached into every corner of the local business community. His public persona exuded power and confidence, but beneath the surface lay a treacherous landscape of secrets. As he navigated the high-stakes world of finance, Hugo was on the verge of exposing several scandals that could bring down powerful figures. His death marked the end of a pivotal chapter, leaving a tangled web of intrigue in its wake.",
      "The stakes were high; Hugo's threats to reveal corruption had stirred a hornet's nest, and many stood to lose everything if his revelations came to light. Those who had once feared his power now breathed a sigh of relief, for his absence meant that their secrets would remain safe—for now. Yet, the irony of his demise was not lost on anyone; the man who had wielded so much influence had become a pawn in a deadly game, his life snuffed out before he could lay bare the truth.",
      "As the investigation unfolded, the whispers of suspicion grew louder. Each character involved had their own motives, their own reasons to wish Hugo harm. The tangled web of financial scandals began to unravel, revealing the precarious positions of those around him. The question lingered in the air: who among them had the most to gain from his death? The answer was as elusive as the man himself, leaving a trail of intrigue that would lead investigators down a dark path.",
      "Hugo's life may have been cut short, but his legacy would endure in the form of the secrets he left behind. The investigation into his murder would not only reveal the truth about his death but also expose the darker side of ambition and greed. As the players moved on the chessboard of their lives, Hugo's absence would serve as a haunting reminder of the price of power, a silent witness to the chaos that followed in his wake."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Cliffside Hotel",
    "type": "Hotel",
    "place": "Bude",
    "country": "England",
    "summary": "A grand seaside hotel perched on a cliff, blending Art Deco elegance with Colonial Revival charm.",
    "visualDescription": "The hotel boasts sweeping ocean views from its balconies, with a grand lobby featuring polished marble floors, ornate chandeliers, and plush seating. The exterior showcases a mix of smooth white stucco and dark wooden accents, framed by lush gardens and rugged cliffs.",
    "atmosphere": "An atmosphere of suspense and unease, heightened by the crashing waves below and the weight of hidden secrets.",
    "paragraphs": [
      "The Cliffside Hotel looms over the rocky coast of Bude, a striking blend of Art Deco and Colonial Revival architecture that stands as a testament to an era of elegance. Guests are greeted by the cool sea breeze, carrying the salty tang of the ocean, as they step into its grand lobby, where polished marble reflects the flickering light from ornate chandeliers. Outside, the sound of the waves crashing against the cliffs creates a constant, rhythmic backdrop, a reminder of nature's power and the isolation of this coastal retreat.",
      "Inside, the hotel is a labyrinth of narrow hallways and secluded corners, where whispers of recent events echo in the air. The scent of damp stone mingles with the aroma of freshly brewed tea, served in delicate china in the sunlit drawing room. Each guest seems to carry their own burden, shadows of post-war trauma etched into their features. The atmosphere feels charged, as if the very walls are privy to the secrets that lie just beneath the surface.",
      "As evening descends, the once-vibrant lobby takes on a more sinister hue, shadows stretching along the walls, and the distant sound of the sea becomes a haunting melody. The hotel is alive with the murmur of voices, punctuated by the crackle of a radio broadcasting news from the outside world—news that feels increasingly distant. The ocean view balconies remain eerily quiet, a stark contrast to the turmoil brewing within the hotel, where every guest is a potential witness to the unfolding mystery."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of seaside climates in early autumn.",
    "timeFlow": "Three days of mounting tension and secrets unraveling.",
    "mood": "Tense and slightly anxious due to recent events affecting the guests.",
    "eraMarkers": [
      "Manual typewriters in the lobby for guest correspondence",
      "Radio broadcasts in every room",
      "Early television sets in common areas"
    ],
    "sensoryPalette": {
      "dominant": "Salty ocean air tinged with anxiety",
      "secondary": [
        "Crisp linen and polished wood",
        "Faint floral notes from the garden"
      ]
    },
    "paragraphs": [
      "The Cliffside Hotel stands as a monument to the elegance of the 1940s, yet beneath its polished surface lies a world fraught with tension. Overcast skies loom above, casting a muted light over the grand structure, as the salty air carries whispers of unease. Each guest appears to tread lightly, navigating the narrow hallways and secluded corners as if afraid to disturb the fragile peace that has settled within its walls.",
      "As the days pass, the atmosphere thickens; the sounds of the crashing waves below become a constant reminder of the isolation that envelops the hotel. The scent of damp stone and old leather fills the air, mingling with the aroma of freshly brewed tea as guests gather in the drawing room, their conversations laced with unspoken fears. The weight of recent events hangs heavy, as if the very fabric of the hotel is woven with secrets waiting to be uncovered."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests and events",
      "visualDetails": "The lobby features polished marble floors, ornate chandeliers, and a large reception desk framed by lush plants.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate chandeliers",
          "lush green potted palms",
          "framed vintage photographs",
          "dark oak reception desk"
        ],
        "sounds": [
          "soft murmurs of guests",
          "clattering of teacups",
          "distant radio broadcasts",
          "footsteps echoing on marble",
          "the rustle of newspapers"
        ],
        "smells": [
          "freshly brewed tea",
          "polished wood and beeswax",
          "damp stone",
          "floral arrangements",
          "old leather"
        ],
        "tactile": [
          "smooth marble underfoot",
          "cool metal of reception bell",
          "soft upholstery of armchairs",
          "rough texture of newspapers",
          "crisp linen tablecloths"
        ]
      },
      "accessControl": "Open to all guests during daylight hours; staff-only behind reception desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft whispers of guests",
            "the crackle of radio news"
          ],
          "smells": [
            "damp earth",
            "freshly brewed coffee",
            "polished wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "faded photographs on the walls"
          ],
          "sounds": [
            "the creak of old timbers",
            "clinking of teacups",
            "the rustle of newspapers"
          ],
          "smells": [
            "dust and old leather",
            "freshly baked pastries",
            "faint floral notes"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "shadows dancing on walls"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "distant laughter from the bar",
            "soft music from the radio"
          ],
          "smells": [
            "tobacco smoke",
            "candle wax",
            "freshly polished wood"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby is the heart of The Cliffside Hotel, a space where guests mingle and secrets exchange hands beneath the soft glow of ornate chandeliers. Polished marble floors reflect the flickering candlelight, creating an inviting yet eerie atmosphere. Lush potted palms stand sentinel, while vintage photographs lining the walls whisper tales of the past, each one a silent witness to the lives that have unfolded within these walls.",
        "As rain begins to fall outside, the lobby transforms, the sound of droplets drumming against the windows mingling with the soft murmurs of guests. The scent of freshly brewed tea fills the air, a comforting embrace against the tension that hangs like a shroud. Guests shuffle about, caught in hushed conversations, their eyes darting as they share knowing glances, each one acutely aware of the weight of the secrets they carry."
      ]
    },
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Relaxation and informal gatherings",
      "visualDetails": "A cozy room furnished with plush sofas, a large fireplace, and a grand piano, all adorned with intricate period decorations.",
      "sensoryDetails": {
        "sights": [
          "plush velvet sofas",
          "glimmering fireplace",
          "grand piano in the corner",
          "ornate period decor",
          "framed paintings of coastal scenes"
        ],
        "sounds": [
          "crackling fire",
          "soft piano melodies",
          "laughter and conversation",
          "the rustle of newspapers",
          "distant radio broadcasts"
        ],
        "smells": [
          "smoky wood from the fireplace",
          "freshly baked scones",
          "polished wood and dust",
          "faint perfume lingering in the air",
          "leather-bound books"
        ],
        "tactile": [
          "soft velvet cushions",
          "warmth from the fireplace",
          "coolness of the piano keys",
          "smooth surface of a teacup",
          "rough texture of newspaper"
        ]
      },
      "accessControl": "Open to guests during the day; private gatherings in the evening require prior arrangement.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft light filtering through clouds",
            "water droplets on windowpanes"
          ],
          "sounds": [
            "gentle rain against the glass",
            "soft murmurs of conversation",
            "the crackling of the fire"
          ],
          "smells": [
            "freshly baked bread",
            "smoky wood",
            "damp earth"
          ],
          "mood": "intimate warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "faded colors of upholstery"
          ],
          "sounds": [
            "the ticking of a clock",
            "the sound of teacups clinking"
          ],
          "smells": [
            "dusty books",
            "freshly brewed tea",
            "the scent of old leather"
          ],
          "mood": "melancholic reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on mantel",
            "soft glow from lamps"
          ],
          "sounds": [
            "gentle piano music",
            "the laughter of guests",
            "the crackle of the fire"
          ],
          "smells": [
            "candle wax",
            "tobacco smoke",
            "the scent of freshly cut flowers"
          ],
          "mood": "elegant sophistication"
        }
      ],
      "paragraphs": [
        "The Drawing Room is a sanctuary of comfort and elegance, with plush velvet sofas inviting guests to sink in and share whispered conversations. The large fireplace casts a warm glow, illuminating the intricate period decorations that adorn the walls. A grand piano rests in the corner, its polished surface reflecting the flickering light, while the scent of smoky wood and freshly baked scones wafts through the air, creating an atmosphere of home and warmth.",
        "As the morning rain patters against the windowpanes, the Drawing Room becomes a refuge from the storm outside. The sound of soft piano melodies fills the space, mingling with the gentle laughter of guests, creating an intimate ambiance that belies the tension brewing within the hotel. Each guest seems lost in thought, their eyes wandering to the framed coastal scenes on the walls, perhaps contemplating their own journeys and the secrets they hold."
      ]
    },
    {
      "id": "balcony",
      "name": "Ocean-View Balcony",
      "type": "exterior",
      "purpose": "Private relaxation and observation point",
      "visualDetails": "A spacious balcony adorned with wrought iron railings, offering sweeping views of the ocean and rugged cliffs below.",
      "sensoryDetails": {
        "sights": [
          "vast ocean stretching to the horizon",
          "waves crashing against cliffs",
          "seagulls soaring overhead",
          "dark clouds gathering in the distance",
          "sunlight breaking through clouds"
        ],
        "sounds": [
          "crashing waves below",
          "the distant call of seagulls",
          "whispering wind through the railings",
          "the rustle of leaves",
          "faint music from the lobby"
        ],
        "smells": [
          "salty ocean air",
          "fresh rain on stone",
          "damp earth",
          "the scent of blooming coastal flowers",
          "faint whiff of tobacco smoke"
        ],
        "tactile": [
          "cool metal of railings",
          "smooth surface of stone floor",
          "gentle breeze on skin",
          "rough texture of weathered wood",
          "moisture-laden air"
        ]
      },
      "accessControl": "Accessible to guests during daylight hours; closed after sunset for safety reasons.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds hanging low",
            "raindrops glistening on railings"
          ],
          "sounds": [
            "steady patter of rain",
            "the roar of waves",
            "distant thunder"
          ],
          "smells": [
            "fresh rain on stone",
            "damp earth",
            "salty sea spray"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light over the ocean",
            "dark waves crashing against rocks"
          ],
          "sounds": [
            "rhythmic crashing of waves",
            "the whisper of wind",
            "distant voices from below"
          ],
          "smells": [
            "salt and seaweed",
            "cool damp air",
            "the scent of wet stone"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "long shadows on the balcony floor"
          ],
          "sounds": [
            "gentle lapping of water",
            "the distant laughter of guests",
            "the soft call of seabirds"
          ],
          "smells": [
            "warmth of the setting sun",
            "freshly cut grass",
            "the scent of blooming flowers"
          ],
          "mood": "reflective tranquility"
        }
      ],
      "paragraphs": [
        "The Ocean-View Balcony offers a breathtaking perspective of the rugged coastline, where the vast ocean stretches to the horizon, its deep blue depths contrasting with the stark cliffs below. Wrought iron railings frame the view, providing a sense of safety while inviting guests to lean out and breathe in the salty air. The sound of crashing waves below creates a rhythmic symphony, echoing the turmoil that brews within the hotel’s walls.",
        "As the morning rain drizzles down, the balcony takes on a foreboding quality, the grey clouds hanging low and the sharp scent of damp earth permeating the air. Guests stand quietly, gazing out at the tumultuous sea, their thoughts heavy with the weight of unspoken fears. In that moment, the balcony becomes a threshold between the chaos of the ocean and the secrets that lie hidden within the Cliffside Hotel."
      ]
    },
    {
      "id": "seaside_access",
      "name": "Secluded Beach Access",
      "type": "transitional",
      "purpose": "Restricted access to the beach for guests and staff",
      "visualDetails": "A narrow path winding down the cliffside, flanked by wildflowers and rocky outcrops leading to a secluded beach.",
      "sensoryDetails": {
        "sights": [
          "wildflowers blooming along the path",
          "rugged cliffs dropping to the sea",
          "hidden cove appearing below",
          "driftwood scattered on the sand",
          "waves crashing against the shore"
        ],
        "sounds": [
          "distant roar of waves",
          "the rustle of leaves",
          "the soft crunch of gravel underfoot",
          "the call of seabirds",
          "wind whistling through the grass"
        ],
        "smells": [
          "fresh sea air",
          "scent of wildflowers",
          "damp earth",
          "salty ocean spray",
          "the faint smell of smoke from a distant fire"
        ],
        "tactile": [
          "rough texture of rocky path",
          "soft petals of wildflowers",
          "cool breeze on skin",
          "warmth of the sun",
          "gritty sand between toes"
        ]
      },
      "accessControl": "Staff-only access at night; guests must request permission to use the path.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "path glistening with rain",
            "grey clouds looming overhead"
          ],
          "sounds": [
            "steady patter of rain on leaves",
            "distant thunder rolling",
            "waves crashing with intensity"
          ],
          "smells": [
            "fresh rain on earth",
            "salty sea spray",
            "the scent of wet stone"
          ],
          "mood": "ominous"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "dark waves crashing against rocks"
          ],
          "sounds": [
            "the rhythmic crash of waves",
            "the whisper of the wind",
            "the distant call of gulls"
          ],
          "smells": [
            "salt and seaweed",
            "cool damp air",
            "the scent of wet stone"
          ],
          "mood": "isolated contemplation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "long shadows of cliffs"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant laughter of guests",
            "the soft call of seabirds"
          ],
          "smells": [
            "warmth of the setting sun",
            "the scent of blooming flowers",
            "the salty ocean breeze"
          ],
          "mood": "peaceful closure"
        }
      ],
      "paragraphs": [
        "The Secluded Beach Access is a hidden gem, a narrow path winding down the cliffside, flanked by vibrant wildflowers and rocky outcrops. As guests navigate this winding trail, the sound of crashing waves grows louder, mingling with the rustle of leaves overhead. The path offers a glimpse of the hidden cove below, where the beach awaits, a secluded sanctuary away from the prying eyes of the hotel.",
        "In the morning rain, the path glistens, each step taken with caution as the clouds loom overhead. The scent of fresh rain on earth fills the air, a stark contrast to the salty sea spray rising from the tumultuous waves. This secluded access point holds secrets of its own, whispering promises of solitude and reflection, while the crashing waves below echo the turmoil that brews within the confines of the hotel."
      ]
    }
  ],
  "note": "",
  "cost": 0.00242907225,
  "durationMs": 52876
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1943,
    "month": "February",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast skies with frequent rain",
      "chilly winds from the ocean",
      "occasional sunny breaks"
    ],
    "daylight": "Short days with sunset around 5:30 PM, creating a dim, early evening atmosphere.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests settle into their rooms.",
    "holidays": [
      "Valentine's Day (February 14)"
    ],
    "seasonalActivities": [
      "indoor social gatherings by the fireplace",
      "visits to local theaters for winter performances",
      "cozy dinner parties with friends"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "tweed overcoat",
        "crisp white dress shirt"
      ],
      "casual": [
        "wool sweater",
        "corduroy trousers",
        "heavy scarf"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a fitted waist",
        "tailored wool coat",
        "silk blouse"
      ],
      "casual": [
        "knitted sweater",
        "A-line skirt",
        "tweed slacks"
      ],
      "accessories": [
        "periwinkle hat with a veil",
        "string of pearls",
        "mittens"
      ]
    },
    "trendsOfTheMoment": [
      "shoulder pads for both men and women",
      "bold colors in women's evening wear",
      "increased use of synthetic fabrics"
    ],
    "socialExpectations": [
      "men are expected to take the lead in social situations",
      "women are increasingly seen in professional roles",
      "politeness and decorum are highly valued"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Battle of Stalingrad reaches a critical point, impacting morale",
      "Allied forces prepare for significant actions in North Africa",
      "Rationing continues to affect daily life across the UK and Europe"
    ],
    "politicalClimate": "Tensions are high, with nations mobilizing for war efforts and public sentiment fluctuating between hope and despair.",
    "economicConditions": "Rationing is in full effect, leading to scarcity of many goods, which affects both luxury and essential items.",
    "socialIssues": [
      "women's roles in the workforce are evolving",
      "strikes and labor disputes arise as workers demand fair wages",
      "racial segregation remains a contentious issue"
    ],
    "internationalNews": [
      "The Pacific Theater sees increased confrontations as US forces engage Japan",
      "Reports of resistance movements in occupied Europe gain attention"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Don't Sit Under the Apple Tree' by The Andrews Sisters",
        "'I'll Be Seeing You' by Bing Crosby",
        "Big band sounds from Glenn Miller"
      ],
      "films": [
        "'Casablanca'",
        "'Shadow of a Doubt'",
        "'The Ox-Bow Incident'"
      ],
      "theater": [
        "Broadway shows like 'Oklahoma!', which is in the midst of its run",
        "local playhouses showcasing wartime-themed dramas"
      ],
      "radio": [
        "The Shadow",
        "Fibber McGee and Molly",
        "The Jack Benny Program"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Little Prince' by Antoine de Saint-Exupéry",
        "'The Moon is Down' by John Steinbeck",
        "'The Glass Menagerie' by Tennessee Williams"
      ],
      "popularGenres": [
        "detective fiction",
        "war stories",
        "romantic fiction reflecting wartime emotions"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first practical radar systems",
        "early developments in penicillin",
        "the use of V-2 rockets begins"
      ],
      "commonDevices": [
        "manual typewriters in homes and offices",
        "radios as a primary source of news",
        "drafting tools for engineers"
      ],
      "emergingTrends": [
        "increased reliance on radio for entertainment and news",
        "growing consumer interest in early television broadcasts",
        "developments in wartime technology affecting civilian life"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 4 pence",
        "Pound of butter: 1 shilling",
        "Movie ticket: 1 shilling"
      ],
      "commonActivities": [
        "attending local community events",
        "engaging in wartime volunteer efforts",
        "participating in neighborhood watch groups"
      ],
      "socialRituals": [
        "tea time in the afternoons",
        "community dances with live music",
        "regular church services with communal prayers for soldiers"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "class distinctions remain strong, but wartime has blurred some lines",
      "middle class families are increasingly involved in community services"
    ],
    "gender": [
      "women are stepping into roles traditionally held by men",
      "societal expectations still pressure women to maintain domestic duties despite their careers",
      "men feel the pressure to provide and protect"
    ],
    "race": [
      "racial tensions persist, especially in urban areas",
      "increased advocacy for civil rights begins to emerge"
    ],
    "generalNorms": [
      "politeness and decorum are essential in social interactions",
      "support for the war effort is a unifying theme",
      "cultural expressions are influenced by the ongoing war"
    ]
  },
  "atmosphericDetails": [
    "The faint smell of wood smoke mingles with the salty air as guests huddle by the hotel's crackling fireplace.",
    "Occasional raindrops patter against the windows, creating a rhythmic backdrop to whispered conversations and anxious glances.",
    "The clinking of glasses and the soft murmur of voices fill the dimly lit lounge, punctuated by the distant sound of a radio broadcasting news of the war."
  ],
  "paragraphs": [
    "February 1943 envelops the coastal hotel in a shroud of winter chill and gray, overcast skies. Rain intermittently batters the windows, a reminder of the tempestuous world outside. The atmosphere is decidedly tense, as guests, cloaked in wool and tweed, gather for warmth, their minds occupied by the relentless news of the war. On the heels of Valentine's Day, the air buzzes with an undercurrent of anxiety, as couples navigate the complexities of love amidst the chaos of conflict, while single patrons harbor unspoken fears of the future.",
    "Fashion in this winter month leans heavily into practicality fused with style, as men don tailored suits and smart overcoats, accessorized with fedoras and leather gloves. Women favor tea-length dresses adorned with bold colors, complemented by fitted coats and elegant hats, conveying both sophistication and resilience. The presence of shoulder pads is noticeable, as both genders embrace the wartime trend of structured silhouettes, reflecting their aspirations for strength in uncertain times.",
    "Daily life continues amidst the backdrop of rationing and societal change, with typical prices reflecting the economic strain: a loaf of bread costs four pence, while a movie ticket draws patrons at one shilling. Social rituals, such as afternoon tea and community dances, serve as vital respites from the tension of the outside world. As guests mingle in the hotel's dimly lit lounge, the soft strains of popular music from the radio fill the air, providing a brief escape into the romanticized past while the reality of the war looms ever-present."
  ],
  "note": "",
  "cost": 0.0010834692,
  "durationMs": 24522
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a seaside hotel for a charity event unites guests grappling with post-war trauma while the looming specter of Cold War tensions heightens their anxieties and secrets.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has shifted social dynamics, with women entering the workforce and class tensions rising amid a backdrop of shared trauma and suspicion."
  },
  "setting": {
    "location": "A large seaside hotel with Art Deco and Colonial Revival architecture",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain, typical of seaside climates in early autumn."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an acoustic method, where a gramophone recording played into a soundproofed room fabricates an alibi for the true moment of death."
}

### LOCKED_FACTS
[
  {
    "id": "start_time",
    "value": "ten minutes past eleven",
    "description": "The time the gramophone began playing the recording."
  },
  {
    "id": "end_time",
    "value": "twenty minutes past eleven",
    "description": "The time at which the murder actually occurred."
  },
  {
    "id": "distance",
    "value": "thirty feet",
    "description": "The distance from the gramophone to the victim's location."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 8,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
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
      "category": "testimonial"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_2",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_7",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "testimonial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_1",
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
