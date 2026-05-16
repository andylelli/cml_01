# Actual Prompt Record

- Run ID: `mystery-1778784318561`
- Project ID: ``
- Timestamp: `2026-05-14T18:48:15.550Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `f5ed978aa09b6094`

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
    "author": "Agent 5",
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
      "subtype": "poisoning"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Respected local socialite and amateur sleuth",
      "private_secret": "Struggling with her family's financial troubles",
      "motive_seed": "Desire to protect her family's reputation",
      "motive_strength": "strong",
      "alibi_window": "10 minutes after the hour",
      "access_plausibility": "high",
      "opportunity_channels": [
        "direct access to the victim's study"
      ],
      "behavioral_tells": [
        "Calm demeanor under pressure"
      ],
      "stakes": "High, as her family's name is at stake",
      "evidence_sensitivity": [
        "clock mechanism tampering"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "Local physician known for his punctuality",
      "private_secret": "Has a gambling problem",
      "motive_seed": "Financial desperation due to debts",
      "motive_strength": "moderate",
      "alibi_window": "20 minutes before the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the victim's drink"
      ],
      "behavioral_tells": [
        "Fidgety during questioning"
      ],
      "stakes": "Moderate, as he fears exposure",
      "evidence_sensitivity": [
        "timing of the victim's last drink"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "Retired military officer with a distinguished record",
      "private_secret": "Struggling with post-service trauma",
      "motive_seed": "Resentment towards the victim's family",
      "motive_strength": "weak",
      "alibi_window": "15 minutes before the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the victim's study"
      ],
      "behavioral_tells": [
        "Defensive when confronted"
      ],
      "stakes": "Low, as his reputation is at stake but not his freedom",
      "evidence_sensitivity": [
        "witness accounts of his whereabouts"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "Victim's close friend and confidante",
      "private_secret": "In love with the victim's partner",
      "motive_seed": "Jealousy over the victim's relationships",
      "motive_strength": "strong",
      "alibi_window": "10 minutes before the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Direct access to the victim's study"
      ],
      "behavioral_tells": [
        "Emotional instability"
      ],
      "stakes": "High, as her future depends on her secret",
      "evidence_sensitivity": [
        "access to locked study"
      ],
      "culprit_eligibility": "eligible",
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
      "summary": "During a rainy weekend at the isolated manor, Eleanor Voss uncovers a murder mystery involving Dr. Mallory Finch, whose tampering of a mechanical clock leads to false alibis and a deadly confrontation."
    },
    "accepted_facts": [
      "The clock was last checked at ten minutes past eleven.",
      "Witnesses recall hearing the clock chime at the hour.",
      "Footprints matching Dr. Finch were found near the study."
    ],
    "inferred_conclusions": [
      "Dr. Finch's alibi is inconsistent with the time of death."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, minut, and eleven to expose the false timing.",
      "delivery_path": [
        {
          "step": "Wound the clock back forty minutes before the murder."
        }
      ]
    },
    "outcome": {
      "result": "The clock indicated a time that did not match the actual time of death."
    }
  },
  "false_assumption": {
    "statement": "The time of death aligns with the victim's last known movements.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses corroborated the clock's time as accurate.",
    "what_it_hides": "The clock was deliberately tampered with to mislead investigators."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock time at ten minutes past eleven",
        "Witness accounts of clock chiming"
      ],
      "windows": [
        "Death occurred around eleven o'clock"
      ],
      "contradictions": [
        "Witness accounts conflict with physical evidence of clock tampering"
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Eleanor Voss",
        "Beatrice Quill"
      ],
      "objects": [
        "Victim's drink",
        "The mechanical clock",
        "The locked study door"
      ],
      "permissions": [
        "Dr. Finch had access to the study"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clock functions require winding",
        "Time perception can be manipulated"
      ],
      "traces": [
        "Clock shows signs of recent tampering",
        "Footprints leading to the study"
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor trusts Dr. Finch",
        "Local reputation of Dr. Finch"
      ],
      "authority_sources": [
        "Dr. Finch's position as the local physician"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock showed ten minutes past eleven when first checked.",
        "correction": "This indicates that something is wrong with the clock's timing.",
        "effect": "Narrows the time of death to before eleven.",
        "required_evidence": [
          "The clock's time recorded at ten minutes past eleven",
          "Witnesses noted hearing the clock chime at the hour"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall hearing the clock chime at the hour.",
        "correction": "If the clock chimed correctly, it should not have been tampered with.",
        "effect": "Eliminates the possibility of an accurate time of death being established.",
        "required_evidence": [
          "Witness testimony about the clock chiming",
          "The clock's visible tampering"
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints in the garden appear to match Dr. Finch's shoes.",
        "correction": "This suggests Dr. Finch was near the study around the time of death.",
        "effect": "Narrows suspect access windows.",
        "required_evidence": [
          "Footprint analysis showing match to Dr. Finch",
          "Witness reports placing Dr. Finch in the garden"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, minut, and eleven against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are clock, minut, and eleven.",
    "pass_condition": "If the clock is proven to be tampered with, Dr. Finch's alibi collapses.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_8",
      "clue_mechanism_visibility_core",
      "clue_6"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time discrepancy and witness accounts (early) expose the tampering. Step 2: Footprints lead to Dr. Finch (mid) confirming his presence. Step 3: The trap reveals the clock as the critical false alibi, identifying Finch as the culprit."
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
        "clearance_method": "Her alibi is confirmed by other guests.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His whereabouts were accounted for by multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
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
        "clue_id": "clue_6",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Testimony"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Physical evidence"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
    "summary": "Eleanor Voss is an outspoken journalist whose relentless pursuit of truth often leads her into murky waters, especially when her own family secrets are at stake.",
    "publicPersona": "Eleanor is known for her sharp wit and insightful articles on social issues, often challenging the status quo and advocating for the underprivileged.",
    "privateSecret": "Behind her confident facade, Eleanor hides the scars of a failed marriage and significant financial struggles, which drive her to expose class disparities.",
    "motiveSeed": "Eleanor seeks to uncover the truth behind the Voss family's wealth and their ties to a corrupt business deal.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor was present at the manor for a social gathering, having arrived at 6 PM and discovering the body at 8 PM.",
    "accessPlausibility": "easy",
    "stakes": "Her career hinges on exposing corruption; failure could lead to her being blacklisted from the journalism community.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a brisk, assertive rhythm, often punctuating her points with sardonic comments. She has a tendency to use rhetorical questions that challenge her audience's assumptions.",
    "internalConflict": "Eleanor grapples with the fear that exposing her family's dark past may lead to personal ruin, as she clings to the hope of redemption both for herself and the society she critiques.",
    "personalStakeInCase": "This crime matters to Eleanor because it intertwines with her family's legacy and the potential to reclaim her own sense of agency in the world.",
    "paragraphs": [
      "Eleanor Voss strode into the grand manor, her keen eyes scanning the opulent surroundings with a mix of admiration and disdain. She was a journalist of some repute, known for her biting critiques of class disparities and her penchant for unearthing uncomfortable truths. As she mingled with the guests, she couldn’t shake the feeling that the evening's festivities were merely a veneer over a festering rot. Her instincts were honed from years of reporting on the very issues that plagued society, and tonight, they whispered of hidden secrets lurking just beneath the surface.",
      "At the heart of Eleanor's curiosity lay the Voss family's wealth, a fortune she had long suspected was built on dubious dealings. The very reason she had accepted the invitation to this gathering was to probe deeper into those dealings, to shine a light on the corruption that had surely seeped into the family’s affairs. Yet, beneath her professional ambitions lay a personal struggle; a failed marriage had left her financial stability in tatters, and the thought of being blacklisted from journalism haunted her. The stakes were high, and failure was not an option.",
      "As the clock struck eight, Eleanor found herself outside the library, the scene of a chilling revelation. The lifeless body of the family patriarch lay sprawled on the floor, a grotesque testament to the darker side of wealth. The shock sent ripples through the gathering, but for Eleanor, it ignited a fierce determination. She had to uncover the truth—not just for her career, but to confront the shadows of her own past. What would it mean to expose the Voss family's secrets? Could her quest for truth lead to her own undoing?",
      "Eleanor's dry wit often served as her armor, allowing her to navigate the treacherous waters of high society with a steady hand. But as she delved deeper into the investigation, the lines between her professional life and personal stakes began to blur. Each revelation threatened to unravel the carefully woven fabric of her identity. As she confronted the ghosts of her past, Eleanor realized that the truth she sought might not only expose the Voss family but also herself."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a compassionate physician whose dedication to his patients is overshadowed by a hidden gambling addiction that threatens his career.",
    "publicPersona": "Mallory is well-regarded in the community, known for his kindness and commitment to healing, often seen as a pillar of the local medical establishment.",
    "privateSecret": "Beneath his professional demeanor lies a struggle with a gambling addiction that has put his practice and reputation at risk.",
    "motiveSeed": "Mallory would benefit from inheriting a substantial amount of money from the victim to settle his growing debts.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claimed to be in the library from 7 PM until the body was found at 8 PM.",
    "accessPlausibility": "possible",
    "stakes": "His career and reputation are on the line due to financial instability, with the threat of losing his practice looming over him.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Mallory speaks with a calm, measured tone, often punctuating his sentences with soft chuckles at his own misfortunes. He has a tendency to downplay his achievements, making light of his situation with a wry smile.",
    "internalConflict": "Mallory is caught in a moral quandary, torn between his professional ethics and the desperation of his financial situation, fearing that one misstep could cost him everything.",
    "personalStakeInCase": "This crime matters deeply to Mallory, as the financial implications could either save or ruin his practice, dictating the course of his future.",
    "paragraphs": [
      "Dr. Mallory Finch was a man of contradictions, a physician whose reputation for compassion and dedication stood in stark contrast to the turmoil brewing beneath the surface. He spent his days tending to the sick and injured, yet each evening, he fought a different battle—one against the lure of gambling that had begun to consume him. As he stood in the library, surrounded by the hollow echoes of laughter and conversation, he felt the weight of his secret pressing down on him like a leaden shroud.",
      "When the clock struck eight and the body was discovered, Mallory's heart raced—not from shock, but from the realization that this could be the turning point he so desperately needed. The potential inheritance from the victim, a substantial sum, could free him from the shackles of debt that had begun to strangle his practice. Yet, as the thought flickered in his mind, so did the guilt that gnawed at his conscience. Was he willing to risk everything for a chance at salvation?",
      "He had claimed to be in the library during the murder, a convenient alibi that he hoped would shield him from suspicion. But as he spoke with the other guests, each of whom seemed to harbor their own secrets, he wondered if he was truly as safe as he believed. His calm demeanor belied the storm of anxiety swirling within; he was a man on the precipice, teetering between the desire for redemption and the fear of his own failings.",
      "Mallory's self-deprecating humor often provided a balm for his troubled soul, a way to mask the shame that accompanied his addiction. He would chuckle softly at his own misfortune, making light of his situation even as it spiraled out of control. But as the investigation unfolded, he realized that the stakes had never been higher. The truth behind the murder could either lead him to liberation or plunge him deeper into despair, and with it, the chance to reclaim his integrity hung in the balance."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer whose distinguished past and social ambitions conceal a desperate desire to reclaim his family's lost fortune.",
    "publicPersona": "Ivor is a former captain celebrated for his service, now striving to maintain his status among the elite of Little Middleton.",
    "privateSecret": "Ivor harbors a deep-seated desire to restore his family's wealth and status, viewing the victim's death as a potential opportunity.",
    "motiveSeed": "Ivor wants to ensure that the victim's death secures him a larger inheritance from the family estate.",
    "motiveStrength": "compelling",
    "alibiWindow": "He claims to have been out for a walk along the estate grounds during the time of the murder.",
    "accessPlausibility": "unlikely",
    "stakes": "His social standing depends on reclaiming lost wealth; failure means falling further down the social ladder and losing his identity.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks in a commanding voice, laced with a hint of sarcasm. He employs grand gestures and formal language, often punctuating his statements with a knowing smile that hints at his deeper ambitions.",
    "internalConflict": "Ivor is torn between his ambition to reclaim his family's legacy and the ethical implications of his actions, fearing that his desperation might lead him to unspeakable lengths.",
    "personalStakeInCase": "The crime matters deeply to Ivor, as it represents a pivotal moment in his quest to regain his family's former glory and secure his place in high society.",
    "paragraphs": [
      "Captain Ivor Hale stood at the edge of the estate grounds, his gaze sweeping over the sprawling landscape that had once been a symbol of his family's prestige. A retired naval officer, Ivor had earned respect through his service, yet in the social circles of Little Middleton, that respect was fleeting. He was acutely aware that the world he once commanded had changed, and his family's lost fortune now hung like a specter over his life. The death of the victim, a member of the very family whose wealth he coveted, presented a tantalizing opportunity to reclaim what was rightfully his.",
      "As he strolled along the manicured paths, Ivor's thoughts turned dark. He had claimed to be out for a walk during the murder, but the truth was more complicated. The stakes were high; if the victim's death meant a larger inheritance, then the captain's ambitions could finally be realized. Yet, with each step, he felt the weight of his conscience pressing down on him. Would he truly stoop to exploiting such a tragedy for his gain? The question haunted him, but the lure of power and prestige was a potent drug.",
      "Ivor's polite savagery often masked his true intentions, allowing him to navigate the elite social landscape with ease. He wielded his charm like a weapon, employing grandiose language and a knowing smile that hinted at ambitions far beyond mere social standing. But as the evening progressed and the body was discovered, he found himself grappling with an unsettling truth: the lengths he would go to secure his place in society might lead him to moral ruin. The very traits that had once defined him were now at odds with his desperate desire for wealth.",
      "Each conversation with the other guests felt like a game of chess, where Ivor was determined to outmaneuver his opponents. The stakes were not just about money; they were about identity, legacy, and the fear of being cast aside by a society that valued wealth above all. As the investigation unfolded, Ivor realized that his ambition could either lead him to the pinnacle of success or plunge him into the depths of despair. The question remained: how far was he willing to go to reclaim what he believed was his?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a passionate art student whose idealism clashes with the harsh realities of a world dominated by wealth and privilege.",
    "publicPersona": "Beatrice is known for her free-spirited nature and progressive ideas, often challenging societal norms through her art.",
    "privateSecret": "Beneath her vibrant exterior lies resentment towards the wealthy elite, stemming from her own struggles as a working-class artist.",
    "motiveSeed": "Beatrice feels that the victim's family embodies everything wrong with society and may have acted out of anger.",
    "motiveStrength": "weak",
    "alibiWindow": "She stated that she was in her room sketching from 7 PM until being called to the scene at 8 PM.",
    "accessPlausibility": "possible",
    "stakes": "She hopes to gain recognition through her art but feels stifled by the very elite she despises.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a lively, animated cadence, often punctuating her thoughts with sharp, sardonic observations. Her language is rich with imagery, reflecting her artistic background.",
    "internalConflict": "Beatrice wrestles with feelings of inadequacy and the impulse to reject societal norms, struggling to find her place in a world that seems rigged against her.",
    "personalStakeInCase": "The crime resonates with Beatrice because it represents a broader critique of the societal structures that stifle her artistic ambitions.",
    "paragraphs": [
      "Beatrice Quill stood in her room, paintbrush in hand, surrounded by a chaos of canvases and sketches that reflected her inner turmoil. An art student with a passion for challenging the status quo, she poured her heart into her work, yet felt the weight of the world pressing down on her. The elite of Little Middleton, with their wealth and privilege, seemed to epitomize everything she despised. They lived in a bubble, oblivious to the struggles of artists like herself, and the victim’s family was no exception. The very thought of their opulence ignited a fire of resentment within her.",
      "When the news of the murder broke, Beatrice's initial shock quickly morphed into a whirlwind of conflicting emotions. She had claimed to be sketching in her room at the time of the incident, a plausible alibi that allowed her to evade suspicion. But as the investigation unfolded, she found herself grappling with a darker impulse—could she have acted out of anger? The victim represented the very system that stifled her creativity, and the idea that she might have crossed a line sent shivers down her spine.",
      "Her sardonic wit often surfaced in conversations, a defense mechanism to mask her vulnerability. Beatrice spoke with an animated cadence, her words laced with sharp observations that cut to the heart of the matter. Yet, beneath the surface, she struggled with feelings of inadequacy, questioning whether her art would ever gain the recognition it deserved. The very elite she often critiqued were the ones who held the keys to her success, leaving her feeling trapped in a paradox of her own making.",
      "As the investigation progressed, Beatrice realized that her stake in the case was more than just artistic aspiration; it was about challenging the very structures that governed her life. The murder became a catalyst for her to confront her own feelings of anger and inadequacy. In the end, she would have to decide whether to continue rejecting the norms of society or to find a way to carve out her own identity within them. The clock was ticking, and the truth behind the murder might just lead her to a revelation about herself."
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
    "summary": "Little Middleton Manor stands as a grand, yet foreboding estate, isolated amidst sprawling grounds and encroaching woodlands, a remnant of a bygone era.",
    "visualDescription": "The manor's weathered stone facade looms against the overcast sky, its ivy-clad walls and leaded windows casting an air of melancholy. A sweeping gravel driveway leads to the imposing front entrance where a pair of heavy oak doors, adorned with tarnished brass fittings, beckon to the curious.",
    "atmosphere": "A palpable tension hangs in the air, amplified by the recent social unrest that stirs unease among the manor’s inhabitants.",
    "paragraphs": [
      "Little Middleton Manor, a relic of Victorian splendor, sits quietly amidst its expansive grounds, surrounded by dense woodlands that seem to whisper secrets of the past. The estate's grandeur is marred by the shadows of social upheaval, casting an ominous pall over the meticulously maintained gardens, where roses bloom defiantly against the encroaching gloom. The distant sound of a clock tower strikes, echoing the slow passage of time, while the air is thick with the scent of damp earth and decaying leaves.",
      "Inside, the manor's corridors are lined with portraits of stern ancestors, their gazes seemingly following the living as they traverse the hallways. The heavy drapes, drawn against the chill, filter the muted light, creating an atmosphere that feels both claustrophobic and suffocating. The faint sound of rain tapping against the windowpanes adds to the overall sense of isolation, as the world outside grows increasingly distant. Every creak of the floorboards underfoot echoes like a warning, urging caution in the face of hidden truths.",
      "As night falls, the manor transforms; flickering candlelight casts dancing shadows, bringing life to the otherwise still air. Yet, the warmth of the flames does little to dispel the chill of uncertainty that permeates the estate. Whispers of discontent from the townsfolk beyond the estate's walls seep into the manor, creating a tension that lingers like a fog, hinting at secrets that threaten to unravel the very fabric of the household. The clock ticks steadily in the background, its relentless march a reminder that time is running out for those within these walls."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical for the season",
    "timeFlow": "Three days of mounting tension leading to the discovery of a crucial clue",
    "mood": "Tense and foreboding due to recent social unrest",
    "eraMarkers": [
      "Petrol-driven automobiles parked in the gravel driveway",
      "A domestic telephone resting on an oak side table in the drawing room",
      "The rhythmic clatter of a typewriter echoing from the study"
    ],
    "sensoryPalette": {
      "dominant": "The damp, earthy aroma of the surrounding gardens and woods",
      "secondary": [
        "The faint scent of burning coal from the manor's hearth",
        "The metallic tang of rain lingering in the air"
      ]
    },
    "paragraphs": [
      "The atmosphere surrounding Little Middleton Manor is steeped in an unsettling quiet, broken only by the distant rumble of thunder and the soft patter of rain against the window panes. The heavy clouds loom low, casting a pall over the estate that seems to seep into the very walls, creating a weighty stillness that hangs in the air. Each gust of wind rustles the leaves, a reminder of the outside world's turmoil, while the manor itself stands resolute, a fortress against the encroaching chaos.",
      "Inside, the oppressive silence is punctuated by the ticking of clocks, each sound a reminder of the passage of time and the secrets that lie hidden within the manor's depths. The aroma of damp wood mingles with the faint scent of wax from the candlesticks, creating a rich, layered atmosphere that invites both curiosity and caution. The flickering shadows cast by the candlelight dance across the walls, hinting at mysteries yet to be uncovered, while the ever-present sound of rain creates an intimate cocoon, isolating the inhabitants from the world beyond."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library is a grand room adorned with dark mahogany bookshelves, filled with leather-bound tomes that stretch up to the ceiling. A large, ornate fireplace dominates one wall, its mantle cluttered with dusty antiques and a solitary, flickering candle.",
      "sensoryDetails": {
        "sights": [
          "Rich, dark wood paneling envelops the room, while the dim light casts a warm glow on the spines of countless books, their titles obscured by layers of dust.",
          "An antique globe stands in the corner, its surface faded and cracked, a testament to the passage of time and forgotten journeys."
        ],
        "sounds": [
          "The soft rustle of pages turning breaks the silence, punctuated by the occasional crackle from the fireplace as embers shift in their bed.",
          "The distant sound of rain tapping against the window creates a rhythmic backdrop, adding to the library's quiet, contemplative atmosphere."
        ],
        "smells": [
          "The air is thick with the scent of aged paper, mingling with the rich aroma of polished wood and the faint hint of tobacco smoke lingering from past visitors.",
          "A subtle whiff of dampness from the rain outside adds an earthy quality, grounding the space in the present moment."
        ],
        "tactile": [
          "The leather-bound books feel cool and smooth to the touch, their spines well-worn from years of use, inviting exploration.",
          "The heavy, textured fabric of the armchairs offers a comforting embrace, providing a stark contrast to the cold marble floor beneath."
        ]
      },
      "accessControl": "Access is restricted to family members and select guests during the day; the library remains locked at night, accessible only by the head of the household.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-speckled glass blurs the view of the gardens outside, while droplets cling to the window ledge, reflecting the muted light.",
            "The shadows cast by the fireplace flicker erratically, creating an eerie dance against the walls."
          ],
          "sounds": [
            "The steady drumming of rain on the roof creates a soothing, yet melancholic melody that fills the room.",
            "Occasional thunder rumbles in the distance, adding a sense of urgency to the atmosphere."
          ],
          "smells": [
            "The scent of wet earth permeates the air, mixing with the musty aroma of old books, creating a rich tapestry of olfactory sensations.",
            "A hint of ozone from the storm outside adds a sharpness to the otherwise earthy smells."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The library is bathed in a muted, grey light, with shadows deepening in the corners, creating a sense of foreboding.",
            "A single beam of light breaks through the clouds, illuminating the dust motes dancing in the air."
          ],
          "sounds": [
            "The silence is punctuated by the occasional creak of the house settling, a reminder of its age and the secrets it holds.",
            "The soft rustle of pages turning echoes in the stillness, as if the books themselves are whispering their stories."
          ],
          "smells": [
            "The rich aroma of polished wood fills the space, mingling with the scent of damp paper, creating a comforting yet melancholic atmosphere.",
            "A faint whiff of coal smoke from the fireplace adds warmth to the otherwise cool air."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers softly in the dim room, casting a warm glow that contrasts sharply with the deepening darkness outside.",
            "The shadows stretch across the floor, creating a sense of depth and mystery that invites exploration."
          ],
          "sounds": [
            "The gentle tick of a mantel clock provides a rhythmic backdrop, marking the passage of time in the quiet library.",
            "The distant sound of laughter from the drawing room below hints at a gathering, yet feels disconnected from the solitude of the library."
          ],
          "smells": [
            "The sweet scent of melting candle wax fills the air, mingling with the earthy aroma of the books and wood.",
            "A hint of tobacco smoke from a recently extinguished cigar lingers, adding a touch of nostalgia to the atmosphere."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library serves as the heart of Little Middleton Manor, a place where secrets are stored as carefully as the books that line its shelves. The dim lighting creates a cozy, yet oppressive atmosphere, perfect for contemplation or conspiracy. Here, amidst the worn leather chairs and the comforting presence of countless volumes, a crime has unfolded, leaving behind an air of mystery that permeates the very fabric of the room.",
        "In this sanctuary of knowledge, every shadow seems to hold a whisper, every creak of the floorboards a reminder of the past. The flickering candlelight casts a delicate glow on the spines of the books, as if illuminating the hidden truths within. Yet, beneath the surface of tranquility, an undercurrent of tension runs deep, suggesting that not all who enter leave unscathed."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is an opulent space, featuring high ceilings adorned with intricate plasterwork and large windows draped with heavy velvet curtains. A grand piano sits in the corner, its polished surface reflecting the soft glow of the chandelier above.",
      "sensoryDetails": {
        "sights": [
          "Richly patterned wallpaper in muted hues envelops the walls, while plush, overstuffed sofas invite guests to relax and converse.",
          "A large, ornate rug covers the wooden floor, its vibrant colors muted by the dim light, providing a sense of warmth and comfort."
        ],
        "sounds": [
          "The soft murmur of conversation fills the air, punctuated by the occasional clink of glassware from a nearby side table, hinting at the presence of refreshments.",
          "The gentle playing of the piano creates a melodic backdrop, weaving through the conversations like a delicate thread."
        ],
        "smells": [
          "The sweet scent of fresh flowers from a crystal vase on the mantelpiece mingles with the rich aroma of aged spirits, creating a heady combination.",
          "A faint hint of tobacco smoke lingers in the air, a reminder of the evening's earlier discussions."
        ],
        "tactile": [
          "The plush fabric of the sofas feels inviting and warm against the skin, offering a comforting embrace to those who take a seat.",
          "The coolness of the marble fireplace contrasts sharply with the warmth of the room, creating a dynamic interplay of temperature."
        ]
      },
      "accessControl": "Access is generally allowed to all household members and guests during social gatherings; however, the area is off-limits to staff during these times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rainwater streams down the large windows, distorting the view of the gardens outside, while the light inside remains dim and muted.",
            "The heavy curtains are drawn back slightly, allowing a glimpse of the grey sky, which adds to the room's somber atmosphere."
          ],
          "sounds": [
            "The steady rhythm of rain tapping against the glass creates a soothing yet melancholic soundtrack, echoing the mood of the morning.",
            "Occasional thunder rumbles in the distance, causing the chandeliers to sway slightly, creating a momentary flicker of light."
          ],
          "smells": [
            "The scent of damp wood and earth permeates the air, mixing with the faint aroma of fresh flowers that struggle to brighten the space.",
            "A hint of coal smoke from the fireplace adds a layer of warmth, contrasting with the coolness of the rain outside."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is bathed in a soft, grey light, with shadows deepening in the corners and the air feeling heavy with unspoken words.",
            "Flickering candlelight dances across the ornate ceiling, casting delicate patterns that shift with each movement."
          ],
          "sounds": [
            "The low murmur of conversation fills the space, punctuated by the occasional laughter that feels forced in the heavy atmosphere.",
            "The piano plays softly in the background, its notes a gentle reminder of the unease that permeates the gathering."
          ],
          "smells": [
            "The rich scent of polished wood mingles with the aroma of fresh coffee brewed in the corner, creating a comforting yet tense atmosphere.",
            "A faint hint of tobacco smoke lingers, a reminder of the earlier discussions that have left a mark on the room."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The room comes alive with candlelight, casting a warm glow that dances across the faces of guests, creating an intimate atmosphere.",
            "The flickering flame reflects off the crystal glasses, adding a sparkle that contrasts with the deepening shadows."
          ],
          "sounds": [
            "The gentle clinking of glasses accompanies the soft laughter of guests, creating a lively yet tense ambiance.",
            "The piano plays a lively tune, its notes weaving through the conversations, lifting spirits despite the underlying tension."
          ],
          "smells": [
            "The sweet scent of fresh flowers mingles with the rich aroma of fine whiskey, creating a heady atmosphere that invites indulgence.",
            "A hint of tobacco smoke lingers, adding a touch of nostalgia to the otherwise vibrant room."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room serves as the social hub of the manor, where guests gather to share stories and secrets, often unaware of the tensions simmering just beneath the surface. The opulent décor speaks of wealth and privilege, yet the atmosphere is thick with unspoken words, each conversation a delicate dance around the ever-present specter of social unrest. With the grand piano in the corner, the room becomes a stage for both entertainment and intrigue, where alliances are formed and broken in the blink of an eye.",
        "As the evening progresses, the drawing room transforms into a theater of emotions, the flickering candlelight casting shadows that seem to dance with the guests. Laughter and music fill the air, yet an undercurrent of tension remains palpable, as if the very walls are holding their breath, waiting for the next revelation to unfold. It is here, amidst the laughter and the clinking of glasses, that the true nature of the relationships within the manor is revealed, each interaction tinged with the potential for betrayal."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Private investigation space",
      "visualDetails": "The study is a small, intimate room filled with dark wood furniture and an imposing desk cluttered with papers and a typewriter. Walls lined with bookshelves hold volumes on various subjects, and a large window offers a view of the estate's gardens, now shrouded in mist.",
      "sensoryDetails": {
        "sights": [
          "Dimly lit by a single lamp, the study feels both inviting and secretive, with shadows playing across the walls as if hiding the room's secrets.",
          "A large globe stands in one corner, its surface worn from years of use, offering a glimpse into adventures long past."
        ],
        "sounds": [
          "The soft clicking of the typewriter keys fills the air, accompanied by the occasional rustle of paper as notes are hastily jotted down.",
          "Outside, the sound of rain tapping against the window creates a rhythmic backdrop, blending with the quiet hum of thought."
        ],
        "smells": [
          "The sharp scent of ink mingles with the musty aroma of old books, creating an atmosphere steeped in knowledge and discovery.",
          "A faint hint of tobacco smoke lingers, a reminder of late-night investigations and the secrets that have been uncovered."
        ],
        "tactile": [
          "The smooth surface of the desk feels cool to the touch, its polished wood a contrast to the rough texture of the papers strewn across it.",
          "The plush fabric of the armchair invites one to sink into its embrace, offering comfort amidst the chaos of investigation."
        ]
      },
      "accessControl": "Access is restricted to the head of the household and select trusted individuals; the door remains locked when not in use.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "The room is cloaked in a soft, grey light as rain streaks down the window, blurring the view of the gardens outside.",
            "Papers on the desk are slightly damp from the humidity, their edges curling as if echoing the weather's dreariness."
          ],
          "sounds": [
            "The steady patter of rain against the glass creates a soothing, yet melancholic rhythm that fills the space.",
            "Occasional thunder rumbles in the distance, adding an ominous undertone to the otherwise quiet atmosphere."
          ],
          "smells": [
            "The scent of wet earth wafts in through the slightly open window, mingling with the musty aroma of the books lining the shelves.",
            "A hint of coal smoke from the fireplace adds warmth and depth to the otherwise cool air."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The study is bathed in a muted, grey light, with shadows deepening in the corners and the air feeling heavy with unspoken words.",
            "The typewriter sits silently atop the desk, a testament to the investigations that have yet to be completed."
          ],
          "sounds": [
            "The soft rustle of paper turning fills the air, punctuated by the occasional creak of the floorboards beneath.",
            "The ticking of a clock in the corner serves as a constant reminder of the passing time and the urgency of the task at hand."
          ],
          "smells": [
            "The rich aroma of polished wood mingles with the scent of aged paper, creating an atmosphere steeped in history and intrigue.",
            "A faint hint of tobacco smoke lingers, a reminder of the late nights spent unraveling the mysteries that lie within the manor."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of a desk lamp illuminates the study, casting a cozy light across the room that contrasts with the darkening outside.",
            "A single candle flickers on the desk, its flame casting dancing shadows that seem to animate the space."
          ],
          "sounds": [
            "The gentle scratching of a pen on paper fills the air, accompanied by the low hum of thought as ideas are formulated.",
            "The distant sound of laughter from the drawing room below serves as a reminder of the world outside this private sanctuary."
          ],
          "smells": [
            "The sharp scent of fresh ink fills the air, mingling with the earthy aroma of wood and leather that clings to the furniture.",
            "A hint of tobacco smoke wafts in from the drawing room, adding a layer of warmth to the otherwise cool atmosphere."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The study is a sanctuary for contemplation and investigation, filled with the tools of thought and discovery. Here, amidst the stacks of books and the clutter of papers, secrets unfold under the watchful gaze of the globe, which has seen countless journeys and adventures. This intimate space allows for whispered conversations and quiet revelations, where every detail matters, and every clue could lead to a breakthrough in the unfolding mystery.",
        "As night descends, the study transforms into a haven of introspection and determination. The flickering candlelight casts a warm glow, illuminating the desk's clutter while shadows dance around the room. Here, the weight of the world outside seems to fade, replaced by the urgency of the investigation at hand, where every tick of the clock brings them closer to uncovering the truth hidden within the manor's walls."
      ]
    }
  ],
  "note": "",
  "cost": 0.00273122355,
  "durationMs": 36522
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1930,
    "month": "June",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "cool breezes"
    ],
    "daylight": "Days are long, with twilight stretching into the late evening, creating an eerie atmosphere as shadows deepen.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, after dinner has concluded.",
    "holidays": [
      "Father's Day (June 15)"
    ],
    "seasonalActivities": [
      "garden parties",
      "afternoon teas",
      "short walks in the countryside"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored three-piece suits",
        "fedoras",
        "polished leather shoes"
      ],
      "casual": [
        "lightweight linen trousers",
        "button-up shirts with rolled sleeves",
        "cotton vests"
      ],
      "accessories": [
        "pocket watches",
        "silk ties",
        "cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dresses with floral patterns",
        "cloche hats",
        "beaded handbags"
      ],
      "casual": [
        "light cotton blouses",
        "swing skirts",
        "sandals or low-heeled shoes"
      ],
      "accessories": [
        "string pearls",
        "wide-brimmed hats",
        "stylish gloves"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "the rise of sportswear",
      "bold printed fabrics"
    ],
    "socialExpectations": [
      "proper etiquette at social gatherings",
      "conformity to gender roles",
      "expectation for women to maintain household duties"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "widespread labor strikes in the UK",
      "increased tensions in Europe with the rise of fascism",
      "the impact of the Great Depression on American and British economies"
    ],
    "politicalClimate": "A landscape fraught with unrest; the working class is increasingly vocal about their grievances, leading to protests and strikes.",
    "economicConditions": "The Great Depression has resulted in high unemployment rates, creating a stark divide between the wealthy and the impoverished.",
    "socialIssues": [
      "rising unemployment",
      "class disparities",
      "women's suffrage and rights"
    ],
    "internationalNews": [
      "growing fascism in Germany and Italy",
      "the aftermath of the Wall Street crash continues to affect global markets"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Ain't She Sweet' by Milton Ager",
        "'Happy Days Are Here Again' by Milton Ager",
        "'Puttin' on the Ritz' by Irving Berlin"
      ],
      "films": [
        "'The Jazz Singer' (1927)",
        "'All Quiet on the Western Front' (1930)",
        "'The Love Parade' (1929)"
      ],
      "theater": [
        "'The Front Page' (1928)",
        "'The Royal Family' (1927)",
        "'Of Mice and Men' (1937)"
      ],
      "radio": [
        "'Amos 'n' Andy'",
        "'The Shadow'",
        "'The Lone Ranger'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Cathedral' by T.S. Eliot",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Great Gatsby' by F. Scott Fitzgerald"
      ],
      "popularGenres": [
        "mystery",
        "social commentary",
        "speculative fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the radio",
        "the electric refrigerator",
        "the typewriter"
      ],
      "commonDevices": [
        "domestic telephones",
        "petrol-driven cars",
        "motion picture cameras"
      ],
      "emergingTrends": [
        "increased use of film in entertainment",
        "the beginning of sound in movies",
        "the popularity of household appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: four pence",
        "a dozen eggs: one shilling",
        "newspaper: three halfpence"
      ],
      "commonActivities": [
        "visiting local parks",
        "attending community events",
        "participating in summer fairs"
      ],
      "socialRituals": [
        "afternoon tea gatherings",
        "weekly church services",
        "evening family dinners"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing resentment towards the wealthy",
      "greater awareness of social inequalities"
    ],
    "gender": [
      "women are striving for more independence",
      "traditional roles are still prevalent but challenged"
    ],
    "race": [
      "racial tensions exist but are often suppressed in polite society",
      "the civil rights movement is in its infancy"
    ],
    "generalNorms": [
      "emphasis on propriety and decorum",
      "adherence to class-based social structures",
      "expectation for public behavior to reflect one's social standing"
    ]
  },
  "atmosphericDetails": [
    "The scent of rain-soaked earth mingles with the faint aroma of blooming roses from the estate's gardens.",
    "The sound of distant thunder rumbles ominously, adding to the palpable tension in the air as the evening approaches.",
    "The flickering light of oil lamps casts long shadows in the dimly lit rooms, creating an unsettling ambiance as secrets linger in the corners."
  ],
  "paragraphs": [
    "In June 1930, the air hangs heavy with the promise of summer, yet the overcast skies and intermittent rain cast a pall over the country estate. As the last remnants of daylight fade, the dampness settles into the shadows, mirroring the growing unease among the residents. The evening is punctuated by distant rumbles of thunder, foreshadowing the tumult of both weather and society as unrest brews just beyond the manicured hedges.",
    "Fashion reflects the duality of the times; men don tailored three-piece suits made of lightweight fabrics, their fedoras tilted just so as they navigate the estate’s corridors. Women, meanwhile, flit about in elegant tea dresses adorned with bright floral patterns, their cloche hats framing worried expressions. The air is alive with the rustle of silk and cotton, yet beneath these stylish exteriors lies a community grappling with the harsh realities of the Great Depression, where class divisions sharpen daily interactions.",
    "Life in June 1930 is a tapestry of social rituals woven with threads of anxiety and grace. Afternoon teas remain a staple, yet conversations bustle with murmurs of labor strikes and rising fascism, creating an undercurrent of tension. Typical prices for everyday items reveal the economic strain; a loaf of bread costs four pence, a reminder of the struggle to maintain a semblance of normalcy. As families gather for evening dinners, the clatter of cutlery and the gentle sound of rain on windows provide a stark contrast to the storm brewing within society."
  ],
  "note": "",
  "cost": 0.00101764245,
  "durationMs": 13021
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the isolated manor for a family meeting amid economic despair intensifies tensions among the socially diverse guests, each grappling with their precarious status in a changing world.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class divisions, creating a volatile atmosphere where wealth and status are increasingly scrutinized, and social unrest looms."
  },
  "setting": {
    "location": "A large, isolated manor house set within expansive grounds, featuring gardens and a small wood.",
    "institution": "Country house estate",
    "weather": "Overcast with intermittent rain, typical for the season"
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
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock showed ten minutes past eleven when first checked.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This establishes a timeline for the events leading to the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "Witnesses recall hearing the clock chime at the hour.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This contradicts the clock's current state, suggesting tampering.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "This indicates that something is wrong with the clock's timing.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This raises doubts about the reliability of the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "If the clock chimed correctly, it should not have been tampered with.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This further supports the idea of tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "physical",
      "description": "Footprints in the garden appear to match Dr. Finch's shoes.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This links Dr. Finch to the scene.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
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
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was at a different location during the time of the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This confirms Hale's alibi and narrows the focus to other suspects.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_4",
      "category": "behavioral",
      "description": "Dr. Mallory Finch has been under financial desperation due to debts.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "This could provide a motive for murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "The mechanical clock shows signs of recent tampering.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "This indicates that someone may have altered the time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The mechanism relies on clock, minute, and eleven to expose the false timing.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "This clarifies how the clock's timing is central to the investigation.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was seen at a different location at the time of the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This confirms Quill's alibi and narrows the focus to Dr. Mallory Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "The discriminating test compares clock, minute, and eleven against the claimed timeline.",
      "sourceInCML": "CASE.discriminating_test.evidence_clues[0]",
      "pointsTo": "This is crucial for establishing the timeline of events.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock time at ten minutes past eleven remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "Footprints in the garden appear to match Dr. Finch's shoes.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This suggests Dr. Finch was near the study around the time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The victim was last seen at a dinner party, which aligns with the timeline of death.",
      "supportsAssumption": "The time of death aligns with the victim's last known movements.",
      "misdirection": "This may lead one to believe the victim's movements are directly related to the time of death, but it does not account for evidence of tampering."
    },
    {
      "id": "rh_2",
      "description": "Witnesses claim they saw Captain Ivor Hale leave the study shortly before the murder.",
      "supportsAssumption": "The time of death aligns with the victim's last known movements.",
      "misdirection": "This could mislead the investigation by focusing on Hale, despite his confirmed alibi."
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
      "clue_6"
    ],
    "mid": [
      "clue_2",
      "clue_3",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_core_elimination_chain",
      "clue_4",
      "clue_5",
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
  "latencyMs": 11441,
  "cost": 0.00299009865
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
