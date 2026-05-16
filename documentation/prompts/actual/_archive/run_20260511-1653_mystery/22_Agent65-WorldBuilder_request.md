# Actual Prompt Record

- Run ID: `mystery-1778518410355`
- Project ID: ``
- Timestamp: `2026-05-11T16:59:22.352Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `1c03762b15e54fc4`

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
    "title": "The Clock Strikes Murder",
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
      "subtype": "mechanical clock tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "public_persona": "A wealthy heiress known for her charitable works.",
      "private_secret": "In debt due to poor investments.",
      "motive_seed": "Financial desperation",
      "motive_strength": "high",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "manor grounds"
      ],
      "behavioral_tells": [
        "Nervous when discussing finances"
      ],
      "stakes": "Her life and reputation.",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss",
        "Captain Ivor Hale"
      ],
      "public_persona": "A respected physician with a calm demeanor.",
      "private_secret": "Has a crush on Eleanor.",
      "motive_seed": "Jealousy and unrequited love.",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM - 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "manor grounds"
      ],
      "behavioral_tells": [
        "Fidgety when discussing Eleanor's relationships"
      ],
      "stakes": "His reputation and unrequited feelings.",
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
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss",
        "Dr. Mallory Finch"
      ],
      "public_persona": "A charming army officer with a mysterious past.",
      "private_secret": "Has gambling debts.",
      "motive_seed": "Financial gain from Eleanor's death.",
      "motive_strength": "high",
      "alibi_window": "9:15 PM - 10:15 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "manor grounds"
      ],
      "behavioral_tells": [
        "Evasive when questioned about finances"
      ],
      "stakes": "Avoiding debt collectors.",
      "evidence_sensitivity": [
        "high"
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
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "public_persona": "A sharp-witted investigator known for her keen observations.",
      "private_secret": "Struggles with self-doubt.",
      "motive_seed": "A desire to prove herself.",
      "motive_strength": "high",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [
        "manor grounds"
      ],
      "behavioral_tells": [
        "Confident in her deductions"
      ],
      "stakes": "Her career and reputation.",
      "evidence_sensitivity": [
        "medium"
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
      "summary": "During a stormy evening at a grand manor, heiress Eleanor Voss is found dead, her time of death obscured by a tampered clock. Detective Beatrice Quill must navigate class tensions and deception to reveal the true culprit behind the murder."
    },
    "accepted_facts": [
      "Eleanor Voss was found dead in the library.",
      "The clock showed a time inconsistent with witness accounts.",
      "It was a stormy night with intermittent rain."
    ],
    "inferred_conclusions": [
      "The time of death is likely manipulated.",
      "The murderer had access to the clock."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on the clock's tampering to mislead the timeline of events.",
      "delivery_path": [
        {
          "step": "The clock was tampered with just before the murder."
        },
        {
          "step": "Witnesses saw the murderer elsewhere at the time the clock indicated."
        }
      ]
    },
    "outcome": {
      "result": "The murderer is revealed through the manipulation of time."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred at the time shown on the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock was in the room and seemed accurate, leading everyone to trust its time.",
    "what_it_hides": "The clock was deliberately reset to mislead witnesses and investigators."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The clock stopped just before Eleanor's body was found.",
        "Witnesses claim to have seen Captain Hale in the garden."
      ],
      "windows": [
        "Eleanor was last seen at 9:00 PM.",
        "The murder was reported at 10:00 PM."
      ],
      "contradictions": [
        "The clock time was 9:30 PM when found, conflicting with Hale's alibi."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Dr. Mallory Finch"
      ],
      "objects": [
        "The clock in the library",
        "Eleanor's diary"
      ],
      "permissions": [
        "As guests, all had access to the library."
      ]
    },
    "physical": {
      "laws": [
        "Time is a measurable constant.",
        "Mechanical clocks can be tampered with."
      ],
      "traces": [
        "Scratch marks on the clock's winding mechanism."
      ]
    },
    "social": {
      "trust_channels": [
        "Witnesses trust the clock's time."
      ],
      "authority_sources": [
        "Dr. Mallory Finch's medical expertise."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the library shows the time as nine-thirty.",
        "correction": "The clock was stopped and tampered with to mislead.",
        "effect": "Eliminates the reliability of the clock as a time source.",
        "required_evidence": [
          "The clock had stopped just before the murder was discovered.",
          "A faint scratch mark on the clock's winding mechanism.",
          "Witnesses claim the clock was not functioning properly.",
          "The clock's time was inconsistent with the weather report."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses report seeing Captain Hale in the garden at nine-forty-five.",
        "correction": "The timeline shows he could not have been in the library at the time of death.",
        "effect": "Narrows the timeline of opportunity to Dr. Mallory Finch.",
        "required_evidence": [
          "Witness accounts of Hale's location.",
          "Eleanor's diary shows she was last seen alone.",
          "The time of Hale's sighting conflicts with the clock's indication.",
          "Witnesses confirm Hale was not near the library."
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock's time conflicts with the witness statements.",
        "correction": "The tampering of the clock indicates premeditated deceit.",
        "effect": "Narrows suspects to Captain Hale and Dr. Finch.",
        "required_evidence": [
          "Conflicting witness accounts about the clock time.",
          "A guest's watch shows a conflicting time.",
          "Eleanor's diary notes the time she saw Hale.",
          "Witnesses report the clock's time did not match their watches."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, account, and library against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are the tampered clock and conflicting witness statements.",
    "pass_condition": "If the clock's time is proven inaccurate, it will eliminate Hale's alibi.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_fp_contradiction_step_3_2"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The tampered clock evidence (early) and the witness's conflicting testimony (mid) lead the reader to question the clock's reliability. Step 2: The witness accounts and Eleanor's diary clarify the timeline of events, eliminating Hale's alibi. Step 3: The clock's discrepancies become the focus during the trap test, conclusively proving Hale's guilt."
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
        "Observe the clock's time against a reliable source",
        "Draw conclusion about Hale's guilt"
      ],
      "test_type": "timing test"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her medical report time shows she was attending to Eleanor."
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Eleanor is the victim."
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of the tampered clock."
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
        "delivery_method": "Direct observation of the clock."
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
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
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness statements regarding Hale's location."
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "A guest's watch showing conflicting time."
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
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
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3_2",
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
    "summary": "Eleanor Voss is a charming socialite whose public persona of philanthropy masks a desperate financial situation. As debts mount, her fear of exposure drives her actions in a world where status is everything.",
    "publicPersona": "Charming benefactor known for her lavish charity balls.",
    "privateSecret": "Deeply in debt, she uses her social events to hide her financial struggles.",
    "motiveSeed": "Eleanor needs to maintain her social standing, which is threatened by the victim's plan to expose her financial troubles.",
    "motiveStrength": "strong",
    "alibiWindow": "was in the garden from eight until ten",
    "accessPlausibility": "easy",
    "stakes": "If the victim survives, her social reputation and access to high society will vanish.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with an airy elegance, often punctuating her sentences with a subtle sarcasm that reveals her sharp wit. She has a tendency to overemphasize her charm, using flowery language that can turn pointed when discussing her rivals.",
    "internalConflict": "Eleanor grapples with the fear of losing her social stature and the façade she has built around her life, knowing that the truth could unravel everything.",
    "personalStakeInCase": "This crime matters to Eleanor because her entire existence hinges on her social standing, and exposure could lead to her downfall.",
    "paragraphs": [
      "Eleanor Voss glided through the garden, her laughter ringing like chimes in the evening air, masking the turmoil that churned beneath her polished surface. To the world, she was a benevolent benefactor, hosting charity balls that glittered with opulence. Yet, behind that charming smile lay a woman on the brink, drowning in debt and desperation. Each event was not merely a social gathering; it was a lifeline thrown to keep her afloat in a society that valued wealth over authenticity.",
      "The whispers of Little Middleton had begun to weave tales that threatened her carefully curated image. The victim, with their insidious plans to expose Eleanor's financial woes, loomed like a specter over her social calendar. She had to maintain control, to ensure that the glittering façade remained unbroken. The thought of social ostracism sent shivers down her spine, igniting a fierce determination to protect what little she had left.",
      "Eleanor's interactions were laced with a polite savagery; she wielded her charm like a weapon, often punctuating her conversations with barbs disguised as compliments. 'Oh, darling, I simply adored your last exhibition! Such... interesting choices,' she would say, her smile betraying nothing of the disdain she felt. She had mastered the art of social climbing, but the higher she climbed, the more precarious her position became. Her heart raced at the thought of losing it all; she would do anything to prevent that.",
      "As the clock struck the hour, Eleanor's mind raced with possibilities, each more desperate than the last. She envisioned a world where her secrets remained buried, and her position remained unchallenged. However, deep down, she knew that the truth was a relentless tide, one that could sweep away her illusions at any moment. In a society where status was paramount, Eleanor Voss found herself at a crossroads: to cling to her ambitions or to confront the reality of her situation, a decision that would shape her fate in ways she could scarcely imagine."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a dedicated veterinarian whose passion for wildlife conservation is overshadowed by her simmering resentment towards the victim. As her professional future hangs in the balance, she must confront her ambitions and the ethical dilemmas they present.",
    "publicPersona": "Respected animal doctor with a passion for wildlife conservation.",
    "privateSecret": "Harbors resentment towards the victim for undermining her career and reputation.",
    "motiveSeed": "The victim publicly belittled Mallory's work, threatening her position in the community.",
    "motiveStrength": "moderate",
    "alibiWindow": "attended a dinner with the staff from seven until ten",
    "accessPlausibility": "possible",
    "stakes": "Her professional future is at stake if the victim continues to sabotage her.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a measured tone, often pausing to choose her words carefully. Her wit is dry, emerging in subtle remarks that reflect her intelligence, and she occasionally slips into passionate rants when discussing animal rights.",
    "internalConflict": "Mallory struggles with the desire for recognition and the ethical implications of her ambition, questioning whether her professional aspirations justify her resentment.",
    "personalStakeInCase": "This crime matters to Mallory because her reputation as a veterinarian is on the line, and she cannot afford to be undermined any further.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her clinic, the scent of antiseptic mingling with the soft sounds of animals in need. She was a passionate veterinarian, known for her dedication to wildlife conservation, yet her heart bore the weight of resentment towards a certain socialite who had made it her mission to belittle Mallory's work. The victim's public disparagement had not only bruised her pride but also threatened her standing in the community, a precarious position for someone who had fought so hard to be respected.",
      "At the recent dinner with her staff, Mallory had masked her anger behind polite smiles and laughter, all the while simmering with thoughts of revenge. 'Isn't it delightful how some people can be so oblivious to their own ignorance?' she had quipped, her words laced with a dry wit that reflected her frustration. Yet, deep down, she grappled with a moral conundrum: was it right to entertain such vengeful thoughts? Was she becoming the very thing she despised?",
      "Her professional future hung in the balance, teetering on the edge of a knife. The victim's influence was a dark cloud looming over her aspirations, and Mallory felt the pressure mounting. She was determined to prove herself, to rise above the petty squabbles of social hierarchy. But with each passing day, her ambition began to feel more like a curse than a blessing, as she wrestled with the ethical implications of her desire for recognition.",
      "As the clock chimed in the distance, Mallory reflected on her choices. She could no longer afford to allow her rival's actions to dictate her future. The stakes were high, and she knew that confronting the victim might lead to the resolution she craved, but at what cost? In a world rife with jealousy and ambition, she was forced to confront not only her professional rival but also the darker corners of her own heart."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer haunted by his past, struggling with PTSD and the threat of exposure. As the victim threatens to unveil his darkest secrets, he must confront his inner demons and seek redemption.",
    "publicPersona": "A war hero admired for his bravery, yet burdened by past traumas.",
    "privateSecret": "Is struggling with PTSD and feels displaced in a changing society.",
    "motiveSeed": "The victim was planning to expose Hale's past war crimes, which would ruin him.",
    "motiveStrength": "compelling",
    "alibiWindow": "was in the library reading from eight until ten",
    "accessPlausibility": "unlikely",
    "stakes": "His honor and dignity are on the line; exposure could lead to social ostracism.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Hale speaks with a gravitas that reflects his military background, often punctuating his sentences with self-deprecating humor. He has a tendency to ramble when discussing his past, revealing his inner turmoil and regrets.",
    "internalConflict": "Hale is plagued by guilt over his past actions and the fear of being exposed, struggling to reconcile his former heroism with the man he has become.",
    "personalStakeInCase": "This crime matters to Hale because his past is at risk of being uncovered, threatening not only his dignity but also his place in society.",
    "paragraphs": [
      "Captain Ivor Hale sat in the library, surrounded by tomes that spoke of valor and honor, yet his heart was heavy with the weight of his past. A retired naval officer hailed as a hero, he now found himself haunted by the ghosts of his decisions made long ago. The victim, with their insidious plans to expose the war crimes that had scarred his soul, loomed over him like a dark cloud, threatening to unravel the fragile peace he had fought so hard to achieve.",
      "He often spoke of his experiences in a self-deprecating manner, as if to shield himself from the judgment of others. 'Ah, the glory of war, they say! It’s all fun and games until you find yourself the villain in your own story,' he would quip, masking his pain behind a facade of humor. But the laughter never reached his eyes; those were filled with regret and the lingering shadows of PTSD that still clung to him, a constant reminder of the battle that raged within.",
      "The stakes had never been higher. If the truth came to light, Hale feared he would be stripped of his honor and dignity, cast aside by the very society that once lauded him as a hero. The thought sent shivers down his spine, igniting a desperate need for redemption that he couldn’t quite grasp. Could he confront the victim and silence their threat, or would he be forced to live with the consequences of his past actions?",
      "As the clock ticked away the seconds, Hale pondered his choices. He stood at a crossroads, where the path to redemption lay shrouded in uncertainty. In a world that had little room for the flawed, he was faced with the harsh reality of his own humanity. Would he find the courage to confront the shadows of his past, or would he remain a prisoner of his own making, forever haunted by the specters of war?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious secretary whose dedication to her work is complicated by her secret relationship with the victim's ex-partner. As she navigates her loyalties, she must decide between ambition and personal connections.",
    "publicPersona": "Eager and hardworking assistant, admired for her dedication.",
    "privateSecret": "Has been secretly dating the victim's ex-partner, complicating her loyalties.",
    "motiveSeed": "Beatrice feels threatened by the victim's influence on her career progression.",
    "motiveStrength": "weak",
    "alibiWindow": "was in the kitchen helping prepare dinner from six until nine",
    "accessPlausibility": "easy",
    "stakes": "Her job is at risk if the victim disrupts her plans for promotion.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a casual, friendly tone, often laced with sardonic humor. She has a tendency to drop playful jabs at her colleagues, revealing her sharp tongue and quick wit.",
    "internalConflict": "Beatrice experiences a tug-of-war between her ambition and her feelings for the victim's ex-partner, leading to a crisis of loyalty.",
    "personalStakeInCase": "This crime matters to Beatrice because her career aspirations are at risk, and she is torn between her loyalty to her job and her personal life.",
    "paragraphs": [
      "Beatrice Quill moved through the kitchen with the grace of someone who knew her way around both the pots and the politics of Little Middleton. As the eager secretary of the victim, she was admired for her dedication, yet beneath her cheerful demeanor lay a tangled web of loyalties. Her secret relationship with the victim's ex-partner added a layer of complexity to her life, one that threatened to unravel at any moment, much like the soufflé she was currently whipping up.",
      "With a sardonic twist of her lips, Beatrice often found humor in the chaos around her. 'Isn’t it delightful how some people can turn a simple dinner into a battleground?' she would say, rolling her eyes at her colleagues while deftly dodging their attempts to gossip. Her quick wit was her armor, allowing her to navigate the treacherous waters of office politics while keeping her true feelings cleverly concealed.",
      "Despite her jovial exterior, Beatrice felt the pressure mounting as the victim’s influence loomed large over her career aspirations. She had worked tirelessly to climb the ranks, only to feel the ground shift beneath her feet with the victim's every word. The stakes were high; if the victim continued to undermine her, her dreams of promotion could slip away like sand through her fingers. Yet, how could she betray someone she cared for, even if it was in silence?",
      "As the clock ticked away the minutes, Beatrice found herself at a crossroads, torn between her ambition and her heart. She longed for the recognition that came with career advancement, but the weight of her secret relationship added a layer of conflict that was hard to ignore. Could she find a way to balance her professional aspirations with the emotional ties that bound her, or would she have to choose one over the other in a game where the stakes were life and death?"
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Holloway Manor",
    "type": "Manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Holloway Manor stands as a grand relic of a more prosperous time, its opulent halls now steeped in tension and whispers of discontent.",
    "visualDescription": "The manor's façade, a blend of crumbling stone and ivy-clad walls, towers against the slate-grey sky, while its expansive grounds stretch out like an unkempt garden of secrets, dotted with aged oaks and a dilapidated fountain.",
    "atmosphere": "A palpable sense of dread lingers in the air, as if the very walls are holding their breath, waiting for the next tragedy to unfold.",
    "paragraphs": [
      "Holloway Manor rises dramatically from the mist-shrouded hills of Little Middleton, its stone walls weathered by countless seasons yet still echoing the grandeur of its former glory. The central staircase, an ornate structure of dark mahogany, spirals elegantly upwards, flanked by ancestral portraits whose eyes seem to follow every movement, as if judging the present against the weight of the past. Each room, with its heavy drapes and muted tapestries, feels like a time capsule, preserving not just the elegance of a bygone era but also the deepening shadows of despair brought on by the Great Depression. Outside, the expansive grounds, once vibrant with laughter and life, are now overrun with wild grass, the fountain long dry, creating a stark contrast to the laughter that used to echo through the halls.",
      "As the overcast sky looms above, a chill seeps into the air, wrapping around the manor like a shroud. The intermittent rain taps against the leaded windows, a constant reminder of the world outside, where economic struggles and class tensions are brewing like a storm. Inside, the thick carpets muffle footsteps, enhancing the oppressive silence that reigns in the manor, broken only by the occasional creak of old wood or the distant murmur of a radio, its crackling voice a stark contrast to the stillness. The lingering scent of damp stone and polished wood mixes with the faint aroma of tobacco, remnants of late-night conversations that never quite reached closure.",
      "With each passing hour, the atmosphere grows heavier, the tension palpable as the clock ticks ominously in the background, counting down to an unknown fate. The guests, once lively and animated in their discussions, now exchange furtive glances, the weight of unspoken fears settling between them like a thick fog. Holloway Manor, with its grand architecture and sprawling grounds, becomes a character in its own right, a silent witness to the unfolding drama that threatens to unravel the very fabric of its existence. As the shadows lengthen and night descends, the manor transforms, its dark corners becoming hiding places for secrets, each room a potential stage for betrayal and revelation."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical for a rural estate in the fall.",
    "timeFlow": "Days of mounting tension culminate in a fateful evening, where every tick of the clock feels charged with impending doom.",
    "mood": "Tense and foreboding, heightened by recent economic struggles and political unrest.",
    "eraMarkers": [
      "Domestic telephones in the drawing room and study, ringing with urgent messages.",
      "A vintage typewriter in the library, its keys clicking away as letters are composed.",
      "A radio receiver in the corner of the drawing room, broadcasting news of the outside world."
    ],
    "sensoryPalette": {
      "dominant": "The scent of damp stone and mildew mixes with the remnants of tobacco smoke, creating an oppressive atmosphere.",
      "secondary": [
        "The soft murmur of rain against leaded windows, a constant reminder of the storm outside.",
        "The creaking of floorboards underfoot, echoing through the silent halls."
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of damp stone and mildew, mixing with the lingering traces of tobacco smoke from late-night conversations. Outside, the soft murmur of rain against the leaded windows creates a rhythmic backdrop, punctuated by the occasional creak of the manor’s ancient timbers. This is a place where secrets fester, where the weight of years hangs heavy in the air, and the shadows seem to whisper of things better left unspoken.",
      "Inside Holloway Manor, every corner is steeped in history, the faded grandeur of the past clinging to the walls like a long-forgotten memory. The atmosphere is thick with tension, each room holding its breath as the clock ticks ominously, counting down to an inevitable confrontation. As the rain patters against the windows, the manor becomes a cocoon of unease, where the outside world fades away, leaving only the pulse of mystery and the specter of dread."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The drawing room is adorned with heavy drapes and an ornate chandelier, casting flickering shadows across the plush carpets. A grand piano sits silently in the corner, its keys untouched and gathering dust, while a low table bears the remnants of a half-finished game of chess.",
      "sensoryDetails": {
        "sights": [
          "The drawing room is dominated by a large bay window, its glass streaked with rain, offering a view of the overgrown gardens beyond.",
          "Richly patterned wallpaper, tarnished with age, frames the room, while the flickering light from the fireplace casts dancing shadows on the walls."
        ],
        "sounds": [
          "The rain taps rhythmically against the window, a soft, persistent reminder of the storm outside.",
          "Occasional creaks from the floorboards echo through the room, as if the manor itself is sighing under the weight of its secrets."
        ],
        "smells": [
          "The musty scent of damp fabric mingles with the faint aroma of polished wood, remnants of a once-inviting atmosphere now steeped in unease.",
          "A hint of burnt tobacco lingers in the air, a ghostly reminder of the heated discussions that have taken place within these walls."
        ],
        "tactile": [
          "The plush carpet feels thick and warm underfoot, contrasting with the chill in the air from the open window.",
          "The smooth surface of the chess pieces is cool to the touch, their glossy finish reflecting the dim light of the room."
        ]
      },
      "accessControl": "The drawing room is accessible to all guests but remains under close watch by the household staff, especially after the recent incident. Unauthorized entry is frowned upon, and access is typically granted during social hours only.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the edges of the bay window, distorting the view of the garden beyond.",
            "The dim light filters through the heavy drapes, casting a muted glow over the room."
          ],
          "sounds": [
            "The steady drumming of rain on the roof creates a soothing yet melancholic symphony.",
            "The distant sound of thunder rumbles softly, adding to the oppressive atmosphere."
          ],
          "smells": [
            "The scent of wet earth wafts in through the slightly ajar window, mingling with the mustiness of the room.",
            "A hint of mildew rises from the corners, a reminder of the manor's age and neglect."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is awash in flat, grey light, with shadows pooling in the corners like forgotten memories.",
            "Dust motes dance lazily in the air, illuminated by the weak sun peeking through the clouds."
          ],
          "sounds": [
            "The silence is broken only by the occasional creak of the old house settling, a reminder of its long history.",
            "The quiet ticking of the grandfather clock in the corner keeps time in the stillness."
          ],
          "smells": [
            "The faint scent of beeswax lingers from the polished furniture, creating a sense of nostalgia.",
            "A whiff of damp wood adds to the atmosphere, hinting at the rain-soaked world outside."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the walls, casting long shadows that seem to dance with a life of their own.",
            "The room is bathed in a warm glow, contrasting sharply with the chill that settles in as night falls."
          ],
          "sounds": [
            "The distant sound of laughter from the dining room echoes softly, a reminder of the social gatherings that once filled the manor.",
            "The quiet rustle of evening attire as guests settle into their seats creates an atmosphere of anticipation."
          ],
          "smells": [
            "The rich scent of candle wax fills the air, mingling with the aroma of freshly brewed tea from the adjacent room.",
            "A hint of tobacco smoke drifts in from the fireplace, adding a layer of complexity to the evening's atmosphere."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room, a once-grand space, now feels like a stage set for a tragedy. Heavy drapes hang limply at the windows, their rich fabric faded and worn, while the flickering light from the fireplace casts a warm glow that does little to dispel the chill in the air. The remnants of a chess game lie scattered on the low table, pieces frozen in time, as if the players vanished mid-move, leaving behind a palpable tension that lingers like a ghost. Outside, the rain continues its relentless patter against the window, creating a soft, melancholic rhythm that envelops the room, a stark contrast to the growing unease among the guests gathered within.",
        "As the clock strikes the hour, its chime echoes through the manor, a haunting reminder of the time that slips away. The air is thick with the scent of damp wood and polished surfaces, mingling with the faint aroma of tobacco, remnants of whispered conversations and secrets shared in hushed tones. Each creak of the floorboards sounds like a whispered warning, as if the manor itself is alive, holding its breath, waiting for the truth to surface from the shadows."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The library is a cavernous room filled with towering shelves of books, their spines cracked and faded, while a large oak table sits in the center, strewn with papers and an old typewriter.",
      "sensoryDetails": {
        "sights": [
          "Dust motes float lazily in the air, illuminated by the soft glow of a brass lamp perched on the table.",
          "The rich mahogany shelves, lined with an array of leather-bound books, create an imposing backdrop that speaks to the wealth of knowledge contained within."
        ],
        "sounds": [
          "The soft rustle of pages turning is almost reverent, a sound that echoes in the vastness of the room.",
          "The occasional drip of water from a leaky pipe above adds a rhythmic, albeit unwelcome, soundtrack to the otherwise serene atmosphere."
        ],
        "smells": [
          "The musty scent of old paper and leather fills the air, a comforting aroma that speaks of stories long forgotten.",
          "A faint whiff of tobacco lingers, hinting at the late-night reading sessions that have taken place in this sanctuary."
        ],
        "tactile": [
          "The smooth surface of the oak table feels cool to the touch, its grain rich and inviting, while scattered papers crinkle under gentle fingers.",
          "The leather bindings of the books are worn and soft, a testament to years of handling and love."
        ]
      },
      "accessControl": "The library is generally open to guests during the day but is locked at night. Access is limited to those with a specific interest in the manor’s history or those seeking refuge from the storm outside.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the windowpanes, creating a rhythmic pattern that adds to the library's ambiance.",
            "The dim light struggles to penetrate the cloud cover, casting the room in a soft, muted glow."
          ],
          "sounds": [
            "The steady patter of rain against the roof creates a soothing backdrop, lulling the mind into a contemplative state.",
            "The occasional drip from the leaky pipe provides a gentle counterpoint to the rainfall."
          ],
          "smells": [
            "The scent of wet paper mixes with the mustiness of the room, creating a unique olfactory signature.",
            "A hint of damp wood adds to the overall atmosphere, reinforcing the feeling of age."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is bathed in a grey light, shadows deepening in the corners, creating an air of mystery.",
            "Bookshelves loom like sentinels, their contents obscured in the dimness."
          ],
          "sounds": [
            "The quiet rustling of pages turning fills the silence, as if the books themselves are whispering secrets.",
            "The faint ticking of a clock in the corner reminds all of the passage of time."
          ],
          "smells": [
            "The rich aroma of aged leather and paper fills the air, a comforting yet haunting reminder of the knowledge contained within.",
            "A slight hint of mildew creeps in from the dampness, adding a layer of complexity to the scent."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of a lamp casts a golden light over the pages of an open book, illuminating the details of the text.",
            "Outside, the last rays of sunlight filter through the trees, creating a beautiful contrast against the darkening sky."
          ],
          "sounds": [
            "The distant sound of laughter from the drawing room filters in, a reminder of life beyond the library's quiet walls.",
            "The soft crackle of a fire in the hearth adds warmth and comfort to the space."
          ],
          "smells": [
            "The comforting scent of fresh paper and ink fills the air, mingling with the faint aroma of wood smoke from the fireplace.",
            "A hint of polished furniture wax lingers, a testament to the care taken to preserve the room's elegance."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary of knowledge, stands in stark contrast to the tension that permeates the rest of the manor. Towering shelves filled with leather-bound tomes loom overhead, their spines cracked and faded from years of reverent handling. An oak table sits at the center, cluttered with papers and an old typewriter, a testament to the late-night musings of its previous occupants. Dust motes dance in the air, illuminated by the golden glow of a brass lamp, creating an ethereal quality that feels almost otherworldly, as if the room itself is alive with secrets waiting to be uncovered.",
        "As rain patters softly against the windowpanes, the scent of old paper and leather fills the air, wrapping around visitors like a comforting embrace. The quiet rustle of pages turning echoes within the vastness, a reminder of the stories that have been told and the mysteries that remain hidden. Each creak of the floorboards underfoot adds to the atmosphere, a gentle reminder that even amidst the silence, the manor holds its breath, waiting for the truth to emerge from the shadows."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The servants' hall is a modest space, filled with simple wooden furniture and a long table where the staff gather for meals, the walls adorned with practical hooks and shelves for supplies.",
      "sensoryDetails": {
        "sights": [
          "The room is illuminated by a single overhead light, casting a harsh glow over the worn wooden surfaces and the faces of the gathered staff.",
          "A large fireplace occupies one wall, its hearth filled with embers that flicker and pop, providing both warmth and a focal point for the room."
        ],
        "sounds": [
          "The clatter of dishes and the murmur of conversation fill the air, creating a lively atmosphere that contrasts sharply with the tension in the main house.",
          "The crackling of the fire adds a comforting backdrop to the chatter, punctuating the conversations with its rhythmic sounds."
        ],
        "smells": [
          "The aroma of hearty stew simmers on the stove, filling the room with a savory scent that promises warmth and sustenance.",
          "A hint of coal smoke wafts in from the fireplace, mingling with the smell of cooking food, creating a homely yet utilitarian atmosphere."
        ],
        "tactile": [
          "The rough wooden table feels solid under the hands, its surface scarred from years of use, each mark telling a story of shared meals and laughter.",
          "The chilly air from the drafty windows contrasts with the warmth radiating from the fire, creating a cozy yet brisk environment."
        ]
      },
      "accessControl": "The servants' hall is accessible to all staff, with limited access for guests during meal times. It serves as a space for the household staff to gather, share news, and escape the pressures of their duties.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "The dull light filtering through the small windows casts a greyish hue over the room, enhancing the somber mood.",
            "Dishes are piled high in the sink, remnants of breakfast still clinging to them."
          ],
          "sounds": [
            "The sound of rain drumming against the roof creates a steady rhythm that fills the hall with a sense of urgency.",
            "The occasional shout from the kitchen disrupts the quiet, a reminder of the bustling activity that surrounds the staff."
          ],
          "smells": [
            "The scent of wet earth wafts in from the open window, mingling with the aroma of cooking food.",
            "A hint of mildew lingers in the corners, a reminder of the manor's age."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is filled with a muted light, shadows deepening in the corners, making the space feel smaller and more confined.",
            "Staff members sit together, their faces drawn and weary from the day's work."
          ],
          "sounds": [
            "The quiet hum of conversation fills the air, punctuated by the occasional laughter that feels forced amid the tension.",
            "The crackle of the fire provides a comforting yet somber backdrop, reminding all of the warmth that is often lacking outside."
          ],
          "smells": [
            "The rich aroma of stew simmering on the stove fills the air, promising a warm meal but also reminding everyone of the hard work that lies ahead.",
            "A faint scent of coal smoke wafts in from the fireplace, creating a cozy yet utilitarian atmosphere."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of the fire casts flickering shadows on the walls, creating a cozy yet intimate atmosphere.",
            "The table is set with simple dishes, a stark contrast to the opulence of the main dining room."
          ],
          "sounds": [
            "Laughter and chatter fill the air, creating a lively atmosphere that feels almost festive.",
            "The crackling of the fire punctuates the conversations, adding a rhythmic backdrop to the lively exchanges."
          ],
          "smells": [
            "The comforting aroma of freshly baked bread fills the air, mingling with the savory scent of stew simmering on the stove.",
            "A hint of smoke from the fireplace adds warmth to the atmosphere, reinforcing the feeling of a home, albeit a humble one."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The servants' hall, a modest yet vibrant space, buzzes with life as the household staff gather for their evening meal. Simple wooden furniture fills the room, the long table laden with hearty fare, while the walls are adorned with practical hooks and shelves, a testament to the industrious nature of those who work within the manor. The warmth from the fireplace draws everyone closer, the flickering flames casting an inviting glow that contrasts sharply with the tension brewing in the main house. Conversations flow freely, laughter punctuating the air, providing a brief respite from the pressures of their daily duties.",
        "As the fire crackles, the aroma of stew wafts through the room, mingling with the scent of coal smoke, creating a homey yet utilitarian atmosphere. The clatter of dishes and the murmur of conversation form a lively backdrop, a stark contrast to the oppressive silence of Holloway Manor. Here, in this gathering space, the staff share stories, laughter, and the occasional secret, unaware that their camaraderie may soon be tested by the events unfolding just beyond the door."
      ]
    },
    {
      "id": "garden",
      "name": "The Overgrown Garden",
      "type": "exterior",
      "purpose": "Clue discovery and exploration",
      "visualDetails": "The garden is a sprawling expanse of wildflowers and untamed hedges, the once meticulously manicured paths now choked with weeds and brambles, creating a maze of greenery.",
      "sensoryDetails": {
        "sights": [
          "Wildflowers bloom in vibrant colors, their beauty contrasting sharply with the neglect that surrounds them.",
          "The once-proud fountain stands silent, surrounded by overgrown grass and tangled vines that twist around its base."
        ],
        "sounds": [
          "The rustling of leaves in the breeze creates a soft whisper, as if the garden itself is alive with secrets.",
          "The distant sound of thunder rumbles ominously, a reminder of the brewing storm that hangs overhead."
        ],
        "smells": [
          "The sweet scent of blooming flowers mixes with the earthy aroma of damp soil, creating a rich olfactory tapestry.",
          "A hint of decay lingers in the air, a reminder of the garden's neglect and the passage of time."
        ],
        "tactile": [
          "The rough texture of the overgrown paths feels uneven underfoot, a stark reminder of the garden's wild state.",
          "The cool breeze carries a hint of moisture, refreshing yet tinged with the scent of decay."
        ]
      },
      "accessControl": "The garden is accessible to all guests, but its overgrown state makes exploration treacherous. Staff are often tasked with maintaining the area, but the wild growth presents challenges.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the petals of flowers, sparkling in the muted light like tiny jewels.",
            "The ground is slick and muddy, making the path treacherous underfoot."
          ],
          "sounds": [
            "The sound of rain tapping against the leaves creates a soothing yet melancholic melody.",
            "The distant rumble of thunder adds a sense of urgency to the morning's explorations."
          ],
          "smells": [
            "The scent of wet earth fills the air, mingling with the fresh aroma of rain-soaked flowers.",
            "A hint of mildew from the dampness seeps through, a reminder of the garden's neglected state."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The garden is shrouded in a grey light, the colors of the flowers muted and somber.",
            "Shadows deepen in the corners, creating an air of mystery that hangs over the space."
          ],
          "sounds": [
            "The soft rustle of leaves in the breeze adds to the eerie atmosphere, as if the garden is holding its breath.",
            "The distant sound of a clock chiming reminds all of the passage of time."
          ],
          "smells": [
            "The rich, earthy scent of damp soil fills the air, mingling with the sweet aroma of flowers that still fight for life.",
            "A faint whiff of decay lingers, a reminder of the garden's wildness."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The setting sun casts a warm glow over the garden, illuminating the vibrant colors of the flowers.",
            "A gentle breeze stirs the leaves, creating a soft rustling that feels almost alive."
          ],
          "sounds": [
            "The distant call of birds settling in for the night fills the air, adding a layer of tranquility to the space.",
            "The soft whisper of the wind through the trees creates a soothing backdrop to the evening's exploration."
          ],
          "smells": [
            "The sweet fragrance of blooming flowers fills the air, a stark contrast to the decay that lingers.",
            "The scent of fresh grass and damp earth combines to create a refreshing atmosphere."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The overgrown garden sprawls out like an untamed wilderness, a stark reminder of the manor's former glory now lost to time. Wildflowers bloom in defiance of the neglect, their vibrant colors standing out against the drab backdrop of tangled hedges and brambles. The once-proud fountain, now a mere shadow of its former self, is surrounded by overgrown grass, its water long since dried up, leaving behind a haunting silence. As the wind rustles the leaves, it carries with it the whispers of secrets long buried, creating an atmosphere thick with anticipation and mystery.",
        "In the dim light of the overcast afternoon, the garden takes on an eerie quality, shadows deepening in the corners, creating a sense of foreboding. The sweet scent of blooming flowers mixes with the earthy aroma of damp soil, a reminder of the life that still fights to exist amidst the decay. Each step into this wild expanse feels like a venture into the unknown, where every rustle of leaves and distant rumble of thunder echoes with the promise of revelation—or danger."
      ]
    }
  ],
  "note": "",
  "cost": 0.0034190805,
  "durationMs": 54556
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1935,
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
      "chilly winds"
    ],
    "daylight": "Short days with early dusk; daylight fades around 4 PM.",
    "time_of_day_of_crime": "Late evening — between eight and ten o'clock at night, as the household settles in for the night.",
    "holidays": [
      "Christmas"
    ],
    "seasonalActivities": [
      "decorating the Christmas tree",
      "attending local church services",
      "holiday gatherings with family"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool suit",
        "double-breasted overcoat",
        "cravat or silk tie"
      ],
      "casual": [
        "corduroy trousers",
        "herringbone patterned jacket",
        "knitted sweater"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant evening gown with a cinched waist",
        "fur coat",
        "beaded clutch purse"
      ],
      "casual": [
        "tea-length dress",
        "cardigan with a shawl collar",
        "high-waisted skirt"
      ],
      "accessories": [
        "cloche hat",
        "string of pearls",
        "silk scarf"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in fashion",
      "the popularity of Hollywood glamour",
      "use of bold patterns and colors"
    ],
    "socialExpectations": [
      "men are expected to dress formally for evening events",
      "women should be modest yet fashionable",
      "social status reflected in clothing choices"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "growing tensions in Europe with the rise of fascism",
      "increased unemployment rates as the Great Depression continues",
      "debates in the British Parliament over unemployment relief policies"
    ],
    "politicalClimate": "A climate of uncertainty, with rising fascism abroad causing concern among the British public and increased scrutiny of domestic policies.",
    "economicConditions": "The Great Depression's effects are still felt deeply, with many families struggling financially and relying on local charities for support.",
    "socialIssues": [
      "hunger and poverty",
      "class divisions becoming more pronounced",
      "debates around women's rights and suffrage"
    ],
    "internationalNews": [
      "Nazi Germany's militarization and aggressive foreign policies",
      "Italy's invasion of Ethiopia",
      "the 1935 Geneva Disarmament Conference"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Benny Goodman",
        "Duke Ellington",
        "Ella Fitzgerald"
      ],
      "films": [
        "The 39 Steps",
        "Mutiny on the Bounty",
        "Top Hat"
      ],
      "theater": [
        "Porgy and Bess",
        "The Front Page",
        "The Glass Menagerie"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "Major Bowes' Original Amateur Hour"
      ]
    },
    "literature": {
      "recentPublications": [
        "Brave New World by Aldous Huxley",
        "Murder in the Cathedral by T.S. Eliot",
        "The Maltese Falcon by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery",
        "social realism",
        "science fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the television prototype",
        "the electric refrigerator",
        "the automatic washing machine"
      ],
      "commonDevices": [
        "domestic telephones",
        "typewriters",
        "radio receivers"
      ],
      "emergingTrends": [
        "increased use of household appliances",
        "growing popularity of cinema",
        "advent of early computer technology"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Pound of butter: one shilling",
        "Movie ticket: six pence"
      ],
      "commonActivities": [
        "family gatherings during the holiday season",
        "visiting local markets",
        "attending church services"
      ],
      "socialRituals": [
        "Christmas dinners with extended family",
        "charity drives for the less fortunate",
        "New Year's Eve celebrations"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased awareness of class disparities",
      "a sense of solidarity among the working class"
    ],
    "gender": [
      "traditional gender roles still prevalent",
      "emerging discussions on women's rights"
    ],
    "race": [
      "racial tensions in urban areas",
      "growing awareness of racial equality issues"
    ],
    "generalNorms": [
      "conformity to societal expectations",
      "importance of family and community ties",
      "emphasis on personal responsibility"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of damp earth and wood smoke, a hallmark of the chilly December nights.",
    "The sound of rain pattering against the window panes creates a tense backdrop as shadows loom in the flickering candlelight.",
    "The manor's grand halls, adorned with holly and mistletoe, echo with hushed whispers and unease, hinting at secrets waiting to be uncovered."
  ],
  "paragraphs": [
    "In December 1935, the rural estate stands cloaked in the dreary embrace of winter, with overcast skies and intermittent rain setting an ominous tone. The short daylight hours force the inhabitants to retreat indoors, where the warmth of the hearth is a stark contrast to the chill outside. The looming Christmas holiday brings a mix of joy and tension as families attempt to maintain traditions amidst the struggles of the Great Depression. Seasonal activities such as decorating the Christmas tree and attending local church services become vital to fostering community spirit, even as shadows of despair lurk in the corners.",
    "The fashion of the time reflects both the desire for elegance and the constraints of economic reality. Men don tailored wool suits with double-breasted overcoats, while women embrace the glamour of the season with elegant evening gowns cinched at the waist, complemented by fur coats and beaded accessories. This period marks the height of Art Deco influences, showcasing bold patterns and colors that highlight the wearer's social status, a detail not lost on the discerning eyes of the manor's elite. Social expectations dictate that both men and women dress to impress during evening gatherings, reinforcing the class distinctions that permeate society.",
    "Daily life in December 1935 is marked by a palpable tension as the nation grapples with the impacts of the Great Depression. The prices of essentials like bread and butter remind families of their precarious financial situations, while social rituals such as Christmas dinners and charity drives provide moments of respite and connection. Traditional gender roles remain strong, with men expected to be the breadwinners and women managing the household. However, conversations around women's rights are beginning to surface, hinting at the changes that might be on the horizon. As the clock strikes and the evening unfolds, the manor's inhabitants find themselves ensnared in a web of secrets, set against a backdrop of social and political unrest."
  ],
  "note": "",
  "cost": 0.0025702413,
  "durationMs": 30921
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "The looming threat of financial ruin and political unrest draws a disparate group to the manor for a tense gathering, where secrets and class tensions simmer beneath the surface.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression intensifies class disparities and social pressures, as the privileged navigate their declining fortunes while grappling with the rise of fascism."
  },
  "setting": {
    "location": "A grand country estate featuring large rooms, a central staircase, and numerous guest quarters, surrounded by expansive grounds.",
    "institution": "Manor house",
    "weather": "Overcast with intermittent rain, typical for a rural estate in the fall."
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
    "id": "guest_watch_time",
    "value": "twenty minutes past eleven",
    "description": "The time displayed on a guest's watch, conflicting with the clock"
  },
  {
    "id": "murder_time",
    "value": "a quarter past eleven",
    "description": "The approximate time of death based on the coroner's estimation"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The mechanism relies on the clock's tampering to mislead the timeline of events.",
      "sourceInCML": "CASE.prose_requirements.clue_to_scene_mapping[0].clue_id",
      "pointsTo": "Reveals how the tampering affects the perceived timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock was stopped and tampered with to mislead.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Contradicts the assumption that the clock's time is accurate.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was seen in the town at the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Dr. Mallory Finch cannot be the murderer due to his alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the library shows the time as nine-thirty.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Establishes the time when the clock was found.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "testimonial",
      "description": "Witnesses report seeing Captain Hale in the garden at nine-forty-five.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Provides an alibi for Captain Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The timeline shows he could not have been in the library at the time of death.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "Contradicts Captain Hale's potential involvement.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The clock's time conflicts with the witness statements.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "Highlights discrepancies in the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "behavioral",
      "description": "Captain Ivor Hale had financial motives for Eleanor's death.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "Indicates premeditation on Hale's part.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "physical",
      "description": "Scratch marks on the clock's winding mechanism suggest tampering.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "Provides physical evidence of tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Beatrice Quill corroborates Hale's alibi.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Provides an alibi for Captain Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "The clock was found stopped just before Eleanor's body was discovered.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[2]",
      "pointsTo": "Indicates the clock's time is not reliable.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "behavioral",
      "description": "Captain Hale was seen acting suspiciously in the hours leading up to the murder.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "Suggests potential guilt.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "testimonial",
      "description": "Dr. Mallory Finch was attending a medical conference during the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Eliminates Dr. Mallory Finch as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "category": "temporal",
      "description": "Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "The mechanism relies on the clock's tampering to mislead the timeline of events.",
      "sourceInCML": "CASE.prose_requirements.clue_to_scene_mapping[0].clue_id",
      "pointsTo": "Reveals how the tampering affects the perceived timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "The clock stopped just before Eleanor's body was found. remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_3_2",
      "category": "temporal",
      "description": "The clock's time conflicts with the witness statements.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The tampering of the clock indicates premeditated deceit.",
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
      "clue_fp_contradiction_step_3"
    ],
    "mid": [
      "clue_core_elimination_chain",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_culprit_direct_captain_ivor_hale",
      "clue_fp_contradiction_step_3_2"
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
  "latencyMs": 14730,
  "cost": 0.0079265835
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
