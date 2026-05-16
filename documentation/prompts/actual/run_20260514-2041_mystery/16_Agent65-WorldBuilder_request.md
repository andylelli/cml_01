# Actual Prompt Record

- Run ID: `mystery-1778791276260`
- Project ID: ``
- Timestamp: `2026-05-14T20:44:43.649Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `351a296adb29cd25`

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
      "place": "Manor House",
      "country": "England",
      "institution": "Country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical sabotage"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Intelligent and observant",
      "private_secret": "Haunted by a past failure in solving a case",
      "motive_seed": "Desire to clear family name",
      "motive_strength": "strong",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Household access",
        "Public areas"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Not easily swayed"
      ],
      "stakes": "Family reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "suspect",
      "relationships": [
        "Family physician"
      ],
      "public_persona": "Respected doctor",
      "private_secret": "Financial desperation due to the Great Depression",
      "motive_seed": "Financial gain",
      "motive_strength": "moderate",
      "alibi_window": "Between 10 AM and 11 AM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical supplies",
        "Household access"
      ],
      "behavioral_tells": [
        "Nervous when questioned",
        "Avoids eye contact"
      ],
      "stakes": "Financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "suspect",
      "relationships": [
        "Family friend",
        "War veteran"
      ],
      "public_persona": "Charming and charismatic",
      "private_secret": "Secret admirer of Lady Voss",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "Between 10 AM and 11 AM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Household access",
        "Social gatherings"
      ],
      "behavioral_tells": [
        "Overly charming",
        "Grows defensive when pressed"
      ],
      "stakes": "Love and acceptance",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "suspect",
      "relationships": [
        "Lady Voss's maid"
      ],
      "public_persona": "Shy and reserved",
      "private_secret": "In love with Captain Hale",
      "motive_seed": "Protecting a secret",
      "motive_strength": "strong",
      "alibi_window": "Between 10 AM and 11 AM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Household access",
        "Private quarters"
      ],
      "behavioral_tells": [
        "Fidgets when nervous",
        "Easily misled"
      ],
      "stakes": "Loyalty to love",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
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
      "summary": "During a family reunion at the Voss estate, Lord Archibald Voss is found dead in his study, with a mechanical clock that has been tampered with, creating a false timeline for his murder."
    },
    "accepted_facts": [
      "Lord Archibald Voss was found dead at approximately 11:10 AM.",
      "The clock in the study was found to have stopped at ten minutes past eleven.",
      "Witnesses heard a loud crash around 10:50 AM."
    ],
    "inferred_conclusions": [
      "The murder must have occurred before the clock was set back.",
      "The murderer had to be in the study shortly before 11 AM."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, study, and stopp to expose the false timing.",
      "delivery_path": [
        {
          "step": "The murderer tampered with the clock, adjusting it back by forty minutes."
        }
      ]
    },
    "outcome": {
      "result": "The clock's tampering obscured the true time of death."
    }
  },
  "false_assumption": {
    "statement": "The murder must have occurred after the witnesses heard the crash.",
    "type": "temporal",
    "why_it_seems_reasonable": "The timing of the crash suggested a more recent event.",
    "what_it_hides": "The real time of death was earlier, masked by the clock's tampering."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "10:50 AM crash",
        "11:10 AM discovery"
      ],
      "windows": [
        "10:00 AM to 11:10 AM"
      ],
      "contradictions": [
        "Witnesses claim the clock stopped at ten minutes past eleven, but it was tampered."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "Mechanical clock",
        "Study",
        "Murder weapon"
      ],
      "permissions": [
        "All guests had access to the study."
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be reset by physical manipulation."
      ],
      "traces": [
        "Faint scratch on the clock's winding key."
      ]
    },
    "social": {
      "trust_channels": [
        "Family connections",
        "Friendship ties"
      ],
      "authority_sources": [
        "Family hierarchy",
        "Medical authority of Dr. Finch"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study has stopped at ten minutes past eleven.",
        "correction": "The clock's time suggests that the murder occurred after it was tampered with.",
        "effect": "Narrows the murder timeline to before the clock was reset.",
        "required_evidence": [
          "The clock's hands stopped at ten minutes past eleven.",
          "Witnesses heard a crash around 10:50 AM."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall seeing Lord Voss shortly before the crash.",
        "correction": "If the clock was tampered with, the real timeline conflicts with the witness account.",
        "effect": "Eliminates the idea that Voss was alive after 10:50 AM.",
        "required_evidence": [
          "Witnesses heard a loud crash around 10:50 AM.",
          "Witnesses saw Lord Voss alive shortly before 10:50 AM."
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint scratch is found on the clock's winding key.",
        "correction": "The scratch indicates recent tampering, suggesting premeditated action.",
        "effect": "Narrows the suspect list to those with access to the study.",
        "required_evidence": [
          "Faint scratch on the clock's winding key.",
          "The clock was accessed within the time window."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled reenactment of the clock's tampering shows that only Captain Hale had the opportunity and time to reset the clock before the murder.",
    "knowledge_revealed": "The clock's tampering aligns with Captain Hale's access and timeline.",
    "pass_condition": "If Hale is unable to provide a reasonable explanation for the clock's tampering.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_culprit_direct_captain_ivor_hale",
      "clue_5"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's stopped time (early) and witness accounts (mid) let the reader establish a false timeline. Step 2: The scratch on the clock's key (mid) leads to the conclusion of tampering. Step 3: The reenactment of the clock's tampering (discriminating test) reveals Hale's opportunity and motive."
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
      "test_type": ""
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His alibi is verified through hospital records.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her whereabouts are confirmed by other staff members.",
        "supporting_clues": [
          "clue_id_3"
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Physical evidence"
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
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
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
    "summary": "Eleanor Voss is a retired schoolteacher with a reputation for wisdom and a penchant for local history, but she carries a secret that could shatter her esteemed standing in Little Middleton.",
    "publicPersona": "Eleanor presents herself as a respected elder, often found in the local library, sharing her knowledge with the youth and organizing community events. Her passion for education and history endears her to many, making her a trusted figure in town.",
    "privateSecret": "Beneath her polished exterior lies a scandalous past affair with a prominent local figure, a truth she has buried deep within, fearing it may tarnish her reputation should it ever resurface.",
    "motiveSeed": "Eleanor possesses knowledge about the victim that could potentially expose her past, and she is desperate to protect her reputation from the repercussions of those secrets.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claims to have been in the library at the time of the incident, but without witnesses to corroborate her story, her alibi remains unverified.",
    "accessPlausibility": "Eleanor has easy access to various locations in town, particularly the library, where she often finds solace amongst the stacks of books.",
    "stakes": "Her primary concern is the preservation of her social standing and the fear that her past will come to light, disrupting the tranquil life she has built.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often employing literary references that reflect her background in education. She has a tendency to pause thoughtfully before responding, as if weighing the implications of her words.",
    "internalConflict": "Eleanor grapples with the fear that her past will be unearthed, leading to a crisis of identity as she questions whether she can remain the respected elder she has become while hiding such a significant part of herself.",
    "personalStakeInCase": "This case matters deeply to Eleanor as it is not just about solving a murder; it is about protecting her own legacy and the fragile facade she has constructed over the years.",
    "paragraphs": [
      "Eleanor Voss moved through the library like a ghost of a bygone era, her fingers trailing over the spines of dusty tomes as if they held the key to her salvation. She had dedicated her life to shaping young minds, yet the specter of her own past loomed large, threatening to unravel the carefully woven tapestry of her reputation. To the townsfolk of Little Middleton, she was a beacon of knowledge and integrity, but beneath this polished exterior lay a secret that could ignite scandal like a match to dry tinder.",
      "Her heart raced at the thought of the victim, a person whose very existence threatened to expose the affair she had buried long ago. Eleanor's mind raced with the implications of what it would mean if her past were to emerge, and she shuddered at the thought of the whispers that would follow. She was not merely an investigator in this case; she was a woman on the precipice of ruin, motivated by the desire to keep her past hidden while seeking justice for the victim that lay cold in the ground.",
      "In her quest for answers, Eleanor found herself confronting not only the mysteries of the murder but the tangled web of her own emotions. With each clue she uncovered, she felt the weight of her secret pressing down on her, a constant reminder of the choices she had made. The library, once a sanctuary, became a battleground where her past and present collided, forcing her to question the very foundation of her identity.",
      "As she navigated the treacherous waters of suspicion and intrigue, Eleanor realized that to find the truth, she must first confront the shadows of her own history. The stakes had never been higher, and in the pursuit of justice, she discovered that the path to redemption often leads through the darkest corners of one's soul."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a dedicated physician battling personal demons, caught between his commitment to his patients and the fear of his past catching up with him.",
    "publicPersona": "With a reputation as a compassionate doctor, Mallory is seen as a pillar of the community, tirelessly working to improve the health and well-being of those around him. His gentle demeanor and empathetic nature have earned him the trust of many.",
    "privateSecret": "However, beneath this facade lies a struggle with alcoholism, a vice that threatens to undermine his career and the respect he has built over the years. Recently, he had been treating the victim for undisclosed ailments, adding to his burden.",
    "motiveSeed": "Mallory feared that the victim, aware of his struggles, would expose him and ruin his career, leaving him in a vulnerable position as a public figure.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claims to have been tending to patients in the gardens during the time of the murder, yet his inability to confirm this with anyone casts doubt on his alibi.",
    "accessPlausibility": "As a physician, Mallory has access to various locations within the community, but his personal struggles create barriers to his effectiveness.",
    "stakes": "For Mallory, the stakes are high; he must protect his career and reputation, which are precariously balanced on the edge of exposure and scandal.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks in a soft, measured tone, often punctuating his sentences with self-deprecating remarks that hint at his inner turmoil. He has a tendency to fidget with his hands when anxious, a physical manifestation of his struggles.",
    "internalConflict": "Dr. Finch is torn between his professional duties and the fear that his personal demons will be revealed, creating a tension that leaves him questioning his worth and ability to serve his community.",
    "personalStakeInCase": "This crime strikes a personal chord for Mallory, as he must navigate the investigation while battling the fear that his secrets may be exposed, jeopardizing both his career and the lives of those he cares for.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the garden, the scent of blooming flowers mingling with the bitter taste of his own regrets. As a physician, he had always prided himself on being a healer, but today, he felt more like a patient in need of rescue. The weight of the victim's death pressed heavily on him, a reminder of the thin line he walked between his vocation and the darkness that threatened to engulf him. Each whisper of the wind felt like a reminder of his hidden struggles, a cruel reminder that his reputation was but a fragile facade.",
      "The community viewed him as a compassionate figure, a man dedicated to their well-being, but beneath that exterior lay a secret that could shatter everything. He had been treating the victim for undisclosed ailments, and now, with their untimely demise, he feared the truth about his own struggles would come to light. The thought of exposure gnawed at him, a relentless specter that haunted his every waking moment, making it difficult to focus on the investigation at hand.",
      "As he delved into the intricacies of the murder, Mallory found himself grappling with the duality of his existence. He wanted to be the doctor everyone admired, yet the shadows of his addiction loomed large, threatening to pull him under. With each clue he uncovered, he felt the tug of his own demons, a constant reminder that he was not just trying to solve a murder; he was fighting for his very soul.",
      "In the midst of the chaos surrounding the investigation, Mallory realized that he could no longer hide from his past. The stakes had never been higher, and as he navigated the treacherous waters of suspicion, he understood that confronting his demons was as crucial to his survival as solving the murder. With each step he took, he felt the weight of his choices pressing down on him, forcing him to confront the man he had become and the path he must forge to reclaim his life."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer burdened by past failures, struggling to reconcile his ideals with the harsh realities of life in Little Middleton.",
    "publicPersona": "Ivor presents himself as a proud and disciplined man, a veteran with unwavering principles. His strict adherence to codes of honor has earned him respect among his peers, though his rigidity can alienate others.",
    "privateSecret": "However, Ivor harbors deep resentment towards the wealthy, stemming from his financial ruin during the stock market crash, which he blames on societal decay perpetuated by figures like the victim.",
    "motiveSeed": "Ivor's bitterness towards the victim is palpable, as he believes they played a significant role in the events that led to his downfall, fueling his desire for justice.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claims to have been polishing his medals in his room, yet no one can confirm his whereabouts during the time of the murder, casting doubt on his alibi.",
    "accessPlausibility": "His access to various locations is limited, as his retired status has distanced him from the inner circles of influence he once navigated with ease.",
    "stakes": "For Ivor, the stakes are personal; he seeks not only to restore his honor but also to reclaim a sense of financial stability that has eluded him since the crash.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks with a commanding presence, often delivering his thoughts in a straightforward manner without much embellishment. He has a tendency to punctuate his sentences with a resolute finality, as if daring anyone to challenge his views.",
    "internalConflict": "Captain Hale struggles with the resentment he feels towards a society that he believes has betrayed him, torn between the desire for justice and the bitterness that threatens to consume him.",
    "personalStakeInCase": "This murder is not merely a crime to Ivor; it is a chance to confront the societal decay he despises and to seek justice for what he perceives as a personal betrayal.",
    "paragraphs": [
      "Captain Ivor Hale stood in the quiet of his room, surrounded by medals that gleamed with memories of valor and honor. Once, he had commanded respect and admiration, but the stock market crash had stripped him of his fortune, leaving behind a bitter shell of the man he used to be. He had always believed in a strict code of honor, yet society had abandoned those principles, leaving him to grapple with a sense of betrayal that festered within him like an untreated wound. The victim, a figure he held responsible for the decay of societal values, had become the focal point of his anger.",
      "With each passing day, Ivor felt the weight of his past pressing down on him, a relentless reminder of what he had lost. He had claimed to be polishing his medals during the time of the murder, yet the truth was that he had been wrestling with the ghosts of his failures, questioning whether he could ever regain the standing he once held. The investigation stirred something within him, a flicker of hope that perhaps justice could be served, but it was tainted by the bitterness that threatened to consume him.",
      "As he navigated the complexities of the case, Ivor found himself torn between the desire for retribution and the recognition that his anger could lead him down a dark path. He sought to confront the victim not just for the murder but for the role they had played in the decline of his fortunes. In this quest for justice, he faced the grim reality that his ideals were at odds with the world around him, a conflict that left him questioning the very principles he had fought to uphold.",
      "In the end, Ivor understood that to seek justice was to confront not only the murderer but also the societal decay he had long resented. The stakes were high, and as he delved deeper into the investigation, he realized that reclaiming his honor would require more than mere retribution; it would demand a reckoning with the man he had become and the values he had once held dear."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious socialite and writer, navigating the complexities of her radical ideals while concealing a web of financial deceit.",
    "publicPersona": "Charming and progressive, Beatrice is known for her advocacy of social change, often seen mingling with the elite while passionately promoting her causes. Her charisma draws people in, making her a prominent figure in social circles.",
    "privateSecret": "Beneath her charming exterior, Beatrice is embezzling funds from her wealthy friends to support her radical ambitions, a secret that could destroy her reputation if uncovered.",
    "motiveSeed": "Beatrice feared that the victim, aware of her financial misdeeds, would expose her, jeopardizing her cause and the support she has cultivated.",
    "motiveStrength": "moderate",
    "alibiWindow": "She was seen attending a charity event during the time of the murder, but details surrounding her whereabouts are murky and unverified.",
    "accessPlausibility": "Beatrice moves easily among the wealthy and influential, allowing her access to various events and gatherings, but her actions are increasingly cloaked in secrecy.",
    "stakes": "For Beatrice, the stakes are high; she must protect her radical ambitions while ensuring her financial security remains intact.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a playful cadence, often lacing her dialogue with sharp wit and clever quips. Her charm is evident in her ability to engage others effortlessly, though her words can carry an edge that hints at her underlying tension.",
    "internalConflict": "Beatrice grapples with the tension between her revolutionary ideals and the reality of her actions, torn between the desire for social change and the fear that her financial deceit will lead to exposure.",
    "personalStakeInCase": "This crime strikes at the heart of Beatrice's ambitions, as solving it not only protects her radical causes but also ensures her financial security in a world where her position is precarious.",
    "paragraphs": [
      "Beatrice Quill floated through the charity event like a butterfly, her laughter ringing out like a bell, drawing the attention of those around her. She was the embodiment of charm and charisma, a socialite who seamlessly mingled with the elite while advocating for the very change that society desperately needed. Yet, beneath that dazzling exterior lay a complex web of deceit, one that could unravel her carefully constructed world at any moment. She had been embezzling funds from her wealthy friends to support her radical causes, a truth she guarded as fiercely as a lioness protecting her cubs.",
      "The victim's untimely demise sent shockwaves through her carefully curated life, and Beatrice felt the ground beneath her shift. She feared that the victim had discovered her financial misdeeds, and the thought of exposure loomed over her like a dark cloud. With each passing moment, she grappled with the tension between her ideals and the reality of her actions, knowing that the very causes she championed could be jeopardized by a single revelation. In her quest for social change, she found herself teetering on the brink of ruin.",
      "As she navigated the investigation, Beatrice's charm turned into a weapon, her words laced with polite savagery as she deflected suspicion and drew others into her orbit. She had learned to wield her wit like a sword, using humor to mask the fear simmering just beneath the surface. Yet, as the truth began to unravel, she realized that her cleverness might not be enough to shield her from the consequences of her actions. The stakes were high, and the pressure mounted as she sought to protect her ambitions while keeping her secrets hidden.",
      "In the end, Beatrice understood that the investigation was not just about solving a murder; it was a reckoning with her own choices. As she faced the possibility of exposure, she grappled with the reality that her pursuit of social change could lead to her undoing. The path ahead was fraught with danger, and she would need to navigate the complexities of her own heart while fighting for the ideals she believed in, knowing that the truth was a double-edged sword that could cut both ways."
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
    "summary": "Little Middleton Manor stands as a grand testament to the affluence of the 1930s, its sprawling grounds concealing secrets beneath layers of opulence.",
    "visualDescription": "The manor boasts a façade of weathered stone, intricately carved stonework framing tall, arched windows that glimmer with the sheen of rain, while ivy clings stubbornly to its walls, lending an air of both beauty and decay.",
    "atmosphere": "The atmosphere is thick with a tense foreboding, as shadows stretch across the expansive hallways and rooms, hinting at the hidden truths lurking within its walls.",
    "paragraphs": [
      "Little Middleton Manor rises like a sentinel against the overcast sky, its stone walls dampened by the persistent drizzle that envelops the estate. The sprawling grounds, with their meticulously manicured hedges and winding pathways, are imbued with an eerie silence, punctuated only by the occasional rustle of leaves or distant bird call. As guests arrive, the grandeur of the manor seems to whisper of both elegance and secrets, each ornate room a potential witness to the unfolding drama within.",
      "Upon entering the manor, one is immediately struck by the heavy drapery that adorns the tall windows, filtering the weak light and casting long shadows across the polished oak floors. The faint scent of beeswax from polished furniture mingles with the musty aroma of old books from the library, creating an atmosphere that is as inviting as it is foreboding. Each turn of the winding staircase leads to corridors that feel both expansive and confining, where whispers of the household staff can often be heard, hinting at the tensions beneath the surface of this seemingly perfect household.",
      "Outside, the grounds provide a stark contrast to the opulence of the interiors, with the dense woodlands surrounding the estate offering a sense of isolation that is palpable. The stable, with its weathered beams and the faint whinnying of horses, stands as a reminder of the manor's former glory, while the formal gardens, though beautiful, seem to hide a darker narrative among their carefully arranged blooms. As the sun sets, the once vibrant colors fade into shadows, and the manor takes on an air of secrecy, where every creak of the floorboards and flicker of candlelight hints at the mysteries waiting to be unraveled.",
      "In this world of privilege and pretense, the Great Depression looms just beyond the estate's gates, its effects felt in the strained interactions between the family and their staff. Class tensions simmer beneath the surface, as the household staff navigate their roles with quiet dignity, acutely aware of the delicate balance between service and suspicion. Little Middleton Manor, with its beauty and decay, becomes a microcosm of a society teetering on the brink, where every hidden corner may hold the key to a truth that could shatter the facade of respectability."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, creating a damp and somber ambiance.",
    "timeFlow": "Three days of mounting tension, as secrets unfurl and time feels both stagnant and fleeting.",
    "mood": "Tense and foreboding, a sense of underlying secrets amidst the grandeur.",
    "eraMarkers": [
      "Domestic wiring with frequent outages creates a flickering atmosphere in the evenings.",
      "Manual typewriters echo in the study, clattering away as letters are composed.",
      "The hum of a radio broadcasts news of the outside world, contrasting with the isolated life within the manor."
    ],
    "sensoryPalette": {
      "dominant": "The damp, earthy scent of rain-soaked stone and soil fills the air, mingling with the musty odor of aged wood.",
      "secondary": [
        "The faint aroma of beeswax from polished furniture adds a layer of warmth.",
        "A subtle hint of tobacco smoke lingers, evoking the presence of the manor's male residents."
      ]
    },
    "paragraphs": [
      "The atmosphere of Little Middleton Manor is steeped in a palpable tension, where the scent of damp earth clings to the air and the sound of rain patters gently against the windows. The heavy drapery, though elegant, seems to absorb the light, casting the rooms in a murky twilight that feels both intimate and oppressive. Each corner of the manor is shadowed, with the flicker of candlelight dancing across the walls, hinting at the secrets held within these grand yet confining spaces.",
      "As the days pass, the overcast skies and damp air create a sense of time stretching and warping, where the minutes feel like hours under the weight of unspoken truths. The hushed conversations among the staff, the creaking of old timbers, and the distant ticking of clocks all contribute to a growing sense of unease. In this isolated sanctuary, the grandeur of the estate becomes a stage for the unfolding drama, where hidden motives and past grievances threaten to surface at any moment."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library is a grand room lined with dark wood bookshelves filled with volumes of leather-bound books, their spines gleaming in the dim light. A large, ornate fireplace dominates one wall, its mantle adorned with family portraits that seem to watch over the space with silent judgment.",
      "sensoryDetails": {
        "sights": [
          "The flickering light from an antique brass lamp casts shadows over the pages of an open book, while dust motes dance in the air.",
          "Rich, dark green velvet drapes frame the tall windows, their edges slightly frayed, allowing just a glimpse of the rain-soaked garden outside."
        ],
        "sounds": [
          "The soft crackle of the fire as it burns low, punctuated by the occasional thump of a book being returned to its place.",
          "A distant clock chimes the hour, the sound echoing in the stillness, heightening the sense of anticipation."
        ],
        "smells": [
          "The mustiness of old paper and leather permeates the air, mingling with the faint scent of woodsmoke from the fireplace.",
          "A subtle undertone of polished wood and beeswax adds a comforting yet melancholic aroma to the space."
        ],
        "tactile": [
          "The coolness of the marble floor contrasts sharply with the warmth of the heavy wool rugs that soften footsteps.",
          "The texture of aged leather books, their spines cracked with use, conveys a sense of history and reverence in this secluded space."
        ]
      },
      "accessControl": "Access is restricted to family members and select staff, with the library remaining locked after dinner, only opened for special occasions or emergencies.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain streaks the glass, distorting the view of the garden beyond, while droplets gather on the window sills.",
            "A muted palette of greens and browns fills the room as the rain-soaked landscape outside reflects in the polished wood."
          ],
          "sounds": [
            "The steady drumming of rain on the roof is a constant backdrop, creating a rhythmic sound that soothes yet unsettles.",
            "Occasional gusts of wind rattle the windowpanes, adding to the sense of confinement in this grand space."
          ],
          "smells": [
            "The scent of damp earth and rain-soaked wood wafts through the air, mingling with the musty odor of the library.",
            "A hint of mildew lingers, a reminder of the manor's age and the relentless dampness of the season."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat pewter light filters through the heavy drapes, casting an even gloom over the room.",
            "Shadows stretch across the floor, creating an aura of unease that permeates the library."
          ],
          "sounds": [
            "The silence is punctuated only by the soft rustle of pages being turned, a sound that feels almost conspiratorial.",
            "The creaking of old timbers above adds to the oppressive atmosphere, each groan echoing like a sigh of the house."
          ],
          "smells": [
            "The rich scent of polished wood and leather is thick in the air, evoking memories of quiet reading and reflection.",
            "A faint whiff of tobacco smoke lingers from an earlier visitor, adding an air of mystery to the space."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers from sconces, illuminating the room in a warm glow that contrasts with the darkening sky outside.",
            "The shadows seem to dance along the walls, creating an almost theatrical atmosphere in the intimate space."
          ],
          "sounds": [
            "The tick of a mantel clock marks the passage of time, a reminder of the secrets that lie hidden.",
            "Distant voices from below stairs murmur, their conversations barely audible yet laden with significance."
          ],
          "smells": [
            "The aroma of candle wax fills the air, mingling with the comforting scent of polished wood.",
            "An underlying hint of tobacco smoke evokes the presence of someone who has recently occupied the space."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library serves as a repository of knowledge and a potential crime scene, its heavy drapes and shadowy corners offering ample opportunity for concealment. As the rain patters against the windows, the atmosphere grows thick with tension, where each creak of the floorboards amplifies the sense of impending revelation. The fireplace, though warm and inviting, casts flickering shadows that dance ominously across the room, hinting at the secrets that may be hidden within the pages of the books surrounding them.",
        "In this sanctuary of literature and history, the air is heavy with the weight of unspoken words, as the scent of old leather and polished wood clings to the atmosphere. The very walls seem to absorb the whispers of the past, holding onto the stories of those who have come before, while the current occupants navigate their own tangled web of intrigue. Here, in the heart of Little Middleton Manor, the library becomes a crucible for secrets, where the truth is buried beneath layers of deception."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is an expansive space adorned with exquisite floral wallpaper and plush seating, dominated by a grand piano that stands as the focal point of the room. Crystal chandeliers hang from the ceiling, their prisms refracting light into sparkling rainbows that dance across the walls.",
      "sensoryDetails": {
        "sights": [
          "The intricate patterns of the wallpaper are a feast for the eyes, each flower seemingly alive against the soft pastel backdrop.",
          "Gilded picture frames house portraits of the family, their eyes following visitors with an unsettling intensity."
        ],
        "sounds": [
          "The soft rustle of silk and velvet as guests shift in their seats, their conversations a low murmur that fills the space.",
          "The occasional thump of a piano key breaks the silence, a reminder of the musical gatherings that once filled the room with life."
        ],
        "smells": [
          "A heady mix of floral perfume and the faint scent of aged wood creates a comforting yet suffocating atmosphere.",
          "The aroma of freshly brewed tea lingers in the air, a remnant of the last gathering that feels both welcoming and heavy with expectation."
        ],
        "tactile": [
          "The plush upholstery of the chairs invites one to sink in, yet the coolness of the marble fireplace offers a jarring contrast.",
          "The smooth surface of the piano's polished wood beckons to be touched, a reminder of its role as a centerpiece for both decor and entertainment."
        ]
      },
      "accessControl": "The drawing room is open to guests during social gatherings, but access is limited outside of these events, with family members holding the key to its more intimate moments.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the windowpanes, distorting the view of the garden, while the dim light reveals the dust motes floating lazily in the air.",
            "The colors of the room appear muted, the rich floral patterns dulled by the overcast light."
          ],
          "sounds": [
            "The steady sound of rain drumming against the roof creates a soothing yet melancholic ambiance.",
            "The occasional creak of the house settling adds to the sense of isolation, as if the manor itself is holding its breath."
          ],
          "smells": [
            "The scent of wet earth and rain-soaked flowers seeps through the slightly open window, mingling with the lingering aroma of tea.",
            "A hint of mildew from the dampness adds an unsettling note to the otherwise comforting atmosphere."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light in the room is flat, casting a pallor over the floral wallpaper, which seems to absorb the color rather than reflect it.",
            "Shadows stretch across the floor, creating an unsettling play of light and darkness that feels charged with tension."
          ],
          "sounds": [
            "The murmur of conversations is punctuated by the soft clinking of china, a reminder of the daily rituals that continue despite the impending sense of dread.",
            "The distant ticking of a clock adds to the atmosphere, each tick a reminder of the time slipping away."
          ],
          "smells": [
            "The aroma of brewed tea fills the air, rich and comforting, yet tinged with an undercurrent of anxiety.",
            "A faint hint of dust mingles with the floral scents, evoking memories of gatherings past and the weight of expectations."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers across the room, casting warm glows that soften the edges of the floral patterns.",
            "As twilight deepens, the room takes on a magical quality, the colors vibrant against the darkening sky outside."
          ],
          "sounds": [
            "The gentle notes of the piano fill the air, a nostalgic echo of evenings spent in laughter and music.",
            "The quiet hum of conversations creates an intimate atmosphere, where secrets may be shared or concealed."
          ],
          "smells": [
            "The scent of candle wax mixes with the lingering aroma of tea and floral perfume, creating an inviting yet tense atmosphere.",
            "A subtle hint of tobacco smoke from a guest's cigar adds a layer of complexity to the air, evoking a sense of sophistication and danger."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room serves as a gathering space for the family and their guests, its elegance inviting yet concealing the undercurrents of tension that lie beneath. As the rain patters against the windows, the atmosphere within transforms, where the soft rustle of silk and velvet is punctuated by the occasional laughter that feels both genuine and strained. The grand piano stands silent for now, its polished surface reflecting the flickering candlelight, a reminder of the music that once filled the room with joy and camaraderie.",
        "In this space, the very air seems thick with expectation, where the scent of floral perfume mingles with the aroma of freshly brewed tea, creating an intoxicating blend that both welcomes and warns. Shadows dance along the walls as the day wanes, and the uneasy laughter of guests becomes a prelude to the secrets that are bound to emerge. The drawing room, with its beauty and grace, stands as a stage for the intricate drama unfolding within the walls of Little Middleton Manor."
      ]
    },
    {
      "id": "stable",
      "name": "The Stables",
      "type": "exterior",
      "purpose": "Clue discovery",
      "visualDetails": "The stables are a weathered structure, with wooden beams showing signs of age and wear, housing several horses and the necessary equipment for their care. Hay bales are stacked neatly in one corner, while the air is thick with the scent of fresh straw and horseflesh.",
      "sensoryDetails": {
        "sights": [
          "The dimly lit interior reveals the dark silhouettes of horses, their eyes glimmering with intelligence, as they shift restlessly in their stalls.",
          "Sunlight filters through gaps in the wooden slats, casting striped shadows across the earthen floor, where bits of hay and straw lie scattered."
        ],
        "sounds": [
          "The soft nickering of horses punctuates the stillness, a comforting sound that contrasts with the tension of the manor.",
          "The creaking of the stable door adds a layer of unease, as it swings gently on its hinges in the breeze."
        ],
        "smells": [
          "The strong, earthy scent of horse sweat mingles with the sweetness of hay, creating a heady aroma that is both comforting and raw.",
          "A faint whiff of leather from saddles and bridles hangs in the air, evoking memories of rides through the surrounding woodlands."
        ],
        "tactile": [
          "The rough texture of the wooden beams contrasts with the softness of the hay, creating a tactile experience that is both rustic and inviting.",
          "The coolness of the stable floor beneath one's feet offers a refreshing respite from the warmth of the sun outside."
        ]
      },
      "accessControl": "The stables are accessible to family members and stable hands, with limited access for guests, who are often discouraged from venturing into this working area.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops glisten on the wooden beams, while puddles form in the uneven earth outside, reflecting the overcast sky.",
            "The horses stand still, their coats glistening with moisture, as they wait for the rain to pass."
          ],
          "sounds": [
            "The sound of rain hitting the roof creates a rhythmic backdrop, accompanied by the soft rustle of horses shifting in their stalls.",
            "Occasional snorts and nickers echo in the damp air, a reminder of the life that continues despite the weather."
          ],
          "smells": [
            "The scent of wet hay and damp earth fills the stable, a reminder of the rain-soaked surroundings.",
            "The sharp tang of horse sweat is more pronounced in the humid air, mingling with the earthy aroma of the stables."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is dim, casting muted shadows across the stalls as horses stand quietly, their breath visible in the cool air.",
            "The walls of the stable seem to absorb the light, creating an atmosphere that feels heavy and foreboding."
          ],
          "sounds": [
            "The occasional creak of the stable's wooden structure is accompanied by the soft rustling of hay as the horses shift, adding to the tension.",
            "The distant sound of thunder rumbles, hinting at the possibility of more rain, which weighs on the atmosphere."
          ],
          "smells": [
            "The scent of damp wood and straw fills the air, creating a musty aroma that lingers in the cool space.",
            "A faint hint of leather from riding gear adds a layer of complexity to the earthy smells."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The setting sun casts warm golden light through the stable, illuminating the horses and creating a serene atmosphere.",
            "Shadows lengthen as the day fades, the horses settling into a peaceful calm as night approaches."
          ],
          "sounds": [
            "The gentle sounds of horses munching hay fill the air, punctuated by the occasional snort or whinny.",
            "The distant chirping of crickets begins to echo outside, creating a natural symphony that soothes the senses."
          ],
          "smells": [
            "The sweet scent of fresh hay and the warm aroma of horses create a comforting atmosphere in the evening light.",
            "A slight breeze carries the scent of wildflowers from the nearby fields, adding a touch of sweetness to the stable."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The stables, though a working area, hold their own mysteries, echoing with the soft sounds of horses and the rustle of hay. Sunlight streams through the gaps in the wooden slats, illuminating the dust motes that float lazily in the air, while the earthy aroma of horse sweat and fresh straw fills the space. Here, the tension of the manor feels distant, replaced by the simple yet profound connection between humans and animals, yet the shadows lurking in the corners hint at secrets waiting to be discovered.",
        "As the horses shift restlessly in their stalls, the atmosphere of the stables becomes charged with anticipation, the silence broken only by the soft nickering of the animals. Each creak of the stable door resonates like a heartbeat, as if the very structure is alive with its own stories. In this space, the mundane and the mysterious intertwine, where a seemingly innocuous location may hold the key to unraveling the enigma of Little Middleton Manor."
      ]
    }
  ],
  "note": "",
  "cost": 0.00284228175,
  "durationMs": 40327
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1939,
    "month": "November",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast skies",
      "frequent light rain",
      "chilly winds"
    ],
    "daylight": "Short days with limited daylight; sunset around 4:30 PM, leaving long evenings filled with darkness.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, with the house dimly lit and shadows lurking in corners.",
    "holidays": [
      "Guy Fawkes Night (November 5)",
      "Thanksgiving preparations"
    ],
    "seasonalActivities": [
      "hunting parties in the countryside",
      "preparations for Christmas decorations",
      "local fairs with autumn harvest themes"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool suits with high lapels",
        "double-breasted overcoats",
        "homburg hats"
      ],
      "casual": [
        "tweed jackets",
        "corduroy trousers",
        "knitted sweaters"
      ],
      "accessories": [
        "silk ties",
        "leather gloves",
        "pocket squares"
      ]
    },
    "womensWear": {
      "formal": [
        "long evening gowns with cinched waists",
        "three-quarter length coats with fur collars",
        "cloche hats"
      ],
      "casual": [
        "tea dresses with floral patterns",
        "tweed skirts",
        "turtleneck sweaters"
      ],
      "accessories": [
        "string pearls",
        "gloves",
        "small handbags"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "emphasis on tailored silhouettes",
      "use of rich, dark fabrics"
    ],
    "socialExpectations": [
      "men expected to exhibit stoicism",
      "women encouraged to maintain household decorum",
      "class distinctions emphasized in social events"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Germany invades Poland, starting World War II",
      "The Battle of Britain continues",
      "Increased military enlistments in Britain"
    ],
    "politicalClimate": "Tense and uncertain; the threat of war looms large in public consciousness.",
    "economicConditions": "Widespread impact of the Great Depression still felt; rationing begins as governments prepare for war.",
    "socialIssues": [
      "class disparity highlighted by wartime preparations",
      "gender roles in flux as women join the workforce",
      "growing fear of fascism and its implications in global politics"
    ],
    "internationalNews": [
      "Chamberlain's government facing criticism for its handling of the war",
      "Rumors of peace negotiations creating public unrest"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glen Miller's big band music",
        "Benny Goodman hits",
        "Ella Fitzgerald's jazz standards"
      ],
      "films": [
        "Gone with the Wind",
        "The Wizard of Oz",
        "Mr. Smith Goes to Washington"
      ],
      "theater": [
        "The Glass Menagerie by Tennessee Williams",
        "Pygmalion",
        "The Road to Yesterday"
      ],
      "radio": [
        "The Shadow",
        "The Eddie Cantor Show",
        "news bulletins covering the war"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Grapes of Wrath by John Steinbeck",
        "The Maltese Falcon by Dashiell Hammett",
        "The Thin Man by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "war literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator becoming common",
        "advancements in radio technology",
        "early developments in radar"
      ],
      "commonDevices": [
        "manual typewriters",
        "home radios",
        "early vacuum cleaners"
      ],
      "emergingTrends": [
        "home entertainment systems gaining popularity",
        "growth of consumer electronics",
        "increased accessibility to printed media"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: two pence",
        "Cinema ticket: sixpence"
      ],
      "commonActivities": [
        "attending local fairs and markets",
        "gathering for evening radio broadcasts",
        "engaging in community dances or social clubs"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "afternoon tea with friends",
        "participation in local church events"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing scrutiny of the upper class's wealth",
      "working-class solidarity in the face of adversity"
    ],
    "gender": [
      "women increasingly stepping into roles outside the home",
      "traditional expectations of femininity challenged"
    ],
    "race": [
      "heightened awareness of racial tensions as societal issues are debated",
      "fascist ideologies prompting anti-Semitic sentiments"
    ],
    "generalNorms": [
      "emphasis on community and collective responsibility",
      "growing concern for moral and ethical values during wartime"
    ]
  },
  "atmosphericDetails": [
    "The sound of rain tapping against window panes, echoing the somber mood of the estate.",
    "The rich scent of burning wood mingles with the earthy aroma of damp leaves outside.",
    "Shadows cast by flickering candlelight create an uneasy ambiance, hinting at secrets hidden within the walls."
  ],
  "paragraphs": [
    "In November 1939, the air is thick with tension, as the world reshapes itself around the burgeoning specter of war. The crisp, damp weather of late fall envelops the countryside estate, with overcast skies and intermittent rain setting a somber backdrop for the lives unfolding within its opulent walls. The days grow short, with darkness descending by 4:30 PM, casting long shadows that seem to whisper secrets of the past. As Guy Fawkes Night fades into memory, the estate prepares for the upcoming holiday season, with families grappling with the realities of rationing and the uncertainties of the future.",
    "Fashion during this time reflects the prevailing moods and social expectations. Men don tailored wool suits with high lapels, complemented by double-breasted overcoats that convey a certain air of authority; homburg hats are a common sight as gentlemen traverse the estate grounds. Women embrace elegance in long evening gowns that cinch at the waist, wearing cloche hats that frame their faces softly. The use of rich, dark fabrics showcases not only a trend but also an attempt to evoke a sense of stability amidst the chaos of the outside world, as class distinctions are starkly highlighted by the fashion choices available to them.",
    "Daily life is punctuated by the realities of the Great Depression, where the price of a loaf of bread is just four pence, and a cinema ticket costs six pence — a rare indulgence for many. Families gather around their radios for evening broadcasts, immersing themselves in the latest news from the frontlines of Europe, while community gatherings provide a semblance of normalcy. Rituals such as Sunday dinners and afternoon tea become anchors in tumultuous times, reflecting a collective yearning for connection and comfort. With each day, the shadows of the estate grow longer, echoing the secrets held within its walls, as the characters prepare for the inevitable unraveling of their intertwined fates."
  ],
  "note": "",
  "cost": 0.0010523155499999998,
  "durationMs": 13195
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the estate for a family reunion amidst the economic strain of the Great Depression forces heirs, staff, and guests to confront their hidden agendas and class tensions under the watchful eye of societal scrutiny.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class dynamics are strained by economic hardship, with increased scrutiny on the affluent and rising tensions due to the political climate."
  },
  "setting": {
    "location": "A sprawling manor house with extensive grounds, featuring formal gardens, a stable, and woodlands.",
    "institution": "Country house estate",
    "weather": "Overcast with occasional rain, creating a damp and somber ambiance."
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
    "id": "witness_time",
    "value": "a quarter past twelve",
    "description": "The time a witness claims to have seen the victim alive"
  },
  {
    "id": "murder_time",
    "value": "twenty minutes past eleven",
    "description": "The actual time of the murder based on the clock's tampering"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study has stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The timing of the clock suggests a possible manipulation.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Witnesses recall seeing Lord Voss shortly before the crash.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This places Lord Voss's whereabouts before the event.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "If the clock was tampered with, the real timeline conflicts with the witness account.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This suggests a discrepancy in the timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "physical",
      "description": "A faint scratch is found on the clock's winding key.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This indicates possible recent manipulation of the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "testimonial",
      "description": "The scratch indicates recent tampering, suggesting premeditated action.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This implies a motive behind the clock's manipulation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The mechanism relies on the clock's timing to expose the false timing.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "This reveals how the clock's condition affects the investigation.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock's time suggests that the murder occurred after it was tampered with.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "This contradicts the witness accounts.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she was seen at the tea party during the crash.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This confirms she could not have committed the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "category": "behavioral",
      "description": "Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "behavioral",
      "description": "Captain Ivor Hale exhibited jealousy towards Lord Voss.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This suggests a motive for the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Beatrice Quill claims she was in the garden during the crash.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This provides her with an alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "testimonial",
      "description": "Dr. Mallory Finch was attending to a patient at the time of the crash.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This confirms he was not present at the scene.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "ten fifty in the morning crash remains a late texture detail in the case background.",
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
      "description": "The clock in the study has stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The clock's time suggests that the murder occurred after it was tampered with.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "A faint scratch is found on the clock's winding key.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The scratch indicates recent tampering, suggesting premeditated action.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Witnesses reported hearing a loud crash just before the clock stopped.",
      "supportsAssumption": "The murder must have occurred after the witnesses heard the crash.",
      "misdirection": "This might lead one to believe that the event was linked to the crash timing."
    },
    {
      "id": "rh_2",
      "description": "Witnesses claim they saw Lord Voss arguing with Captain Hale shortly before the event.",
      "supportsAssumption": "The murder must have occurred after the witnesses heard the crash.",
      "misdirection": "This could mislead the reader into thinking the argument was the motive for the murder."
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
      "clue_mechanism_visibility_core",
      "clue_fp_contradiction_step_1"
    ],
    "mid": [
      "clue_4",
      "clue_5",
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain",
      "clue_culprit_direct_captain_ivor_hale",
      "clue_6",
      "clue_7",
      "clue_8",
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
  "latencyMs": 14454,
  "cost": 0.006019171950000001
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
