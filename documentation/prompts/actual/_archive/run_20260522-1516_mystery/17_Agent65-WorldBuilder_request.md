# Actual Prompt Record

- Run ID: `mystery-1779462962541`
- Project ID: ``
- Timestamp: `2026-05-22T15:37:41.269Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `18f9b8a00fcc0c1d`

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
    "title": "The Clock's Deceit",
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
      "role_archetype": "Victim",
      "relationships": [],
      "public_persona": "A wealthy socialite known for her lavish parties.",
      "private_secret": "Had been secretly planning to leave her husband.",
      "motive_seed": "Financial independence",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Personal freedom",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Eleanor Voss (friend)"
      ],
      "public_persona": "A local physician with a reputation for competence.",
      "private_secret": "Has a hidden affair with Eleanor.",
      "motive_seed": "Desire to protect her from her husband",
      "motive_strength": "moderate",
      "alibi_window": "10:00 AM - 11:30 AM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical practice hours"
      ],
      "behavioral_tells": [
        "Nervous when discussing Eleanor's plans"
      ],
      "stakes": "Reputation and career",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Eleanor Voss (acquaintance)"
      ],
      "public_persona": "A retired military officer with a stern demeanor.",
      "private_secret": "Holds a grudge against Eleanor's family for a past slight.",
      "motive_seed": "Desire for revenge",
      "motive_strength": "low",
      "alibi_window": "10:30 AM - 11:15 AM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Evasive when asked about his whereabouts"
      ],
      "stakes": "Restoration of honor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Detective",
      "relationships": [
        "Eleanor Voss (friend)"
      ],
      "public_persona": "A sharp and observant investigator.",
      "private_secret": "Has a personal interest in the case due to her friendship with Eleanor.",
      "motive_seed": "Desire for justice",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Solving the case and honoring her friend",
      "evidence_sensitivity": [],
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
      "summary": "In the opulent surroundings of the Little Middleton manor, a wealthy socialite, Eleanor Voss, is found dead under mysterious circumstances. Tensions rise as old grievances surface, and the clock that allegedly marks the time of her death holds secrets that could unveil the truth."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock was tampered with to alter the perceived time of death.",
      "delivery_path": [
        {
          "step": "The clock was wound back to show a different time, misleading the investigation."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death contradicts the narrative established by the tampered clock."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss must have died just before the clock struck eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock chimed at that time, and witnesses corroborated its accuracy.",
    "what_it_hides": "The actual time of death was much earlier, hidden by the clock's tampering."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock's last recorded time",
        "Witness statements about timings"
      ],
      "windows": [
        "10:50 AM - 11:10 AM"
      ],
      "contradictions": [
        "Witnesses recall Eleanor was seen alive at 10:45 AM, but the clock says she died at 11:00 AM."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Mechanical clock",
        "Eleanor's drink"
      ],
      "permissions": [
        "Access to the study where the clock is located"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clock principles",
        "Time perception"
      ],
      "traces": [
        "Scratch marks on the clock indicating tampering"
      ]
    },
    "social": {
      "trust_channels": [
        "Friendship between Beatrice and Eleanor",
        "Professional trust in Dr. Finch"
      ],
      "authority_sources": [
        "Dr. Finch's medical authority",
        "Captain Hale's military history"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock's hands are stuck at ten minutes past eleven.",
        "correction": "The clock must have been tampered with since it shouldn't be stuck.",
        "effect": "Narrows the timeline of the murder.",
        "required_evidence": [
          "Witness statements about the clock's condition",
          "Physical examination showing the clock's hands do not move"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall Eleanor was seen alive at ten minutes to eleven.",
        "correction": "This contradicts the notion that she died at eleven.",
        "effect": "Eliminates the assumption of timing and narrows the suspects' alibis.",
        "required_evidence": [
          "Witness statement about Eleanor's last known whereabouts",
          "Clock's stuck hands indicating tampering"
        ],
        "reader_observable": true
      },
      {
        "observation": "A small scratch on the clock casing indicates tampering.",
        "correction": "The clock's tampering must have been done recently.",
        "effect": "Ties Dr. Mallory Finch to the scene due to his access.",
        "required_evidence": [
          "Physical inspection of the clock",
          "Dr. Finch's alibi timing"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the clock's condition with the maintenance log reveals discrepancies in the clock's recent history.",
    "knowledge_revealed": "The clock was last serviced a week before the murder, contradicting claims of recent tampering.",
    "pass_condition": "If the clock's tampering is proven to have occurred after the last service date, it implicates Dr. Mallory Finch.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_7",
      "clue_5",
      "clue_10"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's stuck hands (early) and witness statements about Eleanor's last sighting (mid) clarify the timing. Step 2: The scratch on the clock (mid) ties to Dr. Finch's access. Step 3: The clock's service log (discriminating test) reveals discrepancies that implicate Dr. Finch."
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
        "Analyze the clock's maintenance log",
        "Draw conclusion about guilt"
      ],
      "test_type": "comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proving his alibi with witness statements.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 6,
        "clearance_method": "Demonstrating his access lagged behind the clock's tampering.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 6,
        "clearance_method": "Alibi confirmed: none",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 7,
      "revelation_method": "Confrontation with evidence from the clock."
    },
    "identity_rules": [
      {
        "character_name": "Eleanor Voss",
        "revealed_in_act": 3,
        "before_reveal_reference": "the victim",
        "after_reveal_reference": "Eleanor"
      }
    ],
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_10",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Clock maintenance log"
      },
      {
        "clue_id": "clue_8",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
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
    "summary": "Eleanor Voss, a wealthy matriarch in her forties, is a charming socialite whose carefully curated life hides dark secrets that could jeopardize her family's legacy.",
    "publicPersona": "Eleanor is the epitome of grace, a hostess who delights in organizing charitable events and is often seen flitting from one social gathering to another, her laughter echoing through the halls of Little Middleton's elite. Her reputation as a pillar of the community is well-earned, yet it masks the turmoil lurking beneath the surface.",
    "privateSecret": "Unbeknownst to her friends and admirers, Eleanor has a past steeped in scandal that she has worked tirelessly to conceal. A former affair and the subsequent fallout could unravel her carefully constructed world, and the fear of exposure gnaws at her.",
    "motiveSeed": "The imminent threat posed by the victim's revelation about her past is a sword dangling over Eleanor's head, one that could sever the ties to her family's fortune and social standing—an outcome she simply cannot abide.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have been in her garden from six to seven, tending to her beloved roses, a peaceful refuge where she can momentarily escape the pressures of her life.",
    "accessPlausibility": "Her affluent status allows her easy access to both the victim and the surrounding social circles, making her presence at the scene of the crime plausible.",
    "stakes": "With her social reputation and family legacy hanging in the balance, Eleanor stands to lose everything she has worked for if her past comes to light.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a refined cadence, often punctuating her sentences with a soft chuckle that invites camaraderie. Her dialogue is laced with subtle jabs disguised as compliments, revealing a sharp wit beneath her genteel exterior.",
    "internalConflict": "Haunted by the specter of her past, Eleanor grapples with guilt and fear, torn between the desire to preserve her reputation and the need to confront the truth that could liberate her.",
    "personalStakeInCase": "This crime matters deeply to Eleanor, as it not only threatens her carefully crafted identity but also forces her to reckon with the choices that have shaped her life.",
    "paragraphs": [
      "Eleanor Voss stood amidst her roses, the fragrant blooms a stark contrast to the turmoil swirling within her. The garden, a sanctuary from the prying eyes of Little Middleton's elite, was where she sought refuge after a day filled with whispers of scandal. As the sun dipped below the horizon, casting a golden hue over her carefully manicured estate, she couldn't shake the feeling that the past was creeping back to haunt her, inching closer with every tick of the clock.",
      "Her laughter rang out at social gatherings, a melodic sound that masked the anxiety gnawing at her insides. Friends regarded her as the epitome of grace, a woman of charitable pursuits and refined tastes. Yet, beneath her charming exterior lay a tempest of secrets, the most damning of which threatened to surface with the impending revelation from the victim, whose very existence could unravel the fabric of her life. Eleanor couldn't afford to let that happen. Not now, not ever.",
      "As she pruned the delicate stems, Eleanor's thoughts turned to the victim. She had always been a thorn in Eleanor's side, a reminder of the choices that had led to her current predicament. The stakes were higher than ever; her family fortune, her social standing—all hinged on a fragile balance that could tip at any moment. The clock ticked ominously in the background, each sound a reminder that time was running out.",
      "Eleanor knew she had to confront her past, but the thought of facing the truth was suffocating. Would it be better to bury her secrets deeper, or could she find redemption in the ashes of her former life? As she wiped her hands on her apron, Eleanor resolved to protect her legacy at all costs, even if it meant stepping into the shadows she had long avoided."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a passionate physician in her thirties, embodies the spirit of progressivism, yet her hidden resentment towards the wealthy complicates her moral compass.",
    "publicPersona": "With an air of idealism, Dr. Finch is often seen championing the cause of the underprivileged, her fervor for social justice evident in her every word. She moves through the world with a sense of purpose, her dedication to her patients and causes earning her the respect of many in the community.",
    "privateSecret": "Beneath her altruistic facade lies a simmering resentment towards the affluent, born from her own childhood struggles. This bitterness sometimes clouds her judgment, leading her to question the motives of those she serves.",
    "motiveSeed": "The victim's impending expose of unethical practices within the local healthcare system threatens to tarnish Dr. Finch's reputation as a caring and progressive physician, a label she has fought hard to earn.",
    "motiveStrength": "moderate",
    "alibiWindow": "Dr. Finch asserts she was in her study reading from five to six, a time she claims was spent in the pursuit of knowledge rather than the machinations of the world beyond her door.",
    "accessPlausibility": "While her access to the victim may be limited, her position as a physician affords her a certain degree of leeway within the community, making her presence at the scene a possibility.",
    "stakes": "The threat to her reputation as a compassionate doctor weighs heavily on her, as she struggles to reconcile her ideals with the harsh realities of social class.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with a measured tone, often employing irony to make her points. Her sentences are carefully constructed, reflecting her analytical mind, yet a hint of sarcasm sometimes slips through when discussing the upper class.",
    "internalConflict": "Caught between her ideals and the harsh realities of her upbringing, Dr. Finch grapples with the resentment she feels towards the wealthy, questioning whether she can truly make a difference in a world rife with inequality.",
    "personalStakeInCase": "This crime matters to Dr. Finch because it threatens to expose the very system she has dedicated her life to improving, forcing her to confront the uncomfortable truths about the intersection of privilege and healthcare.",
    "paragraphs": [
      "Dr. Mallory Finch sat in her study, surrounded by stacks of medical journals and books on social reform, the scent of ink and paper filling the air. She was lost in thought, her mind racing as she considered the implications of the victim's potential revelations. The prospect of exposure loomed large, threatening to unravel the progress she had fought so hard to achieve in her practice. A doctor dedicated to change, yet faced with the reality that change often came at a cost.",
      "Her public persona as a progressive advocate for the underprivileged was a role she played well, but underneath it all was a simmering resentment towards those in power. Raised in hardship, Dr. Finch had seen firsthand the disparities that plagued the healthcare system, and it angered her to witness the privileged few exploit their positions while the masses suffered. It was a dichotomy she struggled to reconcile, and the victim's impending expose threatened to bring those issues to the forefront, jeopardizing her hard-won respect.",
      "With a sigh, she glanced at the clock on the wall, its hands ticking away the seconds with relentless precision. Time felt both a friend and a foe, a reminder that every moment brought her closer to a confrontation she dreaded. Would she have to choose between her ideals and the truth? Or could she find a way to navigate the murky waters of morality without losing herself in the process?",
      "As she prepared to leave her sanctuary, Dr. Finch resolved to keep her focus on her patients, the very reason she had entered medicine in the first place. But the specter of the victim's revelations loomed large, and she couldn't help but wonder if she would be forced to confront her own biases before the truth set her free."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer in his fifties, is a respected figure grappling with the ghosts of his past, including a dishonorable discharge that threatens to tarnish his legacy.",
    "publicPersona": "With a stern demeanor and a wealth of stories from his naval exploits, Captain Hale commands respect in Little Middleton. His tales of bravery and sacrifice are often met with admiration, but they mask a deep disillusionment with life after service.",
    "privateSecret": "Haunted by PTSD, Ivor struggles to connect with the changing world around him. The dishonorable discharge that marred his career is a source of shame that he hides from those who revere him.",
    "motiveSeed": "The victim's threat to expose Ivor's past could shatter the image he has worked to maintain, a revelation that would not only tarnish his legacy but also sever the respect he has garnered from his peers.",
    "motiveStrength": "compelling",
    "alibiWindow": "Ivor claims he was in the library reading from seven to eight, a solitary activity that reflects his preference for isolation in a world that feels increasingly alien to him.",
    "accessPlausibility": "His status as a retired officer grants him access to various social circles, yet his own disconnection from them makes it unlikely he would be seen at the center of such a scandal.",
    "stakes": "With his honor and respect in society at stake, Ivor faces the prospect of losing not just his reputation but also the very identity he has clung to since leaving the navy.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks in measured tones, often punctuating his sentences with a wry smile that betrays his self-doubt. His dialogue is peppered with nautical metaphors, a remnant of his past, though he often uses them to poke fun at his own predicament.",
    "internalConflict": "Ivor is torn between the man he was and the man he has become, grappling with the shame of his past decisions while longing for redemption in a world that no longer feels like home.",
    "personalStakeInCase": "This crime matters to Ivor because it threatens to expose his past mistakes, forcing him to confront the honor he once fought for and the man he has become.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the library's oak shelves, the scent of leather-bound books mingling with the faint aroma of pipe tobacco. The stories he had once shared with fervor now felt like distant echoes, reminders of a life lived at sea, far removed from the quiet discontent of his retirement. The clock ticked in the background, each sound a reminder of the weight of time and the secrets he carried like anchors weighing him down.",
      "In the eyes of the townsfolk, Ivor was a respected figure, a man whose naval exploits had earned him admiration. Yet, beneath that veneer lay a tumultuous sea of regret, the dishonorable discharge from the navy a constant reminder of his failures. The victim's threat to expose this part of his past struck a chord deep within him, a fear that threatened to unravel the identity he had spent years constructing.",
      "As he traced his fingers over the spines of the books, Ivor couldn't help but reflect on the irony of his situation. A man who had once navigated treacherous waters now found himself adrift in a world that had moved on without him. The isolation he felt was palpable, and the thought of facing the truth about his past was a tempest he was not sure he could weather.",
      "With a resigned sigh, Ivor prepared to confront the reality of the victim's revelations. The stakes were higher than ever; his honor, once the guiding principle of his life, now dangled precariously in the balance. He had to decide whether to confront his past or let it continue to haunt him, the clock ticking down to a reckoning he could no longer avoid."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious journalist in her twenties, embodies the spirit of modernity, yet her hidden affair threatens to unravel her burgeoning career.",
    "publicPersona": "Vibrant and full of life, Beatrice is seen as the voice of change in Little Middleton. Her journalistic pursuits often place her at the forefront of social issues, and her youthful enthusiasm is infectious.",
    "privateSecret": "Beneath her ambitious exterior lies a scandalous affair with a member of the upper class, a secret that could jeopardize her reputation should it come to light.",
    "motiveSeed": "The victim's impending expose of dealings that could damage Beatrice's career presents a double-edged sword, as her own secrets hang precariously in the balance.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice claims she was out on assignment from four to six, a plausible excuse that allows her to navigate the complexities of her life.",
    "accessPlausibility": "Her role as a journalist grants her access to various social circles, including that of the victim, making her presence at the scene a distinct possibility.",
    "stakes": "As her emerging career hangs in the balance, Beatrice must navigate the tension between her ambition and the moral implications of her work and personal life.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a lively cadence, often punctuating her thoughts with playful sarcasm. Her dialogue is peppered with quick quips, reflecting her youthful energy and sharp wit.",
    "internalConflict": "Caught between her ambition and the moral implications of her work, Beatrice struggles with the weight of her secrets, questioning whether her pursuit of success is worth the potential fallout.",
    "personalStakeInCase": "This crime matters to Beatrice because it threatens to expose her own secrets, forcing her to confront the ethical dilemmas of her profession and the personal choices she's made.",
    "paragraphs": [
      "Beatrice Quill sat at her typewriter, fingers poised over the keys as she contemplated the unfolding scandal that could shape her career. The bright afternoon sun streamed through the window, illuminating the clutter of notes and half-finished articles scattered around her. The clock on the wall ticked steadily, each sound a reminder of the urgency she felt in navigating a world filled with secrets and lies.",
      "As an ambitious journalist, Beatrice thrived on the thrill of uncovering the truth, her youthful exuberance evident in her every word. Yet, the victim's imminent expose posed a unique dilemma; it threatened not only her career but also her carefully guarded affair with a member of the upper class. The stakes felt impossibly high, and she couldn't shake the feeling that the walls were closing in around her.",
      "With a sardonic smile, Beatrice recalled her latest assignment, a piece that would shine a light on the very dealings the victim intended to unveil. The irony was not lost on her; she was on the precipice of a breakthrough, yet the prospect of her own secrets being exposed loomed like a dark cloud overhead. Would her ambition consume her, or could she navigate the treacherous waters of her dual life without losing herself?",
      "As she gathered her notes and prepared to leave, Beatrice resolved to confront the challenges ahead with the same tenacity that had fueled her career thus far. But the clock continued to tick, a constant reminder that time was not on her side, and she would need to tread carefully if she hoped to emerge unscathed from the storm that was brewing."
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
    "summary": "An opulent manor surrounded by formal gardens and expansive grounds, steeped in secrets and tensions.",
    "visualDescription": "Gothic arches and Georgian windows blend into a sprawling facade, cloaked in ivy. The manicured hedges of the garden lead to a fountain, now choked with autumn leaves.",
    "atmosphere": "A feeling of unease permeates every corner, as the grandeur of the estate contrasts sharply with the whispers of discontent among its inhabitants.",
    "paragraphs": [
      "Little Middleton Manor stands as a testament to the wealth of its owners, its towering spires and ornate moldings casting long shadows over the meticulously kept grounds. The air is thick with the scent of damp earth and decaying leaves, a prelude to the secrets that lie within. Formal gardens, once vibrant and alive, now seem to droop under the weight of the autumn sky, their colors muted like the conversations that echo through the manor's halls.",
      "Inside, the manor is a labyrinth of rooms, each steeped in history and heavy with the memories of generations. The drawing room, with its faded velvet drapes and overstuffed furniture, bears witness to hushed conversations and veiled glances. The flickering gas lamps cast dancing shadows upon the walls, hinting at the unease that simmers just beneath the surface of polite society. Here, beneath the veneer of elegance, lies a tension that threatens to unravel the very fabric of this family.",
      "As the rain begins to fall, the rhythmic patter against the windowpanes becomes a backdrop for whispered accusations and tense silences. The clock in the hallway ticks steadily, a reminder of the time slipping away, while outside, the expansive grounds feel more isolated, the trees swaying in the wind as if trying to listen in on the secrets shared within. Each room seems to harbor its own mysteries, with locked doors and hidden passages that beg to be explored.",
      "In the heart of the estate lies the library, a sanctuary of knowledge and a repository of family secrets. Dust motes dance in the slanting light, and the scent of old books mingles with the coldness of the stone walls. Here, the echoes of the past resonate, as characters from novels long forgotten seem to whisper their warnings to those who dare to seek the truth. With each turn of a page, the tension mounts, and the clock’s deceit looms ever closer, threatening to expose the hidden truths of Little Middleton."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical for an English countryside in the autumn.",
    "timeFlow": "Three days of mounting tension, leading to a climactic revelation.",
    "mood": "Tense and foreboding, with underlying class tensions and political discussions coloring interactions.",
    "eraMarkers": [
      "Petrol touring cars on winding country roads",
      "Typewriters clacking in the study",
      "Gas lamps flickering in shadowed corners"
    ],
    "sensoryPalette": {
      "dominant": "Damp earth and decaying leaves",
      "secondary": [
        "Flickering gas lamp light",
        "Whispers of discontent"
      ]
    },
    "paragraphs": [
      "The atmosphere of Little Middleton is thick with anticipation, as the overcast skies loom like a heavy curtain, ready to drop at any moment. The scent of damp earth permeates the air, mixing with the faint aroma of wood smoke from the hearths. Everything feels muted, as if the world outside has been drained of its color, leaving only shades of grey that reflect the tension simmering within the manor. The sound of distant thunder rumbles like a warning, echoing the unease that fills the hearts of its inhabitants.",
      "As the rain begins to patter against the windows, the manor transforms into a sanctuary of secrets. The rhythmic sound of raindrops creates a haunting melody, punctuated by the occasional creak of the old timbers settling under the weight of the storm. The flickering gas lamps cast a warm glow against the cold stone walls, but their light does little to chase away the chill that has settled into the very bones of the house. Each room, with its carefully curated decor, becomes a stage for deception, where every smile hides a potential betrayal."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Gathering space for guests and family",
      "visualDetails": "A lavish room with ornate furniture and heavy drapes, adorned with family portraits and hunting trophies.",
      "sensoryDetails": {
        "sights": [
          "faded velvet drapes",
          "portraits in gilt frames",
          "ornate fireplace with brass fittings"
        ],
        "sounds": [
          "crackling fire",
          "soft murmurs of conversation",
          "distant clock ticking"
        ],
        "smells": [
          "old leather furniture",
          "candle wax",
          "woodsmoke"
        ],
        "tactile": [
          "plush upholstery",
          "cool marble mantelpiece",
          "faded silk cushions"
        ]
      },
      "accessControl": "Accessible to guests during social hours, restricted to family after dinner.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-dappled window panes",
            "grey light filtering through drapes"
          ],
          "sounds": [
            "steady drumming on the roof",
            "soft patter against the glass"
          ],
          "smells": [
            "damp earth",
            "mildew",
            "cold stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light",
            "long shadows creeping across the floor"
          ],
          "sounds": [
            "silence broken by distant voices",
            "the creak of old wood"
          ],
          "smells": [
            "beeswax",
            "dust",
            "burnt wood"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on walls",
            "golden light spilling from windows"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "distant laughter from the dining room"
          ],
          "smells": [
            "candle wax",
            "freshly polished wood",
            "tobacco smoke"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room serves as the heart of Little Middleton, where guests gather beneath the watchful eyes of ancestral portraits. The heavy drapes, once vibrant, now hang like faded memories, lending an air of melancholy to the space. A crackling fire provides warmth, its glow flickering against the polished surfaces, while the scent of old leather and beeswax creates an intoxicating atmosphere. Conversations, laced with veiled meanings, flow like the wine in crystal glasses, each word carefully chosen, every glance a potential revelation.",
        "As evening descends, the drawing room transforms under the soft glow of gas lamps. Shadows dance upon the walls, and the air thickens with the scent of tobacco and freshly polished wood. The laughter from below stairs is muffled, a reminder of the class distinctions that still echo within these walls. Here, amidst the plush upholstery and fading elegance, the tension mounts, as secrets long buried threaten to rise again."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Clue discovery and refuge for the curious",
      "visualDetails": "A grand room lined with shelves of dusty books, with a large wooden desk at the center and a globe in the corner.",
      "sensoryDetails": {
        "sights": [
          "dusty shelves filled with leather-bound volumes",
          "globe with faded colors",
          "sunlight filtering through tall windows"
        ],
        "sounds": [
          "pages turning softly",
          "the ticking of a wall clock",
          "distant thunder rumbling"
        ],
        "smells": [
          "old paper and ink",
          "musty leather",
          "polished wood"
        ],
        "tactile": [
          "rough texture of aged books",
          "smooth surface of the desk",
          "coolness of the stone floor"
        ]
      },
      "accessControl": "Restricted to family and select guests; staff prohibited except during cleaning hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "raindrops on the window"
          ],
          "sounds": [
            "soft patter of rain",
            "the flutter of pages"
          ],
          "smells": [
            "damp paper",
            "wooden shelves",
            "cold stone"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping along the floor",
            "dust motes suspended in the air"
          ],
          "sounds": [
            "the ticking of a clock",
            "the rustle of paper"
          ],
          "smells": [
            "old books",
            "leather bindings",
            "faint whiff of ink"
          ],
          "mood": "reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light from a desk lamp",
            "long shadows cast by the globe"
          ],
          "sounds": [
            "the soft crackle of a fire",
            "whispers of the past"
          ],
          "smells": [
            "freshly polished wood",
            "the scent of old pages",
            "hint of tobacco"
          ],
          "mood": "mysterious"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary for the inquisitive, is filled with the scent of aged paper and leather, each book a portal to another world. Dust motes dance in the shafts of light that filter through tall windows, illuminating the rich mahogany shelves laden with volumes of forgotten lore. A large wooden desk sits at the center, its surface scattered with notes and half-finished letters, whispering of secrets waiting to be uncovered. The soft ticking of the clock echoes in the silence, a reminder that time is slipping away, while the distant rumble of thunder adds to the atmosphere of impending revelations.",
        "As the evening deepens, the library takes on a more intimate character, shadows stretching across the floor as the last rays of light fade. The warmth from the hearth beckons, and the scent of polished wood fills the air, mingling with the faint hint of tobacco that lingers from a previous occupant. Here, in this haven of knowledge, the tension mounts, as the clock's deceit looms ever closer, and the mysteries of Little Middleton await discovery."
      ]
    },
    {
      "id": "gardens",
      "name": "Formal Gardens",
      "type": "exterior",
      "purpose": "Setting for clandestine meetings and revealing conversations",
      "visualDetails": "Meticulously arranged flower beds and topiary, with a stone fountain at the center, surrounded by wrought iron benches.",
      "sensoryDetails": {
        "sights": [
          "neatly trimmed hedges",
          "faded blooms wilting in the autumn",
          "stone fountain choked with leaves"
        ],
        "sounds": [
          "rustling leaves in the breeze",
          "distant birdsong",
          "the trickle of water from the fountain"
        ],
        "smells": [
          "earthy dampness",
          "fading floral notes",
          "mossy stone"
        ],
        "tactile": [
          "cool stone of the fountain",
          "soft petals of dying flowers",
          "rough texture of hedge clippings"
        ]
      },
      "accessControl": "Open to guests during the day; off-limits at night unless accompanied by a family member.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "glistening leaves",
            "puddles forming on the path"
          ],
          "sounds": [
            "steady drip of rain",
            "soft rustle of wet foliage"
          ],
          "smells": [
            "fresh rain on earth",
            "damp moss",
            "wet stone"
          ],
          "mood": "reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey skies casting shadows",
            "faded colors of wilting flowers"
          ],
          "sounds": [
            "wind whispering through branches",
            "the distant rumble of thunder"
          ],
          "smells": [
            "earthy decay",
            "faint floral hints",
            "wet grass"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "twilight shadows lengthening",
            "stars beginning to peek through"
          ],
          "sounds": [
            "quiet chirping of crickets",
            "soft rustle of leaves"
          ],
          "smells": [
            "night-blooming flowers",
            "earthy scents of dusk",
            "cool breeze"
          ],
          "mood": "mysterious"
        }
      ],
      "paragraphs": [
        "The formal gardens of Little Middleton are a study in contrasts, meticulously arranged yet showing signs of decay as autumn takes hold. Neatly trimmed hedges stand sentinel over fading blooms, and the once-vibrant colors now seem muted, echoing the tensions that simmer within the manor. At the center, a stone fountain, choked with leaves, provides a gentle trickle of water that barely masks the whispers of secrets exchanged in the shadows. Here, amidst the beauty, lies a sense of foreboding, as clandestine meetings unfold under the watchful gaze of the moon.",
        "As evening descends, the gardens transform into a realm of mystery, where twilight shadows stretch and the air thickens with the scent of night-blooming flowers. The soft chirping of crickets fills the silence, creating an ambiance ripe for revelations. Guests tread lightly along the paths, their conversations hushed, as if the very earth beneath their feet might betray their secrets. In this secluded space, the clock's deceit echoes softly, reminding all who wander here that the truth is often hidden in plain sight."
      ]
    },
    {
      "id": "study",
      "name": "Study",
      "type": "interior",
      "purpose": "Private space for contemplation and clandestine plans",
      "visualDetails": "A dark-paneled room filled with books, a large desk with scattered papers, and a heavy leather chair.",
      "sensoryDetails": {
        "sights": [
          "dark wood paneling",
          "papers strewn across the desk",
          "a solitary lamp casting a warm glow"
        ],
        "sounds": [
          "soft scratching of a pen",
          "the ticking of a clock",
          "the rustle of paper"
        ],
        "smells": [
          "old books and ink",
          "polished wood",
          "the faint scent of tobacco"
        ],
        "tactile": [
          "smooth surface of the desk",
          "soft leather of the chair",
          "coolness of the stone floor"
        ]
      },
      "accessControl": "Private to family and select guests; staff forbidden without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft light filtering through clouds",
            "raindrops tracing patterns on the window"
          ],
          "sounds": [
            "steady drip of rain",
            "soft scratching of a pen"
          ],
          "smells": [
            "freshly brewed coffee",
            "damp paper",
            "old leather"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows deepening in corners",
            "papers fluttering in a draft"
          ],
          "sounds": [
            "the ticking of a clock",
            "the rustle of pages"
          ],
          "smells": [
            "old books",
            "the scent of ink",
            "wood polish"
          ],
          "mood": "reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of the desk lamp",
            "long shadows stretching across the floor"
          ],
          "sounds": [
            "the soft crackle of a fire",
            "the distant murmur of voices"
          ],
          "smells": [
            "freshly polished wood",
            "the scent of old pages",
            "hint of tobacco"
          ],
          "mood": "mysterious"
        }
      ],
      "paragraphs": [
        "The study is a haven of solitude, its dark wood paneling absorbing the light and lending an air of secrecy to its occupant. A large desk, cluttered with papers and half-finished letters, serves as a battleground for ideas and schemes. The soft scratching of a pen punctuates the silence, accompanied by the steady ticking of a clock that seems to mock the fleeting nature of time. The scent of old books and polished wood fills the air, wrapping around the senses like a comforting shroud, while the faint hint of tobacco lingers from previous musings.",
        "As evening approaches, the study takes on a more intimate atmosphere, the warm glow of the desk lamp casting flickering shadows across the room. The distant murmur of voices from the drawing room filters in, a reminder that the world outside continues to turn. In this sanctuary, however, the clock's deceit remains ever-present, urging its keeper to confront the truths that lie hidden among the pages of forgotten tomes."
      ]
    }
  ],
  "note": "",
  "cost": 0.00234643035,
  "durationMs": 157706
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
      "occasional rain",
      "chilly winds"
    ],
    "daylight": "Short daylight hours; dusk falls by four o'clock in the afternoon.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after a heavy dinner.",
    "holidays": [
      "Christmas",
      "Boxing Day"
    ],
    "seasonalActivities": [
      "attending holiday dances",
      "decorating the manor for Christmas",
      "hunting parties in the countryside"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool morning coat",
        "crisp white dress shirt",
        "silk tie"
      ],
      "casual": [
        "tweed jacket",
        "knitted pullover",
        "flannel trousers"
      ],
      "accessories": [
        "bowler hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "long-sleeved evening gown with beading",
        "faux fur stole",
        "wide-brimmed hat"
      ],
      "casual": [
        "knee-length wool skirt",
        "cashmere sweater",
        "knit beret"
      ],
      "accessories": [
        "string of pearls",
        "embroidered clutch bag",
        "silk scarf"
      ]
    },
    "trendsOfTheMoment": [
      "influence of Hollywood glamour",
      "popularity of Art Deco styles",
      "emergence of sportswear for women"
    ],
    "socialExpectations": [
      "strict adherence to class etiquette",
      "growing expectations for women's participation in social settings",
      "emphasis on family lineage and reputation"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "increased tensions in Europe with the rise of fascism",
      "debates in Parliament over unemployment relief",
      "the abdication crisis surrounding King Edward VIII"
    ],
    "politicalClimate": "A climate of uncertainty, with growing fears over the rise of totalitarian regimes in Europe influencing public sentiment.",
    "economicConditions": "Struggles from the Great Depression continue to affect the working class and heighten class distinctions.",
    "socialIssues": [
      "unemployment and poverty affecting the lower classes",
      "growing movements for women's rights",
      "racial tensions in urban areas"
    ],
    "internationalNews": [
      "Hitler's rearmament of Germany",
      "Italy's invasion of Ethiopia",
      "the establishment of the League of Nations' role in international diplomacy"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Cheek to Cheek' by Fred Astaire",
        "'The Way You Look Tonight' by Jerome Kern",
        "dance bands led by the likes of Ambrose"
      ],
      "films": [
        "'A Midsummer Night's Dream' (1935)",
        "'The 39 Steps' (1935)",
        "'Top Hat' (1935)"
      ],
      "theater": [
        "'Pygmalion' by George Bernard Shaw",
        "'The Royal Family' by George S. Kaufman"
      ],
      "radio": [
        "'The Shadow' program",
        "news broadcasts updating on political events",
        "popular variety shows featuring musical performances"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Gone with the Wind' by Margaret Mitchell",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'Brave New World' by Aldous Huxley"
      ],
      "popularGenres": [
        "mystery novels",
        "social commentaries",
        "romantic fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercially available television sets",
        "improved radio receivers",
        "the introduction of the electric washing machine"
      ],
      "commonDevices": [
        "typewriters for correspondence",
        "phonographs for music playback",
        "petrol cars for transport"
      ],
      "emergingTrends": [
        "increased use of radio for entertainment",
        "the rise of cinema as a primary entertainment source",
        "advent of home appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Pint of milk: two pence",
        "Cinema ticket: one shilling"
      ],
      "commonActivities": [
        "afternoon tea gatherings",
        "attending seasonal balls",
        "participating in local hunts"
      ],
      "socialRituals": [
        "sending Christmas cards to acquaintances",
        "hosting lavish holiday parties",
        "exchanging gifts on Christmas morning"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing resentment towards the upper classes",
      "increased solidarity among the working class",
      "expectation of deference to aristocracy"
    ],
    "gender": [
      "women increasingly seeking independence and careers",
      "traditional roles still prevalent in upper classes",
      "emerging acceptance of women’s suffrage activism"
    ],
    "race": [
      "racial tensions heightened by economic struggles",
      "social norms favoring white Anglo-Saxon Protestants",
      "growing awareness of racial equality movements"
    ],
    "generalNorms": [
      "strict adherence to social etiquette",
      "class distinctions influencing social interactions",
      "emphasis on propriety in public behavior"
    ]
  },
  "atmosphericDetails": [
    "The chill of December air clung to the heavy curtains, muffling the sounds of distant hounds and the crackle of the fireplace.",
    "The scent of pine and cinnamon wafted through the grand hall, a reminder of the festive decorations and the impending Christmas celebrations.",
    "The soft patter of rain against the windows created a somber backdrop, as whispers of political unrest colored the conversations around the dinner table."
  ],
  "paragraphs": [
    "In December 1935, the English countryside is draped in the gloom of winter, the overcast skies and occasional rain casting a pall over the grand country house estate. As the days grow shorter, the early dusk brings a sense of foreboding, with guests gathering around the roaring fire to escape the chill. The anticipation of Christmas fills the air, yet beneath the surface, the tensions of class and politics simmer, reflected in hushed conversations that dance around the topics of unemployment and the rise of fascism in Europe.",
    "Fashion during this period captures the elegance and complexity of the times. Men don tailored wool morning coats with crisp white dress shirts and silk ties, while women embrace the glamour of long-sleeved evening gowns adorned with intricate beading and faux fur stoles. The influence of Art Deco is evident in their accessories, from pearls to embroidered clutches, creating a visual tapestry that speaks to both wealth and the changing societal norms of the decade. The manor is alive with the sounds of holiday dances, as the residents don their finest attire to celebrate, all the while maintaining an air of propriety that underscores their social status.",
    "Daily life within the estate reflects the broader social dynamics of the era. Afternoon tea is a ritual, where conversations often drift towards the latest political developments and the plight of the working classes. As Christmas approaches, the estate buzzes with preparations: the staff scurry about decorating the grand hall, while the wealthy families engage in hunting parties and balls, oblivious to the struggles outside their gates. With a loaf of bread costing just four pence and cinema tickets at a shilling, the contrast between the upper classes and the working poor becomes starkly apparent, highlighting the growing discontent that permeates the air."
  ],
  "note": "",
  "cost": 0.0010756481999999999,
  "durationMs": 41455
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "An inheritance dispute amidst rising tensions from the Great Depression and political unrest forces a diverse group of manor residents to confront their class distinctions and hidden agendas under one roof.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class distinctions are stark among the manor's residents, with the wealthy grappling with the effects of the Great Depression while political discussions reflect the rising threat of fascism."
  },
  "setting": {
    "location": "A large manor house set in expansive grounds, featuring formal gardens and a mix of architectural styles.",
    "institution": "Country house estate",
    "weather": "Overcast with occasional rain, typical for an English countryside in the autumn."
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
      "description": "The clock's hands are stuck at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The clock is not functioning properly.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Witnesses recall Eleanor was seen alive at ten minutes to eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This contradicts the notion that she died at eleven.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "contradiction",
      "description": "This contradicts the notion that she died at eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The timeline of Eleanor's death is questionable.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "physical",
      "description": "A small scratch on the clock casing indicates tampering.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "The clock may have been altered.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "contradiction",
      "description": "The clock's tampering must have been done recently.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The clock should not be stuck if it was functioning.",
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
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at the pub until eleven fifteen in the morning.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale cannot be the murderer.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "Comparing the clock's condition with the maintenance log reveals discrepancies in the clock's recent history.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "The clock may have been altered recently.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "physical",
      "description": "A mechanical clock was tampered with to alter the perceived time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "The clock's mechanism is crucial to the timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "behavioral",
      "description": "Dr. Mallory Finch expressed a desire to protect Eleanor from her husband.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This indicates motive for Dr. Mallory Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "testimonial",
      "description": "Witnesses confirmed Eleanor was last seen alive shortly before the clock struck eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "The timeline of Eleanor's death is crucial.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "testimonial",
      "description": "Witnesses corroborated Eleanor's presence until shortly before eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "This supports the timeline against the clock's reading.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock's last recorded time remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "category": "temporal",
      "description": "The clock's hands are stuck at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The clock must have been tampered with since it shouldn't be stuck.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_2",
      "description": "Rumors suggest Eleanor was last seen with a drink in her hand, leading some to think she was poisoned.",
      "supportsAssumption": "Eleanor Voss must have died just before the clock struck eleven.",
      "misdirection": "This misleads by implying the drink is the cause of death, diverting attention from the clock's role."
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
      "clue_8",
      "clue_10",
      "clue_fp_contradiction_step_1"
    ],
    "mid": [
      "clue_4",
      "clue_5",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_6",
      "clue_7",
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
  "latencyMs": 123314,
  "cost": 0.00319683375
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
