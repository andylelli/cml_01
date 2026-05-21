# Actual Prompt Record

- Run ID: `mystery-1779304062884`
- Project ID: ``
- Timestamp: `2026-05-20T19:11:15.590Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `6745dee4b99f878a`

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
    "title": "The Clockwork Deception",
    "author": "Anonymous",
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
      "subtype": "mechanical manipulation"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Astute and observant detective",
      "private_secret": "keeps a secret",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Seeking justice for the victim",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "keeps a secret",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "None, as the victim",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "Charming and strong-willed officer",
      "private_secret": "Has a gambling debt",
      "motive_seed": "Financial desperation",
      "motive_strength": "high",
      "alibi_window": "narrow",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "The library during the storm"
      ],
      "behavioral_tells": [
        "Fidgeting with his watch"
      ],
      "stakes": "Saving reputation and finances",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "Ambitious governess",
      "private_secret": "In love with Dr. Finch",
      "motive_seed": "Jealousy and unrequited love",
      "motive_strength": "moderate",
      "alibi_window": "wide",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the study"
      ],
      "behavioral_tells": [
        "Avoiding eye contact"
      ],
      "stakes": "Her future with Dr. Finch",
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
      "summary": "During a stormy night at the estate, Dr. Mallory Finch is found dead, with suspicions rising around the guests. Eleanor Voss must unravel a web of deceit involving a tampered clock that misled everyone about the victim's time of death."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanical clock in the study was wound back to create a false timeline for the murder.",
      "delivery_path": [
        {
          "step": "Resetting the clock to mislead witnesses about the time of death."
        }
      ]
    },
    "outcome": {
      "result": "Dr. Mallory Finch is found dead at a time that does not match the true timeline."
    }
  },
  "false_assumption": {
    "statement": "Dr. Mallory Finch's murder occurred shortly after the guests were last seen together.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock showed a consistent time when the guests last interacted.",
    "what_it_hides": "The clock was deliberately set back, creating a false timeline."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The clock in the study shows eleven ten",
        "Witnesses recall seeing Finch at eleven o'clock"
      ],
      "windows": [
        "Death reported at eleven fifteen"
      ],
      "contradictions": [
        "The clock was manipulated to show a false time"
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "The clock in the study",
        "The victim's room"
      ],
      "permissions": [
        "All guests had access to the study"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be tampered with"
      ],
      "traces": [
        "No fingerprints found on the clock's mechanism"
      ]
    },
    "social": {
      "trust_channels": [
        "General trust among the guests",
        "Perceived authority of Captain Hale"
      ],
      "authority_sources": [
        "Hale's military background giving him credibility"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows ten minutes past eleven when discovered.",
        "correction": "The clock was wound back to mislead everyone about the time.",
        "effect": "Eliminates any suspicion of the guests' alibis during the time of death.",
        "required_evidence": [
          "The clock shows ten minutes past eleven",
          "Witnesses recall seeing Finch at eleven o'clock"
        ],
        "reader_observable": true
      },
      {
        "observation": "An empty bottle of sleeping draught is found in the victim's room.",
        "correction": "The sleeping draught indicates Finch was likely incapacitated before the murder.",
        "effect": "Narrows the opportunity window for the murder to before eleven o'clock.",
        "required_evidence": [
          "The empty bottle of sleeping draught",
          "Finch's medical history of insomnia"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses mention hearing the clock ticking faintly during the evening.",
        "correction": "The ticking sound indicates the clock was operational despite being tampered with.",
        "effect": "Narrows down the suspects who had access to the study to those present during the evening.",
        "required_evidence": [
          "Witnesses recall hearing the clock ticking",
          "Guests' alibi accounts of their whereabouts"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Captain Hale is confronted with the discrepancies in the clock's timing and the witness accounts, forcing him to explain.",
    "knowledge_revealed": "The timing of Hale's alibi contradicts the evidence of the tampered clock.",
    "pass_condition": "Hale cannot satisfactorily explain how he was not present when the clock was manipulated.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_early_1",
      "clue_fp_contradiction_step_3"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock showing ten minutes past eleven and witness accounts (mid) establish a false timeline. Step 2: The empty bottle of sleeping draught (mid) indicates incapacitation before murder. Step 3: Witnesses hearing the clock ticking contradicts Hale's alibi during the tampering."
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
        "clearance_method": "Alibi confirmed by other guests present in the garden.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "As the victim, cannot be guilty.",
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements"
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
        "clue_id": "clue_early_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Discovered in the victim's room"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a charming local socialite with a penchant for hosting community events, masking a darker secret that could shatter her carefully curated reputation.",
    "publicPersona": "Eleanor is the life of every gathering, her laughter ringing out like a bell in the stillness of Little Middleton. She moves gracefully through social circles, always the gracious host, ensuring her guests feel welcomed and valued. Whether it’s a garden party or a charity ball, Eleanor’s charisma draws people in, making her indispensable to the town’s social fabric.",
    "privateSecret": "Beneath her polished exterior, Eleanor has been entangled in a web of blackmail, leveraging a long-buried affair involving a local politician to secure her standing. This secret festers within her, a constant reminder of the moral compromises she has made for the sake of power and influence.",
    "motiveSeed": "Eleanor seeks to expose the politician not solely for revenge but as a means to gain leverage over others in the community, hoping to control the narrative surrounding her own secrets.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claims to have been discussing garden arrangements with guests from six to seven, a plausible cover that keeps her entangled in the social whirl.",
    "accessPlausibility": "easy",
    "stakes": "The stakes are high; her social standing and reputation depend on maintaining control over the secrets she holds, leaving her vulnerable to exposure.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a lilting grace, often punctuating her observations with a knowing smile that hints at her deeper understanding of human nature. Her words flow smoothly, yet there’s an edge of sharpness when she chooses to critique or jest about others.",
    "internalConflict": "Eleanor grapples with her own moral choices, questioning whether the power she holds through blackmail truly justifies the damage it could do to her own soul and to those around her.",
    "personalStakeInCase": "This crime matters deeply to Eleanor, as it not only threatens her secrets but also her carefully constructed image within the community she so desperately wants to uphold.",
    "paragraphs": [
      "Eleanor Voss glided through the garden party, a vision in pastel silk, her laughter mingling with the gentle rustle of leaves. She had a knack for making everyone feel like they were the most important person in the room, her charm enveloping them like a warm embrace. But as she exchanged pleasantries and sipped her punch, a flicker of anxiety tugged at her heart. The politician she had ensnared in her web of secrets was here, mingling among the same guests she entertained. His presence was a reminder of the fine line she walked between power and peril.",
      "The whispers of the past echoed in her mind, stories of the affair that had become her leverage. Eleanor had always believed that knowledge was power, yet now she felt the weight of that power bearing down on her. What had begun as a means to protect her social standing had morphed into a moral quagmire, one she was increasingly reluctant to navigate. Each smile she offered felt like a mask, concealing her inner turmoil as she toyed with the idea of exposing the politician, not just for her own gain, but to assert her dominance in a community that thrived on secrets.",
      "As the sun began to set, casting a golden hue over the garden, Eleanor found herself drawn to a secluded corner, where the shadows danced like her own doubts. She knew she had to confront her choices, to decide whether the blackmail that had once seemed a clever tactic was worth the risk of losing everything she held dear. The stakes were no longer just about her reputation; they were about her integrity and the very fabric of her identity. Could she untangle herself from this web before it ensnared her completely?",
      "Eleanor's gaze flickered back to the crowd, her mind racing with possibilities. The thrill of investigation beckoned her as she considered the other secrets that lay hidden in Little Middleton. If she could expose the truth, perhaps she could reclaim her power without the need for blackmail. Yet, as she turned to rejoin her guests, she felt a chill of uncertainty. The path she chose could lead her to redemption or ruin, and each step forward would test her resolve in ways she had yet to understand."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose reputation is marred by a hidden history of unethical practices, prompting her to protect her image at any cost.",
    "publicPersona": "In the eyes of Little Middleton, Dr. Mallory Finch is a pillar of the community, renowned for her medical expertise and unwavering dedication to her patients. She is often seen at charity events, speaking eloquently about health and wellness, her presence a source of comfort and assurance for many. Her calm demeanor and sharp intellect make her a trusted figure, but beneath the surface lies a turbulent past that threatens to unravel her carefully constructed life.",
    "privateSecret": "Mallory's past is littered with unethical medical practices, choices made in desperation to secure her financial stability. This secret weighs heavily on her conscience, as she fears the day it will come to light, especially now that the victim threatened to expose her.",
    "motiveSeed": "Desperate to protect her reputation, Dr. Finch is willing to go to great lengths to ensure her past remains buried, fearing that any revelation could destroy her career and livelihood.",
    "motiveStrength": "strong",
    "alibiWindow": "She claims to have been in her study reviewing medical records from eight to nine, a plausible alibi that keeps her above suspicion.",
    "accessPlausibility": "possible",
    "stakes": "The stakes are monumental; her career and livelihood hang in the balance if her past is uncovered, leaving her with a sense of urgency that drives her actions.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with precision and a measured cadence, often using technical jargon that reflects her medical background. When pressed, her words can become sharp, revealing a dry wit that hints at her frustrations with the world around her.",
    "internalConflict": "Dr. Finch is torn between her ambition and the ethical lines she has crossed, grappling with the fear that her past misdeeds will come back to haunt her and the moral implications of her choices.",
    "personalStakeInCase": "This crime matters profoundly to Mallory; it is not just about her reputation but also about the very foundation of her identity as a physician and a person of integrity.",
    "paragraphs": [
      "Dr. Mallory Finch sat in her study, surrounded by stacks of medical records that seemed to whisper her secrets. The clock ticked ominously, each second reminding her of the impending doom that loomed over her. She had built her career on the trust of her patients, yet that trust was now threatened by the specter of her past. It was a past she had fought hard to bury, but with the victim's threat hanging in the air, she felt the walls closing in.",
      "In public, Mallory was the epitome of grace and compassion, her soothing voice a balm for the worried and weary. Yet, in the quiet of her study, she wrestled with the ghosts of her unethical choices. How many lives had she compromised for the sake of her own stability? The thought churned in her stomach like a sour medicine, a reminder that the very hands that healed could also destroy. She had always believed in the Hippocratic Oath, yet the shadows of her past loomed larger than the light of her present.",
      "As she prepared for the evening’s charity gala, Mallory's mind raced with possibilities. Could she manipulate the situation to her advantage? Perhaps she could find a way to silence the victim before her past was laid bare. The stakes felt impossibly high; her career was on the line, and the thought of losing everything she had worked for sent a shiver down her spine. She had to act, and quickly.",
      "With each passing moment, Mallory felt the tension mounting. She had always been a protector of others, yet now she found herself in a position where she must protect her own legacy. As she donned her evening gown, she steeled herself for the confrontation ahead. The lines between right and wrong blurred in her mind, but one thing remained clear: she would do whatever it took to ensure her past stayed buried, even if it meant stepping into the shadows of deceit."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired Navy officer who carries the weight of guilt from a past incident, and fears the revelation of his mistakes could tarnish his legacy.",
    "publicPersona": "Captain Ivor Hale is a figure of respect in Little Middleton, known for his stern demeanor and unwavering commitment to duty. His military background lends him an air of authority, and he is often seen as a protector of the community. People admire his service, and he is looked upon as a moral compass, though few know the true burden he carries beneath his composed exterior.",
    "privateSecret": "Haunted by guilt over a past incident during his service that cost lives, Ivor fears that the victim may reveal his past mistakes, potentially shattering his reputation and the respect he has earned.",
    "motiveSeed": "Ivor's desire to protect his honor and legacy drives him to act, fearing that the truth about his past could tarnish the image he has built over the years.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claims to have been in the library reading from seven to eight-thirty, a reasonable alibi that keeps him distanced from suspicion.",
    "accessPlausibility": "unlikely",
    "stakes": "The stakes are personal and profound; his honor and legacy are at risk if the truth about his past emerges, leaving him to grapple with the weight of his conscience.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks with a commanding presence, his words deliberate and thoughtful. Occasionally, he injects self-deprecating humor, often reflecting on his own mistakes from the past with a wry smile, though it rarely masks his underlying tension.",
    "internalConflict": "Captain Hale is torn between his sense of honor and the guilt that gnaws at him, struggling to reconcile his past actions with the man he wishes to be in the eyes of the community.",
    "personalStakeInCase": "This crime resonates deeply with Ivor; it is not merely a matter of reputation, but a test of his character and the legacy he wishes to leave behind.",
    "paragraphs": [
      "Captain Ivor Hale sat in the library, the shadows lengthening as the sun dipped below the horizon. A book lay open in front of him, but his mind was far from the words on the page. The memories of his past haunted him, a relentless tide of guilt crashing against the shores of his conscience. He had served his country with honor, yet one fateful decision still echoed in his mind, a reminder of the lives lost under his command. It was a burden he carried alone, hidden behind a facade of respectability.",
      "To the townsfolk, Ivor was a bastion of strength and integrity, a man who had dedicated his life to service. Yet, beneath that stern exterior lay a man grappling with his demons. The threat of the victim revealing his past sent shivers down his spine; the thought of his mistakes becoming public was a nightmare he could hardly bear. He had worked tirelessly to build a legacy of honor, and now it felt as if that legacy was teetering on the brink of collapse.",
      "As he pondered his next move, Ivor's mind raced with the implications of the victim's threat. Could he silence them? The very thought made him uneasy, but the fear of exposure was a powerful motivator. He envisioned the fallout, the whispers in the community, the loss of respect. His heart raced as he considered the lengths to which he might go to protect his name. Yet, deep down, he knew that true honor could not be secured through deceit.",
      "The clock ticked steadily in the background, a reminder that time was not on his side. Ivor needed to confront his fears, to face the truth of his past while striving to protect those he cared about. He had spent years building a reputation, but now he faced the greatest challenge of his life—reconciling the man he had been with the man he aspired to be. With a determined breath, he resolved to confront the shadows of his past and seek a path toward redemption before it was too late."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a quiet governess who feels like an outsider in the household, concealing a secret relationship that could jeopardize her position.",
    "publicPersona": "Beatrice is often overlooked, a quiet presence in the household whose diligence and care for the children make her a valued but unassuming figure. She navigates her duties with grace, ensuring the children are well cared for and educated, yet her reserved nature often leaves her feeling like an outsider in the vibrant world around her.",
    "privateSecret": "Beneath her calm exterior, Beatrice is involved in a secret relationship with a member of the household, a connection that could unravel her position and future if discovered.",
    "motiveSeed": "The victim’s threat to dismiss her from the estate jeopardizes not only her job but also her chance at love, leaving her desperate to protect both.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claims to have been preparing the children's lessons from six-thirty to eight, a plausible alibi that keeps her occupied during the critical time.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Beatrice are high; her chance at love and a stable life depend on keeping her position secure within the household.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks softly, often pausing to choose her words carefully. Her observations are keen, and she has a tendency to understate the drama around her, which lends an air of quiet wisdom to her dialogue.",
    "internalConflict": "Beatrice struggles with feelings of inadequacy and the fear of not belonging, torn between her love and the potential fallout of her choices.",
    "personalStakeInCase": "This crime matters to Beatrice not only because it threatens her position but also because it jeopardizes her chance at a future filled with love and belonging.",
    "paragraphs": [
      "Beatrice Quill moved quietly through the hallways of the estate, her footsteps barely making a sound on the polished floors. She was a governess, a caretaker of children, yet she felt like a ghost in the grand household. Her days were filled with lessons and laughter, but beneath the surface, a tempest brewed. The secret relationship she harbored was like a fragile flower, beautiful yet precarious, and the threat from the victim loomed over her like a dark cloud.",
      "In the quiet moments, Beatrice often found solace in her thoughts, reflecting on the life she had chosen. She had always been the diligent servant, the one who put others before herself, yet now she felt the weight of her desires pressing against her heart. The victim’s threat to dismiss her from the estate sent a chill through her; it was not merely her job at stake, but the very essence of her happiness. Her connection to the household member was a secret she clung to, a light in her otherwise muted existence.",
      "As she prepared the children’s lessons, Beatrice's mind raced with the implications of the victim’s words. If her position were to be jeopardized, what would become of her love? The thought of losing both her job and the one person who made her feel alive was unbearable. She had to act, to protect her fragile world from collapsing. Yet, how could she navigate the treacherous waters of deceit without drowning in the very secrets she sought to keep?",
      "With each passing day, Beatrice felt the tension mounting. The walls of the estate, once a refuge, now felt like a prison. She longed to assert herself, to step out of the shadows of her quiet existence and claim her place in the world. But fear held her back, a constant reminder of her outsider status. As the evening approached, she resolved to confront her fears, to find a way to safeguard her future while embracing the love that had blossomed in the most unexpected of places."
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
    "summary": "A sprawling country estate steeped in secrets, where every shadow holds a whisper of intrigue.",
    "visualDescription": "The manor boasts intricate half-timbered gables, large leaded windows, and a sprawling façade of weathered stone, surrounded by lush gardens and a central courtyard framed by hedgerows.",
    "atmosphere": "A palpable tension hangs in the air, thick with suspicion and unspoken words.",
    "paragraphs": [
      "Little Middleton Manor stands resolute against the overcast sky, its weathered stone walls cloaked in ivy, whispering of decades past. The sprawling estate, with its multiple wings and expansive gardens, exudes an air of grandeur tainted by a sense of foreboding. The courtyard, a gathering place for the manor's inhabitants, echoes with the distant sound of rain tapping against the cobblestones, each droplet a reminder of the secrets waiting to be uncovered.",
      "Inside, the manor's interiors reveal a contrast of elegance and decay. Gaslight sconces flicker against the dark oak paneling, casting elongated shadows that dance across the worn carpets. The scent of damp wood mingles with the faint aroma of beeswax from polished surfaces, creating an atmosphere both inviting and unnerving. Guests, ensconced in their lavish rooms, exchange furtive glances, the weight of unspoken accusations hanging heavy in the air.",
      "As the day wanes, the manor transforms. The steady rhythm of raindrops becomes a backdrop to the hushed conversations and the occasional crack of laughter, tinged with anxiety. The drawing room, with its grand fireplace and plush armchairs, feels like a stage set for a drama yet to unfold. Each tick of the mantel clock serves as a reminder of time slipping away, as the tension mounts and the truth lurks just beyond the reach of their carefully maintained facades.",
      "In the gardens, the once-vibrant blooms now bow under the weight of rain, their colors muted against the grey sky. The labyrinth of hedgerows and winding paths offers both refuge and concealment, perfect for those wishing to escape the prying eyes of their companions. As night descends, the manor looms larger, a silent sentinel harboring secrets that threaten to unravel, each corner shadowed by the specter of betrayal."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical for the season.",
    "timeFlow": "A day of mounting tension leading into a stormy night.",
    "mood": "Tense, with an undercurrent of suspicion among guests.",
    "eraMarkers": [
      "Petrol touring cars parked in the courtyard",
      "Typewriters clacking in the study",
      "Period furnishings in the drawing room"
    ],
    "sensoryPalette": {
      "dominant": "The scent of damp wood and beeswax",
      "secondary": [
        "The flickering glow of gaslight",
        "The distant sound of rain"
      ]
    },
    "paragraphs": [
      "The atmosphere within Little Middleton Manor is saturated with an air of expectancy, as if the very walls are holding their breath. The sound of rain pattering against the leaded windows adds a rhythmic pulse to the gathering tension, creating a backdrop that feels both intimate and isolating. The scents of earth and decay mingle with the polished wood, crafting a sensory experience as layered as the secrets shared among the guests.",
      "As the day drifts towards twilight, the manor's ambiance shifts subtly. Shadows deepen, and the flickering gaslights cast a warm, golden hue against the cool, damp stone. The laughter of guests echoes through the corridors, but beneath the surface, a current of unease thrums, punctuated by the occasional creak of the old timbers. Each sound becomes amplified, a reminder of the isolation that surrounds the estate, where trust is as fragile as the flickering flames in the hearth."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Dark oak shelves lined with dust-covered tomes; a single lamp casting dim light over a reading table.",
      "sensoryDetails": {
        "sights": [
          "dust motes dancing in the light",
          "leather-bound volumes stacked haphazardly"
        ],
        "sounds": [
          "the rustle of pages turning",
          "the ticking of a wall clock"
        ],
        "smells": [
          "old paper and leather",
          "musty air"
        ],
        "tactile": [
          "smooth leather cover of a book",
          "cool marble surface of the reading table"
        ]
      },
      "accessControl": "Restricted to family and select guests; locked after dinner hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "dim light filtering through clouds"
          ],
          "sounds": [
            "steady drumming on the roof",
            "water dripping from eaves"
          ],
          "smells": [
            "damp wood",
            "the scent of wet pages"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows cast by tall shelves",
            "the glow of a solitary lamp"
          ],
          "sounds": [
            "the creak of floorboards",
            "soft whispers"
          ],
          "smells": [
            "beeswax polish",
            "dust"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight illuminating spines of books",
            "dark corners filled with secrets"
          ],
          "sounds": [
            "the crackle of a fire",
            "the distant sound of laughter"
          ],
          "smells": [
            "smoke from the fireplace",
            "the warmth of old wood"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, once a sanctuary of knowledge, has transformed into a scene of dread. Dust-laden tomes line the shelves, their spines cracked and faded, holding stories of the past that now feel ominous. The single lamp casts a feeble glow upon the reading table, illuminating a space where shadows gather, hiding secrets that have yet to be revealed. The air is thick with the scent of old leather and musty pages, a reminder of the forgotten tales that linger in the corners.",
        "As the rain beats against the windows, the library becomes an echo chamber for the whispers of the guests. The ticking of the wall clock punctuates the silence, each tick a reminder of time slipping away. The atmosphere is heavy with the weight of unspoken words and concealed motives, as the guests navigate the fragile lines between trust and suspicion. Here, in this quiet alcove of the manor, the truth awaits discovery."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Lavishly furnished with velvet drapes, an ornate fireplace, and a grand piano in the corner.",
      "sensoryDetails": {
        "sights": [
          "glimmering chandelier",
          "richly patterned wallpaper"
        ],
        "sounds": [
          "soft laughter",
          "the piano playing a melancholic tune"
        ],
        "smells": [
          "freshly brewed tea",
          "the scent of tobacco"
        ],
        "tactile": [
          "plush velvet cushions",
          "cool marble fireplace mantle"
        ]
      },
      "accessControl": "Open to all guests during the day; private gatherings in the evening.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through drapes",
            "raindrops racing down the window"
          ],
          "sounds": [
            "the patter of rain",
            "the low murmur of voices"
          ],
          "smells": [
            "freshly brewed tea",
            "wet wood"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows lengthening across the room",
            "the flicker of candlelight"
          ],
          "sounds": [
            "the crackle of the fire",
            "the rustle of silk dresses"
          ],
          "smells": [
            "the scent of polished wood",
            "smoky embers"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glimmering chandeliers reflecting light",
            "the flickering flames of the fireplace"
          ],
          "sounds": [
            "the distant laughter",
            "the piano playing softly"
          ],
          "smells": [
            "the aroma of cigars",
            "the warmth of spiced cider"
          ],
          "mood": "festive yet uneasy"
        }
      ],
      "paragraphs": [
        "The drawing room, a focal point of social interaction, radiates both warmth and tension. Lavishly decorated with velvet drapes and a grand piano, it serves as a gathering space for the manor's guests. The glimmering chandelier casts an inviting glow, but beneath the surface, conversations are laced with suspicion. The scent of freshly brewed tea mingles with the smoke of cigars, creating an atmosphere rich with both camaraderie and anxiety.",
        "As the rain patters against the windows, the drawing room transforms into a refuge from the storm outside. The sound of laughter dances alongside the melancholic notes of the piano, but the smiles are strained, and the eyes dart nervously. Each guest, cloaked in their own secrets, navigates the fragile threads of social decorum, aware that trust is a luxury they may no longer afford."
      ]
    },
    {
      "id": "gardens",
      "name": "The Walled Gardens",
      "type": "exterior",
      "purpose": "Isolation and concealment",
      "visualDetails": "Lush greenery bordered by high stone walls, with meandering paths and hidden alcoves.",
      "sensoryDetails": {
        "sights": [
          "vibrant flowers peeking through damp earth",
          "shadows cast by tall hedges"
        ],
        "sounds": [
          "the rustle of leaves",
          "the distant sound of thunder"
        ],
        "smells": [
          "freshly turned soil",
          "the scent of blooming jasmine"
        ],
        "tactile": [
          "cool, damp grass underfoot",
          "rough stone walls"
        ]
      },
      "accessControl": "Accessible to all during daylight; locked at night for security.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops clinging to petals",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady rain on leaves",
            "distant thunder rumbling"
          ],
          "smells": [
            "wet earth",
            "mildew"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "damp flowers drooping in the shadows",
            "the stillness of the air"
          ],
          "sounds": [
            "silence broken by a gust of wind",
            "the creak of old branches"
          ],
          "smells": [
            "earthy dampness",
            "the fragrance of decaying leaves"
          ],
          "mood": "foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the last light fading over the hedges",
            "stars beginning to twinkle"
          ],
          "sounds": [
            "the chirping of crickets",
            "the rustle of night creatures"
          ],
          "smells": [
            "the sweetness of night-blooming flowers",
            "the coolness of evening dew"
          ],
          "mood": "mysterious"
        }
      ],
      "paragraphs": [
        "The walled gardens of Little Middleton are a verdant labyrinth, offering both beauty and concealment. High stone walls encircle the lush greenery, creating an oasis that feels both inviting and isolating. The paths meander through vibrant flower beds, while hidden alcoves provide perfect spots for whispered conversations or secretive encounters. The air is thick with the scent of blooming jasmine, mingling with the earthy aroma of freshly turned soil, creating a sensory tapestry that is both enchanting and unsettling.",
        "As the rain falls in the morning, the gardens take on a somber tone, with raindrops clinging to petals and the earth saturated with moisture. The rustle of leaves becomes the only sound in the oppressive stillness, as shadows loom larger in the overcast light. Here, among the flowers, secrets lie buried, waiting for the right moment to be unearthed, and as evening approaches, the gardens transform into a realm of mystery, where the boundary between beauty and danger blurs."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Private space for reflection and planning",
      "visualDetails": "A small, cozy room filled with dark wood furniture and a heavy oak desk, lined with books and papers.",
      "sensoryDetails": {
        "sights": [
          "the flickering glow of a desk lamp",
          "books stacked haphazardly on shelves"
        ],
        "sounds": [
          "the scratching of a pen on paper",
          "the rustle of parchment"
        ],
        "smells": [
          "the aroma of ink and paper",
          "the faint scent of leather"
        ],
        "tactile": [
          "smooth surface of the oak desk",
          "the weight of a heavy book"
        ]
      },
      "accessControl": "Access limited to family and trusted associates; locked during gatherings.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light struggling through the window",
            "the glow of the desk lamp"
          ],
          "sounds": [
            "the patter of rain on the roof",
            "the quiet scribbling of notes"
          ],
          "smells": [
            "the scent of damp paper",
            "the aroma of fresh ink"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the desk",
            "the glow of the lamp against dark walls"
          ],
          "sounds": [
            "the clock ticking softly",
            "the rustle of papers"
          ],
          "smells": [
            "the mustiness of old books",
            "the scent of polished wood"
          ],
          "mood": "tense reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the last rays of light fading outside",
            "the warm glow of the desk lamp"
          ],
          "sounds": [
            "the quiet creaking of the house settling",
            "the distant sound of laughter from the drawing room"
          ],
          "smells": [
            "the warmth of candle wax",
            "the scent of old leather"
          ],
          "mood": "solitary contemplation"
        }
      ],
      "paragraphs": [
        "The study is an intimate retreat, filled with the weight of history and the scent of old books. Dark wood furniture creates a cozy yet serious atmosphere, with a heavy oak desk at its center, laden with papers and inkpots. The flickering glow of a desk lamp casts long shadows across the room, giving life to the secrets contained within these walls. Here, thoughts can be pondered in solitude, or plans can be devised in the quiet, away from prying eyes.",
        "In the early morning, the rain creates a soft rhythm against the roof, blending with the scratching of a pen as ideas flow onto paper. The air is thick with the aroma of dampness and ink, inviting deep contemplation. As the day progresses, the overcast light turns the study into a realm of shadows, where the ticking clock serves as a reminder of the outside world, and each rustle of paper feels laden with the weight of decisions yet to be made."
      ]
    }
  ],
  "note": "",
  "cost": 0.0021781485,
  "durationMs": 40217
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1933,
    "month": "February",
    "day": 14,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast with intermittent rain",
      "chilly temperatures averaging around 5°C",
      "occasional gusts of wind"
    ],
    "daylight": "Short winter days, with twilight settling around five o'clock in the evening",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Valentine's Day on February 14"
    ],
    "seasonalActivities": [
      "Indoor games such as bridge or chess by the fireplace",
      "Preparing for spring gardening despite the cold",
      "Fashion shows featuring the latest winter collections"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tweed three-piece suits",
        "wingtip shoes",
        "double-breasted overcoats"
      ],
      "casual": [
        "corduroy trousers",
        "knitted sweaters",
        "flat caps"
      ],
      "accessories": [
        "silk ties",
        "pocket squares",
        "cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length evening gowns with dropped waists",
        "beaded clutches",
        "long gloves"
      ],
      "casual": [
        "woolen skirts",
        "button-up blouses",
        "tweed jackets"
      ],
      "accessories": [
        "cloche hats",
        "pearls",
        "scarves"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "The rise of Hollywood glamour",
      "Popularity of sportswear for women"
    ],
    "socialExpectations": [
      "Men are expected to be the primary breadwinners",
      "Women are increasingly stepping into roles outside the home",
      "Class distinctions are emphasized during social gatherings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Great Depression continues to affect economies worldwide",
      "Political tensions rise in Europe with the rise of fascism",
      "The United States sees the beginning of significant New Deal policies proposed by FDR"
    ],
    "politicalClimate": "A climate of uncertainty with increasing talk of unemployment and social unrest, leading to discussions about government intervention.",
    "economicConditions": "Widespread poverty and financial instability, with many families struggling to make ends meet.",
    "socialIssues": [
      "Rising unemployment rates",
      "Struggles of the working class",
      "Growing anti-fascist sentiments"
    ],
    "internationalNews": [
      "Hitler appointed Chancellor of Germany",
      "Civil unrest in various European countries over economic hardships"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's recordings",
        "Duke Ellington's jazz compositions",
        "The Andrews Sisters' harmonies"
      ],
      "films": [
        "King Kong",
        "The Invisible Man",
        "A Farewell to Arms"
      ],
      "theater": [
        "Porgy and Bess",
        "Of Mice and Men",
        "The Royal Family"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "The Jack Benny Program"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Great Gatsby by F. Scott Fitzgerald",
        "Murder in the Cathedral by T.S. Eliot",
        "Brave New World by Aldous Huxley"
      ],
      "popularGenres": [
        "Mystery",
        "Social Commentary",
        "Science Fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "The electric washing machine",
        "The radio broadcast system",
        "The modern refrigerator"
      ],
      "commonDevices": [
        "Typewriters for correspondence",
        "Telephones in most homes",
        "Automobiles for personal transport"
      ],
      "emergingTrends": [
        "Widespread use of consumer goods",
        "Increased reliance on radio for news and entertainment"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A dozen eggs: one shilling",
        "A weekly newspaper: three pence"
      ],
      "commonActivities": [
        "Gathering for tea in the afternoon",
        "Playing board games during long evenings",
        "Attending local dances or community events"
      ],
      "socialRituals": [
        "Formal dinner parties where guests are entertained",
        "Sunday afternoon strolls in local parks"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "A growing divide between the wealthy and the struggling middle class",
      "A sense of entitlement among the upper class in social settings"
    ],
    "gender": [
      "Women are beginning to demand more independence",
      "Men feel pressured to maintain traditional roles as providers",
      "Increased visibility of women's rights issues"
    ],
    "race": [
      "Continued racial tensions in urban areas",
      "Increasing awareness of civil rights issues among minority groups"
    ],
    "generalNorms": [
      "Respect for tradition in social gatherings",
      "An unspoken rule of politeness masking underlying tensions",
      "Expectations of propriety in behavior and dress"
    ]
  },
  "atmosphericDetails": [
    "The smell of damp earth mingling with the scent of burning logs in the manor's grand fireplace",
    "The sound of rain tapping against the window panes, creating a rhythmic backdrop to hushed conversations",
    "The flickering candlelight casting shadows on the opulent walls, enhancing the air of mystery and tension among the guests"
  ],
  "paragraphs": [
    "February 1933 unfolds in a tense atmosphere within the grand manor house, where the overcast skies reflect the somber mood of the gathering. Outside, intermittent rain falls, adding a chill to the air and forcing the party indoors. As twilight descends early in the evening, guests settle into their assigned places, the warmth of the fireplace providing a stark contrast to the cold, dampness that envelops the grounds. The clock on the mantel ticks steadily, a reminder of time passing, and perhaps, a harbinger of impending trouble.",
    "Fashion trends of the time reveal a striking contrast between the elegance of the evening attire and the more practical daytime wear. Men don tailored tweed suits paired with polished wingtip shoes, while women are adorned in tea-length gowns, their gloved hands clutching beaded purses. Cloche hats and pearls add a touch of glamour, but beneath the surface, the unspoken tensions of the Great Depression loom large. Each outfit tells a story of class and expectation, as social rituals unfold amidst the backdrop of economic uncertainty.",
    "Daily life in February 1933 is characterized by an undercurrent of suspicion. The guests engage in polite conversation, but the air is thick with unspoken accusations and lingering glances. Common activities such as bridge games and afternoon teas provide a facade of normalcy, yet the reality of rising unemployment and social unrest hangs over them like the rain outside. The prices of everyday items weigh heavily on the minds of many, and the formal dinner party is as much about status as it is about food. Rituals are observed, yet the laughter feels strained, with each toast hinting at deeper issues. In this manor house, where the past mingles with present fears, the clockwork of deception is already set in motion."
  ],
  "note": "",
  "cost": 0.0010420179,
  "durationMs": 16924
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense gathering at the manor for a wealthy benefactor's will reading places estranged family members and their associates under scrutiny, as economic strain and class tensions heighten suspicions amid the looming threat of fascism.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class divides, creating a pressure cooker of resentment and suspicion among the affluent and their staff, while political anxieties influence local dynamics."
  },
  "setting": {
    "location": "A large, sprawling country estate featuring traditional English architecture, with multiple wings, expansive gardens, and a central courtyard.",
    "institution": "Manor house",
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
    "description": "The exact time shown on the stopped clock face"
  },
  {
    "id": "tamper_amount",
    "value": "forty minutes",
    "description": "The exact amount the clock was wound back"
  },
  {
    "id": "draught_amount",
    "value": "two ounces",
    "description": "The quantity of sleeping draught in the bottle"
  },
  {
    "id": "victim_arrival_time",
    "value": "half past eleven",
    "description": "The anticipated time the victim was meant to arrive"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past eleven when discovered.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time of the murder is likely around this time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The clock was wound back to mislead everyone about the time.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This suggests a deliberate attempt to create confusion.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "spatial",
      "description": "An empty bottle of sleeping draught is found in the victim's room.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This indicates the victim may have been incapacitated.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "Witnesses mention hearing the clock ticking faintly during the evening.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "The clock was operational despite being tampered with.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "The ticking sound indicates the clock was operational despite being tampered with.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "This suggests the murder timeline may be manipulated.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_6",
      "category": "behavioral",
      "description": "Captain Ivor Hale is observed acting nervously when questioned about the time.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This raises suspicion about his involvement in the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she has a corroborated alibi, being seen at the local tavern during the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This narrows the focus towards other suspects.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was with Eleanor Voss at the tavern during the time of the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This further narrows the suspects to Captain Ivor Hale.",
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
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The mechanical clock in the study was wound back to create a false timeline for the murder.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "This is the core mechanism of the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock was wound back to mislead everyone about the time.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the initial assumption of the time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she was seen at the tavern during the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This narrows the focus towards Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_early_1",
      "category": "temporal",
      "description": "Witnesses mention hearing the clock ticking faintly during the evening.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "The clock was operational despite being tampered with.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_mid_1",
      "category": "temporal",
      "description": "The ticking sound indicates the clock was operational despite being tampered with.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "This suggests the murder timeline may be manipulated.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_late_1",
      "category": "temporal",
      "description": "The clock was wound back to mislead everyone about the time.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the initial assumption of the time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "The clock in the study shows eleven ten remains a late texture detail in the case background.",
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
      "description": "Witnesses mention hearing the clock ticking faintly during the evening.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The ticking sound indicates the clock was operational despite being tampered with.",
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
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_late_1"
    ],
    "mid": [
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_culprit_direct_captain_ivor_hale",
      "clue_core_elimination_chain",
      "clue_early_1",
      "clue_mid_1",
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
  "latencyMs": 11462,
  "cost": 0.00382668495
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
