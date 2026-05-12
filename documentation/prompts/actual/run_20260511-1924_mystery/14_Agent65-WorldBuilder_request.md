# Actual Prompt Record

- Run ID: `mystery-1778527480857`
- Project ID: ``
- Timestamp: `2026-05-11T19:28:22.528Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `741879f4a249a587`

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
    "title": "The Clockwork Conspiracy",
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
      "institution": "Manor House"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "premeditated"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "The diligent hostess of the estate, known for her keen insight.",
      "private_secret": "She harbors doubts about her family's legacy.",
      "motive_seed": "Protecting her family's reputation.",
      "motive_strength": "strong",
      "alibi_window": "ten minutes before and after the clock's strike at eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the clock room",
        "Knowledge of the estate layout"
      ],
      "behavioral_tells": [
        "Calm demeanor under stress",
        "Sharp focus during discussions"
      ],
      "stakes": "High, as her family's name is at stake.",
      "evidence_sensitivity": [
        "Willing to hide personal motives",
        "Concern for her reputation"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "medical expert",
      "relationships": [],
      "public_persona": "Respected physician with a calm manner.",
      "private_secret": "Has a personal vendetta against the victim.",
      "motive_seed": "A past grievance with the Voss family.",
      "motive_strength": "moderate",
      "alibi_window": "ten minutes before the clock's strike at eleven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Knowledge of the clock mechanism",
        "Frequent visits to the estate"
      ],
      "behavioral_tells": [
        "Occasional nervousness when discussing the victim",
        "Inconsistent medical explanations"
      ],
      "stakes": "Moderate, as it could ruin his career.",
      "evidence_sensitivity": [
        "Fear of exposure",
        "Anger over past grievances"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "non-binary"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "military officer",
      "relationships": [],
      "public_persona": "A charismatic and charming officer.",
      "private_secret": "Involved in a secretive affair with Eleanor.",
      "motive_seed": "Desire to protect Eleanor.",
      "motive_strength": "weak",
      "alibi_window": "from the clock striking eleven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the estate's grounds",
        "Knowledge of Eleanor's schedule"
      ],
      "behavioral_tells": [
        "Overly protective of Eleanor",
        "Evasive when questioned about whereabouts"
      ],
      "stakes": "High, as he values his relationship with Eleanor.",
      "evidence_sensitivity": [
        "Concern for Eleanor's reputation",
        "Distrust of the household staff"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "housemaid",
      "relationships": [],
      "public_persona": "A loyal and observant maid.",
      "private_secret": "Knows more about the household than she lets on.",
      "motive_seed": "Ambition to rise in social status.",
      "motive_strength": "weak",
      "alibi_window": "from the clock striking eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Knowledge of the household routines",
        "Access to the clock room"
      ],
      "behavioral_tells": [
        "Eagerness to please superiors",
        "Nervous around authority figures"
      ],
      "stakes": "Moderate, as she desires recognition.",
      "evidence_sensitivity": [
        "Fear of losing her job",
        "Desire for upward mobility"
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
      "summary": "During a stormy evening at the Voss estate, Eleanor Voss is found dead in the clock room, her demise obscured by a meticulously timed clock manipulation that shifts the timeline of her murder."
    },
    "accepted_facts": [
      "Eleanor was found dead at ten minutes past eleven.",
      "The clock in the room was not working correctly.",
      "Dr. Mallory Finch had access to the clock room."
    ],
    "inferred_conclusions": [
      "Dr. Mallory Finch altered the clock to mislead the investigation.",
      "Eleanor's death was premeditated."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was wound back to hide the true time of death.",
      "delivery_path": [
        {
          "step": "Dr. Mallory Finch enters the clock room and manipulates the clock before the murder."
        },
        {
          "step": "The clock displays an incorrect time at the moment of the murder."
        }
      ]
    },
    "outcome": {
      "result": "The misrepresentation of time allows for a false alibi."
    }
  },
  "false_assumption": {
    "statement": "The clock accurately reflected the time of death.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses confirmed the clock striking eleven.",
    "what_it_hides": "The clock was tampered with to mislead investigators."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The clock striking eleven",
        "Witness reports of the time"
      ],
      "windows": [
        "Alibi windows of all suspects",
        "Timing of Eleanor's last seen moments"
      ],
      "contradictions": [
        "Clock shows eleven but was tampered with."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Eleanor Voss",
        "Beatrice Quill"
      ],
      "objects": [
        "The clock",
        "Eleanor's diary"
      ],
      "permissions": [
        "Dr. Finch has access to the clock room"
      ]
    },
    "physical": {
      "laws": [
        "The mechanical properties of clocks"
      ],
      "traces": [
        "Dust on the clock indicating lack of recent adjustments"
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor's trust in Dr. Finch",
        "Class hierarchies affecting communication"
      ],
      "authority_sources": [
        "Dr. Finch's position as the family doctor"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows the hands pointing to eleven.",
        "correction": "The clock cannot be trusted as it was tampered with.",
        "effect": "Narrows the investigation to the clock's alteration.",
        "required_evidence": [
          "Witnesses recall the clock striking the hour inaccurately.",
          "Dust on the clock's hands suggests it was not adjusted recently."
        ],
        "reader_observable": true
      },
      {
        "observation": "A note found near the clock reads 'ten minutes past eleven'.",
        "correction": "This indicates a deliberate attempt to mislead regarding the time of death.",
        "effect": "Narrows suspicion to Dr. Mallory Finch, who had access to the clock.",
        "required_evidence": [
          "The note itself noting an incorrect time.",
          "Dr. Finch's known access to the clock room."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses heard the clock striking the hour wrongly.",
        "correction": "The inconsistency suggests foul play regarding the time of death.",
        "effect": "Eliminates Beatrice Quill, who was not present in the clock room.",
        "required_evidence": [
          "Witness statements confirming the clock's incorrect striking.",
          "Eleanor's last known activities before her death."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled reenactment is staged where the clock is set to show the correct time and Dr. Finch's actions are scrutinized.",
    "knowledge_revealed": "The revealed facts are tamper, clock, and study.",
    "pass_condition": "Dr. Mallory Finch cannot explain the discrepancies between the clock's time and witness accounts.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_6",
      "clue_4"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's incorrect striking and the dusty hands (early) reveal tampering. Step 2: The note near the clock (mid) indicates intentional deception. Step 3: The reenactment demonstrates the clock's manipulation (discriminating test)."
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
        "clearance_method": "Proven absence in the clock room during the time of death.",
        "supporting_clues": [
          "Witnesses confirm her whereabouts."
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Established alibi during the time of the murder.",
        "supporting_clues": [
          "Confirmed by multiple witnesses."
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Found note"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statements"
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
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
    "summary": "A retired schoolteacher, Eleanor Voss is a pillar of the Little Middleton community, yet she carries the weight of a hidden past with the victim that haunts her daily.",
    "publicPersona": "Eleanor is known for her kindness and wisdom, often offering sage advice to younger generations and being the go-to person for community matters.",
    "privateSecret": "Unknown to her acquaintances, Eleanor had a romantic relationship with the victim that ended in heartbreak, leaving her with lingering feelings of regret and unresolved emotions.",
    "motiveSeed": "She seeks closure from a past relationship that was deeply affected by the victim's actions, hoping to finally come to terms with her feelings.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor attended a garden party but slipped away for a solitary walk around the estate during the time of the murder, a detail she hopes no one will notice.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Eleanor are high, as she yearns for emotional closure while grappling with the fear that her past mistakes may resurface.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often punctuating her observations with dry humor that hints at her intelligence and wit. She tends to use literary references in conversation, revealing her background as a teacher.",
    "internalConflict": "Eleanor is torn between her longing for closure and the guilt she feels for not having confronted the victim earlier about their shared past, fearing that the truth might shatter the façade of her respectable life.",
    "personalStakeInCase": "This crime matters deeply to Eleanor because it forces her to confront her past, and she wishes to find peace with the choices she made in her youth.",
    "paragraphs": [
      "Eleanor Voss stood by the window of her quaint home, gazing out at the manicured lawns of the estate where she had spent so many joyful days. The garden party had been a delightful distraction, yet her heart was heavy with memories she wished she could forget. The laughter of the guests faded into the background as she recalled the warmth of the victim's embrace, a warmth that had once filled her life with joy but now only served to remind her of what could have been.",
      "As a retired schoolteacher, Eleanor was well-respected in Little Middleton. Her kindness and wisdom made her a beloved figure, yet the weight of her secret felt like a leaden shroud. Few knew the depths of her past—a tragic romance that ended when the victim's ambition overshadowed their love. Now, with the victim's untimely death, Eleanor feared that the truth of their relationship would be unearthed, dragging her into the murky waters of scandal and regret.",
      "At the garden party, Eleanor had maintained her composure, offering advice to young mothers and discussing the virtues of literature with fellow teachers. Yet, beneath her polished exterior, she wrestled with her emotions. What if the truth of her past came to light? What if her unspoken love was revealed, tainting the memories she held dear? The thought gnawed at her, leaving her both anxious and determined to uncover the circumstances of the murder.",
      "In the days following the tragedy, Eleanor found herself drawn into the investigation. Each conversation with the other suspects sharpened her resolve. She had to confront her past, not only for herself but for the sake of the victim's memory. As she pieced together the fragments of their history, she began to understand that closure might not come from silence, but from the courage to face her fears and speak the truth, no matter how painful."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a local physician with lofty ambitions and a secret life fueled by financial desperation and social aspirations.",
    "publicPersona": "Known for their medical expertise and community service, Dr. Finch is seen as a rising star in Little Middleton's healthcare landscape.",
    "privateSecret": "Struggling under a mountain of debt, Mallory is desperate to marry into wealth and sees the victim's family as a potential lifeline to financial security.",
    "motiveSeed": "The prospect of inheritance from marrying into the victim's family or the potential benefits of the victim's death has ignited a fierce ambition within Mallory.",
    "motiveStrength": "compelling",
    "alibiWindow": "Mallory claimed to be at the clinic during the murder, yet they were secretly meeting a wealthy patient in the confines of a private room.",
    "accessPlausibility": "easy",
    "stakes": "For Mallory, the stakes are high as they aim for financial stability and social status, not just for themselves but for their family's legacy.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Mallory speaks with a confident, almost theatrical flair, often employing sarcasm to mask their insecurities. They have a tendency to over-explain medical concepts, revealing their desire to impress others.",
    "internalConflict": "Mallory grapples with the tension between their ambition and their ethical standards, questioning whether their desire for wealth is worth the potential moral compromise.",
    "personalStakeInCase": "This crime matters to Mallory as it represents a crossroads—either they will sink into a life of debt or rise to the heights of society through cunning and strategy.",
    "paragraphs": [
      "Dr. Mallory Finch stood in front of the mirror, adjusting their tie with meticulous care. The reflection staring back was that of a determined physician, yet beneath the polished exterior lay a storm of anxiety and ambition. Their reputation in Little Middleton was on the rise, but the weight of debt loomed larger than any compliment. The recent murder had thrown the community into turmoil, and with it, the opportunity for Mallory to secure a more advantageous position in life.",
      "Known for their expertise, Mallory had always been ambitious, but now desperation tinged their every thought. The victim’s family held the key to a future where bills could be paid without worry and status could be claimed without hesitation. As they navigated the aftermath of the murder, Mallory couldn’t help but wonder how they might benefit from the tragedy. The thought was a bitter pill to swallow, yet the allure of financial freedom was too tempting to resist.",
      "At the clinic, Mallory maintained an air of professionalism, but their mind often wandered to the possibilities that lay ahead. Their interactions with the wealthy patients were laced with a sardonic humor, a shield against the gnawing fear that they were merely a pretender in a world of privilege. Each appointment felt like a performance, and in this theater of life, Mallory was determined to play the leading role, even if it meant bending the rules.",
      "As the investigation unfolded, Mallory's ambition clashed with their conscience. They found themselves entangled in a web of deceit, questioning whether their aspirations were worth the potential cost to their integrity. The murder investigation was not merely a puzzle to solve; it was a reflection of their own moral compass. With each new revelation, the stakes grew higher, forcing Mallory to confront the very ambition that had driven them to this point."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, embodies the traditional values of honor and duty, yet he harbors a dark resentment toward the victim that complicates his public persona.",
    "publicPersona": "Respected in Little Middleton for his military service, Ivor is seen as a bastion of tradition and integrity, often sharing stories of his naval adventures.",
    "privateSecret": "Ivor carries a deep-seated resentment stemming from a past feud with the victim over land disputes, a conflict that has lingered long after their military days.",
    "motiveSeed": "He desires to settle an old score related to land ownership that the victim has jeopardized, seeking a resolution to a long-standing grievance.",
    "motiveStrength": "strong",
    "alibiWindow": "Ivor claims to have been in his study at the time of the murder, but with the estate's layout, he could have easily slipped away unnoticed.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Ivor are not just about land; they are about restoring his family's honor and reconciling a legacy he feels has been tarnished.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a commanding presence, often punctuating his tales with self-deprecating humor that belies his tough exterior. He has a penchant for nautical metaphors, which he uses to draw parallels with his life experiences.",
    "internalConflict": "Ivor struggles with the bitterness that comes from his past feud, torn between the desire for revenge and the recognition that such feelings may ultimately undermine his integrity.",
    "personalStakeInCase": "This crime matters to Ivor because it forces him to confront the unresolved issues of his past, challenging his notions of honor and legacy.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the mantelpiece of his study, the weight of his naval past hanging heavily in the air. A respected figure in Little Middleton, he often found himself regaling neighbors with tales of valor and camaraderie. Yet, behind the polished stories lay a festering resentment toward the victim, a man whose ambition had jeopardized his family’s land and legacy. The murder had stirred those old animosities, forcing Ivor to confront the demons he thought he had buried.",
      "The community revered Ivor for his service, but beneath that veneer of respect lay a simmering anger. Memories of land disputes haunted his thoughts, and the victim’s death had opened old wounds. Ivor often found himself wrestling with the desire for reconciliation and the urge for revenge. He had spent years fighting for his family's honor, yet the tragedy of the murder had blurred the lines between right and wrong, leaving him feeling adrift.",
      "In conversations with neighbors, Ivor employed a self-deprecating humor that masked his inner turmoil. He often joked about his age and the folly of youth, using humor as a shield against vulnerability. Yet, the more he laughed, the more he felt the weight of his bitterness pressing down. Each laugh was a reminder of the unresolved conflict that continued to shape his life, a conflict that now seemed to intertwine with the murder investigation.",
      "As the investigation progressed, Ivor's internal conflict deepened. He found himself at a crossroads, torn between the desire to settle old scores and the realization that true honor lay in forgiveness. The murder had forced him to reevaluate his past, challenging him to find a path that would restore his family's honor without succumbing to the darkness that had threatened to consume him."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an aspiring writer with a vivid imagination and an unconventional spirit, but she grapples with the heavy burden of financial debt inherited from her late father.",
    "publicPersona": "Known as the quirky oddity among Little Middleton's elite, Beatrice is both admired and dismissed for her creative pursuits and whimsical outlook on life.",
    "privateSecret": "She secretly inherits a substantial debt from her father, placing her in a precarious position that ties her to the victim's family.",
    "motiveSeed": "Desperate for financial relief, Beatrice believes the victim was planning to cut her off from their family inheritance, fueling her sense of urgency.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice was supposed to be in her room writing but was known to wander the estate at odd hours, making her alibi questionable.",
    "accessPlausibility": "easy",
    "stakes": "For Beatrice, the stakes are not only financial freedom but also the pursuit of her dreams as a writer, which she fears may slip away.",
    "humourStyle": "observational",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a whimsical cadence, often punctuating her thoughts with observations that reveal her eccentricity. She has a tendency to use metaphors and analogies that reflect her artistic nature.",
    "internalConflict": "Beatrice struggles with feelings of inadequacy and the fear that her dreams may be stifled by her financial burdens, leading her to question her worth as a writer.",
    "personalStakeInCase": "This crime matters to Beatrice because it represents a pivotal moment in her life—either she will break free from the shackles of debt or remain tethered to a past that threatens her creative spirit.",
    "paragraphs": [
      "Beatrice Quill stood in the middle of her cluttered room, surrounded by half-finished manuscripts and crumpled pages. A whimsical spirit, she often found herself lost in a world of imagination, yet the reality of her financial burdens loomed like a dark cloud. Known as the oddity among the estate's elite, Beatrice had learned to embrace her eccentricity, but beneath the quirky exterior lay a deep-seated fear of failure. The recent murder had thrown her life into disarray, intertwining her fate with the victim’s family in ways she could not have anticipated.",
      "With aspirations of being a writer, Beatrice had always felt like an outsider in a world that valued conformity. Her whimsical observations often elicited laughter or bewilderment from her peers, yet she found solace in her creativity. However, the inherited debt from her late father hung over her like a specter, whispering doubts into her ear. The victim's impending decision to cut her off from the family inheritance felt like a ticking clock, urging her to act before it was too late.",
      "In conversations with others, Beatrice's observational humor shone through, revealing her ability to find absurdity in the mundane. She would often recount tales of her escapades, using metaphors that painted vivid pictures in the minds of her listeners. Yet, the laughter that followed felt bittersweet, as she grappled with the reality that her dreams of financial freedom and literary success were slipping away. The murder investigation had become not just a distraction but a potential turning point in her life.",
      "As the investigation unfolded, Beatrice could sense the weight of her choices pressing down on her. Each clue unearthed felt like a reflection of her own struggles, forcing her to confront not only the mystery at hand but also her own insecurities. The crime mattered not just as a puzzle to solve but as a chance to reclaim her narrative—the opportunity to break free from the chains of debt and embrace the writer she longed to be."
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
    "summary": "Little Middleton Manor is an expansive estate steeped in tradition, where the echoes of class tensions and political unease reverberate through its grand halls.",
    "visualDescription": "The manor's imposing façade of weathered stone is adorned with ivy, while leaded windows glint dully under the overcast skies. The sprawling grounds include manicured formal gardens, flanked by a thick hedge that conceals the wild countryside beyond.",
    "atmosphere": "An air of foreboding pervades the estate, where every shadow seems to harbor secrets and the weight of history looms large.",
    "paragraphs": [
      "Little Middleton Manor stands as a testament to the grandeur of a bygone era, its stone walls weathered but resolute against the chill of autumn. The sprawling estate, bordered by fields of golden wheat swaying gently in the brisk wind, offers a picturesque yet isolated retreat from the world. However, beneath the surface lies a simmering tension, fueled by recent political discourse and the strains of a nation grappling with the specter of fascism. The manor, with its dark wood paneling and ornate moldings, feels more like a fortress than a home, a place where whispers carry heavy weight.",
      "Inside, the air is thick with the scent of beeswax polish mingling with the mustiness of old books, hinting at the secrets held within the library's locked doors. Gas lamps flicker, casting elongated shadows that dance across the walls, while the occasional creak of the floorboards echoes in the stillness, as if the house itself is listening. The drawing room, with its plush velvet furnishings and a grand piano that hasn't been played in months, remains untouched, an unwilling witness to the mounting unease. Outside, the gardens, once vibrant, now appear somber under the grey sky, their beauty dulled by the weight of uncertainty.",
      "As the days grow shorter and the weather turns, the manor becomes a microcosm of the larger societal struggles. The distant sound of a petrol touring car on the winding lane serves as a reminder of the world beyond, yet the isolation of the estate creates an insular atmosphere that intensifies the feeling of claustrophobia. Staff bustle about, their movements choreographed by the strict schedules that govern their lives, each aware of their place within the rigid hierarchy of the household. In the cellar, where shadows linger and the air is cool and damp, the potential for discovery lurks just beneath the surface, waiting to be unearthed.",
      "Little Middleton Manor is a character unto itself, its very walls steeped in the history of those who have lived and died within. As the tension mounts and the clock ticks ever closer to revelation, the manor stands as both sanctuary and prison, a place where secrets are kept and truths are obscured. The stage is set for a confrontation that will unravel the fabric of this seemingly idyllic estate, revealing the darkness that lies at the heart of the clockwork conspiracy."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Cool and overcast with occasional rain showers typical of the English countryside in autumn.",
    "timeFlow": "Three days of mounting tension leading up to the climactic reveal of hidden truths.",
    "mood": "Tense due to underlying class tensions and recent political discussions regarding fascism.",
    "eraMarkers": [
      "Petrol touring cars navigating the muddy lanes of the estate.",
      "Typewriters clacking away in the study, sending out letters that will never arrive.",
      "Electricity flickering intermittently, leaving the manor in moments of darkness."
    ],
    "sensoryPalette": {
      "dominant": "The scent of damp earth and decaying leaves fills the air, heavy with the promise of rain.",
      "secondary": [
        "The faint aroma of tobacco smoke, lingering from the drawing room.",
        "A distant echo of laughter from the staff quarters, muffled yet present."
      ]
    },
    "paragraphs": [
      "The atmosphere at Little Middleton Manor is charged with an uneasy stillness, broken only by the occasional rustle of leaves or the distant call of a bird. The overcast sky hangs low, casting a pall over the estate, while the scent of impending rain lingers in the air. The formal gardens, once vibrant with color, now appear muted, their beauty overshadowed by the weight of uncertainty. Each corner of the manor seems to hold its breath, waiting for the storm to break, both outside and within.",
      "As the day wears on, the shadows deepen, and the sense of isolation becomes palpable. The distant rumble of thunder reverberates through the halls, a reminder of the storm brewing both in the skies and in the hearts of those who dwell within. The oppressive atmosphere is further compounded by the unyielding social hierarchies that govern the household, creating a tension that simmers just below the surface. It is a place where secrets are currency, and trust is a fragile illusion, poised to shatter at any moment."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room features an ornate fireplace, flanked by heavy drapes that frame the leaded windows. Plush, faded velvet sofas are arranged around a low table, where a collection of dusty novels lies forgotten.",
      "sensoryDetails": {
        "sights": [
          "The flickering gas lamps cast a warm, yellow glow that contrasts sharply with the cold light streaming through the windows.",
          "A grand piano, its keys covered in dust, stands silently in the corner, a relic of happier gatherings."
        ],
        "sounds": [
          "The soft creak of the floorboards as guests shift uncomfortably in their seats, each sound amplified in the stillness.",
          "Occasional whispers drift through the room, laced with tension as conversations turn to hushed tones."
        ],
        "smells": [
          "The lingering scent of polished wood mingles with the faint aroma of tobacco smoke, remnants of a conversation long past.",
          "A hint of mildew clings to the air, a reminder of the dampness that seeps into the manor from the outside."
        ],
        "tactile": [
          "The upholstery feels worn and frayed beneath fingers, the fabric cool to the touch as if it has absorbed the chill of the autumn air.",
          "The weight of the heavy drapes is palpable, their texture coarse against skin, creating a barrier between the outside world and the secrets within."
        ]
      },
      "accessControl": "The drawing room is accessible to all guests during social hours but remains off-limits to staff unless summoned. Private discussions often take place here, adding to the air of secrecy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak down the leaded glass, distorting the view of the dreary garden outside.",
            "The muted colors of the room appear even more somber under the grey light filtering through the windows."
          ],
          "sounds": [
            "The steady patter of rain against the windows creates a soothing yet melancholic rhythm.",
            "The distant rumble of thunder serves as a reminder of the storm brewing outside."
          ],
          "smells": [
            "The scent of damp earth wafts in through the slightly ajar window, mingling with the stale air of the room.",
            "A hint of wet wool from the coats hung near the door adds to the atmosphere of confinement."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat pewter light fills the room, casting long shadows that seem to stretch across the floor.",
            "The dust motes floating in the air become more visible, illuminated by the waning light."
          ],
          "sounds": [
            "Silence reigns, broken only by the occasional rustle of fabric as guests shift restlessly.",
            "The creak of old timbers reverberates through the room, a constant reminder of the house's age."
          ],
          "smells": [
            "The scent of aged leather from the bookshelves mingles with the mustiness of the room, creating a comforting yet eerie atmosphere.",
            "A faint whiff of woodsmoke drifts in from the fireplace, hinting at warmth that feels distant."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers in the dim corners, casting dancing shadows that animate the room.",
            "The last rays of sunlight filter through the windows, creating a stark contrast between light and shadow."
          ],
          "sounds": [
            "The soft tick of a mantel clock fills the silence, each second echoing in the charged atmosphere.",
            "Distant laughter from the staff quarters breaks the tension, a reminder of life continuing outside."
          ],
          "smells": [
            "The warm scent of melting wax from the candles mixes with the lingering aroma of tobacco, creating an intimate ambiance.",
            "A hint of cold fireplace ash lingers in the air, a reminder of the fire that once crackled warmly."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room, with its ornate decor and heavy drapes, serves as a gathering space where the manor's residents and guests exchange pleasantries. However, beneath the surface of polite conversation lies an undercurrent of tension, as unspoken words hang heavy in the air. The plush furnishings invite relaxation, yet the atmosphere feels charged, as if the very walls are privy to secrets that could unravel the fabric of their lives.",
        "As the evening progresses, the drawing room becomes a stage for silent dramas, where glances are exchanged and hushed tones carry the weight of suspicion. Each creak of the floorboards draws attention, amplifying the unease that permeates the space. It is here that alliances may be forged or broken, and the clock ticks ever closer to the moment when the truth will be revealed."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The library is a grand room lined with dark wood shelves filled with leather-bound volumes, their spines cracked from years of neglect. A large oak table sits in the center, covered in dust, while a large globe stands in the corner, its surface marred by age.",
      "sensoryDetails": {
        "sights": [
          "The dim light from a single gas lamp casts a warm glow over the room, illuminating the spines of books that seem to whisper forgotten tales.",
          "A large bay window overlooks the gardens, its glass fogged with moisture, creating a barrier between the outside world and the secrets within."
        ],
        "sounds": [
          "The soft rustle of pages turning echoes in the stillness, as if the books themselves are alive and yearning to be read.",
          "The distant sound of rain pattering against the window creates a rhythmic backdrop, enhancing the sense of isolation."
        ],
        "smells": [
          "The rich aroma of old paper and leather permeates the air, evoking a sense of nostalgia for the stories contained within the volumes.",
          "A faint scent of mildew lingers, a reminder of the dampness that has seeped into the room over the years."
        ],
        "tactile": [
          "The rough texture of the book spines feels familiar beneath fingertips, their surfaces cool and slightly clammy from the humidity.",
          "The polished surface of the oak table is smooth yet cold, a stark contrast to the warmth of the books that surround it."
        ]
      },
      "accessControl": "The library is typically locked and accessible only to the family and select guests, with staff allowed entry only when instructed. It is a place of study and reflection, where secrets may be uncovered.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the window panes, distorting the view of the garden and creating a sense of confinement.",
            "The dim light of the lamp struggles against the grey gloom, casting elongated shadows that stretch across the room."
          ],
          "sounds": [
            "The rhythmic patter of rain on the roof serves as a soothing backdrop, mingling with the soft rustle of pages in the stillness.",
            "The creak of the library door opening and closing is amplified in the quiet, a reminder of the world beyond."
          ],
          "smells": [
            "The scent of damp earth wafts in through the slightly open window, mingling with the musty aroma of old books.",
            "A hint of wet wool from the coats of visitors adds to the atmosphere of confinement."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The muted light casts a grey pall over the room, dulling the colors of the spines and making the titles hard to read.",
            "Dust motes dance in the air, illuminated by the fading light that filters through the window."
          ],
          "sounds": [
            "Silence reigns, occasionally interrupted by the soft sound of a book being set down or a chair being adjusted.",
            "The distant ticking of a clock in the hallway adds a sense of urgency to the stillness."
          ],
          "smells": [
            "The rich scent of aged paper permeates the air, mingling with the mustiness that clings to the room.",
            "A faint whiff of woodsmoke drifts in from the fireplace, hinting at warmth that feels distant."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The golden light of the setting sun spills through the window, illuminating the dust particles that float lazily in the air.",
            "Shadows stretch across the floor, creating a stark contrast between light and dark."
          ],
          "sounds": [
            "The soft rustle of pages turning fills the silence, as if the books are eager to share their stories.",
            "The distant sound of laughter from the drawing room breaks the tension, a reminder of life continuing outside."
          ],
          "smells": [
            "The warm scent of candle wax mixes with the musty aroma of old books, creating an intimate atmosphere.",
            "A hint of cold fireplace ash lingers in the air, a reminder of the fire that once crackled warmly."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, with its towering shelves and dark wood paneling, invites exploration and discovery. Each leather-bound tome holds the potential for revelation, yet the air is thick with the weight of unspoken words. As the rain patters against the window, the room feels like a sanctuary, a place where secrets can be unearthed away from prying eyes. However, the locked doors serve as a reminder that not all knowledge is meant to be shared.",
        "In the dim light, the library becomes a stage for silent dramas, where the past and present collide. The scent of old paper and leather fills the air, creating an atmosphere that is both comforting and unsettling. Here, amidst the shadows, lies the potential for discovery, as hidden truths wait to be revealed, and the clock ticks ever closer to the moment of reckoning."
      ]
    },
    {
      "id": "cellar",
      "name": "Cellar",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The cellar is a dark, damp space with stone walls that seem to absorb light. Wooden shelves line the walls, filled with jars of preserves and dusty bottles, while a single bulb flickers overhead, casting erratic shadows.",
      "sensoryDetails": {
        "sights": [
          "The dim light casts eerie shadows that dance across the stone walls, creating an atmosphere of foreboding.",
          "Moldy sacks of grain sit in the corner, their contents spilling out onto the floor, hinting at neglect."
        ],
        "sounds": [
          "The faint drip of water echoes in the silence, a reminder of the dampness that pervades the space.",
          "The creaking of the wooden shelves adds to the unsettling atmosphere, as if the cellar itself is alive."
        ],
        "smells": [
          "The musty scent of damp earth and mold fills the air, a pungent reminder of the cellar's dark secrets.",
          "A faint whiff of vinegar from the jars of preserves mingles with the earthy aroma, creating a nauseating concoction."
        ],
        "tactile": [
          "The coolness of the stone walls sends a shiver down the spine, a stark contrast to the warmth of the upper floors.",
          "The rough texture of the wooden shelves feels gritty beneath fingers, a testament to years of neglect."
        ]
      },
      "accessControl": "The cellar is typically off-limits to guests and is accessed only by the household staff for storage. Its dark corners and hidden spaces create a sense of danger and mystery.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Water drips from the ceiling, pooling on the floor and reflecting the dim light in a sickly sheen.",
            "The shadows cast by the flickering bulb seem to elongate, creating a sense of claustrophobia."
          ],
          "sounds": [
            "The steady drip of water creates a rhythmic backdrop, echoing off the stone walls.",
            "A distant rumble of thunder can be heard, amplifying the atmosphere of foreboding."
          ],
          "smells": [
            "The scent of damp earth is intensified by the rain, creating a heavy, oppressive atmosphere.",
            "A hint of rust from the metal shelves adds to the tang of decay in the air."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The dim light seems to fade even further, casting the cellar into deeper shadows.",
            "Mold spreads across the walls, a dark reminder of the neglect that has seeped into every corner."
          ],
          "sounds": [
            "The silence is broken only by the soft scuttling of mice, their presence a reminder of the life that thrives in darkness.",
            "The creak of the wooden shelves adds to the unease, as if something is waiting just out of sight."
          ],
          "smells": [
            "The musty scent of decay mingles with the earthy aroma of dampness, creating a nauseating atmosphere.",
            "A faint whiff of vinegar from the jars of preserves adds a sharp contrast to the mustiness."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The shadows deepen as night falls, creating an atmosphere thick with tension.",
            "The flickering bulb casts erratic shadows that dance across the walls, heightening the sense of danger."
          ],
          "sounds": [
            "The distant sound of laughter from the drawing room feels like a cruel reminder of the joy that exists above.",
            "The creaking of the cellar as it settles adds to the sense of foreboding, as if it is harboring dark secrets."
          ],
          "smells": [
            "The cold, damp scent of stone fills the air, sharp and uninviting.",
            "A hint of mildew clings to the corners, a reminder of the secrets long buried within."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The cellar, a dark and damp sanctuary of secrets, holds the potential for discovery and dread. With its stone walls absorbing the little light that penetrates, the air is thick with the musty scent of decay. Here, amidst the shadows, the echoes of the past whisper of things long forgotten. The flickering bulb overhead casts erratic shadows across the jars of preserves, making them appear as if they are watching, waiting for the moment when the truth will be revealed.",
        "As the storm outside rages, the cellar becomes a refuge for secrets that refuse to stay buried. The distant sounds of laughter from the drawing room feel like a world away, while the oppressive atmosphere within this underground chamber weighs heavily on the heart. Each drip of water echoes ominously, as if counting down to the moment when the hidden truths will come to light, and the clockwork conspiracy will unravel."
      ]
    },
    {
      "id": "gardens",
      "name": "Formal Gardens",
      "type": "exterior",
      "purpose": "Clue discovery, Isolation",
      "visualDetails": "The formal gardens are meticulously landscaped, featuring symmetrical hedges and a central fountain that has long fallen into disrepair. Stone pathways meander through the greenery, leading to secluded benches hidden among the overgrown flora.",
      "sensoryDetails": {
        "sights": [
          "The once vibrant flowers now appear faded and wilted, their colors muted under the overcast sky.",
          "Statues of cherubs, chipped and weathered, stand sentinel among the hedges, their expressions frozen in time."
        ],
        "sounds": [
          "The soft rustling of leaves creates a gentle symphony, occasionally interrupted by the distant call of a bird.",
          "The faint sound of water trickling from the fountain adds a melancholic note to the atmosphere, echoing the decay of the gardens."
        ],
        "smells": [
          "A mix of damp earth and decaying leaves fills the air, a reminder of the gardens' former glory.",
          "The faint scent of mildew clings to the stonework of the fountain, hinting at neglect."
        ],
        "tactile": [
          "The cool stone of the pathways feels rough beneath bare feet, while the dampness of the air clings to the skin.",
          "The texture of the overgrown grass is uneven and prickly, contrasting sharply with the manicured hedges."
        ]
      },
      "accessControl": "The gardens are accessible to all, yet certain areas are overgrown and less frequented, creating secluded spots for clandestine meetings or hidden discoveries. Staff are expected to maintain the gardens but often avoid the more isolated sections.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the petals of flowers, creating a glistening effect that belies their wilted state.",
            "The pathways appear slick and muddy, making movement treacherous and isolating."
          ],
          "sounds": [
            "The steady patter of rain on leaves creates a soothing yet melancholic rhythm, echoing the mood of the estate.",
            "The distant rumble of thunder reverberates through the air, a reminder of the storm's presence."
          ],
          "smells": [
            "The scent of damp earth and wet foliage fills the air, heavy and oppressive, mingling with the decay of the flowers.",
            "A hint of rust from the iron fountain mixes with the organic scents, creating an unsettling atmosphere."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The muted colors of the flowers appear even more somber against the backdrop of the grey sky.",
            "The statues stand like mournful sentinels, their chipped features capturing the essence of the garden's decline."
          ],
          "sounds": [
            "The soft rustle of leaves is punctuated by the occasional snap of a twig underfoot, heightening the sense of isolation.",
            "The distant sound of a clock chiming echoes across the grounds, reminding all of the passage of time."
          ],
          "smells": [
            "A mix of damp soil and decaying plant matter wafts through the air, creating a heavy atmosphere that lingers.",
            "The faint scent of mildew from the fountain adds to the overall sense of neglect."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The last rays of sunlight cast a golden hue over the garden, illuminating the faded colors of the flowers.",
            "Shadows stretch long across the pathways, creating an eerie atmosphere as twilight descends."
          ],
          "sounds": [
            "The gentle chirping of crickets begins to fill the air, a stark contrast to the silence of the earlier hours.",
            "The distant laughter from the drawing room carries on the breeze, a reminder of life continuing within the manor."
          ],
          "smells": [
            "The cooling air carries the scent of evening dew, mingling with the earthy aromas of the garden.",
            "A hint of smoke from a distant fire adds a warm undertone to the cool night air."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The formal gardens, once a place of beauty and tranquility, now reflect the decay of the estate's grandeur. The hedges, meticulously trimmed in the past, have begun to grow wild, obscuring the pathways and creating an air of secrecy. Statues of cherubs, chipped and weathered, stand as silent witnesses to the passage of time, their expressions frozen in a moment of sorrow. The gardens, with their overgrown flora and hidden benches, offer a sense of isolation, perfect for clandestine meetings or quiet reflection amidst the turmoil of the manor's inner workings.",
        "As the sun begins to set, the gardens transform into a realm of shadows, where every rustle of leaves seems to whisper secrets of the past. The delicate scent of damp earth mingles with the fading floral notes, creating an atmosphere that is both melancholic and tense. It is here, among the tangled vines and forgotten paths, that the truth may be hidden, waiting to be unearthed by those brave enough to venture into the depths of the manor's mysteries."
      ]
    }
  ],
  "note": "",
  "cost": 0.0033520805999999997,
  "durationMs": 49705
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1933,
    "month": "April",
    "day": null,
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "cool and overcast",
      "occasional rain showers",
      "occasional bursts of sunshine"
    ],
    "daylight": "Days are gradually lengthening, with daylight extending into the evening hours, sunset occurring around 7:30 PM.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Easter Sunday (April 16, 1933)"
    ],
    "seasonalActivities": [
      "spring gardening preparation",
      "Easter egg hunts",
      "attending local fairs and markets"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored three-piece suits in light wool or tweed",
        "double-breasted blazers",
        "crisp white dress shirts with high stiff collars"
      ],
      "casual": [
        "lightweight cotton trousers",
        "knit cardigans",
        "sailor-style shirts"
      ],
      "accessories": [
        "bowler hats",
        "leather gloves",
        "pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "knee-length dresses with dropped waists and floral patterns",
        "tailored jackets with peplum details",
        "cloche hats adorned with ribbons"
      ],
      "casual": [
        "sundresses in pastel colors",
        "lightweight cardigans",
        "two-piece suits with knee-length skirts"
      ],
      "accessories": [
        "string of pearls",
        "silk scarves",
        "embroidered handbags"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in fashion and architecture",
      "the popularity of jazz music",
      "the rise of sportswear for women"
    ],
    "socialExpectations": [
      "strict adherence to class hierarchies",
      "formal dining etiquette",
      "gender roles emphasizing femininity in women"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "political discussions surrounding fascism in Europe",
      "the rise of the National Socialist German Workers' Party in Germany",
      "ongoing effects of the Great Depression influencing public sentiment"
    ],
    "politicalClimate": "Tense and divisive, with increasing fears of fascism and communism impacting social discourse.",
    "economicConditions": "Struggling economy with high unemployment rates, affecting working-class families and increasing class resentment.",
    "socialIssues": [
      "growing wealth disparity",
      "debates over social welfare programs",
      "rising anti-Semitism in Europe"
    ],
    "internationalNews": [
      "Germany's withdrawal from the League of Nations",
      "the establishment of the New Deal in the United States",
      "increased militarization in Italy under Mussolini"
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
        "King Kong",
        "Duck Soup",
        "The Invisible Man"
      ],
      "theater": [
        "The Front Page",
        "Of Mice and Men",
        "Porgy and Bess"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "The Lone Ranger"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Glass Key by Dashiell Hammett",
        "Murder in the Cathedral by T.S. Eliot",
        "The Maltese Falcon by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery",
        "detective fiction",
        "social commentary literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator",
        "the radio broadcasting system",
        "the first practical use of the electric washing machine"
      ],
      "commonDevices": [
        "typewriters",
        "phonographs",
        "automobiles"
      ],
      "emergingTrends": [
        "the adoption of sound in cinema",
        "increased use of advertising in print media",
        "the growth of consumer culture"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: three pence",
        "A round trip on the bus: one shilling"
      ],
      "commonActivities": [
        "strolling in local parks",
        "attending social teas",
        "participating in church services"
      ],
      "socialRituals": [
        "formal Sunday dinners",
        "afternoon tea gatherings",
        "charity events at the local hall"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing tension between the upper and working classes",
      "tight-knit communities among the upper class"
    ],
    "gender": [
      "traditional gender roles being challenged by women in the workforce",
      "expectations for women to maintain a domestic role"
    ],
    "race": [
      "rising concerns about racial tensions in Europe",
      "growing awareness of anti-Semitic sentiments"
    ],
    "generalNorms": [
      "formal behavior expected in public settings",
      "values of politeness and decorum highly regarded",
      "heavy reliance on social status"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth mingles with the fresh blooms of spring, creating a refreshing yet tense ambiance.",
    "The sound of distant thunder rolls softly as families gather for evening meals, their conversations punctuated by the occasional clink of silverware.",
    "Candles flicker against the backdrop of overcast skies, casting long shadows in the manor house as secrets simmer just beneath the surface."
  ],
  "paragraphs": [
    "April 1933 arrives with a cool, damp chill that permeates the English countryside, the air heavy with the scent of fresh earth and blooming flowers. Overcast skies often cast a gloomy pall over the estate, with occasional rain showers pattering against the windows of the grand manor house. The days grow longer, bringing a hint of warmth that invites families to engage in springtime activities, from preparing their gardens for planting to hosting Easter celebrations filled with egg hunts in the sprawling grounds. However, beneath the surface of these seasonal joys lies a tension, as discussions of societal shifts and political unrest loom large over the upper classes.",
    "Fashion in April 1933 reflects the elegance and restraint of the era, with men donning tailored three-piece suits crafted from light wool and women embracing knee-length dresses adorned with floral patterns. Cloche hats and tailored jackets are prominent, signaling a refinement that echoes the strict social hierarchies of the time. Accessories such as bowler hats for men and string pearls for women are common, each detail meticulously chosen to reflect one’s status. The influence of Art Deco is palpable, both in fashion and architecture, juxtaposing modernity with tradition in the manor's decor.",
    "Daily life in this period revolves around formal social rituals, with families gathering for Sunday dinners and afternoon tea, where the air is filled with polite conversation and subtle glances. The Great Depression casts a shadow over these gatherings, as class tensions simmer beneath the surface, exacerbated by rising fascism in Europe. While the wealthier classes enjoy their privileges, the struggles of the working class are an ever-present reminder of the disparities that threaten to unravel the social fabric. Prices for basic goods reflect the economic strain, with a loaf of bread costing four pence and a pint of milk at three pence, reminding residents of the wider world that exists beyond the estate's manicured gardens."
  ],
  "note": "",
  "cost": 0.0010633953,
  "durationMs": 16539
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A looming inheritance dispute amidst the Great Depression forces the estate's residents and staff to confront their class roles while political tensions heighten the atmosphere of mistrust.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Strict adherence to social hierarchies within the estate, compounded by class tensions from the Great Depression and rising fascism influencing political discussions."
  },
  "setting": {
    "location": "An expansive country estate featuring a grand manor house with multiple floors, formal gardens, and surrounding agricultural land.",
    "institution": "Manor house",
    "weather": "Cool and overcast with occasional rain showers typical of the English countryside in autumn."
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
      "description": "The clock in the study shows the hands pointing to eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time displayed on the clock at the scene.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "A note found near the clock reads 'ten minutes past eleven'.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "The time discrepancy noted in the evidence.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Witnesses heard the clock striking the hour wrongly.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "The reliability of the clock's time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The clock cannot be trusted as it was tampered with.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The clock's accuracy is compromised.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "This indicates a deliberate attempt to mislead regarding the time of death.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The motive behind the clock tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_6",
      "category": "behavioral",
      "description": "Dr. Mallory Finch was seen near the clock shortly before the murder.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "Dr. Mallory Finch's opportunity to tamper with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "behavioral",
      "description": "Eleanor Voss expressed concern about the clock's accuracy.",
      "sourceInCML": "CASE.cast[0].evidence_sensitivity[0]",
      "pointsTo": "Eleanor's awareness of the clock's potential tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was in the kitchen preparing dinner at the time of the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Beatrice's alibi during the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_9",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because multiple guests confirmed her presence in the kitchen.",
      "sourceInCML": "CASE.cast[3].evidence_sensitivity[1]",
      "pointsTo": "Further corroboration of Beatrice's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "physical",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Dust on the clock indicating lack of recent adjustments.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "The clock has not been tampered with recently.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "Witnesses heard the clock striking the hour wrongly.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The inconsistency suggests foul play regarding the time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The clock was recently serviced, suggesting it should be accurate.",
      "supportsAssumption": "The clock accurately reflected the time of death.",
      "misdirection": "This misleads as it implies the clock's reliability without considering tampering."
    },
    {
      "id": "rh_2",
      "description": "Witnesses claimed they heard the clock strike eleven precisely.",
      "supportsAssumption": "The clock accurately reflected the time of death.",
      "misdirection": "This leads to the assumption that the clock was functioning correctly, ignoring evidence of tampering."
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
      "clue_4"
    ],
    "mid": [
      "clue_3",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_culprit_direct_dr_mallory_finch",
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
  "latencyMs": 17175,
  "cost": 0.003071046
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
