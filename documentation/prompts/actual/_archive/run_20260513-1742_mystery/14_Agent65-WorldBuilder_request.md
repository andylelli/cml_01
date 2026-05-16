# Actual Prompt Record

- Run ID: `mystery-1778694167417`
- Project ID: ``
- Timestamp: `2026-05-13T17:46:43.540Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `6a645a2db9d47e07`

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
    "title": "The Clock That Struck Midnight",
    "author": "Detective Writer",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Voss Estate"
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
      "relationships": [],
      "public_persona": "Wealthy heiress",
      "private_secret": "Knows more about family politics than she lets on",
      "motive_seed": "Inheritance",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "direct access to all rooms"
      ],
      "behavioral_tells": [
        "calm demeanor",
        "sharp wit"
      ],
      "stakes": "High, due to family legacy",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "30-50",
      "role_archetype": "medical expert",
      "relationships": [
        "family friend"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Has a hidden romantic interest in Eleanor",
      "motive_seed": "Unrequited love",
      "motive_strength": "moderate",
      "alibi_window": "limited",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "access to medicine cabinet"
      ],
      "behavioral_tells": [
        "nervous twitch",
        "frequent glances at Eleanor"
      ],
      "stakes": "High, due to feelings for Eleanor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "innocent",
      "gender": "non-binary"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-60",
      "role_archetype": "military officer",
      "relationships": [
        "distant cousin"
      ],
      "public_persona": "Charismatic leader",
      "private_secret": "In debt due to gambling",
      "motive_seed": "Financial gain",
      "motive_strength": "strong",
      "alibi_window": "narrow",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "frequent visits to the estate"
      ],
      "behavioral_tells": [
        "overconfidence",
        "slight arrogance"
      ],
      "stakes": "High, due to financial pressure",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "maid",
      "relationships": [
        "servant"
      ],
      "public_persona": "Obedient staff member",
      "private_secret": "Knows family secrets",
      "motive_seed": "Protecting the estate's reputation",
      "motive_strength": "weak",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "daily access to all areas"
      ],
      "behavioral_tells": [
        "submissive behavior",
        "eyes darting"
      ],
      "stakes": "High, due to job security",
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
      "summary": "During a family meeting at the Voss estate to discuss inheritance amidst class tensions, Eleanor Voss is found dead. As tensions rise, the investigation reveals that the mechanical clock was tampered with to create a misleading timeline."
    },
    "accepted_facts": [
      "Eleanor Voss was found dead in her study.",
      "The clock in the study showed ten minutes past eleven when she was discovered.",
      "A note in her hand indicated a meeting scheduled for a quarter past eleven."
    ],
    "inferred_conclusions": [
      "The time on the clock does not match the timing of the murder."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was wound back intentionally to create a false timeline regarding the murder.",
      "delivery_path": [
        {
          "step": "The clock shows a time that is inconsistent with witness accounts."
        },
        {
          "step": "Evidence indicates the clock was recently tampered with."
        }
      ]
    },
    "outcome": {
      "result": "The tampering of the clock misled the investigation regarding the time of death."
    }
  },
  "false_assumption": {
    "statement": "Eleanor was killed at a time indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock seemed to show the correct time when the murder was discovered.",
    "what_it_hides": "The clock was deliberately set back to mislead the investigation."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "the time of the murder",
        "the clock's striking time"
      ],
      "windows": [
        "10:10 to 10:20",
        "10:20 to 10:30"
      ],
      "contradictions": [
        "The clock shows 11:10, but witnesses recall hearing a chime at 11:00."
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
        "the clock",
        "the study door"
      ],
      "permissions": [
        "Eleanor had unrestricted access to the estate."
      ]
    },
    "physical": {
      "laws": [
        "The clock's mechanism can only be altered physically."
      ],
      "traces": [
        "Fingerprints were found on the clock's casing."
      ]
    },
    "social": {
      "trust_channels": [
        "family connections",
        "friendship ties"
      ],
      "authority_sources": [
        "household rules about access to personal spaces."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows ten minutes past eleven when Eleanor is found.",
        "correction": "This suggests that the time of death could be misrepresented if the clock was tampered with.",
        "effect": "Narrows timeline of death.",
        "required_evidence": [
          "Eleanor's note shows a meeting at a quarter past eleven.",
          "Witnesses note the clock chimed at eleven."
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock was recently wound back, as evidenced by fresh tool marks.",
        "correction": "This indicates intentional tampering, altering the perceived timeline.",
        "effect": "Eliminates the assumption of the clock being accurate.",
        "required_evidence": [
          "Witness accounts of the clock's previous time.",
          "Maintenance log showing no repairs before the murder."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses report hearing the clock strike at eleven, but the clock shows a different time.",
        "correction": "This discrepancy further implies intentional manipulation of the clock.",
        "effect": "Narrowing suspect responsibility for tampering.",
        "required_evidence": [
          "Witness testimony confirming the clock's chime time.",
          "Analysis of the clock's mechanism showing signs of modification."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A confrontation is staged where all suspects are questioned about their whereabouts during the alleged time of Eleanor's death, revealing the tampering evidence backed by clock maintenance logs.",
    "knowledge_revealed": "The discrepancies in alibis reveal that only one suspect could have tampered with the clock.",
    "pass_condition": "If the alibi does not hold up against the clock evidence, the suspect is identified as guilty.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_6",
      "clue_core_contradiction_chain",
      "clue_4"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's misleading time (early) and Eleanor's note (mid) allow the reader to understand that timing is critical. Step 2: The tampering evidence (mid) reveals intentional manipulation. Step 3: The inconsistencies in suspect alibis (discriminating test) lead to identifying Eleanor as the perpetrator."
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
        "clearance_method": "His medical alibi is supported by time-stamped records.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His financial pressures are unrelated to the timing of the murder.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her duties and whereabouts are accounted for.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence."
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
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness testimony"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_6",
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
        "clue_id": "clue_core_elimination_chain_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_eleanor_voss",
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
    "summary": "Eleanor Voss is a retired schoolteacher turned amateur sleuth, respected for her community contributions but secretly grappling with familial resentment.",
    "publicPersona": "Eleanor is a pillar of the Little Middleton community, known for her dedication to education and charitable work, always dressed in a modest yet elegant manner. Her warm smile and gentle demeanor make her a beloved figure, often sought for advice by both young and old.",
    "privateSecret": "Beneath her composed exterior, Eleanor harbors a simmering resentment toward her wealthy relatives who dismiss her humble origins. Their condescending attitudes have stung deeply, fueling a desire to prove her worth in a family that has long overlooked her.",
    "motiveSeed": "Eleanor's longing to validate her place within her family legacy intensifies after being excluded from discussions about the family estate’s inheritance. She believes that solving the murder could earn her the recognition she craves.",
    "motiveStrength": "moderate",
    "alibiWindow": "Eleanor claims to have been in the library, engrossed in a novel, from eight to nine when the murder took place. The library's quiet solitude is her refuge, allowing her to escape the judgments of her relatives.",
    "accessPlausibility": "easy",
    "stakes": "Eleanor seeks not just a share of the family estate, but also the respect and acknowledgment she feels she has been denied all her life, which weighs heavily on her heart.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks in a measured tone, often pausing to choose her words carefully. She has a penchant for literary references, which she uses to illustrate her points. When she attempts humor, it surfaces as a subtle irony.",
    "internalConflict": "Eleanor struggles with feelings of inadequacy and the pressure to meet her family's expectations. She fears that if she unveils her resentment, she might be cast out entirely, leaving her to navigate the treacherous waters of family loyalty and personal integrity.",
    "personalStakeInCase": "This case matters to Eleanor not only because of the potential for inheritance but also because it represents a chance to reclaim her narrative and assert her rightful place within a family that has long belittled her.",
    "paragraphs": [
      "Eleanor Voss had always been the sort of woman who preferred the company of books over people. At forty-five, she had long since retired from her position as a schoolteacher, yet her passion for education and community service remained undiminished. The townsfolk of Little Middleton held her in high regard, often seeking her counsel on various matters. Her life, however, felt like a series of polite smiles and hidden grievances, particularly when it came to her wealthy relatives who viewed her humble beginnings with thinly veiled disdain.",
      "The library was Eleanor's sanctuary, a place where the musty scent of old pages enveloped her like a comforting embrace. On the night of the murder, she had been ensconced in a corner, lost in a world of fictional intrigue, when the clock struck midnight. The irony of the hour was not lost on her; she often felt like a character in a novel, destined to uncover truths that others preferred buried. Yet, as she contemplated her family’s shadowy dealings, a sense of determination stirred within her. This was her chance to prove herself worthy of the legacy that had been so casually bestowed upon others.",
      "But the demons of her past were relentless. The resentment she felt toward her relatives gnawed at her, a constant reminder of their condescension. She wanted to confront them, to expose the hypocrisy of their judgments, yet the fear of rejection held her back. Would they ever see her as anything more than the poor relation? The thought spurred her forward; perhaps solving this murder would not only bring her the recognition she sought but also allow her to reclaim her narrative from those who sought to define it for her.",
      "As she delved deeper into the investigation, Eleanor found herself torn between her desire for validation and the truth she was uncovering. The more she learned about the victim, the more she realized that the world of wealth and privilege was rife with secrets, much like her own family. Each revelation brought her closer to understanding the complexities of her relationships, forcing her to confront the very resentment she had long buried. This journey would ultimately lead her to a crossroads, where she would have to choose between the comfort of familial bonds and the courage to stand alone in her truth."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a compassionate physician battling a gambling addiction that threatens their career and reputation.",
    "publicPersona": "Known for their progressive ideas and empathetic approach, Dr. Finch is a well-regarded figure in Little Middleton's medical community, often seen at social gatherings discussing the latest advancements in health care.",
    "privateSecret": "Behind their charming smile lies a troubling secret: a gambling addiction that has spiraled out of control, leading to financial strain and a looming fear of losing their medical license. This internal battle remains hidden beneath layers of professionalism.",
    "motiveSeed": "Desperate to pay off mounting debts while maintaining the façade of a successful doctor, Dr. Finch fears that any hint of their addiction could jeopardize their career and reputation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Dr. Finch claims to have been in their office attending to patients during the time of the murder, yet the absence of records for that hour raises eyebrows and casts doubt on their credibility.",
    "accessPlausibility": "possible",
    "stakes": "The stakes are high for Dr. Finch; financial ruin and the potential loss of their medical license loom large, threatening to dismantle the life they have built.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with an engaging cadence, often punctuating their sentences with nervous laughter. They have a tendency to downplay their own achievements, using humor to deflect attention away from their vulnerabilities.",
    "internalConflict": "Dr. Finch is caught in a web of guilt and shame over their addiction, struggling to reconcile their public persona with the truth of their private life. This internal conflict is compounded by the fear that discovery will lead to their downfall.",
    "personalStakeInCase": "This case matters deeply to Dr. Finch, not only because of the potential financial implications but because they yearn for a chance to break free from the shadows of their addiction and reclaim their integrity as a healer.",
    "paragraphs": [
      "In the heart of Little Middleton, Dr. Mallory Finch was celebrated as a beacon of compassion and progressive thought in medicine. At thirty-five, they had carved out a reputation for themselves, known for their commitment to patient care and innovative approaches to treatment. Yet, beneath the surface of this well-respected physician lay a turbulent undercurrent of addiction that threatened to unravel everything they had worked for. The allure of gambling had initially seemed harmless, a mere distraction from the pressures of their demanding profession, but it had since morphed into a monster that loomed ever larger.",
      "On the night of the murder, Dr. Finch had claimed to be in their office, diligently attending to patients. Yet, the absence of any records for that hour was a chink in their armor, one that made their heart race with anxiety. They knew that if anyone were to find out about their gambling, it would spell disaster—not just for their career, but for the very identity they had constructed over the years. The fear of exposure was suffocating, yet the thrill of the gamble was intoxicating, a dichotomy that left them feeling perpetually on edge.",
      "As they navigated the investigation, Dr. Finch couldn’t help but view the unfolding drama through the lens of their own struggles. Each revelation about the murder felt like a reflection of their own internal chaos. The stakes were high, and with each passing moment, the pressure mounted. They needed money, and fast—yet the potential for ruin loomed large. The thought of losing their medical license sent shivers down their spine, as it would mean losing not only their career but also the respect of the community they had fought so hard to gain.",
      "In the midst of this turmoil, Dr. Finch faced a critical choice: to confront their addiction or let it consume them. The murder investigation became a catalyst for self-reflection, forcing them to confront the very demons they had sought to hide. With every piece of evidence uncovered, they found themselves grappling with the reality of their situation. The path to redemption was fraught with challenges, yet the possibility of reclaiming their life and career shimmered just beyond the horizon, should they find the courage to face the truth."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired military officer with a storied past, driven by a desire for justice and harboring resentment toward the aristocracy.",
    "publicPersona": "A charismatic gentleman, Captain Hale is known for regaling audiences with tales of his military exploits, often charming those around him with his wit and charisma. His presence at social gatherings is magnetic, drawing both admiration and curiosity.",
    "privateSecret": "Beneath the charming façade lies a deep-seated resentment toward the aristocracy, stemming from his experiences during the war, where he witnessed the sacrifices of his comrades go unrecognized and unappreciated.",
    "motiveSeed": "Convinced that the victim was involved in treacherous dealings that harmed his fellow soldiers, Captain Hale is driven by a thirst for justice and the need to vindicate the sacrifices of his comrades.",
    "motiveStrength": "strong",
    "alibiWindow": "Captain Hale claims to have been in the garden, tending to his flowers during the time of the murder, yet the isolation of his alibi raises questions about its validity.",
    "accessPlausibility": "unlikely",
    "stakes": "For Captain Hale, the stakes extend beyond justice; they encompass a desire for vindication, a chance to honor the memory of those who fought and fell during the war, and to confront the societal structures that facilitated their suffering.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Captain Hale speaks with a commanding presence, his words often laced with dry humor. He has a penchant for dramatic pauses and grand gestures, making his stories both engaging and theatrical.",
    "internalConflict": "Captain Hale grapples with his anger toward the aristocracy and the desire for peaceful resolution. He wrestles with the notion that vengeance might not bring the solace he seeks, creating a profound tension within him.",
    "personalStakeInCase": "This case matters immensely to Captain Hale as it represents an opportunity to confront the injustices he feels deeply and to achieve a sense of closure for himself and his fallen comrades.",
    "paragraphs": [
      "At fifty-five, Captain Ivor Hale was a man of stories, his life a tapestry woven with threads of valor, sacrifice, and unyielding charm. The retired military officer had a way of captivating an audience, regaling them with tales of his exploits on distant battlefields. Yet, beneath the surface of his charisma lay a simmering resentment toward the aristocracy that had so carelessly overlooked the sacrifices of soldiers like him. The war had changed him, and he found it increasingly difficult to reconcile the memories of his comrades with the indifference of society.",
      "On the night of the murder, Captain Hale claimed to have been tending to his beloved garden, a sanctuary where he sought solace among the flowers. Yet, as he reflected on the events leading up to the tragedy, he felt the weight of his alibi pressing down on him. The victim's involvement in shady dealings that had endangered his fellow soldiers gnawed at him, igniting a fire within that demanded justice. He had fought for his country, and now he was determined to ensure that the truth would not be buried along with the victim.",
      "As the investigation unfolded, Captain Hale's anger became both a driving force and a burden. He longed for vindication, not just for himself, but for all those who had suffered in silence. Each clue uncovered felt like a step toward reclaiming the honor that had been stripped away from his comrades. The stakes were high; he was not merely seeking justice for a murder, but a reckoning for a system that had perpetuated inequality and neglect. In his heart, he believed that confronting the truth would bring closure, but the path was fraught with the risk of further conflict.",
      "Yet, Captain Hale found himself at a crossroads, torn between his desire for revenge and the possibility of a peaceful resolution. The internal conflict raged within him, a battle between the man he had become and the soldier he once was. As the clock ticked toward the resolution of the case, he realized that the quest for justice might not yield the satisfaction he sought. Perhaps, in facing the truth, he would find a way to honor his comrades' memories without succumbing to the anger that had threatened to consume him."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a vibrant socialite entangled in a secret affair, struggling to balance family expectations with her desire for personal happiness.",
    "publicPersona": "At twenty-five, Beatrice is the epitome of youthful exuberance, often seen at the center of social gatherings, her laughter ringing out like music. Fashionably dressed and ever charming, she is the darling of Little Middleton's elite, effortlessly captivating attention wherever she goes.",
    "privateSecret": "Beneath her vivacious exterior lies a tumultuous secret: Beatrice is embroiled in a forbidden affair with someone from the working class, a relationship that could shatter her family's reputation if discovered.",
    "motiveSeed": "Fearing disownment by her family should they learn of her relationship, Beatrice is driven by a desperate need for money to escape and maintain her lifestyle while pursuing love.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims to have been in her room preparing for the evening's gala, yet witnesses saw her sneaking out, casting doubt on her innocence.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, the stakes are high; she is caught between familial duty and the pursuit of her own happiness, with the potential loss of both hanging in the balance.",
    "humourStyle": "blunt",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with an animated expressiveness, often punctuating her sentences with dramatic flair. She is candid in her speech, not shying away from uncomfortable truths, and has a tendency to use humor as a means of coping with her fears.",
    "internalConflict": "Beatrice is torn between her love for her partner and the expectations of her family, grappling with the fear that pursuing her own happiness might lead to isolation from those she loves.",
    "personalStakeInCase": "This case matters to Beatrice as it represents a pivotal moment in her life, forcing her to confront whether she will continue to live in the shadows of her family's expectations or embrace her own desires.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of vivacity at twenty-five, a socialite who dazzled the elite of Little Middleton with her charm and infectious laughter. She was often the center of attention, her fashionable attire and spirited conversations drawing admirers like moths to a flame. Yet, beneath the surface of her vibrant persona lay a precarious secret: a passionate affair with someone from the working class. This relationship, if discovered, could shatter not only her reputation but also her family's standing in society.",
      "On the night of the murder, Beatrice had claimed to be preparing for the evening gala, yet the whispers of those who had seen her slip out into the night cast doubt on her alibi. The thrill of her clandestine romance brought her joy, but the weight of societal expectations was a constant reminder of the chasm between her desires and her family's ambitions. The fear of being disowned loomed large, a specter that haunted her every decision. She wanted to escape, to forge her own path, but the stakes were impossibly high.",
      "As the investigation unfolded, Beatrice found herself grappling with the realities of her choices. Each revelation about the murder felt like a reflection of her own inner turmoil. The victim's involvement in a world of deceit echoed her own struggles, forcing her to confront the consequences of her choices. She wanted love, yet the price of that love could be her very existence within her family. The tension between duty and desire simmered just beneath the surface, threatening to bubble over at any moment.",
      "Caught in a web of uncertainty, Beatrice stood at a crossroads. The case represented not only a potential danger to her carefully constructed life but also an opportunity for profound change. She could continue to live under the weight of her family's expectations, or she could seize the moment to embrace her true self. This investigation would ultimately challenge her to confront her fears, to choose between the life she had always known and the happiness she desperately sought. As she navigated the murky waters of love and loyalty, Beatrice realized that the path ahead would require courage and conviction."
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
    "summary": "A sprawling estate marked by its opulent architecture and sprawling gardens, Little Middleton Manor is a sanctuary for the elite, yet shrouded in secrets and tension among its guests.",
    "visualDescription": "The manor rises majestically from the misty grounds, its stone façade adorned with intricate carvings and large bay windows that reflect the overcast sky. Surrounding the estate, manicured hedges and ancient oaks create a labyrinth of shadow and light, while the central courtyard boasts a fountain that murmurs softly, its water glistening in the muted daylight.",
    "atmosphere": "The air is thick with unspoken words and concealed motives, as if every corner of the manor holds a whisper of its storied past.",
    "paragraphs": [
      "Little Middleton Manor stands as a testament to a bygone era, where grandeur meets isolation in the heart of the English countryside. Its sprawling wings, connected by a series of dimly lit corridors, create a maze that is both inviting and disquieting. The estate is enveloped in a shroud of autumn mist, which seems to gather like secrets among the hedges and trees, waiting to be uncovered. As guests navigate the opulent drawing rooms and shadowy studies, the tension in the air is palpable, thickening with every tick of the grand clock that looms over the central hall.",
      "The gardens, meticulously tended yet wild in their hidden corners, are a reflection of the manor's duality. Flowerbeds burst with color, but the hedges rise high, creating barriers that obscure sightlines and invite concealment. It is a place where lovers might rendezvous away from prying eyes, or where a furtive figure might slip away unnoticed. The scent of damp earth mingles with the faint aroma of decaying leaves, a reminder that even beauty can hide darkness beneath its surface.",
      "As the day wears on, the overcast sky casts a pall over the estate, and the sound of distant thunder rumbles ominously, echoing the unease among the guests. The radio crackles softly in the background, broadcasting the latest news of the world beyond the manor’s confines, but the conversations within remain hushed and fragmented, revealing little of the true thoughts of those assembled. Each guest seems to carry their own burden, glancing furtively at one another, as if anticipating the moment when secrets will spill forth like rain from the laden clouds above.",
      "In the heart of this grand abode lies the library, a sanctuary of knowledge and a repository of the family's past. It is a room often locked to outsiders, its treasures reserved for the family alone. Yet, within its walls, the echoes of whispered conversations and the scratch of typewriter keys can be heard, hinting at the stories that lie just below the surface. As shadows lengthen and the clock strikes the hour, the manor seems to hold its breath—waiting for the clock to strike midnight, when all will be revealed."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain showers, typical of a British countryside in autumn.",
    "timeFlow": "The narrative unfolds over three days, each hour thickening the air with tension and suspicion.",
    "mood": "Tense, with underlying secrets and unspoken tensions among the guests.",
    "eraMarkers": [
      "Guests engage in hushed conversations while gathered around a radio broadcasting the latest news.",
      "Typewriters echo in the study, where correspondence is crafted with careful thought amidst the turmoil.",
      "Early home telephones connect the manor to the outside world, but the party lines often lead to interruptions and gossip."
    ],
    "sensoryPalette": {
      "dominant": "The pervasive scent of damp earth and decaying leaves, a reminder of the autumn season.",
      "secondary": [
        "The crisp sound of leaves crunching underfoot as guests stroll through the gardens.",
        "The low, rhythmic ticking of the grand clock that echoes throughout the manor."
      ]
    },
    "paragraphs": [
      "The atmosphere within Little Middleton Manor is thick with the scent of damp earth, an olfactory signature of the autumnal season that envelops the estate. As guests navigate the dimly lit corridors, the air is punctuated by the soft, rhythmic ticking of the grand clock, a constant reminder of the passage of time and the secrets it holds. Conversations are low and guarded, swirling around like the mist that clings to the hedges outside, creating an air of anticipation for what lies hidden beneath the surface.",
      "The overcast sky casts a muted light across the expansive gardens, where the sound of rustling leaves and distant thunder adds to the oppressive mood. The gentle murmur of the fountain in the central courtyard provides a stark contrast to the tension simmering among the guests, who steal furtive glances at one another as if searching for hidden truths. Every creak of the floorboards and every whisper seems amplified in the stillness, drawing attention to the subtle undercurrents of distrust and suspicion that weave through the fabric of this grand estate."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The East Wing Study",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The study is a somber room, lined with dark mahogany bookshelves filled with leather-bound volumes. A large oak desk sits in the center, its surface marred by a spilled inkpot, and a solitary armchair faces the flickering fire, casting shadows that dance across the walls.",
      "sensoryDetails": {
        "sights": [
          "The flickering flames in the fireplace cast an eerie glow, illuminating the dust motes that float lazily in the air.",
          "A collection of antique globes and maps adorn the walls, their colors faded yet still vibrant against the dark wood."
        ],
        "sounds": [
          "The soft crackle of the fire provides a comforting backdrop, but the room is otherwise eerily silent, amplifying the tension.",
          "Occasionally, the distant sound of rain tapping against the windowpane breaks the stillness, adding to the sense of foreboding."
        ],
        "smells": [
          "The rich aroma of old books mingles with the faint scent of smoke from the fireplace, creating a cozy yet unsettling atmosphere.",
          "A hint of dampness lingers in the air, a reminder of the rain that has seeped into the manor's very bones."
        ],
        "tactile": [
          "The leather of the armchair is cool to the touch, its surface cracked and worn from years of use, inviting yet foreboding.",
          "The desk is solid and heavy, its surface smooth but marred by the remnants of the ink spill, a reminder of the chaos that unfolded."
        ]
      },
      "accessControl": "The study is accessible to family members and select guests, but is often locked to prevent unwarranted entry. Staff are forbidden from entering without explicit permission from the family.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain dribbles down the window, distorting the view of the garden beyond.",
            "The dim light creates a gloomy atmosphere, with shadows creeping across the room."
          ],
          "sounds": [
            "The steady drumming of rain against the roof fills the silence, a constant reminder of the outside world.",
            "Occasional thunder rumbles in the distance, echoing ominously."
          ],
          "smells": [
            "The scent of wet earth and leaves wafts through the slightly ajar window.",
            "A faint whiff of mildew lingers, a sign of the manor's age."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The grey light casts long shadows across the study, creating an atmosphere of unease.",
            "The flickering fire struggles to illuminate the dark corners of the room."
          ],
          "sounds": [
            "A distant clock ticks steadily, its sound echoing the tension in the room.",
            "The creak of floorboards can be heard as guests move cautiously about."
          ],
          "smells": [
            "A mix of dust and aged leather fills the air, a testament to the room's history.",
            "The faint scent of smoke from the fireplace adds to the atmosphere."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers on the desk, casting dancing shadows that create an air of mystery.",
            "The darkened room contrasts with the bright stars visible through the window."
          ],
          "sounds": [
            "The soft crackle of the fire is punctuated by the distant sound of laughter from the drawing room.",
            "The ticking clock seems to grow louder, marking the passage of time."
          ],
          "smells": [
            "The warm scent of melting wax mixes with the rich aroma of the fireplace.",
            "A hint of tobacco smoke wafts in from the adjoining rooms, adding to the ambiance."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The East Wing Study, where the crime unfolded, is a chamber steeped in shadows and secrets. Dark mahogany bookshelves loom overhead, filled with tomes that whisper of forgotten knowledge, their spines cracked and faded. The heavy oak desk commands attention, its surface marred by a recent ink spill, a reminder of the chaos that erupted in this otherwise serene space. The armchair, facing the flickering fireplace, seems to hold its breath, waiting for the next chapter of this unfolding mystery.",
        "As the rain begins to fall outside, the study becomes a sanctuary of tension and uncertainty. The soft crackle of the fire provides a comforting backdrop, yet the silence is punctuated by distant thunder, a reminder of the storm brewing both inside and out. The air is heavy with the scent of aged leather and damp earth, and every creak of the floorboards sends a shiver down the spine. Here, in this room of secrets, the truth lies hidden, waiting to be uncovered."
      ]
    },
    {
      "id": "library",
      "name": "The Grand Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The Grand Library is a vast, vaulted room filled with towering shelves of books that stretch up to the ceiling. A large globe sits in one corner, while ornate armchairs are arranged around a central coffee table laden with newspapers and correspondence.",
      "sensoryDetails": {
        "sights": [
          "Sunlight filters through stained glass windows, casting colorful patterns on the polished wooden floor.",
          "The shelves are lined with volumes of varying sizes, their spines gleaming in the soft light, each waiting to divulge its secrets."
        ],
        "sounds": [
          "The soft rustle of pages turning can be heard as guests sift through the collection, searching for answers.",
          "Occasionally, the creak of the library's heavy door opening interrupts the stillness, echoing ominously in the spacious room."
        ],
        "smells": [
          "The rich scent of aged paper and leather fills the air, a comforting yet foreboding presence in the otherwise quiet space.",
          "A hint of dust lingers, a testament to the books that have remained undisturbed for too long."
        ],
        "tactile": [
          "The smooth, cool surface of the coffee table invites exploration, its edges rounded from years of use.",
          "The spines of the books are rough to the touch, their textures varying from cloth to leather, each telling a story of its own."
        ]
      },
      "accessControl": "Access to the Grand Library is restricted primarily to family members and close friends, with strict rules about handling the books. Guests must seek permission before entering, as the library holds many family secrets.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak the stained glass, blurring the vibrant colors and casting a muted light across the room.",
            "The library appears darker, shadows creeping into the corners."
          ],
          "sounds": [
            "The rhythmic patter of rain against the windows creates a soothing backdrop, lulling guests into contemplation.",
            "The crackle of the fireplace provides a comforting contrast to the rain's steady beat."
          ],
          "smells": [
            "The scent of wet wood and damp paper permeates the air, a reminder of the rain outside.",
            "A rich, earthy aroma of the moist ground wafts in through the slightly open window."
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The dim light casts long shadows across the room, making the library feel even more expansive and mysterious.",
            "Dust motes drift lazily in the air, illuminated by the faint light filtering through the windows."
          ],
          "sounds": [
            "The soft whisper of pages turning fills the air, punctuated by the occasional creak of the wooden floorboards.",
            "The distant sound of thunder rumbles, adding to the tension in the atmosphere."
          ],
          "smells": [
            "The musty scent of old books mingles with the fresh aroma of polished wood, creating a unique, nostalgic fragrance.",
            "A faint hint of mildew lingers, a reminder of the library's age."
          ],
          "mood": "mysterious"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The soft glow of candlelight flickers in the corners, casting dancing shadows that animate the shelves.",
            "The library appears warm and inviting, a sanctuary amidst the growing darkness outside."
          ],
          "sounds": [
            "The crackling of the fire mingles with the soft murmur of voices from the drawing room, creating a comforting ambiance.",
            "The ticking of a clock in the background serves as a reminder of the passing time."
          ],
          "smells": [
            "The rich aroma of burning wood fills the air, adding to the cozy atmosphere of the library.",
            "A hint of tobacco smoke from the drawing room wafts in, blending with the scent of aged leather."
          ],
          "mood": "inviting yet tense"
        }
      ],
      "paragraphs": [
        "The Grand Library is a sanctuary of knowledge and secrets, its towering shelves filled with volumes that hold the stories of generations. Sunlight filters through stained glass windows, casting colorful patterns on the polished wooden floor, illuminating the dust motes that dance in the air. A large globe sits in one corner, a silent witness to the world beyond the manor's walls, while ornate armchairs invite guests to sit and ponder their discoveries. Yet, beneath the surface of this tranquil space lies an undercurrent of tension, as whispers of secrets linger in the air, waiting to be unearthed.",
        "As guests sift through the collection, the soft rustle of pages turning fills the room, each sound echoing softly against the high ceilings. The rich scent of aged paper and leather creates a comforting yet foreboding atmosphere, while the hint of dust suggests that some volumes have remained undisturbed for too long. With each turn of a page, the library reveals its mysteries, but the shadows lurking in the corners seem to hint that not all secrets are meant to be uncovered."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Formal Dining Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The dining room is lavishly decorated, with a long mahogany table that can seat twenty, surrounded by high-backed chairs upholstered in rich burgundy fabric. Crystal chandeliers hang from the ceiling, casting a warm glow over the intricate china patterns displayed on the sideboard.",
      "sensoryDetails": {
        "sights": [
          "The table is set with gleaming silverware and crystal goblets, reflecting the soft light from the chandeliers above.",
          "Portraits of the family ancestors gaze down from the walls, their expressions seemingly judging the gatherings of the living."
        ],
        "sounds": [
          "The clinking of glasses and the murmur of conversation fill the air as guests engage in polite banter and subtle glances.",
          "The rustle of napkins and the soft scrape of chairs being pushed back punctuate the evening's proceedings."
        ],
        "smells": [
          "The rich aroma of roasted meats and fresh vegetables wafts from the kitchen, mixing with the scent of polished wood and candles.",
          "A hint of wine lingers in the air, a testament to the evening's libations and the conversations that flow alongside them."
        ],
        "tactile": [
          "The smooth surface of the mahogany table is cool to the touch, its polished finish gleaming under the chandelier's light.",
          "The upholstery of the high-backed chairs feels luxurious against one's skin, inviting guests to linger longer at the table."
        ]
      },
      "accessControl": "The dining room is accessible to all guests during meal times, but is otherwise a private space for the family. Staff are required to remain discreet and serve from the periphery, avoiding interruption of the guests' conversations.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the windows, creating a blurred view of the garden outside.",
            "The dining room appears dimmer, the light struggling to penetrate the grey clouds."
          ],
          "sounds": [
            "The sound of rain pattering against the roof provides a soothing yet melancholic backdrop to the morning meal.",
            "Occasional thunder rumbles in the distance, echoing the tension in the air."
          ],
          "smells": [
            "The scent of freshly brewed coffee mingles with the aroma of damp wood and rain outside.",
            "A hint of toast and marmalade adds a comforting warmth to the atmosphere."
          ],
          "mood": "quiet contemplation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The natural light is muted, casting shadows across the table and creating an atmosphere of intimacy.",
            "The flickering candle flames provide a soft glow, contrasting with the grey outside."
          ],
          "sounds": [
            "The soft murmur of conversation fills the air, punctuated by the occasional laughter that rings out like a warning bell.",
            "The clinking of cutlery against china echoes, creating a rhythm to the gathering."
          ],
          "smells": [
            "The rich scent of a hearty stew simmers in the kitchen, wafting through the dining room and inviting appetites.",
            "The aroma of fresh bread adds to the warmth, wrapping around guests like a comforting embrace."
          ],
          "mood": "intimate yet tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The chandelier's light reflects off the polished silverware, casting a dazzling glow across the table.",
            "The warm colors of the room create a welcoming ambiance, inviting guests to linger."
          ],
          "sounds": [
            "Laughter and conversation flow easily, creating a lively atmosphere as the evening unfolds.",
            "The soft sound of a piano can be heard from the drawing room, blending with the lively chatter."
          ],
          "smells": [
            "The aroma of rich desserts wafts in from the kitchen, tantalizing guests and hinting at the indulgences to come.",
            "The scent of fine wine fills the air, complementing the evening's culinary offerings."
          ],
          "mood": "festive yet strained"
        }
      ],
      "paragraphs": [
        "The Formal Dining Room is a grand space that exudes both elegance and tension, with a long mahogany table set for an elaborate feast. Crystal chandeliers hang from the ceiling, casting a warm glow over the meticulously arranged place settings, each adorned with gleaming silverware and delicate china. Portraits of family ancestors gaze down from the walls, their expressions seemingly judging the gatherings of the living as laughter and conversation weave through the air. Yet, beneath the surface of the jovial atmosphere lies a current of unease, as unspoken tensions simmer among the guests.",
        "As the evening progresses, the dining room transforms into a stage for both culinary delights and hidden agendas. The rich aroma of roasted meats and fresh vegetables wafts from the kitchen, mingling with the scent of polished wood and candles, creating an inviting yet charged atmosphere. Conversations ebb and flow, punctuated by the clinking of glasses and the rustle of napkins, but the tension remains palpable, as each guest navigates the fine line between civility and the desire to uncover the truth hidden beneath the surface."
      ]
    },
    {
      "id": "garden",
      "name": "The Secret Garden",
      "type": "exterior",
      "purpose": "Clue discovery",
      "visualDetails": "The Secret Garden is an overgrown enclave hidden behind tall hedges, filled with wildflowers and untamed vines. A rusted wrought-iron bench sits beneath a sprawling oak tree, offering a secluded spot for quiet reflection or clandestine meetings.",
      "sensoryDetails": {
        "sights": [
          "Brightly colored wildflowers bloom amid the greenery, their vibrant hues contrasting sharply with the deep green of the hedges.",
          "The sunlight filters through the leaves of the oak tree, creating dappled patterns on the ground."
        ],
        "sounds": [
          "The gentle rustling of leaves creates a soothing melody, interrupted only by the occasional chirp of a bird or the distant sound of rain.",
          "The creaking of the old bench adds a nostalgic touch, as if it holds secrets of conversations long past."
        ],
        "smells": [
          "The sweet fragrance of blooming flowers fills the air, mingling with the earthy scent of damp soil and decaying leaves.",
          "A faint hint of jasmine wafts through the air, adding a romantic touch to the secluded space."
        ],
        "tactile": [
          "The rough texture of the bench contrasts with the softness of the surrounding grass, inviting guests to sit and ponder.",
          "The coolness of the shaded area beneath the oak tree offers a refreshing respite from the sun's warmth."
        ]
      },
      "accessControl": "The Secret Garden is known only to a few, primarily family members and close friends. Guests must seek permission to enter, as it is a favored spot for private conversations away from prying eyes.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the petals of flowers, creating a glistening display that catches the eye.",
            "The garden appears more vibrant, colors intensified by the moisture in the air."
          ],
          "sounds": [
            "The steady patter of rain on leaves forms a soothing backdrop, creating a serene atmosphere.",
            "Occasional thunder rumbles in the distance, hinting at the storm's approach."
          ],
          "smells": [
            "The scent of wet earth and blooming flowers is intoxicating, filling the air with freshness.",
            "A hint of petrichor adds to the sensory experience, evoking the beauty of nature."
          ],
          "mood": "serene yet foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The muted light creates a somber atmosphere, shadows lengthening among the foliage.",
            "The colors appear less vibrant, as if drained by the grey skies above."
          ],
          "sounds": [
            "A gentle breeze rustles the leaves, creating a soft whisper that seems to carry secrets.",
            "The distant sound of rain can be heard, a reminder of the storm looming on the horizon."
          ],
          "smells": [
            "The earthy scent of damp soil mingles with the sweet aroma of flowers, creating a complex olfactory tapestry.",
            "A hint of decay lingers in the air, a reminder of the garden's wildness."
          ],
          "mood": "mysterious"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The setting sun casts a golden hue over the garden, illuminating the flowers and creating a magical atmosphere.",
            "Fireflies begin to flicker, adding a touch of enchantment to the twilight."
          ],
          "sounds": [
            "The gentle hum of evening insects fills the air, creating a symphony of nature's sounds.",
            "The soft rustle of leaves in the breeze adds to the tranquility of the space."
          ],
          "smells": [
            "The sweet scent of jasmine intensifies as night falls, wrapping around the garden like a warm embrace.",
            "The cool evening air carries the fragrance of blooming flowers, creating an intoxicating bouquet."
          ],
          "mood": "romantic yet tense"
        }
      ],
      "paragraphs": [
        "The Secret Garden, a hidden enclave behind tall hedges, is a sanctuary of wildflowers and untamed vines, offering a moment of respite from the formality of the manor. A rusted wrought-iron bench sits beneath a sprawling oak tree, its surface cool and inviting, perfect for quiet reflection or clandestine meetings. The vibrant colors of the flowers contrast sharply with the deep green of the hedges, creating a stunning visual tapestry that beckons exploration. Yet, the garden is a place of secrets, where whispers of past rendezvous linger in the air, and the shadows seem to conceal more than mere plants.",
        "As guests venture into this secluded space, the gentle rustling of leaves creates a soothing melody, interrupted only by the occasional chirp of a bird or the distant sound of rain. The sweet fragrance of blooming flowers mingles with the earthy scent of damp soil, evoking a sense of tranquility that belies the tension brewing within the manor. Here, amid the overgrown beauty, the garden holds its breath, waiting for the moment when secrets will be unveiled, and the truth will finally emerge from the shadows."
      ]
    }
  ],
  "note": "",
  "cost": 0.0032689172999999998,
  "durationMs": 73358
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1936,
    "month": "August",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "August",
    "weather": [
      "overcast with sporadic rain showers",
      "humidity in the air",
      "cool breezes from the sea"
    ],
    "daylight": "Long summer days with sunset around 8:30 PM, but the overcast skies often cast a gloomy shadow.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, just as the last light fades.",
    "holidays": [
      "August Bank Holiday (first Monday of August)"
    ],
    "seasonalActivities": [
      "garden parties and picnics",
      "hiking in the countryside",
      "attending cricket matches"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored three-piece suits in grey or navy",
        "crisp white dress shirts",
        "fedoras or flat caps"
      ],
      "casual": [
        "lightweight linen trousers",
        "short-sleeved shirts",
        "canvas shoes"
      ],
      "accessories": [
        "silk ties",
        "pocket watches",
        "cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dresses with floral patterns",
        "cloche hats adorned with ribbons",
        "pearl necklaces"
      ],
      "casual": [
        "light cotton blouses",
        "A-line skirts",
        "comfortable pumps"
      ],
      "accessories": [
        "handbags in leather",
        "delicate gloves",
        "stylish brooches"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco designs in architecture and fashion",
      "Hollywood glamour influencing casual wear",
      "the rise of sportswear for women"
    ],
    "socialExpectations": [
      "men expected to wear hats outdoors",
      "women should maintain modesty in clothing",
      "class distinctions highly visible in attire"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Olympic Games in Berlin showcasing Nazi Germany",
      "political upheaval in Spain with the Spanish Civil War beginning",
      "growing tensions in Europe as fascism rises"
    ],
    "politicalClimate": "Increasing political tension across Europe, with the threat of war looming due to fascist regimes gaining power.",
    "economicConditions": "Lingering effects of the Great Depression leading to widespread unemployment and economic struggle.",
    "socialIssues": [
      "class conflict fueled by economic disparity",
      "debates on women's suffrage and rights",
      "racial tensions exacerbated by extremist movements"
    ],
    "internationalNews": [
      "Hitler's military expansion plans",
      "British concerns over the rise of fascism in Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'The Way You Look Tonight' by Fred Astaire",
        "'In the Mood' by Glenn Miller",
        "swing and jazz music gaining popularity"
      ],
      "films": [
        "'Modern Times' starring Charlie Chaplin",
        "'The Great Ziegfeld'",
        "'Snow White and the Seven Dwarfs' (upcoming)"
      ],
      "theater": [
        "'Jubilee' at the Lyric Theatre",
        "'The Royal Family' by George S. Kaufman"
      ],
      "radio": [
        "BBC News broadcasts",
        "various musical programs featuring jazz and swing",
        "comedy shows like 'In Town Tonight'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Gone with the Wind' by Margaret Mitchell",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Glass Key' by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "romantic novels",
        "social critiques of class and politics"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first practical television broadcasts",
        "improved home radios",
        "advancements in aeronautics"
      ],
      "commonDevices": [
        "typewriters for correspondence",
        "telephones with party lines",
        "radio receivers in common areas"
      ],
      "emergingTrends": [
        "increased home ownership due to economic recovery",
        "rise of consumerism in urban areas",
        "growing fascination with automobiles"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: six pence",
        "Cup of tea in a café: two pence"
      ],
      "commonActivities": [
        "visiting local markets",
        "attending summer fairs",
        "participating in community sports events"
      ],
      "socialRituals": [
        "Sunday family gatherings",
        "weekly visits to the local pub",
        "afternoon tea served at 4 PM"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "strong class distinctions are expected",
      "upper classes maintain a sense of superiority",
      "working classes face prejudice"
    ],
    "gender": [
      "women increasingly seek independence",
      "traditional gender roles still prevalent",
      "discussion on women’s rights is contentious"
    ],
    "race": [
      "racial prejudices are common",
      "rising fascism influences attitudes towards minorities",
      "colonial attitudes persist"
    ],
    "generalNorms": [
      "decorum is highly valued in social settings",
      "conformity to societal roles is expected",
      "public behavior reflects class status"
    ]
  },
  "atmosphericDetails": [
    "The heavy scent of damp earth after rain mingled with the floral aromas of the garden.",
    "The sound of distant thunder rumbles, reverberating through the manor, stirring unease among the guests.",
    "The flickering of dim gas lamps creates shadows that dance ominously across the drawing-room walls."
  ],
  "paragraphs": [
    "On a typical August evening in 1936, the English countryside is shrouded in a blanket of overcast skies, punctuated by occasional rain showers that leave the air thick with humidity. The landscape is lush, yet the dreary weather casts a pallor over the manor house where the guests gather, whispering secrets and glancing furtively at one another. As the sun sinks behind the clouds, the atmosphere grows tense, a palpable sense of unease enveloping the gathering. This is a time of social upheaval, where class tensions simmer beneath the surface, and the recent Olympic Games in Berlin only add to the nervous energy in the air.",
    "Fashionably, the guests of the manor reflect the prevailing trends of the mid-1930s. The men don tailored three-piece suits, their crisp white shirts peeking out under well-fitted jackets, while flat caps rest atop their heads as they discuss current affairs. Women are adorned in elegant tea dresses, the fabric soft against their skin, while their cloche hats and pearl necklaces add a touch of refinement. Yet, the weight of societal expectations is felt in their attire, each stitch and accessory a nod to the rigid class structures they inhabit.",
    "Daily life in this era is marked by a blend of tradition and modernity. As guests sip their tea, they engage in light conversations about the latest films or the rising popularity of swing music. The sounds of a radio broadcasting a popular comedy show drift through the air, a reminder of the technological advancements that have begun to permeate everyday life. Yet, the echoes of the Great Depression linger, and conversations often shift to the economic struggles faced by many, a stark contrast to the opulence of the manor. The rituals of afternoon tea and evening gatherings serve as a veneer of normalcy, even as the specter of political unrest looms large in the background."
  ],
  "note": "",
  "cost": 0.00107656065,
  "durationMs": 19409
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the Voss estate for a family meeting on inheritance amidst rising class tensions and political unease draws together heirs, staff, and outsiders, each harboring secrets that could unravel their fates.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class divisions, creating a volatile atmosphere among the wealthy residents and their staff, with political discussions influenced by the rise of fascism."
  },
  "setting": {
    "location": "A sprawling country estate in the British countryside, surrounded by gardens and secluded from the nearest town.",
    "institution": "Manor house",
    "weather": "Overcast with occasional rain showers, typical of autumn."
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
    "id": "scheduled_time",
    "value": "a quarter past eleven",
    "description": "The time noted for the victim's meeting"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past eleven when Eleanor is found.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This establishes the time when Eleanor was discovered.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "This suggests that the time of death could be misrepresented if the clock was tampered with.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the assumption that the clock's time is accurate.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock was recently wound back, as evidenced by fresh tool marks.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This indicates potential manipulation of the clock's time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Witnesses report hearing the clock strike at eleven, but the clock shows a different time.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This discrepancy suggests the clock may have been altered.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "This indicates intentional tampering, altering the perceived timeline.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This contradicts the assumption that the clock's time was unaltered.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_eleanor_voss",
      "category": "behavioral",
      "description": "Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was attending a medical conference at the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This corroborates his alibi and rules him out as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_core_elimination_chain_2",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at a charity event during the time of the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This corroborates his alibi and rules him out as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_4",
      "category": "physical",
      "description": "Fingerprints were found on the clock's casing.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "This could link a suspect to the manipulation of the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "behavioral",
      "description": "Eleanor Voss was known to have financial motives related to an inheritance.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This suggests a motive for the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "A confrontation is staged where all suspects are questioned about their whereabouts during the alleged time of the murder.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "This helps establish timelines and alibis.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "testimonial",
      "description": "Beatrice Quill claims she heard the clock chime at eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "This supports the timeline of events.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "Witnesses report hearing the clock strike at eleven, but the clock shows a different time.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This discrepancy further implies intentional manipulation of the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Eleanor seemed to be in the study at the time indicated by the eleanor.",
      "supportsAssumption": "Eleanor was killed at a time indicated by the clock.",
      "misdirection": "This misleads the reader into thinking the eleanor's time is accurate."
    },
    {
      "id": "rh_2",
      "description": "Witnesses recall Eleanor was killed shortly after the killed struck eleven.",
      "supportsAssumption": "Eleanor was killed at a time indicated by the clock.",
      "misdirection": "This misleads the reader into believing the seemed is correct."
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
      "clue_1"
    ],
    "mid": [
      "clue_2",
      "clue_3",
      "clue_culprit_direct_eleanor_voss",
      "clue_core_elimination_chain",
      "clue_core_elimination_chain_2",
      "clue_4",
      "clue_5",
      "clue_6",
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
  "latencyMs": 8761,
  "cost": 0.0029563379999999998
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
