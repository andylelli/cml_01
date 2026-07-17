# Actual Prompt Record

- Run ID: `mystery-1784262732876`
- Project ID: ``
- Timestamp: `2026-07-17T04:35:34.581Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `4c1c62ea1ed90c06`

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
    "title": "Echoes of Identity",
    "author": "Mystery Writer",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A grand seaside hotel with Art Deco influences",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "identity"
    }
  },
  "death_method": "struck with a heavy object",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Respected private investigator",
      "private_secret": "Struggles with PTSD from war experiences",
      "motive_seed": "Curiosity for justice",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "investigation"
      ],
      "behavioral_tells": [],
      "stakes": "Her reputation as a detective",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Expert Witness",
      "relationships": [],
      "public_persona": "Renowned physician",
      "private_secret": "Hides a past affair with the victim",
      "motive_seed": "Guilt and fear of exposure",
      "motive_strength": "moderate",
      "alibi_window": "ten minutes before the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hospital"
      ],
      "behavioral_tells": [
        "nervousness around the victim's family"
      ],
      "stakes": "His medical license",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Authority Figure",
      "relationships": [],
      "public_persona": "Hotel manager",
      "private_secret": "Involved in smuggling operations",
      "motive_seed": "To protect his illicit business",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel access"
      ],
      "behavioral_tells": [],
      "stakes": "His business and reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Accomplice",
      "relationships": [],
      "public_persona": "Hotel waitress",
      "private_secret": "In love with Captain Hale",
      "motive_seed": "Desire to please Hale",
      "motive_strength": "weak",
      "alibi_window": "twenty minutes before the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel dining hall"
      ],
      "behavioral_tells": [
        "eager to please",
        "overly friendly"
      ],
      "stakes": "Her job",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Socialite",
      "private_secret": "Knew too much about Hale's operations",
      "motive_seed": "Threat to expose Hale",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel room"
      ],
      "behavioral_tells": [],
      "stakes": "Her life",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Red Herring",
      "relationships": [],
      "public_persona": "Traveling salesman",
      "private_secret": "Involved in gambling debts",
      "motive_seed": "Financial desperation",
      "motive_strength": "weak",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel bar"
      ],
      "behavioral_tells": [
        "anxiety about money"
      ],
      "stakes": "His livelihood",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
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
      "summary": "In the foggy coastal atmosphere of a grand seaside hotel, a renowned socialite is found dead, her demise shrouded in an identity crisis as clues lead to a concealed truth about her murderer. Detective Eleanor Voss must unravel the threads of deception while navigating the complexities of post-war society."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A gramophone recording plays during the murder, masking the sound of the attack and giving the illusion that the victim was still alive.",
      "delivery_path": [
        {
          "step": "A gramophone is set to play at a specific time in the soundproofed room."
        },
        {
          "step": "The murderer strikes while the recording plays, creating an alibi."
        }
      ]
    },
    "outcome": {
      "result": "The real time of death is obscured, leading to confusion among the witnesses."
    }
  },
  "false_assumption": {
    "statement": "The victim was alive when the gramophone recording played.",
    "type": "identity",
    "why_it_seems_reasonable": "Witnesses heard the music and assumed the victim was still in the room.",
    "what_it_hides": "The true time of the murder, which occurred just before the recording started."
  },
  "false_solution": {
    "accused_suspect": "Hugo Vane",
    "supporting_points": [
      "Witnesses saw him near the hotel bar just before the murder, leading them to suspect him.",
      "He had a known financial motive due to gambling debts."
    ],
    "the_one_flaw": "Hugo's alibi is confirmed by multiple witnesses who saw him at the bar during the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken window in the victim's room.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The window was broken by a storm the night before, not during the murder.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A hidden love letter found in the victim's belongings.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The letter was from a previous relationship and had no bearing on the murder.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel during the murder, with no evidence of an outsider."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Recording start time",
        "Witness statements"
      ],
      "windows": [
        "Murder occurred just before recording started",
        "Witnesses heard recording play"
      ],
      "contradictions": [
        "Recording time contradicts witness statements",
        "Murderer had to leave before witnesses entered"
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Dr. Mallory Finch",
        "Beatrice Quill"
      ],
      "objects": [
        "Gramophone",
        "Soundproof room"
      ],
      "permissions": [
        "Managerial access to soundproof room",
        "Medical access for Finch"
      ]
    },
    "physical": {
      "laws": [
        "Sound cannot travel through soundproof materials",
        "Outside noise cannot be heard within the room"
      ],
      "traces": [
        "Footprints leading away from the room",
        "Gramophone needle wear"
      ]
    },
    "social": {
      "trust_channels": [
        "Witness credibility",
        "Social status of guests"
      ],
      "authority_sources": [
        "Captain Hale's authority over hotel operations"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The gramophone needle shows wear consistent with recent use.",
        "correction": "The gramophone was played shortly before the murder took place.",
        "effect": "Narrows the potential murder window to just prior to the recording.",
        "required_evidence": [
          "Gramophone needle wear",
          "Witness statements about the recording time"
        ],
        "reader_observable": true
      },
      {
        "observation": "Guests report hearing the recording start, but not the victim's voice.",
        "correction": "This suggests the victim was already dead when the recording began.",
        "effect": "Eliminates the possibility of the victim being alive during the recording.",
        "required_evidence": [
          "Witness statements about the music",
          "Recording time discrepancies"
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints leading away from the soundproof room are found.",
        "correction": "This indicates someone exited shortly after the murder occurred.",
        "effect": "Narrows the suspect pool to those with access to the room.",
        "required_evidence": [
          "Footprint analysis",
          "Access records"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Testing the recording against the timeline of the murder proves that the gramophone was used to create an alibi for the actual murder time.",
    "knowledge_revealed": "The recording's timing and the witness statements contradict each other.",
    "pass_condition": "If the test shows that the recording was played after the murder, it confirms the false assumption.",
    "evidence_clues": [
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core",
      "clue_2",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The gramophone needle's wear and witness statements (early) indicate the recording's timing. Step 2: Guests' reports about the absence of the victim's voice (mid) confirm she was dead. Step 3: Footprint evidence (discriminating test) reveals that the murderer left the scene after the crime."
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
      "test_type": "Contradiction proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi by multiple witnesses",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proved unrelated to the victim's past relationships",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi by multiple witnesses",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
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
        "character_name": "Captain Ivor Hale",
        "revealed_in_act": 3,
        "before_reveal_reference": "the hotel manager",
        "after_reveal_reference": "Captain Hale"
      }
    ],
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Physical evidence"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A determined local journalist with a knack for uncovering secrets, Eleanor Voss is driven by a need to prove herself in a world still rattled by the echoes of war.",
    "publicPersona": "Eleanor wears her curiosity like a badge, often seen with a notepad in hand, ready to chase down the next story. Her articles are well-regarded, but the whispers of her anxiety linger just beneath the surface.",
    "privateSecret": "Beneath her professional façade, Eleanor grapples with the weight of post-war trauma, suffocated by anxiety that threatens to choke her resolve.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "Eleanor was present at the hotel during the murder, ostensibly covering an event that attracted the local elite.",
    "accessPlausibility": "easy",
    "stakes": "For Eleanor, solving the murder is not just about justice; it's an opportunity to rise in her profession, to be more than just another voice in the crowd.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often pausing as if weighing her words carefully. She tends to inject dry observations into her dialogue, revealing her sharp wit.",
    "signatureTic": "Well, that's one way to look at it.",
    "internalConflict": "Eleanor's struggle with anxiety manifests in her fear of failure, often leaving her second-guessing her instincts, especially when the stakes are high.",
    "personalStakeInCase": "This case feels personal to Eleanor, as it represents a chance to redefine her identity beyond the shadows of her anxiety and the expectations of her peers.",
    "paragraphs": [
      "Eleanor Voss had always been drawn to stories that lurked in the quiet corners of her small town, but the murder at the seaside hotel was a tale that demanded her full attention. The Art Deco splendor of the venue belied the chaos that had erupted within its walls, and Eleanor, with her notepad clutched tightly, felt a familiar thrill coursing through her veins. This was her moment to shine, to step out from behind the shadows of her anxiety, and to prove her mettle as more than just a local journalist.",
      "However, as she navigated the treacherous waters of the investigation, each new lead twisted her insides with trepidation. The echoes of her past, the memories of a war that had left scars deeper than any physical wound, haunted her every step. She was plagued by the fear that her anxiety would betray her when she needed her instincts most, forcing her to confront a truth she had long buried. Could she unravel this mystery before it consumed her?",
      "Eleanor's mind raced, analyzing the motives of the suspects she encountered, each with their own secrets and deceptions. She often found herself observing their interactions with a sharp eye, her dry wit surfacing in moments of levity as she noted the absurdity of their pretenses. 'Well, that's one way to look at it,' she would quip, masking her own unease with a veneer of humor. Yet, the weight of her own secrets loomed large, threatening to overshadow her newfound purpose.",
      "As the investigation deepened, Eleanor realized that solving the murder was not merely about the pursuit of truth; it was about reclaiming her identity. With each revelation, she felt a flicker of confidence ignite within her, a spark that encouraged her to face her fears head-on. The case had become a crucible, one that could either forge her into a journalist of renown or shatter her under the weight of her own self-doubt. In the end, she knew that the true story lay not just in the murder itself, but in her own journey towards self-acceptance."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A well-respected psychologist, Dr. Mallory Finch is a professional rival to Eleanor, but her own struggles with mental health threaten to unravel her carefully constructed facade.",
    "publicPersona": "Mallory is seen as a pillar of the community, providing therapy to veterans and advocating for mental health awareness, but her polished exterior hides her internal turmoil.",
    "privateSecret": "Behind closed doors, Mallory self-prescribes medication to manage her own mental health issues, a practice that could jeopardize her career if discovered.",
    "motiveSeed": "The rise of Eleanor Voss poses a threat to Mallory's reputation, as she fears being overshadowed by Eleanor's potential fame.",
    "motiveStrength": "strong",
    "alibiWindow": "She claims to have been in her office during the murder, but the truth may be more complicated than her account suggests.",
    "accessPlausibility": "possible",
    "stakes": "If Eleanor's article on mental health gains traction, it could not only threaten Mallory's practice but also expose her own vulnerabilities.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a calm authority, often employing clinical language that softens into more casual banter when she feels comfortable. She has a tendency to use rhetorical questions to steer conversations.",
    "signatureTic": "You must understand, perception is reality.",
    "internalConflict": "Mallory is caught in a web of denial, struggling to reconcile her professional identity with her personal struggles, fearing that exposure would lead to her downfall.",
    "personalStakeInCase": "The murder investigation is a direct threat to her practice, as any scandal could unravel the delicate trust she has built with her patients.",
    "paragraphs": [
      "In the world of psychology, Dr. Mallory Finch was a respected name, known for her work with veterans seeking solace from the shadows of war. Yet, as she stood in the grand lobby of the seaside hotel, her thoughts were consumed by the looming threat of Eleanor Voss. The journalist's rising fame felt like a dark cloud, casting shadows over Mallory's carefully curated reputation. 'You must understand, perception is reality,' she often reminded herself, but the reality was that Eleanor's success could obliterate her own.",
      "Mallory's demeanor was one of calm authority, her voice smooth as silk, but inside, she was a tempest of anxiety. The whispers of her own mental health struggles echoed in her mind, a reminder that she, too, was in need of help. As she navigated the investigation, she felt the walls closing in, the pressure mounting with every question Eleanor posed. Could her own secrets remain hidden while she played the role of the supportive professional?",
      "As the investigation unfolded, Mallory found herself entangled in a web of denial. She often employed clinical language, speaking with the precision of a therapist, but when pressed, her words would soften into casual banter, a defense mechanism to mask her discomfort. Yet, beneath the surface, she was acutely aware of the stakes. If Eleanor's article gained traction, it could expose not only Mallory's vulnerabilities but also the dark underbelly of her self-prescribing habits.",
      "Confronted with the truth of her situation, Mallory's internal conflict grew ever more pronounced. She feared that, should the investigation turn its gaze upon her, she would be forced to confront the very demons she had spent years burying. The case was not just a matter of murder; it was a reckoning with her own identity, a chance to either rise above her fears or succumb to the weight of her secrets. As the investigation deepened, she wondered if she could face her own truth before it was too late."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired naval officer with a storied past, Captain Ivor Hale's dignified exterior masks a desperate struggle with financial ruin, making him a compelling suspect in the murder investigation.",
    "publicPersona": "Ivor is a war hero, revered in the community for his stoicism and bravery, but beneath the surface lies a man grappling with the consequences of his past decisions.",
    "privateSecret": "Ivor's financial troubles are a closely guarded secret; he has resorted to selling off family heirlooms to maintain his reputation and lifestyle.",
    "motiveSeed": "He believes the victim discovered his financial woes and intended to expose him, leaving him with no choice but to silence her.",
    "motiveStrength": "compelling",
    "alibiWindow": "Ivor claims to have been walking on the beach during the murder, but no one can confirm his whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "His reputation and financial stability are on the line, and exposure could lead to his downfall.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a gravelly resonance, his words measured and deliberate. He often employs nautical metaphors, a remnant of his military background, and has a tendency to speak in short, clipped sentences.",
    "signatureTic": "A ship's fate is determined by its captain.",
    "internalConflict": "Ivor's pride battles with his financial reality, leaving him torn between maintaining his dignity and seeking the help he desperately needs.",
    "personalStakeInCase": "This murder investigation is a direct threat to Ivor's carefully constructed world; if his financial struggles are exposed, he risks losing everything he has fought to protect.",
    "paragraphs": [
      "Captain Ivor Hale stood as a monument of dignity, his presence a reminder of valor in a world that had seen too much chaos. His reputation as a war hero was well-earned, yet beneath the polished surface lay a man teetering on the edge of financial ruin. The grand seaside hotel, adorned with Art Deco elegance, felt like a gilded cage, one that threatened to collapse around him should the truth of his struggles emerge. 'A ship's fate is determined by its captain,' he often mused, but he could no longer steer his own vessel with the same confidence.",
      "The murder of Sylvia Trent sent ripples through the community, and Ivor felt the weight of suspicion pressing down upon him. He believed she had discovered his secrets, the financial troubles that had forced him to sell off family heirlooms to maintain his lifestyle. The thought of exposure was a bitter pill to swallow, and as he claimed to have been walking along the beach during the time of the murder, he felt the tide of guilt rising within him. Could he really trust his own alibi?",
      "With each passing day, Ivor found himself drawn deeper into the investigation, a reluctant participant in a game of shadows. His speech was often laced with dry wit, a defense mechanism that disguised the fear lurking in his chest. He spoke in clipped sentences, carefully choosing his words as if navigating treacherous waters. Yet, the nautical metaphors that once inspired confidence now felt like anchors dragging him down. Could he hold fast to his dignity while the storm of suspicion swirled around him?",
      "As the investigation unfolded, Ivor's internal conflict became more pronounced. He was caught in a battle between pride and desperation, torn between the need to maintain his reputation and the reality of his financial situation. The stakes were higher than he had ever imagined; if his past was laid bare, he would not only lose his standing in the community but also the respect he had fought so hard to earn. In the face of this turmoil, Ivor realized that he must confront his fears and consider accepting help, for the truth would eventually surface like a shipwreck washed ashore."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A charming socialite with aspirations of stardom, Beatrice Quill's facade of wealth hides a dangerous secret that could destroy her carefully curated image.",
    "publicPersona": "Beatrice is the life of the party, flitting from one social event to another, her vivacity drawing attention and admiration from the community.",
    "privateSecret": "In truth, Beatrice is faking her wealth and status, risking exposure that could shatter her dreams of becoming a recognized actress.",
    "motiveSeed": "She fears that the victim was about to reveal her financial deception, which could lead to her downfall.",
    "motiveStrength": "strong",
    "alibiWindow": "She claims to have been networking at a nearby event, but the truth is more elusive.",
    "accessPlausibility": "easy",
    "stakes": "If her financial deception is revealed, all her aspirations of fame and social standing would come crashing down.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks in a bubbly, animated manner, often punctuating her sentences with exaggerated expressions. She has a penchant for dramatic flair and frequently employs theatrical language.",
    "signatureTic": "Life is but a stage, darling.",
    "internalConflict": "Beatrice's fear of exposure creates a constant state of anxiety, as she struggles between her desire for fame and the reality of her deception.",
    "personalStakeInCase": "This murder investigation threatens to unravel Beatrice's carefully constructed world; her reputation hangs by a thread, and the truth could lead to her downfall.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of charm, a socialite who flitted through the grand halls of the seaside hotel like a butterfly in a garden. Her laughter rang out, bright and infectious, as she mingled with the elite, but behind her vivacious exterior lay a precarious secret. 'Life is but a stage, darling,' she would often declare, but for Beatrice, the performance was becoming increasingly difficult to maintain. She was not the wealthy heiress she pretended to be; rather, she was a woman teetering on the edge of financial ruin.",
      "The murder of Sylvia Trent sent shockwaves through the social scene, and Beatrice felt the weight of suspicion pressing down upon her. She feared that the victim had discovered her deception and intended to expose her, a threat that could shatter her dreams of stardom. As she claimed to have been networking at a nearby event during the murder, Beatrice found herself caught in a web of lies, her anxiety bubbling just beneath the surface. Could she keep her facade intact, or would the truth come crashing down around her?",
      "With each passing hour, Beatrice's internal conflict deepened. She had always craved the spotlight, but now it felt more like a spotlight of scrutiny, illuminating her every flaw. Her speech was animated, punctuated by dramatic flair, yet behind the theatrics was a woman grappling with fear. She often employed sardonic humor to deflect attention, using quips that masked her true feelings. Yet, the stakes were too high; if her financial deception were revealed, all her aspirations would evaporate like smoke in the wind.",
      "As the investigation unfolded, Beatrice realized that she was not just fighting for her reputation; she was battling the very identity she had constructed. The murder investigation had become a crucible, one that forced her to confront the truth of her life. In the depths of her soul, Beatrice longed for authenticity over the superficial connections she had cultivated. Perhaps, in the chaos of this tragedy, she would discover that true fame lay not in the facade she had built, but in embracing the woman she truly was."
    ],
    "order": 4
  },
  {
    "name": "Hugo Vane",
    "summary": "A wealthy businessman with a commanding presence, Hugo Vane's success is built on a foundation of shady dealings, making him a prime suspect in the murder investigation.",
    "publicPersona": "Hugo is known for his philanthropy and business acumen, projecting an image of dominance and control in every interaction.",
    "privateSecret": "Hugo's empire is built on a series of shady business deals that, if exposed, could lead to his ruin and imprisonment.",
    "motiveSeed": "He believes the victim threatened to expose his illegal activities, forcing him to consider drastic measures.",
    "motiveStrength": "compelling",
    "alibiWindow": "Hugo claims to have been in a private meeting with other guests, but no one can confirm his whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "The truth about his illegal dealings could unravel his empire, leading to both financial and legal consequences.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Hugo's speech is direct and assertive, often cutting to the chase with little regard for niceties. He speaks in a commanding tone, rarely indulging in pleasantries.",
    "signatureTic": "Let's not beat around the bush.",
    "internalConflict": "Hugo grapples with the fear of losing everything he has built, torn between his ambition and the consequences of his actions.",
    "personalStakeInCase": "The murder investigation is a direct threat to Hugo's empire; if the truth comes to light, he risks everything he has worked for.",
    "paragraphs": [
      "Hugo Vane strode through the grand halls of the seaside hotel with an air of authority, his presence demanding attention. A wealthy businessman with a penchant for philanthropy, he had crafted an image of dominance that concealed the rot beneath. Yet, as news of Sylvia Trent's murder spread, Hugo felt the ground shift beneath his feet. 'Let's not beat around the bush,' he often declared in meetings, but the truth was that his empire was built on shaky ground, and the murder threatened to expose the cracks.",
      "The victim had been a loose thread in his carefully woven tapestry of deceit, and Hugo believed she was poised to unravel it all. He claimed to have been in a private meeting during the time of the murder, but as the investigation progressed, he found it increasingly difficult to maintain his composure. The stakes were higher than he had anticipated; exposure of his illegal dealings could lead to both financial ruin and imprisonment. Each inquiry felt like a noose tightening around his neck.",
      "Hugo's speech was blunt, his words cutting through the air with a commanding authority that left little room for doubt. He spoke directly, rarely indulging in pleasantries, as if to assert his control over the narrative. Yet, beneath that confident exterior lay a man grappling with fear. The fear of losing everything he had built, of being brought low by the very secrets he had fought to protect. The investigation was not just a matter of murder; it was a test of his ambition and the consequences of his actions.",
      "As the investigation unfolded, Hugo was forced to confront the reality of his situation. He could no longer ignore the specter of his past, the shady dealings that had allowed him to rise to prominence. The murder investigation had become a reckoning, one that could either lead to his downfall or force him to confront the truth of his life. In that moment of crisis, Hugo realized that the stakes were not just about survival; they were about redemption, and perhaps, a chance to rebuild from the ashes of his ambition."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Cliffside Grand Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel perched atop a cliff, steeped in Art Deco elegance and mystery.",
    "visualDescription": "The hotel features sleek lines and bold geometric patterns, with large windows framing breathtaking ocean views. The lobby boasts polished marble floors and a shimmering chandelier, while the dining hall overlooks the tumultuous sea, creating a dramatic backdrop.",
    "atmosphere": "A blend of elegance and tension, where beauty conceals secrets.",
    "paragraphs": [
      "The Cliffside Grand Hotel stands resolute against the relentless waves of the English Channel, its Art Deco façade gleaming through the thick coastal fog. Guests arrive with the scent of salt and rain mingling in the air, quickly enveloped by the hotel's opulence. Inside, the polished marble floors reflect the soft glow of crystal chandeliers, casting intricate shadows that dance along the walls. The atmosphere is charged, thick with whispered conversations and furtive glances, as if the very walls hold their breath, waiting for the inevitable revelation of hidden truths.",
      "In the expansive dining hall, the rhythmic crash of waves provides a haunting soundtrack, the ocean's roar echoing through the tall windows. Guests sit at elegantly set tables, their plates adorned with culinary delights, yet the food remains untouched for many, as tension permeates the air. Outside, the manicured gardens seem to beckon with their vibrant blooms, but the jagged cliffs serve as a reminder of the isolation and danger that lurk just beyond the hotel's walls. It is a place where the glamour of the 1940s meets the chilling undercurrents of human intrigue.",
      "As night falls, the fog thickens, wrapping the hotel in a veil of mystery. The flickering gas lamps along the corridors cast an eerie glow, illuminating the narrow passageways where shadows seem to stretch and morph. The sound of footsteps echoes softly, punctuated by the distant murmur of the sea. The guests, each with their own secrets, are drawn into a web of suspicion, where trust is a luxury few can afford. In this grand hotel, the line between safety and peril blurs, and the echoes of identity linger in the air like the mist that clings to the cliffs."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Foggy and cool, with occasional rain showers typical of coastal climates",
    "timeFlow": "Days of mounting tension leading to a climactic revelation",
    "mood": "Tense and suspenseful, with an undercurrent of secrecy among the guests",
    "eraMarkers": [
      "Art Deco design elements",
      "Manual typewriters in the lobby",
      "Radio broadcasts from the lounge",
      "Post-war automobile parked outside"
    ],
    "sensoryPalette": {
      "dominant": "Briny sea air mixed with floral notes",
      "secondary": [
        "Warmth of candlelight",
        "Chilling breeze from the ocean"
      ]
    },
    "paragraphs": [
      "The atmosphere at The Cliffside Grand Hotel is a rich tapestry of sound, scent, and sight. The briny sea air carries hints of blooming jasmine from the gardens, while the soft glow of candlelight casts flickering shadows across the elegantly decorated rooms. As guests navigate the narrow corridors, the distant crash of waves is a constant reminder of their isolation, creating an ever-present tension that hangs in the air like the fog outside.",
      "As time progresses, the mood shifts with the weather, mirroring the unease felt by the guests. Each moment spent within the hotel's walls is fraught with anticipation, as they become increasingly aware that secrets lurk beneath the surface of their seemingly perfect getaway. The echoes of whispered conversations and the sporadic sounds of laughter create a dissonance that heightens the suspense, making every corner of the hotel feel like a potential stage for revelation."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "High ceilings adorned with intricate plasterwork, polished marble floors, and a grand chandelier.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "gold-accented Art Deco motifs",
          "vibrant floral arrangements",
          "shadows cast by chandeliers"
        ],
        "sounds": [
          "soft piano music",
          "murmurs of conversation",
          "footsteps on polished floors",
          "the rustle of silk dresses"
        ],
        "smells": [
          "freshly polished wood",
          "jasmine and salt air",
          "coffee and pastries from the café",
          "scent of old leather-bound books"
        ],
        "tactile": [
          "smooth marble underfoot",
          "cool metal railing",
          "soft upholstery of armchairs",
          "gentle breeze from the open doors"
        ]
      },
      "accessControl": "Open to all guests; staff-only areas behind reception.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through rain",
            "droplets on window panes"
          ],
          "sounds": [
            "steady rain tapping on glass",
            "soft voices rising above the din"
          ],
          "smells": [
            "damp earth",
            "freshly brewed coffee",
            "wet stone"
          ],
          "mood": "melancholic reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light through thick clouds",
            "flickering candle flames"
          ],
          "sounds": [
            "soft whispers",
            "the ticking of a wall clock"
          ],
          "smells": [
            "dusty books",
            "old leather",
            "scent of rain"
          ],
          "mood": "oppressive quiet"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light from chandeliers",
            "reflections on polished floors"
          ],
          "sounds": [
            "laughter from the dining hall",
            "clinking of glasses"
          ],
          "smells": [
            "candle wax",
            "freshly baked bread",
            "tobacco from the cigar lounge"
          ],
          "mood": "festive anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby, a breathtaking entrance to The Cliffside Grand Hotel, welcomes guests with its high ceilings and intricate plasterwork. Polished marble floors reflect the soft glow of the chandelier, creating an atmosphere of elegance and sophistication. As guests gather, the air is filled with the scent of jasmine and salt, a reminder of the ocean just outside. The lobby serves as a hub of activity, where whispers of intrigue blend with the soft strains of a piano, setting the stage for the unfolding mystery.",
        "Amidst the grandeur, the lobby also conceals secrets. The narrow corridors branching off from the main space lead to staff-only areas, where the true workings of the hotel remain hidden from guests. As conversations ebb and flow, the tension in the air is palpable, suggesting that beneath the surface of luxury lies a tangled web of identities and motives."
      ]
    },
    {
      "id": "dining_hall",
      "name": "Ocean View Dining Hall",
      "type": "interior",
      "purpose": "Dining space for guests with ocean views",
      "visualDetails": "Floor-to-ceiling windows framing the crashing waves, elegant tables set with fine china.",
      "sensoryDetails": {
        "sights": [
          "breathtaking ocean views",
          "crystal chandeliers glimmering",
          "elegantly arranged tables",
          "waves crashing against cliffs"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft laughter",
          "the crash of waves",
          "muffled conversations"
        ],
        "smells": [
          "roasted meats and rich sauces",
          "freshly baked bread",
          "aromatic herbs",
          "sea salt in the air"
        ],
        "tactile": [
          "smooth table linens",
          "cool glassware",
          "warmth from nearby heaters",
          "soft leather seating"
        ]
      },
      "accessControl": "Open during meal hours; reservations required for prime seating.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey skies over choppy waters",
            "rain-soaked tables outside"
          ],
          "sounds": [
            "distant thunder",
            "the rush of rain on the roof"
          ],
          "smells": [
            "earthy rain",
            "strong coffee",
            "scent of wet seaweed"
          ],
          "mood": "introspective solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light dulling colors",
            "clouds hanging low over the sea"
          ],
          "sounds": [
            "the soft lapping of waves",
            "quiet conversations"
          ],
          "smells": [
            "faint scent of smoke",
            "cooked fish",
            "fresh herbs"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "twinkling lights from the hotel"
          ],
          "sounds": [
            "cheers from diners",
            "the gentle clinking of glasses"
          ],
          "smells": [
            "grilled seafood",
            "sweet desserts",
            "freshly cracked pepper"
          ],
          "mood": "celebratory warmth"
        }
      ],
      "paragraphs": [
        "The Ocean View Dining Hall offers guests an unparalleled experience, with its floor-to-ceiling windows framing the tumultuous sea. The tables, elegantly set with fine china and crystal glassware, invite diners to indulge in culinary delights while watching the waves crash against the cliffs. The air is rich with the aroma of roasted meats and herbs, mingling with the salty tang of the ocean, creating a sensory feast that complements the visual splendor.",
        "As conversations flow and laughter fills the air, the dining hall becomes a microcosm of the hotel's intrigue. Guests exchange glances, their expressions revealing hidden agendas. The sound of cutlery clinking against plates creates a rhythmic backdrop, punctuated by the occasional burst of laughter, while the ocean's roar serves as an omnipresent reminder of the isolation that surrounds them. Here, amidst the elegance, the tension simmers just below the surface."
      ]
    },
    {
      "id": "guest_room",
      "name": "Oceanfront Guest Room",
      "type": "interior",
      "purpose": "Private accommodation for guests",
      "visualDetails": "Tastefully decorated with Art Deco furnishings, a balcony overlooking the sea.",
      "sensoryDetails": {
        "sights": [
          "stylish Art Deco furniture",
          "soft pastel colors",
          "ocean waves crashing below",
          "sunlight filtering through curtains"
        ],
        "sounds": [
          "gentle lapping of waves",
          "distant seagulls",
          "the rustle of curtains in the breeze",
          "soft ticking of a clock"
        ],
        "smells": [
          "fresh linens",
          "scent of ocean air",
          "subtle perfume lingering",
          "hint of polished wood"
        ],
        "tactile": [
          "smooth satin sheets",
          "cool glass of the balcony railing",
          "soft carpet underfoot",
          "warmth from the sun streaming in"
        ]
      },
      "accessControl": "Access limited to registered guests; staff entry only for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops racing down glass",
            "grey clouds obscuring the sun"
          ],
          "sounds": [
            "steady rain on the roof",
            "distant thunder rumbling"
          ],
          "smells": [
            "damp air",
            "freshly brewed coffee from the hallway",
            "wet sand"
          ],
          "mood": "reflective solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light through thick clouds",
            "shadows creeping across the room"
          ],
          "sounds": [
            "the soft hum of the air conditioning",
            "the flutter of pages in a book"
          ],
          "smells": [
            "old books",
            "scent of rain-soaked earth",
            "hint of lavender"
          ],
          "mood": "melancholic introspection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset painting the sky",
            "twinkling stars emerging"
          ],
          "sounds": [
            "soft music from the lobby",
            "the distant laughter of guests"
          ],
          "smells": [
            "scent of night-blooming flowers",
            "freshly polished furniture",
            "faint traces of perfume"
          ],
          "mood": "romantic anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanfront Guest Room offers a serene retreat, tastefully adorned with Art Deco furnishings that reflect the hotel's grandeur. A private balcony overlooks the crashing waves, inviting guests to breathe in the invigorating ocean air. Inside, soft pastel colors create a calming ambiance, while the gentle sound of waves lapping against the cliffs forms a soothing backdrop, making it an ideal sanctuary for contemplation or intrigue.",
        "As evening descends, the room transforms into a romantic haven. The golden light of the setting sun spills through the curtains, casting a warm glow over the space. The scent of night-blooming flowers wafts in through the open balcony door, mingling with the fresh scent of the sea. Here, in this intimate setting, guests may find themselves drawn into the mysteries that unfold within the hotel's walls, their secrets whispered softly against the rhythm of the ocean."
      ]
    },
    {
      "id": "rooftop",
      "name": "Rooftop Terrace",
      "type": "exterior",
      "purpose": "Observation point and outdoor space for guests",
      "visualDetails": "Open terrace with panoramic views of the ocean and cliffs, adorned with wrought iron railings.",
      "sensoryDetails": {
        "sights": [
          "panoramic views of crashing waves",
          "stars twinkling overhead",
          "moonlight reflecting on the water",
          "silhouettes of guests against the horizon"
        ],
        "sounds": [
          "wind rustling through trees",
          "distant laughter",
          "the roar of waves crashing",
          "soft music from below"
        ],
        "smells": [
          "salt air mixed with night-blooming jasmine",
          "freshly cut grass",
          "hint of smoke from a distant fire",
          "cool evening breeze"
        ],
        "tactile": [
          "cool metal railings",
          "smooth stone underfoot",
          "gentle breeze against skin",
          "soft fabric of evening wraps"
        ]
      },
      "accessControl": "Restricted access; open only during specific hours and weather permitting.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds hanging low",
            "rain-soaked terrace"
          ],
          "sounds": [
            "soft patter of rain",
            "the distant crash of waves"
          ],
          "smells": [
            "fresh rain",
            "wet stone",
            "scent of damp earth"
          ],
          "mood": "isolated contemplation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light over the sea",
            "shadows creeping across the terrace"
          ],
          "sounds": [
            "soft murmurs of guests",
            "the rustle of leaves"
          ],
          "smells": [
            "cool air",
            "damp wood",
            "hint of rain"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting vibrant colors",
            "stars beginning to twinkle"
          ],
          "sounds": [
            "laughter from guests below",
            "soft music drifting up"
          ],
          "smells": [
            "salt air mingling with jasmine",
            "freshly cut grass",
            "the scent of distant bonfires"
          ],
          "mood": "romantic allure"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace offers an exquisite vantage point, where guests can gaze out over the tumultuous sea and the jagged cliffs below. Adorned with wrought iron railings, the terrace is a blend of elegance and natural beauty, providing a perfect setting for quiet reflection or whispered conversations. As night falls, the stars twinkle overhead, casting a magical glow that contrasts with the rhythmic sound of waves crashing below.",
        "However, access to the terrace is tightly controlled, allowing only a select few to enjoy its beauty during specific hours. The cool evening breeze carries the scent of salt and night-blooming jasmine, creating an atmosphere of romantic allure. Here, amid the whispers of the night, secrets may be shared, and identities revealed, all under the watchful gaze of the moonlit sea."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023047183499999998,
  "durationMs": 31844
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1943,
    "month": "January",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "foggy and cool",
      "occasional rain showers",
      "overcast skies"
    ],
    "daylight": "Short daylight hours, with the sun peeking through the clouds around 4 PM, leading to early darkness.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when the hotel is quiet and guests are settled in.",
    "holidays": [
      "New Year's Day (January 1)"
    ],
    "seasonalActivities": [
      "Indoor games by the fireplace",
      "Reading in cozy corners with hot beverages",
      "Socializing in the hotel lounge over card games"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suit",
        "crisp white dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "tweed jacket",
        "corduroy trousers",
        "knit sweater"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket square"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length wool dress",
        "matching coat with fur collar",
        "nylon stockings"
      ],
      "casual": [
        "knit cardigan",
        "pleated skirt",
        "blouse with puff sleeves"
      ],
      "accessories": [
        "cloche hat",
        "string of pearls",
        "wool gloves"
      ]
    },
    "trendsOfTheMoment": [
      "Military-inspired fashion",
      "Muted color palettes",
      "Use of synthetic fibers like rayon"
    ],
    "socialExpectations": [
      "Men are expected to be the primary earners",
      "Women are increasingly taking on roles in the workforce",
      "Politeness and decorum are highly valued in social settings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Battle of Stalingrad reaches a critical turning point",
      "Allied forces plan for increased military operations in Europe",
      "Rationing of food and materials continues to affect daily life"
    ],
    "politicalClimate": "Tensions remain high as the war rages on, with growing public support for the Allies but also increasing fatigue from wartime restrictions.",
    "economicConditions": "The economy is strained due to war demands, with widespread rationing of goods and services affecting all classes.",
    "socialIssues": [
      "Increased support for mental health initiatives for returning soldiers",
      "Debates over women's rights in the workplace",
      "Struggles with racial segregation and civil rights movements beginning to stir"
    ],
    "internationalNews": [
      "Reports on the war efforts in North Africa",
      "Speculation about the next steps in the Pacific Theater",
      "News of espionage and sabotage in occupied territories"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's orchestra",
        "Frank Sinatra's ballads",
        "Big band music"
      ],
      "films": [
        "Casablanca",
        "The Song of Bernadette",
        "For Whom the Bell Tolls"
      ],
      "theater": [
        "Oklahoma! (opened in 1943)",
        "The Glass Menagerie",
        "Various vaudeville acts"
      ],
      "radio": [
        "The Shadow",
        "Suspense",
        "Fibber McGee and Molly"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Stranger by Albert Camus",
        "The Glass Bead Game by Hermann Hesse",
        "The Little Prince by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "Detective fiction",
        "War literature",
        "Social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "Radar technology advances",
        "Improvements in military communications",
        "Development of early computer technology"
      ],
      "commonDevices": [
        "Radio sets in most households",
        "Manual typewriters in offices",
        "Film cameras"
      ],
      "emergingTrends": [
        "Increased use of synthetic materials in clothing",
        "Expansion of the automotive industry despite wartime restrictions"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Coal scuttle refill: one shilling sixpence",
        "Taxi across town: two shillings"
      ],
      "commonActivities": [
        "Visiting the local cinema for newsreels and films",
        "Participating in community war efforts",
        "Hosting tea parties and card games"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "Weekly bridge nights among friends",
        "Frequent visits to local pubs for socialization"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Growing class consciousness due to wartime sacrifices",
      "Increased solidarity among working-class communities"
    ],
    "gender": [
      "Women are entering the workforce in unprecedented numbers",
      "Traditional gender roles are being questioned"
    ],
    "race": [
      "Racial segregation remains prevalent",
      "Emerging conversations about civil rights and equality"
    ],
    "generalNorms": [
      "Politeness and etiquette are prized",
      "Community involvement is encouraged, especially in wartime efforts"
    ]
  },
  "atmosphericDetails": [
    "The damp air carries the scent of rain-soaked earth, mingling with the aroma of smoke from the hotel fireplace.",
    "Soft whispers echo through the hotel's dimly lit corridors, punctuated by the distant sound of jazz music emanating from the lounge.",
    "A thick fog blankets the coastal streets, creating an eerie silence that heightens the tension among the guests, each harboring their own secrets."
  ],
  "paragraphs": [
    "In January 1943, the atmosphere in the coastal hotel is thick with fog and secrecy. The overcast skies cast a muted light, making the days feel shorter and the nights longer. Rain showers intermittently drench the streets, forcing guests to linger indoors, creating a unique blend of anticipation and tension. With New Year’s celebrations now a distant memory, patrons find solace in the warmth of the hotel’s lounge, where the flickering flames of the fireplace provide a stark contrast to the cool, damp air outside.",
    "The fashion of the time reflects the wartime context, with men favoring double-breasted wool suits paired with silk ties, while women don elegant tea-length dresses made of muted colors, often complemented by a chic cloche hat. Practicality reigns, as both genders opt for woolen fabrics to ward off the winter chill. The sophistication of attire is juxtaposed against the somber mood of the guests, in which each carefully chosen accessory seems to tell a story of its own amidst the backdrop of the ongoing war.",
    "Daily life continues to navigate the complexities of wartime reality, with citizens adapting to rationing and economic strain. A loaf of bread costs four pence, and individuals are often seen gathering around radios to listen to the latest updates on the war. Social outings, such as tea parties and card games, offer a distraction from the grim news, while community involvement in war efforts fosters a sense of solidarity among the hotel guests. The social fabric is woven with the threads of uncertainty, yet there remains a resilient spirit that persists in the face of adversity."
  ],
  "note": "",
  "cost": 0.0010451463,
  "durationMs": 17622
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A foggy seaside hotel hosts a gathering of guests entangled in post-war anxieties, where the pressures of economic adjustment and social stigma create an atmosphere ripe for deception and intrigue.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The shift of women into the workforce and the lingering effects of wartime trauma create a complex social dynamic, where class tensions and mental health stigma influence relationships and interactions."
  },
  "setting": {
    "location": "A grand seaside hotel with Art Deco influences",
    "institution": "hotel",
    "weather": "Foggy and cool, with occasional rain showers"
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
    "id": "recording_time",
    "value": "ten minutes past eleven",
    "description": "The gramophone recording was played at this specific time."
  },
  {
    "id": "actual_time_of_death",
    "value": "a quarter to twelve",
    "description": "The victim actually died at this exact moment."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 18,
  "countsByPlacement": {
    "early": 5,
    "mid": 12,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 17,
    "optional": 1
  },
  "redHerringCount": 0,
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
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "spatial"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "category": "physical"
    },
    {
      "id": "clue_9",
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
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "early",
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
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
