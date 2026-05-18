# Actual Prompt Record

- Run ID: `mystery-1779051563990`
- Project ID: ``
- Timestamp: `2026-05-17T21:01:52.396Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `8ff942566348f0d6`

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
    "author": "Original Mystery Writer",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "country estate",
      "country": "England",
      "institution": "Manor house"
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
        "Dr. Mallory Finch: friend",
        "Captain Ivor Hale: acquaintance"
      ],
      "public_persona": "Wealthy heiress, charming hostess",
      "private_secret": "Financial troubles due to Great Depression",
      "motive_seed": "Inherit wealth",
      "motive_strength": "high",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Library",
        "Grand Hall"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Socially adept"
      ],
      "stakes": "Life and inheritance",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss: friend",
        "Beatrice Quill: acquaintance"
      ],
      "public_persona": "Reputable physician",
      "private_secret": "Discontent with career",
      "motive_seed": "Professional jealousy",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Library",
        "Study"
      ],
      "behavioral_tells": [
        "Nervous when discussing death",
        "Avoids eye contact"
      ],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss: acquaintance",
        "Dr. Mallory Finch: colleague"
      ],
      "public_persona": "Charming military officer",
      "private_secret": "In debt",
      "motive_seed": "Financial desperation",
      "motive_strength": "high",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Grand Hall",
        "Servants' Quarters"
      ],
      "behavioral_tells": [
        "Fidgety during questioning",
        "Overly polite"
      ],
      "stakes": "Financial stability",
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
        "Eleanor Voss: friend",
        "Dr. Mallory Finch: colleague"
      ],
      "public_persona": "Determined investigator",
      "private_secret": "Struggles with self-doubt",
      "motive_seed": "Justice for friend",
      "motive_strength": "high",
      "alibi_window": "n/a",
      "access_plausibility": "n/a",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Sharp intuition",
        "Analytical"
      ],
      "stakes": "Solve the murder",
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
      "summary": "During a stormy evening at a country estate, Eleanor Voss is found dead, with suspicions quickly turning towards her closest acquaintances. The investigation reveals a cleverly tampered clock that misleads the timeline of her death."
    },
    "accepted_facts": [
      "Eleanor Voss was found dead in the library.",
      "The clock in the library showed a different time than witness accounts."
    ],
    "inferred_conclusions": [
      "Eleanor's death was not as it seemed due to the clock tampering."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, library, and slightly to expose the false timing.",
      "delivery_path": [
        {
          "step": "The murderer tampered with the clock before the murder."
        },
        {
          "step": "This created a false timeline, misleading the investigation."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is established, implicating Dr. Mallory Finch."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss must have been alive for longer than indicated by the evidence.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses corroborated her presence in the library until shortly before the discovery of her body.",
    "what_it_hides": "The clock was tampered with to mislead the investigation."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "9:00 PM",
        "10:00 PM"
      ],
      "windows": [
        "9:00 PM to 10:00 PM"
      ],
      "contradictions": [
        "Clock shows 9:40 PM, but witnesses say they last saw Eleanor at 9:50 PM."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Library clock",
        "Eleanor's body"
      ],
      "permissions": [
        "Access to library during the murder window."
      ]
    },
    "physical": {
      "laws": [
        "Physical tampering of the clock is possible."
      ],
      "traces": [
        "Faint scratch on the clock casing indicating tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Friendship between Eleanor and Dr. Finch."
      ],
      "authority_sources": [
        "Dr. Finch's medical authority."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the library shows the hands are slightly askew.",
        "correction": "This suggests tampering occurred just before the murder.",
        "effect": "Narrows suspect pool to Dr. Mallory Finch, who has access to the clock.",
        "required_evidence": [
          "The clock hands were found slightly askew upon inspection.",
          "Witness noted Eleanor last seen alive at 9:50 PM."
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint scratch is found on the clock casing.",
        "correction": "This indicates recent manipulation of the clock mechanism.",
        "effect": "Eliminates Captain Ivor Hale, who had no reason to manipulate the clock.",
        "required_evidence": [
          "A faint scratch on the clock casing indicating tampering.",
          "Dr. Finch's access to the library during the murder window."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses say the clock struck a different time than their recollection.",
        "correction": "This discrepancy suggests the clock was altered to mislead.",
        "effect": "Confirms the time of death was much earlier than claimed.",
        "required_evidence": [
          "Witness testimony about the clock striking a different time.",
          "Eleanor's last known movements before her death."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the clock time with witness accounts reveals the tampering.",
    "knowledge_revealed": "The revealed facts are clock, library, and slightly.",
    "pass_condition": "Dr. Mallory Finch cannot explain the tampered clock time.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The askew clock hands indicate tampering, hinting at a false timeline. Step 2: The scratch on the clock casing eliminates one suspect. Step 3: Witness accounts contradict the clock time, revealing the truth."
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
        "Observe the clock's time and witness reactions",
        "Draw conclusion about Dr. Mallory Finch's guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Eliminated through lack of access to tampering.",
        "supporting_clues": [
          "The clock hands were found slightly askew upon inspection."
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 6,
        "clearance_method": "Victim cannot be the murderer.",
        "supporting_clues": []
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
        "delivery_method": "Direct observation of clock."
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Inspection of the clock's condition."
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness testimony about the time."
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
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Direct observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is the epitome of a gracious socialite, yet beneath her polished exterior lies a woman wrestling with financial turmoil and the fear of losing her family's legacy.",
    "publicPersona": "Eleanor presents herself as a gracious host, deeply involved in local charities and admired for her philanthropic efforts. Her gatherings are the highlight of Little Middleton's social calendar, where she effortlessly charms guests with her wit and warmth.",
    "privateSecret": "Despite her outward confidence, Eleanor conceals her financial struggles due to poor investments, which threaten her ability to maintain her estate and uphold the family name.",
    "motiveSeed": "Fears losing the estate to her more progressive children, who seem more interested in modern ideals than preserving their heritage.",
    "motiveStrength": "moderate",
    "alibiWindow": "Eleanor claims she was in the library with guests during the dinner, a detail she hopes will shield her from suspicion.",
    "accessPlausibility": "easy",
    "stakes": "She is determined to protect her family's legacy, believing that the estate is the cornerstone of her children's future, even if they don’t see it that way.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor's speech is marked by a refined cadence, often punctuated by soft laughter. She has a penchant for witty remarks that can disarm her interlocutors, using subtle barbs to maintain her social dominance.",
    "internalConflict": "Eleanor battles the guilt of her financial decisions, fearing that her inability to provide for her family might lead to their estrangement.",
    "personalStakeInCase": "This crime matters to Eleanor because the victim's estate is tied to her family's legacy, and its loss would mean losing the very essence of what she has built.",
    "paragraphs": [
      "Eleanor Voss stood on the terrace of her estate, the evening sun casting a golden hue over the meticulously manicured gardens. To the casual observer, she was the embodiment of grace, a socialite who had mastered the art of hosting. Yet, as she surveyed the laughter of her guests, a tightness gripped her heart. The laughter was a mask, one she wore so well that even she sometimes believed it. Behind the charm lay a woman acutely aware of the precariousness of her financial situation, a burden she carried in silence.",
      "Her thoughts drifted to her children, who seemed more enamored with progressive ideals than with the traditions she held dear. They spoke of change, of modernity, while she feared a future where the family estate, a symbol of their heritage, would slip through her fingers. What would they know of sacrifice, of the struggles that built their home? Her heart ached with the thought of losing not just the estate, but also the bond with her children, a bond she had fought to maintain through charity and community.",
      "Eleanor's sharp wit often masked the turmoil within. At dinner parties, she wielded her humour like a sword, deftly parrying questions about her investments with a smile that rarely reached her eyes. 'Oh, darling, the stock market is but a game of chance, and I am merely an enthusiastic player,' she would quip, her laughter mingling with the clinking of crystal glasses. It was a performance she had perfected, one that kept her guests enthralled while she buried her fears beneath layers of civility.",
      "Yet, as the clock ticked ominously in the background, she found herself drawn into a web of suspicion following the murder of a prominent figure in the community. The estate was now under scrutiny, and Eleanor's carefully constructed façade began to crack. The stakes had never been higher; if she lost the estate, she would lose her identity, her purpose, and perhaps her children’s respect. She had to protect her family, even if it meant confronting the truths she had long avoided."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a compassionate physician renowned for her progressive views, yet beneath her professional exterior lies a simmering resentment towards the wealthy patients she serves.",
    "publicPersona": "As a respected doctor in Little Middleton, Mallory is known for her dedication to her patients and her advocacy for healthcare reforms, often speaking passionately about the need for equitable access to medical care.",
    "privateSecret": "However, she harbors a deep-seated resentment towards wealthy patients who refuse to pay their medical bills, feeling that their privilege undermines the integrity of her practice.",
    "motiveSeed": "Believes the victim's estate could provide the funding necessary to keep her clinic open and expand her services to those in need.",
    "motiveStrength": "moderate",
    "alibiWindow": "Mallory claims she was attending to a patient in the village during the murder, a detail that could either clear her or further entangle her in suspicion.",
    "accessPlausibility": "possible",
    "stakes": "For Mallory, the stakes are high; the funding from the estate could mean the difference between keeping her clinic open or shutting its doors, leaving her patients without care.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks in a measured tone, often pausing for emphasis. Her dialogue is laced with irony, and she has a habit of raising an eyebrow when making a point, as if challenging her listener to keep up.",
    "internalConflict": "She grapples with her feelings of resentment, torn between her compassion for her patients and her disdain for the wealthy who take her services for granted.",
    "personalStakeInCase": "This crime matters to Mallory because the outcome could directly impact her clinic’s future; losing the estate to a competitor would mean losing her chance to provide equitable care.",
    "paragraphs": [
      "Dr. Mallory Finch was a woman of conviction, her passion for medicine rivaled only by her frustration with the healthcare system. As she walked through the bustling streets of Little Middleton, she could not help but notice the disparities that plagued her patients. Her clinic, a small but vital establishment, had become a sanctuary for those who could not afford the luxury of private healthcare. Yet, with every wealthy patient who refused to settle their bills, her heart grew heavier, and her spirit dimmed.",
      "In her mind, the estate of the recently murdered victim represented a lifeline, a potential source of funding that could keep her clinic afloat. 'Imagine,' she would say to her colleagues, 'a world where every patient receives the care they deserve, regardless of their bank balance.' But as she envisioned this utopia, a bitter taste lingered on her tongue. It was hard to reconcile her idealism with the reality of patients who viewed her as a mere service provider, their financial privilege a stark reminder of the inequality she fought against.",
      "Mallory’s dry wit often surfaced in the most unexpected moments, allowing her to navigate conversations with a blend of charm and irony. 'Ah, another visit from our esteemed hospital benefactor,' she would say, her eyebrow arching as she addressed a wealthy patient who had come in for a minor ailment. 'Let me guess, you’d like a prescription for your conscience as well?' Her humour was a shield, a way to cope with the frustration that simmered just beneath the surface.",
      "Yet, as the investigation unfolded following the murder, Mallory found herself entangled in a web of suspicion. Her alibi was solid, but the whispers of her ambitions floated through the air like the scent of antiseptic in her clinic. The stakes were high; if the estate were to fall into the wrong hands, her dreams of expanding her practice would vanish. She was torn between her professional integrity and her desire for financial stability, a conflict that threatened to overshadow her commitment to her patients."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer, respected for his tactical mind but haunted by a dishonorable discharge that casts a shadow over his otherwise commendable life.",
    "publicPersona": "With a stern demeanor and a penchant for discipline, Ivor is viewed as a respected figure in the community, often sought for his advice on matters of strategy and integrity.",
    "privateSecret": "However, he bears the burden of a dishonorable discharge from his naval career, a secret he has never shared, which gnaws at his sense of honor.",
    "motiveSeed": "Wants to reclaim the family honor associated with the estate, believing that a strong legacy will erase the stain of his past.",
    "motiveStrength": "strong",
    "alibiWindow": "Ivor claims he was on a walk in the gardens at the time of the murder, a detail that could either validate his innocence or raise suspicion.",
    "accessPlausibility": "easy",
    "stakes": "He desires respect from the community and his family, hoping to restore his reputation and regain the honor he lost.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks in a direct manner, often cutting through pleasantries to get to the point. His words are measured, reflecting his military background, and he has a tendency to use military metaphors when making a point.",
    "internalConflict": "Ivor struggles with feelings of inadequacy stemming from his past, wrestling with the desire for redemption while grappling with the shame that lingers in his mind.",
    "personalStakeInCase": "This crime matters to Ivor because the victim's estate is tied to his family's honor; reclaiming it could be his path to redemption.",
    "paragraphs": [
      "Captain Ivor Hale had always prided himself on his unwavering sense of duty, a trait that had served him well during his years in the navy. Now, in retirement, he found himself wandering the grounds of his ancestral estate, each step a reminder of the honor he had once commanded. The garden, once a source of solace, had become a battleground of memories, tainted by the dishonorable discharge that haunted him. He had never spoken of it, the shame too heavy to bear, but it loomed over him like a specter.",
      "As he surveyed the estate, Ivor reflected on the legacy that had been entrusted to him. The estate was not just a home; it was a symbol of his family’s honor. Losing it to a rival or, worse, allowing it to fall into disrepair, would be a personal failure he could not endure. 'A captain must always steer his ship to safe harbor,' he would remind himself, though the metaphor felt increasingly hollow in light of recent events.",
      "His blunt manner of speaking often caught others off guard. 'No time for frivolities,' he would declare, his voice steady and commanding. 'We have matters at hand that require our immediate attention.' His words were delivered with the precision of a well-aimed cannon, and while many respected him, few understood the depths of his internal struggle. Ivor longed to reclaim the respect he had lost, yet every interaction reminded him of the dishonor that clung to him like barnacles on a ship’s hull.",
      "When the murder transpired, Ivor felt the weight of the world upon his shoulders. The estate's future was now uncertain, and the investigation threatened to unravel everything he had fought to protect. He had to confront the truth of his past and seek redemption, not just for himself but for his family’s legacy. As he walked the grounds, the stakes had never been higher; the battle for honor was far from over."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an aspiring writer with an undeniable charm, yet she finds herself ensnared in a web of gambling debts and desperation, threatening her dreams.",
    "publicPersona": "Charming and witty, Beatrice is known for her storytelling talent, often captivating her friends with tales that blur the line between fiction and reality.",
    "privateSecret": "However, she is in deep debt due to gambling and has taken secret loans from the murder victim, a situation that has left her feeling trapped.",
    "motiveSeed": "Needs money to pay off debts and fund her writing career, believing that the victim's estate could provide her with the means to escape her financial woes.",
    "motiveStrength": "compelling",
    "alibiWindow": "Beatrice claims she was at the local pub with friends during the murder, a detail that could either exonerate her or lead to further inquiry.",
    "accessPlausibility": "unlikely",
    "stakes": "For Beatrice, the stakes are monumental; her future as a writer depends on her financial stability, and the loss of the estate would mean the loss of her dreams.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice’s speech is lively and animated, often punctuated with dramatic gestures. She has a tendency to employ sarcasm and irony, drawing her audience in with her infectious energy.",
    "internalConflict": "She grapples with feelings of shame and desperation, torn between her ambition and the reality of her situation, which threatens to consume her.",
    "personalStakeInCase": "This crime matters to Beatrice because the victim's estate represents her last chance to pay off her debts and pursue her writing career without the weight of her financial burdens.",
    "paragraphs": [
      "Beatrice Quill was a whirlwind of energy, her laughter echoing through the local pub as she regaled her friends with yet another fantastical tale. To them, she was the charming aspiring writer, a woman destined for greatness. Yet, beneath the surface of her sparkling persona lay a tumultuous reality. Beatrice was deep in debt, ensnared by a gambling habit that had spiraled out of control, and the loans she had taken from the murder victim loomed over her like a dark cloud, threatening to rain down disaster.",
      "She often used her charm and wit to distract from her financial woes, employing a sardonic humor that captivated her audience. 'Oh, darling, if I had a penny for every time I got myself into trouble, I’d be a millionaire — or at least able to pay off my debts!' she would quip, her eyes glimmering with mischief. But as the laughter faded, the weight of her situation settled heavily on her shoulders, a constant reminder of the precariousness of her dreams.",
      "As the investigation unfolded, Beatrice found herself caught between desperation and ambition. The victim's estate held the key to her financial freedom, a chance to wipe the slate clean and pursue her passion for writing without the burden of debt. 'What better plot twist than inheriting a fortune?' she mused to herself, though the thought felt more like a fantasy than a reality. The stakes were high; if the estate were lost, so too would be her dreams of becoming a published author.",
      "Yet, with every passing day, the shadow of suspicion darkened her path. She had been at the pub, surrounded by friends, but would that alibi hold under scrutiny? Beatrice’s internal conflict raged as she grappled with guilt over her debts and the fear of being found out. This crime mattered to her more than anyone realized; it was not merely about money, but about reclaiming her future and finding her place in a world that seemed determined to keep her at the margins."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Hawthorne Manor",
    "type": "Manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Hawthorne Manor, an imposing country estate, looms over the surrounding landscape, its grandeur marred by secrets hidden within its walls.",
    "visualDescription": "A stately stone edifice with ivy-clad walls, tall windows reflecting a grey sky, and a grand entrance flanked by ancient oak trees; the sprawling gardens are overgrown, hinting at neglect.",
    "atmosphere": "A palpable tension hangs in the air, thick with unspoken conflict and the weight of history.",
    "paragraphs": [
      "Hawthorne Manor stands as a testament to a bygone era, its majestic facade softened by creeping ivy and the relentless march of time. The estate's towering stone walls are punctuated by gabled roofs and leaded glass windows, which seem to watch over the sprawling grounds with a knowing gaze. Despite the grandeur, an air of melancholy permeates the estate, suggesting that the vibrancy of its former life has long since faded. The gardens, once a riot of color, are now a tangled mass of weeds and overgrown hedges, echoing the disarray within the household.",
      "Inside, the grand hall greets visitors with a sweeping staircase and an ornate chandelier, its crystals dull with dust. The scent of polished wood and aged leather fills the space, mingling with the faintest hint of mildew. Heavy drapes, drawn tight against the chill of the outside world, block out the light, casting the hall into shadow. The echo of footsteps on the polished floor reverberates through the silence, as if the manor itself is holding its breath, waiting for the inevitable unraveling of its secrets.",
      "As the rain begins to fall, the rhythmic patter against the windows creates a haunting melody that underscores the tension brewing within the manor's walls. Each room tells a story, from the cluttered library filled with tomes of forgotten knowledge to the dimly lit drawing room where whispered conversations hint at betrayal. The isolation of Hawthorne Manor, nestled several miles from Little Middleton, amplifies the sense of entrapment; those within its walls are bound not only by family ties but also by the weight of their own choices.",
      "In this place where class struggles and personal conflicts collide, the atmosphere thickens with every passing hour. Behind closed doors, alliances shift like shadows, and the clock ticks ever forward, counting down to the moment when the truth will finally emerge from the darkness, shattering the carefully constructed facades of its inhabitants."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, creating a somber mood",
    "timeFlow": "Three days of mounting tension leading to a fateful revelation",
    "mood": "Tense and foreboding, reflecting underlying class struggles and personal conflicts",
    "eraMarkers": [
      "Petrol touring cars parked by the entrance",
      "Early home telephones in the drawing room",
      "Typewriter clacking in the study"
    ],
    "sensoryPalette": {
      "dominant": "The musty scent of old books and damp wood",
      "secondary": [
        "Crisp smell of rain on dry earth",
        "Faint traces of tobacco smoke lingering in the air"
      ]
    },
    "paragraphs": [
      "The air is thick with tension as the clouds loom overhead, casting a pall over the estate. The scent of rain mingles with the dust of forgotten memories, creating a heavy atmosphere that feels almost tangible. The soft patter of raindrops against the window panes punctuates the silence, a reminder of the outside world pressing in against the manor's fortified walls. Each sound is amplified in the stillness, echoing the unspoken fears and anxieties of those who reside within.",
      "As night falls, the flickering candlelight casts eerie shadows that dance across the walls, distorting the familiar into the unknown. The oppressive atmosphere breeds unease, heightening the senses and sharpening the mind. The distant sound of thunder rumbles like an omen, warning of the storm that is not just outside but brewing within the hearts of the manor's inhabitants."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_hall",
      "name": "Grand Hall",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A vast, echoing space with polished wooden floors and a grand staircase leading to the upper levels.",
      "sensoryDetails": {
        "sights": [
          "ornate chandelier hanging from the ceiling",
          "dust motes dancing in the dim light",
          "tall portraits of ancestors lining the walls"
        ],
        "sounds": [
          "echoing footsteps on hardwood",
          "the creak of the staircase",
          "whispers carried on the still air"
        ],
        "smells": [
          "polished wood and beeswax",
          "faint mildew from the damp walls",
          "old leather from forgotten chairs"
        ],
        "tactile": [
          "smooth banister underhand",
          "cold marble tiles underfoot",
          "soft fabric of drapes brushing against skin"
        ]
      },
      "accessControl": "Accessible to all household members; locked at night for security.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "puddles forming on the polished floor",
            "grey light filtering through the windows",
            "shadows cast by flickering candlelight"
          ],
          "sounds": [
            "steady drumming of rain on the roof",
            "soft rustle of curtains in the breeze",
            "the distant rumble of thunder"
          ],
          "smells": [
            "damp earth and fresh rain",
            "the mustiness of wet wood",
            "the sharp scent of ozone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light casting long shadows",
            "dust settling on antique furnishings",
            "the stark contrast of dark wood against pale walls"
          ],
          "sounds": [
            "the creak of old timbers",
            "silence broken by a distant clock",
            "the flutter of pages in a book"
          ],
          "smells": [
            "dust and aged paper",
            "the lingering scent of tobacco",
            "the faint aroma of wet stone"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting off polished surfaces",
            "the silhouettes of furniture against the walls",
            "the warm glow of a fire in the hearth"
          ],
          "sounds": [
            "the crackle of burning wood",
            "the ticking of a mantel clock",
            "distant laughter echoing from the drawing room"
          ],
          "smells": [
            "candle wax melting",
            "the rich scent of woodsmoke",
            "the faint aroma of fresh flowers"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Hall serves as the heart of Hawthorne Manor, a space where the family gathers and secrets are whispered. Its towering ceilings and grand staircase create an imposing atmosphere, filled with the weight of history. The flickering light from the chandelier casts a warm glow, but shadows lurk in every corner, hinting at the hidden truths that lie beneath the surface. As the rain pelts against the roof, the hall becomes a sanctuary of sorts, a place where tensions run high and every glance is laden with meaning.",
        "In this vast expanse, the echo of footsteps can be unnerving, each sound amplified by the empty space. The portraits of long-gone ancestors appear to watch over the proceedings, their eyes following those who dare to enter. The scent of beeswax and old leather pervades the air, a reminder of the manor's storied past, while whispers of discontent and intrigue swirl like the dust motes dancing in the light."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A dimly lit room lined with towering bookshelves filled with leather-bound volumes, a large oak desk at its center.",
      "sensoryDetails": {
        "sights": [
          "dusty tomes with faded spines",
          "flickering candlelight casting shadows",
          "a large globe in the corner"
        ],
        "sounds": [
          "pages turning in silence",
          "the creak of the desk under pressure",
          "the distant sound of rain against the window"
        ],
        "smells": [
          "musty paper and leather",
          "the faint scent of ink",
          "the aroma of damp wood"
        ],
        "tactile": [
          "rough texture of aged book covers",
          "smooth surface of the desk",
          "the chill of the air from the window"
        ]
      },
      "accessControl": "Restricted access for family only; staff may enter only when summoned.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets racing down the glass",
            "the grey light barely illuminating the room",
            "books casting long shadows"
          ],
          "sounds": [
            "steady rain drumming against the roof",
            "the rustle of pages as they turn",
            "the distant rumble of thunder"
          ],
          "smells": [
            "the rich scent of wet paper",
            "damp wood and leather",
            "the musty aroma of forgotten tomes"
          ],
          "mood": "claustrophobic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through heavy drapes",
            "the library's shadows growing longer",
            "dust motes suspended in still air"
          ],
          "sounds": [
            "silence broken by the ticking of a clock",
            "the creak of the floorboards",
            "the rustle of paper in the stillness"
          ],
          "smells": [
            "the scent of old leather bindings",
            "the faint whiff of ink",
            "the musty aroma of dust"
          ],
          "mood": "suspenseful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft candlelight illuminating the desk",
            "the glow of the fireplace",
            "shadows flickering against the walls"
          ],
          "sounds": [
            "the crackling of the fire",
            "soft whispers of conversation",
            "the distant sound of a clock chiming"
          ],
          "smells": [
            "warmth of burning wood",
            "the scent of beeswax candles",
            "the faint aroma of tobacco smoke"
          ],
          "mood": "introspective"
        }
      ],
      "paragraphs": [
        "The library of Hawthorne Manor is a sanctuary of knowledge and secrets, its towering shelves lined with volumes that have witnessed the passage of time. The soft glow of candlelight illuminates the room, casting flickering shadows that dance across the walls. The rich scent of aged leather and musty paper envelops the air, creating an atmosphere ripe for discovery. Here, amidst the silence, the past whispers through the pages of forgotten tomes, waiting for someone to uncover its hidden truths.",
        "As rain patters against the window, the library becomes a refuge from the storm outside, yet it holds its own tempest of secrets. The only sounds are the soft rustle of pages being turned and the distant crackle of a fire, urging the curious to delve deeper into the mysteries contained within. Each book is a potential clue, each dust-covered spine a reminder of the stories yet to be told, and the clock ticking softly in the corner serves as a countdown to the inevitable revelation of the manor's dark past."
      ]
    },
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Social gathering space",
      "visualDetails": "An elegantly furnished room with plush sofas, a grand piano, and large windows overlooking the gardens.",
      "sensoryDetails": {
        "sights": [
          "richly patterned wallpaper",
          "an ornate fireplace with a gilded mirror",
          "expansive views of the overgrown gardens"
        ],
        "sounds": [
          "soft music played on the piano",
          "the rustle of silk gowns",
          "the crackle of the fireplace"
        ],
        "smells": [
          "the floral scent of fresh arrangements",
          "the faint aroma of pipe tobacco",
          "the warm scent of burning logs"
        ],
        "tactile": [
          "plush upholstery against skin",
          "the coolness of the marble fireplace",
          "the weight of a delicate teacup"
        ]
      },
      "accessControl": "Open to guests during social events; private family moments restricted.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through the curtains",
            "water droplets clinging to window panes",
            "the muted colors of the room"
          ],
          "sounds": [
            "the steady patter of rain outside",
            "the soft sound of cloth being arranged",
            "the thud of a heavy book being set down"
          ],
          "smells": [
            "dampness in the air",
            "the faint scent of wet flowers",
            "the aroma of brewing tea"
          ],
          "mood": "reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows pooling in the corners",
            "the flicker of candlelight",
            "the contrast of dark furniture against pale walls"
          ],
          "sounds": [
            "the murmur of conversation",
            "the rustle of fabric as guests shift",
            "the distant sound of thunder"
          ],
          "smells": [
            "the rich scent of brewed coffee",
            "the lingering aroma of pastries",
            "the faint whiff of perfume"
          ],
          "mood": "tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft candlelight illuminating the room",
            "the glow of the fireplace",
            "the sparkle of crystal glasses"
          ],
          "sounds": [
            "laughter and chatter of guests",
            "the soft melody of a piano",
            "the crackling of the fire"
          ],
          "smells": [
            "the sweet scent of dessert",
            "the aroma of fine wine",
            "the warm scent of leather"
          ],
          "mood": "festive"
        }
      ],
      "paragraphs": [
        "The drawing room is a vibrant space where family and guests come together, adorned with plush sofas and an elegant grand piano that invites melodies to fill the air. The large windows offer a view of the gardens, their beauty now overshadowed by neglect, much like the relationships within the manor. The rich floral wallpaper and ornate furnishings create an inviting atmosphere, yet beneath the surface, tensions simmer, waiting to erupt.",
        "As guests gather, the air is filled with laughter and the soft strains of music, but the occasional glance exchanged between family members hints at the underlying discord. The scent of blooming flowers mingles with the warm aroma of tea, creating a deceptive sense of comfort. Yet, the drawing room is a stage for hidden agendas, where every conversation could hold the key to the manor's secrets, and the flickering candlelight casts shadows that conceal more than they reveal."
      ]
    },
    {
      "id": "servants_quarters",
      "name": "Servants' Quarters",
      "type": "interior",
      "purpose": "Private living space for staff",
      "visualDetails": "A modest area with shared rooms, a communal kitchen, and worn furniture reflecting the lives of those who serve.",
      "sensoryDetails": {
        "sights": [
          "simple wooden furniture",
          "faded wallpaper peeling at the edges",
          "the glow of a single gas lamp"
        ],
        "sounds": [
          "whispers of conversation",
          "the clattering of dishes",
          "the distant sound of footsteps above"
        ],
        "smells": [
          "the scent of cooking food",
          "the aroma of damp laundry",
          "the faint odor of unpolished wood"
        ],
        "tactile": [
          "worn fabric of shared blankets",
          "the chill of the stone floor",
          "the rough texture of wooden table surfaces"
        ]
      },
      "accessControl": "Restricted to household staff; family members rarely enter.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets on the window panes",
            "the grey light illuminating the cramped space",
            "shadows cast by the gas lamp"
          ],
          "sounds": [
            "the sound of rain hitting the roof",
            "the murmur of voices as staff prepare for the day",
            "the clatter of pots and pans"
          ],
          "smells": [
            "the aroma of breakfast cooking",
            "the scent of damp cloth",
            "the faint smell of wood smoke"
          ],
          "mood": "busy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through small windows",
            "the clutter of everyday life",
            "the worn edges of furniture"
          ],
          "sounds": [
            "the soft chatter of staff",
            "the creak of floorboards",
            "the distant ticking of a clock"
          ],
          "smells": [
            "the scent of cleaning supplies",
            "the aroma of freshly laundered linens",
            "the faint odor of unpolished wood"
          ],
          "mood": "tired"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of gas lamps",
            "the flicker of shadows on the walls",
            "the gathering of staff around a table"
          ],
          "sounds": [
            "laughter and camaraderie",
            "the sound of dishes being cleared",
            "the distant crackle of a fire"
          ],
          "smells": [
            "the scent of dinner leftovers",
            "the aroma of woodsmoke",
            "the faint smell of sweat and toil"
          ],
          "mood": "relaxed"
        }
      ],
      "paragraphs": [
        "The servants' quarters are a stark contrast to the grandeur of Hawthorne Manor, a modest space where the staff resides in shared rooms and communal areas. The faded wallpaper and worn furniture speak to the lives of those who serve, filled with both camaraderie and unspoken tensions. In the morning, the quarters are alive with the bustle of preparation, the scent of breakfast mingling with the dampness of the rainy weather outside.",
        "As the day progresses, the atmosphere shifts; the dim light filtering through small windows casts shadows on the clutter of everyday life. Conversations are hushed, filled with whispers of gossip and speculation about the family above. The evenings bring a sense of relief as staff gather together, sharing stories and laughter, yet the underlying current of class disparity remains a constant reminder of their place within the estate's hierarchy."
      ]
    }
  ],
  "note": "",
  "cost": 0.0026219902499999997,
  "durationMs": 30936
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1930,
    "month": "February",
    "day": 14,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "chilly winds"
    ],
    "daylight": "Short daylight hours, with sunset around five o'clock in the evening, leading to long, gloomy evenings.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, as the rain patters against the windows.",
    "holidays": [
      "Valentine's Day"
    ],
    "seasonalActivities": [
      "attending formal winter balls",
      "indoor gatherings with card games",
      "reading by the fireside"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool suits with high-waisted trousers",
        "black bowler hats",
        "double-breasted evening jackets"
      ],
      "casual": [
        "tweed jackets",
        "corduroy trousers",
        "knitted sweaters"
      ],
      "accessories": [
        "silk pocket squares",
        "leather gloves",
        "gold cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "floor-length evening gowns with dropped waists",
        "long satin gloves",
        "feathered headbands"
      ],
      "casual": [
        "tweed skirts",
        "knitted cardigans",
        "blouses with lace trim"
      ],
      "accessories": [
        "beaded evening bags",
        "faux fur stoles",
        "cloche hats"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influence in design",
      "the rise of jazz music",
      "increased use of synthetic fabrics"
    ],
    "socialExpectations": [
      "men are expected to wear hats outdoors",
      "women must maintain modesty in dress",
      "upper classes expected to display wealth through fashion"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Wall Street Crash of 1929 continues to impact economies",
      "Political unrest in Europe as fascism gains traction",
      "Debate over unemployment relief in the British Parliament"
    ],
    "politicalClimate": "Tensions are rising as the effects of the Great Depression grip the nation, creating unease among the populace.",
    "economicConditions": "Widespread unemployment and poverty, with many families struggling to make ends meet.",
    "socialIssues": [
      "class disparity becoming more pronounced",
      "women's suffrage increasingly debated",
      "growing fear of communism and fascism"
    ],
    "internationalNews": [
      "Germany faces economic challenges leading to political instability",
      "Fascism grows in Italy under Mussolini"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Louis Armstrong's jazz numbers",
        "Bing Crosby's popular ballads",
        "the Charleston dance craze"
      ],
      "films": [
        "'The Love Parade'",
        "'The Big House'",
        "'The Jazz Singer'"
      ],
      "theater": [
        "'The Front Page'",
        "'Cigars and Whiskers'",
        "'The Royal Family'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'The Shadow'",
        "'The Hit Parade'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Great Gatsby' by F. Scott Fitzgerald",
        "'Murder in the Cathedral' by T.S. Eliot"
      ],
      "popularGenres": [
        "mystery",
        "romance",
        "social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator",
        "the radio broadcast",
        "the home telephone"
      ],
      "commonDevices": [
        "typewriters in offices",
        "petrol-powered cars",
        "simple home lighting systems"
      ],
      "emergingTrends": [
        "growth of mass media",
        "increased use of consumer goods",
        "advancements in communication technologies"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Coal scuttle refill: one shilling sixpence",
        "Taxi across town: two shillings"
      ],
      "commonActivities": [
        "visiting local tea rooms",
        "attending community dances",
        "gathering for informal soirées"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "afternoon tea with neighbors"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "upper class maintains strict social hierarchies",
      "working class increasingly resentful of disparities"
    ],
    "gender": [
      "women are beginning to enter the workforce in greater numbers",
      "traditional gender roles still dominate society",
      "debates about women's rights gaining traction"
    ],
    "race": [
      "racial tensions evident in some urban areas",
      "increasing awareness of racial equality issues"
    ],
    "generalNorms": [
      "conformity to societal expectations is strong",
      "public behavior is often scrutinized",
      "privacy concerns arise with the advent of new technologies"
    ]
  },
  "atmosphericDetails": [
    "The damp chill in the air carries the scent of wet earth and decaying leaves, creating an almost suffocating atmosphere.",
    "The sound of rain tapping against the windowpanes is a constant reminder of the dreariness outside, echoing the tension within the manor's walls.",
    "Inside, the flickering candlelight casts dancing shadows, hinting at the secrets and lies brewing beneath the surface of polished social interactions."
  ],
  "paragraphs": [
    "February 1930 finds the manor house steeped in an oppressive winter gloom. The relentless rain, coupled with overcast skies, creates a somber backdrop for the lives of its inhabitants. With Valentine’s Day approaching, the tension within the household is palpable, contrasting sharply with the external festivities of love and celebration. Guests are invited to a lavish ball at the estate, yet whispers of discontent among the staff hint at deeper class struggles and personal conflicts that threaten to unravel the evening’s charm.",
    "Fashion during this period reflects the lingering elegance of the Roaring Twenties, with men donning tailored wool suits and bowler hats, while women grace the room in floor-length evening gowns adorned with intricate beadwork. The atmosphere is thick with the scent of expensive perfume and cigar smoke, punctuated by laughter and the soft strains of jazz from a gramophone. Yet, beneath the glimmering surface of opulence lies a tension that mirrors the broader societal unrest, as economic woes continue to tighten their grip on the populace.",
    "Daily life within the manor is dictated by the rhythms of social rituals and economic challenges. The staff, dressed in crisp uniforms, navigate the fine line between servitude and camaraderie, particularly as they gather for evening tea to discuss the rising discontent among the working class. Meanwhile, the upper class continues to host extravagant soirées, oblivious to the struggles outside their gilded doors. The cost of living is rising, and whispers of political debates and societal change drift through the air, as families grapple with the realities of the Great Depression and the eerie specter of fascism looming on the horizon."
  ],
  "note": "",
  "cost": 0.0010261151999999998,
  "durationMs": 10609
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense inheritance dispute amidst the Great Depression forces the wealthy and their staff to confront class tensions and personal grievances within the isolated manor.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Heightened class tensions due to the Great Depression create a volatile environment where the wealthy and their staff navigate complex loyalties and rising political anxieties."
  },
  "setting": {
    "location": "A large, imposing country estate with sprawling gardens and a series of interconnected rooms, including a grand hall, library, and servants' quarters.",
    "institution": "Manor house",
    "weather": "Overcast with intermittent rain, creating a somber mood."
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
      "description": "The clock in the library shows the hands are slightly askew.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This reveals that the clock may have been manipulated.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "This suggests tampering occurred just before the murder.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the timeline of events.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "A faint scratch is found on the clock casing.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This indicates recent manipulation of the clock mechanism.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Witnesses say the clock struck a different time than their recollection.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "This discrepancy suggests the clock was altered to mislead.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Comparing the clock time with witness accounts reveals the tampering.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "This provides evidence of the clock's manipulation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "temporal",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was at the pub from nine o'clock in the evening until ten o'clock in the evening, corroborated by multiple witnesses.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This narrows the solution toward Dr. Mallory Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_4",
      "category": "behavioral",
      "description": "Dr. Mallory Finch expressed professional jealousy towards Eleanor Voss.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This indicates motive for the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "The clock shows nine forty in the evening, but witnesses say they last saw Eleanor at nine fifty in the evening.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This raises questions about the accuracy of the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "This indicates that Eleanor Voss must have been alive for longer than indicated by the evidence.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This contradicts the timeline of her death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Witnesses corroborate Eleanor's presence in the library shortly before the murder.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "This supports the timeline of events leading to the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "testimonial",
      "description": "Witnesses state they heard a loud argument coming from the library shortly before the murder.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[1]",
      "pointsTo": "This adds context to the events leading up to the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "nine o'clock in the evening remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "category": "temporal",
      "description": "A faint scratch is found on the clock casing.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This indicates recent manipulation of the clock mechanism.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Some believe that Eleanor was seen leaving the library shortly before the murder.",
      "supportsAssumption": "Eleanor must have been alive for longer than indicated by the evidence.",
      "misdirection": "This misleads the investigation by suggesting she had time to leave."
    },
    {
      "id": "rh_2",
      "description": "Rumors suggest that Eleanor was involved in a secret affair that could have led to her murder.",
      "supportsAssumption": "Eleanor must have been alive for longer than indicated by the evidence.",
      "misdirection": "This distracts from the evidence pointing to the alive's eleanor and the true timeline."
    }
  ],
  "status": "pass",
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
      "clue_fp_contradiction_step_2"
    ],
    "mid": [
      "clue_2",
      "clue_3",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_core_elimination_chain",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8"
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
  "latencyMs": 10316,
  "cost": 0.0043513436999999995
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
