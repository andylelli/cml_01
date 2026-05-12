# Actual Prompt Record

- Run ID: `mystery-1778615039348`
- Project ID: ``
- Timestamp: `2026-05-12T19:46:57.918Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `a3127e1ab4ca859e`

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
      "location": "Little Middleton, Yorkshire",
      "place": "a sprawling manor house",
      "country": "England",
      "institution": "Country house estate (Manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "inheritance"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "heir",
      "relationships": [
        "Dr. Mallory Finch: old friend",
        "Captain Ivor Hale: distant cousin"
      ],
      "public_persona": "gracious hostess",
      "private_secret": "facing financial ruin due to the Great Depression",
      "motive_seed": "financial desperation",
      "motive_strength": "strong",
      "alibi_window": "10:00 PM to 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "manor access",
        "servant staff"
      ],
      "behavioral_tells": [
        "anxious demeanor",
        "frequent glances at the clock"
      ],
      "stakes": "inheritance of uncle's estate",
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
      "role_archetype": "family doctor",
      "relationships": [
        "Eleanor Voss: longtime confidant",
        "Captain Ivor Hale: acquaintance"
      ],
      "public_persona": "trusted physician",
      "private_secret": "affair with Eleanor",
      "motive_seed": "jealousy",
      "motive_strength": "moderate",
      "alibi_window": "10:00 PM to 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "medical supplies",
        "manor access"
      ],
      "behavioral_tells": [
        "nervous fidgeting",
        "excessive drinking"
      ],
      "stakes": "maintaining reputation and relationship",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "45-55",
      "role_archetype": "distant relative",
      "relationships": [
        "Eleanor Voss: cousin",
        "Dr. Mallory Finch: friend"
      ],
      "public_persona": "military officer",
      "private_secret": "financial troubles from gambling",
      "motive_seed": "financial gain",
      "motive_strength": "strong",
      "alibi_window": "10:00 PM to 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "manor access",
        "servant staff"
      ],
      "behavioral_tells": [
        "sudden mood swings",
        "loud laughter"
      ],
      "stakes": "inheritance",
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
        "Eleanor Voss: friend",
        "Dr. Mallory Finch: acquaintance"
      ],
      "public_persona": "intelligent investigator",
      "private_secret": "determined to prove her worth as a woman detective",
      "motive_seed": "professional reputation",
      "motive_strength": "high",
      "alibi_window": "n/a",
      "access_plausibility": "n/a",
      "opportunity_channels": [
        "manor investigation"
      ],
      "behavioral_tells": [
        "sharp intuition",
        "observant"
      ],
      "stakes": "career advancement",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "locked",
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
      "summary": "During a stormy night at a remote manor house in Little Middleton, Yorkshire, Eleanor Voss discovers her wealthy uncle dead. As tensions rise among the guests, secrets unfold, leading to a revelation of a clock-tampering murder that hinges on the mistaken timeline of events."
    },
    "accepted_facts": [
      "Eleanor's uncle was found dead in his study.",
      "A clock in the study shows a different time than the time of death.",
      "Witnesses heard a chime at the time of death."
    ],
    "inferred_conclusions": [
      "The time reflected by the clock is misleading, potentially pointing to premeditation."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "Clock tampering creates a false timeline of events.",
      "delivery_path": [
        {
          "step": "The clock was wound back before the murder to show a false time."
        }
      ]
    },
    "outcome": {
      "result": "Confusion over the actual time of death leads to misdirected suspicion."
    }
  },
  "false_assumption": {
    "statement": "The murder must have occurred at the time indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses and the clock align in their accounts.",
    "what_it_hides": "The actual time of death is later than what the clock shows."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "witness statements",
        "clock time",
        "time of death"
      ],
      "windows": [
        "10:00 PM to 11:30 PM"
      ],
      "contradictions": [
        "Clock shows 10:10 PM while victim's time of death is later."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "the clock",
        "study door"
      ],
      "permissions": [
        "access to the study",
        "knowledge of clock mechanism"
      ]
    },
    "physical": {
      "laws": [
        "time perception",
        "mechanical operation of clocks"
      ],
      "traces": [
        "scratch on clock mechanism",
        "wear on study door handle"
      ]
    },
    "social": {
      "trust_channels": [
        "doctor-patient confidentiality",
        "family loyalty"
      ],
      "authority_sources": [
        "doctor's authority",
        "family hierarchy"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows ten minutes past eleven.",
        "correction": "This indicates the time of death is potentially misrepresented.",
        "effect": "Narrows the time of death window to after eleven.",
        "required_evidence": [
          "Clock shows ten minutes past eleven",
          "Witness heard a chime at eleven",
          "Victim was last seen at ten-forty"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall hearing the specific chime at the actual time of death.",
        "correction": "This contradicts the clock's indication of time.",
        "effect": "Eliminates the clock's reliability as a timekeeper.",
        "required_evidence": [
          "Witnesses' statements about the chime",
          "Clock's time not matching witness accounts"
        ],
        "reader_observable": true
      },
      {
        "observation": "A scratch on the clock's winding mechanism suggests tampering.",
        "correction": "This indicates that someone altered the clock prior to the murder.",
        "effect": "Narrows suspicion towards those with access to the clock.",
        "required_evidence": [
          "Scratch found on the clock mechanism",
          "Access records showing Captain Ivor Hale had opportunity"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "By comparing the clock's altered time with the actual time of death documented by witnesses, it will be revealed that Captain Ivor Hale tampered with the clock.",
    "knowledge_revealed": "The revealed facts are clock, actual, and study.",
    "pass_condition": "The evidence proves Captain Ivor Hale's access and ability to tamper with the clock.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_core_contradiction_chain"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock time and witness testimony (early) let the reader see the timing inconsistency. Step 2: The scratch on the clock mechanism (mid) confirms tampering. Step 3: The trap reveals Hale's access to the clock, leading to his guilt."
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
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Eleanor's alibi confirmed by multiple witnesses",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Dr. Finch's medical log proves he was with a patient at the time of death.",
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Physical evidence examination"
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
    "summary": "Eleanor Voss is a charming socialite whose sophisticated exterior masks a web of financial deceit and desperation.",
    "publicPersona": "Eleanor is the epitome of charm and sophistication, hosting lavish gatherings that draw the elite of Little Middleton. She knows how to navigate the social waters with grace, always with a radiant smile and a keen sense of fashion that makes her the envy of many.",
    "privateSecret": "Beneath the glitzy facade lies a woman drowning in debt, desperately trying to keep her financial troubles hidden from family and friends. Her failed investments have left her vulnerable, and her social standing hangs by a thread.",
    "motiveSeed": "Eleanor stands to inherit a fortune if her wealthy uncle dies, a prospect that becomes increasingly tantalizing as her financial woes deepen. The thought of losing her comfortable lifestyle drives her to consider unspeakable actions.",
    "motiveStrength": "strong",
    "alibiWindow": "She was seen in the library from eight to nine, but could have left briefly, creating a window of opportunity that raises suspicions.",
    "accessPlausibility": "easy",
    "stakes": "Her social standing and future depend on maintaining the family wealth, making her desperate to keep her uncle alive long enough to secure her inheritance.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a melodic cadence, often punctuating her sentences with a soft laugh or a raised eyebrow. She employs sophisticated vocabulary, but her wit can turn sharp when she feels threatened or cornered.",
    "internalConflict": "Eleanor grapples with the guilt of her financial deceit and the lengths she might go to protect her status. She fears that the truth of her situation will shatter her carefully constructed world.",
    "personalStakeInCase": "This crime matters deeply to Eleanor as it directly impacts her financial security and social standing. The potential loss of her uncle, while tragic, could also mean salvation for her mounting debts.",
    "paragraphs": [
      "Eleanor Voss glided through the grand ballroom, her laughter echoing like the tinkling of fine crystal, drawing the attention of every guest. Each step she took was a calculated performance, a dance of charm and elegance that masked the turmoil roiling beneath her composed exterior. Behind her dazzling smile was the weight of mounting debts and failed investments, secrets she guarded fiercely, lest they tarnish her reputation as Little Middleton’s most sought-after socialite.",
      "The lavish gatherings she hosted were not merely for pleasure; they were a lifeline. Eleanor’s charm was her currency, and she spent it freely to maintain her standing among the elite. Yet, with every glass of champagne raised in celebration, the specter of her financial ruin loomed larger. The thought of her uncle’s impending death, while a tragedy, also danced in her mind as a potential lifebuoy, a way to salvage her future from the depths of despair.",
      "As she mingled with the guests, her heart raced at the thought of what she might do to protect her interests. The stakes had never been higher—her uncle’s fortune was a tantalizing prize that could erase her financial woes and restore her social stature. But the very thought of such betrayal gnawed at her conscience, a reminder that the path to survival could lead to unspeakable actions. Could she really allow herself to contemplate such a thing? The answer, she feared, was all too clear.",
      "The library, where she had been seen from eight to nine, offered her a perfect alibi but also a tantalizing window of opportunity. It was a dangerous game she played, balancing her charm with the shadows of her ambitions. Eleanor knew that if her secrets were to be exposed, the consequences would be catastrophic. She needed to navigate this treacherous terrain with the utmost care, for her future—and her very identity—depended on it."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician caught in a web of loyalty and ambition, grappling with the consequences of his hidden affair with Eleanor Voss.",
    "publicPersona": "As a respected doctor, Dr. Finch is often called upon to treat the affluent of Little Middleton. He carries himself with an air of authority, his medical knowledge earning him the trust and admiration of his patients.",
    "privateSecret": "However, beneath this polished exterior lies a man torn between his professional ethics and his hidden affair with Eleanor. This secret relationship complicates his loyalties and threatens to unravel his carefully constructed life.",
    "motiveSeed": "Fearing that the exposure of his affair with Eleanor will ruin his career and reputation, Dr. Finch is pushed to the brink as the investigation unfolds. The stakes of his secret grow higher with each passing day.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claimed to be in the study consulting a medical book from eight-thirty to nine-thirty, a statement that could easily be scrutinized.",
    "accessPlausibility": "possible",
    "stakes": "His professional reputation and personal relationships are at risk, leaving him in a precarious position as the investigation unfolds.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Dr. Finch speaks in a measured, deliberate tone, often punctuating his dialogue with medical terminology that reveals his expertise. He possesses a dry wit that surfaces during moments of tension, providing a counterbalance to the seriousness of his circumstances.",
    "internalConflict": "Dr. Finch is caught in a moral quagmire, torn between his desire for Eleanor and the ethical implications of their relationship. He feels the weight of his choices pressing down on him, fearing that the truth will not only ruin his career but also break the heart of the woman he loves.",
    "personalStakeInCase": "This crime matters to Dr. Finch not only due to the potential fallout from his affair with Eleanor but also because he seeks to protect his reputation and career, which he has worked hard to build.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the study, his fingers tracing the spine of a medical book as he attempted to focus on the words before him. The weight of his hidden affair with Eleanor Voss loomed over him like a dark cloud, threatening to engulf his professional life. While he was respected in Little Middleton, the thought of his secret being exposed was a knife at his throat, cutting into the very fabric of his career.",
      "He had always prided himself on his moral compass, but his relationship with Eleanor had sent him spiraling into a moral abyss. The lines between right and wrong blurred as he found himself drawn deeper into her world of charm and sophistication. The thrill of their clandestine meetings was intoxicating, but the fear of exposure gnawed at him relentlessly, making every moment spent with her a bittersweet experience.",
      "Claiming to be in the study from eight-thirty to nine-thirty provided him with a flimsy alibi, but he knew that the truth could unravel with a single slip of the tongue. The stakes were high, not just for him but for Eleanor as well. He could not bear the thought of her being dragged down by the consequences of his actions, and yet he felt powerless to extricate himself from the situation. He was a man of science, yet here he was, entangled in a web of human emotions and ethical dilemmas.",
      "As the investigation unfolded, Dr. Finch found himself grappling with the consequences of his choices. His professional reputation and personal relationships hung in the balance, and he knew that the truth could spell disaster for them both. With each passing day, the pressure mounted, forcing him to confront not only his feelings for Eleanor but also the man he had become in pursuit of those feelings."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a grizzled war hero whose past haunts him, battling inner demons while seeking vengeance for perceived wrongs against his family.",
    "publicPersona": "With a distinguished military background, Captain Hale is admired as a grizzled war hero, known for his bravery and leadership during turbulent times. He commands respect and loyalty from those around him, often sharing tales of valor from his service.",
    "privateSecret": "However, beneath this heroic facade lies a man struggling with PTSD and guilt over decisions made during the war. His experiences weigh heavily on him, often leading to moments of dark introspection that he seldom allows others to see.",
    "motiveSeed": "His belief that the victim sabotaged his son’s business, leading to financial ruin, fuels his desire for vengeance. This perceived wrong drives him to consider actions he might not have entertained otherwise.",
    "motiveStrength": "strong",
    "alibiWindow": "He claimed to be taking a walk in the gardens from eight to nine, but with no one able to confirm his whereabouts, his alibi remains tenuous.",
    "accessPlausibility": "possible",
    "stakes": "The honor of his family and their financial stability depend on avenging what he sees as a grievous injustice, pushing him toward a dangerous path.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Captain Hale speaks with a gravelly voice, often punctuating his sentences with a sardonic twist. His speech is punctuated by military jargon and a no-nonsense attitude, revealing his straightforward approach to life.",
    "internalConflict": "Haunted by the ghosts of his past, Captain Hale struggles with feelings of guilt and anger. He battles with the desire for revenge while grappling with the realization that vengeance may not bring him the peace he seeks.",
    "personalStakeInCase": "This crime matters to Captain Hale as it represents a chance to restore his family's honor and stability, a personal battle that echoes the conflicts he faced in war.",
    "paragraphs": [
      "Captain Ivor Hale strode through the gardens with a determined gait, his mind racing with memories of battles fought and decisions made. The weight of his military past clung to him like a heavy cloak, each step reminding him of the sacrifices he had endured. He was a war hero in the eyes of many, but the truth was far more complicated. Haunted by PTSD and guilt, he often found solace in the quiet corners of his mind, where the horrors of war still whispered.",
      "His son’s financial ruin weighed heavily on his heart, igniting a fire of vengeance within him. The belief that the victim had sabotaged his son’s business was a wound that festered, driving him to seek retribution. The stakes were high; the honor of his family depended on avenging what he perceived as a grievous wrong. Yet, deep down, he felt the tug of morality, a whisper that cautioned him against descending into darkness.",
      "Claiming to have walked in the gardens from eight to nine, Captain Hale’s alibi remained unverified, leaving him vulnerable to suspicion. The thought of being implicated in a crime was anathema to him, a stark contrast to the values he had fought for. He understood the dangers of such a path, yet the lure of revenge was intoxicating, pulling him further into the abyss of his own making.",
      "As the investigation unfolded, Captain Hale found himself at a crossroads, torn between the desire for vengeance and the need for healing. The ghosts of his past lingered in the shadows, and he grappled with the realization that seeking revenge might not bring the peace he sought. Instead, it could lead him down a path of destruction, one that could ultimately cost him everything he held dear."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a devoted governess who finds herself drawn into a web of intrigue, battling her unrequited feelings for Captain Hale while striving to protect the family's children.",
    "publicPersona": "As a dutiful governess, Beatrice is trusted by the family and respected for her nurturing nature. She is often seen as a stabilizing force for the children, providing them with guidance and care.",
    "privateSecret": "However, beneath her composed exterior lies a heart burdened by unrequited feelings for Captain Hale, complicating her objectivity in the investigation.",
    "motiveSeed": "Her desire to protect the children from the family’s dark secrets and the chaos they bring propels her into the role of an amateur sleuth, determined to uncover the truth.",
    "motiveStrength": "weak",
    "alibiWindow": "She was in the children’s room from eight to nine, with the children asleep, providing her with a solid alibi.",
    "accessPlausibility": "easy",
    "stakes": "Her job and emotional well-being are at stake, especially if the family falls apart, leaving her to grapple with the consequences of her feelings.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Beatrice speaks with a gentle, nurturing tone, often using soft language that reflects her caring nature. She occasionally employs self-deprecating humor to deflect attention from her feelings, revealing a vulnerability beneath her composed demeanor.",
    "internalConflict": "Beatrice wrestles with her unrequited love for Captain Hale, torn between her feelings and her duty to the family. She fears that her emotions might cloud her judgment as she seeks to protect the children from the chaos surrounding them.",
    "personalStakeInCase": "This crime matters to Beatrice as it directly impacts her role in the family. The unraveling of their secrets could jeopardize her position and emotional well-being, pushing her to take a stand.",
    "paragraphs": [
      "Beatrice Quill stood by the window, her gaze lingering on the garden where Captain Hale paced with a troubled expression. As the governess to the family, she felt a deep sense of responsibility for the children in her care, yet her heart ached with unrequited feelings for the man who seemed so far removed from her world. She was a devoted caretaker, often seen as a stabilizing force, but beneath her composed exterior lay a tumult of emotions that threatened to spill over.",
      "In the quiet moments spent with the children, Beatrice found solace, but the chaos of the family’s secrets loomed large. She had vowed to protect them, yet the unfolding investigation left her feeling powerless. The thought of the children being exposed to the turmoil of their family filled her with dread, pushing her to take on the role of an amateur sleuth. She had to uncover the truth, not only for their sake but for her own peace of mind.",
      "Her alibi was solid; she had been in the children’s room from eight to nine, ensuring their safety as they slept. However, the emotional stakes were high. If the family fell apart, what would become of her? Beatrice feared that her feelings for Captain Hale would cloud her judgment, complicating her ability to protect the very ones she cherished. It was a delicate balance, one that left her feeling vulnerable and exposed.",
      "With each passing day, Beatrice felt the weight of her emotions pressing down on her. She often employed self-deprecating humor to deflect attention, masking her vulnerability behind a gentle smile. But as the investigation unfolded, she realized that she could no longer remain a passive observer. The stakes were too high, and she would have to confront her feelings and fears head-on if she was to safeguard the future of the children she loved."
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
    "type": "Country house estate (Manor house)",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling manor house steeped in history, shrouded in mystery, and set against the backdrop of a tumultuous social climate in 1930s England.",
    "visualDescription": "The manor stands grandly with its stone façade, adorned with ivy that twists around the ancient, weathered walls. Tall windows, draped in heavy brocade curtains, reflect the grey sky, while the expansive gardens, meticulously landscaped, offer a stark contrast to the encroaching wildness of the surrounding countryside.",
    "atmosphere": "A palpable tension hangs in the air, as if the manor itself holds secrets waiting to be uncovered.",
    "paragraphs": [
      "Little Middleton Manor rises majestically from the Yorkshire countryside, its stone walls echoing the whispers of generations past. The estate is an impressive sight, with a grand entrance flanked by towering oak trees that sway gently in the overcast sky. As the rain begins to fall, the air grows thick with the scent of damp earth and moss, mingling with the faint aroma of woodsmoke from the distant village. The formal gardens, with their intricate hedges and vibrant flower beds, provide a deceptive serenity, hiding the dark undercurrents of the tensions brewing within the manor's walls.",
      "Inside, the grand entrance hall is both inviting and foreboding, with polished marble floors that gleam under the flickering gas lamps. Heavy oak doors lead to various rooms, each locked and guarded by the unspoken rules of the manor. The walls are adorned with portraits of stern ancestors, their gazes seemingly following every movement, amplifying the sense of being watched. The sound of rain pattering against the windows creates a rhythmic backdrop, punctuated by the occasional creak of the old timbers, hinting at the stories trapped within the manor's confines.",
      "As the day progresses, the atmosphere shifts subtly, with shadows lengthening and the light dimming through the overcast sky. The air feels heavy, charged with the weight of unspoken words and unresolved conflicts. The manor, isolated from the outside world, becomes a crucible for secrets, where every conversation is laced with suspicion and every glance might conceal a hidden agenda. The ticking of the grandfather clock in the corner serves as a constant reminder that time is running out, and the clockwork of fate is set in motion.",
      "The estate's isolation from Little Middleton village, several miles away, creates a palpable sense of entrapment. The winding roads are often shrouded in mist, making any escape or call for help a daunting task. As the rain continues to fall, the gardens take on an eerie quality, the vibrant colors dulled to muted shades under the oppressive sky. This remote setting, combined with the manor's secrets, sets the stage for a mystery that intertwines the lives of its occupants, each with their own motives and hidden truths."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, creating a moody ambiance.",
    "timeFlow": "Three days of mounting tension as the storm brews, both outside and within the manor.",
    "mood": "Tense and foreboding due to underlying social tensions and recent events.",
    "eraMarkers": [
      "Gas lamps flicker in the dimly lit rooms, casting long shadows across the polished floors.",
      "Typewriters clatter in the study, their rhythmic sounds punctuating the silence as documents are prepared.",
      "A wireless radio crackles in the drawing room, broadcasting news of the looming European tensions."
    ],
    "sensoryPalette": {
      "dominant": "The heavy scent of damp earth and rain-soaked foliage fills the air.",
      "secondary": [
        "The musty aroma of old books and polished wood in the library.",
        "The faint, lingering smell of tobacco smoke from the drawing room."
      ]
    },
    "paragraphs": [
      "The manor is enveloped in a sense of impending doom, the atmosphere thick with the weight of unspoken fears and hidden agendas. Outside, the rain drums steadily against the slate roof, its rhythm echoing the anxiety that permeates the household. Inside, the dim light casts shifting shadows that dance along the walls, creating an unsettling visual as the portraits of long-dead ancestors loom, their eyes seemingly alive with scrutiny. Each creak of the floorboards underfoot feels amplified, a reminder that every footstep might be scrutinized, every word weighed for hidden meanings.",
      "As evening descends, the flickering candlelight struggles against the encroaching darkness, creating an intimate yet claustrophobic setting. The air grows colder, and the scent of wax mingles with the lingering aroma of the day's meals, now cooling in the kitchen. The manor's isolation feels more pronounced in the stillness, as if the walls themselves are closing in, trapping its occupants in a web of intrigue and suspicion. The sense of foreboding deepens with each passing hour, the stage set for a revelation that could unravel the tightly knit fabric of their lives."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library is a grand room filled with towering shelves of dusty tomes, their leather bindings cracked and worn. A large oak table sits in the center, strewn with papers and an overturned chair, suggesting a struggle.",
      "sensoryDetails": {
        "sights": [
          "Warm light from a brass lamp casts a golden hue over the pages of an open book, its contents forgotten in the chaos.",
          "Dark wooden panels line the walls, their rich patina absorbing the dim light, while a faded tapestry hangs, depicting a long-lost battle."
        ],
        "sounds": [
          "The soft rustle of pages turning, almost ghostly in the stillness, is interrupted by the occasional drip of water from the ceiling.",
          "A distant clock chimes, its sound echoing ominously, reminding those present of the time slipping away."
        ],
        "smells": [
          "The musty scent of old paper fills the air, mingling with the faint aroma of polished wood and a hint of tobacco left behind.",
          "A lingering odor of dampness seeps from the walls, a reminder of the ongoing rain outside."
        ],
        "tactile": [
          "The smooth surface of the table is marred by the scattered papers, their edges curling slightly from the humidity in the air.",
          "The coolness of the stone floor beneath one's feet contrasts sharply with the warmth radiating from the brass lamp."
        ]
      },
      "accessControl": "The library is accessible only to the family and select guests, while household staff may enter only with permission. It remains locked after dinner.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak down the tall windows, distorting the view of the gardens outside.",
            "The dim light reveals the dust motes dancing in the air, illuminated by the soft glow of the lamp."
          ],
          "sounds": [
            "The steady patter of rain against the glass creates a soothing yet melancholic rhythm.",
            "Occasional thunder rumbles in the distance, adding a layer of tension to the atmosphere."
          ],
          "smells": [
            "The scent of damp wood fills the room, a stark reminder of the weather outside.",
            "A hint of wet earth wafts in through the slightly open window."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is flat, casting no shadows, and the room feels eerily still.",
            "A single ray of light breaks through the clouds, illuminating a corner of the room."
          ],
          "sounds": [
            "The silence is broken only by the ticking of the clock, each tick echoing in the stillness.",
            "The creak of the floorboards adds an unsettling note as someone moves within."
          ],
          "smells": [
            "The air feels heavy, filled with the musty scent of old books and the faintest trace of mildew.",
            "A whiff of smoke from a nearby fireplace lingers, contrasting with the dampness."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers across the room, casting dancing shadows that animate the portraits on the walls.",
            "The deep hues of the wooden shelves come alive, rich and inviting in the warm glow."
          ],
          "sounds": [
            "The soft murmur of voices from the drawing room below seeps through the door, creating a backdrop of intrigue.",
            "The crackling of a fire in the hearth adds a comforting yet deceptive warmth."
          ],
          "smells": [
            "The scent of burning wax fills the air, mingling with the rich aroma of the leather-bound books.",
            "A hint of freshly brewed tea wafts in from the adjoining room, inviting yet ominous."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library is a sanctuary of knowledge, yet it has become a battleground of secrets. Scattered papers hint at a struggle, their contents a puzzle that could unlock the truth behind the recent events. The shelves, once a refuge, now loom with the weight of untold stories, each book a potential witness to the chaos that unfolded within these walls.",
        "As the rain continues to tap against the window, the atmosphere inside the library grows thicker, the air heavy with unspoken fears. The portraits seem to watch, their expressions shifting as if they too are drawn into the unfolding drama. It is a place where the past collides with the present, and the echoes of history resonate with every rustle of paper and creak of wood."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The study is a richly appointed room, with dark wooden paneling and a large mahogany desk cluttered with papers and a typewriter. A single window looks out onto the gardens, framed by heavy drapes that obscure the view.",
      "sensoryDetails": {
        "sights": [
          "The rich grain of the mahogany desk contrasts sharply with the deep green of the leather armchair, which sits invitingly yet ominously in the corner.",
          "A globe stands on a side table, its surface dusted with neglect, hinting at the exploration that once filled this room."
        ],
        "sounds": [
          "The rhythmic clattering of the typewriter fills the air, a mechanical heartbeat that punctuates the silence of the room.",
          "Outside, the wind howls softly, its mournful sound a reminder of the storm brewing beyond the walls."
        ],
        "smells": [
          "The air is thick with the scent of aged paper and the faintest hint of cigar smoke, remnants of conversations held long ago.",
          "A trace of leather from the armchair lingers, adding a sense of warmth amidst the otherwise cool atmosphere."
        ],
        "tactile": [
          "The smooth surface of the desk is marred by ink stains and crumpled papers, each telling a story of frustration and urgency.",
          "The leather of the armchair feels supple yet worn, a testament to countless hours spent contemplating the weight of decisions."
        ]
      },
      "accessControl": "The study is restricted to the family and their closest confidants, with household staff barred from entry unless summoned. It remains locked when not in use.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the window, distorting the view of the gardens and creating a sense of confinement.",
            "The soft glow of the desk lamp illuminates the dust motes dancing in the air."
          ],
          "sounds": [
            "The sound of rain tapping against the window creates a melancholic soundtrack to the day's work.",
            "The rustle of papers is a constant reminder of the urgency that fills the room."
          ],
          "smells": [
            "The scent of damp wood and rain-soaked earth seeps through the window, mingling with the musty aroma of old books.",
            "A faint hint of coffee wafts in from the kitchen, promising warmth amidst the chill."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is dim, casting long shadows across the room, enhancing the sense of secrecy that pervades the air.",
            "The desk is cluttered with papers, each one a potential clue waiting to be uncovered."
          ],
          "sounds": [
            "The ticking of a clock on the wall is a constant reminder of time slipping away, heightening the tension in the room.",
            "The creaking of the floorboards adds an element of suspense, as if the very walls are listening."
          ],
          "smells": [
            "The air is thick with the scent of ink and aged paper, a testament to the countless letters and documents penned in this space.",
            "A lingering aroma of burnt toast from breakfast wafts in, contrasting with the seriousness of the room."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The soft glow of the desk lamp creates a warm cocoon of light, contrasting sharply with the shadows that loom in the corners.",
            "The leather-bound volumes on the shelves seem to glimmer invitingly, yet their secrets remain locked away."
          ],
          "sounds": [
            "The crackle of a fire in the hearth provides a comforting background noise, yet the flickering light casts unsettling shadows.",
            "The distant sound of laughter from the drawing room below feels like a world away, highlighting the isolation of the study."
          ],
          "smells": [
            "The rich scent of polished wood fills the air, mingling with the aroma of freshly brewed tea from the adjoining room.",
            "A hint of smoke from the fireplace adds warmth but also an air of mystery to the atmosphere."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The study is a sanctuary of thought, yet it has become a crucible of intrigue. Papers lie strewn across the desk, each one a potential clue to unraveling the mystery that has enveloped the manor. The air is thick with the scent of ink and aged paper, a reminder of the weight of the past pressing down on the present.",
        "As the rain continues to fall outside, the atmosphere shifts, the shadows growing deeper and more pronounced. The ticking clock on the wall is a constant reminder that time is slipping away, heightening the tension in the room. Secrets linger in the corners, waiting to be uncovered, as the study becomes a pivotal space in the unfolding drama."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is elegantly furnished with plush sofas and ornate chairs arranged around a grand fireplace, which serves as the room's focal point. Large windows, framed by heavy drapes, overlook the gardens, while tasteful art adorns the walls.",
      "sensoryDetails": {
        "sights": [
          "A grand chandelier hangs from the ceiling, its crystals shimmering in the flickering light from the fireplace, casting playful reflections across the room.",
          "The rich colors of the furnishings create a warm yet opulent atmosphere, inviting guests to linger and converse."
        ],
        "sounds": [
          "The soft crackle of the fire provides a comforting backdrop, its warmth inviting relaxation amidst the tension of the day.",
          "The sound of laughter and conversation fills the space, creating a veneer of normalcy that belies the underlying tension."
        ],
        "smells": [
          "The air is infused with the scent of burning logs, mingling with the floral notes of the fresh arrangements set upon the mantle.",
          "A hint of tea and pastries wafts from a nearby table, promising comfort amidst the gathering storm."
        ],
        "tactile": [
          "The plush upholstery of the sofas feels luxurious against the skin, inviting guests to sink into their depths for a moment of respite.",
          "The cool marble of the fireplace contrasts sharply with the warmth radiating from the flames, creating a comforting tactile experience."
        ]
      },
      "accessControl": "The drawing room is open to all family members and guests, serving as a communal space for gatherings. However, private conversations may occur behind closed doors.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the windowpanes, distorting the view of the gardens outside, creating a sense of isolation.",
            "The light is soft and diffused, casting gentle shadows across the room."
          ],
          "sounds": [
            "The sound of rain tapping against the roof creates a soothing yet melancholic backdrop to the morning.",
            "Occasional thunder rumbles in the distance, adding a layer of tension to the otherwise quiet atmosphere."
          ],
          "smells": [
            "The scent of damp earth wafts in as the windows are opened slightly, mingling with the aroma of fresh pastries.",
            "A hint of wet foliage from the gardens outside seeps in, enhancing the feeling of being cocooned from the world."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The daylight is muted, casting a grey pallor over the room, enhancing the atmosphere of unease.",
            "The fire crackles softly, providing the only warmth in the otherwise cool space."
          ],
          "sounds": [
            "The distant sound of a clock ticking is a constant reminder of time passing, heightening the tension in the air.",
            "The occasional murmur of voices from the hallway adds to the sense of intrigue and secrecy."
          ],
          "smells": [
            "The air is thick with the scent of leather and old books, a reminder of the stories that fill the room.",
            "A lingering aroma of tea and biscuits from a nearby tray contrasts with the seriousness of the gathering."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The soft glow of the fire casts dancing shadows on the walls, creating an intimate yet tense atmosphere.",
            "The colors of the room deepen in the firelight, enhancing the rich textures of the furnishings."
          ],
          "sounds": [
            "The crackle of the fire is accompanied by the soft clinking of china as tea is served, a comforting yet deceptive sound.",
            "The distant sound of laughter from outside feels like a world away, heightening the sense of isolation."
          ],
          "smells": [
            "The rich scent of burning wood fills the air, mingling with the sugary sweetness of pastries.",
            "A hint of lavender from the floral arrangements adds a delicate touch, contrasting with the underlying tension."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room serves as a stage for the gathering of the manor's residents, where the air is thick with unspoken words. Plush sofas invite guests to sit, yet the atmosphere is anything but relaxed, as conversations are laced with veiled meanings and hidden agendas. The flickering light from the fireplace dances across the room, casting shadows that seem to whisper secrets of their own.",
        "As the evening unfolds, the drawing room transforms into a crucible of intrigue, where every laugh and every glance carries the weight of suspicion. The scent of burning wood mingles with that of freshly brewed tea, creating an unsettling juxtaposition of comfort and tension. It is here, amidst the opulence and elegance, that the true nature of the guests will be revealed, as the clock ticks down to an inevitable confrontation."
      ]
    }
  ],
  "note": "",
  "cost": 0.0026088249,
  "durationMs": 43235
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1936,
    "month": "April",
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "overcast skies",
      "intermittent rain showers",
      "cool temperatures averaging around 10°C (50°F)"
    ],
    "daylight": "Days are growing longer, with sunset occurring around 7:30 PM, allowing for extended late afternoon activities.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner and social gatherings have concluded.",
    "holidays": [
      "Easter Sunday (April 12, 1936)"
    ],
    "seasonalActivities": [
      "spring planting in the estate gardens",
      "Easter egg hunts for children",
      "afternoon tea served in the drawing room"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece suits with high-waisted trousers",
        "tailored morning coats",
        "crisp white dress shirts with high collars"
      ],
      "casual": [
        "tweed jackets",
        "knitted cardigans",
        "fitted trousers"
      ],
      "accessories": [
        "bowler hats",
        "silk ties",
        "pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dresses with floral patterns",
        "long silk gloves",
        "broad-brimmed hats adorned with ribbons"
      ],
      "casual": [
        "waist-length cardigans",
        "A-line skirts",
        "blouses with puffed sleeves"
      ],
      "accessories": [
        "string of pearls",
        "clutch handbags",
        "stylish brooches"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influence in design",
      "streamlined silhouettes",
      "bold patterns in fabrics"
    ],
    "socialExpectations": [
      "men are expected to wear hats outdoors",
      "women should maintain modesty in attire",
      "formal events require adherence to strict dress codes"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Spanish Civil War intensifies, drawing international attention",
      "Rising tensions in Europe as Hitler begins remilitarizing the Rhineland",
      "Economic instability continues to affect social classes across Britain and Europe"
    ],
    "politicalClimate": "The political atmosphere is tense, with growing fears of fascism and communism influencing public sentiment.",
    "economicConditions": "The Great Depression lingers, leading to rising unemployment and a widening gap between the wealthy and the poor.",
    "socialIssues": [
      "increasing awareness of class disparity",
      "debates surrounding women's suffrage",
      "growing anti-Semitism in Europe"
    ],
    "internationalNews": [
      "The League of Nations struggles to address the rising tide of fascism",
      "Reports of humanitarian crises in Spain due to the civil war"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Cole Porter",
        "Benny Goodman",
        "the Andrews Sisters"
      ],
      "films": [
        "Modern Times (1936)",
        "The Great Ziegfeld (1936)",
        "The Story of Louis Pasteur (1936)"
      ],
      "theater": [
        "The Royal Family",
        "Porgy and Bess",
        "The Mikado"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "The Jack Benny Program"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Maltese Falcon by Dashiell Hammett",
        "Gone with the Wind by Margaret Mitchell",
        "The Glass Key by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "social commentary",
        "romantic novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first practical use of radar",
        "advancements in aviation technology",
        "the introduction of the automatic telephone exchange"
      ],
      "commonDevices": [
        "radio sets in most households",
        "typewriters for business and personal use",
        "early telephones with rotary dials"
      ],
      "emergingTrends": [
        "growth of the automobile industry",
        "increased popularity of jazz music",
        "expansion of mass media through radio broadcasts"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: sixpence",
        "Weekly newspaper: two pence"
      ],
      "commonActivities": [
        "garden parties during spring",
        "family gatherings for Easter",
        "weekend outings to nearby parks"
      ],
      "socialRituals": [
        "afternoon tea as a daily ritual",
        "formal dinner parties on weekends"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "upper classes maintain strict social hierarchies",
      "the working class experiences resentment towards the wealthy"
    ],
    "gender": [
      "women are increasingly entering the workforce",
      "traditional gender roles still dominant",
      "debates on women's rights gaining momentum"
    ],
    "race": [
      "racial tensions rising in certain areas",
      "increased awareness of anti-Semitic sentiments across Europe"
    ],
    "generalNorms": [
      "decorum and etiquette highly valued in social interactions",
      "expectation for individuals to contribute to society through civic engagement"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of damp earth following the rain, mingling with the fragrance of blooming spring flowers.",
    "The low rumble of thunder can be heard in the distance, adding an ominous note to the otherwise tranquil evening.",
    "The flickering candlelight casts shadows on the ornate walls of the manor, creating a sense of foreboding as secrets lurk in every corner."
  ],
  "paragraphs": [
    "April 1936 unfolds under a blanket of overcast skies, with intermittent rain showers casting a moody ambiance over the sprawling country estate. The air is laden with the fragrance of wet earth and blossoming flowers, while the distant rumble of thunder hints at the tension brewing not just in the weather, but within the social fabric of the times. With Easter just around the corner, the estate prepares for a blend of solemnity and celebration, as families gather for traditional egg hunts and afternoon teas amidst the backdrop of rising global unease.",
    "Fashion is a reflection of both elegance and practicality during this time. Men don tailored three-piece suits complemented by bowler hats, while women adorn themselves in flowing tea dresses adorned with floral patterns, their arms elegantly draped in long silk gloves. The colors are muted yet refined, echoing the somber realities of the period, but reflecting a desire for beauty and grace. Social expectations dictate that attire is both a statement of class and a nod to tradition, with gatherings requiring guests to adhere to strict dress codes.",
    "Daily life within the estate is characterized by a blend of genteel activities and the weight of economic realities. A loaf of bread costs four pence, and the family gathers for leisurely afternoon tea, a ritual steeped in tradition yet tinged with the anxieties of the outside world. Conversations over the table often meander towards the news from Europe, where the specter of fascism looms large, complicating the already strained social norms. As families engage in garden parties and formal dinners, the undercurrents of class disparity and political tension create a charged atmosphere, where secrets may fester just beneath the surface."
  ],
  "note": "",
  "cost": 0.0010489264499999999,
  "durationMs": 14756
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "An impending inheritance dispute amidst the backdrop of the Great Depression forces the estate's residents and staff to confront their loyalties and ambitions under the watchful eye of societal upheaval.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The rigid class hierarchies of the country house are strained by economic hardship and rising political tensions, creating an atmosphere of mistrust and competition among the inhabitants."
  },
  "setting": {
    "location": "A sprawling manor house set in a remote countryside, featuring formal gardens, a grand entrance hall, and numerous rooms for both leisure and service.",
    "institution": "Country house estate (Manor house)",
    "weather": "Overcast with intermittent rain, creating a moody ambiance."
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
    "id": "actual_time_of_death",
    "value": "twenty minutes past twelve",
    "description": "The true time of the victim’s death"
  },
  {
    "id": "chime_time",
    "value": "midnight",
    "description": "The time of the clock’s last chime before being tampered with"
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
      "pointsTo": "Indicates the time displayed by the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "Witnesses recall hearing the specific chime at the actual time of death.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Contradicts the clock's indication of time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she was seen at the theater during the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "Excludes her as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "This indicates the time of death is potentially misrepresented.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Challenges the assumption of the clock's accuracy.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "A scratch on the clock's winding mechanism suggests tampering.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Indicates possible interference with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "This indicates that someone altered the clock prior to the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Supports the theory of clock tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "By comparing the clock's altered time with the actual time of death documented by witnesses, it will reveal discrepancies.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Highlights the need for further investigation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "behavioral",
      "description": "Captain Ivor Hale was seen lingering near the clock shortly before the murder.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "Suggests possible premeditation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was attending a medical conference at the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Excludes him as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "Clock tampering creates a false timeline of events.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Reveals the core mechanism of the crime.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "physical",
      "description": "Wear on the study door handle indicates recent use.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "Suggests someone entered or exited the study recently.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "behavioral",
      "description": "Captain Ivor Hale has a history of financial difficulties.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "Indicates possible motive for the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she has corroborated evidence of her whereabouts at the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "Further narrows the focus toward Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_11",
      "category": "temporal",
      "description": "The clock shows ten ten in the evening while the victim's time of death is later.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Indicates a discrepancy in the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "temporal",
      "description": "Witnesses report seeing the victim alive at a later time than indicated by the clock.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "Challenges the clock's accuracy.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "category": "temporal",
      "description": "Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Witness statements remains a late texture detail in the case background.",
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
      "description": "A scratch on the clock's winding mechanism suggests tampering.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This indicates that someone altered the clock prior to the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The clock has always been reliable, which suggests the murder must have occurred at the time indicated by the clock.",
      "supportsAssumption": "The murder must have occurred at the time indicated by the clock.",
      "misdirection": "This overlooks the possibility of tampering."
    },
    {
      "id": "rh_2",
      "description": "Several guests reported seeing the clock working perfectly just before the murder.",
      "supportsAssumption": "The murder must have occurred at the time indicated by the clock.",
      "misdirection": "This does not account for potential post-tampering."
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
      "clue_7"
    ],
    "mid": [
      "clue_core_elimination_chain",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_11",
      "clue_12",
      "clue_culprit_direct_captain_ivor_hale",
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
  "latencyMs": 17476,
  "cost": 0.0015742369499999998
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
