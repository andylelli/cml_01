# Actual Prompt Record

- Run ID: `mystery-1779316781164`
- Project ID: ``
- Timestamp: `2026-05-20T22:42:32.595Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `cd41463b9ce1d0c0`

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
      "institution": "manor house"
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
      "role_archetype": "wealthy hostess",
      "relationships": [
        "sister to Beatrice Quill"
      ],
      "public_persona": "Charming and sophisticated",
      "private_secret": "Financial struggles due to the Great Depression",
      "motive_seed": "Desire for financial security",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "access to the clock",
        "knowledge of schedules"
      ],
      "behavioral_tells": [
        "frequent glances at the clock"
      ],
      "stakes": "Family legacy and financial stability",
      "evidence_sensitivity": [
        "key found in possession"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "medical expert",
      "relationships": [
        "friend of Eleanor Voss"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Has a gambling issue",
      "motive_seed": "Need for money to pay debts",
      "motive_strength": "moderate",
      "alibi_window": "between 9:00 PM and 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "physician's access to the victim"
      ],
      "behavioral_tells": [
        "nervousness around financial topics"
      ],
      "stakes": "Reputation and financial stability",
      "evidence_sensitivity": [
        "alibi unverified"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "military man",
      "relationships": [
        "ex-lover of Eleanor Voss"
      ],
      "public_persona": "Brave and honorable",
      "private_secret": "Bitter about their past relationship",
      "motive_seed": "Desire for revenge",
      "motive_strength": "weak",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "frequent visits to the manor"
      ],
      "behavioral_tells": [
        "displays of jealousy"
      ],
      "stakes": "Emotional closure",
      "evidence_sensitivity": [
        "no solid alibi"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "detective",
      "relationships": [
        "sister to Eleanor Voss"
      ],
      "public_persona": "Intelligent and observant",
      "private_secret": "Struggles with self-doubt",
      "motive_seed": "Desire to prove herself",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "access to the entire manor"
      ],
      "behavioral_tells": [
        "sharp focus on details"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [
        "none"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Eleanor Voss"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a family gathering at the Voss manor, a mechanical clock is found tampered with, leading to a murder mystery that forces the guests to confront their pasts and hidden motives."
    },
    "accepted_facts": [
      "A clock was tampered with to mislead the timeline of events."
    ],
    "inferred_conclusions": [
      "Eleanor Voss is the culprit."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was intentionally wound back to mislead the timeline of events.",
      "delivery_path": [
        {
          "step": "Eleanor Voss accessed the clock to alter the time."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is misrepresented, misleading the investigation."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss could not have committed the murder because she was busy entertaining guests.",
    "type": "temporal",
    "why_it_seems_reasonable": "Guests confirm she was present, and the clock appeared to show accurate time.",
    "what_it_hides": "The tampered clock misled everyone about her actual whereabouts."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "9:00 PM",
        "10:00 PM"
      ],
      "windows": [
        "9:00 PM to 10:00 PM"
      ],
      "contradictions": [
        "Witnesses claim they heard the clock strike ten, but the time was altered."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "the clock"
      ],
      "permissions": [
        "Eleanor had access to the clock in the study."
      ]
    },
    "physical": {
      "laws": [
        "A mechanical clock can only show one time at a moment."
      ],
      "traces": [
        "Scratches on the clock face indicate tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust each other's alibis."
      ],
      "authority_sources": [
        "Eleanor is seen as the hostess, giving her authority over the household."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows a time of twenty minutes past nine.",
        "correction": "This contradicts guest testimonies that they heard the clock strike ten.",
        "effect": "Narrows the window of opportunity for Eleanor Voss.",
        "required_evidence": [
          "The clock's current time reading.",
          "Witness statements about the clock striking ten."
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint scratch on the clock face indicates recent adjustment.",
        "correction": "The scratches suggest tampering occurred just before the murder.",
        "effect": "Eliminates Captain Ivor Hale, who was not seen near the clock.",
        "required_evidence": [
          "Physical examination of the clock face.",
          "Testimony from guests who observed Captain Hale's whereabouts."
        ],
        "reader_observable": true
      },
      {
        "observation": "Eleanor Voss had the clock's key in her possession.",
        "correction": "This access allowed her to tamper with the clock and mislead others.",
        "effect": "Eliminates Dr. Mallory Finch, who does not have access to the clock.",
        "required_evidence": [
          "Discovery of the key in Eleanor's handbag.",
          "Record of Dr. Mallory Finch's movements during the event."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, study, and twenty against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are clock, tamper, and study.",
    "pass_condition": "Eleanor fails to provide a consistent timeline.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_8"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock time reading (early) and witness statements (mid) provide a foundation for Eleanor's opportunity. Step 2: The scratch evidence (mid) indicates tampering, allowing the reader to narrow suspects. Step 3: The key in Eleanor's possession (discriminating test) confirms her culpability."
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
        "Observe Eleanor's reaction",
        "Draw conclusion about her guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Testimony and evidence not aligning with the clock tampering.",
        "supporting_clues": [
          "clue_2",
          "clue_3"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verification during the time of tampering.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence gathered."
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
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Discussion with witnesses"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Discovery of the key"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_eleanor_voss",
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
    "summary": "Eleanor Voss, a charming socialite, is a master of the art of appearances, hosting extravagant parties that mask her mounting financial troubles.",
    "publicPersona": "Eleanor is the epitome of grace and charm, effortlessly mingling with the upper crust of Little Middleton. Her soirées are legendary, filled with laughter and the clinking of fine china, where she showcases her impeccable taste and vast connections. Yet behind this façade lies a pressing urgency to secure a wealthy marriage, driven by the fear of financial ruin and social disgrace.",
    "privateSecret": "Eleanor is deeply in debt, a precarious situation that threatens to unravel her carefully constructed social standing. The thought of losing her status terrifies her, making her desperate to maintain the illusion of wealth and success.",
    "motiveSeed": "Her desperation to marry well intensifies as she fears that the victim, who has become privy to her financial misadventures, would expose her secrets to potential suitors.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor was seen conversing with guests around the garden from eight to nine, employing her charm to distract from her inner turmoil.",
    "accessPlausibility": "easy",
    "stakes": "The stakes for Eleanor are monumental: her social status and marriage prospects hang by a thread, with the potential for either rise or fall looming over her like a dark cloud.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a refined eloquence, punctuated by the occasional sharp wit. Her laughter is melodic, yet her words can slice through the air with a pointed edge when she feels threatened or cornered.",
    "internalConflict": "Eleanor grapples with the fear of losing her social standing and the lengths she is willing to go to preserve it. This internal struggle manifests as a constant battle between her ambition and her moral compass.",
    "personalStakeInCase": "This crime matters to Eleanor because it directly threatens her carefully curated life; the outcome could mean the difference between maintaining her status or facing utter ruin.",
    "paragraphs": [
      "Eleanor Voss stood in her garden, the soft glow of lanterns illuminating her striking features as she effortlessly engaged her guests. Each laugh and smile was a carefully crafted performance, a mask she donned to conceal the gnawing anxiety that threatened to consume her. In the world of Little Middleton, she was the queen of social gatherings, yet beneath this regal exterior lay a woman on the brink of financial collapse. Her extravagant parties, once a symbol of her success, had become a desperate attempt to attract a wealthy suitor and secure her future.",
      "As she chatted with a particularly wealthy bachelor, her mind raced. The specter of the victim loomed large, a constant reminder of her precarious position. If he were to reveal her financial secrets, it would shatter her carefully constructed world. She had worked too hard to climb the social ladder, and the thought of falling from grace was unbearable. In her heart, a fierce determination ignited; she would do whatever it took to protect her reputation, even if it meant crossing moral lines she had once held sacred.",
      "Eleanor's alibi was solid; she had been seen conversing with guests during the critical hour. Yet, as she recalled the conversations that had transpired, a chill ran down her spine. The victim had been on the verge of exposing her, and now, with the stakes higher than ever, Eleanor found herself at a crossroads. Would she succumb to desperation or rise to the occasion? The answer lay in how she navigated the treacherous waters of Little Middleton's society, where one misstep could lead to her downfall.",
      "The clock ticked ominously in the background, a reminder of the time slipping away. Eleanor's heart raced as she considered her options. She could either play the game with cunning and grace or risk losing everything she had fought so hard to achieve. The pressure was mounting, and as the whispers of suspicion began to swirl around her, she knew that the clockwork conspiracy was just beginning."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a well-respected physician, is grappling with the consequences of her past mistakes, as the threat of exposure looms over her career.",
    "publicPersona": "Known for her community service and dedication to her patients, Dr. Finch is a figure of trust and respect in Little Middleton. Her gentle demeanor and sharp intellect have earned her the admiration of many, and she prides herself on being a pillar of the community.",
    "privateSecret": "Behind the façade of competence, Dr. Finch has been misdiagnosing patients to cover a grave medical error that could devastate her career. This secret weighs heavily on her conscience, creating a chasm between her public persona and her true self.",
    "motiveSeed": "The victim had uncovered her malpractice and threatened to report her, putting her entire practice at risk. The thought of losing everything she had worked for drives her to desperate measures.",
    "motiveStrength": "moderate",
    "alibiWindow": "During the crucial time, Dr. Finch was in her study, reviewing medical records from seven to nine, a seemingly innocuous task that now feels laden with tension.",
    "accessPlausibility": "possible",
    "stakes": "For Dr. Finch, the stakes are high; her career and the reputation she has built over the years are on the line, and the fear of exposure looms like a dark cloud over her head.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Dr. Finch speaks with a calm authority, her words carefully chosen and punctuated with a hint of dry humor. She often employs medical metaphors to illustrate her points, and her speech is marked by a steady rhythm, reflecting her composed demeanor.",
    "internalConflict": "Dr. Finch is torn between her professional integrity and the overwhelming fear of losing her career. She grapples with guilt over her past mistakes and the lengths she might go to protect her reputation.",
    "personalStakeInCase": "This crime matters to Dr. Finch because it threatens not only her career but also her identity as a healer; exposing her malpractice would shatter the trust she has built with her patients.",
    "paragraphs": [
      "Dr. Mallory Finch sat in her study, surrounded by a mountain of medical records, her brow furrowed in concentration. The soft glow of the lamp illuminated her features, but the shadows cast by her secrets loomed larger than the light. She had spent years building a reputation as a dedicated physician, yet the weight of her misdiagnoses threatened to collapse her world. The victim's discovery of her error was a ticking time bomb, and she had to act quickly to defuse it before it exploded in her face.",
      "As she reviewed the records, her mind drifted to the conversations she had had with the victim. The threats, veiled yet unmistakable, echoed in her ears. Dr. Finch had always prided herself on her ethical standards, but now she found herself at a crossroads, where the line between right and wrong blurred in the face of self-preservation. The very thought of losing her practice sent shivers down her spine; it was more than just a job—it was her identity.",
      "Her alibi was weak but plausible; she had been in her study, but the hours spent there felt like an eternity of anxiety. The walls closed in as she considered the implications of her choices. Would she continue to deceive those who trusted her, or would she confront the truth and risk everything? The stakes were higher than she'd ever imagined, and the pressure was mounting with every passing moment.",
      "Dr. Finch knew that the clock was ticking. The victim's threat loomed over her like a dark cloud, and she could feel the weight of her choices pressing down on her. In this quiet room filled with the echoes of her past, she faced a moral dilemma that would determine her future. Would she find the courage to confront her mistakes, or would she succumb to the fear that threatened to consume her?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a decorated war hero, struggles with the demons of his past while facing the threat of exposure and disgrace.",
    "publicPersona": "Respected and aloof, Captain Hale is often the center of attention at social gatherings, recounting tales of valor from his military service. His distinguished demeanor commands respect, yet there is an air of melancholy that surrounds him.",
    "privateSecret": "Haunted by PTSD, Captain Hale feels increasingly alienated from society. The burden of his past weighs heavily on him, creating a chasm between who he is and how he presents himself to the world.",
    "motiveSeed": "The victim was planning to reveal information about Captain Hale's past that could tarnish his reputation and legacy, a threat that has pushed him to the brink.",
    "motiveStrength": "strong",
    "alibiWindow": "He was in the library reading from six until nine, a solitary pursuit that provided no witness to his actions during the critical time.",
    "accessPlausibility": "unlikely",
    "stakes": "For Captain Hale, the stakes are monumental; his honor and legacy hang in the balance, and the thought of being exposed terrifies him.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Hale speaks with a commanding presence, his words deliberate and often laced with blunt honesty. He has a tendency to use military jargon, and his sentences are structured with precision, reflecting his disciplined nature.",
    "internalConflict": "Captain Hale grapples with feelings of shame and isolation as he confronts the possibility of his past being revealed. This internal struggle manifests as a battle between his desire for redemption and the fear of facing the truth.",
    "personalStakeInCase": "This crime matters to Captain Hale because it threatens to expose his past mistakes and compromise the honor he has fought to uphold throughout his life.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the library wall, the scent of aged books enveloping him like a shroud. As he read, the words blurred into a haze, his mind drifting to the specter of the victim, who threatened to unravel the carefully constructed life he had built since the war. Once a decorated hero, Hale now found himself grappling with the haunting memories of his past, each one a reminder of the darkness he carried within. His reputation was all he had left, and the thought of it being tarnished sent him spiraling into despair.",
      "As he recounted his tales of valor to the guests, a sense of disconnection gnawed at him. The laughter and admiration felt distant, as if he were watching from behind a glass wall. The victim's threat loomed large, a shadow that threatened to eclipse the honor he had fought so hard to maintain. Hale's alibi was solid, but the solitude of his reading hours left him vulnerable, and the weight of his past pressed down on him with relentless force.",
      "The stakes were high; his honor and legacy were on the line. The thought of exposure filled him with dread, and he felt the walls closing in. Would he continue to live in the shadows of his past, or would he confront the truth that lay hidden beneath the surface? The battle raged within him, a struggle between the man he had been and the man he aspired to be.",
      "In the quiet of the library, as the clock ticked away the seconds, Captain Hale faced a choice that could alter the course of his life. Would he find redemption in confronting his demons, or would he succumb to the isolation that had become his constant companion? The answer lay within him, buried beneath layers of guilt and shame, waiting to be unearthed."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an overlooked maid, possesses a keen eye for detail and a wealth of secrets that could shift the balance of power in Little Middleton.",
    "publicPersona": "As a quiet and attentive maid, Beatrice often goes unnoticed by the guests of Little Middleton. She performs her duties with diligence, her presence a mere whisper in the lavish world of the elite.",
    "privateSecret": "Beneath her unassuming exterior, Beatrice has been secretly observing the household dynamics, gathering information and insights that could prove invaluable. She knows more than she lets on, harboring a wealth of secrets that could disrupt the status quo.",
    "motiveSeed": "Her resentment towards the victim, who often treated her with disdain and condescension, simmers beneath the surface, fueling her desire for justice.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice was seen cleaning the upper floors from eight until ten, a task that provided her with a vantage point to observe the unfolding drama.",
    "accessPlausibility": "easy",
    "stakes": "For Beatrice, the stakes revolve around her job security and dignity; exposing the truth could either elevate her standing or further entrench her in the shadows.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Beatrice speaks softly, often using modest language that reflects her position. She has a tendency to downplay her observations, using humor to deflect attention from her intelligence and insights.",
    "internalConflict": "Beatrice wrestles with feelings of invisibility and the desire to assert herself in a world that often overlooks her. This internal conflict creates tension between her longing for recognition and her fear of stepping into the light.",
    "personalStakeInCase": "This crime matters to Beatrice because it presents an opportunity to reclaim her dignity and assert her presence in a world that has marginalized her; the outcome could redefine her place in the household.",
    "paragraphs": [
      "Beatrice Quill moved silently through the grand halls of the estate, her footsteps barely a whisper against the polished floors. As a maid, she was accustomed to being overlooked, her presence often treated as an afterthought by the guests who filled the lavish rooms. Yet, beneath her quiet exterior lay a keen observer, one who had witnessed the intricate dynamics of the household and the secrets that lingered in the shadows. She had seen things, heard things, and now, she held the keys to unlock a truth that could shift the balance of power in Little Middleton.",
      "The victim's condescending remarks had stung deeply, igniting a simmering resentment within her. Beatrice had always been aware of her place in the social hierarchy, yet the disdain she faced had fueled a quiet rebellion. As she cleaned the upper floors from eight until ten, she had a front-row seat to the unfolding drama, her sharp eyes taking in every detail. The alibi she presented was solid, but the knowledge she possessed was far more potent than any excuse.",
      "With each passing day, Beatrice felt the weight of her invisibility pressing down on her. She longed to assert herself, to step out of the shadows and claim her rightful place in the household. The stakes were high; exposing the truth could elevate her standing or further entrench her in the background. Would she find the courage to share what she knew, or would she remain the silent witness, forever relegated to the periphery of the grand narrative?",
      "As the clock ticked on, Beatrice faced a choice that could redefine her life. Would she continue to play the role of the invisible maid, or would she seize the opportunity to reclaim her dignity and assert her presence? The answer lay within her, waiting to be discovered amidst the whispers of the past and the echoes of her own desires."
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
    "type": "manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "An imposing country manor house, steeped in tradition and social hierarchy, where secrets linger in the shadows of its grand halls.",
    "visualDescription": "The manor rises majestically, its grey stone façade softened by climbing ivy and ornate gables. Tall windows reflect the overcast sky, while the sprawling gardens are meticulously trimmed, hinting at the wealth within.",
    "atmosphere": "A suffocating air of tension hangs over the manor, where every creak of the floorboards echoes with unspoken words and hidden agendas.",
    "paragraphs": [
      "Little Middleton Manor stands as a testament to the affluence of a bygone era, its stone walls weathered yet dignified, shrouded in the whispers of history. The sprawling estate, surrounded by ancient oaks and manicured hedges, feels both inviting and ominous, a place where the past collides with the present. As one approaches the grand entryway, the heavy oak doors stand resolute, guarding the secrets of its inhabitants. Inside, the air is thick with the scent of beeswax polish and the faint chill of dampness, a reminder of the relentless English rain outside.",
      "Within the manor's labyrinthine corridors, shadows dance in the flickering light of gas lamps, casting eerie shapes on the dark oak paneling. Each room, from the opulent drawing room adorned with family portraits to the austere library filled with leather-bound tomes, tells a story of privilege and power. Yet, beneath the lavish decor lies a palpable tension, as the echoes of class disparity resonate within these walls. The household staff move quietly, aware of their place in this social hierarchy, while the family navigates their own intricate web of expectations and secrets.",
      "As the hours pass, the atmosphere thickens with anticipation. The ticking of the grand clock in the hall becomes a constant reminder of time slipping away, each chime resonating with unresolved mysteries. Outside, the gardens, once a place of solace, now feel like a prison, their beauty overshadowed by the looming clouds and the threat of rain. The sound of distant thunder rumbles, mirroring the growing unease among the manor's residents, each one harboring their own fears and suspicions.",
      "In this world of privilege and pretense, the stage is set for betrayal and revelation. The manor, with its hidden nooks and crannies, becomes a character in its own right, holding the key to the unfolding drama. As the rain begins to fall, blurring the boundaries between the inside and outside, the tension mounts, and the clock ticks ever closer to the moment when the truth will be revealed."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical for a rural English summer.",
    "timeFlow": "Three days of mounting tension as secrets unravel.",
    "mood": "Tense, with underlying social tensions due to class disparities and recent political developments.",
    "eraMarkers": [
      "Typewriters clacking in the study",
      "Radio crackling with news broadcasts",
      "Gas lamps casting shadows in the drawing room"
    ],
    "sensoryPalette": {
      "dominant": "The sharp, musty scent of old books",
      "secondary": [
        "Damp earth and rain-soaked flowers",
        "The warm glow of candlelight in dark corners"
      ]
    },
    "paragraphs": [
      "The manor breathes history, its very walls steeped in the weight of past generations. Gas lamps flicker with a soft yellow glow, illuminating the dust motes dancing in the air, while the scent of aged leather fills the library, where secrets are bound between the pages of forgotten tomes. Outside, the incessant drizzle blurs the lines of the meticulously kept gardens, creating a somber atmosphere that seeps into the very bones of the estate. The distant rumble of thunder adds to the oppressive mood, as if nature itself is warning of the storm brewing within.",
      "In the drawing room, the warmth of the hearth contrasts sharply with the chill of the rain outside, the crackling fire providing a false sense of security. The heavy curtains, drawn tight, keep the outside world at bay, yet the tension among the guests is palpable, each glance filled with suspicion and unspoken words. The faint sound of a radio broadcasting the latest news offers a reminder of the unrest beyond these walls, while the clatter of a typewriter echoes from the study, a stark reminder of the work that must continue despite the growing unease."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A dimly lit room lined with towering bookshelves, the air thick with the scent of aged paper. A heavy oak table lies at the center, papers strewn across its surface.",
      "sensoryDetails": {
        "sights": [
          "Dust motes in candlelight",
          "Leather-bound books with gilded spines",
          "Faded portraits of stern ancestors"
        ],
        "sounds": [
          "Pages turning in silence",
          "The crackle of a nearby fire",
          "Distant thunder rumbling"
        ],
        "smells": [
          "Musty old books",
          "Beeswax from candles",
          "Damp wood and leather"
        ],
        "tactile": [
          "Worn leather armchair",
          "Cold brass doorknob",
          "Smooth, polished table surface"
        ]
      },
      "accessControl": "Restricted to family members and select guests; staff forbidden entry except for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-soaked window panes",
            "Grey light filtering through clouds",
            "Shadows lengthening across the floor"
          ],
          "sounds": [
            "Steady drumming of rain on the roof",
            "The soft rustle of pages turning",
            "Distant echoes of thunder"
          ],
          "smells": [
            "Damp stone underfoot",
            "Cold earth from the gardens",
            "Hints of mildew in the corners"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat, grey light across the room",
            "Long shadows creeping from the corners",
            "The flicker of candle flames"
          ],
          "sounds": [
            "Silence punctuated by a distant clock",
            "Creaking timbers of the manor",
            "Rustle of a newspaper being read"
          ],
          "smells": [
            "Dust and old paper",
            "Faint woodsmoke from the fireplace",
            "The lingering scent of dampness"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight casting warm glows",
            "Reflections in polished wood",
            "Long shadows stretching across the floor"
          ],
          "sounds": [
            "The tick of a mantel clock",
            "Distant laughter from the drawing room",
            "A soft breeze rustling the curtains"
          ],
          "smells": [
            "Candle wax melting",
            "The faint scent of tobacco",
            "Cold fireplace ash"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary of knowledge, becomes the stage for an unfolding tragedy. As the rain lashes against the windows, the room holds its breath, the air thick with the scent of ancient tomes and the weight of untold secrets. Papers scattered across the oak table hint at a struggle, the flickering candlelight casting ominous shadows that dance along the walls. The only sound is the relentless patter of rain, a haunting backdrop to the mysteries that lie in wait.",
        "In this room, the past collides with the present, as the lineage of the family is etched in the spines of the books that line the shelves. The portraits of ancestors gaze down, their painted eyes seemingly aware of the turmoil that has erupted in their hallowed space. Each creak of the floorboards sends shivers through the air, a reminder that in this manor, nothing is as it seems."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A richly decorated room with dark wood paneling, heavy curtains, and a large mahogany desk cluttered with papers and a typewriter.",
      "sensoryDetails": {
        "sights": [
          "Richly upholstered armchair",
          "Typewriter with ink-stained keys",
          "Stained glass window casting colored light"
        ],
        "sounds": [
          "Typewriter clacking rhythmically",
          "The rustle of papers being shuffled",
          "Quiet ticking of a wall clock"
        ],
        "smells": [
          "Fresh ink and paper",
          "Old wood and varnish",
          "A hint of tobacco smoke"
        ],
        "tactile": [
          "Smooth mahogany desk surface",
          "Soft fabric of the armchair",
          "Cool brass of desk accessories"
        ]
      },
      "accessControl": "Access limited to the head of the household and trusted advisors; staff must knock and request permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streaking the window",
            "Dim light filtering through curtains",
            "Papers slightly curling at the edges"
          ],
          "sounds": [
            "Rain tapping against the glass",
            "The faint sound of a radio in the distance",
            "Occasional creaks of the house settling"
          ],
          "smells": [
            "Dampness in the air",
            "The musty scent of old books",
            "Hints of fresh ink"
          ],
          "mood": "reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Soft shadows playing on the walls",
            "Dust motes illuminated by weak light",
            "The flicker of a candle flame"
          ],
          "sounds": [
            "Silence punctuated by the ticking clock",
            "The rustling of paper",
            "A soft sigh from the armchair"
          ],
          "smells": [
            "Old wood mixed with fresh ink",
            "The faint aroma of tea brewing",
            "Hints of tobacco lingering"
          ],
          "mood": "pensive"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Golden light from the desk lamp",
            "Shadows stretching across the floor",
            "The gleam of polished wood"
          ],
          "sounds": [
            "The typewriter’s steady rhythm",
            "Murmurs of conversation from the hallway",
            "The crackle of a fire in the hearth"
          ],
          "smells": [
            "The rich scent of tobacco",
            "Warmth of the fireplace",
            "A hint of leather from the chair"
          ],
          "mood": "focused determination"
        }
      ],
      "paragraphs": [
        "The study, a refuge for the manor's head, is a world of its own, filled with the scent of polished wood and the sound of a typewriter's steady clatter. Papers are strewn across the desk, each one a fragment of a larger puzzle, waiting to be pieced together. The heavy curtains are drawn, creating an intimate cocoon that feels both comforting and isolating, as if the outside world has been shut away in favor of deeper contemplation.",
        "In the quiet of the study, the atmosphere shifts with each passing hour. The light changes, casting long shadows that dance across the walls, while the ticking clock marks time in a way that feels almost foreboding. Here, the weight of responsibility hangs heavy, and every decision made in this room echoes throughout the manor, shaping the fate of all who dwell within its walls."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "An elegantly furnished room with plush sofas, a grand piano, and tasteful decorations reflecting the family's wealth.",
      "sensoryDetails": {
        "sights": [
          "Crystal chandelier casting a warm glow",
          "Elegant floral arrangements on the mantel",
          "Rich fabrics draping over the furniture"
        ],
        "sounds": [
          "Soft laughter and conversation",
          "The gentle notes of a piano",
          "The crackle of a fire in the hearth"
        ],
        "smells": [
          "Fresh flowers mingling with wood smoke",
          "The scent of polished furniture",
          "A hint of perfume lingering in the air"
        ],
        "tactile": [
          "Soft velvet upholstery",
          "Cool marble of the fireplace",
          "Worn piano keys under fingertips"
        ]
      },
      "accessControl": "Open to family and guests; staff may enter only to serve but not to linger.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickling down window panes",
            "Muted colors of the decor",
            "Shadows cast by heavy curtains"
          ],
          "sounds": [
            "The patter of rain on the roof",
            "Soft murmurs of conversation",
            "The rustle of newspapers being read"
          ],
          "smells": [
            "Dampness in the air",
            "The scent of wet flowers outside",
            "Faint aroma of coffee brewing"
          ],
          "mood": "somber yet cozy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Dim light filtering through curtains",
            "Flickering candle flames",
            "A tapestry depicting a pastoral scene"
          ],
          "sounds": [
            "The low hum of conversation",
            "The creaking of old furniture",
            "The distant sound of rain against the windows"
          ],
          "smells": [
            "The fresh scent of flowers",
            "Hints of woodsmoke from the fireplace",
            "A touch of old leather from books"
          ],
          "mood": "intimate yet tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Soft glow of candlelight",
            "Reflections from the chandelier",
            "Guests mingling in elegant attire"
          ],
          "sounds": [
            "Laughter and clinking of glasses",
            "The soft melody of the piano",
            "The rustle of silk and taffeta"
          ],
          "smells": [
            "Rich aroma of wine",
            "The scent of fresh flowers",
            "A hint of smoke from the fireplace"
          ],
          "mood": "festive yet fraught with tension"
        }
      ],
      "paragraphs": [
        "The drawing room is a space of elegance and refinement, where laughter and conversation blend with the soft notes of the grand piano. Crystal chandeliers cast a warm glow, illuminating the plush sofas and ornate decorations that speak of wealth and status. Yet, beneath the surface of this social gathering lies a current of unease, as glances exchanged between guests hint at deeper secrets waiting to be uncovered.",
        "As evening falls, the atmosphere shifts, the room filled with a sense of anticipation. The flicker of candlelight dances across the walls, casting shadows that seem to whisper of hidden agendas. Guests, adorned in their finery, raise glasses and share pleasantries, but the air is thick with unspoken tension, a reminder that in this world of privilege, appearances can be deceiving."
      ]
    },
    {
      "id": "gardens",
      "name": "The Gardens",
      "type": "exterior",
      "purpose": "Isolation and reflection",
      "visualDetails": "Expansive gardens featuring manicured hedges, vibrant flower beds, and a stone pathway winding through the greenery.",
      "sensoryDetails": {
        "sights": [
          "Colorful blooms swaying in the breeze",
          "Neatly trimmed hedges lining the paths",
          "A stone fountain bubbling softly"
        ],
        "sounds": [
          "Birds chirping in the trees",
          "The rustle of leaves in the wind",
          "The distant sound of laughter from the house"
        ],
        "smells": [
          "Fragrant flowers in bloom",
          "Fresh-cut grass",
          "A hint of damp earth after rain"
        ],
        "tactile": [
          "Cool stone underfoot",
          "Soft petals brushing against skin",
          "The chill of the evening air"
        ]
      },
      "accessControl": "Open to family and guests during daylight hours; staff must remain indoors unless given explicit permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops clinging to petals",
            "Misty air obscuring distant views",
            "Puddles forming on the pathways"
          ],
          "sounds": [
            "The sound of rain pattering on leaves",
            "Birds chirping tentatively",
            "The distant rumble of thunder"
          ],
          "smells": [
            "Wet earth and foliage",
            "Freshness of rain-soaked flowers",
            "Hints of moss in the damp air"
          ],
          "mood": "melancholy yet refreshing"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light dulling the colors",
            "Shadows cast by the hedges",
            "Leaves rustling in the breeze"
          ],
          "sounds": [
            "The soft whisper of wind through trees",
            "Distant laughter from the manor",
            "The gentle trickle of water from the fountain"
          ],
          "smells": [
            "Earthy aroma of damp soil",
            "Fragrance of blooming flowers",
            "The scent of fresh grass"
          ],
          "mood": "reflective and serene"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Last rays of sunlight filtering through trees",
            "Fireflies flickering in the twilight",
            "The garden bathed in golden light"
          ],
          "sounds": [
            "Crickets chirping as dusk falls",
            "The soft rustle of evening breezes",
            "The distant sound of music from the house"
          ],
          "smells": [
            "Sweet fragrance of night-blooming flowers",
            "The cool scent of evening dew",
            "A hint of wood smoke in the air"
          ],
          "mood": "tranquil yet foreboding"
        }
      ],
      "paragraphs": [
        "The gardens surrounding Little Middleton Manor are a tapestry of color and life, meticulously maintained yet alive with the wildness of nature. As one strolls along the winding stone pathways, the scent of blooming flowers mingles with the fresh-cut grass, creating a sensory delight. However, the beauty of the gardens belies an underlying tension, as shadows play among the hedges, concealing the secrets of those who wander through.",
        "In the early morning light, the gardens take on a melancholic beauty, the soft patter of rain creating a soothing rhythm against the petals. Each droplet clinging to the flowers seems to whisper of hidden truths waiting to be uncovered. As evening descends, the tranquility is punctuated by the distant sounds of laughter from the manor, a reminder that even in this idyllic setting, the specter of intrigue looms ever closer."
      ]
    }
  ],
  "note": "",
  "cost": 0.00266213805,
  "durationMs": 43923
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1933,
    "month": "September",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "September",
    "weather": [
      "overcast skies with scattered rain showers",
      "cool breezes hinting at autumn",
      "occasional bursts of sunlight"
    ],
    "daylight": "Shortening days with sunset around seven o'clock, leaving long shadows by late afternoon",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Harvest Festival",
      "National Day of Mourning for the late King George V"
    ],
    "seasonalActivities": [
      "apple picking in local orchards",
      "attending church services for the Harvest Festival",
      "enjoying evening walks before the onset of chilly nights"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece wool suit with a waistcoat",
        "white dress shirt with a stiff collar",
        "dark bowler hat"
      ],
      "casual": [
        "tweed jacket with elbow patches",
        "corduroy trousers",
        "flat cap"
      ],
      "accessories": [
        "silver pocket watch",
        "leather gloves",
        "silk tie"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a cinched waist and flared skirt",
        "tailored blazer in houndstooth pattern",
        "cloche hat adorned with feathers"
      ],
      "casual": [
        "knitted sweater with a floral pattern",
        "A-line skirt",
        "button-up blouse"
      ],
      "accessories": [
        "string of pearls",
        "tweed handbag",
        "silk scarf"
      ]
    },
    "trendsOfTheMoment": [
      "influence of Hollywood glamour on local fashion",
      "popularity of Art Deco motifs in design",
      "prevalence of practical clothing due to economic constraints"
    ],
    "socialExpectations": [
      "men expected to wear suits when dining or attending social events",
      "women anticipated to dress modestly in public spaces",
      "class distinctions evident in dress and behavior"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The United Kingdom faces political instability due to budget cuts",
      "The rise of the National Socialist Party in Germany raises concerns",
      "Unemployment remains high as the Great Depression continues"
    ],
    "politicalClimate": "Growing fear of fascism in Europe leads to increased public discourse on civil rights and social equity",
    "economicConditions": "Struggling economy with high unemployment rates and ongoing public works programs aimed at job creation",
    "socialIssues": [
      "class disparities highlighted by the economic downturn",
      "rising anti-fascist sentiment among intellectual circles",
      "debate over women's suffrage and labor rights"
    ],
    "internationalNews": [
      "tension in Europe as Hitler consolidates power",
      "ongoing discussions about the League of Nations' effectiveness",
      "concerns over British imperial interests in the face of growing nationalism"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Night and Day' by Cole Porter",
        "'Stormy Weather' by Etta James",
        "popular jazz tunes from the Cotton Club"
      ],
      "films": [
        "'King Kong'",
        "'The Invisible Man'",
        "'42nd Street'"
      ],
      "theater": [
        "'The Front Page'",
        "'Rosencrantz and Guildenstern Are Dead'"
      ],
      "radio": [
        "BBC news broadcasts",
        "popular serial dramas",
        "musical variety shows"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Cathedral' by T.S. Eliot",
        "'The Glass Key' by Dashiell Hammett",
        "'The Maltese Falcon' by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "historical novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first electronic refrigerator",
        "improvements in radio broadcasting technology",
        "advancements in aviation with new models of planes"
      ],
      "commonDevices": [
        "home telephones with party lines",
        "typewriters prevalent in offices",
        "early forms of electric appliances"
      ],
      "emergingTrends": [
        "increased household electrification",
        "growth of the cinema as a popular social venue",
        "advent of moving pictures in entertainment"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Milk: one shilling",
        "Weekly newspaper: six pence"
      ],
      "commonActivities": [
        "socializing at tea gatherings",
        "participating in community events at the local church",
        "attending dances and social clubs"
      ],
      "socialRituals": [
        "afternoon tea as a common social practice",
        "formal Sunday lunches with family",
        "evening strolls to discuss local happenings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing resentment among lower classes towards the wealthy",
      "perception of the upper class as out of touch with the struggles of ordinary people"
    ],
    "gender": [
      "women increasingly participating in the workforce",
      "traditional gender roles still prevalent but being challenged",
      "expectation for women to adhere to modesty in attire"
    ],
    "race": [
      "racial tensions simmering in urban areas",
      "increased advocacy for civil rights among marginalized communities"
    ],
    "generalNorms": [
      "strict adherence to social etiquette in upper-class settings",
      "importance of maintaining appearances and propriety",
      "public discussions around social justice beginning to emerge"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth and fallen leaves fills the air as the days grow shorter, hinting at the approach of autumn.",
    "The sound of rain tapping against windowpanes creates a tense ambiance, punctuated by distant thunder rumbling like the social unrest brewing in the country.",
    "The flickering glow of candles casts long shadows in the manor's grand dining room, where hushed conversations hint at secrets and unspoken class grievances."
  ],
  "paragraphs": [
    "In September 1933, the English countryside is cloaked in a blanket of overcast skies, with rain showers intermittently drenching the fields. This time of year, the harvest is in full swing, and the scent of ripe apples wafts through the air as villagers gather for the annual Harvest Festival. The days are growing shorter, with sunset creeping earlier, casting long shadows across the manicured lawns of the manor house. Within its walls, tensions bubble under the surface, as the weight of class disparities and recent political upheavals loom heavily over the evening gatherings.",
    "As the guests at the manor prepare for the evening's dinner, the fashion of the day reflects the era's intricate balance between practicality and style. Men don three-piece wool suits, complete with bowler hats and polished leather shoes, while women adorn themselves in tea-length dresses cinched at the waist. Cloche hats embellished with feathers add a touch of elegance, though the weight of economic hardship is felt in their modest designs. The influence of Hollywood glamour is evident, yet the practicality of the clothing reflects the need for resilience amidst the ongoing struggles of the Great Depression.",
    "Daily life in September 1933 is characterized by a mix of social rituals and economic pressures. Afternoon tea remains a sacred tradition, where families gather to discuss community events and share news of the day. The cost of a loaf of bread hovers around four pence, a constant reminder of the economic strain that many households face. As evening falls, the manor's residents take leisurely strolls, discussing the troubling political climate that looms over Europe, with whispers of fascism growing bolder and calls for civil rights becoming more pronounced. The social fabric is fraying, and the manor, once a sanctuary of wealth and privilege, now feels more like a stage for the unfolding drama of a society in flux."
  ],
  "note": "",
  "cost": 0.0011152745999999999,
  "durationMs": 17877
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the Voss manor for a family meeting on estate management reveals underlying tensions exacerbated by the Great Depression and rising political unrest, drawing together a diverse cast of characters with conflicting interests.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The rigid class hierarchies and pressures from economic decline create a volatile atmosphere, where the affluent must navigate their privileges against the backdrop of societal change and political instability."
  },
  "setting": {
    "location": "A large, stately country house with multiple wings and extensive gardens in rural England.",
    "institution": "manor house",
    "weather": "Overcast with intermittent rain, typical for a rural English summer."
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
    "id": "dinner_time",
    "value": "eight o'clock",
    "description": "The scheduled time for the dinner party to begin"
  },
  {
    "id": "victim_arrival",
    "value": "a quarter past eight",
    "description": "The time the victim arrived at the manor"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock was intentionally wound back to mislead the timeline of events.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This reveals the mechanism of how the timeline was altered.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "This contradicts guest testimonies that they heard the clock strike ten.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This reveals the inconsistency in the timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows a time of twenty minutes past nine.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "This establishes the actual time at the scene.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "A faint scratch on the clock face indicates recent adjustment.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This suggests tampering with the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The scratches suggest tampering occurred just before the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This indicates a deliberate act to alter the time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "Eleanor Voss had the clock's key in her possession.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This shows her access to the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "This access allowed her to tamper with the clock and mislead others.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This indicates her opportunity to commit the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was at the hospital during the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This confirms he could not have committed the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at the tavern at the time of the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This confirms he could not have committed the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "behavioral",
      "description": "Eleanor Voss displayed signs of nervousness during dinner.",
      "sourceInCML": "CASE.cast[0].evidence_sensitivity[0]",
      "pointsTo": "This indicates potential guilt.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "The discriminating test compares clock, study, and twenty against the claimed timeline.",
      "sourceInCML": "CASE.discriminating_test.evidence_clues[0]",
      "pointsTo": "This will help establish the true timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "The clock was stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[1]",
      "pointsTo": "This indicates the last known time the clock was functioning.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_eleanor_voss",
      "category": "temporal",
      "description": "Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "nine o'clock in the evening remains a late texture detail in the case background.",
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
      "description": "Eleanor Voss was busy entertaining guests during the murder.",
      "supportsAssumption": "Eleanor Voss could not have committed the murder because she was busy entertaining guests.",
      "misdirection": "This misleads by suggesting she had no opportunity to commit the crime."
    },
    {
      "id": "rh_2",
      "description": "Eleanor Voss was seen preparing the dining room for dinner.",
      "supportsAssumption": "Eleanor Voss could not have committed the murder because she was busy entertaining guests.",
      "misdirection": "This misleads by implying she was occupied and unable to commit the murder."
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
      "clue_1",
      "clue_2",
      "clue_3"
    ],
    "mid": [
      "clue_4",
      "clue_5",
      "clue_core_elimination_chain",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_culprit_direct_eleanor_voss"
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
  "latencyMs": 13895,
  "cost": 0.0014285056499999998
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
