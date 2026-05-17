# Actual Prompt Record

- Run ID: `mystery-1778787415818`
- Project ID: ``
- Timestamp: `2026-05-14T19:39:56.201Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `0652055fbd51856b`

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
    "author": "ChatGPT",
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
      "role_archetype": "detective",
      "relationships": [
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (acquaintance)",
        "Beatrice Quill (housekeeper)"
      ],
      "public_persona": "Intelligent and observant niece of Lord Percival Voss",
      "private_secret": "Estranged from her uncle due to family disputes",
      "motive_seed": "Desire for family reconciliation",
      "motive_strength": "moderate",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "personal access to the manor",
        "knowledge of family routines"
      ],
      "behavioral_tells": [
        "calm under pressure",
        "strong attention to detail"
      ],
      "stakes": "Establish family honor and uncover truth",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "doctor",
      "relationships": [
        "Eleanor Voss (friend)",
        "Captain Ivor Hale (colleague)",
        "Beatrice Quill (housekeeper)"
      ],
      "public_persona": "Respected physician with a calm demeanor",
      "private_secret": "Has a past relationship with the victim",
      "motive_seed": "Possibly monetary gain from inheritance",
      "motive_strength": "weak",
      "alibi_window": "Between 10:00 and 11:00",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Visits to the manor for medical consultations"
      ],
      "behavioral_tells": [
        "Occasional nervousness when discussing the victim"
      ],
      "stakes": "Protect reputation and avoid scandal",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "military officer",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (colleague)",
        "Beatrice Quill (staff)"
      ],
      "public_persona": "Charismatic and charming officer",
      "private_secret": "Has a hidden gambling debt",
      "motive_seed": "Desperation to cover debts",
      "motive_strength": "moderate",
      "alibi_window": "Between 10:30 and 11:30",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Frequent visits to the estate for leisure"
      ],
      "behavioral_tells": [
        "Fidgeting when money is mentioned"
      ],
      "stakes": "Avoid financial ruin",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "50-60",
      "role_archetype": "housekeeper",
      "relationships": [
        "Eleanor Voss (niece)",
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (guest)"
      ],
      "public_persona": "Loyal and dedicated staff member",
      "private_secret": "Witnessed a confrontation between the victim and one of the guests",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "Between 10:00 and 11:00",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Daily access to the manor and its occupants"
      ],
      "behavioral_tells": [
        "Calm and collected under pressure"
      ],
      "stakes": "Protect her job and reputation",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
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
      "summary": "A family gathering at the Voss manor turns deadly when Lord Percival Voss is found murdered, leading his niece Eleanor to uncover a web of deception involving mechanical tampering with time itself."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock in the manor was tampered with to show a false time, misleading the timeline of the murder.",
      "delivery_path": [
        {
          "step": "The clock was wound back forty minutes before the murder, allowing the culprit to create an alibi."
        }
      ]
    },
    "outcome": {
      "result": "The false timeline leads to misinterpretation of the murder's timing, implicating an innocent party."
    }
  },
  "false_assumption": {
    "statement": "The victim must have been murdered after the clock showed ten minutes past eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appeared functional and consistent with witness statements.",
    "what_it_hides": "The actual time of the murder was earlier than indicated due to the tampering."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The clock's striking time",
        "Witnesses' last sighting of the victim"
      ],
      "windows": [
        "Between 10:00 and 11:00"
      ],
      "contradictions": [
        "Witnesses recall the victim being seen alive at 10:30, but the clock shows a later time."
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
        "The clock",
        "The murder weapon"
      ],
      "permissions": [
        "All guests had access to the manor during the evening."
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be tampered with to display incorrect times."
      ],
      "traces": [
        "Faint scratches on the clock casing indicating tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Family relationships",
        "Social hierarchy among guests"
      ],
      "authority_sources": [
        "The estate owner, Lord Percival Voss"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the main hall shows ten minutes past eleven.",
        "correction": "The clock was tampered with, suggesting the time displayed is not accurate.",
        "effect": "Narrows the suspect pool by questioning the last known times of the guests.",
        "required_evidence": [
          "Witness statements about the clock's time.",
          "Visible tampering marks on the clock."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall seeing Lord Percival Voss alive at 10:30.",
        "correction": "This contradicts the clock's time showing the murder happened after 11:00.",
        "effect": "Eliminates Beatrice Quill as a suspect, as she was not present after that time.",
        "required_evidence": [
          "Witness statements about the victim's last sighting.",
          "Eleanor Voss's recollection of events."
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock's hands appear slightly askew from normal position.",
        "correction": "The tampering indicates a deliberate effort to mislead the timeline.",
        "effect": "Narrows the timeline window for possible suspects.",
        "required_evidence": [
          "Physical examination of the clock.",
          "Accounts of all guests' whereabouts."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled comparison of the clock's time with the witness accounts reveals discrepancies in timing that only implicate Captain Ivor Hale.",
    "knowledge_revealed": "The revealed facts are murder, clock, and minut.",
    "pass_condition": "If Hale's timing contradicts the clock's time, he is proven guilty.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_9"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's tampering marks and witness statements about the time lead the reader to suspect foul play. Step 2: The last sighting of the victim eliminates Beatrice Quill as a suspect. Step 3: The analysis of the clock's position and timing reveals the true sequence of events."
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
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness account proves she was not present after 10:30",
        "supporting_clues": [
          "clue_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by other guests",
        "supporting_clues": [
          "clue_1"
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
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_10",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Physical examination of the clock"
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
        "clue_id": "clue_11",
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
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
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
    "summary": "Eleanor Voss is a respected local historian whose passion for her community's past conceals a turbulent family legacy. As she delves into a potential inheritance issue, she uncovers secrets that could redefine her identity.",
    "publicPersona": "Eleanor is known as a dedicated scholar of Little Middleton's history, often seen at town meetings and giving lectures on local lore. Her refined manners and articulate speech earn her respect among the townsfolk, who appreciate her commitment to preserving their heritage.",
    "privateSecret": "Beneath her polished exterior, Eleanor grapples with the shame of her family's disastrous financial past, which she fears could come to light and tarnish her reputation. This hidden truth weighs heavily on her, fueling her desire to uncover the truth about her family's legacy.",
    "motiveSeed": "The recent changes in the will of her estranged relative have sparked Eleanor's investigation, as she suspects these alterations may jeopardize her family's already precarious financial situation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Eleanor was in the manor's library from eight o'clock until the scream was heard, poring over dusty tomes and records, lost in the intricacies of her family's history.",
    "accessPlausibility": "easy",
    "stakes": "For Eleanor, this investigation is not just about money; it's about reclaiming her family's honor and uncovering the truth that has long been buried.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks in a measured tone, often pausing to consider her words carefully. She has a penchant for using historical references to illustrate her points, which can come across as both enlightening and slightly pretentious.",
    "internalConflict": "Eleanor is tormented by the fear that her family's past will overshadow her present. She struggles with the desire to protect her family's legacy while being drawn to the truth, which may shatter the carefully constructed façade she has maintained.",
    "personalStakeInCase": "This crime matters deeply to Eleanor because it is intricately tied to her family's legacy, and she is determined to uncover the truth, not only for herself but for the generations that came before her.",
    "paragraphs": [
      "Eleanor Voss stood in the dusty library of the manor, the scent of old parchment and leather binding surrounding her like a comforting embrace. The flickering candlelight illuminated the spines of countless books, each containing a fragment of Little Middleton's story. As a local historian, she had dedicated her life to unearthing these tales, but today, her mind was clouded by the unsettling changes in her family's will. The thought of her family's financial ruin loomed over her like a dark cloud, threatening to unleash its storm at any moment.",
      "Her public persona as a respected community member was a mask she wore with pride, but underneath it lay a tumultuous reality. Eleanor harbored a secret that twisted her stomach in knots: her family's disastrous financial past. The estate that had once been a symbol of their prominence now felt like a shackle, binding her to a legacy she wished to escape. The prospect of unearthing hidden truths about her lineage filled her with both dread and determination.",
      "As she pored over the musty records, Eleanor's mind raced with possibilities. The recent changes in the will had ignited a fire within her, compelling her to investigate the motives behind them. Was it mere coincidence that they coincided with the death of a man whose life had been intertwined with her family's history? The thought sent a shiver down her spine, and she resolved to uncover the truth, no matter the cost.",
      "Little did she know that her quest for answers would not only expose the intricate web of deceit surrounding her family's past but also challenge her very identity. The investigation would force Eleanor to confront her fears and ultimately decide what kind of legacy she wished to leave behind. Would she succumb to the shadows of her family's history, or would she emerge as the architect of her own destiny?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is an ambitious physician with aspirations to climb the social ladder, whose secret affections for Eleanor Voss complicate his motives. His desire for wealth and status drives him to consider drastic measures.",
    "publicPersona": "Mallory is seen as a rising star in the local medical community, known for his dedication to his patients and his charming smile. He attends social functions with a practiced ease, always seeking opportunities to network and elevate his standing among the elite.",
    "privateSecret": "Beneath his polished exterior, Mallory harbors a secret affection for Eleanor, which he views as a means to secure his future. This clandestine courtship is driven more by ambition than love, as he seeks access to her family's wealth.",
    "motiveSeed": "The recent murder of a man who opposed his social ambitions has left Mallory feeling cornered, leading him to contemplate eliminating the obstacle that stands in his way.",
    "motiveStrength": "weak",
    "alibiWindow": "Mallory claimed to be in the garden making house calls to patients during the time of the murder, a story that may not hold up under scrutiny.",
    "accessPlausibility": "possible",
    "stakes": "For Mallory, the stakes are high; his reputation and future depend on marrying into wealth, and he is willing to do whatever it takes to secure that goal.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a smooth, almost rehearsed cadence, often using charming quips to deflect serious questions. He has a tendency to over-explain his actions, revealing a nervousness beneath his confident façade.",
    "internalConflict": "Mallory struggles with the duality of his affections for Eleanor and his ruthless ambition. He fears that his desire for status may ultimately lead him to betray the very person he claims to care for.",
    "personalStakeInCase": "This crime matters to Mallory because it threatens his carefully crafted plans for social ascendency. If the truth about his motives were to come out, it would ruin not only his reputation but also his chances of marrying into wealth.",
    "paragraphs": [
      "Dr. Mallory Finch leaned against the garden wall, the moonlight casting shadows across his handsome features. He had always been the ambitious type, drawn to the allure of high society like a moth to a flame. As a physician, he had worked tirelessly to establish himself, but beneath the surface lay a desperation that gnawed at him. The recent murder of a man who had opposed his social ambitions had thrown his plans into disarray, leaving him feeling vulnerable and exposed.",
      "His public persona as a charming doctor was a carefully curated mask, hiding the turmoil within. Mallory's secret courtship of Eleanor Voss was driven not by genuine affection but by a desire to secure his future. The Voss family held the key to the wealth and status he craved, and he was willing to do whatever it took to unlock that door. Yet, as he gazed at Eleanor, he found himself torn between his ambitions and the growing feelings he had for her.",
      "In the days following the murder, Mallory's mind raced with possibilities. What if the victim had discovered his intentions? What if the affair between Eleanor and the victim had come to light? The thought sent a chill down his spine, and he resolved to eliminate any threats to his carefully constructed plans. But with every passing moment, he felt the weight of his choices pressing down on him, forcing him to confront the man he had become.",
      "As he stood in the garden, contemplating the implications of his actions, Mallory realized that he was at a crossroads. Would he choose the path of ambition, even if it meant sacrificing his integrity, or would he find the courage to confront his true motivations? The answer would determine not only his future but also the fate of those he had come to care for."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer whose commanding presence in the community belies a deep-seated grudge against the murder victim. His past grievances shape his actions as he grapples with issues of honor and legacy.",
    "publicPersona": "Ivor is a respected figure in Little Middleton, known for his stoic demeanor and unwavering sense of duty. His military background lends him an air of authority, and he is often sought after for advice and guidance in community matters.",
    "privateSecret": "Beneath his stoic exterior lies a simmering resentment towards the victim, who he believes has tarnished his family's honor through past grievances during the war.",
    "motiveSeed": "Ivor's deep-seated belief that the victim's actions have dishonored his family drives him to consider taking matters into his own hands.",
    "motiveStrength": "strong",
    "alibiWindow": "Ivor claimed to be on a walk around the estate grounds during the time of the murder, a statement that raises doubts among those who know him.",
    "accessPlausibility": "unlikely",
    "stakes": "For Ivor, the stakes are nothing short of his family's reputation and legacy, which he believes are on the line due to the victim's actions.",
    "humourStyle": "blunt",
    "humourLevel": 0.2,
    "speechMannerisms": "Ivor speaks in a direct, no-nonsense manner, often cutting through pleasantries to get to the heart of the matter. His sentences are often short and clipped, reflecting his military background.",
    "internalConflict": "Ivor is torn between his sense of duty and the desire for revenge. He grapples with the moral implications of his feelings, questioning whether the pursuit of honor is worth the potential cost to his family.",
    "personalStakeInCase": "This crime matters to Ivor because it directly threatens his family's honor, and he is determined to protect his legacy at any cost.",
    "paragraphs": [
      "Captain Ivor Hale strode through the estate grounds, his posture rigid and his expression one of deep contemplation. The weight of his past loomed large, casting a shadow over his present. As a retired naval officer, he had always prided himself on his sense of duty and honor, but the recent murder of a man he considered a dishonorable foe forced him to confront his own motivations. The victim's actions during the war were a constant reminder of the tarnish on his family's name, and the thought of it gnawed at him like a persistent itch.",
      "In public, Ivor maintained an air of command, offering guidance to those who sought his counsel. Yet, beneath that facade lay a simmering resentment that threatened to bubble over. He held the victim responsible for his family's disgrace, and the idea of allowing such a man to escape justice was intolerable. Ivor's internal conflict raged within him, battling between the codes of honor he had sworn to uphold and the desire for revenge that lurked in the shadows.",
      "As he walked, memories of the war flooded his mind, bringing with them a torrent of emotions. The sacrifices he had made, the lives he had lost, and the dishonor that now haunted him all swirled together, creating a tempest of conflicting feelings. Ivor knew that if he were to confront the truth behind the murder, he would have to confront his own past as well. The question loomed: could he seek justice without sacrificing his family's honor?",
      "With each step, Ivor felt the weight of his family's legacy pressing down on him. He was determined to protect that legacy, even if it meant taking matters into his own hands. The stakes were higher than mere reputation; they were about the very essence of who he was and what he represented. As he grappled with the implications of his choices, Ivor realized that the path ahead would demand more than just courage; it would require him to confront the ghosts of his past and the consequences of his actions."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a charming socialite whose vivacious personality masks a secret affair with the murder victim. Her desire to uphold her social standing drives her actions as she navigates the complexities of love and jealousy.",
    "publicPersona": "Beatrice is known as the life of the party, a vivacious hostess who effortlessly captivates her social circle with her charm and wit. Her vibrant personality makes her a sought-after companion at gatherings, and she thrives on the attention.",
    "privateSecret": "Beneath her charming exterior lies a tumultuous secret: Beatrice is involved in a passionate affair with the murder victim, which she fears could jeopardize her social standing if revealed.",
    "motiveSeed": "The threat of exposure regarding her affair with the victim drives Beatrice to consider drastic measures to protect her reputation.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice claims to have been in her room preparing for the evening gala at the time of the murder, a statement that raises eyebrows among those who know her penchant for socializing.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, her social reputation is at risk, and the thought of losing her status terrifies her, driving her to navigate the murky waters of love and jealousy.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a lively cadence, often punctuating her sentences with playful sarcasm. She has a tendency to laugh lightly at her own jokes, creating an inviting atmosphere, though her sharp tongue can cut when provoked.",
    "internalConflict": "Beatrice grapples with the conflict between her desire for love and her fear of losing her social standing. She is torn between the thrill of her affair and the potential fallout it could bring.",
    "personalStakeInCase": "This crime matters to Beatrice because it threatens to expose her secret affair, which could shatter her carefully curated social image and leave her ostracized from the very circles she cherishes.",
    "paragraphs": [
      "Beatrice Quill flitted through the grand hall of the manor, her laughter ringing like music as she charmed her guests with tales of the latest society gossip. A vivacious socialite, she thrived on the energy of the crowd, her presence a magnetic force that drew people in. Yet, beneath the surface of her vibrant exterior lay a tumultuous secret that threatened to unravel her carefully constructed world. Her affair with the murder victim was a dangerous game, one that could cost her everything if discovered.",
      "As she moved from guest to guest, Beatrice's mind raced with thoughts of the implications of the recent murder. The victim had been a source of both excitement and dread, and now that he was gone, the shadows of her actions loomed larger than ever. The threat of exposure hung over her like a dark cloud, and the idea of losing her social standing sent shivers down her spine. Beatrice was determined to protect her reputation at all costs, but the stakes were higher than she had anticipated.",
      "With every laugh and playful jab, Beatrice masked her growing anxiety. She had always been the life of the party, effortlessly charming those around her, but now her heart raced with fear. The thrill of her affair had been intoxicating, but it came with a price she was no longer willing to pay. The thought of being ostracized from the very circles she cherished was unbearable, and she resolved to navigate the murky waters of her emotions with caution.",
      "As the evening wore on, Beatrice felt the weight of her choices pressing down on her. The thrill of love battled against the fear of exposure, creating a tempest within her. Would she be able to maintain her social standing while grappling with the fallout of her actions? The answer remained elusive, and as she smiled and laughed, she knew that the truth would eventually catch up with her, demanding to be confronted."
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
    "type": "Country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Middleton Manor, an expansive country estate, serves as a backdrop for intrigue and tension, where secrets are hidden in the shadows of its grand architecture.",
    "visualDescription": "The manor boasts a striking façade of weathered stone, adorned with ivy that climbs toward turrets and gables, while sprawling gardens surround it, punctuated by meticulously trimmed hedges and a cobblestone path leading to the entrance.",
    "atmosphere": "The atmosphere is thick with anticipation and dread, as the looming presence of the estate conceals unspeakable truths.",
    "paragraphs": [
      "Middleton Manor stands as a testament to a bygone era of opulence, its stone walls whispering tales of wealth and power. The expansive grounds, shrouded in a thick mist that rolls in from the nearby hills, create a sense of isolation, as if the outside world has forgotten this realm of privilege. Its many wings stretch out like the arms of a giant, embracing the secrets held within. As rain begins to patter against the leaded glass windows, the manor takes on a more sinister air, the shadows deepening in the corners of the grand hall.",
      "Inside, the air is tinged with the scent of polished wood and old books, remnants of a time when the estate was bustling with life. The drawing room, with its heavy drapes and ornate furnishings, seems almost too quiet, the ticking of a grandfather clock echoing through the stillness, marking the passing moments of tension. The walls are adorned with portraits of stern ancestors whose gazes seem to follow every movement, adding to the oppressive atmosphere. Outside, the gardens, while beautiful, are eerily silent, the occasional rustle of leaves or distant thunder the only sounds breaking the stillness.",
      "As the day progresses, the weather mirrors the growing unease within the manor. The overcast sky casts a pall over the estate, and the intermittent rain creates a rhythm that is both soothing and unsettling. The family and staff navigate their daily routines under the watchful eyes of their employer, each with their own secrets to keep. The library, with its towering shelves and hidden nooks, remains off-limits during certain hours, adding an element of mystery as whispers of forbidden knowledge circulate among the household. In this isolated sanctuary, the boundaries between safety and danger blur, and the clockwork of conspiracy begins to tick.",
      "With the sun setting and shadows lengthening, the manor transforms into a labyrinth of darkened corridors and flickering candlelight. The air grows colder, and the atmosphere thickens with unspoken words and hidden agendas. The tension is palpable, as guests gather for dinner, their laughter echoing hollowly against the stone walls, masking the underlying discord. Outside, the rain begins to fall in earnest, drumming against the roof like a warning, as if the estate itself is trying to signal that something is amiss. In this grand yet suffocating home, the clockwork of conspiracy is set in motion, and the truth awaits discovery."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical for the season",
    "timeFlow": "Three days of mounting tension leading to the revelation of dark secrets",
    "mood": "Tense and suspenseful, reflective of societal pressures and personal conflicts",
    "eraMarkers": [
      "Petrol touring cars parked in the drive, their engines humming softly",
      "Typewriters clacking in the study, punctuating the silence with urgency",
      "Early home telephones ringing with news that heightens anxiety"
    ],
    "sensoryPalette": {
      "dominant": "The heavy scent of damp earth and polished wood permeates the air, evoking a sense of both nostalgia and foreboding.",
      "secondary": [
        "The distant sound of thunder rolling across the hills, a reminder of the storm brewing outside.",
        "The faint crackle of a fire in the drawing room, offering a momentary comfort amidst the tension."
      ]
    },
    "paragraphs": [
      "The air is thick with humidity as clouds hang low, casting a grey pall over the estate, while the occasional drip of rainwater echoes like a heartbeat in the silence. The scent of wet earth mingles with the musty aroma of old books, creating an atmosphere rife with anticipation. Shadows dance along the walls, illuminated only by flickering candlelight, as if the manor itself is alive, watching and waiting for the secrets to unfold.",
      "As night falls, the estate transforms under the weight of the clouds, with the sound of rain tapping against the windows creating an almost hypnotic rhythm. The distant rumble of thunder adds to the tension, a reminder that the outside world is just as tumultuous as the one within the manor's walls. The flickering lights cast eerie shapes that seem to reach for the guests gathered in the drawing room, each one harboring their own fears and desires, all too aware that the truth is lurking just beyond their grasp."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Conservatory",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The conservatory is a glass-walled structure filled with exotic plants and the scent of damp foliage. A wrought-iron bench sits beneath a sprawling fern, and a shattered vase lies on the floor, its contents mingling with the soil.",
      "sensoryDetails": {
        "sights": [
          "Sunlight filters through the glass panes, casting fragmented patterns across the floor, while the vibrant greens of the plants contrast with the dark soil beneath them.",
          "The remnants of a once-beautiful display are scattered around, with petals strewn like confetti and shards of glass glimmering ominously."
        ],
        "sounds": [
          "The gentle rustling of leaves creates a soft backdrop, interrupted only by the occasional drip of water from the overhanging plants onto the tiled floor.",
          "A distant echo of footsteps can be heard from the hallway, heightening the tension in the air as if someone is watching."
        ],
        "smells": [
          "The earthy aroma of wet soil mingles with the sweet fragrance of blooming jasmine, creating an intoxicating yet unsettling atmosphere.",
          "A faint hint of decay lingers, suggesting that not all is well within this seemingly tranquil haven."
        ],
        "tactile": [
          "The air is thick with humidity, clinging to the skin like a damp shroud, while the cool tiles beneath the feet offer a stark contrast.",
          "The texture of the leaves is smooth and glossy, yet the broken glass crunches underfoot, a harsh reminder of violence."
        ]
      },
      "accessControl": "The conservatory is usually locked at night, accessible only to the head gardener during the day. Following the incident, it remains cordoned off for investigation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the leaves, creating a shimmering effect as they catch the light, while the ground is slick with moisture.",
            "The soft grey light filters through the glass, casting a muted glow over the vibrant plants."
          ],
          "sounds": [
            "The steady patter of rain against the glass creates a soothing yet eerie soundscape, while the occasional drip resonates from the foliage.",
            "A distant rumble of thunder adds an ominous undertone, reminding all that nature is not to be trifled with."
          ],
          "smells": [
            "The scent of petrichor fills the air, mingling with the rich aroma of damp earth and the sweetness of blooming flowers.",
            "A hint of mildew lingers, suggesting that the conservatory has seen better days."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is flat and grey, casting muted shadows that seem to stretch endlessly across the floor.",
            "The vibrant greens of the plants appear almost dull, as if drained of their life by the oppressive sky."
          ],
          "sounds": [
            "The silence is punctuated only by the soft rustle of leaves, creating an atmosphere of stillness that feels charged with tension.",
            "The ticking of a clock from the hallway echoes faintly, marking time in this realm of secrets."
          ],
          "smells": [
            "The scent of damp foliage is more pronounced, mingling with the earthy aroma of wet soil and the sweetness of decaying flowers.",
            "A faint scent of something sour lingers, suggesting that not everything in this paradise is as it seems."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the glass, casting warm glows that dance across the plants, creating a magical yet haunting atmosphere.",
            "Shadows stretch long and thin, creating an illusion of movement that makes the heart race."
          ],
          "sounds": [
            "The distant laughter of guests carries through the open doors, a stark contrast to the stillness of the conservatory.",
            "A soft breeze rustles the leaves, creating a gentle whisper that feels almost conspiratorial."
          ],
          "smells": [
            "The air is fragrant with the scent of night-blooming jasmine, mingling with the coolness of the evening.",
            "A hint of smoke from a nearby fireplace lingers, adding a touch of warmth to the otherwise cool air."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The conservatory, a glass-walled sanctuary of exotic plants, becomes the focal point of the investigation. The shattered vase lies ominously on the tiled floor, its contents mingling with the rich soil, suggesting a struggle that took place amidst the beauty. As the light filters through the glass, it casts fragmented shadows that dance across the floor, creating an unsettling juxtaposition of tranquility and chaos. The air is thick with humidity, the scent of damp earth and blooming jasmine mingling to create a heady atmosphere, while the echoes of distant footsteps heighten the tension, making one question who, if anyone, is truly safe within these walls.",
        "With the rain pattering softly against the glass, the conservatory takes on a more sinister aspect as the investigation unfolds. The once vibrant colors of the plants seem muted under the weight of the clouds, reflecting the heavy atmosphere that has settled over the estate. The sound of water dripping from the leaves punctuates the silence, a reminder that the beauty here is marred by the violence that has occurred. As investigators sift through the evidence, the lingering scent of decay hints at hidden truths waiting to be uncovered, leaving all who enter to ponder what darkness lies beneath the surface."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The library is a grand room lined with towering bookshelves filled with leather-bound volumes. A large oak table sits at the center, littered with papers and an old typewriter, its keys worn from use.",
      "sensoryDetails": {
        "sights": [
          "Soft light filters through the tall windows, illuminating dust motes that float lazily in the air, while the deep mahogany of the bookshelves absorbs the light, creating a warm yet shadowy ambiance.",
          "The spines of the books, some gilded and others cracked with age, create a tapestry of knowledge and history that beckons the curious."
        ],
        "sounds": [
          "The faint scratching of a quill on parchment can be heard in the stillness, as if the ghosts of past scholars are still at work.",
          "Occasional creaks from the wooden floorboards echo through the room, adding to the eerie atmosphere of this secluded sanctuary of knowledge."
        ],
        "smells": [
          "The rich scent of old paper and leather fills the air, a comforting aroma that speaks of countless stories waiting to be told.",
          "A hint of mildew lingers, suggesting that the library has not seen the care it once received, adding to the sense of neglect."
        ],
        "tactile": [
          "The cool wood of the table contrasts with the soft, worn leather of the books, inviting one to reach out and explore the contents within.",
          "The texture of the pages is smooth yet fragile, a reminder of the passage of time and the secrets they hold."
        ]
      },
      "accessControl": "The library is accessible to family members and select staff during the day; it is locked at night to protect its contents.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the tall windows, distorting the view of the garden outside, while the light is muted, lending a somber tone to the room.",
            "The shadows cast by the shelves seem to deepen, creating a sense of foreboding as the day begins."
          ],
          "sounds": [
            "The steady rhythm of rain against the roof creates a soothing yet melancholic soundscape, punctuated by the occasional rustle of pages being turned.",
            "The distant rumble of thunder serves as a reminder of the storm outside, adding a layer of tension to the atmosphere."
          ],
          "smells": [
            "The scent of damp wood mingles with the rich aroma of old books, creating an inviting yet somber atmosphere.",
            "A faint hint of mustiness lingers, suggesting that the library has been neglected for some time."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is bathed in a dull grey light, the shadows deepening as the afternoon wears on, creating an almost claustrophobic feel.",
            "The dust motes hang heavily in the air, illuminated by the weak light, giving the room a ghostly quality."
          ],
          "sounds": [
            "The silence is thick, broken only by the rustle of paper as someone searches for a clue among the volumes.",
            "The ticking of a clock in the hallway can be heard faintly, a reminder of the passing time and the urgency of the unfolding mystery."
          ],
          "smells": [
            "The rich scent of paper is more pronounced, mingling with the dampness from the rain outside, creating an atmosphere of decay and neglect.",
            "A hint of something musty lingers, suggesting that the library has secrets hidden within its pages."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of lamps casts a cozy light over the room, creating inviting pools of illumination amidst the shadows.",
            "The books seem to come alive in the flickering light, their spines gleaming as if eager to share their secrets."
          ],
          "sounds": [
            "The soft rustle of pages turning fills the air, accompanied by the occasional creak of the floorboards as someone paces in thought.",
            "Distant laughter from the dining room echoes softly, a reminder of the life that continues outside this sanctuary."
          ],
          "smells": [
            "The air is rich with the scent of polished wood and the musty aroma of old books, creating a comforting yet mysterious atmosphere.",
            "A hint of smoke from the fireplace drifts in, adding warmth to the otherwise cool air."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary of knowledge, holds secrets that are waiting to be uncovered. Towering bookshelves filled with leather-bound tomes create a labyrinth of history and intrigue, while the heavy oak table at the center bears the remnants of frantic research. Dust motes dance in the soft light filtering through the tall windows, and the air is thick with the rich scent of old paper and leather. As the storm rages outside, the atmosphere within the library feels charged, as if the very walls are holding their breath, waiting for the truth to be revealed.",
        "With each passing hour, the library transforms from a refuge of knowledge to a stage for unfolding drama. The ticking clock echoes ominously, marking the time as tension mounts in the manor. Shadows deepen, and the whispers of the past seem to seep from the pages of the books, beckoning the curious to delve deeper. As the rain patters against the windows, a sense of urgency fills the air; clues lie hidden among the volumes, waiting for the right pair of hands to uncover them and set the clockwork of conspiracy into motion."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Dining Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The dining room features a long, ornate table surrounded by high-backed chairs, with a crystal chandelier hanging above, casting glimmers of light across the polished surface.",
      "sensoryDetails": {
        "sights": [
          "Rich, dark wood paneling lines the walls, while the table is set with fine china and gleaming silverware, reflecting the opulence of the estate.",
          "A large portrait of the estate's founder looms above the fireplace, his stern gaze seeming to oversee the gatherings with disapproval."
        ],
        "sounds": [
          "The clinking of cutlery and the murmur of conversation fill the air, creating a lively yet tense atmosphere as guests navigate unspoken rivalries.",
          "The soft crackle of the fireplace provides a comforting background noise, contrasting with the underlying tension of the evening."
        ],
        "smells": [
          "The aroma of roasted meats and rich gravies wafts through the air, mingling with the scent of polished wood and aged wine.",
          "A hint of smoke from the fireplace adds warmth to the atmosphere, while the faint scent of flowers from a centerpiece provides a touch of freshness."
        ],
        "tactile": [
          "The smoothness of the polished table contrasts with the rough texture of the embroidered tablecloth, inviting guests to reach out and partake in the feast.",
          "The warmth of the fire radiates through the room, creating a cozy yet charged atmosphere, where every glance and gesture carries weight."
        ]
      },
      "accessControl": "The dining room is accessible to family and guests during meal times, while staff are required to wait outside until summoned.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak the windows, distorting the view of the garden outside, while the light is dim, casting a somber tone over the room.",
            "The table remains bare, awaiting the day’s meals, while shadows loom large in the corners."
          ],
          "sounds": [
            "The sound of rain pattering against the roof creates a rhythmic backdrop, mingling with the distant clattering of dishes being prepared in the kitchen.",
            "Occasional creaks from the wooden floorboards echo through the silence, amplifying the sense of anticipation."
          ],
          "smells": [
            "The scent of damp wood permeates the air, mingling with the faint aroma of breakfast being prepared, creating an inviting yet heavy atmosphere.",
            "A hint of mildew lingers, suggesting that the room has been closed off for too long, adding to the feeling of neglect."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is cast in a dull grey light, the rich colors of the décor appearing muted and lifeless under the oppressive skies.",
            "The table is set for dinner, but the atmosphere feels heavy, as if the air is thick with unspoken words."
          ],
          "sounds": [
            "The silence is punctuated by the soft rustle of cloth as the staff prepares for the evening meal, heightening the tension in the air.",
            "The distant ticking of a clock reminds everyone that time is slipping away, amplifying the urgency of the gathering."
          ],
          "smells": [
            "The aroma of roasted meats and spices wafts in from the kitchen, mingling with the scent of polished wood and lingering smoke from the fireplace.",
            "A hint of something sour lingers, suggesting that not all is well in this seemingly perfect household."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of candlelight dances across the table, illuminating the fine china and creating a cozy yet charged atmosphere.",
            "The flickering flames of the fireplace cast shadows that seem to come alive, as if the very walls are listening intently."
          ],
          "sounds": [
            "The laughter of guests fills the air, a stark contrast to the tension that lies beneath the surface of the evening’s festivities.",
            "The soft clinking of glasses and the rustle of napkins punctuate the conversation, creating a symphony of social interaction."
          ],
          "smells": [
            "The air is rich with the aroma of roasted meats and fresh bread, mingling with the scent of flowers from the centerpiece, creating an inviting atmosphere.",
            "A hint of smoke from the fireplace adds warmth to the room, wrapping around the guests like a comforting embrace."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The dining room, with its long, ornate table and rich wood paneling, serves as the heart of the manor where secrets are whispered and alliances forged. The crystal chandelier above casts a warm glow over the polished surface, while the faint aroma of roasted meats wafts in from the kitchen, mingling with the scent of polished wood. As guests gather, the atmosphere is charged with tension, each person acutely aware of the unspoken rivalries that simmer just beneath the surface. The soft clinking of cutlery and the murmur of conversation create a lively backdrop, yet every laugh feels strained, every glance weighted with meaning.",
        "As evening settles in, the dining room transforms into a stage for intrigue. The flickering candlelight casts dancing shadows along the walls, where portraits of ancestors seem to observe the unfolding drama with disapproving eyes. The warmth of the fire contrasts sharply with the coldness of the secrets being exchanged, as guests navigate their platters with a mix of delight and dread. Outside, the night is clear, but within these walls, the tension is palpable; each clink of glass and rustle of cloth serves as a reminder that the clockwork of conspiracy is ticking, and the truth lurks just out of reach."
      ]
    }
  ],
  "note": "",
  "cost": 0.00292570575,
  "durationMs": 38284
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1930,
    "month": "December",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "December",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "chilly temperatures"
    ],
    "daylight": "Short days with the sun setting around 4 PM, leaving a lingering twilight.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, as guests unwind in the drawing room.",
    "holidays": [
      "Christmas",
      "Boxing Day"
    ],
    "seasonalActivities": [
      "decorating the Christmas tree",
      "attending holiday parties",
      "preparing festive meals"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool suits",
        "double-breasted jackets",
        "bow ties"
      ],
      "casual": [
        "corduroy trousers",
        "herringbone blazers",
        "sweaters with shawl collars"
      ],
      "accessories": [
        "derby hats",
        "wool scarves",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with drop waists",
        "velvet evening gowns",
        "beaded clutches"
      ],
      "casual": [
        "tailored wool skirts",
        "tweed jackets",
        "blouses with puff sleeves"
      ],
      "accessories": [
        "feathered hats",
        "string pearls",
        "silk gloves"
      ]
    },
    "trendsOfTheMoment": [
      "art deco motifs in design",
      "the popularity of jazz music",
      "the rise of the flapper style"
    ],
    "socialExpectations": [
      "emphasis on social etiquette",
      "strict adherence to class distinctions",
      "moral conservatism in public behavior"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "continued economic challenges from the Great Depression",
      "rising political tensions in Europe with the emergence of fascist regimes",
      "discussions around the Statute of Westminster impacting dominion status"
    ],
    "politicalClimate": "A climate of uncertainty with increasing concern over unemployment and social unrest, alongside the rise of extremist politics in Europe.",
    "economicConditions": "The Great Depression is in full effect, leading to severe economic hardship, particularly in urban areas, causing a deepening class divide.",
    "socialIssues": [
      "high unemployment rates",
      "debate over social welfare programs",
      "growing fear of communism and fascism"
    ],
    "internationalNews": [
      "Germany's growing militarization under the Weimar Republic",
      "the increasing popularity of fascism in Italy",
      "Britain's ongoing struggles with trade and economic recovery"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Makin' Whoopee' by Eddie Cantor",
        "'Ain't She Sweet' by Milton Ager",
        "'The Birth of the Blues' by Paul Whiteman"
      ],
      "films": [
        "'All Quiet on the Western Front'",
        "'The Love Parade'",
        "'The Big Parade'"
      ],
      "theater": [
        "'The Front Page' by Ben Hecht",
        "'The Royal Family' by George S. Kaufman",
        "'The Green Goddess' by William Archer"
      ],
      "radio": [
        "'The Shadow' program",
        "'Amos 'n' Andy'",
        "'The Jack Benny Show'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Maltese Falcon' by Dashiell Hammett",
        "'Brave New World' by Aldous Huxley",
        "'Murder in the Cathedral' by T.S. Eliot"
      ],
      "popularGenres": [
        "mystery novels",
        "social commentary",
        "modernist literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator",
        "the radio broadcast",
        "the typewriter"
      ],
      "commonDevices": [
        "home telephones",
        "electric irons",
        "automobiles"
      ],
      "emergingTrends": [
        "increased use of consumer goods",
        "advancements in home technology",
        "growing popularity of cinema"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "A pint of milk: three pence"
      ],
      "commonActivities": [
        "attending social gatherings",
        "playing card games",
        "listening to the radio"
      ],
      "socialRituals": [
        "afternoon tea gatherings",
        "Christmas caroling",
        "New Year's Eve celebrations"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "strong adherence to social hierarchy",
      "increased resentment among the working class",
      "growing awareness of class struggles"
    ],
    "gender": [
      "women increasingly entering the workforce",
      "traditional expectations of femininity remain strong",
      "growing movements for women's rights"
    ],
    "race": [
      "persistent segregation in many regions",
      "emerging conversations around racial equality",
      "social tensions related to immigration"
    ],
    "generalNorms": [
      "emphasis on propriety in public behavior",
      "high value placed on family and household management",
      "conservatism in personal relationships"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth and wood smoke clung to the air, mingling with the rich aroma of a roasting goose from the kitchen.",
    "The quiet tick of the grandfather clock punctuated the heavy silence, broken only by the occasional crackle of the fire and the distant sound of rain against the windows.",
    "Guests murmured softly, their voices hushed under the weight of unspoken tensions, as the flickering candlelight cast dancing shadows on the ornate walls of the country estate."
  ],
  "paragraphs": [
    "In December 1930, as the winter chill set in, the countryside was shrouded in a dreary overcast sky, punctuated only by the occasional drizzle. The estate, a grand yet aging structure, stood defiant against the elements, its stone walls soaked and glistening. Inside, the atmosphere was thick with anticipation as families gathered to prepare for the Christmas festivities, a brief respite from the economic strain of the Great Depression. The guests at the estate found themselves caught between the warmth of holiday cheer and the tension of societal pressures that loomed over them like the dark clouds outside.",
    "Fashion during this time reflected the dualities of elegance and practicality, with men donning tailored wool suits and women wearing tea-length dresses adorned with beads. Accessories such as bow ties and feathered hats complemented their outfits, showcasing a refinement that hid the struggles of the era. Despite the economic hardships, the social elite upheld their traditions, attending holiday parties and gatherings, where strict adherence to etiquette governed interactions. The lavish decorations, rich with art deco motifs, stood in stark contrast to the realities faced by those outside the estate walls.",
    "Daily life within the estate was a microcosm of broader societal issues. As families engaged in seasonal activities like decorating the Christmas tree and preparing festive meals, the looming specter of unemployment and class disparity cast a shadow over their celebrations. Afternoon teas became gatherings filled with whispered conversations about the rising political tensions in Europe and the effects of the Great Depression, while the price of everyday goods kept rising, emphasizing the stark divide between social classes. This season, while meant for joy, was fraught with underlying currents of anxiety and uncertainty."
  ],
  "note": "",
  "cost": 0.0010600062,
  "durationMs": 10901
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A mechanical clock-tampering incident draws together the estate's elite and their staff, as the weight of the Great Depression and rising fascism heightens tensions within the rigid social hierarchy.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class divides, while strict adherence to social hierarchy creates pressure among the wealthy landowners and their servants."
  },
  "setting": {
    "location": "An expansive manor house with multiple wings and gardens, situated several miles from the nearest town.",
    "institution": "Country house estate",
    "weather": "Overcast with intermittent rain, typical for the season."
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
    "description": "The exact time shown on the clock after tampering"
  },
  {
    "id": "tamper_amount",
    "value": "forty minutes",
    "description": "The amount the clock was set back before the murder"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the main hall shows ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time displayed on the clock is critical for understanding the timeline of the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The clock was tampered with, suggesting the time displayed is not accurate.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This indicates the possibility of a misleading timeline regarding the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "Witnesses recall seeing Lord Percival Voss alive at ten thirty in the morning.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This timing contradicts the clock's displayed time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "This contradicts the clock's time showing the murder happened after eleven o'clock in the morning.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The discrepancy raises questions about the accuracy of the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "The clock's hands appear slightly askew from normal position.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This suggests tampering may have occurred.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The tampering indicates a deliberate effort to mislead the timeline.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This suggests a motive to alter the perceived time of the murder.",
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
      "id": "clue_7",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she has a corroborated alibi at the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This narrows the suspect list away from Eleanor Voss.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was seen attending a medical emergency at the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This removes Dr. Mallory Finch from suspicion.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "A controlled comparison of the clock's time with the witness accounts reveals discrepancies in timing.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "This evidence is crucial for understanding the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "temporal",
      "description": "The clock in the manor was tampered with to show a false time, misleading the timeline of the murder.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "This is a key detail about the mechanism of the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "behavioral",
      "description": "Captain Ivor Hale showed signs of desperation to cover debts.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "This indicates a possible motive for the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "The clock's striking time remains a late texture detail in the case background.",
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
      "description": "There were reports of loud noises coming from the study just before the murder.",
      "supportsAssumption": "The victim must have been murdered after the clock showed ten minutes past eleven.",
      "misdirection": "This may suggest a struggle occurred, but it does not provide concrete evidence of the timeline."
    },
    {
      "id": "rh_2",
      "description": "A servant claimed to have seen a shadowy figure fleeing the scene.",
      "supportsAssumption": "The victim must have been murdered after the clock showed ten minutes past eleven.",
      "misdirection": "While this adds an element of mystery, it does not clarify the actual time of the murder."
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
      "clue_10"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_culprit_direct_captain_ivor_hale",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_11"
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
  "latencyMs": 10562,
  "cost": 0.00490650435
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
