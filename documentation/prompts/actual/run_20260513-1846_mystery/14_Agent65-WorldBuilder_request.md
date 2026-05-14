# Actual Prompt Record

- Run ID: `mystery-1778698003363`
- Project ID: ``
- Timestamp: `2026-05-13T18:49:59.833Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `4374ea433310d900`

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
    "author": "A. I. Writer",
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
      "subtype": "clock tampering"
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
      "public_persona": "Wealthy heiress",
      "private_secret": "Struggling with financial ruin",
      "motive_seed": "Desire to maintain family legacy",
      "motive_strength": "strong",
      "alibi_window": "11:00 AM to 12:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "manor house",
        "garden"
      ],
      "behavioral_tells": [
        "Frequent checks on the clock"
      ],
      "stakes": "Inheritance",
      "evidence_sensitivity": [
        "clock details",
        "guest lists"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "25-35",
      "role_archetype": "friend",
      "relationships": [
        "Eleanor Voss (friend)",
        "Captain Ivor Hale (friend)",
        "Beatrice Quill (detective)"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Involved in a financial scheme",
      "motive_seed": "Desire to protect reputation",
      "motive_strength": "moderate",
      "alibi_window": "10:45 AM to 11:15 AM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "study",
        "library"
      ],
      "behavioral_tells": [
        "Nervous when discussing finances"
      ],
      "stakes": "Reputation",
      "evidence_sensitivity": [
        "medical records",
        "guest lists"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "non-binary"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "acquaintance",
      "relationships": [
        "Eleanor Voss (acquaintance)",
        "Dr. Mallory Finch (friend)",
        "Beatrice Quill (detective)"
      ],
      "public_persona": "Retired military officer",
      "private_secret": "In debt due to gambling",
      "motive_seed": "Desire for wealth",
      "motive_strength": "moderate",
      "alibi_window": "10:50 AM to 11:20 AM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "garden",
        "dining room"
      ],
      "behavioral_tells": [
        "Avoids eye contact when questioned"
      ],
      "stakes": "Financial stability",
      "evidence_sensitivity": [
        "gambling records",
        "guest lists"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "Eleanor Voss (victim)",
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (acquaintance)"
      ],
      "public_persona": "Private investigator",
      "private_secret": "Striving for respect in a male-dominated field",
      "motive_seed": "Desire for justice",
      "motive_strength": "strong",
      "alibi_window": "N/A",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "manor house",
        "garden"
      ],
      "behavioral_tells": [
        "Sharp intuition",
        "Observant"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [
        "investigation details",
        "guest lists"
      ],
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
      "summary": "During a stormy afternoon at the Voss estate, Eleanor Voss is found dead, her time of death shrouded in confusion due to a tampered clock. As private investigator Beatrice Quill investigates, she uncovers a web of secrets and motives entwined with the mechanical workings of the estate's clock."
    },
    "accepted_facts": [
      "Eleanor Voss was found dead at ten minutes past eleven.",
      "The clock in the study was stopped at ten minutes past eleven.",
      "Witnesses reported conflicting times regarding the clock's striking."
    ],
    "inferred_conclusions": [
      "The time of death is falsely represented due to clock tampering.",
      "At least one suspect has a motive linked to the timing of Eleanor's death."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was deliberately wound back to create a false timeline of events.",
      "delivery_path": [
        {
          "step": "Dr. Mallory Finch tampered with the clock to align with their alibi."
        }
      ]
    },
    "outcome": {
      "result": "Dr. Mallory Finch is revealed as the murderer."
    }
  },
  "false_assumption": {
    "statement": "Eleanor's death must align with the last time the clock struck.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock is a central fixture in the house, and its timekeeping is trusted by everyone.",
    "what_it_hides": "The clock was tampered with to create a false timeline."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "clock striking times",
        "alibi statements"
      ],
      "windows": [
        "10:45 AM to 11:20 AM"
      ],
      "contradictions": [
        "Witnesses stated the clock struck at odd times."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The clock",
        "Eleanor's study"
      ],
      "permissions": [
        "Access to the study during the time of death"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical laws of clock operation"
      ],
      "traces": [
        "Signs of tampering on the clock face"
      ]
    },
    "social": {
      "trust_channels": [
        "Reputation of the clock as a reliable timekeeper"
      ],
      "authority_sources": [
        "Dr. Mallory Finch's status as a physician"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows it was stopped at ten minutes past eleven.",
        "correction": "The clock's stopped time does not match witness accounts of the time of death.",
        "effect": "Narrows down the timeline of events surrounding Eleanor's death.",
        "required_evidence": [
          "The clock was stopped at ten minutes past eleven.",
          "Witnesses reported conflicting times regarding the clock's striking."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall the clock striking the hour at an odd time.",
        "correction": "The inconsistency in the clock's striking times suggests tampering.",
        "effect": "Eliminates the reliability of the clock as evidence.",
        "required_evidence": [
          "Witness statements about the clock's striking times.",
          "The clock's mechanism shows signs of tampering."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Mallory Finch was seen near the clock shortly before Eleanor's death.",
        "correction": "The proximity to the clock raises suspicion about their involvement.",
        "effect": "Narrows the suspect pool, making Dr. Mallory Finch a primary suspect.",
        "required_evidence": [
          "Witness accounts of Dr. Mallory Finch's location before the murder.",
          "The clock was located in the study where Eleanor was found."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, tamper, and study against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are clock, tamper, and study.",
    "pass_condition": "If the clock shows signs of tampering consistent with Dr. Mallory Finch's access and opportunity.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's stopped time and witness statements establish a false timeline. Step 2: The tampered clock's striking inconsistency eliminates its reliability. Step 3: The proximity of Dr. Mallory Finch to the clock narrows suspicion directly to them."
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
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Eleanor is revealed as the victim.",
        "supporting_clues": [
          "Eleanor's presence at the time of death is established."
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Captain Ivor Hale's alibi is confirmed.",
        "supporting_clues": [
          "Witnesses confirm his location at the time."
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witness account"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Physical evidence"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
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
    "summary": "Eleanor Voss is a captivating socialite whose charm masks a darker reality; she is entangled in a web of secrets that could unravel her carefully curated life. As a philanthropist, she appears generous, but her true self is driven by a desperate need to maintain her status at any cost.",
    "publicPersona": "Charming and gracious, Eleanor is known for her charity work and hosting lavish events, often dazzling her guests with exquisite soirées filled with laughter and sophistication.",
    "privateSecret": "She has been embezzling from her charity's funds to maintain her lifestyle, an act she justifies as a means to preserve the image of her philanthropic endeavors.",
    "motiveSeed": "She risks exposure if the victim reveals her financial troubles, which could lead to scandal and the collapse of her social standing.",
    "motiveStrength": "strong",
    "alibiWindow": "was seen in the garden from eight to nine o'clock, a detail she hopes will shield her from suspicion.",
    "accessPlausibility": "easy, as her status grants her access to all areas of the estate.",
    "stakes": "Her reputation and financial security are on the line, leaving her to ponder the lengths she will go to protect her façade.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a melodic tone, often employing rhetorical questions to engage her audience and soften her sharper remarks. She punctuates her conversations with airy laughter, masking her tension beneath a façade of grace.",
    "internalConflict": "Eleanor wrestles with guilt over her embezzlement, fearing the exposure of her deceit will shatter not only her reputation but also her identity as a benefactor.",
    "personalStakeInCase": "This crime matters personally to Eleanor because her entire life hinges on the preservation of her reputation; the thought of being unmasked terrifies her.",
    "paragraphs": [
      "Eleanor Voss glided through her garden like a benevolent spirit, her laughter a gentle chime in the evening air. She was a master of social grace, a woman who could dazzle an audience with a mere smile. Yet beneath the polished exterior lay an unsettling truth; Eleanor's charm was but a veneer, concealing a desperate need to maintain her lavish lifestyle. The charity galas, the exquisite gowns, and the admiration of her peers were all sustained by funds that did not belong to her. The very foundation of her identity was built on deception, and that foundation trembled with the slightest hint of exposure.",
      "As she drifted among the roses, Eleanor's mind raced with thoughts of the victim, whose knowledge of her financial improprieties could spell disaster. The stakes had never been higher. She had cultivated an image of benevolence, a persona that would be irrevocably tarnished should her secrets come to light. Each stolen penny echoed in her mind, a reminder of the precarious tightrope she walked between wealth and ruin. 'You can only spend so much on the façade before it all comes crashing down,' she mused, her heart racing at the thought.",
      "Eleanor's charm was not entirely a ruse; there were moments when her laughter was genuine, when she felt the warmth of philanthropy touch her soul. Yet, those moments were increasingly overshadowed by the gnawing fear of exposure. Would she be forced to relinquish her carefully curated life? The thought sent shivers down her spine. In her mind, she envisioned the gasps of her peers, their eyes filled with disbelief at the revelation of her duplicity. She had worked too hard to build her reputation to let it slip away now.",
      "As the sun dipped below the horizon, casting long shadows across the garden, Eleanor resolved to protect her secrets at any cost. The web she had spun was intricate, and she was its architect. But even she knew that webs could be torn apart, and the truth, like a predator, lay in wait. With each passing moment, the clock ticked louder, reminding her that time was not on her side. 'After all,' she thought with a sardonic smile, 'who doesn’t love a good scandal?'"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician who maintains a dispassionate demeanor, yet beneath the surface lies a storm of conflicting loyalties and hidden desires. Their secret relationship with Eleanor Voss presents a moral dilemma that could cost them both dearly.",
    "publicPersona": "A composed and respected doctor, Mallory is often consulted by the upper class for medical advice, their calm presence a balm to anxious souls seeking reassurance.",
    "privateSecret": "Mallory is in a secret relationship with Eleanor, putting their reputations at risk while navigating the treacherous waters of love and discretion.",
    "motiveSeed": "Fear of scandal if their affair is revealed, especially if Eleanor's crimes come to light, casts a long shadow over their professional integrity.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the library reading from eight to nine o'clock, a detail that may lend them some credibility if questioned.",
    "accessPlausibility": "possible, as they often visit the estate for professional consultations.",
    "stakes": "The potential ruin of both their reputations hangs in the balance, leading Mallory to question their commitment to Eleanor.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory's speech is measured and precise, often laced with subtle irony. They tend to employ medical metaphors, using clinical language even in casual conversation, which can bring a disarming quality to their interactions.",
    "internalConflict": "Mallory grapples with loyalty versus self-preservation, torn between their feelings for Eleanor and the potential fallout of their relationship.",
    "personalStakeInCase": "This crime matters personally to Mallory because they are deeply invested in Eleanor's well-being; the idea of losing her to scandal is a prospect they cannot bear.",
    "paragraphs": [
      "Dr. Mallory Finch settled into the comforting silence of the library, surrounded by the scent of old leather and the weight of countless tomes. The flickering candlelight cast soft shadows, a perfect metaphor for the secrets that lingered in the corners of their life. To the outside world, Mallory was a pillar of the community, a physician whose expertise was sought after by the elite. Yet in the recesses of their heart, a tumultuous affair with Eleanor Voss posed a risk that could unravel everything they had built.",
      "Mallory often found solace in the pages of medical journals, their mind wandering through the intricacies of anatomy and the human condition. But even the most complex case paled in comparison to the emotional labyrinth they navigated with Eleanor. Their relationship was a delicate balance of passion and peril, each stolen moment a reminder of the stakes involved. 'What good is a heart if it leads to ruin?' they pondered, a wry smile creeping onto their lips as they imagined the scandal that would ensue if their affair came to light.",
      "As the clock ticked away the minutes, Mallory's thoughts drifted to Eleanor's predicament. The weight of her secrets pressed heavily upon them, a burden they shared in silence. They admired her resilience, yet the fear of exposure gnawed at their conscience. If her embezzlement were to be revealed, what would become of their love? Would they face the world together or be consumed by the fallout? The questions loomed large, threatening to drown them in a sea of uncertainty.",
      "With a sigh, Mallory closed the book in their lap, realizing that their loyalty to Eleanor was intertwined with the preservation of their own reputation. The clockwork of their lives had been set in motion, and the gears were beginning to grind. Each tick echoed the urgency of their situation, and as they prepared to leave the sanctuary of the library, a resolve settled within them. They would do whatever it takes to protect Eleanor, even if it meant grappling with the consequences of their love."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired military officer whose stern exterior masks a deep-seated resentment towards Eleanor Voss. Haunted by a past scandal that marred his career, Ivor grapples with the desire for revenge versus the possibility of redemption.",
    "publicPersona": "A stern but honorable man, Ivor is often seen as a relic of the past, clinging to old values and traditions that some deem outdated.",
    "privateSecret": "He harbors resentment towards Eleanor for a past scandal that ruined his military career, a grudge that has festered over the years.",
    "motiveSeed": "Desire for revenge after being publicly humiliated by Eleanor's actions years ago, fueling a fire that has long since smoldered.",
    "motiveStrength": "compelling",
    "alibiWindow": "was out walking the estate grounds from eight to nine o'clock, a solitary act that may provide him with a cover.",
    "accessPlausibility": "possible, as the estate grounds are familiar territory for him.",
    "stakes": "His sense of honor and personal vendetta against Eleanor drive him, creating a conflict between his desire for justice and the need for closure.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor's speech is direct and unembellished, often punctuated with military jargon. He rarely indulges in pleasantries, preferring to cut straight to the point, which can come off as brusque.",
    "internalConflict": "Ivor must decide between revenge and redemption, as the desire for payback clashes with the hope for personal growth and forgiveness.",
    "personalStakeInCase": "This crime matters personally to Ivor because he sees it as an opportunity to confront the ghosts of his past and reclaim his honor.",
    "paragraphs": [
      "Captain Ivor Hale strode purposefully along the estate grounds, his military bearing evident in the way he carried himself. The crisp air filled his lungs as he took in the familiar sights, but the beauty of the landscape was lost on him. His thoughts were consumed by the memory of a scandal that had tarnished his name and shattered his career. Eleanor Voss, the very embodiment of the society that had cast him aside, was at the center of it all, and the desire for revenge simmered just beneath the surface.",
      "Ivor's stern demeanor often intimidated those around him, but beneath the gruff exterior lay a heart scarred by betrayal. He remembered the day his reputation was laid bare, the whispers of scandal echoing in his ears long after the moment had passed. 'A soldier must maintain his honor,' he would often say, but what honor remained when it had been so callously stripped away? The need for retribution gnawed at him, urging him to confront the woman who had played a pivotal role in his downfall.",
      "As he walked, the memories surged like the tide, and Ivor felt the weight of his grudge pressing down on him. He had spent years nursing this bitterness, convinced that revenge would provide the satisfaction he craved. But as the shadows lengthened around him, a flicker of doubt emerged. Was he destined to be a prisoner of his own resentment, or could he find a way to break free? The thought of redemption lingered, a tantalizing possibility that clashed with his thirst for vengeance.",
      "With each step, Ivor wrestled with the duality of his heart. The prospect of confronting Eleanor filled him with both dread and exhilaration. Would he find closure in her downfall, or would he discover that true strength lay in forgiveness? The clock was ticking, and as the evening drew near, Ivor understood that the time for reckoning was approaching. He would have to confront not only Eleanor but also the man he had become in the process."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious journalist determined to uncover the truth behind the façade of Eleanor Voss's charity. With a keen eye for detail and a nose for scandal, she finds herself entangled in a murder investigation that could make or break her career.",
    "publicPersona": "An ambitious young journalist eager to uncover the truth, Beatrice is determined to make her mark, often seen with a notepad in hand and a glint of curiosity in her eye.",
    "privateSecret": "She has been investigating Eleanor's charity and its questionable practices for a story, putting her in a precarious position as she digs deeper into a world of secrets.",
    "motiveSeed": "She sees the murder as an opportunity to reveal the truth about Eleanor's embezzlement, a story that could propel her career to new heights.",
    "motiveStrength": "moderate",
    "alibiWindow": "was interviewing staff in the kitchen from eight to nine o'clock, a detail that may provide her with a plausible cover.",
    "accessPlausibility": "easy, as her role as a journalist grants her access to various areas of the estate.",
    "stakes": "Her career depends on this story, but she risks becoming a target if she digs too deep, caught in a web of intrigue that could ensnare her.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a lively cadence, often punctuating her observations with sarcasm. She has a penchant for dramatic flair, frequently gesturing as she narrates her findings, and her dialogue is peppered with witty quips.",
    "internalConflict": "Beatrice struggles with the balance between ambition and ethical journalism, torn between the desire for a sensational story and the moral implications of her investigation.",
    "personalStakeInCase": "This crime matters personally to Beatrice because it represents her chance to break into the journalism elite, yet she fears the consequences of exposing the truth.",
    "paragraphs": [
      "Beatrice Quill stood in the kitchen, her notepad poised as she interviewed the staff with the fervor of a detective on a case. The hum of activity surrounded her, but her mind was elsewhere, racing with thoughts of the scandal she was on the cusp of uncovering. Eleanor Voss's charity had always intrigued her, a glittering façade that concealed murky depths. A murder had thrown the spotlight on Eleanor, and Beatrice was determined to seize the moment, her ambition igniting like a match in the dark.",
      "With a sardonic smile, Beatrice scribbled notes, her pen flying across the page as she captured the whispers of the kitchen staff. 'If only the walls could talk,' she mused, her mind dancing with the possibilities of the story that lay ahead. Each revelation felt like a puzzle piece falling into place, a tantalizing glimpse into the complexities of Eleanor's world. But with each piece, the risks grew, and Beatrice grappled with the delicate balance of ambition and ethics.",
      "The stakes were high, and Beatrice could feel the thrill of danger tingling in her fingertips. She envisioned the headlines that could emerge from this investigation, the accolades that would follow. Yet, a voice in the back of her mind cautioned her to tread carefully. The truth could be a double-edged sword, and exposing Eleanor's secrets could turn her into a target. 'What a tangled web we weave,' she thought wryly, knowing that the world of journalism was as treacherous as it was alluring.",
      "As she concluded her interviews, Beatrice felt the weight of her choices pressing down on her. This case was not just a career opportunity; it was a test of her integrity. In the pursuit of truth, would she lose herself to the sensationalism that often accompanied it? The clock was ticking, and as she prepared to dive deeper into the murky waters of Eleanor's charity, Beatrice understood that she had to navigate not only the story but also the moral implications of her ambition."
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
    "summary": "Nestled in the heart of the English countryside, Little Middleton Manor is a grand estate steeped in secrets, with sprawling gardens and a labyrinth of rooms that conceal more than just dust.",
    "visualDescription": "The manor's stone façade looms under a canopy of dark clouds, ivy creeping up its walls, while tall chimneys punctuate the skyline, hinting at the warmth within. Formal gardens with hedgerows trimmed to perfection surround the house, yet their beauty feels suffocating, as if nature itself is holding its breath.",
    "atmosphere": "A palpable sense of unease permeates the air, as if the very walls are eavesdropping on whispered conspiracies.",
    "paragraphs": [
      "Little Middleton Manor stands like a sentinel of the past, its imposing structure a testament to the wealth and power of the family that resides within. The grey slate roof, lined with weathered tiles, contrasts sharply with the vibrant greens of the meticulously maintained gardens. Yet, the air is thick with tension, the kind that seems to coil and twist like the ivy that clings to the walls, suggesting that beneath the polished surface lies a tangle of secrets waiting to be unearthed.",
      "As the sun struggles to pierce the heavy clouds overhead, the estate seems to absorb the light, casting elongated shadows that dance across the manicured lawns. The distant sound of a clock tolling echoes through the grounds, its rhythmic chime a reminder of time's relentless march, and perhaps the countdown to the revelation of hidden truths. The scent of damp earth and decaying leaves wafts through the air, a reminder of the encroaching autumn, while the occasional rustle of leaves hints at unseen movement, as if the manor itself is alive with its own mysteries.",
      "Inside, the grand hall is a study in elegance, with polished oak floors and rich tapestries that whisper stories of generations. Yet, the atmosphere is stifling, as if the very air is thick with the weight of unspoken words. The flickering glow of gas lamps casts ominous shadows, distorting the faces of those who gather here, their expressions revealing more than they wish to disclose. The sound of footsteps on the marble staircase reverberates, each step echoing like a heartbeat in the stillness, amplifying the tension that lingers in the air.",
      "Each room holds its own secrets, from the library filled with dusty tomes that seem to guard knowledge long forgotten, to the private study where whispered conversations hint at clandestine dealings. The isolation of the estate, miles from the nearest village, adds to the sense of entrapment, as the characters navigate their intertwined fates, each corner of the manor a potential witness to the unfolding drama. Here, in this grand yet suffocating space, the clockwork of conspiracy begins to tick, setting the stage for a mystery that threatens to unravel everything."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical of the British countryside in the fall.",
    "timeFlow": "Three days of mounting tension as secrets are unearthed and alliances tested.",
    "mood": "Tense and foreboding, reflecting underlying social tensions and personal conflicts.",
    "eraMarkers": [
      "Petrol-powered automobiles parked haphazardly in the gravel driveway, their engines still warm from recent use.",
      "An early home telephone system with a distinctive ring, shared among the household staff and family.",
      "A typewriter clacks rhythmically in the study as a servant transcribes notes for the master of the house."
    ],
    "sensoryPalette": {
      "dominant": "The damp, musty scent of the manor intermingled with the crispness of autumn air.",
      "secondary": [
        "The faint aroma of polished wood and old books from the library.",
        "A lingering hint of smoke from the fireplace, suggesting warmth amidst the chill."
      ]
    },
    "paragraphs": [
      "The atmosphere is thick with the promise of rain, the overcast sky casting a pall over the estate. The sound of distant thunder rumbles like a warning, while the occasional patter of raindrops against the windowpanes creates a rhythmic backdrop to the tension that hangs in the air. Inside, the flickering gas lamps cast a warm glow, yet the shadows they create seem to pulse with secrets, amplifying the feeling that danger lurks just beyond the walls.",
      "As time stretches and the clock ticks with relentless precision, the manor feels increasingly claustrophobic. Each room, with its heavy drapes and ornate furnishings, seems to close in, trapping the inhabitants within their own webs of deceit. The air is charged with an electric tension, as if the very fabric of the estate is woven with the threads of intrigue and betrayal, waiting for the right moment to unravel."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Conservatory",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The conservatory is a glass-enclosed sanctuary filled with exotic plants, their vibrant colors dulled by the overcast light. A wrought-iron bench sits in the center, its surface cold and damp from the night's rain, while shattered glass from a nearby window glitters ominously on the floor.",
      "sensoryDetails": {
        "sights": [
          "The glass walls of the conservatory are streaked with rain, distorting the view of the gardens outside, where the vibrant flora appears muted and ghostly.",
          "A scattering of broken terracotta pots lies amidst the foliage, their contents spilled like the secrets they once held."
        ],
        "sounds": [
          "The soft patter of raindrops against the glass creates a melancholic symphony, mingling with the distant call of a mourning dove echoing through the estate.",
          "The creaking of the iron bench as the wind moves through the structure adds an eerie undertone, as if the space itself is mourning the events that transpired."
        ],
        "smells": [
          "The rich, loamy scent of damp earth fills the air, intermingling with the faint floral notes of the surviving plants, creating a bittersweet atmosphere.",
          "A hint of decay lurks beneath the surface, the smell of broken stems and wilting leaves signaling the aftermath of violence."
        ],
        "tactile": [
          "The chill of the glass panels sends shivers through the air, a stark contrast to the warmth that once enveloped the space.",
          "The rough texture of the broken pottery contrasts sharply with the smoothness of the intact glass, reminding one of the fragility of the scene."
        ]
      },
      "accessControl": "The conservatory is typically accessible to all household members, but it becomes off-limits during the investigation, with staff instructed to avoid the area until further notice.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the glass ceiling, creating a delicate veil that obscures the lush greenery.",
            "The muted colors of the plants seem to blend into one another, resembling a watercolor painting washed out by the rain."
          ],
          "sounds": [
            "The steady drumming of rain on the glass is punctuated by the occasional thud of a fallen branch outside.",
            "A distant rumble of thunder adds a sense of urgency to the atmosphere, as if nature itself is warning of impending revelations."
          ],
          "smells": [
            "The scent of petrichor rises from the damp earth, mixing with the sweet notes of blooming orchids.",
            "A sharp, acrid smell of wet stone fills the air, reminding one of the weight of the secrets hidden within."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The conservatory is dim, the light filtering through the glass casting elongated shadows that seem to stretch and twist.",
            "A few brave blooms stand defiant against the gloom, their colors vibrant yet somehow muted by the heavy atmosphere."
          ],
          "sounds": [
            "The soft rustle of leaves as a breeze stirs the air is the only sound breaking the silence, heightening the sense of isolation.",
            "The occasional drip of water from the plants creates a rhythmic, almost hypnotic pattern that underscores the tension."
          ],
          "smells": [
            "The air is thick with the scent of damp foliage and wet earth, a reminder of the life that still thrives despite the darkness.",
            "A faint whiff of decay hangs in the air, a stark reminder that not all life in the conservatory is thriving."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers from within the manor, casting warm reflections on the glass, turning the conservatory into a realm of shadows and light.",
            "The evening sky outside is a canvas of deep blue, dotted with stars that seem to twinkle knowingly at the events unfolding within."
          ],
          "sounds": [
            "The distant laughter of guests mingles with the chirping of crickets, creating an unsettling contrast to the stillness of the conservatory.",
            "The soft rustle of a breeze through the leaves creates an almost ghostly whisper, hinting at the secrets that remain unspoken."
          ],
          "smells": [
            "The sweet and smoky scent of burning candles wafts through the air, mingling with the fresh aroma of night-blooming flowers.",
            "A hint of tobacco smoke drifts in from the nearby drawing room, adding to the ambiance of intrigue."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The conservatory, once a sanctuary of tranquility, now serves as a grim reminder of the events that transpired within its glass walls. Shattered remnants of the past litter the floor, while the once-vibrant plants droop as if mourning the loss of innocence. Each detail, from the broken pots to the cold iron bench, tells a story of betrayal and despair, echoing the tension that fills the air. It is a space that holds its breath, waiting for the truth to emerge from the shadows.",
        "As the investigation unfolds, the conservatory becomes a focal point of suspicion, with its delicate balance of beauty and decay reflecting the complexities of human nature. The air is thick with unspoken words as detectives and guests alike traverse its space, each seeking answers while grappling with their own secrets. Here, amidst the remnants of life and beauty, lies the heart of the mystery, waiting to be untangled."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The library is a cavernous room lined with dark oak shelves, filled with dusty tomes and leather-bound volumes that whisper of forgotten knowledge. A large bay window overlooks the gardens, its leaded glass casting intricate shadows on the worn carpet below.",
      "sensoryDetails": {
        "sights": [
          "Rows of bookshelves stretch towards the high ceiling, their spines a kaleidoscope of colors, yet many are faded and worn, suggesting years of neglect.",
          "A heavy oak table sits in the center, its surface marred by ink stains and the imprint of countless papers, hinting at the secrets it has borne witness to."
        ],
        "sounds": [
          "The soft rustle of pages turning fills the air, a sound that feels almost sacred in this sanctuary of knowledge, interrupted only by the distant ticking of a grandfather clock.",
          "Occasional creaks from the old floorboards echo like whispers of the past, adding an eerie quality to the otherwise serene environment."
        ],
        "smells": [
          "The scent of aged paper and leather permeates the room, a comforting yet melancholic aroma that speaks of stories untold.",
          "A faint hint of tobacco smoke lingers in the corners, remnants of late-night discussions held over volumes of intrigue."
        ],
        "tactile": [
          "The smooth, cool surface of the table contrasts with the rough texture of the aged books, inviting one to touch and explore the knowledge contained within.",
          "The warm glow of a nearby lamp casts a soft light, creating a cozy yet oppressive atmosphere that encourages introspection."
        ]
      },
      "accessControl": "Access to the library is restricted to family members and select guests, with staff required to request permission before entering, adding an air of exclusivity and secrecy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Soft light filters through the bay window, the rain casting a shimmering veil across the room, creating a dreamlike atmosphere.",
            "The dampness of the air causes the pages of open books to curl slightly, as if they too are responding to the weather."
          ],
          "sounds": [
            "The gentle patter of rain against the window mingles with the rustle of pages, creating a soothing yet somber soundtrack.",
            "The distant sound of thunder rumbles softly, a reminder of the storm outside, echoing the tension within."
          ],
          "smells": [
            "The fresh scent of rain mingles with the musty aroma of old books, creating a unique blend that is both comforting and melancholic.",
            "The dampness seems to awaken the scent of the wood, adding a rich, earthy quality to the air."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The library is bathed in a soft, diffused light, the shadows deepening in the corners, creating an atmosphere of solitude.",
            "Dust motes dance lazily in the air, illuminated by the weak light, adding to the sense of timelessness."
          ],
          "sounds": [
            "The occasional creak of the shelves as they settle under the weight of the books adds an eerie quality to the silence.",
            "A clock ticks steadily in the background, each second echoing like a countdown to an impending revelation."
          ],
          "smells": [
            "The scent of old leather and paper is more pronounced in the stillness, a reminder of the stories that lie within.",
            "A whiff of something floral, perhaps a bouquet left to wilt, lingers in the air, hinting at life amidst the decay."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The setting sun casts long shadows across the room, the golden light reflecting off the polished surfaces of the furniture.",
            "A fire crackles in the hearth, its flickering flames dancing across the spines of the books, creating a warm yet foreboding ambiance."
          ],
          "sounds": [
            "The sound of crackling firewood fills the room, creating a comforting backdrop to the otherwise tense atmosphere.",
            "The distant murmur of voices from the drawing room reminds one that the outside world continues, even as secrets unfold within these walls."
          ],
          "smells": [
            "The rich scent of burning wood mingles with the musty aroma of the books, creating an inviting yet strangely oppressive atmosphere.",
            "A hint of freshly brewed tea wafts in from the drawing room, a reminder of domestic normalcy amidst the chaos."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library is a sanctuary of knowledge, yet its atmosphere is thick with tension and secrets. Dust dances in the shafts of light that filter through the bay window, illuminating the well-worn volumes that line the shelves, each one a potential vessel of clues. The air is heavy with the scent of aged paper and leather, an olfactory reminder of the stories contained within, while the distant ticking of the clock seems to echo the heartbeat of the mystery that unfolds around it.",
        "As guests peruse the shelves, their fingers brushing against the spines of novels and tomes, one can sense the weight of unspoken truths lingering in the air. The soft rustle of pages turning is accompanied by a palpable tension, as if the very room is holding its breath, waiting for the right moment to reveal its secrets. In this space, knowledge and intrigue intertwine, creating a backdrop for the unfolding drama that will test the resolve of all who enter."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is a lavishly decorated space with plush sofas and gilded mirrors reflecting the flickering light of gas lamps. Ornate chandeliers hang from the ceiling, casting a warm glow on the rich fabrics and intricate patterns that adorn the walls.",
      "sensoryDetails": {
        "sights": [
          "The room is adorned with heavy drapes that frame tall windows, their luxurious fabric pooling onto the polished floor, creating an air of opulence.",
          "A grand piano stands in one corner, its glossy surface reflecting the light, hinting at evenings filled with music and laughter now tainted by tension."
        ],
        "sounds": [
          "The soft murmur of conversation fills the air, punctuated by the occasional clink of china as guests sip tea, yet there is an undercurrent of unease that permeates the dialogue.",
          "The creaking of the floorboards beneath the weight of shifting bodies adds a layer of tension, as if the very room is aware of the secrets being exchanged."
        ],
        "smells": [
          "The sweet aroma of freshly brewed tea mingles with the faint scent of lavender from the potpourri, creating a deceptive sense of calm.",
          "A hint of smoke from the fireplace lingers in the air, a reminder of warmth and comfort that contrasts sharply with the chilling atmosphere."
        ],
        "tactile": [
          "The softness of the velvet upholstery invites guests to sink into its embrace, yet the opulence feels stifling, as if it were a trap.",
          "The coolness of the marble fireplace contrasts with the warmth of the room, creating a dichotomy that mirrors the tension among the occupants."
        ]
      },
      "accessControl": "The drawing room is a communal space accessible to all guests, yet the seating arrangements often reflect social hierarchies, with the family occupying the prime positions, leaving others to navigate their interactions carefully.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak down the windows, distorting the view of the garden outside, creating a melancholic atmosphere.",
            "The muted colors of the room seem to blend into one another, as if the rain has washed away the vibrancy of the space."
          ],
          "sounds": [
            "The soft patter of rain against the windows combines with the distant sound of thunder, creating a soothing yet somber soundtrack.",
            "The murmur of voices is muffled, as if the rain has cast a veil over the conversations within."
          ],
          "smells": [
            "The scent of damp earth wafts in from the garden, mingling with the aroma of tea and hinting at nature's presence.",
            "A faint whiff of mildew suggests that even within this opulent space, decay lurks just beneath the surface."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is bathed in a soft, muted light, shadows deepening in the corners and creating an atmosphere of solitude.",
            "Dust motes drift lazily in the air, illuminated by the weak light, adding to the sense of timelessness."
          ],
          "sounds": [
            "The occasional creak of the furniture as guests shift in their seats punctuates the silence, heightening the tension.",
            "The ticking of a grandfather clock in the corner seems to echo the heartbeat of the room, a constant reminder of time slipping away."
          ],
          "smells": [
            "The air is thick with the scent of polished wood and fading flowers, a reminder of beauty that is slowly wilting.",
            "A hint of something acrid, perhaps from the fireplace, adds a layer of discomfort to the otherwise elegant atmosphere."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of gas lamps casts flickering shadows across the room, illuminating the faces of guests gathered in hushed conversation.",
            "The rich colors of the upholstery and decor seem to come alive in the soft light, enhancing the sense of intimacy."
          ],
          "sounds": [
            "The gentle clinking of china and the low murmur of conversation create a symphony of social interaction, yet there is an underlying tension in the air.",
            "The crackling of the fireplace adds warmth, but also a sense of foreboding, as if the flames are aware of the secrets being shared."
          ],
          "smells": [
            "The inviting scent of burning wood mingles with the fragrance of fresh flowers, creating an atmosphere of comfort that feels almost deceptive.",
            "A hint of tobacco smoke drifts in from a nearby cigar, adding to the ambiance of sophistication laced with intrigue."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room serves as a stage for the unfolding drama, its opulent decor juxtaposed with the tension that fills the air. Plush sofas invite guests to relax, yet the atmosphere remains charged, as if every word spoken is a step closer to revelation. Gas lamps flicker overhead, casting dancing shadows that seem to whisper secrets, while the distant sound of laughter feels like a ghostly reminder of the joy that once filled this space.",
        "As guests gather, their conversations swirl like the smoke from the fireplace, each word laden with meaning and unspoken truths. The drawing room, with its lavish furnishings and rich aromas, should be a sanctuary, yet it feels more like a trap, ensnaring all who enter in a web of intrigue and deception. Here, amidst the elegance, the true nature of the characters begins to unravel, revealing the clockwork of their conspiracies."
      ]
    }
  ],
  "note": "",
  "cost": 0.0029023731,
  "durationMs": 46768
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1939,
    "month": "January",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "chilly winds sweeping across the countryside"
    ],
    "daylight": "Short days with limited sunlight, twilight descending around four o'clock",
    "time_of_day_of_crime": "Late evening — between eight and ten o'clock, after the dinner hour",
    "holidays": [
      "New Year's Day (January 1)",
      "Epiphany (January 6)"
    ],
    "seasonalActivities": [
      "strolling through the estate's gardens despite the cold",
      "indoor games by the fire",
      "reading classic literature in the drawing room"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored three-piece suit in wool",
        "fitted waistcoat",
        "double-breasted overcoat"
      ],
      "casual": [
        "tweed jacket",
        "corduroy trousers",
        "knit sweater"
      ],
      "accessories": [
        "flat cap",
        "silk tie",
        "watch chain"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dress with a cinched waist",
        "long evening gown with delicate beading",
        "short fur coat"
      ],
      "casual": [
        "knitted cardigan",
        "high-waisted skirt",
        "blouse with puffed sleeves"
      ],
      "accessories": [
        "cloche hat",
        "string of pearls",
        "handbag with a clasp"
      ]
    },
    "trendsOfTheMoment": [
      "bias-cut dresses",
      "exotic prints from the Far East",
      "tailored menswear inspired by military styles"
    ],
    "socialExpectations": [
      "men expected to be the primary breadwinners",
      "women encouraged to maintain the household",
      "importance placed on social etiquette and manners"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "rising tensions in Europe as Nazi Germany expands its influence",
      "the U.S. recognizes the Franco regime in Spain",
      "the looming threat of World War II"
    ],
    "politicalClimate": "A sense of unease with the rise of fascism and the impact on British politics and society, leading to increased calls for national unity.",
    "economicConditions": "Lingering effects of the Great Depression; unemployment rates still troubling, though showing signs of recovery in some sectors.",
    "socialIssues": [
      "class divisions becoming more pronounced",
      "debates on gender roles and labor rights",
      "concerns over the appeasement of totalitarian regimes"
    ],
    "internationalNews": [
      "Germany's annexation of Austria",
      "increased military mobilizations across Europe",
      "the Munich Agreement's ramifications still felt"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glen Miller's big band sounds",
        "Doris Day's early recordings",
        "jazz standards from the Cotton Club"
      ],
      "films": [
        "The Wizard of Oz",
        "Gone with the Wind",
        "The Adventures of Robin Hood"
      ],
      "theater": [
        "The Glass Menagerie",
        "The Royal Family",
        "Lady Windermere's Fan"
      ],
      "radio": [
        "The Shadow radio program",
        "H.G. Wells's War of the Worlds broadcast",
        "weekly news bulletins on current affairs"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Grapes of Wrath by John Steinbeck",
        "The Maltese Falcon by Dashiell Hammett",
        "The Old Man and the Sea by Ernest Hemingway"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "social realism",
        "historical novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the television begins limited broadcasts",
        "new telephone systems with improved clarity",
        "advancements in aviation technology"
      ],
      "commonDevices": [
        "wireless radios",
        "typewriters",
        "petrol-powered vehicles"
      ],
      "emergingTrends": [
        "home electrification",
        "increased use of household appliances",
        "growing popularity of cinema as a social event"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Coal scuttle refill: one shilling sixpence"
      ],
      "commonActivities": [
        "playing card games in the evening",
        "attending local dances or social gatherings",
        "visiting nearby towns for shopping"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "afternoon tea with friends",
        "formal invitations for balls and gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "upper classes maintain traditional privileges",
      "working classes struggle for better rights",
      "class distinctions often dictate social interactions"
    ],
    "gender": [
      "men are seen as the head of the household",
      "women viewed primarily as caregivers",
      "emerging discussions on women's suffrage and rights"
    ],
    "race": [
      "racial tensions in the UK, especially regarding immigration",
      "increased awareness of colonial issues",
      "the rise of anti-fascist movements"
    ],
    "generalNorms": [
      "politeness and decorum are highly valued",
      "public displays of emotion are often frowned upon",
      "community engagement is encouraged"
    ]
  },
  "atmosphericDetails": [
    "The damp chill of January air clings to the skin, punctuated by the faint scent of wet earth and smoke from the estate's chimneys.",
    "The sound of raindrops pattering against the windows creates a rhythmic backdrop, as shadows stretch across the dimly lit rooms of the country house.",
    "An underlying tension hangs in the air, with the distant echoes of political unrest seeping into the conversations of those gathered around the fireside."
  ],
  "paragraphs": [
    "In January 1939, the English countryside is blanketed in the muted tones of winter. Overcast skies loom heavy, and the occasional rain shower enhances the chill that seeps into the grand country house estate. With the days short and twilight falling around four o'clock, the evenings are filled with the warm glow of firelight and the mingling of family and friends, all while the outside world grows increasingly fraught with uncertainty. The New Year, freshly begun, carries both hope and apprehension, as the specter of conflict looms ever larger over Europe.",
    "Fashion in this period reflects both the elegance and restraint of the late 1930s. Men are seen in tailored three-piece suits made of sturdy wool, complemented by flat caps and silk ties, while women favor tea dresses that highlight their waistlines, often paired with knitted cardigans and cloche hats. The atmosphere is one of carefully curated appearances, where social expectations dictate not only attire but comportment, and the strains of jazz music from the radio underscore the tension simmering beneath the surface of polite society.",
    "Daily life in January 1939 is shaped by the rhythms of winter, where cozy indoor activities dominate. Families gather for card games by the fire, or engage in spirited discussions about the news of the day, often punctuated by the crackle of a wireless radio announcing the latest developments in Europe. The recent economic recovery is palpable in the streets, yet the shadow of the Great Depression lingers, reminding everyone of the fragility of their current fortunes. Amidst these challenges, social rituals such as Sunday family dinners and afternoon tea provide solace and connection, a reminder of the importance of maintaining tradition in uncertain times."
  ],
  "note": "",
  "cost": 0.00108099255,
  "durationMs": 14374
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A family gathering at the estate for a will reading amidst the economic strain of the Great Depression forces heirs and staff to confront their ambitions and resentments under the watchful eye of societal expectations.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class tensions rise as the wealthy navigate financial collapse while traditional gender roles influence the dynamics within the household."
  },
  "setting": {
    "location": "A large manor house set in a sprawling estate in the British countryside.",
    "institution": "Country house estate",
    "weather": "Overcast with occasional rain, typical of the British countryside in the fall."
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
      "description": "The clock in the study shows it was stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time displayed on the clock is crucial for determining the time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The clock's stopped time does not match witness accounts of the time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This indicates a discrepancy that needs to be addressed.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Witnesses recall the clock striking the hour at an odd time.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This suggests that the clock may not be reliable.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The inconsistency in the clock's striking times suggests tampering.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This raises questions about the integrity of the timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Dr. Mallory Finch was seen near the clock shortly before Eleanor's death.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This raises suspicion about Dr. Mallory Finch's involvement.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The proximity to the clock raises suspicion about their involvement.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This suggests a potential motive related to the clock.",
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
      "description": "The clock's stopped time does not match witness accounts of the time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This indicates a discrepancy that needs to be addressed.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at a different location during the time of death.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This provides a corroborated alibi for Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock was deliberately wound back to create a false timeline of events.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This reveals the core mechanism of the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock striking times remains a late texture detail in the case background.",
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
      "description": "Everyone thought Eleanor's death must align with the last time the align struck.",
      "supportsAssumption": "Eleanor's death must align with the last time the clock struck.",
      "misdirection": "This misleads by suggesting a direct connection between the align's eleanors and the time of death, while the true mechanism is more complex."
    },
    {
      "id": "rh_2",
      "description": "The central fixture in the house had been adjusted just before the incident.",
      "supportsAssumption": "Eleanor's death must align with the last time the clock struck.",
      "misdirection": "This implies a change that could be related to the timekeeping, but it does not directly connect to the murder."
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
      "clue_4"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain",
      "clue_mechanism_visibility_core"
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
  "latencyMs": 13108,
  "cost": 0.00310428525
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
