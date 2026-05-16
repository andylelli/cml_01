# Actual Prompt Record

- Run ID: `mystery-1778704715333`
- Project ID: ``
- Timestamp: `2026-05-13T20:41:47.184Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `ef8ab965f2abd5d2`

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
    "author": "Unknown",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Country Estate",
      "country": "England",
      "institution": "Manor house"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "clock-tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Wealthy socialite and host of the event",
      "private_secret": "Keen observer with a passion for solving puzzles",
      "motive_seed": "Desire for justice and truth",
      "motive_strength": "strong",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "attending the auction",
        "access to the clock room"
      ],
      "behavioral_tells": [
        "sharp attention to detail",
        "curiosity about the clock"
      ],
      "stakes": "Solving the murder for justice",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "witness",
      "relationships": [],
      "public_persona": "Respected physician and socialite",
      "private_secret": "Has been in financial troubles",
      "motive_seed": "Desperation for money",
      "motive_strength": "moderate",
      "alibi_window": "Between 8:00 PM and 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "attending the auction",
        "familiarity with the estate"
      ],
      "behavioral_tells": [
        "nervousness when discussing finances"
      ],
      "stakes": "Reputation at stake",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "Charming military officer",
      "private_secret": "Involved in illegal gambling",
      "motive_seed": "Need to cover debts",
      "motive_strength": "high",
      "alibi_window": "Between 8:00 PM and 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "attending the auction",
        "frequent visitor to the estate"
      ],
      "behavioral_tells": [
        "defensive when questioned"
      ],
      "stakes": "Avoiding scandal",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "Housekeeper with a troubled past",
      "private_secret": "Once involved in a theft at a previous estate",
      "motive_seed": "Fear of losing her job",
      "motive_strength": "moderate",
      "alibi_window": "Between 8:00 PM and 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "access to all rooms",
        "knowledge of household routines"
      ],
      "behavioral_tells": [
        "frequently looks anxious"
      ],
      "stakes": "Job security",
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
      "summary": "During a charity auction at the Voss estate, Eleanor Voss is found dead in the clock room. As tensions rise among the guests, Eleanor, acting as the detective, uncovers the mystery of the clock-tampering that obscured the time of death, revealing the true culprit."
    },
    "accepted_facts": [
      "Eleanor Voss was found dead in the clock room.",
      "The clock displayed a time inconsistent with witness testimonies.",
      "The guests were present in the manor during the murder."
    ],
    "inferred_conclusions": [
      "The time of death was manipulated to create an alibi.",
      "One of the guests tampered with the clock."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, tamper, and display to expose the false timing.",
      "delivery_path": [
        {
          "step": "The clock was set back to mislead witnesses about the time of death."
        },
        {
          "step": "The killer used this tampering to establish a false alibi."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is revealed, implicating Captain Ivor Hale."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred after the auction ended, making the timeline clear.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses all recall being present during the auction's conclusion.",
    "what_it_hides": "The clock was tampered with to suggest otherwise."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Auction began at 7:00 PM",
        "Auction ended at 8:00 PM",
        "Eleanor found at 8:15 PM"
      ],
      "windows": [
        "8:00 PM to 8:30 PM"
      ],
      "contradictions": [
        "Witnesses claim they saw Eleanor in the auction room until 8:05 PM, yet she was found dead at 8:15 PM."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "The clock",
        "Eleanor's room",
        "Auction room"
      ],
      "permissions": [
        "All guests had access to the main estate."
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be tampered with.",
        "Time displayed can be manipulated by setting."
      ],
      "traces": [
        "Scrape marks on the clock's winding mechanism."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust each other due to social standing."
      ],
      "authority_sources": [
        "Eleanor was the host and authority figure."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock displayed a time of ten minutes to eight.",
        "correction": "Eleanor could not have been alive after that time if she was found dead at 8:15.",
        "effect": "Narrows timeline of death significantly.",
        "required_evidence": [
          "Auction began at 7:00 PM",
          "Eleanor found at 8:15 PM",
          "Witnesses claim they saw Eleanor in the auction room until 8:05 PM"
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock hands were misaligned with the expected time.",
        "correction": "The clock was tampered with to suggest a later time than actual.",
        "effect": "Eliminates the possibility that Eleanor was alive after the auction.",
        "required_evidence": [
          "Scrape marks on the clock's winding mechanism",
          "Witnesses' statements about the auction timing"
        ],
        "reader_observable": true
      },
      {
        "observation": "A note was found revealing the original time of an important meeting.",
        "correction": "The meeting time contradicts the clock's displayed time.",
        "effect": "Narrows suspect pool to those aware of the tampering.",
        "required_evidence": [
          "The note detailing the meeting time",
          "Witness statements about the auction's end time"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the clock's time with the noted meeting time reveals the tampering.",
    "knowledge_revealed": "The clock was set back to mislead regarding the time of death.",
    "pass_condition": "The actual time of death is shown as earlier than the clock displayed.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock time and witness statements (early) let the reader see the timeline discrepancy. Step 2: The scrape marks on the clock (mid) confirm tampering. Step 3: The note about the meeting time (discriminating test) reveals the manipulation behind the alibi."
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
        "Observe the evidence revealed",
        "Draw conclusion about guilt"
      ],
      "test_type": "temporal trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Medical alibi confirmed during auction timing.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Housekeeper's routine confirmed by multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
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
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation of the clock"
      },
      {
        "clue_id": "clue_early_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements about the auction"
      },
      {
        "clue_id": "clue_1",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Discovery of the scrape marks"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Finding the note"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a captivating socialite, renowned for her charitable endeavors and graceful presence in Little Middleton's elite circles. However, beneath her polished exterior lies a turbulent secret that threatens her very status.",
    "publicPersona": "Charming and gracious, a pillar of local charity events.",
    "privateSecret": "Struggling financially due to her husband's gambling debts.",
    "motiveSeed": "Wants to protect her status and prevent scandal from ruining her social standing.",
    "motiveStrength": "compelling",
    "alibiWindow": "Attended a dinner party from eight to ten, but slipped away briefly to confront the victim.",
    "accessPlausibility": "easy",
    "stakes": "Her reputation and financial security are at risk.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a refined cadence, often punctuating her sentences with a subtle laugh, as if the world were a stage and she, its leading lady. She employs an array of idiomatic phrases, especially when under pressure, to cloak her true feelings.",
    "internalConflict": "Eleanor grapples with a growing discontent, torn between her desire to uphold her social facade and the reality of her crumbling financial situation. The fear of exposure weighs heavily on her, as she knows that any hint of scandal could unravel the carefully woven tapestry of her life.",
    "personalStakeInCase": "This crime matters deeply to Eleanor as it could expose her husband’s debts, leading to a social scandal that would obliterate her status and financial security.",
    "paragraphs": [
      "Eleanor Voss glided through the opulent drawing room, her laughter a melodious counterpoint to the clinking of crystal glasses. To the casual observer, she was the epitome of grace, effortlessly charming the local elite with her anecdotes of charity work and philanthropy. Yet, beneath the surface of her poised demeanor, Eleanor was embroiled in a desperate struggle, one that threatened to unravel the very fabric of her existence. The whispers of her husband’s gambling debts haunted her, a specter lurking behind every smile and polite conversation.",
      "As she engaged in light banter with the other guests, her mind raced with calculations of how to maintain her social standing amidst the chaos. Each compliment she received felt like a double-edged sword, for the more praise she garnered, the deeper the chasm of her financial woes became. Eleanor was painfully aware that one wrong move could send her spiraling into disgrace, and with a heart heavy with the burden of secrets, she resolved to confront the truth, if only to safeguard her carefully constructed world.",
      "The dinner party had been a welcome distraction, yet the moment she slipped away to confront the victim, her heart pounded with both fear and resolve. The confrontation was a gamble in itself, much like her husband’s reckless games of chance. If the victim revealed her husband’s indiscretions, Eleanor's world would collapse, and her carefully curated image would shatter like glass. In that moment, she understood that she was not merely a socialite but an amateur sleuth, unwilling to let her fate be dictated by the whims of others.",
      "Eleanor’s journey from passive observer to proactive investigator began to unfold as she navigated the treacherous waters of Little Middleton’s social elite. With each revelation, her inner strength emerged, challenging her to confront both her husband’s failings and her own complicity in maintaining the status quo. She was no longer just a charming figure at charity events; she was a woman determined to reclaim her narrative, even if it meant exposing the secrets that lay hidden beneath the polished surface of her life."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician in Little Middleton, known for his philanthropic contributions to healthcare. However, his life is marred by a clandestine affair that could destroy both his reputation and his heart.",
    "publicPersona": "Respected doctor, known for philanthropic interests in local healthcare.",
    "privateSecret": "In a covert affair with Eleanor's husband, jeopardizing Eleanor's position.",
    "motiveSeed": "Desires to secure his own reputation and avoid exposure of his affair.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in his office for a late-night consultation, but could have returned in time.",
    "accessPlausibility": "unlikely",
    "stakes": "His career could be ruined if the affair comes to light.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with measured precision, often punctuating his observations with dry, ironic comments. He has a tendency to adjust his spectacles when nervous, a subtle hint at the tension simmering beneath his composed exterior.",
    "internalConflict": "Dr. Finch is torn between his feelings for Eleanor's husband and the moral implications of his actions. He fears that exposure will not only ruin his career but also devastate Eleanor, whom he respects deeply.",
    "personalStakeInCase": "The crime is of personal significance to Dr. Finch, as it directly threatens his clandestine relationship and the stability of his professional life. The fallout could lead to public disgrace and loss of his medical practice.",
    "paragraphs": [
      "Dr. Mallory Finch stood in his office, the dim light casting shadows across the room as he reviewed patient charts with a furrowed brow. To the outside world, he was the epitome of a dedicated physician, revered for his contributions to local healthcare. Yet, behind closed doors, he wrestled with a secret that gnawed at his conscience and threatened to unravel his carefully constructed life. The affair with Eleanor’s husband had begun innocently enough—a shared moment of vulnerability—but it had spiraled into a web of deception that left him feeling ensnared.",
      "His reputation as a respected doctor was built on trust and integrity, yet the specter of exposure loomed large. Every patient consultation felt like a ticking clock, each second bringing him closer to the inevitable moment when the truth would emerge. He often found himself musing on the irony of his situation: a man sworn to heal and protect, now entangled in a scandal that could destroy everything he held dear. It was a precarious balance, one he navigated with a sardonic wit that masked the turmoil within.",
      "The night of the incident, he had been in his office for a late-night consultation, but the truth was, he could have returned in time to intervene. The thought gnawed at him, a relentless reminder of his moral failings. As he mulled over the events, he felt a pang of guilt for the pain his actions could inflict on Eleanor, whose unwavering support of local charities he had always admired. He was aware that his desires had set off a chain reaction that could lead to ruin, not just for himself but for the woman he had come to respect.",
      "Dr. Finch’s journey through this mystery was one of introspection and moral reckoning. He had to confront the duality of his existence: the esteemed doctor and the flawed man. Each piece of evidence he uncovered would force him to confront not only the potential fallout of his affair but also the question of what kind of man he truly wanted to be. As the stakes escalated, he found himself at a crossroads, where love and integrity clashed, and the resolution of the case would ultimately shape the course of his life."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer, proud of his service and connections, yet grappling with personal demons and financial woes that threaten to tarnish his esteemed reputation.",
    "publicPersona": "A proud war hero, often boasting about his service and connections.",
    "privateSecret": "Struggling with PTSD and deeply in debt from a failed investment.",
    "motiveSeed": "Desperately needs money and sees the victim's wealth as a potential solution.",
    "motiveStrength": "weak",
    "alibiWindow": "Claims to have been in the library reading, with no one to verify.",
    "accessPlausibility": "possible",
    "stakes": "His social standing is threatened by financial ruin.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks with a booming voice, often punctuating his tales of valor with grand gestures. He has a penchant for self-deprecation, frequently downplaying his accomplishments with a wry smile.",
    "internalConflict": "Captain Hale is caught in a battle between the proud image he projects and the reality of his mental health struggles and financial instability. The weight of his past haunts him, complicating his interactions with others.",
    "personalStakeInCase": "The crime is personally significant for Captain Hale, as the financial implications of the victim's wealth could offer a way out of his mounting debts and restore his tarnished reputation.",
    "paragraphs": [
      "Captain Ivor Hale sat in the library, surrounded by tomes that chronicled the gallant exploits of naval heroes. His chest swelled with pride as he recounted tales of bravery, often embellishing them with a flourish that captivated his audience. To the townsfolk of Little Middleton, he was a war hero, a man of honor and prestige. Yet, behind the bravado lay a man besieged by the lingering shadows of war and a financial debacle that threatened to reduce him to a mere footnote in the annals of society.",
      "The whispers of his mounting debts echoed in his mind, a constant reminder of the precariousness of his situation. He had invested in a venture that turned out to be a farce, leaving him scrambling to maintain the façade of a dignified gentleman. The thought of losing his social standing was unbearable, and desperation began to creep in, pushing him to consider the unthinkable—could the victim’s wealth be his salvation? It was a fleeting thought, one that he quickly dismissed with a self-deprecating chuckle, yet it lingered like a shadow on the edges of his consciousness.",
      "Claims of being in the library reading provided him with a flimsy alibi, yet he harbored a nagging doubt that it would not hold under scrutiny. The reality was that his time there was marred by the ghosts of his past, memories that resurfaced unbidden, stirring a cocktail of PTSD and regret. Each moment of silence was punctuated by the echoes of battle, reminding him that he was not merely a proud captain but a man grappling with his vulnerabilities.",
      "As the mystery unfolded, Captain Hale found himself at a crossroads. The stakes of the crime were not just about wealth but the restoration of his sense of self. He began to confront the duality of his existence, the proud war hero and the flawed man struggling to find his place in a world that had moved on without him. This journey could lead him to a place of humility, where he would learn to acknowledge his vulnerabilities rather than hide behind the armor of bravado."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an aspiring writer with ambitions of climbing the social ladder. However, her penchant for blackmail threatens to unravel her aspirations and expose her darker side.",
    "publicPersona": "Charming and eager to fit into high society, often seen at elite gatherings.",
    "privateSecret": "Has been blackmailing the victim based on a past secret.",
    "motiveSeed": "Wants to maintain her hold over the victim to secure her own place in society.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was attending a gathering in a different wing during the incident, but could have sneaked away.",
    "accessPlausibility": "possible",
    "stakes": "Fears losing her chance at social elevation if her blackmail is exposed.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a lively cadence, often punctuating her remarks with sharp wit. She has a tendency to lean in when speaking, creating an air of intimacy that belies her ulterior motives.",
    "internalConflict": "Beatrice is torn between her ambition to ascend the social ladder and the moral implications of her blackmail. The fear of exposure drives her actions, creating a tension that could lead to her downfall.",
    "personalStakeInCase": "This crime holds personal significance for Beatrice, as her blackmail scheme could be exposed, jeopardizing her aspirations and the social standing she has worked tirelessly to achieve.",
    "paragraphs": [
      "Beatrice Quill flitted through the party like a butterfly, her laughter bright and infectious as she mingled with the elite of Little Middleton. With dreams of becoming a celebrated writer, she was determined to carve out her place in high society. Her charm and charisma were her greatest assets, yet beneath the surface lay a darker ambition—one that involved a web of secrets and blackmail. The victim held a key to her ascension, and Beatrice was willing to do whatever it took to maintain her grip on that leverage.",
      "At the gathering, she spun tales of literary aspirations, her eyes sparkling with enthusiasm. Yet, the truth was far less glamorous; her success hinged on the victim’s silence regarding a past transgression. The thrill of her secret gave her a sense of power, but it was a precarious game, and each moment of intimacy with her peers was laced with the fear of exposure. She often found herself laughing a bit too loudly, a sardonic shield against the reality of her situation.",
      "During the incident, Beatrice had been attending a gathering in a different wing, but the possibility of sneaking away for a moment of mischief was always a tantalizing thought. Every time she found herself at the edge of a social event, she felt the pull of her ambitions battling against her conscience. The stakes were high; if her blackmail scheme were to be exposed, it would not only shatter her aspirations but also reveal the lengths she was willing to go to for acceptance.",
      "As the mystery unfolded, Beatrice faced a reckoning that could alter the course of her life. Would she cling to her ambitions at any cost, or would she confront the moral implications of her actions? This journey could lead her to a deeper understanding of herself, challenging her to reconcile her desire for acceptance with the truth of her choices. In the world of high society, where appearances often masked the truth, Beatrice would have to decide whether to continue her climb or to forge a new path free from the shadows of her past."
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
    "type": "Manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Little Middleton Manor is a sprawling estate that embodies the wealth of its owners, with an intricate layout that hides secrets and a sense of foreboding.",
    "visualDescription": "The manor's grand façade is an imposing blend of red brick and grey stone, adorned with ivy that clings stubbornly to its walls. Tall, narrow windows punctuate the structure, their glass panes reflecting the muted light of a typically overcast English sky, while the intricate wrought-iron gates lead to an expansive garden filled with fading blooms.",
    "atmosphere": "A palpable tension hangs in the air, underscored by the weight of secrets hidden within the estate's walls.",
    "paragraphs": [
      "Little Middleton Manor looms over the landscape, a relic of a bygone era, its sprawling wings casting long shadows over the meticulously maintained gardens. The air is thick with the scent of damp earth and decaying leaves, punctuated by the distant sound of a clock chiming, marking the passage of time in a place where every tick seems to echo with foreboding. The manor stands isolated, several miles from the nearest town, creating an atmosphere of unease as guests arrive under the watchful gaze of the ancestral portraits that line the grand hallway.",
      "Inside, the dimly lit corridors are lined with dark wood paneling, the soft glow of gas sconces barely illuminating the intricate carvings that tell stories of the past. The grand staircase spirals upward, its polished banister cool to the touch, leading to private quarters and sealed-off sections that harbor untold mysteries. The faint sound of typewriter keys clacking in the study mixes with the distant crackle of a radio, broadcasting news that heightens the tension in the air, hinting at the troubled times beyond the estate's walls.",
      "As evening falls, the manor transforms; candlelight flickers in the drawing room, casting dancing shadows that seem to whisper secrets of their own. The scent of tobacco mingles with the heavy aroma of polished wood, creating an atmosphere ripe with anticipation and dread. Guests gather, their conversations a low murmur, each word laden with unspoken thoughts, as the clock ticks steadily toward a revelation that could change everything.",
      "The gardens outside, once vibrant with life, now stand eerily still, the moon casting a silvery glow over the paths that wind through the hedgerows. The rustling of leaves is the only sound that breaks the silence, as if the very estate holds its breath, waiting for the inevitable clash of secrets to unfold. Little Middleton Manor is not just a home; it is a labyrinth of intrigue, where every corner could conceal a clue, and each shadow may harbor a truth waiting to be uncovered."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical for the English countryside in early autumn.",
    "timeFlow": "Three days of mounting tension as the clock ticks towards an inevitable confrontation.",
    "mood": "Tense, with an underlying sense of unease due to recent events in Europe.",
    "eraMarkers": [
      "Typewriters clatter in the study, filling the air with a rhythmic echo.",
      "A radio broadcasts fragmented news, casting a pall over the gathering.",
      "Petrol touring cars arrive, their engines muffled by the thick country air."
    ],
    "sensoryPalette": {
      "dominant": "The pervasive scent of damp earth and decay, a reminder of the changing seasons.",
      "secondary": [
        "The faint, lingering aroma of tobacco smoke from the drawing room.",
        "The crisp, musty scent of old books in the library."
      ]
    },
    "paragraphs": [
      "The atmosphere of Little Middleton Manor is thick with unspoken tension, an echo of the world outside that seeps into its very walls. The overcast sky casts a shadow over the estate, creating a sense of isolation that is both comforting and claustrophobic. The occasional patter of rain against the windows serves as a reminder of the storm brewing beyond the estate's manicured gardens, heightening the sense of anticipation and dread.",
      "Throughout the manor, the sounds of life are muted; whispers of conversation mingle with the distant ticking of clocks, each second stretching into an eternity. The air is heavy with the weight of history, secrets buried beneath layers of dust and time, waiting for the right moment to resurface. As guests gather, the atmosphere crackles with an electric energy, each person a potential player in a game where the stakes are life and death."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_hall",
      "name": "The Grand Hall",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The Grand Hall is a vast, airy space dominated by a sweeping staircase that leads to the upper levels. Ornate chandeliers hang from the ceiling, their crystals catching the light and scattering it across the polished marble floor.",
      "sensoryDetails": {
        "sights": [
          "High ceilings adorned with intricate plasterwork create a sense of grandeur, while portraits of stern ancestors gaze down from the walls.",
          "A large, intricately woven tapestry depicting a historical scene hangs prominently, its colors faded but still vibrant."
        ],
        "sounds": [
          "The echo of footsteps reverberates across the marble, each sound amplified by the hall's vastness.",
          "Occasional laughter from guests mingles with the distant sound of a piano being played in the drawing room."
        ],
        "smells": [
          "The faint scent of beeswax from the polished surfaces mingles with the musty aroma of old paper from nearby bookshelves.",
          "Hints of floral arrangements placed strategically throughout the hall provide a subtle contrast to the more earthy scents."
        ],
        "tactile": [
          "The coolness of the marble floor contrasts with the warmth of the wooden banister, inviting guests to touch the polished surface.",
          "The heavy fabric of the draperies, thick and luxurious, offers a tangible reminder of the manor's wealth."
        ]
      },
      "accessControl": "Accessible to all guests during gatherings; private areas are restricted to family and staff only after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain drips from the eaves, creating small puddles on the marble floor.",
            "The morning light struggles to penetrate the clouds, casting a muted glow."
          ],
          "sounds": [
            "The steady rhythm of rain against the windows creates a soothing backdrop.",
            "Distant thunder rumbles, hinting at the storm's approach."
          ],
          "smells": [
            "A fresh, clean scent of rain-soaked earth wafts through the open doors.",
            "The aroma of brewing tea fills the air, inviting warmth."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Dull light filters through the tall windows, casting long shadows across the floor.",
            "The mood is somber, with guests moving quietly through the hall."
          ],
          "sounds": [
            "The soft murmur of conversation blends with the occasional creak of old wood.",
            "A clock ticks steadily, marking the passage of time."
          ],
          "smells": [
            "Dust motes hang in the air, releasing a musty, ancient scent.",
            "The faint trace of tobacco smoke lingers, a reminder of recent guests."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight reflects off the polished surfaces, illuminating the hall with a warm glow.",
            "The silhouette of the grand staircase stands out against the darkening sky."
          ],
          "sounds": [
            "The soft strains of music from the drawing room filter in, creating a lively atmosphere.",
            "Laughter and chatter of guests create a vibrant backdrop."
          ],
          "smells": [
            "The sweet scent of dessert wafts in from the dining room, tempting the senses.",
            "Freshly polished wood gives off a warm, inviting aroma."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Hall serves as the first impression of Little Middleton Manor, its grandeur both inviting and intimidating. Guests often gather here, their hushed conversations echoing off the high ceilings, interspersed with the rhythmic ticking of clocks that seem to remind them that time is of the essence. The vastness of the space creates natural barriers, with the grand staircase acting as a separator, offering glimpses of the upper floors while maintaining an air of mystery.",
        "As the evening progresses, the atmosphere shifts, the hall becoming a stage for intrigue as guests navigate the delicate social hierarchy of the manor. The flickering candlelight casts long shadows, hiding intentions and secrets, making it a perfect setting for whispered confessions and furtive glances that could lead to unraveling the manor's dark mysteries."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The Library is a cozy yet imposing room filled with towering bookshelves that stretch from floor to ceiling, their dark wood lending an air of solemnity. A large oak desk sits in the center, piled with books and papers, while a plush armchair invites quiet contemplation.",
      "sensoryDetails": {
        "sights": [
          "The warm glow of a desk lamp illuminates the pages of an open book, casting a soft light on the surrounding shelves.",
          "Leather-bound volumes line the walls, their spines cracked and worn, hinting at years of use."
        ],
        "sounds": [
          "The soft rustle of pages turning breaks the silence, creating a sense of intimacy in the otherwise vast space.",
          "The distant sound of rain tapping against the window adds a melancholic note to the atmosphere."
        ],
        "smells": [
          "The rich, musty scent of old books permeates the air, mingling with the faint aroma of polished wood.",
          "A hint of lavender from a nearby potpourri adds a delicate freshness to the otherwise heavy atmosphere."
        ],
        "tactile": [
          "The smooth, cool surface of the desk contrasts with the rough texture of the book spines, inviting exploration.",
          "The softness of the armchair cushions provides a comforting embrace for those lost in thought."
        ]
      },
      "accessControl": "Restricted to family and select guests; locked when not in use to preserve its secrets.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the windowpanes, blurring the view of the garden outside.",
            "The dim light filters through the clouds, creating a somber mood."
          ],
          "sounds": [
            "The steady pitter-patter of rain creates a rhythmic backdrop, lulling visitors into a contemplative state.",
            "Occasional thunder rumbles softly in the distance."
          ],
          "smells": [
            "The scent of wet earth wafts in through the slightly open window, blending with the mustiness of the books.",
            "A hint of fresh coffee from the nearby kitchen adds warmth."
          ],
          "mood": "reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is muted, casting soft shadows across the room, enhancing the sense of solitude.",
            "Dust particles dance in the beams of light breaking through the cloud cover."
          ],
          "sounds": [
            "The silence is punctuated by the occasional creak of the house settling, adding to the feeling of isolation.",
            "The clock in the hallway ticks steadily, a reminder of the passing time."
          ],
          "smells": [
            "The heavy scent of aged paper lingers, mingling with the faintest hint of tobacco smoke.",
            "A whiff of leather from the book covers adds richness to the air."
          ],
          "mood": "suspenseful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of the lamp casts an inviting light, contrasting with the darkening sky outside.",
            "Shadows stretch across the floor as the sun sets, creating a play of light and dark."
          ],
          "sounds": [
            "The soft ticking of a nearby clock is almost hypnotic, emphasizing the stillness of the room.",
            "The distant sound of laughter from the drawing room seeps through the door, a reminder of the socializing outside."
          ],
          "smells": [
            "The comforting aroma of burning wood from the fireplace envelops the room, creating a cozy atmosphere.",
            "The scent of fresh ink from a nearby fountain pen adds a touch of creativity to the air."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Library is a sanctuary of knowledge and secrets, its towering shelves filled with tomes that hold the weight of history. It is here that the threads of the mystery begin to unravel, as characters delve into the past, searching for clues that may lead them to the truth. The atmosphere is thick with unspoken words, each book a potential gateway to understanding the motives and desires of those who have walked these halls before.",
        "As the rain patters against the windows, the Library becomes a refuge, a place where the outside world's chaos fades away. The flickering light from the desk lamp creates a cocoon of warmth, inviting guests to explore the depths of both the books and their own thoughts. In this intimate setting, alliances are forged, and betrayals are whispered, as the true nature of Little Middleton Manor begins to reveal itself."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Social gathering",
      "visualDetails": "The Drawing Room is elegantly furnished with plush sofas and ornate chairs, arranged around a grand fireplace that serves as the room's focal point. Rich draperies frame the windows, and a grand piano sits in one corner, hinting at the social gatherings that take place here.",
      "sensoryDetails": {
        "sights": [
          "The room is filled with a rich palette of deep reds and golds, creating a warm and inviting atmosphere.",
          "Framed photographs of past family gatherings adorn the walls, each telling a story of joy and nostalgia."
        ],
        "sounds": [
          "The crackle of the fire in the hearth provides a comforting background noise, punctuated by the occasional laughter of guests.",
          "The sound of a piano playing softly fills the room, enhancing the ambiance of sophistication."
        ],
        "smells": [
          "The scent of burning wood mingles with the faint aroma of floral arrangements, creating a soothing olfactory experience.",
          "A hint of perfume lingers in the air, a reminder of the ladies who have graced the room."
        ],
        "tactile": [
          "The softness of the velvet upholstery invites guests to sink into the cushions, encouraging relaxation and conversation.",
          "The cool touch of the marble fireplace contrasts with the warmth of the room, creating a cozy enclave."
        ]
      },
      "accessControl": "Open to all guests during social gatherings; private conversations can occur in the evenings when the room is less crowded.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak the windows, blurring the view of the gardens outside.",
            "The room is dimly lit, with shadows dancing in the corners."
          ],
          "sounds": [
            "The sound of rain pattering against the roof creates a soothing rhythm.",
            "Occasional thunder rumbles in the distance, adding to the somber mood."
          ],
          "smells": [
            "The scent of damp earth infiltrates from outside, mixing with the rich aroma of polished furniture.",
            "A hint of fresh coffee from the kitchen wafts into the room."
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is soft and diffused, casting a gentle glow over the furnishings.",
            "The flickering flames in the fireplace cast moving shadows, enhancing the room's intimacy."
          ],
          "sounds": [
            "The low murmur of conversation creates a warm ambiance, filled with laughter and shared stories.",
            "The piano plays a soft melody, providing a backdrop to the social interactions."
          ],
          "smells": [
            "The scent of fresh flowers fills the room, adding a touch of life to the otherwise still air.",
            "The lingering aroma of tobacco smoke from the previous evening's gathering hangs faintly in the air."
          ],
          "mood": "cozy"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers, casting a golden glow across the room, creating an intimate atmosphere.",
            "The shadows elongate, making the room feel even more secluded."
          ],
          "sounds": [
            "Laughter and chatter fill the air, punctuated by the sound of clinking glasses as drinks are poured.",
            "The piano plays a lively tune, encouraging guests to dance."
          ],
          "smells": [
            "The scent of rich desserts wafts in from the dining room, tantalizing the senses.",
            "The aroma of aged whiskey mixes with the floral notes, creating a heady atmosphere."
          ],
          "mood": "festive"
        }
      ],
      "paragraphs": [
        "The Drawing Room is the heart of social activity at Little Middleton Manor, where guests gather to share stories and laughter. Its elegant furnishings and warm ambiance create an inviting atmosphere, encouraging both light-hearted banter and serious conversations. The flickering firelight dances off the walls, illuminating the framed photographs that capture moments of joy, serving as a reminder of the bonds formed within these walls.",
        "As the evening unfolds, the Drawing Room transforms into a stage for intrigue, with whispers and stolen glances exchanged between guests. The soft strains of music from the piano envelop the room, heightening the sense of anticipation as secrets simmer beneath the surface. In this space, where laughter coexists with tension, the true nature of the guests begins to reveal itself, setting the stage for the unraveling mystery."
      ]
    },
    {
      "id": "garden",
      "name": "The Garden",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "The Garden is a sprawling expanse of manicured hedges and flowerbeds, now tinged with the browns and golds of autumn. A stone pathway winds through the foliage, leading to a secluded gazebo that offers a quiet retreat from the manor's grandeur.",
      "sensoryDetails": {
        "sights": [
          "Faded blooms cling to their stems, their colors muted by the chill in the air, while fallen leaves carpet the ground.",
          "The gazebo, with its intricate latticework, stands as a quiet sentinel amidst the encroaching shadows of dusk."
        ],
        "sounds": [
          "The rustle of leaves in the gentle breeze creates a soft backdrop, occasionally interrupted by the distant call of a bird.",
          "The crunch of footsteps on gravel breaks the stillness, a reminder of life amidst the gathering gloom."
        ],
        "smells": [
          "The earthy scent of damp soil mixes with the faint sweetness of decaying petals, a reminder of the season's change.",
          "A hint of smoke from a nearby fireplace wafts through the garden, adding a comforting warmth to the crisp air."
        ],
        "tactile": [
          "The coolness of the stone pathway contrasts with the softness of the grass underfoot, inviting exploration.",
          "The rough texture of the gazebo's wooden beams provides a tactile reminder of nature's beauty."
        ]
      },
      "accessControl": "Accessible to all guests during daylight hours; restricted at night due to the potential for accidents in the dim light.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the petals of flowers, creating a glistening spectacle in the early light.",
            "The garden appears vibrant yet melancholic, each droplet a reminder of the impending winter."
          ],
          "sounds": [
            "The sound of rain pattering against the leaves creates a soothing rhythm, echoing the tranquility of the moment.",
            "Occasional thunder rumbles in the distance, a reminder of nature's power."
          ],
          "smells": [
            "The scent of fresh rain mingles with the earthy aroma of wet soil, creating a refreshing atmosphere.",
            "The delicate fragrance of blooming flowers is heightened by the moisture in the air."
          ],
          "mood": "serene"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The garden is shrouded in a muted light, shadows lengthening as the day progresses.",
            "The colors of the flowers appear dulled, a reflection of the somber mood."
          ],
          "sounds": [
            "The soft rustling of leaves creates a whispering sound that adds to the garden's air of mystery.",
            "Distant voices from the manor blend with the natural sounds, creating an atmosphere of tension."
          ],
          "smells": [
            "The scent of damp earth rises as the soil absorbs the moisture from the air, a grounding aroma.",
            "Hints of decay mix with the freshness of the air, reminding visitors of the cycle of life."
          ],
          "mood": "foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The last rays of sunlight illuminate the garden, casting long shadows that dance in the fading light.",
            "The gazebo stands out against the darkening sky, a beacon of tranquility amidst the gathering gloom."
          ],
          "sounds": [
            "The chirping of crickets begins to fill the air as daylight fades, creating a tranquil ambiance.",
            "The soft sound of footsteps on gravel echoes in the quiet, heightening the sense of solitude."
          ],
          "smells": [
            "The scent of evening blooms fills the air, sweet and intoxicating, inviting late-night wanderers.",
            "The aroma of smoke from distant chimneys wafts through, mingling with the floral notes."
          ],
          "mood": "mysterious"
        }
      ],
      "paragraphs": [
        "The Garden at Little Middleton Manor is a sprawling oasis of beauty and decay, a reflection of the changing seasons. As autumn settles in, the vibrant blooms fade, replaced by the browns and golds of fallen leaves that carpet the stone pathways. It is here, in this tranquil yet haunted space, that secrets lie hidden, waiting to be unearthed beneath the layers of nature's cycle.",
        "Secluded and serene during the day, the garden takes on a different character as dusk approaches. Shadows stretch and deepen, creating an atmosphere ripe for intrigue, as guests retreat to the gazebo for whispered conversations and stolen moments. The air thickens with unspoken words, and the scent of damp earth mingles with the sweet decay of autumn, setting the stage for a fateful encounter that could unravel the very fabric of the manor's secrets."
      ]
    }
  ],
  "note": "",
  "cost": 0.00297732435,
  "durationMs": 43763
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1934,
    "month": "March",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "March",
    "weather": [
      "Overcast skies with intermittent rain showers",
      "Cool temperatures averaging around 10°C (50°F)",
      "Occasional bursts of sunlight breaking through the clouds"
    ],
    "daylight": "Days are gradually lengthening, with daylight lasting until around six in the evening.",
    "time_of_day_of_crime": "Early evening — as the twilight settles over the landscape, creating an air of mystery.",
    "holidays": [
      "St. Patrick's Day (March 17)"
    ],
    "seasonalActivities": [
      "Spring cleaning in households as people shake off winter dust",
      "Preparing gardens for planting as the frost begins to thaw",
      "Attending local fairs or markets, which are popular in the lead-up to Easter"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Double-breasted navy suit with peak lapels",
        "White dress shirt with a stiff collar",
        "Silk tie featuring geometric patterns"
      ],
      "casual": [
        "Lightweight wool jumper in pastel colors",
        "Gray flannel trousers",
        "Brown leather brogues"
      ],
      "accessories": [
        "Homburg hat",
        "Leather gloves",
        "Pocket watch with a chain"
      ]
    },
    "womensWear": {
      "formal": [
        "Tea-length dress with a flared skirt and floral patterns",
        "Crisp white blouse with a high neckline",
        "Long, tailored coat in pastel shades"
      ],
      "casual": [
        "Knee-length skirt paired with a fitted cardigan",
        "Cotton blouse with puffed sleeves",
        "Practical lace-up shoes"
      ],
      "accessories": [
        "Cloche hat adorned with a ribbon",
        "Pearl necklace",
        "Leather handbag"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in architecture and design",
      "Rise of the 'New Woman' challenging traditional gender roles",
      "Interest in new film genres, particularly crime and mystery"
    ],
    "socialExpectations": [
      "Strict adherence to social hierarchies, especially in upper-class circles",
      "Expectation for women to dress modestly yet stylishly",
      "Men maintaining a polished appearance at all social events"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The rise of Adolf Hitler in Germany, causing concern across Europe",
      "Political tensions in Spain due to the ongoing civil strife",
      "The United Kingdom facing economic challenges and discussions surrounding unemployment"
    ],
    "politicalClimate": "A climate of anxiety and unrest, with rising fascism in Europe and the threat of war looming.",
    "economicConditions": "The Great Depression still affecting many, leading to widespread unemployment and poverty.",
    "socialIssues": [
      "Widespread strikes and protests in response to economic conditions",
      "Increased awareness and advocacy for women's rights",
      "Racial tensions and discussions around colonialism in British territories"
    ],
    "internationalNews": [
      "The League of Nations struggling to maintain peace amid rising tensions",
      "The United States' New Deal policies aiming to alleviate economic despair",
      "The recent establishment of the British Broadcasting Corporation (BBC) as a significant media outlet"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Cole Porter with hits like 'Anything Goes'",
        "George Gershwin's 'Rhapsody in Blue'",
        "The popularity of dance bands led by figures like Ambrose and Harry Roy"
      ],
      "films": [
        "The Thin Man, a classic mystery film released in 1934",
        "It Happened One Night, a romantic comedy gaining traction",
        "Murder on the Orient Express, stirring interest in crime stories"
      ],
      "theater": [
        "The musical 'Anything Goes' captivating audiences",
        "The influence of Agatha Christie’s works on stage adaptations",
        "Rising popularity of detective plays and whodunits"
      ],
      "radio": [
        "The BBC broadcasting news and entertainment programs",
        "Popular radio plays and mystery series captivating audiences",
        "Music hall performances and variety shows reaching households"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie's latest detective novels",
        "Dashiell Hammett’s hard-boiled crime fiction gaining popularity",
        "George Orwell's 'Burmese Days' reflecting colonial themes"
      ],
      "popularGenres": [
        "Detective fiction and crime mystery",
        "Social realism reflecting the struggles of the common man",
        "Romantic literature appealing to escapism"
      ]
    },
    "technology": {
      "recentInventions": [
        "Advancements in radio technology enhancing broadcast quality",
        "The typewriter as a standard office tool, streamlining communication",
        "Emerging use of forensic science in criminal investigations"
      ],
      "commonDevices": [
        "Home telephones becoming more widespread, yet still limited",
        "Typewriters in both professional and personal use",
        "Radios as a central entertainment source in households"
      ],
      "emergingTrends": [
        "Increased availability of public transportation systems",
        "Growing interest in automobiles as symbols of status",
        "Development of consumer goods aimed at the middle class"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of beer: six pence",
        "Cinema ticket: one shilling"
      ],
      "commonActivities": [
        "Attending community events and fairs as spring approaches",
        "Social visits among friends and family during weekends",
        "Engaging in gardening and outdoor activities as the weather improves"
      ],
      "socialRituals": [
        "Tea time as a daily social gathering",
        "Evening walks after dinner as a common practice",
        "The tradition of Sunday roasts as a family meal"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Strongly defined class distinctions affecting social interactions",
      "Upper classes maintaining exclusivity through private clubs and gatherings",
      "Working class facing stigma despite shared economic struggles"
    ],
    "gender": [
      "Traditional gender roles still prevalent, but slowly changing",
      "Women increasingly entering the workforce, yet facing opposition",
      "Expectations for women to balance work and domestic responsibilities"
    ],
    "race": [
      "Racial issues becoming more prominent in public discourse",
      "Colonial attitudes influencing perspectives on race",
      "Growing awareness of racial injustices in society"
    ],
    "generalNorms": [
      "Politeness and decorum expected in social settings",
      "Conformity to societal expectations regarding behavior and dress",
      "Discussions of political matters often avoided in polite company"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth and blooming flowers filled the air, mingling with the crispness of spring.",
    "The sound of raindrops pattering against window panes, an echo of the tension building outside.",
    "Faint music from radios wafted through the manor, a reminder of the world beyond its walls."
  ],
  "paragraphs": [
    "In March 1934, the English countryside awakens to the subtle promises of spring, though the overcast skies cast a pall over the landscape. Occasional rain showers dampen the earth, and the scent of wet soil and budding flowers fills the air, a stark contrast to the tensions brewing across Europe. The looming specter of fascism and political unrest creates an atmosphere thick with unease, as families gather to discuss the implications of distant events over cups of tea. The lengthening days offer a glimmer of hope, yet the worry of what might come next lingers like the clouds overhead.",
    "Fashion in this period reflects both practicality and elegance, with men donning double-breasted suits crafted from fine wool, complemented by crisp white shirts and silk ties adorned with geometric patterns. Women embrace tea-length dresses with flared skirts and floral designs, often paired with the latest cloche hats that add a touch of sophistication. The social expectations are steeped in tradition, yet the rising 'New Woman' challenges norms, bringing a fresh perspective to the styles and attitudes of the time.",
    "Daily life in March 1934 is marked by a mix of routine and social ritual. Households engage in spring cleaning as they prepare for the season of renewal, while gardens are tended to, hinting at the promise of blooms. As families gather for their Sunday roasts, discussions of the outside world are often muted, overshadowed by the pressing realities of the Great Depression. However, the allure of the cinema or a radio play provides an escape, offering a brief respite from the struggles of the day. Amidst this backdrop of societal change, the tension of class distinctions remains palpable, influencing interactions and experiences across the spectrum of society."
  ],
  "note": "",
  "cost": 0.0012830350499999999,
  "durationMs": 15446
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a wealthy estate for a charity auction unites heirs and socialites under the strain of the Great Depression, where class tensions and political unrest heighten the stakes of their hidden agendas.",
  "era": {
    "decade": "1930s",
    "socialStructure": "A rigid class hierarchy exacerbated by economic hardship, where wealth dictates social interactions and personal loyalties are tested amid growing fears of political instability."
  },
  "setting": {
    "location": "A sprawling country estate with multiple wings and formal gardens, isolated several miles from the nearest town.",
    "institution": "Manor house",
    "weather": "Overcast with occasional rain, typical for the English countryside in early autumn."
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
    "id": "original_meeting_time",
    "value": "a quarter past ten",
    "description": "The scheduled time of an important meeting that contradicts the clock’s tampered reading"
  },
  {
    "id": "murder_time",
    "value": "twenty minutes past eleven",
    "description": "The actual time of the murder as deduced from witness accounts"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock displayed a time of ten minutes to eight.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Indicates the time just before the auction ended.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "Eleanor could not have been alive after that time if she was found dead at eight fifteen in the morning.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Contradicts the timeline of Eleanor's death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock hands were misaligned with the expected time.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Suggests tampering with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The clock was tampered with to suggest a later time than actual.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Indicates deliberate manipulation of time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "A note was found revealing the original time of an important meeting.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Establishes the correct timeline for events.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The meeting time contradicts the clock's displayed time.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Reveals discrepancies in the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
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
      "id": "clue_early_1",
      "category": "behavioral",
      "description": "Witnesses recall seeing Captain Ivor Hale near the clock during the auction.",
      "sourceInCML": "CASE.prose_requirements.clue_to_scene_mapping[0].clue_id",
      "pointsTo": "Establishes Hale's presence at the scene.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_early_2",
      "category": "testimonial",
      "description": "Witnesses claim they saw Eleanor in the auction room until eight five in the evening.",
      "sourceInCML": "CASE.prose_requirements.clue_to_scene_mapping[1].clue_id",
      "pointsTo": "Confirms Eleanor's timeline before her death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_mid_1",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was attending to guests in another room during the auction.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Provides a corroborated alibi for Dr. Mallory Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_mid_2",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was seen leaving the auction room at seven fifty in the evening.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Provides a corroborated alibi for Beatrice Quill.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Auction began at seven o'clock in the evening remains a late texture detail in the case background.",
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
      "description": "Some believe the murder occurred after the auction ended, making the timeline clear.",
      "supportsAssumption": "The murder occurred after the auction ended.",
      "misdirection": "This misleads by suggesting that the auction timeline is irrelevant."
    },
    {
      "id": "rh_2",
      "description": "Rumors making that auction was seen ended after the auction ended, which complicates the timeline.",
      "supportsAssumption": "The murder occurred after the auction ended.",
      "misdirection": "This misleads by implying that auction's presence at the auction is crucial to the timeline."
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
      "clue_early_1",
      "clue_early_2"
    ],
    "mid": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_culprit_direct_captain_ivor_hale",
      "clue_mid_1",
      "clue_mid_2"
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
  "latencyMs": 14253,
  "cost": 0.00311810235
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
