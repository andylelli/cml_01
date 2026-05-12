# Actual Prompt Record

- Run ID: `mystery-1778603975299`
- Project ID: ``
- Timestamp: `2026-05-12T16:49:09.668Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `bd23ced50e547101`

## Message 1 (role=system)

```text
You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
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
  - storyEmotionalArc.arcDescription MUST be at least 300 words across multiple paragraphs.
    A single-paragraph summary is insufficient regardless of word count — the emotional
    journey must unfold across clearly distinct paragraphs.
    Trace opening → rising tension → first turn → mid → second turn → climax → resolution.
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
      "institution": "country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "premeditated"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30s",
      "role_archetype": "victim",
      "relationships": [
        "Dr. Mallory Finch (ex-lover)",
        "Captain Ivor Hale (friend)",
        "Beatrice Quill (detective)"
      ],
      "public_persona": "Wealthy heiress known for her social gatherings",
      "private_secret": "Had been planning to cut ties with her wealthy family",
      "motive_seed": "Potential inheritance dispute",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "garden",
        "study"
      ],
      "behavioral_tells": [
        "nervous around family",
        "avoiding certain topics"
      ],
      "stakes": "inheritance and family reputation",
      "evidence_sensitivity": [
        "time of death",
        "alibi verification"
      ],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40s",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss (ex-lover)",
        "Beatrice Quill (detective)",
        "Captain Ivor Hale (colleague)"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Had a secret affair with Eleanor",
      "motive_seed": "Jealousy over Eleanor's potential marriage",
      "motive_strength": "moderate",
      "alibi_window": "between 7 and 9 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "study",
        "dining room"
      ],
      "behavioral_tells": [
        "defensive when questioned",
        "expresses regret about past"
      ],
      "stakes": "professional reputation",
      "evidence_sensitivity": [
        "medical records",
        "personal letters"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50s",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (colleague)",
        "Beatrice Quill (detective)"
      ],
      "public_persona": "Retired military officer",
      "private_secret": "Harbors feelings for Eleanor",
      "motive_seed": "Desire to protect Eleanor from her family",
      "motive_strength": "moderate",
      "alibi_window": "between 8 and 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "garden",
        "entrance hall"
      ],
      "behavioral_tells": [
        "visibly upset about Eleanor's situation",
        "overly eager to assist"
      ],
      "stakes": "personal feelings and honor",
      "evidence_sensitivity": [
        "location records",
        "timing of activities"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30s",
      "role_archetype": "detective",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (colleague)",
        "Captain Ivor Hale (acquaintance)"
      ],
      "public_persona": "Intrepid investigator known for her keen insights",
      "private_secret": "Struggles with her own family expectations",
      "motive_seed": "Desire to prove herself in a male-dominated field",
      "motive_strength": "moderate",
      "alibi_window": "arrived shortly after death",
      "access_plausibility": "high",
      "opportunity_channels": [
        "study",
        "entrance hall"
      ],
      "behavioral_tells": [
        "observant and meticulous",
        "unwavering confidence"
      ],
      "stakes": "professional success",
      "evidence_sensitivity": [
        "investigative reports",
        "personal notes"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
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
      "summary": "During a stormy evening at their country estate, Eleanor Voss is found dead, leading Beatrice Quill to uncover a conspiracy involving a tampered clock that misleads everyone about the time of death."
    },
    "accepted_facts": [
      "Eleanor was found dead in the study.",
      "The clock in the study stopped at an unusual time.",
      "The weather was overcast with occasional rain."
    ],
    "inferred_conclusions": [
      "The time of death does not match the clock's stopping time.",
      "Dr. Mallory Finch had access to the study.",
      "The clock was tampered with to create a false timeline."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "A spring-driven clock was tampered with to mislead witnesses about the time of death.",
      "delivery_path": [
        {
          "step": "The clock's spring was adjusted to freeze at a specific time."
        },
        {
          "step": "The tampering created a false narrative about when Eleanor was killed."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death was hidden, leading to wrongful suspicion."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss must have died around the time the clock stopped.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock stopping at a specific time creates a compelling narrative for when the murder occurred.",
    "what_it_hides": "The clock was tampered with to mislead everyone about the actual time of death."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The clock's stopping time",
        "Witness testimony about Eleanor's last seen time"
      ],
      "windows": [
        "7:00 PM to 9:00 PM"
      ],
      "contradictions": [
        "Witnesses recall Eleanor alive at 8:00 PM, but the clock shows 7:30 PM."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The clock",
        "Eleanor's body"
      ],
      "permissions": [
        "Access to the study at all times"
      ]
    },
    "physical": {
      "laws": [
        "The mechanical properties of the clock allow for tampering."
      ],
      "traces": [
        "Faint scratches on the clock indicating tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Family loyalty",
        "Friendship bonds"
      ],
      "authority_sources": [
        "Dr. Mallory Finch's medical authority"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows a faint scratch on its casing.",
        "correction": "The scratch indicates it was tampered with recently.",
        "effect": "Narrows the suspect pool to those who had access to the clock.",
        "required_evidence": [
          "The clock shows a faint scratch on its casing.",
          "Witnesses recall the clock chiming incorrectly."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses claim Eleanor was last seen alive at eight o'clock.",
        "correction": "This contradicts the clock's stopping time, suggesting tampering.",
        "effect": "Eliminates the assumption that Eleanor died around the stopping time.",
        "required_evidence": [
          "Witness statements about Eleanor's last seen time.",
          "The clock stopped at 7:30 PM."
        ],
        "reader_observable": true
      },
      {
        "observation": "A missing spring component was found near the crime scene.",
        "correction": "The missing component suggests deliberate tampering with the clock.",
        "effect": "Eliminates Dr. Mallory Finch, who does not have access to the component.",
        "required_evidence": [
          "The missing spring component found near the crime scene.",
          "The clock's stopping time contradicts witness statements."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled reenactment is staged where all suspects are asked to explain their whereabouts at the time the clock stopped, revealing contradictions in their accounts.",
    "knowledge_revealed": "The revealed facts are witnes, clock, and study.",
    "pass_condition": "If Dr. Mallory Finch cannot account for his time when the clock was tampered, he is confirmed as the murderer.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_core_contradiction_chain",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock scratch and the incorrect chiming clue (early) indicate tampering. Step 2: The witness statements about Eleanor's last seen time (mid) contradict the clock's stopping time. Step 3: The missing spring component clue (discriminating test) reveals Dr. Mallory Finch's guilt."
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
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proves he was outside during the time frame based on witness statements.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Eleanor is deceased and cannot be a suspect.",
        "supporting_clues": [
          "None"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence."
    },
    "identity_rules": [
      {
        "character_name": "Beatrice Quill",
        "revealed_in_act": 3,
        "before_reveal_reference": "the detective",
        "after_reveal_reference": "Beatrice"
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
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Witness testimony"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Controlled reenactment"
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
    "summary": "Eleanor Voss is a charming socialite whose lavish gatherings are the talk of Little Middleton, but beneath her glamorous facade lies a desperate secret.",
    "publicPersona": "Eleanor is the epitome of grace and hospitality, known for her extravagant soirées that draw the town's elite. She has a knack for making everyone feel welcome, her laughter and warmth creating an inviting atmosphere. Her reputation as a charming hostess is well-established, and she thrives on the affection and admiration of her peers.",
    "privateSecret": "What few know is that Eleanor has been embezzling funds from the family estate, a desperate measure taken to sustain her luxurious lifestyle after a series of poor investments left her finances in tatters. The weight of her deceit hangs heavy, creating a chasm between her public charm and private guilt.",
    "motiveSeed": "With her luxurious lifestyle at stake, Eleanor is driven by a fierce need to maintain appearances and avoid the ruin that would follow if her financial discrepancies were uncovered.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims she was in the garden arranging flowers from two to four, a picturesque alibi that could easily be substantiated by the few guests present.",
    "accessPlausibility": "easy",
    "stakes": "The potential exposure of her embezzlement could lead to not only financial ruin but also the collapse of her social standing and reputation, which she values above all else.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with an elegant cadence, often peppering her conversations with light sarcasm and sharp wit. She has a tendency to soften her critiques with a smile, turning potential barbs into playful jests. Her laughter is infectious, but there's an edge to it that hints at the tension beneath her polished exterior.",
    "internalConflict": "Eleanor grapples with the fear of losing everything she has built, feeling the pressure of her lies closing in. The thought of being exposed as a fraud terrifies her, yet her desire for freedom from financial constraints pulls her deeper into her web of deceit.",
    "personalStakeInCase": "This crime matters deeply to Eleanor not just for the potential scandal it could bring, but because it represents the crumbling facade of her carefully constructed life, one she has fought to maintain at any cost.",
    "paragraphs": [
      "Eleanor Voss glided through the opulent halls of her manor, a vision of elegance in her silk gown, laughter spilling from her lips like fine champagne. Guests mingled, drawn to her like moths to a flame, unaware of the tempest that brewed within her. Hosting these gatherings was her lifeblood, a means to uphold her social standing while concealing the cracks that threatened to shatter her world.",
      "But beneath the laughter and the clinking of glasses lay a darker truth. Eleanor had been embezzling funds from the family estate, a desperate act born from a series of ill-fated investments. Each day brought a fresh wave of anxiety as she navigated a precarious dance between maintaining appearances and risking exposure. The thought of her lavish lifestyle crumbling around her filled her with dread, pushing her to the brink.",
      "As she arranged flowers in the garden, a serene smile graced her lips, but her heart raced with the knowledge of her secrets. The garden, a place of beauty, had become a sanctuary for her guilt. Here, she could pretend that everything was perfect, yet the weight of her dishonesty pressed down like a leaden cloak. If anyone discovered her misdeeds, her entire world would unravel, leaving her with nothing but the ruins of her former glory.",
      "Eleanor's charm was her shield, but it was also her prison. She knew that if she were to confess, it could lead to a chance at redemption, a way to face the consequences of her actions. Yet the thought of losing her status, her friends, and the life she had cultivated was a terrifying prospect. As the evening wore on, she wondered if the truth would eventually catch up with her, and if it did, would she be brave enough to confront it?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected local physician, whose calm demeanor hides the turmoil of a past affair that threatens to resurface with deadly consequences.",
    "publicPersona": "Known for his composed and professional approach, Dr. Finch carries an air of authority that commands respect in Little Middleton. His patients trust him implicitly, and he is often the voice of reason in the community. However, behind this facade lies a man haunted by regret and a past he wishes to forget.",
    "privateSecret": "Years ago, he had a clandestine affair with the victim, an entanglement that still weighs heavily on his conscience. The fear of exposure looms over him, as he knows that should the truth emerge, it could ruin his reputation and career.",
    "motiveSeed": "Dr. Finch is driven by the fear that the victim might reveal their past relationship, which would not only tarnish his professional reputation but could also jeopardize his standing in the community.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claims to have left the dinner party around nine and took a walk until ten, a statement that could be corroborated by a few late-night stragglers.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Dr. Finch are high; his professional reputation and community standing are at risk due to the potential fallout from his past indiscretion.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks in a measured tone, often pausing to choose his words carefully. His speech is peppered with medical jargon, which he sometimes uses to deflect personal conversations. Despite his serious nature, he occasionally injects dry humor into his remarks, a reflection of his attempts to cope with the tension he feels.",
    "internalConflict": "Dr. Finch is torn between his desire to uphold his reputation and the guilt he carries for his past actions. The affair, once a source of excitement, has become a burden that he cannot shake, and he fears the repercussions of facing it head-on.",
    "personalStakeInCase": "The murder of the victim is not just a professional concern for Dr. Finch; it is a personal crisis that threatens to unearth the skeletons of his past, forcing him to confront the choices he made and the life he built on the foundation of deception.",
    "paragraphs": [
      "Dr. Mallory Finch was a pillar of the Little Middleton community, a physician whose calm demeanor and steady hands had saved countless lives. Yet, beneath the surface of respectability lay a man wrestling with shadows of his past. As he stood in the study, contemplating the evening's events, he felt the familiar twinge of regret gnawing at him, a reminder of the affair that had once brought him both joy and despair.",
      "The victim had been a vibrant part of his life, their secret encounters a thrilling escape from his otherwise staid existence. But time had a way of tarnishing memories, and now that same woman was dead, leaving behind a trail of questions that threatened to unravel him. Dr. Finch knew that if their past were to come to light, his carefully constructed life could collapse in an instant, taking with it his reputation and the trust of his patients.",
      "He had left the dinner party around nine, claiming a need for fresh air, but in truth, he had sought solace in the quiet of the night. The stars twinkled overhead, mocking him as he walked, lost in thought. How could he protect himself from the fallout of a relationship long buried? The fear of exposure loomed large, a specter that haunted him even in his most private moments.",
      "As he pondered the implications of the murder, Dr. Finch felt a growing sense of urgency. This case was not just about justice; it was a reckoning for him, an opportunity to confront the ghosts of his past. He could either choose to run from the truth or face it head-on, and in that decision lay the potential for his redemption."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a gruff yet loyal family friend with a storied military past, harboring a sense of betrayal that fuels his desire for revenge.",
    "publicPersona": "With a distinguished military career behind him, Captain Hale is known for his gruff demeanor and unwavering loyalty to those he cares about. He commands respect through his presence alone, often acting as a protector of the Voss family. His no-nonsense attitude makes him a figure of authority, even in social settings.",
    "privateSecret": "Beneath the surface, he feels a deep sense of betrayal from the victim, who backed out of a business deal that cost him his life savings. This betrayal has left a bitter taste in his mouth, festering into a desire for revenge.",
    "motiveSeed": "Captain Hale's motive stems from his wounded pride and the financial loss he suffered due to the victim's actions, which he perceives as a personal affront.",
    "motiveStrength": "weak",
    "alibiWindow": "He claims to have been in the study reading from eight to ten, but the truth is that he often lost track of time when lost in his thoughts.",
    "accessPlausibility": "easy",
    "stakes": "His personal stakes revolve around protecting his family's honor and seeking retribution for the perceived betrayal, though he is aware that revenge might not bring the satisfaction he seeks.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Captain Hale speaks with a deep, gravelly voice, often punctuating his sentences with a dry chuckle. His speech is direct, with a tendency to ramble when he feels comfortable, revealing a softer side hidden beneath his tough exterior. He often reflects on his military past, using anecdotes to illustrate his points, though they sometimes drift into self-deprecating humor.",
    "internalConflict": "Captain Hale grapples with the tension between his desire for revenge and the reality that seeking it may not bring him the closure he craves. He finds himself questioning whether his feelings of betrayal are justified or merely a reflection of his own insecurities.",
    "personalStakeInCase": "For Captain Hale, this crime is not merely about the murder; it is a test of his loyalty to the Voss family, and a chance to confront the demons of his past that threaten to consume him.",
    "paragraphs": [
      "Captain Ivor Hale stood in the study, his broad shoulders hunched as he stared out the window, lost in thought. The moonlight cast a silver glow over the garden, a stark contrast to the turmoil brewing within him. He was a man of honor, a retired naval officer who had dedicated his life to serving others, yet here he was, consumed by feelings of betrayal over a business deal gone awry. The victim's decision to back out had cost him dearly, and the wound still festered.",
      "His gruff exterior often masked the pain he felt, but beneath the surface lay a man who had loved and lost, whose pride had been wounded. The thought of revenge flitted through his mind, tempting him with the promise of satisfaction. But deep down, he questioned whether such actions would truly heal his wounds or simply deepen them further. He had always prided himself on his loyalty, but now he found himself grappling with conflicting emotions that left him feeling adrift.",
      "As he recounted the events of the evening, he remembered his alibi—sitting in the study, reading. It was a comforting routine, one that allowed him to escape the chaos of his thoughts. Yet, the very act of reading had become a distraction, a way to avoid confronting the reality of what had happened. He often chuckled at his own tendency to lose himself in stories, wondering if he was merely seeking solace in fiction to escape the truth.",
      "Captain Hale knew that this case was about more than just the murder; it was an opportunity to confront the betrayal that had haunted him for far too long. As he contemplated the path ahead, he realized that forgiveness might be the only way to reclaim his honor and restore the ties that had been frayed by resentment. The question remained—would he have the courage to face the truth, or would he let his anger consume him?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an amateur detective with an insatiable curiosity and a sharp wit, driven by a personal quest to uncover the truth behind her mother's mysterious death.",
    "publicPersona": "Beatrice is a vibrant young woman known for her keen intellect and a knack for solving puzzles. Her curious nature often draws her into the thick of things, making her a well-known figure among the local gossipers. Her enthusiasm for detective work is infectious, and she approaches each case with a blend of seriousness and playful banter.",
    "privateSecret": "Beneath her cheerful exterior, Beatrice is obsessed with uncovering the truth behind her mother's untimely death, a mystery that has haunted her for years. This obsession drives her to seek answers, often at the expense of her own well-being.",
    "motiveSeed": "Drawn to the manor for a chance to solve a murder, Beatrice sees this as an opportunity to not only discover the truth about the victim but also to unearth answers about her own family's dark history.",
    "motiveStrength": "compelling",
    "alibiWindow": "Beatrice arrived at the manor just before the murder took place, having been invited to the party, which grants her a perfect alibi for her involvement.",
    "accessPlausibility": "easy",
    "stakes": "For Beatrice, this case represents not only a chance to seek justice for the victim but also a path to closure regarding her family's troubled past, making the stakes deeply personal.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with a rapid-fire enthusiasm, often punctuating her sentences with clever quips and sardonic observations. She has a tendency to lean in when discussing mysteries, her eyes sparkling with excitement, and she often uses playful sarcasm to engage her listeners.",
    "internalConflict": "Beatrice wrestles with the duality of her ambition and the weight of her family's legacy. Her obsession with solving mysteries often blinds her to the emotional toll it takes, leaving her torn between her thirst for answers and the need to confront her own grief.",
    "personalStakeInCase": "The murder is not just a puzzle to Beatrice; it is a chance to confront the unresolved pain of her mother's death, and she hopes that solving this case will finally lead her to the truth she has been seeking.",
    "paragraphs": [
      "Beatrice Quill stood at the entrance of the Voss manor, her heart racing with excitement. The air was thick with anticipation, and she could hardly contain her enthusiasm. A self-proclaimed amateur detective, Beatrice was always on the lookout for a new mystery to unravel, and tonight, she felt like she was on the cusp of something significant. The murder that had just transpired was not just another case; it was a personal quest to uncover the truth behind her mother’s mysterious death.",
      "As she mingled with the guests, her sharp wit and sardonic humor made her a delightful presence, though few knew the depths of her obsession. Beatrice had spent years piecing together the fragments of her mother’s past, and the idea that this murder could somehow connect to her own family history sent a thrill through her. She was determined to seize this opportunity and dig deeper, even if it meant stepping on a few toes along the way.",
      "Her mind raced with possibilities as she navigated the crowd, each conversation a potential clue. Beatrice’s speech was rapid and peppered with clever observations, her enthusiasm infectious. She leaned in close to her companions, her eyes sparkling with mischief as she dissected the evening’s events. For her, this was not merely a social gathering; it was a chance to uncover secrets that had remained buried for too long.",
      "Yet, beneath the bravado lay a current of unresolved grief. Beatrice knew that her relentless pursuit of answers often came at a cost, one that threatened to consume her. The weight of her mother's death loomed large, and she felt a pang of guilt for allowing her obsession to overshadow her emotional healing. As she set her sights on solving this murder, she also knew that the journey would force her to confront the painful truths of her past, a challenge she was both eager and terrified to face."
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
    "type": "country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Middleton Manor stands as a testament to the wealth and power of its owners, surrounded by meticulously manicured gardens and the shadow of social unrest.",
    "visualDescription": "The estate is a sprawling edifice of weathered stone, adorned with ivy that clings to its walls like a secret. Its grand entrance hall, with a sweeping staircase and polished oak floors, echoes the opulence of a bygone era, while the distant sound of thunder hints at the brewing storm outside.",
    "atmosphere": "A palpable tension hangs in the air, a reflection of the societal unrest that rumbles beneath the surface of this seemingly idyllic setting.",
    "paragraphs": [
      "Middleton Manor rises like a fortress from the rolling hills of Little Middleton, its stone façade a canvas for creeping ivy and the harsh realities of the Great Depression. The formal gardens, while beautifully arranged with seasonal blooms, are bordered by a high wall that cuts off the estate from the outside world, enhancing the isolation felt within. A gravel driveway leads up to the main entrance, where the occasional sound of a petrol automobile breaking the stillness serves as a reminder of the social divide that permeates the air.",
      "As one steps inside, the grand entrance hall unfurls like a stage, with its high ceilings and intricate plasterwork casting long shadows in the dim light. The scent of beeswax polish mingles with the musty aroma of old books from the library, where access is restricted and whispers of secrets linger like the dust motes in the air. The heavy curtains, drawn against the overcast sky, create a sense of confinement, as if the walls themselves are privy to the conspiracies that threaten to unfold.",
      "The layout of the manor is both elegant and strategic, with corridors leading to various rooms that hold their own mysteries. The drawing room, with its plush armchairs and a grand piano gathering dust, feels like a stage set for a play that has yet to begin. Outside, the gardens, while beautiful, are eerily quiet, as if nature itself senses the tension brewing within the manor. The distant rumble of thunder adds an ominous soundtrack to the events that are about to transpire, while the soft patter of rain against the windows creates a rhythm of unease.",
      "As night falls, the atmosphere grows thicker, the shadows deepening in the corners of the rooms. The ticking of clocks, a constant reminder of time slipping away, becomes a haunting backdrop to the secrets that are about to be revealed. In this house of wealth and privilege, the undercurrents of class struggle and betrayal weave through the very fabric of Middleton Manor, setting the stage for a conspiracy that could shatter everything."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical of the English countryside in autumn",
    "timeFlow": "A tense evening unfolds over the course of a single night, where every tick of the clock heightens the suspense.",
    "mood": "Tense and foreboding, reflecting the underlying class struggles and societal unrest.",
    "eraMarkers": [
      "Petrol automobiles parked in the gravel driveway, their engines still warm from recent use.",
      "Typewriters clacking away in the study, filling the air with a rhythmic mechanical sound.",
      "An early telephone with a rotary dial sits on a side table, its cord coiling like a serpent."
    ],
    "sensoryPalette": {
      "dominant": "The faint scent of damp earth and rain-soaked stone pervades the air.",
      "secondary": [
        "The lingering aroma of tobacco smoke from the drawing room.",
        "The musty smell of old books, thick with stories and secrets."
      ]
    },
    "paragraphs": [
      "The atmosphere of Middleton Manor is thick with tension, each room holding its breath as if aware of the impending conflict. Outside, the sky weeps, casting a gloomy pall over the estate, while the sound of rain against the windows creates an unsettling rhythm. Shadows dance across the walls as the flickering light of oil lamps struggles against the encroaching darkness, amplifying the sense of foreboding that envelops the manor. The air is electric, charged with the whispers of secrets and the weight of unspoken truths.",
      "Within the confines of the manor, every creak of the floorboards and rustle of fabric seems to echo with significance, heightening the sense of isolation and unease. The heavy drapes hang like curtains of despair, blocking out the light and trapping the occupants within their own web of intrigue. Time seems to stretch and contract in this space, with every moment steeped in the knowledge that something is about to change, that the carefully constructed facade of propriety is on the verge of collapse."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library is a cavernous room lined with dark wooden shelves, filled with books that seem untouched by time. A large oak table dominates the center, its surface marred by the remnants of a hasty meeting, papers scattered like leaves in the wind.",
      "sensoryDetails": {
        "sights": [
          "The dim light from a single brass lamp casts an amber glow over the room, illuminating the dust motes that float lazily in the air.",
          "Heavy drapes frame the tall windows, their fabric faded and rich, obscuring the view of the stormy garden outside."
        ],
        "sounds": [
          "The soft rustle of pages turning echoes through the silent room, a reminder of the secrets held within the books.",
          "Occasionally, the distant rumble of thunder reverberates through the walls, adding a sense of urgency to the quiet."
        ],
        "smells": [
          "The musty scent of old paper and leather bindings hangs in the air, mingling with the faint aroma of polished wood.",
          "A whiff of dampness from the rain outside seeps in, creating a chilling contrast to the warmth of the room."
        ],
        "tactile": [
          "The cool surface of the oak table feels smooth beneath the fingers, but the scattered papers are crinkled and rough, betraying their hurried use.",
          "The air is thick with humidity, clinging to the skin and creating a sense of discomfort as the storm rages outside."
        ]
      },
      "accessControl": "Only family members and select staff have access, while the library remains locked after dark, heightening the sense of secrecy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-streaked windows blur the view of the garden, creating a somber atmosphere.",
            "The grey light filters through the drapes, casting a muted glow across the room."
          ],
          "sounds": [
            "The steady drumming of rain on the roof creates a lullaby of unease.",
            "Water trickles in the gutters outside, a constant reminder of the dreary morning."
          ],
          "smells": [
            "Damp earth from the garden wafts through the slightly ajar window, mixing with the musty scent of books.",
            "A hint of mildew lingers in the air, further enhancing the sense of decay."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat pewter light fills the room, making the shadows appear sharper and more pronounced.",
            "The aged spines of books stand in stark contrast to the gloom, their titles barely visible."
          ],
          "sounds": [
            "Silence reigns, broken only by the distant ticking of a clock, a reminder of time slipping away.",
            "The creak of old timbers resonates as the house settles, adding to the eerie stillness."
          ],
          "smells": [
            "The aroma of beeswax polish from the furniture mixes with the stale scent of long-untouched pages.",
            "Dust hangs heavy in the air, creating a sense of neglect and abandonment."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers across the room, highlighting the contours of the bookshelves and casting long shadows.",
            "The rich colors of the room come alive in the soft glow, creating an inviting yet ominous atmosphere."
          ],
          "sounds": [
            "The tick of a mantel clock punctuates the silence, each tick echoing like a heartbeat.",
            "Distant voices from below stairs rise and fall, their conversations laced with tension."
          ],
          "smells": [
            "The warm scent of candle wax mingles with the faint odor of tobacco from the drawing room.",
            "A hint of cold fireplace ash lingers in the air, a reminder of the warmth that once filled the space."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, with its towering shelves and rich collection of tomes, feels like a sanctuary of knowledge, yet it is also a place ripe with secrets. Each book holds a story, but today, one story is more important than the rest, as the tension in the air thickens with every passing minute. The room is dimly lit, shadows playing tricks on the mind, creating an unsettling ambiance that is both inviting and foreboding. As the storm rages outside, the library stands as a bastion of hidden truths, waiting to be unearthed.",
        "In the center of the room, the oak table, once a gathering place for intellectual discourse, is now a cluttered mess of papers and half-formed thoughts. The silence is deafening, broken only by the occasional creak of the house settling, as if it too is aware of the weight of the secrets it harbors. The air is thick with the smell of old leather and dampness, a reminder of the storm outside, creating a palpable sense of urgency as the investigation unfolds."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is adorned with plush armchairs and a grand piano, its polished surface reflecting the soft light of the fireplace. Rich tapestries hang from the walls, depicting scenes of pastoral beauty, but the atmosphere feels heavy with unspoken tension.",
      "sensoryDetails": {
        "sights": [
          "The flickering flames of the fireplace cast dancing shadows across the room, illuminating the intricate patterns of the tapestries.",
          "A crystal chandelier hangs from the ceiling, its prisms catching the light and sending sparkles across the walls."
        ],
        "sounds": [
          "The crackling of the fire is a comforting sound, yet it is undercut by the distant murmurs of conversations tinged with suspicion.",
          "Occasionally, the sound of a piano key being struck echoes in the stillness, a melancholic reminder of better times."
        ],
        "smells": [
          "The scent of polished wood and burning logs fills the air, creating a warm and inviting environment.",
          "A hint of lavender from a vase of fresh flowers adds a delicate touch, masking the underlying tension."
        ],
        "tactile": [
          "The soft fabric of the armchairs invites one to sink in, yet the weight of the atmosphere makes it hard to relax.",
          "The warmth of the fire radiates against the skin, contrasting with the chill in the air that seeps through the windows."
        ]
      },
      "accessControl": "The drawing room is accessible to family and invited guests only; staff are instructed to remain outside unless summoned.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "The rain creates a soothing backdrop, with droplets racing down the glass windows, obscuring the view of the garden.",
            "The room is dimly lit, the natural light muted by the overcast sky."
          ],
          "sounds": [
            "The gentle patter of rain against the windows creates a rhythmic sound that is both calming and melancholic.",
            "Occasional gusts of wind rustle the curtains, adding a layer of movement to the stillness."
          ],
          "smells": [
            "The earthy scent of wet soil drifts in through the slightly open window, mingling with the aroma of burning logs.",
            "A faint hint of mildew from the damp weather adds to the overall sense of unease."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is filled with a flat, grey light that drains the color from the tapestries, making them appear dull and lifeless.",
            "Shadows loom larger, creating a sense of foreboding as the afternoon drags on."
          ],
          "sounds": [
            "Silence hangs heavily, broken only by the ticking of a clock, each tick echoing like a countdown.",
            "The distant sound of footsteps in the hallway adds a layer of tension, indicating the arrival of guests."
          ],
          "smells": [
            "The scent of woodsmoke from the fireplace mingles with the stale air, creating an atmosphere of neglect.",
            "A hint of dust wafts through the air, a reminder of the untouched corners of the room."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers across the room, casting a warm glow that softens the harsh lines of the furniture.",
            "The evening sky outside is a deep blue, a stark contrast to the warm colors of the drawing room."
          ],
          "sounds": [
            "The gentle murmur of conversation fills the air, but it is laced with tension and hidden meanings.",
            "The sound of ice clinking in glasses punctuates the evening, a reminder of the social gatherings that mask deeper issues."
          ],
          "smells": [
            "The scent of candle wax mingles with the aroma of rich red wine, creating an intoxicating atmosphere.",
            "A whiff of tobacco smoke lingers in the air, a reminder of the secrets shared in hushed tones."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room, with its inviting yet somber atmosphere, serves as a gathering place for the family and their guests, yet it feels more like a stage for a play steeped in intrigue. Plush armchairs beckon, but the weight of the unspoken words hangs heavy in the air, creating a palpable tension that is almost suffocating. The soft glow of the fireplace dances across the walls, casting flickering shadows that seem to whisper secrets of their own, as if the room itself is a witness to the unfolding drama.",
        "As conversations swirl, the air is thick with the scent of polished wood and burning logs, offering a momentary comfort that is quickly overshadowed by the unease of the situation. The sound of a piano being played softly in the corner adds a layer of melancholy, a stark contrast to the tension that crackles in the air. Outside, the rain continues to fall, a steady reminder of the storm brewing both within the manor and in the world beyond."
      ]
    },
    {
      "id": "servants_quarters",
      "name": "Servants' Quarters",
      "type": "interior",
      "purpose": "Restricted access area",
      "visualDetails": "The servants' quarters are modest and functional, with small rooms furnished with the bare essentials. A communal area features a worn table and chairs, where staff gather for meals, the walls adorned with simple decor reflecting their lives of service.",
      "sensoryDetails": {
        "sights": [
          "The dimly lit corridor is lined with closed doors, each one a reminder of the lives led behind them, painted a drab grey that speaks to the utilitarian nature of the space.",
          "A flickering gas lamp hangs from the ceiling, casting uneven light and creating an atmosphere of quietude and secrecy."
        ],
        "sounds": [
          "The low murmur of voices can be heard from the communal area, punctuated by the clattering of dishes as the staff prepare their evening meal.",
          "Occasionally, the creak of floorboards signals the movement of a staff member, their footsteps muffled by the worn carpet."
        ],
        "smells": [
          "The scent of boiled potatoes and cabbage wafts through the air, a stark contrast to the rich aromas of the drawing room.",
          "A hint of dampness lingers, as the walls are prone to moisture, adding to the overall sense of neglect."
        ],
        "tactile": [
          "The rough texture of the wooden table feels worn from years of use, its surface scratched and marked by countless meals shared.",
          "The air is cooler here, a stark contrast to the warmth of the drawing room, carrying a sense of confinement."
        ]
      },
      "accessControl": "Access is restricted to household staff only, with family members rarely entering this part of the house, creating a divide between classes.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain drips from the roof, pooling in muddy patches outside the small windows, casting a gloomy shadow across the room.",
            "The dim light struggles to penetrate the murkiness, creating a sense of confinement."
          ],
          "sounds": [
            "The sound of rain pattering against the roof creates a rhythmic backdrop to the quiet conversations within.",
            "Occasional laughter breaks the silence, a reminder of camaraderie amidst the dreariness."
          ],
          "smells": [
            "The scent of wet earth mixes with the aroma of simple fare being prepared in the kitchen, creating an earthy aroma.",
            "A faint hint of mildew clings to the air, a reminder of the dampness that permeates the space."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is filled with a grey light that seeps in through the small windows, casting long shadows across the floor.",
            "The simple furnishings seem to absorb the light, creating an atmosphere of dullness and fatigue."
          ],
          "sounds": [
            "The sound of dishes being washed and clattering silverware fills the air, a reminder of the constant work that goes on.",
            "The distant sound of the clock ticking in the hallway adds a sense of urgency to the mundane tasks at hand."
          ],
          "smells": [
            "The aroma of boiled vegetables and stale bread fills the air, creating a stark contrast to the lavish meals served to the family.",
            "A hint of sweat lingers, a reminder of the hard work and effort put into maintaining the estate."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of a single lamp illuminates the communal table, creating a cozy atmosphere despite the stark surroundings.",
            "The shadows cast by the lamp dance on the walls, creating an illusion of warmth in the otherwise austere space."
          ],
          "sounds": [
            "The sound of laughter and shared stories fills the air, a brief respite from the tension of the manor above.",
            "The rustle of aprons and the clinking of glasses punctuate the camaraderie shared among the staff."
          ],
          "smells": [
            "The scent of freshly baked bread wafts through the air, momentarily masking the more unpleasant odors.",
            "A hint of perfume lingers from the staff, a small luxury in their otherwise modest lives."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The servants' quarters are a world apart from the opulence of the drawing room, filled with the echoes of hard work and unfulfilled dreams. Each small room is furnished with just the essentials, a stark reminder of the class divide that permeates the estate. The communal area, with its worn table and mismatched chairs, serves as a gathering place for the staff, where they share meals and tales of their days, their laughter a fleeting moment of joy in an otherwise monotonous existence. The air is thick with the scent of simple fare, a reminder of the disparity between their lives and the lavish meals enjoyed by the family.",
        "As the evening approaches, the atmosphere shifts, the camaraderie among the staff giving way to the tension that simmers just below the surface. The flickering light from a single lamp creates an almost theatrical ambiance, casting shadows that dance along the walls, amplifying the sense of confinement. Outside, the clear sky contrasts sharply with the heavy burden of secrets held within these walls, as the staff prepares for the evening's duties, unaware of the storm that is about to break within the manor."
      ]
    }
  ],
  "note": "",
  "cost": 0.0027489511499999997,
  "durationMs": 54472
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1937,
    "month": "June",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "Overcast with intermittent rain showers",
      "Mild temperatures around 18-20°C",
      "Occasional sunny spells breaking through the clouds"
    ],
    "daylight": "Long summer days with daylight extending until nearly ten o'clock at night",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when the estate is shrouded in twilight",
    "holidays": [
      "Midsummer's Day (June 24)"
    ],
    "seasonalActivities": [
      "Garden parties and afternoon teas",
      "Country fairs showcasing local crafts",
      "Evening strolls in the estate gardens"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Three-piece suits in light grey or beige",
        "Bow ties or cravats for formal occasions",
        "Dress shoes polished to a high shine"
      ],
      "casual": [
        "Tweed jackets with elbow patches",
        "Cotton shirts with short sleeves",
        "Lightweight trousers in pastel shades"
      ],
      "accessories": [
        "Pocket watches with fob chains",
        "Homburg hats",
        "Leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "Tea dresses in floral patterns with cinched waists",
        "Wide-brimmed hats adorned with ribbons",
        "Silk gloves reaching the elbow"
      ],
      "casual": [
        "Cotton blouses with Peter Pan collars",
        "Pleated skirts in light fabrics",
        "Comfortable espadrilles or flat shoes"
      ],
      "accessories": [
        "Beaded handbags",
        "Pearl necklaces",
        "Brooches in floral designs"
      ]
    },
    "trendsOfTheMoment": [
      "The rise of Art Deco influences in design",
      "Interest in surrealism in art and literature",
      "Casual outdoor wear gaining popularity"
    ],
    "socialExpectations": [
      "Men expected to wear hats outdoors",
      "Women encouraged to dress modestly yet stylishly",
      "Social gatherings emphasize class distinctions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Spanish Civil War continues to escalate, influencing political sentiments",
      "The British government debates rearmament in light of rising fascism",
      "Concerns grow over the Munich Agreement and the fate of Czechoslovakia"
    ],
    "politicalClimate": "Tensions are high due to the threat of fascism in Europe, leading to increased scrutiny of political alliances and military preparedness",
    "economicConditions": "Despite slow recovery from the Great Depression, unemployment remains a significant issue, particularly among the working class",
    "socialIssues": [
      "Rising class tensions as the wealthy face criticism for their privilege",
      "Women's rights movements gaining momentum",
      "Increased youth activism in response to economic disparities"
    ],
    "internationalNews": [
      "The League of Nations struggles to maintain peace",
      "Reports of Nazi Germany's military expansion stir fears across Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "The Andrew Sisters with their harmonious vocals",
        "Bing Crosby's smooth crooning",
        "Big band music becoming increasingly popular"
      ],
      "films": [
        "The Great Ziegfeld",
        "A Star is Born",
        "Shall We Dance"
      ],
      "theater": [
        "The Royal Variety Performance showcasing talent",
        "Oklahoma! making waves in musical theater"
      ],
      "radio": [
        "BBC Radio's evening broadcasts of classical music",
        "Popular serialized dramas capturing audiences' imaginations",
        "News bulletins covering political developments"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Hobbit by J.R.R. Tolkien",
        "Of Mice and Men by John Steinbeck",
        "Brave New World by Aldous Huxley"
      ],
      "popularGenres": [
        "Social realism reflecting class struggles",
        "Mystery and detective fiction gaining traction",
        "Romantic novels appealing to escapism"
      ]
    },
    "technology": {
      "recentInventions": [
        "The first jet engine being developed",
        "Advancements in radio technology improving communication",
        "The rise of the automobile industry changing travel"
      ],
      "commonDevices": [
        "Early model radios in homes",
        "Typewriters in offices for correspondence",
        "Telephones becoming more prevalent in upper-middle-class households"
      ],
      "emergingTrends": [
        "Increased interest in aviation and air travel",
        "Focus on home entertainment technologies",
        "The popularization of consumer goods"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "Garden parties and picnics during warm evenings",
        "Attending community fairs and events",
        "Socializing at local pubs or tea rooms"
      ],
      "socialRituals": [
        "Sunday family dinners as a tradition",
        "Afternoon tea served at 4 PM",
        "Seasonal festivals celebrating local produce"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Class distinctions are rigidly observed",
      "Wealthy individuals are viewed with suspicion by the struggling lower classes"
    ],
    "gender": [
      "Traditional gender roles persist, with men as breadwinners and women focusing on domestic roles",
      "Emerging movements advocating for women's rights begin to challenge norms"
    ],
    "race": [
      "Racial tensions simmer, influenced by global political movements",
      "Colonial attitudes reflect the dominance of white British culture"
    ],
    "generalNorms": [
      "Politeness and decorum are highly valued in social interactions",
      "Public displays of affection are generally frowned upon",
      "Conformity to fashion and etiquette is expected"
    ]
  },
  "atmosphericDetails": [
    "The scent of fresh rain mingles with the blooming roses of the estate's gardens, creating an intoxicating aromatic backdrop.",
    "The sound of distant thunder rumbles as guests gather under the large marquee for an evening of outdoor entertainment.",
    "The flickering glow of lanterns casts shadows among the hedges, as whispers of secrets and conspiracies fill the air."
  ],
  "paragraphs": [
    "On a damp June evening in 1937, the English countryside is cloaked in a shroud of overcast skies, with occasional rain showers drumming softly against the rich green foliage. The estate, a sprawling country house adorned with ivy, hums with the energy of Midsummer gatherings, where the upper classes converge, leaving behind the struggles of the working world. As daylight lingers until nearly ten, the tension in the air is palpable, hinting at the underlying class struggles that define this era. The distant echoes of laughter mingle with whispers of discontent, a reminder of the societal unrest brewing just beneath the surface.",
    "Fashion flourishes in this summer of 1937, where men don three-piece suits in light shades, their polished shoes glinting under the soft glow of lanterns. Women arrive in elegant tea dresses adorned with floral patterns, their wide-brimmed hats casting playful shadows across their faces. Accessories such as pearl necklaces and pocket watches in fob chains complete their outfits, reflecting the emphasis on personal style and class distinction. It is a period where charm and sophistication thrive, yet a sense of foreboding lingers, as the world watches the rise of fascism and the shadows it casts on their lives.",
    "Daily life continues within the estate's walls and beyond, where garden parties and community fairs provide a brief respite from the looming economic uncertainties. The aroma of freshly baked bread wafts through the kitchens, where staff prepare for the evening's entertainment, while the chatter of guests discussing the latest news fills the drawing room. Social rituals, such as afternoon tea and Sunday family dinners, reinforce the importance of tradition and decorum, yet the conversations often drift to the political climate and the growing unrest in Europe. Class distinctions remain firmly entrenched, yet the whispers of change can be heard, carried like a breeze through the open windows."
  ],
  "note": "",
  "cost": 0.0011288309999999998,
  "durationMs": 16331
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A wealthy family gathers at their isolated estate for a contentious will reading, where the pressures of the Great Depression and rising class tensions ignite old rivalries and hidden resentments.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The affluent face scrutiny and resentment from the struggling lower classes, while fascist sentiments rise in Europe, creating an atmosphere of unease and distrust."
  },
  "setting": {
    "location": "A sprawling manor house with formal gardens, servant quarters, and a grand entrance hall.",
    "institution": "country house estate",
    "weather": "Overcast with occasional rain, typical of the English countryside in autumn."
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
    "value": "a quarter past ten",
    "description": "The exact time shown on the stopped clock face"
  },
  {
    "id": "tamper_amount",
    "value": "thirty minutes",
    "description": "The exact amount the clock was wound back"
  },
  {
    "id": "witness_count",
    "value": "three",
    "description": "The number of witnesses who heard the clock chime incorrectly"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock in the study shows a faint scratch on its casing.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Evidence of tampering with the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "testimonial",
      "description": "Witnesses claim Eleanor was last seen alive at eight o'clock.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Contradicts the clock's stopping time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at the pub from seven to nine.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Corroborates his alibi, ruling him out as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock shows a time of seven-thirty, which is inconsistent with witness accounts.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "Indicates possible tampering with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_2",
      "category": "testimonial",
      "description": "A missing spring component was found near the crime scene.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Suggests that the clock was sabotaged.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "This contradicts the clock's stopping time, suggesting tampering.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Reinforces the idea that the clock was manipulated.",
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
      "id": "clue_late_optional_slot_1",
      "category": "behavioral",
      "description": "Dr. Mallory Finch expressed jealousy over Eleanor's potential marriage.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "Suggests a motive for the murder.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "category": "temporal",
      "description": "The clock in the study shows a faint scratch on its casing.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The scratch indicates it was tampered with recently.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Eleanor was known to have a history of fainting spells, which could explain her sudden collapse.",
      "supportsAssumption": "Eleanor must have died around the time the clock stopped.",
      "misdirection": "This misleads by suggesting her death was due to health issues rather than foul play."
    },
    {
      "id": "rh_2",
      "description": "Witnesses reported hearing a loud argument in the vicinity just before Eleanor was found.",
      "supportsAssumption": "Eleanor must have died around the time the clock stopped.",
      "misdirection": "This implies that the argument was the cause of her death, diverting attention from the around's eleanor."
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
      "clue_fp_contradiction_step_1"
    ],
    "mid": [
      "clue_core_elimination_chain",
      "clue_1",
      "clue_2",
      "clue_3",
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
  "latencyMs": 13592,
  "cost": 0.0028004393999999998
}

---

## OUTPUT INSTRUCTIONS

Produce a single JSON object with ALL of the following fields.

Return the JSON object directly — no preamble, no markdown fences, no commentary.

MANDATORY FIELD LENGTHS:
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
- storyEmotionalArc.arcDescription: MINIMUM 300 words, target 350 words. This is an emotional map
  of the full story journey — not a one-paragraph summary. It must trace the emotional register from
  opening chapter through rising tension to climax and resolution. Multiple paragraphs expected.
  A response shorter than 300 words will fail the quality gate. Count your words.
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
