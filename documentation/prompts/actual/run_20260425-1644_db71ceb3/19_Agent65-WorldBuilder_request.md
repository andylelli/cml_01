# Actual Prompt Record

- Run ID: `run_db71ceb3-63a9-4d62-b77a-6882fb75bd3f`
- Project ID: `proj_da695adb-c7f9-4353-b427-133ed4e32a28`
- Timestamp: `2026-04-25T16:49:16.705Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `73090b4edc19fbb1`

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
  - humourPlacementMap: every entry (all 12 scene positions) MUST include a non-empty
    "rationale" string. This applies to "forbidden" entries too — explain WHY it is forbidden.
    Omitting rationale on any entry will cause schema validation failure.

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
      "decade": "1940s",
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
      "subtype": "suspicious death"
    }
  },
  "cast": [
    {
      "name": "Theodora Compton",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "Roger Merton (fiancé)",
        "Joan Rayleigh (friend)",
        "Philip Ingram (business partner)",
        "Geoffrey Plowden (detector)"
      ],
      "public_persona": "Charming hostess",
      "private_secret": "Financial troubles",
      "motive_seed": "Inheritance",
      "motive_strength": "high",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "House party",
        "Garden access"
      ],
      "behavioral_tells": [
        "Nervousness about finances"
      ],
      "stakes": "Her future and reputation",
      "evidence_sensitivity": [
        "Financial documents",
        "Guest testimonies"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Roger Merton",
      "age_range": "35-45",
      "role_archetype": "fiancé",
      "relationships": [
        "Theodora Compton (fiancée)"
      ],
      "public_persona": "Successful businessman",
      "private_secret": "Plans to marry for money",
      "motive_seed": "Financial gain",
      "motive_strength": "moderate",
      "alibi_window": "Between 10 PM and 11 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Private study",
        "Library access"
      ],
      "behavioral_tells": [
        "Defensive about finances"
      ],
      "stakes": "Marriage and future",
      "evidence_sensitivity": [
        "Witness statements",
        "Financial records"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Joan Rayleigh",
      "age_range": "28-38",
      "role_archetype": "friend",
      "relationships": [
        "Theodora Compton (friend)"
      ],
      "public_persona": "Supportive friend",
      "private_secret": "In love with Roger",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "Between 10 PM and 11 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Garden",
        "Hallway"
      ],
      "behavioral_tells": [
        "Overly concerned about Theodora"
      ],
      "stakes": "Love and loyalty",
      "evidence_sensitivity": [
        "Her own alibi",
        "Witness observations"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Philip Ingram",
      "age_range": "40-50",
      "role_archetype": "business partner",
      "relationships": [
        "Theodora Compton (partner)"
      ],
      "public_persona": "Respected businessman",
      "private_secret": "Financial woes",
      "motive_seed": "Revenge",
      "motive_strength": "low",
      "alibi_window": "Between 10 PM and 11 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Study",
        "Library"
      ],
      "behavioral_tells": [
        "Evasive about business matters"
      ],
      "stakes": "Reputation and investment",
      "evidence_sensitivity": [
        "Business ledgers",
        "Witness statements"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Geoffrey Plowden",
      "age_range": "45-55",
      "role_archetype": "detective",
      "relationships": [
        "Theodora Compton (victim)",
        "Roger Merton (suspect)",
        "Joan Rayleigh (suspect)",
        "Philip Ingram (suspect)"
      ],
      "public_persona": "Private investigator",
      "private_secret": "Focus on reputation",
      "motive_seed": "Professional pride",
      "motive_strength": "low",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Manor house access"
      ],
      "behavioral_tells": [
        "Calm under pressure"
      ],
      "stakes": "Case resolution",
      "evidence_sensitivity": [
        "Witness statements",
        "Physical evidence"
      ],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Roger Merton"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a tense evening at the Compton manor, Theodora Compton is found dead under suspicious circumstances, leading Geoffrey Plowden to unravel a web of deceit and temporal illusions, where a clock holds the key to the truth."
    },
    "accepted_facts": [
      "Theodora was found dead at quarter past eleven.",
      "The clock in the study shows a time that was manipulated.",
      "Guests were present at the time of death."
    ],
    "inferred_conclusions": [
      "Roger Merton had a motive to kill Theodora for financial gain.",
      "The clock's evidence suggests a different timeline than reported."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, study, and minut to expose the false timing.",
      "delivery_path": [
        {
          "step": "The clock was found with dust indicating it hadn't been disturbed in a while."
        },
        {
          "step": "A unique winding key was discovered near the clock."
        }
      ]
    },
    "outcome": {
      "result": "Reveals Roger Merton tampered with the clock to create an alibi."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred just before the clock stopped showing quarter past eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses saw Theodora alive and well until shortly before her death.",
    "what_it_hides": "The clock was intentionally tampered with to conceal the true time of death."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Theodora last seen at 10:45 PM",
        "Time of death recorded at 11:15 PM"
      ],
      "windows": [
        "10:45 PM to 11:15 PM"
      ],
      "contradictions": [
        "Clock shows 10:05 PM while Theodora was last seen at 10:45 PM."
      ]
    },
    "access": {
      "actors": [
        "Roger Merton",
        "Joan Rayleigh",
        "Philip Ingram"
      ],
      "objects": [
        "The clock",
        "Theodora's drink",
        "Garden tools"
      ],
      "permissions": [
        "Access to the study",
        "Access to the garden"
      ]
    },
    "physical": {
      "laws": [
        "Sound cannot travel through walls without leaving evidence",
        "Dust accumulation indicates inactivity"
      ],
      "traces": [
        "Fingerprints on the clock face",
        "Footprints in the garden"
      ]
    },
    "social": {
      "trust_channels": [
        "Social connections among guests",
        "Business relationships"
      ],
      "authority_sources": [
        "Geoffrey Plowden's investigation"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows ten minutes past eleven.",
        "correction": "The clock's time contradicts eyewitness accounts.",
        "effect": "Narrows the time of death, suggesting tampering.",
        "required_evidence": [
          "Theodora was last seen at 10:45 PM.",
          "Guests confirm she was alive until shortly before 11 PM.",
          "The clock was dusty, suggesting it had not been disturbed recently.",
          "The clock shows a time inconsistent with the time of death."
        ],
        "reader_observable": true
      },
      {
        "observation": "A unique winding key is found near the clock.",
        "correction": "The presence of the key indicates potential tampering with the clock.",
        "effect": "Eliminates Joan Rayleigh, who had no access to the study.",
        "required_evidence": [
          "The clock was dusty, suggesting it had not been disturbed recently.",
          "Witness statements about Joan's location.",
          "The key is not associated with Joan.",
          "Guests confirm Joan was in the garden during the time."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dust on the clock face indicates it hasn't been disturbed in days.",
        "correction": "This contradicts claims of the clock being tampered with during the party.",
        "effect": "Eliminates Philip Ingram as he had no motive to tamper with the clock.",
        "required_evidence": [
          "Witnesses confirm Philip was in the library.",
          "Physical evidence of dust on the clock.",
          "The clock shows no signs of recent handling.",
          "Philip had no opportunity to access the clock."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled test comparing the clock's time with eyewitness accounts shows inconsistencies.",
    "knowledge_revealed": "The clock was set back intentionally, contradicting Roger's alibi.",
    "pass_condition": "Roger Merton is proven to have tampered with the clock.",
    "evidence_clues": [
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_12",
      "clue_4",
      "clue_7"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time and witness accounts reveal a contradiction. Step 2: The presence of the winding key indicates tampering. Step 3: Dust on the clock suggests it hadn't been touched recently, pointing to Roger Merton as the culprit."
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
        "suspect_name": "Joan Rayleigh",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by other guests.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Philip Ingram",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed presence in the library.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
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
        "clue_id": "clue_core_elimination_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_roger_merton",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_12",
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_backstop_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
    "name": "Theodora Compton",
    "summary": "Theodora Compton is an art curator whose charm and cultural insights have made her a respected figure in Little Middleton. Beneath her polished exterior, she grapples with jealousy and resentment toward her rival Joan Rayleigh.",
    "publicPersona": "Always the picture of elegance, Theodora moves through society with grace, her knowledge of art and culture making her a sought-after conversationalist. She has a knack for making others feel valued, drawing them into her world of beauty and intellect.",
    "privateSecret": "Theodora is entangled in a clandestine affair with Roger Merton, which fuels her growing resentment towards Joan, who seems to have everything she desires. This emotional turmoil is a constant backdrop to her polished public persona.",
    "motiveSeed": "The fear of losing her prestigious position at the manor, along with the potential exposure of her affair, pushes Theodora into a corner. She is desperate to maintain her reputation and the lifestyle it affords her.",
    "motiveStrength": "moderate",
    "alibiWindow": "Theodora claims to have been in the library from eight till ten, a solitary witness to her own alibi, as no one else can attest to her whereabouts.",
    "accessPlausibility": "easy",
    "stakes": "Her career and reputation are at risk, hinging on the delicate balance of her relationships and her ability to keep her secrets hidden.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Theodora speaks with a refined cadence, often punctuating her observations with a sly smile or a sharp remark that hints at her true feelings. She has a tendency to use art metaphors, painting her words with a touch of elegance.",
    "internalConflict": "Theodora grapples with feelings of inadequacy and jealousy, particularly towards Joan, whose seemingly perfect life serves as a constant reminder of what she lacks. This internal struggle manifests in her interactions, where her charm often masks deeper resentments.",
    "personalStakeInCase": "This crime strikes at the very core of Theodora's identity. If her affair and insecurities are exposed, she risks not only her career but also her carefully constructed image in the community.",
    "paragraphs": [
      "Theodora Compton, a name synonymous with elegance and culture in Little Middleton, finds herself at a crossroads. As the curator of the manor's esteemed art collection, she has curated not just paintings but a reputation that sparkles like the finest jewels. Yet, behind her serene smile lies a tempest of emotions, particularly towards Joan Rayleigh, the woman she believes stands between her and the life she desires. Her affair with Roger Merton, while passionate, has become a source of frustration, as jealousy gnaws at her heart, turning admiration into resentment.",
      "In the library, where she claims to have spent the evening, Theodora often loses herself in the pages of art history, hoping to find solace from the world outside. The solitude, however, is deceptive; it becomes a breeding ground for her insecurities. She recalls moments with Roger, where their laughter echoed off the aged tomes, yet the shadow of Joan’s presence looms larger with each passing day. Theodora’s charm is a mask, one that shields her from the truth of her situation and the potential unraveling of her carefully woven life.",
      "As the investigation unfolds, Theodora's fears crystallize. Losing her position at the manor would mean losing her identity, her status, and perhaps even Roger, who seems to be slipping through her fingers. She often finds herself playing the role of the supportive confidante, but inside, she is a cauldron of conflicting emotions. The thought of Joan revealing her secrets sends shivers down her spine; each encounter with the woman is a dance on the edge of a blade, where betrayal could come at any moment.",
      "Yet, amidst the turmoil, there lies a flicker of resolve within Theodora. She knows she must confront her feelings of jealousy and betrayal, not just towards Joan but towards herself for allowing her life to be dictated by the whims of men. The clock is ticking, and as time passes, the truth will emerge, forcing her to choose between her career and the tangled web of her heart. In this game of deceit and desire, Theodora Compton stands at the precipice, ready to either reclaim her power or fall victim to the very secrets she has worked so hard to conceal."
    ],
    "order": 1
  },
  {
    "name": "Roger Merton",
    "summary": "Roger Merton is a charismatic businessman whose charm masks a tangled web of deceit. Juggling an engagement to Joan Rayleigh while secretly involved with Theodora Compton, he is a man caught between two worlds.",
    "publicPersona": "With an affable smile and a firm handshake, Roger is the epitome of success in Little Middleton. He is the type of man who can light up a room with his presence, effortlessly weaving tales of his business acumen while charming the audience with his charisma.",
    "privateSecret": "Roger is secretly engaged to Joan, yet he finds himself entrapped in an illicit affair with Theodora. His duplicity is not just a thrill; it is a precarious balancing act that could crumble at any moment.",
    "motiveSeed": "The fear of losing everything he holds dear — his engagement to Joan and the respect of his community — drives Roger to consider drastic measures should his secrets come to light.",
    "motiveStrength": "moderate",
    "alibiWindow": "Roger claims to have been in a meeting until nine, but the details are murky at best, leaving room for suspicion.",
    "accessPlausibility": "possible",
    "stakes": "His personal life hangs in the balance, and exposure could lead to the collapse of his carefully crafted facade.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Roger speaks with a confident, smooth timbre, often punctuating his sentences with a self-assured laugh. He has a tendency to use business jargon, but when pressed, he softens into more relatable language, revealing a man who is both polished and vulnerable.",
    "internalConflict": "Roger is torn between his feelings for Theodora and his commitment to Joan. Each interaction with either woman heightens his anxiety, as he grapples with the fear of losing both if the truth is revealed.",
    "personalStakeInCase": "For Roger, this crime is not just a matter of legal consequence; it represents the potential unraveling of his entire life. The stakes are personal, as he must confront the consequences of his choices and the impact they have on those he claims to care for.",
    "paragraphs": [
      "Roger Merton is a man of many faces, each one crafted to perfection. In the boardrooms and social gatherings of Little Middleton, he is the successful businessman, the charismatic leader, the man everyone admires. Yet, behind the polished exterior lies a tumultuous heart, one that beats for two women at once. His engagement to Joan Rayleigh is a source of pride, yet it is marred by the thrilling, yet dangerous, liaison with Theodora Compton. The tension between the two worlds he inhabits creates a constant undercurrent of anxiety that threatens to pull him under.",
      "At a meeting he claims to have attended the night of the murder, Roger’s mind was not on business but rather on the delicate balance of his relationships. He recalls the warmth of Theodora’s laughter and the soft touch of her hand, but he cannot shake the image of Joan’s trusting smile. The juxtaposition of their affections leaves him feeling both exhilarated and trapped. He often finds himself caught in a web of lies, each thread more tangled than the last, as he tries to navigate the treacherous waters of his heart.",
      "As the investigation unfolds, Roger’s fear of exposure grows. The thought of Joan discovering his affair is unbearable, and he begins to consider the lengths he might go to protect his secrets. The stakes are not just personal; they are a matter of his reputation and the respect he has cultivated in the community. He knows that if the truth comes to light, it could obliterate everything he has worked for, turning admiration into scorn in the blink of an eye.",
      "Yet, amid this chaos, Roger must also confront the reality of his choices. He is faced with a decision that could alter the course of his life forever. Will he continue to play the role of the charming businessman, or will he finally confront the truth of his desires? The clock is ticking, and as the investigation progresses, Roger Merton finds himself at a crossroads, where every decision could lead to salvation or ruin."
    ],
    "order": 2
  },
  {
    "name": "Joan Rayleigh",
    "summary": "Joan Rayleigh is a compassionate social worker, well-liked in Little Middleton, but her life is marred by the secrets she keeps. Aware of Roger's affair, she grapples with her own feelings of entrapment and the desire for a future.",
    "publicPersona": "Joan presents herself as the epitome of compassion and dedication, always ready to lend a helping hand to those in need. Her warm smile and gentle demeanor have earned her the affection of the community, making her a trusted confidante.",
    "privateSecret": "Joan is aware of Roger's infidelity with Theodora, yet she feels powerless to change her circumstances. Her knowledge of their affair weighs heavily on her, creating an internal conflict that threatens her emotional stability.",
    "motiveSeed": "Joan's desire to protect her future with Roger could drive her to desperate measures if she feels cornered by the situation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Joan was out in the garden for an hour, a solitary witness to her own alibi, with no one to confirm her whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "Her emotional stability and future with Roger depend on the choices she makes in the wake of the murder.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Joan speaks with a warm, soothing tone, often using gentle phrases that reflect her nurturing nature. She has a tendency to laugh at herself, using self-deprecating humor to connect with others and ease tension.",
    "internalConflict": "Joan is torn between her loyalty to Roger and her desire for self-preservation. The knowledge of his affair creates a chasm in her heart, leading to feelings of inadequacy and self-doubt.",
    "personalStakeInCase": "For Joan, this crime represents not just a legal matter but a turning point in her life. The outcome could determine her emotional future and the stability she craves.",
    "paragraphs": [
      "Joan Rayleigh is known in Little Middleton as the heart of the community, a social worker who pours her soul into helping others. Her warm smile and compassionate nature have made her a beloved figure, yet beneath the surface lies a tumultuous sea of emotions. Joan is aware of Roger Merton's affair with Theodora Compton, a truth that gnaws at her like an unrelenting tide. The betrayal feels like a weight upon her chest, suffocating her spirit, yet she remains committed to the facade of a happy engagement.",
      "In the garden, where she claims to have spent the hour of the murder, Joan often finds solace among the flowers. The vibrant colors and fragrant blooms provide a temporary escape from the harsh reality of her situation. She talks to the plants as if they were her confidantes, sharing her fears and insecurities. 'Oh, how I wish I could be as resilient as you,' she often muses, laughing at her own absurdity. This self-deprecating humor is her armor, a way to connect with others while shielding her heart from the sharp edges of her reality.",
      "As the investigation unfolds, Joan grapples with her feelings of entrapment. The thought of losing Roger is unbearable, but so is the knowledge of his betrayal. She is torn between loyalty and self-preservation, a delicate balance that could tip at any moment. Her heart aches with the weight of her secrets, and she wonders if she could ever confront him about the affair. The stakes have never been higher, and with each passing moment, the pressure mounts, threatening to explode her carefully crafted world.",
      "Yet, amidst the turmoil, Joan knows she must make a choice. The clock is ticking, and the impending revelation of the truth hangs over her like a storm cloud. Will she remain loyal to a man who has betrayed her trust, or will she find the strength to stand up for herself and forge a new path? The outcome of this case is not merely a matter of justice; it is a turning point for Joan Rayleigh, one that could reshape her future and redefine her sense of self."
    ],
    "order": 3
  },
  {
    "name": "Philip Ingram",
    "summary": "Philip Ingram is a retired army officer whose stern demeanor masks a lifetime of resentments. Feeling sidelined in social matters, he harbors a desire for recognition that could lead him down a dark path.",
    "publicPersona": "Philip is known as a respected veteran, often seen as aloof and detached. His stern demeanor commands respect, but it also creates a barrier that keeps others at arm's length.",
    "privateSecret": "Philip harbors deep resentments from his military past and feels marginalized within the community's social hierarchy. This bitterness fuels a desire for recognition that could manifest in dangerous ways.",
    "motiveSeed": "Bitter about not being invited into the inner circle, Philip could see the murder as a means to reclaim the authority and respect he believes he deserves.",
    "motiveStrength": "moderate",
    "alibiWindow": "Philip claims to have been taking a solitary walk around the grounds, yet the nature of his solitary pursuits raises questions about his whereabouts.",
    "accessPlausibility": "unlikely",
    "stakes": "He desires respect and acknowledgment from the community, a need that has festered into a longing that could push him to extremes.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Philip speaks in a clipped, precise manner, often punctuating his sentences with a dry wit that reflects his military background. He has a tendency to use short, declarative statements, revealing little of his inner thoughts.",
    "internalConflict": "Philip struggles with feelings of alienation and resentment, torn between his past as a respected officer and his present isolation. The lack of recognition from his peers stirs a bitterness that he must confront.",
    "personalStakeInCase": "For Philip, this crime represents a potential turning point in his life. The investigation could either solidify his place in the community or push him further into the shadows of obscurity.",
    "paragraphs": [
      "Philip Ingram stands as a figure of stoic resolve in Little Middleton, a retired army officer whose reputation is built on respect and discipline. Yet, behind the stern facade lies a man grappling with the ghosts of his past. Once a leader in the field, Philip now feels sidelined in the social circles of the community, his military accolades forgotten as he navigates a world that seems to have moved on without him. The isolation stings, and he harbors a bitterness that threatens to consume him.",
      "On the night of the murder, Philip claims to have been taking a solitary walk around the grounds, but the truth of his whereabouts is as murky as the twilight sky. He often finds solace in the quiet of the outdoors, yet the solitude has become a double-edged sword. The whispers of his grievances echo in the silence, and he finds himself yearning for acknowledgment from those who once revered him. His clipped speech often betrays the depth of his feelings, as he struggles to articulate the resentment that simmers beneath the surface.",
      "As the investigation unfolds, Philip's bitterness intensifies. He watches as the others engage in their social games, feeling increasingly marginalized and overlooked. The murder presents a twisted opportunity for him — a chance to reclaim the authority he believes is rightfully his. The stakes are high, and the thought of stepping into the limelight, even through nefarious means, becomes increasingly appealing.",
      "Yet, within this turmoil lies a flicker of self-awareness. Philip must confront his feelings of alienation and the lengths he would go to regain respect. The clock is ticking, and as the investigation progresses, he finds himself at a crossroads. Will he choose a path of recognition through honor, or will he succumb to the darker impulses that threaten to unravel the very fabric of his being? The outcome of this case could redefine Philip Ingram's place in the community, and the choice he makes may determine whether he emerges as a respected figure or a mere shadow of his former self."
    ],
    "order": 4
  },
  {
    "name": "Geoffrey Plowden",
    "summary": "Geoffrey Plowden is a local journalist known for his cynical outlook and knack for uncovering scandals. With a flair for the sensational, he navigates the murky waters of truth and deception.",
    "publicPersona": "Geoffrey is the quintessential journalist, armed with a sharp wit and an eye for detail. His reputation for exposing local scandals has earned him both respect and suspicion, making him a figure of intrigue in Little Middleton.",
    "privateSecret": "Geoffrey holds a treasure trove of secrets about the relationships and scandals of the manor's residents, using this knowledge as leverage for his career.",
    "motiveSeed": "The murder presents an opportunity for Geoffrey to exploit the situation for a sensational story, potentially framing someone else to elevate his career.",
    "motiveStrength": "strong",
    "alibiWindow": "Geoffrey was seen in a nearby pub until closing time, raising questions about his whereabouts and intentions.",
    "accessPlausibility": "possible",
    "stakes": "His career could skyrocket if he manages to break the story, but the ethical implications weigh heavily on his conscience.",
    "humourStyle": "sardonic",
    "humourLevel": 0.8,
    "speechMannerisms": "Geoffrey's speech is laced with sarcasm and a biting wit, often punctuated by dry observations that reveal his cynical view of the world. He has a tendency to use playful jabs, making light of serious situations to deflect from deeper issues.",
    "internalConflict": "Geoffrey is torn between his journalistic ambitions and the ethical implications of exploiting the murder for personal gain. The lure of a sensational story collides with his moral compass, creating a tension that he must navigate.",
    "personalStakeInCase": "For Geoffrey, this crime is not just a story; it is a chance to redefine his career and solidify his place in the annals of local journalism. The stakes are high, and the outcome could shape his legacy.",
    "paragraphs": [
      "Geoffrey Plowden is a name that commands attention in Little Middleton, a local journalist with a flair for the sensational and a reputation for uncovering the truth behind the facade. Armed with a sardonic wit and a keen eye for detail, he navigates the murky waters of scandal with the ease of a seasoned sailor. His presence is often met with a mix of admiration and wariness, as he has a knack for exposing the underbelly of society, leaving no stone unturned in his pursuit of a story.",
      "On the night of the murder, Geoffrey was seen in a nearby pub, sipping on a drink and spinning tales to anyone who would listen. His alibi is as solid as a sandcastle, built on the shifting tides of his own narrative. He relishes the chaos of the situation, seeing the murder as an opportunity to craft a sensational story that could catapult him to new heights in his career. The thought of framing someone else to elevate his own status flits through his mind like a moth to a flame, igniting a dangerous spark of ambition.",
      "Yet, beneath the bravado lies a conflict that gnaws at him. Geoffrey is acutely aware of the ethical implications of his actions, the fine line between journalism and exploitation. The lure of a headline that could define his legacy is intoxicating, but it clashes with the moral compass he has tried to uphold. Each interaction with the other characters in this unfolding drama brings him closer to a decision that could either solidify his place in the community or tarnish his reputation forever.",
      "As the investigation progresses, Geoffrey finds himself at a crossroads. The clock is ticking, and with it comes the weight of his choices. Will he seize the opportunity to exploit the situation for personal gain, or will he rise above the chaos to seek the truth? The outcome of this case is not merely about uncovering a murder; it is a chance for Geoffrey Plowden to define who he is as a journalist and as a man, as the stakes rise higher with each passing moment."
    ],
    "order": 5
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
    "summary": "Little Middleton Manor stands as a testament to Victorian grandeur, its sprawling wings and manicured gardens concealing the secrets of its past. The estate's isolation and opulence create a breeding ground for mystery amidst an era of societal upheaval.",
    "visualDescription": "The manor boasts high ceilings adorned with intricate plasterwork, while polished mahogany staircases twist elegantly through its expansive layout. Outside, the gardens are meticulously arranged, with hedges trimmed to perfection and flowerbeds bursting with blooms, all overshadowed by the dark clouds looming above.",
    "atmosphere": "A blend of elegance and unease, where the beauty of the estate contrasts sharply with the tension simmering below the surface.",
    "paragraphs": [
      "Little Middleton Manor, a grand Victorian estate, rises majestically against the backdrop of a gloomy sky, its gables and turrets reaching towards the heavens. The air is thick with the scent of damp earth from the recent rain, mingling with the rich aroma of blooming lilacs in the garden, creating a heady mix that is both inviting and unsettling. Inside, the high ceilings echo faint whispers, as if the walls themselves are privy to the secrets of its inhabitants. Each room, filled with heavy drapes and dark wood furniture, seems to hold its breath, waiting for the next chapter of its story to unfold.",
      "As the day drags on, the oppressive atmosphere deepens, thickened by the intermittent patter of rain against the leaded glass windows. The sound is a constant reminder of the outside world, where troubles brew just beyond the manicured hedges. Shadows dance along the walls, cast by flickering gas lamps that struggle to illuminate the corners of the dimly lit hallways. Here, the echoes of the past intertwine with the present, hinting at the unresolved conflicts that linger in the air, a reflection of the societal changes that have swept through England in the wake of the war.",
      "The sprawling layout of the manor, with its narrow corridors and hidden alcoves, creates a sense of isolation that is palpable. Guests may wander through the grand drawing rooms and vast dining hall, but certain areas remain off-limits, locked away like the secrets they harbor. The library, a sanctuary of knowledge and intrigue, is accessible only at specific times, its oak doors creaking ominously when opened, revealing a treasure trove of dusty tomes that hold more than just stories. Outside, the gardens, while beautiful, are shrouded in an eerie quiet, the only sounds being the rustle of leaves and the distant call of a bird, as if nature itself is holding its breath.",
      "In this estate, time flows differently, each hour stretching into eternity as tensions mount and suspicions rise. The guests, dressed in the fashion of the day, navigate the intricate social hierarchies that dictate their interactions, each one a potential player in a game of deceit. With the war still fresh in their minds, the remnants of conflict linger in their conversations, and the weight of societal expectations hangs heavily in the air. As the clock ticks on the mantel, its hands moving inexorably forward, the stage is set for a revelation that could change everything."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with intermittent rain, typical for the late spring season, creating a somber mood.",
    "timeFlow": "Three days of mounting tension as secrets unravel and new alliances form amidst the backdrop of a changing society.",
    "mood": "Tense and foreboding, with an undercurrent of unresolved conflict stemming from the recent war and societal changes.",
    "eraMarkers": [
      "Gas lamps flicker dimly in the hallways, casting shadows that dance across the walls.",
      "A vintage radio crackles softly in the drawing room, broadcasting the latest news of post-war recovery.",
      "The lingering scent of rationed cooking wafts through the kitchen, a reminder of the sacrifices made during the war."
    ],
    "sensoryPalette": {
      "dominant": "The oppressive weight of secrecy and tension fills the air.",
      "secondary": [
        "The damp, earthy scent of the garden after rain.",
        "The faint rustle of paper as a letter is opened, revealing hidden truths."
      ]
    },
    "paragraphs": [
      "The atmosphere is thick with anticipation, each room steeped in a sense of history and expectation. The air feels heavy, as if it carries the weight of unspoken words and hidden agendas, while the muted colors of the decor add to the feeling of unease. Outside, the gardens are vibrant yet eerily silent, as if nature itself is holding its breath, waiting for the inevitable clash of truths to unfold.",
      "As the guests gather for dinner, the clinking of silverware and the soft murmur of conversation do little to dispel the tension. Each glance shared across the table is laden with meaning, as alliances are formed and suspicions grow. The distant rumble of thunder serves as a reminder of the storm brewing outside, paralleling the tempest of emotions within the walls of Little Middleton Manor."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library is a cavernous room lined with dark oak shelves, each filled with volumes of dusty books and leather-bound tomes. A large mahogany desk sits in the center, papers strewn about as if left in haste, while an ornate globe stands silently in the corner, its surface reflecting the dim light.",
      "sensoryDetails": {
        "sights": [
          "The tall bookshelves loom like sentinels, their spines faded and worn from years of neglect, casting long shadows across the polished floor.",
          "A solitary armchair, upholstered in deep green velvet, sits near the fireplace, inviting yet foreboding, its fabric frayed at the edges."
        ],
        "sounds": [
          "The soft rustle of pages turning echoes through the room, a whisper of knowledge waiting to be uncovered, punctuated by the occasional creak of the floorboards.",
          "Outside, the rain patters against the window, a rhythmic reminder of the storm brewing, muffling other sounds and heightening the sense of isolation."
        ],
        "smells": [
          "The musty scent of old books fills the air, mingling with the faint aroma of polished wood and a hint of burning coal from the fireplace.",
          "A trace of mildew lingers in the corners, a reminder of the dampness that seeps through the walls during the rainy season."
        ],
        "tactile": [
          "The surface of the desk is cool to the touch, its polished wood smooth but marred by the scattered papers that tell a story of urgency and chaos.",
          "The velvet upholstery of the armchair feels soft yet worn, the fabric cool against the skin, inviting one to settle in and ponder the mysteries held within the pages around."
        ]
      },
      "accessControl": "The library is accessible only to the family and select guests during designated hours, typically after breakfast and before dinner. Staff are prohibited from entering without permission, adding an air of secrecy to the room.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-streaked windows blur the view of the garden, softening the harsh lines of the world outside.",
            "The dim light filters in, casting a grey hue over the rows of books, making the titles difficult to discern."
          ],
          "sounds": [
            "The steady drumming of rain on the roof creates a soothing yet melancholic backdrop to the quietude of the library.",
            "The distant rumble of thunder echoes, a reminder of the storm's presence, while the occasional drip of water from the eaves punctuates the silence."
          ],
          "smells": [
            "The damp earth scent wafts in through the window, mingling with the musty aroma of the books, creating an earthy blend that is both comforting and unsettling.",
            "A hint of mildew rises from the corners, a reminder of the dampness that permeates the air during this season."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat pewter light washes over the room, dulling the vibrancy of the colors within, as shadows stretch across the floor.",
            "The stillness is palpable, with every object frozen in time, waiting for the next movement to break the silence."
          ],
          "sounds": [
            "Silence reigns, broken only by the distant ticking of a clock, a reminder of time slipping away amidst the tension.",
            "The creak of old timbers adds an eerie undertone, as if the house itself is alive, watching and waiting."
          ],
          "smells": [
            "The scent of beeswax from the polished furniture permeates the air, mingling with the dust that hangs in the sunlight filtering through the clouds.",
            "A faint hint of woodsmoke wafts in from the fireplace, grounding the atmosphere in a sense of home amidst the unease."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the walls, illuminating the spines of books in a warm glow, while shadows dance across the room.",
            "The last rays of sunlight filter through the window, casting long shadows that stretch like fingers across the floor."
          ],
          "sounds": [
            "The ticking of a mantel clock fills the room, each tick a reminder of the passing time, creating an atmosphere thick with anticipation.",
            "Distant voices from the dining room echo faintly, blending with the sound of cutlery clinking, heightening the sense of gathering tension."
          ],
          "smells": [
            "The comforting scent of candle wax fills the air, mingling with the aroma of tobacco smoke from a nearby pipe.",
            "A trace of cold fireplace ash lingers, a reminder of the warmth that once filled the room, now replaced by a chilling anticipation."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary of knowledge and secrets, stands at the heart of the manor, its towering shelves looming like guardians of the past. The dim light creates an atmosphere thick with suspense, where the faintest sound reverberates against the walls, amplifying the weight of the silence. It is here that the crime unfolds, amidst the whispers of pages turning and the soft rustle of fabric, as hidden truths come to light.",
        "As the rain patters against the window, the library transforms into a cocoon of isolation, where the outside world fades away, leaving only the tension of the moment. The shelves, lined with tomes containing stories of love and loss, now bear witness to a tale of deceit, each book a potential clue, waiting to be discovered. In this space, every shadow holds a secret, and every creak of the floorboards hints at the presence of a hidden observer."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is elegantly appointed, with rich fabrics draping over plush sofas and armchairs, arranged around a grand fireplace that dominates the far wall. Ornate mirrors reflect the flickering light of the gas sconces, creating a warm yet intimate atmosphere, while the polished wooden floors gleam beneath the soft glow.",
      "sensoryDetails": {
        "sights": [
          "Heavy drapes in deep burgundy frame the tall windows, their fabric rich and luxurious, filtering the outside light into a soft, inviting glow.",
          "A grand piano sits in the corner, its polished surface reflecting the light, inviting guests to gather around for an evening of music and conversation."
        ],
        "sounds": [
          "The soft murmur of conversation fills the air, punctuated by the laughter of guests and the clinking of glasses as drinks are poured.",
          "The crackling of the fire provides a comforting backdrop, its warmth drawing people closer together as the evening wears on."
        ],
        "smells": [
          "The rich aroma of polished wood mingles with the scent of fresh flowers placed in a vase on the mantelpiece, creating a welcoming atmosphere.",
          "A hint of cigar smoke lingers in the air, a reminder of the evening's earlier discussions and the secrets shared among friends."
        ],
        "tactile": [
          "The soft upholstery of the sofas invites guests to sink in and relax, while the coolness of the marble fireplace contrasts with the warmth of the room.",
          "The texture of the heavy drapes is luxurious against the fingers, a reminder of the wealth that permeates the manor."
        ]
      },
      "accessControl": "The drawing room is accessible to all guests during social gatherings, but it is also a space where the family retreats for private moments. Staff are expected to remain discreet and out of sight unless summoned.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "The light filtering through the rain-soaked windows creates a soft, diffused glow, casting serene patterns on the floor.",
            "Raindrops trickle down the glass, creating a soothing backdrop to the stillness of the room."
          ],
          "sounds": [
            "The gentle patter of rain against the window mingles with the quiet rustle of newspapers being read, creating a peaceful morning ambiance.",
            "Occasionally, the distant sound of thunder rumbles, breaking the tranquility and reminding all of the storm outside."
          ],
          "smells": [
            "The scent of damp earth wafts in through the open window, mingling with the fragrance of freshly brewed tea served on a tray.",
            "A faint hint of mildew from the dampness outside adds an earthy undertone to the room's otherwise inviting aroma."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The muted light casts a somber tone over the room, dulling the once vibrant colors of the upholstery and decor.",
            "Shadows deepen in the corners, creating an atmosphere thick with unspoken tension and lingering secrets."
          ],
          "sounds": [
            "The soft ticking of a clock on the mantelpiece marks the passage of time, each tick echoing the growing anticipation in the air.",
            "The low hum of conversation fades in and out, punctuated by the occasional nervous laughter, as guests sense the unease that hangs over them."
          ],
          "smells": [
            "The scent of polished wood and fresh flowers fills the air, but it is tinged with a subtle hint of anxiety, as if the room itself senses the tension.",
            "A waft of smoke from the fireplace adds warmth, but also a reminder of the shadows lurking just beyond the light."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers around the room, casting dancing shadows that play across the walls and illuminate the faces of the guests.",
            "The polished wooden floors shine under the warm glow, creating a cozy yet charged atmosphere as conversations deepen."
          ],
          "sounds": [
            "The soft clinking of glasses accompanies laughter and music, creating a lively backdrop to the gathering.",
            "The crackling of the fire adds a layer of intimacy, inviting whispers and shared secrets among friends."
          ],
          "smells": [
            "The rich aroma of fine wine fills the air, mingling with the scent of freshly baked pastries that sit temptingly on a side table.",
            "A hint of cigar smoke from a nearby guest adds a sophisticated layer to the evening's ambiance."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room serves as the heart of social interaction within Little Middleton Manor, its elegant decor and inviting atmosphere drawing guests together. Here, laughter and conversation flow freely, yet beneath the surface lies an undercurrent of tension, as secrets threaten to bubble to the surface. The flickering candlelight casts a warm glow, creating a cozy intimacy that belies the darker truths lurking in the shadows.",
        "As the evening progresses, the drawing room transforms into a stage for whispered confessions and guarded glances, where every word spoken carries weight. The rich upholstery and polished surfaces seem to absorb the tension, each moment stretching out as guests navigate the intricate dance of social niceties, all while a storm brews just outside, echoing the turmoil within."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Staff gathering space",
      "visualDetails": "The servants' hall is a stark contrast to the grandeur of the rest of the estate, featuring simple wooden furniture and utilitarian decor. A large wooden table occupies the center, surrounded by mismatched chairs, while a small fireplace provides warmth in the chill of the evening.",
      "sensoryDetails": {
        "sights": [
          "The walls are lined with faded wallpaper, peeling in places, revealing the rough wood beneath, a reminder of the room's utilitarian purpose.",
          "A large clock ticks steadily on the wall, its hands moving with an almost mocking precision, a constant reminder of the passage of time."
        ],
        "sounds": [
          "The clatter of dishes and the murmur of conversation fill the air, as staff members share their thoughts and gossip about the happenings in the manor above.",
          "The crackling of the fire provides a comforting backdrop to the otherwise bustling atmosphere, mixing with the sound of footsteps as staff move in and out."
        ],
        "smells": [
          "The scent of boiled potatoes and cabbage wafts through the air, mixed with the lingering aroma of wood smoke from the fireplace, creating a homely yet utilitarian smell.",
          "A hint of stale bread adds a layer of comfort, a reminder of the simple meals that sustain the staff as they go about their duties."
        ],
        "tactile": [
          "The rough wood of the table feels coarse against the skin, its surface marred by years of use, each scratch and dent telling a story of its own.",
          "The temperature is cool, a contrast to the warmth of the fireplace, creating a cozy yet functional atmosphere for the staff."
        ]
      },
      "accessControl": "The servants' hall is accessible to all staff members at any time, serving as a communal space for meals and breaks. It is off-limits to guests, maintaining the division between the service and the elite.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "The light is dim in the morning, filtered through rain-streaked windows, casting a gloomy pall over the practical furnishings.",
            "Dishes piled high on the table reflect the gray light, creating a stark contrast to the bright colors of the dining room above."
          ],
          "sounds": [
            "The sound of rain tapping against the windows provides a rhythmic backdrop to the chatter of staff preparing for the day ahead.",
            "Occasional laughter breaks through the otherwise quiet morning, adding a touch of warmth to the otherwise dreary atmosphere."
          ],
          "smells": [
            "The scent of damp earth wafts in through the windows, mingling with the aroma of boiling vegetables on the stove, creating a homely yet somber atmosphere.",
            "A hint of mildew from the dampness outside lingers, a reminder of the weather's impact on the old estate."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The muted light casts long shadows across the room, emphasizing the utilitarian nature of the furnishings and the worn floorboards.",
            "Staff members move about with purpose, their expressions serious as they carry out their duties amidst the tension that hangs in the air."
          ],
          "sounds": [
            "The clattering of dishes and the murmur of conversation fills the air, punctuated by the occasional shout from the kitchen as orders are called.",
            "The steady ticking of the clock creates a sense of urgency, a reminder of the time constraints the staff must work within."
          ],
          "smells": [
            "The scent of boiling cabbage and potatoes permeates the air, mingling with the earthy aroma of wood smoke from the fireplace.",
            "A faint hint of vinegar from the pickling jars in the corner adds a sharpness to the otherwise comforting smells of the kitchen."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of the fireplace contrasts with the cooler colors of the room, creating an inviting atmosphere amidst the utilitarian decor.",
            "Shadows flicker across the walls as the fire crackles, adding a sense of warmth and community to the space."
          ],
          "sounds": [
            "The sounds of laughter and conversation fill the hall as staff unwind after a long day, creating a lively atmosphere.",
            "The crackling of the fire provides a comforting backdrop, punctuated by the occasional clink of glasses as staff celebrate small victories."
          ],
          "smells": [
            "The aroma of hearty stew fills the air, mingling with the scent of fresh bread that has just come from the oven, creating a comforting and homely smell.",
            "A hint of tobacco smoke wafts in from a nearby room, adding an element of warmth and familiarity to the evening gathering."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The servants' hall serves as a refuge for the staff, a place where they can momentarily escape the demands of their duties and share in the camaraderie that binds them together. The atmosphere is filled with the sounds of laughter and chatter, a stark contrast to the hushed tones of the drawing room above. Here, the warmth of the fire and the aroma of simple, hearty food create a sense of belonging, even amidst the tension of the manor's upper echelons.",
        "As the evening wears on, the servants gather around the table, swapping stories and sharing gossip about the guests and their secrets. The flickering fire casts shadows on their faces, illuminating the camaraderie that exists among them, while unspoken fears and concerns about their roles in the unfolding drama linger just beneath the surface."
      ]
    }
  ],
  "note": "",
  "cost": 0.0029298769499999998,
  "durationMs": 36620
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1948,
    "month": "August",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "August",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "humid warmth"
    ],
    "daylight": "Long summer days, sunsets around eight o'clock in the evening, with residual light lingering until nearly nine.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as shadows deepen and the estate quiets.",
    "holidays": [
      "August Bank Holiday (last Monday in August)"
    ],
    "seasonalActivities": [
      "garden parties at country estates",
      "picnics in nearby fields",
      "local fairs celebrating summer harvests"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tweed suit jackets",
        "lightweight cotton dress shirts",
        "bow ties"
      ],
      "casual": [
        "short-sleeved shirts",
        "tailored chinos",
        "panama hats"
      ],
      "accessories": [
        "leather shoes",
        "wristwatches",
        "flat caps"
      ]
    },
    "womensWear": {
      "formal": [
        "sundresses with floral patterns",
        "lightweight cardigans",
        "straw hats adorned with ribbons"
      ],
      "casual": [
        "capri pants",
        "simple blouses",
        "peasant skirts"
      ],
      "accessories": [
        "beaded handbags",
        "pearl necklaces",
        "wide-brimmed sun hats"
      ]
    },
    "trendsOfTheMoment": [
      "increased popularity of ready-to-wear fashion",
      "emergence of youth culture and rock 'n' roll",
      "interest in vibrant colors and floral designs"
    ],
    "socialExpectations": [
      "emphasis on modesty in women's clothing",
      "formal attire expected for social gatherings",
      "growing acceptance of casual clothing for men during leisure"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "political strife in Europe as the Marshall Plan unfolds",
      "tensions rising with the Berlin Blockade",
      "the establishment of the state of Israel and its implications"
    ],
    "politicalClimate": "A divided Europe grapples with the aftermath of World War II, facing new ideological battles between capitalist and communist blocs.",
    "economicConditions": "Struggling economies in post-war Europe, yet signs of recovery in the U.S. with a boom in consumer goods production.",
    "socialIssues": [
      "increased unrest over civil rights",
      "debates over women’s roles in society",
      "racial tensions in urban areas"
    ],
    "internationalNews": [
      "the onset of the Korean War looming on the horizon",
      "the U.S. and U.K. solidifying their military alliances",
      "the rise of communism in Eastern Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Doris Day - 'Que Sera, Sera'",
        "Nat King Cole - 'Nature Boy'",
        "Bing Crosby - 'White Christmas'"
      ],
      "films": [
        "The Treasure of the Sierra Madre",
        "The Snake Pit",
        "Key Largo"
      ],
      "theater": [
        "South Pacific",
        "The King and I",
        "A Streetcar Named Desire"
      ],
      "radio": [
        "The Jack Benny Program",
        "Suspense",
        "The Shadow"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Naked and the Dead by Norman Mailer",
        "The Catcher in the Rye by J.D. Salinger",
        "The Old Man and the Sea by Ernest Hemingway"
      ],
      "popularGenres": [
        "post-war fiction",
        "detective mysteries",
        "social commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "the polio vaccine in trials",
        "the television remote control prototype"
      ],
      "commonDevices": [
        "bicycles as a primary mode of transport",
        "manual typewriters",
        "early home refrigerators"
      ],
      "emergingTrends": [
        "the rise of television as a household staple",
        "increased consumer access to automobiles",
        "the spread of electric household appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Bottle of milk: one shilling",
        "Movie ticket: one shilling and sixpence"
      ],
      "commonActivities": [
        "attending summer fairs",
        "visiting local parks for leisure",
        "participating in community picnics"
      ],
      "socialRituals": [
        "afternoon tea with neighbors",
        "weekly church services followed by social gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing fluidity in class structures due to post-war changes",
      "persistent elitism among the upper class"
    ],
    "gender": [
      "women increasingly entering the workforce post-war",
      "traditional gender roles still prevalent in many households",
      "growing push for women's rights"
    ],
    "race": [
      "racial segregation remains a contentious issue",
      "increased awareness and advocacy for civil rights among minorities"
    ],
    "generalNorms": [
      "conformity in social behavior expected",
      "importance of family and community gatherings emphasized",
      "rising skepticism toward government and authority"
    ]
  },
  "atmosphericDetails": [
    "The scent of wet earth and freshly mown grass hangs in the humid air, punctuated by the occasional distant rumble of thunder.",
    "Subdued chatter and laughter echo from the manor as guests mingle under the large canvas tents set up for the estate's summer gathering.",
    "The soft, flickering glow of oil lamps cast elongated shadows on the walls, creating an intimate yet tense atmosphere filled with unspoken secrets."
  ],
  "paragraphs": [
    "In August 1948, the air is thick with humidity and the faint smell of rain-soaked earth at the sprawling country estate, where guests have gathered for an elegant summer soirée. Overcast skies loom overhead, casting a somber pallor over the festivities. The distant rumble of thunder accompanies the intermittent rain, creating an atmosphere that feels both intimate and foreboding. As shadows lengthen with the early setting sun, the estate's grandeur contrasts sharply with the unresolved tensions of a world still reeling from the aftermath of World War II.",
    "Fashion trends of the time reflect the optimism and complexity of post-war society. Men don tweed suit jackets and lightweight cotton shirts, while women grace the gathering in vibrant floral sundresses and simple yet elegant cardigans. Accessories like leather shoes and beaded handbags complete their outfits, showcasing a blend of practicality and aesthetic beauty that characterizes the era. This summer, the latest styles emphasize bright colors and floral patterns, mirroring the renewed hope that permeates the air, even as underlying conflicts simmer just below the surface.",
    "Daily life in this period reveals a society grappling with change. Prices remain stable yet modest, with a loaf of bread costing four pence and movie tickets priced at one shilling and sixpence. Afternoon tea rituals punctuate the social calendar, offering a moment for neighbors to gather and share news, while summer fairs and picnics bring communities together in celebration. However, the specter of social issues looms large, with conversations hinting at the growing push for civil rights and the shifting roles of women in a recovering economy. As the evening unfolds, the tension of unspoken conflicts hangs in the air, setting the stage for the mystery that is about to unravel."
  ],
  "note": "",
  "cost": 0.0010675665,
  "durationMs": 11811
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense inheritance meeting at a secluded country estate brings together family, staff, and associates, all grappling with the societal shifts of post-war life and the pressures of hidden agendas.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The upper class navigates the changing roles of women in the workforce while dealing with the lingering effects of the war and the emerging Cold War tensions."
  },
  "setting": {
    "location": "A grand manor house set within expansive, manicured gardens",
    "institution": "Country house estate",
    "weather": "Overcast with intermittent rain"
  },
  "castAnchors": [
    "Theodora Compton",
    "Roger Merton",
    "Joan Rayleigh",
    "Philip Ingram",
    "Geoffrey Plowden"
  ],
  "theme": "A classic murder mystery"
}

### LOCKED_FACTS
[
  {
    "id": "clock_reading",
    "value": "ten minutes past eleven",
    "description": "The exact time shown on the stopped clock face"
  },
  {
    "id": "winding_amount",
    "value": "forty minutes",
    "description": "The exact amount the clock was wound back"
  },
  {
    "id": "distance_travelled",
    "value": "thirty feet",
    "description": "The distance from the clock to the victim's location"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Establishes the time shown by the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock's time contradicts eyewitness accounts.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Highlights discrepancies in the timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "physical",
      "description": "A unique winding key is found near the clock.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "Suggests tampering with the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Dust on the clock face indicates it hasn't been disturbed in days.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Implies the clock was not tampered with recently.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "This contradicts claims of the clock being tampered with during the party.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Overturns the assumption of recent tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "behavioral",
      "description": "Roger Merton was seen near the clock shortly before the murder.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "Links Roger Merton to the crime scene.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "testimonial",
      "description": "Eliminates Joan Rayleigh because she was seen leaving the party at ten thirty in the evening.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Confirms Joan Rayleigh's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Philip Ingram because he has a documented alibi from ten o'clock in the evening to eleven o'clock in the evening.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Confirms Philip Ingram's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "physical",
      "description": "Fingerprints found on the clock face match Roger Merton's.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "Links Roger Merton directly to the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "physical",
      "description": "Footprints in the garden lead towards the study.",
      "sourceInCML": "CASE.constraint_space.access.objects[0]",
      "pointsTo": "Suggests someone entered the study from the garden.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "behavioral",
      "description": "Roger Merton was observed acting nervously during the party.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[1]",
      "pointsTo": "Suggests possible guilt or premeditation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "temporal",
      "description": "Theodora was last seen at ten forty five in the evening, shortly before her death.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Establishes a timeline for the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "temporal",
      "description": "Time of death recorded at eleven fifteen in the evening.",
      "sourceInCML": "CASE.constraint_space.time.anchors[1]",
      "pointsTo": "Confirms the timeline of events.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "testimonial",
      "description": "Eliminates Joan Rayleigh because she was with Geoffrey Plowden at ten fifty in the evening.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Confirms Joan Rayleigh's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_roger_merton",
      "category": "temporal",
      "description": "Direct evidence ties Roger Merton to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Roger Merton had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Establishes the time shown by the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "behavioral",
      "description": "Roger Merton was seen near the clock shortly before the murder.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "Links Roger Merton to the crime scene.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Theodora last seen at ten forty five in the evening remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_backstop_step_3",
      "category": "temporal",
      "description": "Dust on the clock face indicates it hasn't been disturbed in days.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This contradicts claims of the clock being tampered with during the party.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [],
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
      "clue_culprit_direct_roger_merton",
      "clue_core_elimination_chain"
    ],
    "mid": [
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_11",
      "clue_12",
      "clue_fp_contradiction_step_3",
      "clue_fp_backstop_step_3"
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
  "latencyMs": 11411,
  "cost": 0.00686305785
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
