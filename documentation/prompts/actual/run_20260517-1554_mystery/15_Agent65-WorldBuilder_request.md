# Actual Prompt Record

- Run ID: `mystery-1779033269920`
- Project ID: ``
- Timestamp: `2026-05-17T15:57:03.674Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `68288f1d4ab840bc`

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
    "title": "The Clockwork Conundrum",
    "author": "Unknown",
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
      "subtype": "inheritance dispute"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "socialite",
      "relationships": [
        "Victim's cousin"
      ],
      "public_persona": "Charming and well-mannered",
      "private_secret": "Desires to inherit estate",
      "motive_seed": "Financial gain",
      "motive_strength": "strong",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Direct access to the clock room"
      ],
      "behavioral_tells": [
        "Nervous when discussing inheritance"
      ],
      "stakes": "High",
      "evidence_sensitivity": [
        "Clock manipulation traces"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "family physician",
      "relationships": [
        "Victim's doctor"
      ],
      "public_persona": "Respected and reliable",
      "private_secret": "In debt due to gambling",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "7:30 PM to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the study"
      ],
      "behavioral_tells": [
        "Fidgety when questioned about timing"
      ],
      "stakes": "Moderate",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "military man",
      "relationships": [
        "Old friend of the victim"
      ],
      "public_persona": "Stoic and honorable",
      "private_secret": "Harbors resentment over financial dependency",
      "motive_seed": "Desire to claim the estate for himself",
      "motive_strength": "weak",
      "alibi_window": "8:00 PM to 9:15 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the estate grounds"
      ],
      "behavioral_tells": [
        "Defensive when questioned about whereabouts"
      ],
      "stakes": "Low",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "Friend of the victim"
      ],
      "public_persona": "Intelligent and observant",
      "private_secret": "Knew about the victim's financial troubles",
      "motive_seed": "Friendship loyalty",
      "motive_strength": "weak",
      "alibi_window": "8:00 PM to 9:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Direct access to the manor"
      ],
      "behavioral_tells": [
        "Calm and collected during investigation"
      ],
      "stakes": "High",
      "evidence_sensitivity": [],
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
      "summary": "During a charity event at the grand manor, the wealthy heir is found dead, and the guests must uncover the truth behind a manipulated clock that misleads the timeline of events."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock was tampered with to alter the timeline of the murder.",
      "delivery_path": [
        {
          "step": "The clock was wound back to make the time of death appear later."
        }
      ]
    },
    "outcome": {
      "result": "The time of death was misrepresented, leading to wrongful accusations."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred after Eleanor Voss claims to have left the study.",
    "type": "temporal",
    "why_it_seems_reasonable": "Eleanor's alibi aligns with the clock's incorrect time.",
    "what_it_hides": "The clock was tampered to hide her presence at the scene."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "8:00 PM",
        "9:00 PM"
      ],
      "windows": [
        "7:30 PM to 9:30 PM"
      ],
      "contradictions": [
        "Witnesses remember the clock striking eight when it should have shown quarter past eight."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The mechanical clock",
        "The study",
        "The victim's belongings"
      ],
      "permissions": [
        "Access to the study",
        "Access to the clock room"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be tampered with"
      ],
      "traces": [
        "Fingerprints on the clock face",
        "Scratch marks indicating recent tampering"
      ]
    },
    "social": {
      "trust_channels": [
        "Family connections",
        "Medical authority"
      ],
      "authority_sources": [
        "Dr. Finch's medical reports"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows the time as quarter past eight.",
        "correction": "This indicates that the murder could not have occurred after eight o'clock.",
        "effect": "Eliminates Dr. Mallory Finch as he claims to have left at eight-thirty.",
        "required_evidence": [
          "The clock shows the time as quarter past eight.",
          "Witnesses confirm the last time the victim was seen was at eight."
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock hands are misaligned with the wall markings.",
        "correction": "This suggests that the clock was tampered with to show an incorrect time.",
        "effect": "Narrows the time of death to before eight o'clock.",
        "required_evidence": [
          "The clock hands are not aligned with the wall clock markings.",
          "Witnesses recall seeing the clock pointing to quarter past eight."
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint scratch is visible on the clock face.",
        "correction": "This indicates recent tampering, supporting the theory that the clock was adjusted.",
        "effect": "Narrows suspicion towards Eleanor Voss, who had access to the clock.",
        "required_evidence": [
          "Faint scratch marks are visible on the clock face.",
          "Access records show Eleanor Voss was in the study."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, study, and quarter against the claimed timeline.",
    "knowledge_revealed": "The clock's internal mechanism shows signs of recent adjustment.",
    "pass_condition": "The clock must show evidence of tampering consistent with Eleanor's access.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_culprit_direct_eleanor_voss",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock shows quarter past eight, eliminating Dr. Mallory Finch. Step 2: The misalignment of clock hands indicates tampering, narrowing time of death. Step 3: The scratch on the clock reveals manipulation, implicating Eleanor Voss."
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
        "Observe the clock's mechanism",
        "Draw conclusion about Eleanor's guilt"
      ],
      "test_type": "mechanical examination"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Demonstrate his alibi is consistent with the timeline.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Show his access was limited during the time of the murder.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence from the clock."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation of the clock."
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witness statements about the last time the victim was seen."
      },
      {
        "clue_id": "clue_core_contradiction_chain",
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
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Inspection of the clock mechanism."
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
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
    "summary": "Eleanor Voss is a charming socialite whose extravagant lifestyle masks a deep financial crisis. As the stakes rise with a murder in her social circle, she must confront her dependency on wealth and the lengths she will go to preserve her family's legacy.",
    "publicPersona": "Eleanor is the epitome of grace and charm, throwing lavish parties that are the talk of Little Middleton. With a keen eye for fashion and a heart for philanthropy, she is beloved by her peers and often seen as a beacon of society's elite.",
    "privateSecret": "Beneath her polished exterior, Eleanor grapples with crippling financial troubles stemming from a series of poor investments. This hidden burden fuels her anxiety about maintaining her status and inheritance.",
    "motiveSeed": "The murder of the victim strikes a chord with Eleanor, as she fears the victim's heirs might stake a claim to her family's wealth, further jeopardizing her already tenuous financial situation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Eleanor claims to have attended a charity event from 8 to 10 PM, surrounded by witnesses who are more interested in the champagne than the details.",
    "accessPlausibility": "easy",
    "stakes": "With her family's legacy and financial stability on the line, Eleanor is compelled to navigate the treacherous waters of scandal and suspicion.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with an airy lilt, punctuating her sentences with playful sarcasm. She often employs euphemisms to mask her true feelings, making her words feel like a delicate dance around the truth.",
    "internalConflict": "Eleanor wrestles with the fear that her identity is intrinsically tied to her wealth. This case forces her to confront the possibility that her worth extends beyond her bank account.",
    "personalStakeInCase": "The murder directly threatens her financial future and her family's reputation, igniting a fierce determination to uncover the truth.",
    "paragraphs": [
      "Eleanor Voss glided through the grand hall of her estate, her laughter ringing like chimes against the backdrop of classical music. The evening was a celebration of charity, yet the irony wasn’t lost on her; she was the queen of a castle built on a shaky foundation. Her guests, oblivious to the storm brewing beneath her polished exterior, reveled in the opulence, sipping champagne and nibbling on delicacies, while Eleanor's mind raced with thoughts of her dwindling investments.",
      "As she exchanged pleasantries with the guests, her heart fluttered at the thought of the victim, the man whose death could tip her precarious balance. She had always maintained a façade of confidence, but now, with the specter of financial ruin looming, she felt like a juggler with one too many balls in the air. The victim’s heirs were a threat she couldn’t ignore, and the fear of losing everything she held dear gnawed at her insides.",
      "When the news of the murder broke, Eleanor felt a chill ripple through her. Could it be that the man she so desperately wanted to keep at arm's length had been silenced forever? She found herself torn between relief and dread. If the victim's secrets came to light, her own financial woes could be laid bare for all to see. The stakes had never been higher, and Eleanor knew she had to act quickly, lest her carefully constructed world come crashing down.",
      "In the days that followed, Eleanor's charm became a weapon, deflecting suspicion while she sought to uncover the truth behind the murder. Each conversation felt like a meticulous game of chess, where she maneuvered between the players, ever wary of the consequences of a misstep. As she began to peel back the layers of deception, Eleanor realized that the true battle was not just for her inheritance, but for her very identity—a reckoning that would force her to redefine who she was beyond the wealth she had always relied upon."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a dedicated physician whose professional reputation is threatened by a clandestine affair with the murder victim. As the investigation unfolds, she must confront the precarious balance between her career and her heart.",
    "publicPersona": "A respected figure in Little Middleton, Dr. Finch is known for her unwavering commitment to her patients. Her calm demeanor and thorough approach have earned her the trust of the community, making her a pillar of the local medical field.",
    "privateSecret": "Unknown to her patients and colleagues, Dr. Finch has been entangled in a secret romantic relationship with the victim, a connection that could shatter her carefully cultivated reputation if exposed.",
    "motiveSeed": "The fear of the victim revealing their affair is a constant shadow over Mallory's thoughts, as it could derail her career and tarnish the respect she has worked so hard to earn.",
    "motiveStrength": "moderate",
    "alibiWindow": "Mallory claims she was on a house call from 7:30 to 9 PM, a plausible cover but one that could easily be scrutinized.",
    "accessPlausibility": "possible",
    "stakes": "Her reputation and career hang in the balance, with the potential for public disgrace looming over her every move.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with a measured cadence, often punctuating her statements with dry observations. She has a habit of using medical metaphors to describe emotional states, making her sound both clinical and relatable.",
    "internalConflict": "Mallory is torn between her love for the victim and her ambition as a physician, fearing that choosing one will mean losing the other.",
    "personalStakeInCase": "The murder not only threatens her career but also forces her to confront her feelings for the victim, challenging her to prioritize her professional integrity over personal desires.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her office, the scent of antiseptic mingling with the weight of her secrets. As she organized her medical records, her mind wandered to the victim, a man whose charm had drawn her into a web of desire that now threatened to ensnare her career. She had always been the model of professionalism, yet here she was, entangled in a scandal that could unravel everything she had built.",
      "The news of the murder sent shockwaves through her, igniting a whirlwind of emotions. Mallory's heart raced as she recalled their last encounter, the intimacy of their shared moments now overshadowed by the specter of death. What if someone discovered their affair? The thought sent a cold shiver down her spine, forcing her to grapple with the harsh reality that her career could be sacrificed at the altar of passion.",
      "As she navigated the investigation, Mallory adopted a façade of composure, her voice steady as she answered questions from the authorities. Yet, inside, a storm raged. Each inquiry felt like a surgical probe, exposing her vulnerabilities. She was a healer by trade, yet she now found herself in a position where healing was not just about mending bodies but also about salvaging her own reputation.",
      "With each passing day, the stakes grew higher. Mallory was determined to protect her career, but the more she delved into the mystery, the more she felt the pull of her emotions. The lines between right and wrong blurred, and as she confronted the reality of her relationship with the victim, she was forced to consider what sacrifices she was willing to make for both love and ambition."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer whose stern exterior masks a lifetime of grievances against the victim. As the investigation unfolds, he must confront his past and decide whether to let go of old grudges.",
    "publicPersona": "A man of honor and discipline, Captain Hale commands respect in Little Middleton. His military background lends him an air of authority, and he is often regarded as a guiding figure for younger men seeking direction.",
    "privateSecret": "Ivor harbors a deep-seated grudge against the victim, stemming from long-standing family disputes over inheritance that have festered into resentment.",
    "motiveSeed": "He believes the victim wronged him in a bitter family inheritance dispute, a wound that has never healed and now colors his perception of the murder.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor claims to have been in the garden from 8:30 to 9:15 PM, a time during which he could have acted without being seen.",
    "accessPlausibility": "unlikely",
    "stakes": "His pride and family honor are at stake, forcing him to confront the ghosts of his past.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks with a clipped, authoritative tone, often using terse, direct language. He has a habit of punctuating his statements with a disapproving grunt, making his opinions clear without embellishment.",
    "internalConflict": "Ivor is tormented by his past grievances and must confront whether holding onto resentment is worth the cost of his own peace of mind.",
    "personalStakeInCase": "The murder forces Ivor to revisit his family's legacy and consider the possibility of forgiveness, challenging his long-held beliefs about honor and justice.",
    "paragraphs": [
      "Captain Ivor Hale stood on the porch of his modest home, his gaze fixed on the horizon as the sun dipped below the trees. The weight of his past pressed heavily on his shoulders, a burden he had carried since the days of his youth. He was a man of principle, yet here he was, grappling with a truth he could no longer ignore: the victim's death would force him to confront the family feuds that had long since soured his heart.",
      "The news of the murder stirred a tempest within him, awakening old grievances that had lain dormant for too long. Ivor had always believed in the honor of his family name, yet the victim had tarnished that name with perceived slights and betrayals. He felt a flicker of satisfaction at the thought of the man finally facing consequences, but it was quickly extinguished by the realization that such thoughts only served to deepen his own bitterness.",
      "As the investigation unfolded, Ivor found himself drawn into a world of suspicion and intrigue. His stern demeanor was met with raised eyebrows, yet he remained steadfast in his resolve. Each question posed to him felt like a challenge, forcing him to reckon with his own part in the family drama that had played out over the years. He was a man of action, yet now he found himself at a crossroads, grappling with emotions he had long deemed irrelevant.",
      "In the days that followed, Ivor's internal struggle intensified. He could no longer deny the toll that his grievances had taken on his soul. As he delved deeper into the investigation, he began to see glimpses of the man he used to be—a man capable of forgiveness and understanding. The murder had not just taken a life; it had opened a door to a path of reconciliation, one that could lead him to peace if only he would take the first step."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious journalist willing to blur ethical lines to secure her big break. As she investigates the murder, her relentless pursuit of a sensational story leads her to confront the ethical dilemmas of her profession.",
    "publicPersona": "An ambitious and determined journalist, Beatrice is known for her tenacity and sharp wit. She possesses a knack for uncovering stories that others overlook, making her both respected and reviled within the journalistic community.",
    "privateSecret": "Desperate to make a name for herself, Beatrice often straddles the line between investigative journalism and sensationalism, risking her integrity for a story that could launch her career.",
    "motiveSeed": "Her ambition drives her to seek a sensational story from the murder, as she believes it could catapult her into the ranks of illustrious journalists.",
    "motiveStrength": "compelling",
    "alibiWindow": "Beatrice claims to have been interviewing locals from 7 to 9 PM, a cover that allows her to blend into the narrative of the unfolding tragedy.",
    "accessPlausibility": "possible",
    "stakes": "Her career could hinge on this story, making her reckless in her pursuit of the truth.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with a rapid-fire delivery, peppering her dialogue with sharp observations and a touch of sarcasm. She often uses rhetorical questions to engage her audience, making her sound both clever and confrontational.",
    "internalConflict": "Beatrice struggles with the ethical implications of her ambition, questioning whether the pursuit of a story is worth sacrificing her integrity.",
    "personalStakeInCase": "The murder presents an opportunity for Beatrice to elevate her career, but it forces her to confront the moral complexities of journalism and the consequences of her actions.",
    "paragraphs": [
      "Beatrice Quill leaned against the bar, her notebook poised like a weapon, ready to capture the latest gossip swirling around Little Middleton. The murder had sent shockwaves through the community, and Beatrice could practically taste the sensational story that was ripe for the taking. With her sardonic wit and relentless drive, she was determined to carve her name into the annals of journalism, even if it meant dancing on the edge of ethical boundaries.",
      "As she interviewed locals, Beatrice's sharp tongue and quick mind became her greatest assets. She navigated conversations with a blend of charm and interrogation, eliciting details that others might overlook. Each revelation felt like a stepping stone toward her ultimate goal, yet a nagging doubt crept into her mind. Was she becoming the very thing she despised—a journalist more concerned with sensationalism than truth?",
      "With every lead she followed, Beatrice felt the thrill of the chase, but also the weight of her choices. The murder was a goldmine of opportunity, yet she found herself wrestling with the implications of her ambition. Would her pursuit of a story justify the means, or would it cost her the very integrity she had fought to uphold? The lines blurred as she delved deeper into the investigation, and she knew she was skating on thin ice.",
      "As the case unfolded, Beatrice's internal conflict intensified. The murder was not just a story—it was a reflection of her own aspirations and the ethical dilemmas that plagued her profession. With her career on the line, she faced a choice: pursue the truth at any cost, or step back and consider the consequences of her actions. The clock was ticking, and Beatrice knew she had to decide whether the story was worth sacrificing her integrity."
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
    "type": "country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling manor house steeped in mystery, surrounded by manicured gardens and an ancient forest, concealing secrets within its labyrinthine corridors.",
    "visualDescription": "The manor boasts intricate woodwork, towering ceilings adorned with ornate plasterwork, and a façade of weathered stone, its windows framed by ivy and wrought iron.",
    "atmosphere": "A pervasive sense of tension hangs in the air, as if the very walls of the manor are privy to the secrets of its guests.",
    "paragraphs": [
      "Little Middleton Manor stands like a sentinel among the rolling hills, its stone façade cloaked in creeping ivy that clings to the walls like whispers of the past. Inside, the air is thick with the scent of polished wood and the faint tang of coal smoke, while shadows dance in the flickering light of the gas lamps. Ornate woodwork lines the halls, echoing the footsteps of its inhabitants, each corridor twisting into the next, creating an unsettling maze that feels both familiar and foreign.",
      "The grand drawing room, with its high ceilings and heavy draperies, is a place where secrets linger in the corners, and the ticking of a large grandfather clock fills the silence with a rhythmic reminder of time's passage. Outside, the manicured gardens, meticulously tended yet eerily quiet, seem to conspire with the ancient trees of the forest beyond, their gnarled branches reaching towards the sky like skeletal fingers. The estate is a world unto itself, isolated from the bustling town of Little Middleton, where news travels slowly and assistance is a distant thought.",
      "As the guests gather for dinner, the atmosphere thickens with unspoken tension. Each clink of silverware against porcelain is a reminder of the unsolved mystery that looms over them. The distant rumble of thunder adds to the foreboding mood, as if nature itself is warning them of the dark secrets hidden within the walls of the manor. With every passing hour, the shadows grow longer, and the clock ticks ever closer to the revelation of truths best left buried."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "overcast with occasional rain, typical of the English countryside",
    "timeFlow": "Three days of mounting tension among the guests as the clock ticks towards the inevitable revelation.",
    "mood": "tense and foreboding, with an air of suspicion among the guests",
    "eraMarkers": [
      "manual typewriters in the study",
      "rotary dial telephones in the hall",
      "radio broadcasts in the drawing room"
    ],
    "sensoryPalette": {
      "dominant": "the scent of damp earth and polished wood",
      "secondary": [
        "the crackle of a fire in the hearth",
        "the distant rumble of thunder",
        "the clinking of glass and silverware"
      ]
    },
    "paragraphs": [
      "As the clouds gather overhead, the manor's imposing silhouette looms larger against the grey sky, casting an ominous shadow over the manicured grounds. The air is thick with the scent of impending rain, mingling with the earthy aroma of the damp gardens, where roses bloom defiantly against the chill. Inside, the soft glow of gas lamps flickers, casting warm pools of light that barely reach the corners of the vast rooms, leaving them shrouded in mystery.",
      "The sound of rain begins to patter against the windows, a steady rhythm that adds to the growing sense of unease. Voices echo softly through the halls, punctuated by the occasional creak of the old timbers, as if the house itself is bearing witness to the secrets exchanged within its walls. Each gust of wind sends a shiver through the corridors, stirring the heavy drapes and causing the shadows to dance with an eerie life of their own."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "High ceilings adorned with plasterwork, heavy draperies, and a grand piano in the corner.",
      "sensoryDetails": {
        "sights": [
          "flickering gas lamps casting shadows",
          "ornate mantelpiece with family portraits",
          "overstuffed armchairs in rich fabrics"
        ],
        "sounds": [
          "the crackle of the fire",
          "soft laughter and whispers",
          "the ticking of a large grandfather clock"
        ],
        "smells": [
          "beeswax from candle holders",
          "the faint scent of tobacco",
          "polished wood and leather"
        ],
        "tactile": [
          "soft velvet upholstery",
          "cool marble of the fireplace",
          "worn leather of the armchair"
        ]
      },
      "accessControl": "Accessible to all guests; the family may restrict entry during private discussions.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets on window panes",
            "dim light filtering through clouds"
          ],
          "sounds": [
            "steady rain on the roof",
            "soft murmurs of conversation"
          ],
          "smells": [
            "damp earth from the gardens",
            "freshly brewed tea"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping along the floor",
            "the glow of lamps against the grey light"
          ],
          "sounds": [
            "the distant sound of thunder",
            "the rustle of pages in books"
          ],
          "smells": [
            "beeswax candles burning",
            "dust motes in the air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting off glassware",
            "long shadows cast by the fireplace"
          ],
          "sounds": [
            "the hum of conversation",
            "the occasional clink of glasses"
          ],
          "smells": [
            "the aroma of dinner cooking",
            "woodsmoke from the fireplace"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room, with its high ceilings and ornate plasterwork, serves as the heart of the manor, where guests gather to exchange pleasantries and hidden glances. The flickering gas lamps cast a warm glow on the rich furnishings, while the heavy draperies frame the windows, filtering the light and creating an intimate atmosphere. A grand piano sits silently in the corner, its keys waiting for a hand to bring forth a melody that might lighten the oppressive air.",
        "As the evening unfolds, the tension in the room is palpable. Conversations turn to hushed whispers, punctuated by the crackle of the fire and the distant rumble of thunder outside. Each guest seems acutely aware of the weight of unspoken words, the secrets that linger just beneath the surface, waiting for the right moment to be unveiled."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Private study and clue discovery",
      "visualDetails": "Tall shelves filled with dusty tomes, a large oak table at the center, and a globe in the corner.",
      "sensoryDetails": {
        "sights": [
          "dust motes floating in sunlight",
          "leather-bound volumes lining the shelves",
          "a fireplace with a wrought iron grate"
        ],
        "sounds": [
          "the rustle of pages turning",
          "the ticking of a small clock",
          "the distant sound of rain against the windows"
        ],
        "smells": [
          "old paper and leather",
          "the musty scent of forgotten knowledge",
          "smoky remnants from the fireplace"
        ],
        "tactile": [
          "smooth wood of the desk",
          "rough edges of old books",
          "the chill of the marble floor"
        ]
      },
      "accessControl": "Restricted access; only the family and trusted guests allowed; locked when not in use.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "water droplets on window ledges"
          ],
          "sounds": [
            "steady patter of rain",
            "soft thud of a book closing"
          ],
          "smells": [
            "damp wood from the rain",
            "the rich scent of ink"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows cast by tall shelves",
            "sunlight struggling through clouds"
          ],
          "sounds": [
            "the creak of floorboards",
            "the whisper of pages turning"
          ],
          "smells": [
            "the aroma of old books",
            "the faint scent of wax from candles"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "firelight dancing on walls",
            "the glow of a single lamp on the desk"
          ],
          "sounds": [
            "the soft crackle of the fire",
            "the distant sound of laughter from the drawing room"
          ],
          "smells": [
            "the scent of burning wood",
            "the aroma of coffee brewing"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library is a sanctuary of silence, where the air is thick with the weight of untold stories. Tall shelves, lined with leather-bound volumes, create a cathedral-like atmosphere, while a large oak table sprawls at the center, its surface marred by the marks of previous research. A globe in the corner spins slowly, a reminder of the world outside, yet here, time seems to stand still, echoing the secrets that lie within the pages of the books.",
        "As the rain beats against the windows, the library becomes an even more isolated haven. The soft rustle of pages turning fills the air, accompanied by the ticking of a small clock that seems to mock the urgency of the unfolding mystery. Each book holds the potential to reveal a clue, yet the room itself feels like a trap, with shadows lurking in the corners, waiting for the right moment to emerge."
      ]
    },
    {
      "id": "study",
      "name": "Study",
      "type": "interior",
      "purpose": "Private workspace and clue discovery",
      "visualDetails": "A mahogany desk cluttered with papers, a typewriter, and a large window overlooking the gardens.",
      "sensoryDetails": {
        "sights": [
          "sunlight streaming through the window",
          "papers strewn across the desk",
          "a flickering lamp casting shadows"
        ],
        "sounds": [
          "the clatter of typewriter keys",
          "the rustle of paper",
          "the wind whispering outside"
        ],
        "smells": [
          "fresh ink and paper",
          "the scent of leather from a chair",
          "the faint aroma of tobacco"
        ],
        "tactile": [
          "smooth surface of the desk",
          "the weight of a typewriter",
          "the chill of the window glass"
        ]
      },
      "accessControl": "Family members and select guests only; locked when not in use.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "water droplets on the window"
          ],
          "sounds": [
            "steady rain on the roof",
            "the soft clatter of typewriter keys"
          ],
          "smells": [
            "the scent of wet earth",
            "the aroma of strong coffee"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows stretching across the desk",
            "the flicker of a lamp"
          ],
          "sounds": [
            "the creak of the chair",
            "the whisper of the wind"
          ],
          "smells": [
            "the rich scent of tobacco",
            "the musty aroma of paper"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light from the setting sun",
            "the glimmer of ink on paper"
          ],
          "sounds": [
            "the quiet of the house settling",
            "the distant laughter from the drawing room"
          ],
          "smells": [
            "the scent of burning wood",
            "the aroma of whiskey in a glass"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The study, a private sanctuary, is where the head of the household retreats to gather his thoughts amid the chaos of the manor. A mahogany desk, cluttered with papers and a manual typewriter, commands the room, while a large window offers a view of the meticulously maintained gardens below. Sunlight streams through the glass, illuminating dust motes that dance lazily in the air, contrasting with the heavy atmosphere of the mystery at hand.",
        "As the rain patters softly against the window, the study feels like a world apart from the mounting tension in the rest of the house. The clatter of typewriter keys punctuates the silence, a steady rhythm that underscores the urgency of the unraveling enigma. Yet, the faint scent of tobacco lingers, a reminder of the secrets that have been shared in this very room, where every piece of paper could hold a clue to the truth."
      ]
    },
    {
      "id": "gardens",
      "name": "Gardens",
      "type": "exterior",
      "purpose": "Outdoor area for reflection and potential clue discovery",
      "visualDetails": "Meticulously manicured flower beds, hedges forming labyrinthine paths, and a stone fountain at the center.",
      "sensoryDetails": {
        "sights": [
          "vibrant blooms against green foliage",
          "the shimmer of dew on petals",
          "the intricate design of hedges"
        ],
        "sounds": [
          "the gentle trickle of water from the fountain",
          "birds chirping in the trees",
          "the rustle of leaves in the breeze"
        ],
        "smells": [
          "the sweet fragrance of flowers",
          "freshly cut grass",
          "the earthy scent of damp soil"
        ],
        "tactile": [
          "the softness of flower petals",
          "the coolness of stone pathways",
          "the rough texture of tree bark"
        ]
      },
      "accessControl": "Open to guests during the day; restricted access after dark.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds hanging low",
            "water pooling in flower beds"
          ],
          "sounds": [
            "raindrops hitting leaves",
            "the distant rumble of thunder"
          ],
          "smells": [
            "fresh rain on soil",
            "the scent of wet flowers"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "the dull light over the garden",
            "shadows from trees stretching across the paths"
          ],
          "sounds": [
            "the soft rustle of branches",
            "the sound of distant thunder"
          ],
          "smells": [
            "the fragrance of wilting flowers",
            "the earthy scent of damp earth"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the fading light casting long shadows",
            "fireflies beginning to flicker"
          ],
          "sounds": [
            "the chirping of crickets",
            "the gentle hum of night insects"
          ],
          "smells": [
            "the scent of blooming night flowers",
            "the coolness of evening dew"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The gardens surrounding Little Middleton Manor are a testament to meticulous care, with vibrant blooms surrounded by plush greenery that beckons for exploration. Paths twist like a labyrinth, hedges trimmed to perfection creating secret corners that invite whispered conversations. At the center, a stone fountain bubbles gently, its water reflecting the overcast sky, providing a serene backdrop to the tension brewing inside the manor.",
        "In the morning, as rain glistens on the petals, the gardens take on a somber tone, with droplets pooling in the flower beds, and the air heavy with the scent of damp soil. The sound of rain is interrupted by the occasional chirp of a bird, a reminder that life continues outside, even as shadows loom within. In the evening, the gardens transform, shadows lengthening and fireflies flickering to life; the atmosphere shifts, charged with anticipation as secrets await to be uncovered."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023837104499999998,
  "durationMs": 27034
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1932,
    "month": "November",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast skies",
      "occasional light rain",
      "chilly winds"
    ],
    "daylight": "Short days with twilight settling by four o'clock in the afternoon, making evenings long and dark.",
    "time_of_day_of_crime": "Late evening — after dinner, between eight and ten o'clock.",
    "holidays": [
      "Guy Fawkes Night (November 5)"
    ],
    "seasonalActivities": [
      "hunting parties in the countryside",
      "afternoon teas by the fire",
      "preparations for Christmas festivities"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored morning coat",
        "waistcoat in houndstooth pattern",
        "cravat or tie with subtle patterns"
      ],
      "casual": [
        "tweed flat cap",
        "corduroy trousers",
        "wool pullover"
      ],
      "accessories": [
        "silver pocket watch",
        "cane for outdoor events",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length evening gown with drop waist",
        "beaded cloche hat",
        "long pearl necklace"
      ],
      "casual": [
        "high-waisted skirt with a fitted blouse",
        "knitted cardigan",
        "tweed jacket"
      ],
      "accessories": [
        "fur stole",
        "silk scarf",
        "sensible leather handbag"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "increased use of synthetic fabrics",
      "revival of vintage styles from the 1920s"
    ],
    "socialExpectations": [
      "strict adherence to class distinctions",
      "importance of proper etiquette in social gatherings",
      "expectation of women to manage domestic affairs"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Presidential election results in the United States favoring Franklin D. Roosevelt",
      "Continued effects of the Great Depression on employment and economy",
      "Rising tensions in Europe with the ascent of fascist regimes"
    ],
    "politicalClimate": "A climate of uncertainty as various nations grapple with economic hardship and political extremism.",
    "economicConditions": "High unemployment rates and widespread poverty, particularly affecting the working class.",
    "socialIssues": [
      "strikes and labor unrest",
      "debate over government assistance programs",
      "growing anti-fascist sentiments"
    ],
    "internationalNews": [
      "Germany's political landscape shifting with Hitler's rise",
      "Increased tensions in Asia with Japanese expansionism",
      "Concerns over Britain’s role in European stability"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Night and Day' by Cole Porter",
        "'The Best Things in Life Are Free' by Ray Henderson",
        "'My Heart Stood Still' by Richard Rodgers"
      ],
      "films": [
        "'Scarface' directed by Howard Hawks",
        "'The Most Dangerous Game'",
        "'The Smiling Lieutenant'"
      ],
      "theater": [
        "'Of Mice and Men' by John Steinbeck",
        "'The Royal Family' by George S. Kaufman",
        "'The Front Page' by Ben Hecht"
      ],
      "radio": [
        "'The Shadow' broadcasts",
        "News bulletins from the BBC",
        "'Amos 'n' Andy' comedy series"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Brave New World' by Aldous Huxley",
        "'Murder in the Cathedral' by T.S. Eliot",
        "'Turtle Island' by John Steinbeck"
      ],
      "popularGenres": [
        "detective fiction",
        "social commentary novels",
        "romantic fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator becoming more common",
        "advancements in radio technology",
        "early development of the electric washing machine"
      ],
      "commonDevices": [
        "radio sets in most homes",
        "rotary dial telephones",
        "manual typewriters"
      ],
      "emergingTrends": [
        "increased availability of household appliances",
        "growing acceptance of modernist design",
        "use of film in education and advertising"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: six pence",
        "Pint of ale: one shilling"
      ],
      "commonActivities": [
        "hunting parties on weekends",
        "afternoon tea gatherings",
        "visiting local markets for fresh produce"
      ],
      "socialRituals": [
        "formal dinner parties",
        "Sunday church services",
        "seasonal preparations for Christmas feasts"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Rigid class structures dominate social interactions",
      "Upper classes maintain a sense of superiority over the lower classes"
    ],
    "gender": [
      "Women are expected to fulfill domestic roles",
      "Men retain authority in social and economic matters",
      "Emerging feminist ideals challenge traditional roles"
    ],
    "race": [
      "Prejudice and discrimination against minorities persist",
      "Colonial attitudes influence perceptions of race"
    ],
    "generalNorms": [
      "Politeness and decorum are essential in social settings",
      "Public behavior is closely monitored by peers",
      "Conformity to societal norms is expected"
    ]
  },
  "atmosphericDetails": [
    "The damp chill lingers in the air, the scent of wet earth mixing with the faint aroma of burning logs in the fireplace.",
    "The flicker of candlelight casts long shadows across the drawing room, where whispers of scandal and intrigue fill the space.",
    "Outside, the rustling of leaves underfoot and the distant sound of hunting horns echo through the estate, heightening the feeling of tension."
  ],
  "paragraphs": [
    "November 1932 in the English countryside brings a palpable sense of foreboding as overcast skies loom overhead, the air thick with moisture and the lingering chill of autumn. Evenings fall quickly, leaving guests at the country house estate shrouded in early darkness, where the crackling of the fireplace does little to combat the tension brewing among them. With Guy Fawkes Night recently passed, the remnants of celebration have been replaced by whispers of discontent, and the atmosphere is fraught with suspicion, as each guest seems to harbor secrets as dark as the skies above.",
    "Fashion during this time reflects a blend of function and elegance, with men donning tailored morning coats and houndstooth waistcoats for formal occasions, while women opt for tea-length evening gowns adorned with beads and long pearl necklaces. The interplay of fabrics—tweed, silk, and wool—hints at the upper-crust lifestyle, while still acknowledging the economic realities of the Great Depression that force even the affluent to be more prudent in their choices. Accessories like silver pocket watches and fur stoles complete the picture, emphasizing a lingering adherence to social standards amidst changing times.",
    "Daily life in November 1932 is marked by the routine of hunting parties in the expansive grounds of the estate, punctuated by afternoon teas savored by the fire. Conversations turn to the political climate, where the looming shadows of fascism in Europe and domestic strife take center stage, even as guests attempt to enjoy their leisure. The price of a loaf of bread at four pence and a pint of ale for one shilling serves as a grim reminder of the economic struggles outside the estate's walls. Social rituals, such as formal dinner parties and Sunday church services, provide a veneer of normalcy, yet the specter of uncertainty hangs heavily over the gathering, foreshadowing the unraveling of secrets that will inevitably lead to chaos."
  ],
  "note": "",
  "cost": 0.0010965042,
  "durationMs": 10735
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering of the manor's elite for a charitable event is overshadowed by the Great Depression's strain on wealth and privilege, as tensions rise amidst the looming threat of fascism and the secrets harbored within the estate's walls.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The rigid class system is exacerbated by economic hardship, creating a pressure cooker of envy and suspicion among the wealthy guests."
  },
  "setting": {
    "location": "A sprawling manor house set in a vast estate with manicured gardens and a nearby forest.",
    "institution": "country house estate",
    "weather": "overcast with occasional rain, typical of the English countryside"
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
      "description": "The clock in the study shows the time as quarter past eight.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This establishes the time of the clock at the scene.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "This indicates that the murder could not have occurred after eight o'clock.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts any claims of the murder happening later.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The clock hands are misaligned with the wall markings.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This suggests a discrepancy in the time displayed.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "This suggests that the clock was tampered with to show an incorrect time.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This provides evidence of manipulation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "A faint scratch is visible on the clock face.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This indicates possible recent interference.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "This indicates recent tampering, supporting the theory that the clock was adjusted.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This reinforces the idea of manipulation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "A mechanical clock was tampered with to alter the timeline of the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This reveals the core mechanism of the crime.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "This indicates that the murder could not have occurred after eight o'clock.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts any claims of the murder happening later.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he has a verified alibi at the time of the incident.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This narrows the focus toward other suspects.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_eleanor_voss",
      "category": "physical",
      "description": "Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].evidence_sensitivity[0]",
      "pointsTo": "This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "behavioral",
      "description": "Eleanor Voss was seen acting nervously before the incident.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This adds context to her potential motive.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Witnesses recall hearing the eleanor strike at the wrong time, leading to confusion about the timeline.",
      "supportsAssumption": "The murder occurred after Eleanor Voss claims to have left the study.",
      "misdirection": "This misleads by suggesting the eleanor was functioning correctly when it was not."
    },
    {
      "id": "rh_2",
      "description": "A neighbor claims to have seen a shadowy figure near the study around the time of the incident.",
      "supportsAssumption": "The murder occurred after Eleanor Voss claims to have left the study.",
      "misdirection": "This distracts from the actual evidence of claims study."
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
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ],
    "mid": [
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_core_elimination_chain",
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
  "latencyMs": 10958,
  "cost": 0.0046469775
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
